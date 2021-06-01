<template>
  <div id="app">
    <WorldWideTelescope
      wwt-namespace="wwt-research"
    ></WorldWideTelescope>

    <transition name="fade">
      <div id="overlays">
        <p>{{ coordText }}</p>
      </div>
    </transition>

    <ul id="controls">
      <li v-show="showToolMenu">
        <v-popover placement="left">
          <font-awesome-icon class="tooltip-target" icon="sliders-h" size="lg"></font-awesome-icon>
          <template slot="popover">
            <ul class="tooltip-content tool-menu">
              <li v-show="showCrossfader"><a href="#" v-close-popover @click="selectTool('crossfade')"><font-awesome-icon icon="adjust" /> Crossfade</a></li>
            </ul>
          </template>
        </v-popover>
      </li>
      <li v-show="!wwtIsTourPlaying">
        <font-awesome-icon icon="search-plus" size="lg" @click="doZoom(true)"></font-awesome-icon>
      </li>
      <li v-show="!wwtIsTourPlaying">
        <font-awesome-icon icon="search-minus" size="lg" @click="doZoom(false)"></font-awesome-icon>
      </li>
      <li v-show="fullscreenAvailable">
        <font-awesome-icon v-bind:icon="fullscreenModeActive ? 'compress' : 'expand'"
          size="lg" class="nudgeright1" @click="toggleFullscreen()"></font-awesome-icon>
      </li>
    </ul>

    <div id="tools">
      <div class="tool-container">
      <template v-if="currentTool == 'crossfade'">
        <span>Foreground opacity:</span> <input class="opacity-range" type="range" v-model="foregroundOpacity">
      </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import * as moment from "moment";
import * as screenfull from "screenfull";
import { Component, Prop, Watch } from "vue-property-decorator";
import { fmtDegLat, fmtDegLon, fmtHours } from "@wwtelescope/astro";

import {
  ImageSetType,
  SolarSystemObjects,
} from "@wwtelescope/engine-types";

import {
  Annotation,
  Circle,
  ImageSetLayer,
  ImageSetLayerSetting,
  Poly,
  PolyLine,
  SpreadSheetLayer,
} from "@wwtelescope/engine";

import {
  applyCircleAnnotationSetting,
  applyPolyAnnotationSetting,
  applyPolyLineAnnotationSetting,
  isCircleAnnotationSetting,
  isEngineSetting,
  isImageSetLayerSetting,
  isPolyAnnotationSetting,
  isPolyLineAnnotationSetting,
} from "@wwtelescope/engine-helpers";

import { WWTAwareComponent } from "@wwtelescope/engine-vuex";

import { classicPywwt, ViewStateMessage } from "@wwtelescope/research-app-messages";

import { convertPywwtSpreadSheetLayerSetting } from "./settings";

const D2R = Math.PI / 180.0;
const R2D = 180.0 / Math.PI;

type ToolType = "crossfade" | null;

type AnyFitsLayerMessage =
  classicPywwt.CreateImageSetLayerMessage |
  classicPywwt.SetFitsLayerColormapMessage |
  classicPywwt.StretchFitsLayerMessage |
  classicPywwt.ModifyFitsLayerMessage |
  classicPywwt.RemoveImageSetLayerMessage;

/** Helper for handling messages that mutate FITS / ImageSet layers. Because
 * FITS loading is asynchronous, and messages might arrive out of order, we need
 * some logic to smooth everything out.
 */
class ImageSetLayerMessageHandler {
  private owner: App;
  private created = false;
  private internalId: string | null = null;
  private colormapVersion = -1;
  private stretchVersion = -1;
  private queuedStretch: classicPywwt.StretchFitsLayerMessage | null = null;
  private queuedColormap: classicPywwt.SetFitsLayerColormapMessage | null = null;
  private queuedSettings: ImageSetLayerSetting[] = [];
  private queuedRemoval: classicPywwt.RemoveImageSetLayerMessage | null = null;

  constructor(owner: App) {
    this.owner = owner;
  }

  handleCreateMessage(msg: classicPywwt.CreateImageSetLayerMessage) {
    if (this.created) {
      return;
    }

    const mode = msg.mode || "autodetect";
    this.owner.addImageSetLayer({
      url: msg.url,
      mode: mode,
      name: msg.id,
      gotoTarget: true, // pywwt expected behavior
    }).then((layer) => this.layerInitialized(layer));

    this.created = true;
  }

  private layerInitialized(layer: ImageSetLayer) {
    this.internalId = layer.id.toString();

    if (this.queuedStretch !== null) {
      this.handleStretchMessage(this.queuedStretch);
      this.queuedStretch = null;
    }

    if (this.queuedColormap !== null) {
      this.handleSetColormapMessage(this.queuedColormap);
      this.queuedColormap = null;
    }

    this.owner.applyFitsLayerSettings({
      id: this.internalId,
      settings: this.queuedSettings,
    });
    this.queuedSettings = [];

    if (this.queuedRemoval !== null) {
      this.handleRemoveMessage(this.queuedRemoval);
      this.queuedRemoval = null;
    }
  }

  handleStretchMessage(msg: classicPywwt.StretchFitsLayerMessage) {
    if (this.internalId === null) {
      // Layer not yet created or fully initialized. Queue up message for processing
      // once it's ready.
      if (this.queuedStretch === null || msg.version > this.queuedStretch.version) {
        this.queuedStretch = msg;
      }
    } else {
      if (msg.version > this.stretchVersion) {
        this.owner.stretchFitsLayer({
          id: this.internalId,
          stretch: msg.stretch,
          vmin: msg.vmin,
          vmax: msg.vmax,
        });
        this.stretchVersion = msg.version;
      }
    }
  }

  handleSetColormapMessage(msg: classicPywwt.SetFitsLayerColormapMessage) {
    if (this.internalId === null) {
      // Layer not yet created or fully initialized. Queue up message for processing
      // once it's ready.
      if (this.queuedColormap === null || msg.version > this.queuedColormap.version) {
        this.queuedColormap = msg;
      }
    } else {
      if (msg.version > this.colormapVersion) {
        this.owner.setFitsLayerColormap({
          id: this.internalId,
          name: msg.cmap,
        });
        this.colormapVersion = msg.version;
      }
    }
  }

  handleModifyMessage(msg: classicPywwt.ModifyFitsLayerMessage) {
    const setting: [string, any] = [msg.setting, msg.value];  // eslint-disable-line @typescript-eslint/no-explicit-any

    if (!isImageSetLayerSetting(setting)) {
      return;
    }

    if (this.internalId === null) {
      // Layer not yet created or fully initialized. Queue up message for processing
      // once it's ready.
      this.queuedSettings.push(setting);
    } else {
      this.owner.applyFitsLayerSettings({
        id: this.internalId,
        settings: [setting],
      });
    }
  }

  handleRemoveMessage(msg: classicPywwt.RemoveImageSetLayerMessage) {
    if (this.internalId === null) {
      // Layer not yet created or fully initialized. Queue up message for processing
      // once it's ready.
      if (this.queuedRemoval === null) {
        this.queuedRemoval = msg;
      }
    } else {
      this.owner.deleteLayer(this.internalId);
      this.internalId = null;
      this.created = false;
    }
  }
}

type AnyTableLayerMessage =
  classicPywwt.CreateTableLayerMessage |
  classicPywwt.UpdateTableLayerMessage |
  classicPywwt.ModifyTableLayerMessage |
  classicPywwt.RemoveTableLayerMessage;

/** Helper for handling messages that mutate tabular / "spreadsheet" layers. */
class TableLayerMessageHandler {
  private owner: App;
  private created = false;
  private internalId: string | null = null;
  private layer: SpreadSheetLayer | null = null; // hack for settings
  private queuedUpdate: classicPywwt.UpdateTableLayerMessage | null = null;
  private queuedSettings: classicPywwt.PywwtSpreadSheetLayerSetting[] = [];
  private queuedRemoval: classicPywwt.RemoveTableLayerMessage | null = null;

  constructor(owner: App) {
    this.owner = owner;
  }

  handleCreateMessage(msg: classicPywwt.CreateTableLayerMessage) {
    if (this.created)
      return;

    const data = atob(msg.table);

    this.owner.createTableLayer({
      name: msg.id,
      referenceFrame: msg.frame,
      dataCsv: data,
    }).then((layer) => this.layerInitialized(layer));

    this.created = true;
  }

  private layerInitialized(layer: SpreadSheetLayer) {
    this.internalId = layer.id.toString();
    this.layer = layer;

    if (this.queuedUpdate !== null) {
      this.handleUpdateMessage(this.queuedUpdate);
      this.queuedUpdate = null;
    }

    // Settings need transformation from the pywwt JSON "wire protocol" to
    // what's used internally by the engine and our surrounding TypeScript
    // infrastructure. They're close, but some mapping is needed.

    const settings = [];

    for (const ps of this.queuedSettings) {
      const es = convertPywwtSpreadSheetLayerSetting(ps, layer);
      if (es !== null) {
        settings.push(es);
      }
    }

    this.owner.applyTableLayerSettings({
      id: this.internalId,
      settings,
    });
    this.queuedSettings = [];

    if (this.queuedRemoval !== null) {
      this.handleRemoveMessage(this.queuedRemoval);
      this.queuedRemoval = null;
    }
  }

  handleUpdateMessage(msg: classicPywwt.UpdateTableLayerMessage) {
    if (this.internalId === null) {
      // Layer not yet created or fully initialized. Queue up message for processing
      // once it's ready.
      this.queuedUpdate = msg;
    } else {
      this.owner.updateTableLayer({
        id: this.internalId,
        dataCsv: atob(msg.table),
      });
    }
  }

  handleModifyMessage(msg: classicPywwt.ModifyTableLayerMessage) {
    // The messages sent by pywwt here do not map directly into internal WWT
    // settings - they are more transport-friendly versions, as expressed in the
    // PywwtSpreadSheetLayerSetting type.

    const setting: [string, any] = [msg.setting, msg.value];  // eslint-disable-line @typescript-eslint/no-explicit-any

    if (!classicPywwt.isPywwtSpreadSheetLayerSetting(setting)) {
      return;
    }

    // This `if` statement is over-conservative to make TypeScript happy:
    if (this.layer === null || this.internalId === null) {
      // Layer not yet created or fully initialized. Queue up message for processing
      // once it's ready.
      this.queuedSettings.push(setting);
    } else {
      const es = convertPywwtSpreadSheetLayerSetting(setting, this.layer);
      if (es !== null) {
        this.owner.applyTableLayerSettings({
          id: this.internalId,
          settings: [es],
        });
      }
    }
  }

  handleRemoveMessage(msg: classicPywwt.RemoveTableLayerMessage) {
    if (this.internalId === null) {
      // Layer not yet created or fully initialized. Queue up message for processing
      // once it's ready.
      if (this.queuedRemoval === null) {
        this.queuedRemoval = msg;
      }
    } else {
      this.owner.deleteLayer(this.internalId);
      this.internalId = null;
      this.created = false;
    }
  }
}


type AnyAnnotationMessage =
  classicPywwt.AddLinePointMessage |
  classicPywwt.AddPolygonPointMessage |
  classicPywwt.CreateAnnotationMessage |
  classicPywwt.ModifyAnnotationMessage |
  classicPywwt.RemoveAnnotationMessage |
  classicPywwt.SetCircleCenterMessage;

/** Helper for handling messages that mutate annotations. These are actually
 * much simpler to deal with than image or data layers, but it doesn't hurt
 * to use the same sort of design.
 */
class AnnotationMessageHandler {
  private owner: App;
  private ann: Annotation;

  public static tryCreate(owner: App, msg: classicPywwt.CreateAnnotationMessage): AnnotationMessageHandler | null {
    // defaults here track pywwt's
    if (msg.shape == 'circle') {
      const circ = new Circle();
      circ.set_fill(false);
      circ.set_skyRelative(true);
      circ.setCenter(owner.wwtRARad * R2D, owner.wwtDecRad * R2D);
      return new AnnotationMessageHandler(owner, circ, msg.id);
    } else if (msg.shape == 'polygon') {
      const poly = new Poly();
      poly.set_fill(false);
      return new AnnotationMessageHandler(owner, poly, msg.id);
    } else if (msg.shape == 'line') {
      return new AnnotationMessageHandler(owner, new PolyLine(), msg.id);
    }

    return null;
  }

  private constructor(owner: App, ann: Annotation, id: string) {
    this.owner = owner;
    this.ann = ann;
    ann.set_id(id);
    owner.addAnnotation(ann);
  }

  handleModifyAnnotationMessage(msg: classicPywwt.ModifyAnnotationMessage) {
    const setting: [string, any] = [msg.setting, msg.value];  // eslint-disable-line @typescript-eslint/no-explicit-any

    if (this.ann instanceof Circle && isCircleAnnotationSetting(setting)) {
      applyCircleAnnotationSetting(this.ann, setting);
    } else if (this.ann instanceof Poly && isPolyAnnotationSetting(setting)) {
      applyPolyAnnotationSetting(this.ann, setting);
    } else if (this.ann instanceof PolyLine && isPolyLineAnnotationSetting(setting)) {
      applyPolyLineAnnotationSetting(this.ann, setting);
    }
  }

  handleRemoveAnnotationMessage(_msg: classicPywwt.RemoveAnnotationMessage) {
    this.owner.removeAnnotation(this.ann);
  }

  handleSetCircleCenterMessage(msg: classicPywwt.SetCircleCenterMessage) {
    if (this.ann instanceof Circle) {
      this.ann.setCenter(msg.ra, msg.dec);
    }
  }

  handleAddLinePointMessage(msg: classicPywwt.AddLinePointMessage) {
    if (this.ann instanceof PolyLine) {
      this.ann.addPoint(msg.ra, msg.dec);
    }
  }

  handleAddPolygonPointMessage(msg: classicPywwt.AddPolygonPointMessage) {
    if (this.ann instanceof Poly) {
      this.ann.addPoint(msg.ra, msg.dec);
    }
  }
}

class KeyPressInfo {
  code: string;
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  meta: boolean;

  constructor(code: string, modifiers?: { ctrl?: boolean; alt?: boolean; shift?: boolean; meta?: boolean } ) {
    this.code = code;
    this.ctrl = modifiers?.ctrl ?? false;
    this.alt = modifiers?.alt ?? false;
    this.shift = modifiers?.shift ?? false;
    this.meta = modifiers?.meta ?? false;
  }

  matches(event: KeyboardEvent): boolean {
    return event.code === this.code
        && event.ctrlKey === this.ctrl
        && event.altKey === this.alt
        && event.shiftKey === this.shift
        && event.metaKey === this.meta;
  }
}

/** This simple class encapsulates how we handle key bindings */
class KeyboardControlSettings {
  zoomIn: KeyPressInfo[];
  zoomOut: KeyPressInfo[];
  moveUp: KeyPressInfo[];
  moveDown: KeyPressInfo[];
  moveLeft: KeyPressInfo[];
  moveRight: KeyPressInfo[];
  tiltUp: KeyPressInfo[];
  tiltDown: KeyPressInfo[];
  tiltLeft: KeyPressInfo[];
  tiltRight: KeyPressInfo[];
  bigMoveUp: KeyPressInfo[];
  bigMoveDown: KeyPressInfo[];
  bigMoveLeft: KeyPressInfo[];
  bigMoveRight: KeyPressInfo[];
  moveAmount: number;
  tiltAmount: number;
  bigMoveFactor: number;

  constructor({
    zoomIn = [
      new KeyPressInfo("KeyZ"),
      new KeyPressInfo("PageUp"),
    ],
    zoomOut = [
      new KeyPressInfo("KeyX"),
      new KeyPressInfo("PageDown"),
    ],
    moveUp = [
      new KeyPressInfo("KeyI"),
      new KeyPressInfo("ArrowUp"),
    ],
    moveDown = [
      new KeyPressInfo("KeyK"),
      new KeyPressInfo("ArrowDown"),
    ],
    moveLeft = [
      new KeyPressInfo("KeyJ"),
      new KeyPressInfo("ArrowLeft"),
    ],
    moveRight = [
      new KeyPressInfo("KeyL"),
      new KeyPressInfo("ArrowRight"),
    ],
    tiltUp = [
      new KeyPressInfo("KeyI", { alt: true }),
      new KeyPressInfo("ArrowUp", { alt: true }),
    ],
    tiltDown = [
      new KeyPressInfo("KeyK", { alt: true }),
      new KeyPressInfo("ArrowDown", { alt: true }),
    ],
    tiltLeft = [
      new KeyPressInfo("KeyJ", { alt: true }),
      new KeyPressInfo("ArrowLeft", { alt: true }),
    ],
    tiltRight = [
      new KeyPressInfo("KeyL", { alt: true }),
      new KeyPressInfo("ArrowRight", { alt: true }),
    ],
    bigMoveUp = [
      new KeyPressInfo("KeyI", { shift: true }),
      new KeyPressInfo("ArrowUp", { shift: true }),
    ],
    bigMoveDown = [
      new KeyPressInfo("KeyK", { shift: true }),
      new KeyPressInfo("ArrowDown", { shift: true }),
    ],
    bigMoveLeft = [
      new KeyPressInfo("KeyJ", { shift: true }),
      new KeyPressInfo("ArrowLeft", { shift: true }),
    ],
    bigMoveRight = [
      new KeyPressInfo("KeyL", { shift: true }),
      new KeyPressInfo("ArrowRight", { shift: true }),
    ],
    moveAmount = 20,
    tiltAmount = 20,
    bigMoveFactor = 6,
  }) {
    this.zoomIn = zoomIn;
    this.zoomOut = zoomOut;
    this.moveUp = moveUp;
    this.moveDown = moveDown;
    this.moveLeft = moveLeft;
    this.moveRight = moveRight;
    this.tiltUp = tiltUp;
    this.tiltDown = tiltDown;
    this.tiltLeft = tiltLeft;
    this.tiltRight = tiltRight;
    this.bigMoveUp = bigMoveUp;
    this.bigMoveDown = bigMoveDown;
    this.bigMoveLeft = bigMoveLeft;
    this.bigMoveRight = bigMoveRight;
    this.moveAmount = moveAmount;
    this.tiltAmount = tiltAmount;
    this.bigMoveFactor = bigMoveFactor;
  }

  // This is to make sure that we can't make a listener for an action type that doesn't exist
  readonly actionTypes = [
    "zoomIn",
    "zoomOut",
    "moveUp",
    "moveDown",
    "moveLeft",
    "moveRight",
    "tiltUp",
    "tiltDown",
    "tiltLeft",
    "tiltRight",
    "bigMoveUp",
    "bigMoveDown",
    "bigMoveLeft",
    "bigMoveRight",
  ] as const;

  makeListener(actionName: KeyboardControlSettings["actionTypes"][number], action: () => void): (e: KeyboardEvent) => void {
    return (e) => {
      for (const keyPress of this[actionName]) {
        if (keyPress.matches(e)) {
          action();
        }
      }
    }
  }
}


/** The main "research app" Vue component. */
@Component
export default class App extends WWTAwareComponent {
  @Prop({default: null}) readonly allowedOrigin!: string | null;

  @Prop({default: () => new KeyboardControlSettings({})}) private _kcs!: KeyboardControlSettings;

  // Lifecycle management

  created() {
    this.statusMessageDestination = null;
  }

  mounted() {
    if (screenfull.isEnabled) {
      screenfull.on('change', this.onFullscreenEvent);
    }

    // For now let's just not worry about removing this listener ...
    window.addEventListener('message', (event) => {
      if (this.allowedOrigin !== null && event.origin == this.allowedOrigin) {
        // You could imagine wanting to send status updates to multiple
        // destinations, but let's start simple. TypeScript currently requires
        // us to do an odd type guard here.
        if (this.statusMessageDestination === null) {
          if (!(event.source instanceof MessagePort) && !(event.source instanceof ServiceWorker)) {
            this.statusMessageDestination = event.source;
            // Hardcode the status update rate to max out at 5 Hz.
            this.updateIntervalId = window.setInterval(() => this.maybeUpdateStatus(), 200);
          }
        }

        this.onMessage(event.data);
      }
    }, false);

    // Handling key presses

    window.addEventListener('keydown', this._kcs.makeListener("zoomIn", () => this.doZoom(true)));
    window.addEventListener('keydown', this._kcs.makeListener("zoomOut", () => this.doZoom(false)));
    window.addEventListener('keydown', this._kcs.makeListener("moveUp", () => this.doMove(0, this._kcs.moveAmount)));
    window.addEventListener('keydown', this._kcs.makeListener("moveDown", () => this.doMove(0, -this._kcs.moveAmount)));
    window.addEventListener('keydown', this._kcs.makeListener("moveLeft", () => this.doMove(this._kcs.moveAmount, 0)));
    window.addEventListener('keydown', this._kcs.makeListener("moveRight", () => this.doMove(-this._kcs.moveAmount, 0)));
    window.addEventListener('keydown', this._kcs.makeListener("tiltLeft", () => this.doTilt(this._kcs.tiltAmount, 0)));
    window.addEventListener('keydown', this._kcs.makeListener("tiltRight", () => this.doTilt(-this._kcs.tiltAmount, 0)));
    window.addEventListener('keydown', this._kcs.makeListener("tiltUp", () => this.doTilt(0, this._kcs.tiltAmount)));
    window.addEventListener('keydown', this._kcs.makeListener("tiltDown", () => this.doTilt(0, -this._kcs.tiltAmount)));
    window.addEventListener('keydown', this._kcs.makeListener("bigMoveUp", () => this.doMove(0, this._kcs.bigMoveFactor * this._kcs.moveAmount)));
    window.addEventListener('keydown', this._kcs.makeListener("bigMoveDown", () => this.doMove(0, this._kcs.bigMoveFactor * -this._kcs.moveAmount)));
    window.addEventListener('keydown', this._kcs.makeListener("bigMoveLeft", () => this.doMove(this._kcs.bigMoveFactor * this._kcs.moveAmount, 0)));
    window.addEventListener('keydown', this._kcs.makeListener("bigMoveRight", () => this.doMove(this._kcs.bigMoveFactor * -this._kcs.moveAmount, 0)));
  }

  destroyed() {
    if (screenfull.isEnabled) {
      screenfull.off('change', this.onFullscreenEvent);
    }

    if (this.updateIntervalId !== null) {
      window.clearInterval(this.updateIntervalId);
      this.updateIntervalId = null;
    }
  }

  // Incoming message handling

  onMessage(msg: any) {  // eslint-disable-line @typescript-eslint/no-explicit-any
    if (classicPywwt.isLoadImageCollectionMessage(msg)) {
      this.loadImageCollection({ url: msg.url, loadChildFolders: msg.loadChildFolders });
    } else if (classicPywwt.isSetBackgroundByNameMessage(msg)) {
      this.setBackgroundImageByName(msg.name);
    } else if (classicPywwt.isSetForegroundByNameMessage(msg)) {
      this.setForegroundImageByName(msg.name);
    } else if (classicPywwt.isSetViewerModeMessage(msg)) {
      this.setBackgroundImageByName(msg.mode);
      this.setForegroundImageByName(msg.mode);
    } else if (classicPywwt.isSetForegroundOpacityMessage(msg)) {
      this.setForegroundOpacity(msg.value);
    } else if (classicPywwt.isCenterOnCoordinatesMessage(msg)) {
      const rollRad = msg.roll == undefined ? undefined : msg.roll * D2R;
      this.gotoRADecZoom({
        raRad: msg.ra * D2R,
        decRad: msg.dec * D2R,
        zoomDeg: msg.fov * 6,
        instant: msg.instant,
        rollRad: rollRad,
      });
    } else if (classicPywwt.isModifySettingMessage(msg)) {
      const setting: [string, any] = [msg.setting, msg.value];  // eslint-disable-line @typescript-eslint/no-explicit-any

      if (isEngineSetting(setting)) {
        this.applySetting(setting);
      }
    } else if (classicPywwt.isCreateImageSetLayerMessage(msg)) {
      this.getFitsLayerHandler(msg).handleCreateMessage(msg);
    } else if (classicPywwt.isCreateFitsLayerMessage(msg)) {
      const creatImageSetMessage: classicPywwt.CreateImageSetLayerMessage = {
        event: msg.event,
        url: msg.url,
        id: msg.id,
        mode: "fits",
      }
      this.getFitsLayerHandler(creatImageSetMessage).handleCreateMessage(creatImageSetMessage);
    } else if (classicPywwt.isStretchFitsLayerMessage(msg)) {
      this.getFitsLayerHandler(msg).handleStretchMessage(msg);
    } else if (classicPywwt.isSetFitsLayerColormapMessage(msg)) {
      this.getFitsLayerHandler(msg).handleSetColormapMessage(msg);
    } else if (classicPywwt.isModifyFitsLayerMessage(msg)) {
      this.getFitsLayerHandler(msg).handleModifyMessage(msg);
    } else if (classicPywwt.isRemoveImageSetLayerMessage(msg)) {
      // NB we never remove the handler! It's tricky due to async issues.
      this.getFitsLayerHandler(msg).handleRemoveMessage(msg);
    } else if (classicPywwt.isCreateTableLayerMessage(msg)) {
      this.getTableLayerHandler(msg).handleCreateMessage(msg);
    } else if (classicPywwt.isUpdateTableLayerMessage(msg)) {
      this.getTableLayerHandler(msg).handleUpdateMessage(msg);
    } else if (classicPywwt.isModifyTableLayerMessage(msg)) {
      this.getTableLayerHandler(msg).handleModifyMessage(msg);
    } else if (classicPywwt.isRemoveTableLayerMessage(msg)) {
      // NB we never remove the handler! It's tricky due to async issues.
      this.getTableLayerHandler(msg).handleRemoveMessage(msg);
    } else if (classicPywwt.isCreateAnnotationMessage(msg)) {
      this.createAnnotationHandler(msg);
    } else if (classicPywwt.isModifyAnnotationMessage(msg)) {
      const handler = this.lookupAnnotationHandler(msg);
      if (handler !== undefined) {
        handler.handleModifyAnnotationMessage(msg);
      }
    } else if (classicPywwt.isSetCircleCenterMessage(msg)) {
      const handler = this.lookupAnnotationHandler(msg);
      if (handler !== undefined) {
        handler.handleSetCircleCenterMessage(msg);
      }
    } else if (classicPywwt.isAddLinePointMessage(msg)) {
      const handler = this.lookupAnnotationHandler(msg);
      if (handler !== undefined) {
        handler.handleAddLinePointMessage(msg);
      }
    } else if (classicPywwt.isAddPolygonPointMessage(msg)) {
      const handler = this.lookupAnnotationHandler(msg);
      if (handler !== undefined) {
        handler.handleAddPolygonPointMessage(msg);
      }
    } else if (classicPywwt.isRemoveAnnotationMessage(msg)) {
      const handler = this.lookupAnnotationHandler(msg);
      if (handler !== undefined) {
        handler.handleRemoveAnnotationMessage(msg);
      }
      this.annotations.delete(msg.id);
    } else if (classicPywwt.isClearAnnotationsMessage(msg)) {
      this.clearAnnotations();
    } else if (classicPywwt.isLoadTourMessage(msg)) {
      this.loadTour({
        url: msg.url,
        play: true,
      });
    } else if (classicPywwt.isPauseTourMessage(msg)) {
      this.toggleTourPlayPauseState();  // note half-assed semantics here!
    } else if (classicPywwt.isResumeTourMessage(msg)) {
      this.toggleTourPlayPauseState();  // note half-assed semantics here!
    } else if (classicPywwt.isSetDatetimeMessage(msg)) {
      this.setTime(moment.utc(msg.isot).toDate());
    } else if (classicPywwt.isPauseTimeMessage(msg)) {
      this.setClockSync(false);
    } else if (classicPywwt.isResumeTimeMessage(msg)) {
      this.setClockSync(true);
      this.setClockRate(msg.rate);
    } else if (classicPywwt.isTrackObjectMessage(msg)) {
      if (msg.code in SolarSystemObjects) {
        this.setTrackedObject(msg.code as SolarSystemObjects);
      }
    } else {
      console.warn("WWT research app received unrecognized message, as follows:", msg);
    }
  }

  // Keyed by "external" layer IDs
  private fitsLayers: Map<string, ImageSetLayerMessageHandler> = new Map();

  private getFitsLayerHandler(msg: AnyFitsLayerMessage): ImageSetLayerMessageHandler {
    let handler = this.fitsLayers.get(msg.id);

    if (handler === undefined) {
      handler = new ImageSetLayerMessageHandler(this);
      this.fitsLayers.set(msg.id, handler);
    }

    return handler;
  }

  private tableLayers: Map<string, TableLayerMessageHandler> = new Map();

  private getTableLayerHandler(msg: AnyTableLayerMessage): TableLayerMessageHandler {
    let handler = this.tableLayers.get(msg.id);

    if (handler === undefined) {
      handler = new TableLayerMessageHandler(this);
      this.tableLayers.set(msg.id, handler);
    }

    return handler;
  }

  private annotations: Map<string, AnnotationMessageHandler> = new Map();

  private createAnnotationHandler(msg: classicPywwt.CreateAnnotationMessage): void {
    const handler = AnnotationMessageHandler.tryCreate(this, msg);

    if (handler !== null) {
      this.annotations.set(msg.id, handler);
    }
  }

  private lookupAnnotationHandler(msg: AnyAnnotationMessage): AnnotationMessageHandler | undefined {
    return this.annotations.get(msg.id);
  }

  // Outgoing messages

  updateIntervalId: number | null = null;
  // we need to declare this variable specially to make sure that Vue doesn't
  // try to make it reactive, which would cause it to try to read fields that
  // are prohibited in cross-origin situations:
  private statusMessageDestination!: Window | null;
  lastUpdatedRA = 0.0;
  lastUpdatedDec = 0.0;
  lastUpdatedFov = 1.0;
  lastUpdatedClockRate = 1.0;
  lastUpdatedTimestamp = 0; // `Date.now()` value

  maybeUpdateStatus() {
    if (this.statusMessageDestination === null || this.allowedOrigin === null)
      return;

    const ra = this.wwtRARad;
    const dec = this.wwtDecRad;
    const fov = this.wwtZoomDeg / 6; // WWT convention, zoom = 6*fov
    const clockRate = this.wwtClockRate;

    const needUpdate =
      (ra != this.lastUpdatedRA) ||
      (dec != this.lastUpdatedDec) ||
      (fov != this.lastUpdatedFov) ||
      (clockRate != this.lastUpdatedClockRate) ||
      (Date.now() - this.lastUpdatedTimestamp) > 60000;

    if (!needUpdate)
      return;

    const message: ViewStateMessage = {
      type: "wwt_view_state",
      raRad: ra,
      decRad: dec,
      fovDeg: fov,
      engineClockISOT: this.wwtCurrentTime.toISOString(),
      systemClockISOT: new Date().toISOString(),
      engineClockRateFactor: clockRate,
    };

    // NB: if we start allowing messages to go out to more destinations, we'll
    // need to become smarter about allowedOrigin here.
    this.statusMessageDestination.postMessage(message, this.allowedOrigin);

    this.lastUpdatedRA = ra;
    this.lastUpdatedDec = dec;
    this.lastUpdatedFov = fov;
    this.lastUpdatedClockRate = clockRate;
    this.lastUpdatedTimestamp = Date.now();
  }

  @Watch('wwtClockDiscontinuities')
  onClockDiscontinuitiesChanged(_count: number) {
    // Force a clock update message.
    this.lastUpdatedTimestamp = 0;
  }


  // Fullscreening

  fullscreenModeActive = false;

  get fullscreenAvailable() {
    return screenfull.isEnabled;
  }

  toggleFullscreen() {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  }

  onFullscreenEvent() {
    // NB: we need the isEnabled check to make TypeScript happy even though it
    // is not necesary in practice here.
    if (screenfull.isEnabled) {
      this.fullscreenModeActive = screenfull.isFullscreen;
    }
  }

  // Background / foreground imagesets

  get curBackgroundImagesetName() {
    if (this.wwtBackgroundImageset == null)
      return "";
    return this.wwtBackgroundImageset.get_name();
  }

  set curBackgroundImagesetName(name: string) {
    this.setBackgroundImageByName(name);
  }

  get foregroundOpacity() {
    return this.wwtForegroundOpacity;
  }

  set foregroundOpacity(o: number) {
    this.setForegroundOpacity(o);
  }

  // "Tools" menu

  currentTool: ToolType = null;

  get showCrossfader() {
    if (this.wwtIsTourPlaying)
      return false; // maybe show this if tour player is active but not playing?

    if (this.wwtForegroundImageset == null || this.wwtForegroundImageset === undefined)
      return false;

    return this.wwtForegroundImageset != this.wwtBackgroundImageset;
  }

  get showToolMenu() {
    // This should return true if there are any tools to show.
    return this.showCrossfader;
  }

  selectTool(name: ToolType) {
    if (this.currentTool == name) {
      this.currentTool = null;
    } else {
      this.currentTool = name;
    }
  }

  // Other chrome

  get coordText() {
    if (this.wwtRenderType == ImageSetType.sky) {
      return `${fmtHours(this.wwtRARad)} ${fmtDegLat(this.wwtDecRad)}`;
    }

    return `${fmtDegLon(this.wwtRARad)} ${fmtDegLat(this.wwtDecRad)}`;
  }

  doZoom(zoomIn: boolean) {
    if (zoomIn) {
      this.zoom(1/1.3);
    } else {
      this.zoom(1.3);
    }
  }

  doMove(x: number, y: number) {
    this.move({ x: x, y: y});
  }

  doTilt(x: number, y: number) {
    this.tilt({ x: x, y: y});
  }

}
</script>

<style lang="less">
html {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #000;
}

body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;

  font-family: Verdana, Arial, Helvetica, sans-serif;
}

#app {
  width: 100%;
  height: 100%;
  margin: 0;

  .wwtelescope-component {
    position: relative;
    top: 0;
    width: 100%;
    height: 100%;
    border-style: none;
    border-width: 0;
    margin: 0;
    padding: 0;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

#overlays {
  position: absolute;
  z-index: 10;
  top: 0.5rem;
  left: 0.5rem;
  color: #FFF;

  p {
    margin: 0;
    padding: 0;
    line-height: 1;
  }
}

#controls {
  position: absolute;
  z-index: 10;
  top: 0.5rem;
  right: 0.5rem;
  color: #FFF;

  list-style-type: none;
  margin: 0;
  padding: 0;

  li {
    padding: 3px;
    height: 22px;
    cursor: pointer;

    .nudgeright1 {
      padding-left: 3px;
    }
  }
}

#tools {
  position: absolute;
  z-index: 10;
  bottom: 3rem;
  left: 50%;
  color: #FFF;

  .tool-container {
    position: relative;
    left: -50%;
  }

  .opacity-range {
    width: 50vw;
  }
}

/* Generic v-tooltip CSS derived from: https://github.com/Akryum/v-tooltip#sass--less */

.tooltip {
  display: block !important;
  z-index: 10000;

  .tooltip-inner {
    background: black;
    color: white;
    border-radius: 16px;
    padding: 5px 10px 4px;
  }

  .tooltip-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-color: black;
    z-index: 1;
  }

  &[x-placement^="top"] {
    margin-bottom: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 0 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      bottom: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="bottom"] {
    margin-top: 5px;

    .tooltip-arrow {
      border-width: 0 5px 5px 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-top-color: transparent !important;
      top: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="right"] {
    margin-left: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 5px 0;
      border-left-color: transparent !important;
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
      left: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[x-placement^="left"] {
    margin-right: 5px;

    .tooltip-arrow {
      border-width: 5px 0 5px 5px;
      border-top-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      right: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &.popover {
    .popover-inner {
      background: #f9f9f9;
      color: black;
      padding: 8px;
      border-radius: 5px;
    }

    .popover-arrow {
      border-color: #f9f9f9;
    }
  }

  &[aria-hidden='true'] {
    visibility: hidden;
    opacity: 0;
    transition: opacity .15s, visibility .15s;
  }

  &[aria-hidden='false'] {
    visibility: visible;
    opacity: 1;
    transition: opacity .15s;
  }
}

/* Specialized styling for popups */

ul.tool-menu {
  list-style-type: none;
  margin: 0px;
  padding: 0px;

  li {
    padding: 3px;

    a {
      text-decoration: none;
      color: inherit;
      display: block;
      width: 100%;
    }

    svg.svg-inline--fa {
      width: 1.5em;
    }

    &:hover {
      background-color: #000;
      color: #FFF;
    }
  }
}

</style>
