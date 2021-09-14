<template>
  <div id="app">
    <WorldWideTelescope
      :wwt-namespace="wwtComponentNamespace"
      :class="['wwt', { pointer: this.lastClosePt !== null }]"
      @mousemove.native="wwtOnMouseMove"
      @mouseup.native="wwtOnMouseUp"
      @mousedown.native="wwtOnMouseDown"
    ></WorldWideTelescope>

    <!-- keydown.stops here and below prevent any keynav presses from reaching
      the toplevel UI handlers -->
    <div id="display-panel" v-if="!hideAllChrome" @keydown.stop>
      <transition name="catalog-transition">
        <div id="overlays">
          <p>{{ coordText }}</p>
        </div>
      </transition>
      <div id="imagery-container" v-if="haveImagery">
        <div class="display-section-header">
          <label>Imagery</label>
        </div>
        <imageset-item
          v-for="imageset of activeImagesetLayerStates"
          v-bind:key="imageset.settings.name"
          v-bind:imageset="imageset"
        />
      </div>
      <div id="catalogs-container" v-if="haveCatalogs">
        <div class="display-section-header">
          <label>Catalogs</label>
        </div>
        <catalog-item
          v-for="catalog of hipsCatalogs"
          v-bind:key="catalog.name"
          v-bind:catalog="catalog"
          v-bind:defaultColor="defaultColor"
        />
      </div>
      <div id="sources-container" v-if="haveSources">
        <div class="display-section-header">
          <label>Sources</label>
        </div>
        <source-item
          v-for="source of sources"
          v-bind:key="source.name"
          v-bind:source="source"
        />
      </div>
    </div>

    <ul id="controls" v-if="!hideAllChrome" @keydown.stop>
      <li v-show="showToolMenu">
        <v-popover placement="left" trigger="manual" :open="showPopover">
          <font-awesome-icon
            class="tooltip-target tooltip-icon"
            icon="sliders-h"
            size="lg"
            tabindex="0"
            @keyup.enter="showPopover = !showPopover"
            @click="showPopover = !showPopover"
          ></font-awesome-icon>
          <template slot="popover" tabindex="-1" show="showPopover">
            <ul class="tooltip-content tool-menu" tabindex="-1">
              <li v-show="showBackgroundChooser">
                <a
                  href="#"
                  v-close-popover
                  @click="
                    selectTool('choose-background');
                    showPopover = false;
                  "
                  tabindex="0"
                  ><font-awesome-icon icon="mountain" /> Choose background</a
                >
              </li>
              <li v-show="showAddImageryTool">
                <a
                  href="#"
                  v-close-popover
                  @click="
                    selectTool('add-imagery-layer');
                    showPopover = false;
                  "
                  tabindex="0"
                  ><font-awesome-icon icon="image" /> Add imagery as layer</a
                >
              </li>
              <li v-show="showCatalogTool">
                <a
                  href="#"
                  v-close-popover
                  @click="
                    selectTool('choose-catalog');
                    showPopover = false;
                  "
                  tabindex="0"
                  ><font-awesome-icon icon="map-marked-alt" /> Add HiPS
                  catalogs</a
                >
              </li>
              <li v-show="showCollectionLoader">
                <a
                  href="#"
                  v-close-popover
                  @click="
                    selectTool('load-collection');
                    showPopover = false;
                  "
                  tabindex="0"
                  ><font-awesome-icon icon="photo-video" /> Load WTML
                  collection</a
                >
              </li>
            </ul>
          </template>
        </v-popover>
      </li>
      <li v-show="!wwtIsTourPlaying">
        <font-awesome-icon
          icon="search-plus"
          size="lg"
          class="tooltip-icon"
          @keyup.enter="doZoom(true)"
          @click="doZoom(true)"
          tabindex="0"
        ></font-awesome-icon>
      </li>
      <li v-show="!wwtIsTourPlaying">
        <font-awesome-icon
          icon="search-minus"
          size="lg"
          class="tooltip-icon"
          @keyup.enter="doZoom(false)"
          @click="doZoom(false)"
          tabindex="0"
        ></font-awesome-icon>
      </li>
      <li v-show="fullscreenAvailable">
        <font-awesome-icon
          v-bind:icon="fullscreenModeActive ? 'compress' : 'expand'"
          size="lg"
          class="nudgeright1 tooltip-icon"
          @keyup.enter="toggleFullscreen()"
          @click="toggleFullscreen()"
          tabindex="0"
        ></font-awesome-icon>
      </li>
    </ul>

    <div id="tools" v-if="!hideAllChrome" @keydown.stop>
      <div class="tool-container">
        <template v-if="currentTool == 'crossfade'">
          <span>Foreground opacity:</span>
          <input
            class="opacity-range"
            type="range"
            v-model="foregroundOpacity"
          />
        </template>

        <template v-else-if="currentTool == 'choose-background'">
          <div id="bg-select-container" class="item-select-container">
            <span id="bg-select-title" class="item-select-title"
              >Background imagery:</span
            >
            <v-select
              v-model="curBackgroundImagesetName"
              id="bg-select"
              class="item-selector"
              :searchable="true"
              :clearable="false"
              :options="curAvailableImagesets"
              :filter="filterImagesets"
              :close-on-select="true"
              :reduce="(bg) => bg.name"
              label="name"
              placeholder="Background"
            >
              <template #option="option">
                <div class="item-option">
                  <h4>{{ option.name }}</h4>
                  <em>{{ option.description }}</em>
                </div>
              </template>
              <template #selected-option="option">
                <div>{{ option.name }}</div>
              </template>
            </v-select>
          </div>
        </template>

        <template v-else-if="currentTool == 'add-imagery-layer'">
          <div class="item-select-container">
            <span class="item-select-title">Add imagery layer:</span>
            <v-select
              v-model="imageryToAdd"
              class="item-selector"
              :searchable="true"
              :clearable="false"
              :options="curAvailableImageryData"
              :filter="filterImagesets"
              label="name"
              placeholder="Dataset"
            >
              <template #option="option">
                <div class="item-option">
                  <h4>{{ option.name }}</h4>
                  <em>{{ option.description }}</em>
                </div>
              </template>
              <template #selected-option="option">
                <div>{{ option.name }}</div>
              </template>
              <template #no-options="{ search, searching }">
                <template v-if="searching">
                  No datasets matching <em>{{ search }}</em
                  >.
                </template>
                <em v-else>No datasets available. Load a WTML collection?</em>
              </template>
            </v-select>
          </div>
        </template>

        <template v-else-if="showCatalogChooser">
          <div id="catalog-select-container-tool" class="item-select-container">
            <span class="item-select-title">Add catalog:</span>
            <v-select
              v-model="catalogToAdd"
              id="catalog-select-tool"
              class="item-selector"
              :searchable="true"
              :clearable="false"
              :options="curAvailableCatalogs"
              :filter="filterCatalogs"
              @change="(cat) => addHipsByName(cat.name)"
              label="name"
              placeholder="Catalog"
            >
              <template #option="option">
                <div class="item-option">
                  <h4>{{ option.name }}</h4>
                  <em>{{ option.description }}</em>
                </div>
              </template>
              <template #selected-option-container="">
                <div></div>
              </template>
            </v-select>
          </div>
        </template>

        <template v-else-if="currentTool == 'load-collection'">
          <div class="load-collection-container">
            <div class="load-collection-label">
              Load
              <a
                href="https://docs.worldwidetelescope.org/data-guide/1/data-file-formats/collections/"
                target="_blank"
                >WTML</a
              >
              data collection:
            </div>
            <div class="load-collection-row">
              <label>URL:</label>
              <input
                type="url"
                v-model="wtmlCollectionUrl"
                @keyup.enter="submitWtmlCollectionUrl"
              />
              <font-awesome-icon
                icon="arrow-circle-right"
                size="lg"
                class="load-collection-icon"
                @keyup.enter="submitWtmlCollectionUrl"
                @click="submitWtmlCollectionUrl"
                tabindex="0"
              ></font-awesome-icon>
            </div>
          </div>
        </template>
      </div>
    </div>

    <notifications group="load-collection" position="top right" />

    <div
      id="webgl2-popup"
      v-show="wwtShowWebGl2Warning"
      v-if="!hideAllChrome"
      @keydown.stop
    >
      To get the full AAS WWT experience, consider using the latest version of
      Chrome, Firefox or Edge. In case you would like to use Safari, we
      recommend that you
      <a href="https://discussions.apple.com/thread/8655829">enable WebGL 2.0</a
      >.
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as moment from "moment";
import * as screenfull from "screenfull";
import "vue-select/dist/vue-select.css";
import { debounce } from "debounce";
import { Component, Prop, Watch } from "vue-property-decorator";
import { mapGetters, mapMutations, mapState } from "vuex";

import { distance, fmtDegLat, fmtDegLon, fmtHours } from "@wwtelescope/astro";

import { Source, WWTResearchAppModule } from "./store";
import { wwtEngineNamespace, wwtResearchAppNamespace } from "./namespaces";

import { ImageSetType, SolarSystemObjects } from "@wwtelescope/engine-types";

import {
  Annotation,
  Circle,
  Color,
  Imageset,
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
  extractSpreadSheetLayerSettings,
  isCircleAnnotationSetting,
  isEngineSetting,
  isImageSetLayerSetting,
  isPolyAnnotationSetting,
  isPolyLineAnnotationSetting,
} from "@wwtelescope/engine-helpers";

import { WWTAwareComponent, ImagesetInfo } from "@wwtelescope/engine-vuex";

import {
  classicPywwt,
  isPingPongMessage,
  layers,
  selections,
  settings,
  ApplicationStateMessage,
  ViewStateMessage,
} from "@wwtelescope/research-app-messages";

import {
  convertPywwtSpreadSheetLayerSetting,
  convertSpreadSheetLayerSetting,
} from "./settings";

const D2R = Math.PI / 180.0;
const R2D = 180.0 / Math.PI;

type ToolType =
  | "add-imagery-layer"
  | "choose-background"
  | "choose-catalog"
  | "crossfade"
  | "load-collection"
  | null;

type AnyFitsLayerMessage =
  | classicPywwt.CreateImageSetLayerMessage
  | classicPywwt.SetFitsLayerColormapMessage
  | classicPywwt.SetLayerOrderMessage
  | classicPywwt.StretchFitsLayerMessage
  | classicPywwt.ModifyFitsLayerMessage
  | classicPywwt.RemoveImageSetLayerMessage;

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
  private orderVersion = -1;
  private queuedStretch: classicPywwt.StretchFitsLayerMessage | null = null;
  private queuedColormap: classicPywwt.SetFitsLayerColormapMessage | null =
    null;
  private queuedSettings: ImageSetLayerSetting[] = [];
  private queuedRemoval: classicPywwt.RemoveImageSetLayerMessage | null = null;
  private queuedOrder: classicPywwt.SetLayerOrderMessage | null = null;

  constructor(owner: App) {
    this.owner = owner;
  }

  handleCreateMessage(msg: classicPywwt.CreateImageSetLayerMessage) {
    if (this.created) {
      return;
    }

    const mode = msg.mode || "autodetect";
    // Compatibility with older pywwt requires that if goto(Target) is
    // unspecified, we treat it as true.
    const gotoTarget = msg.goto == undefined ? true : msg.goto;

    this.owner
      .addImageSetLayer({
        url: msg.url,
        mode: mode,
        name: msg.id,
        goto: gotoTarget,
      })
      .then((layer) => this.layerInitialized(layer));

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

  handleSetLayerOrderMessage(msg: classicPywwt.SetLayerOrderMessage) {
    if (this.internalId === null) {
      // Layer not yet created or fully initialized. Queue up message for processing
      // once it's ready.
      if (this.queuedOrder === null || msg.version > this.queuedOrder.version) {
        this.queuedOrder = msg;
      }
    } else {
      if (msg.version > this.orderVersion) {
        this.owner.setImageSetLayerOrder({
          id: this.internalId,
          order: msg.order,
        });
        this.orderVersion = msg.version;
      }
    }
  }

  handleStretchMessage(msg: classicPywwt.StretchFitsLayerMessage) {
    if (this.internalId === null) {
      // Layer not yet created or fully initialized. Queue up message for processing
      // once it's ready.
      if (
        this.queuedStretch === null ||
        msg.version > this.queuedStretch.version
      ) {
        this.queuedStretch = msg;
      }
    } else {
      // TODO: `msg.stretch` is just a number while `stretch` is a typed
      // ScaleTypes enum; TypeScript seems happy but we should validate!
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
      if (
        this.queuedColormap === null ||
        msg.version > this.queuedColormap.version
      ) {
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
    const setting: [string, any] = [msg.setting, msg.value];

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
  | classicPywwt.CreateTableLayerMessage
  | classicPywwt.UpdateTableLayerMessage
  | classicPywwt.ModifyTableLayerMessage
  | classicPywwt.RemoveTableLayerMessage;

/** Helper for handling messages that mutate tabular / "spreadsheet" layers. */
class TableLayerMessageHandler {
  private owner: App;
  private created = false;
  private isHips = false;
  private internalId: string | null = null;
  private layer: SpreadSheetLayer | null = null; // hack for settings
  private imageset: Imageset | null = null; // hack for HiPS catalogs
  private queuedUpdate: classicPywwt.UpdateTableLayerMessage | null = null;
  private queuedSettings: classicPywwt.PywwtSpreadSheetLayerSetting[] = [];
  private queuedRemoval: classicPywwt.RemoveTableLayerMessage | null = null;

  constructor(owner: App) {
    this.owner = owner;
  }

  handleCreateMessage(msg: classicPywwt.CreateTableLayerMessage) {
    if (this.created) return;

    const data = atob(msg.table);

    this.owner
      .createTableLayer({
        name: msg.id,
        referenceFrame: msg.frame,
        dataCsv: data,
      })
      .then((layer) => this.layerInitialized(layer));

    this.created = true;
  }

  setupHipsCatalog(imageset: Imageset, layer: SpreadSheetLayer) {
    this.created = true;
    this.isHips = true;
    this.imageset = imageset;
    this.layerInitialized(layer);
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
      if (!this.isHips) {
        this.owner.updateTableLayer({
          id: this.internalId,
          dataCsv: atob(msg.table),
        });
      }
    }
  }

  handleModifyMessage(msg: classicPywwt.ModifyTableLayerMessage) {
    // The messages sent by pywwt here do not map directly into internal WWT
    // settings - they are more transport-friendly versions, as expressed in the
    // PywwtSpreadSheetLayerSetting type.

    const setting: [string, any] = [msg.setting, msg.value];

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

  async handleGetHipsDataInViewMessage(
    msg: layers.GetHipsCatalogDataInViewMessage
  ): Promise<layers.GetHipsCatalogDataInViewReply | null> {
    if (
      this.imageset === null ||
      this.layer === null ||
      this.internalId === null
    )
      return null; // Sorry!

    if (!this.isHips) return null;

    return this.owner
      .getCatalogHipsDataInView({
        imageset: this.imageset,
        limit: msg.limit,
      })
      .then((info) => {
        return {
          event: "layer_hipscat_datainview_reply",
          threadId: msg.threadId,
          data: info.table,
          aborted: info.aborted,
        };
      });
  }

  handleRemoveMessage(msg: classicPywwt.RemoveTableLayerMessage) {
    if (this.internalId === null) {
      // Layer not yet created or fully initialized. Queue up message for processing
      // once it's ready.
      if (this.queuedRemoval === null) {
        this.queuedRemoval = msg;
      }
    } else {
      if (this.isHips && this.imageset !== null) {
        // This is a little kludgey ...
        const name = this.imageset.get_name();

        for (const cat of this.owner.curAvailableCatalogs) {
          if (cat.name == name) {
            this.owner.removeResearchAppCatalogHips(cat);
            this.owner.removeCatalogHipsByName(name);
          }
        }
      } else {
        this.owner.deleteLayer(this.internalId);
        this.internalId = null;
        this.created = false;
      }
    }
  }
}

type AnyAnnotationMessage =
  | classicPywwt.AddLinePointMessage
  | classicPywwt.AddPolygonPointMessage
  | classicPywwt.CreateAnnotationMessage
  | classicPywwt.ModifyAnnotationMessage
  | classicPywwt.RemoveAnnotationMessage
  | classicPywwt.SetCircleCenterMessage;

/** Helper for handling messages that mutate annotations. These are actually
 * much simpler to deal with than image or data layers, but it doesn't hurt
 * to use the same sort of design.
 */
class AnnotationMessageHandler {
  private owner: App;
  private ann: Annotation;

  public static tryCreate(
    owner: App,
    msg: classicPywwt.CreateAnnotationMessage
  ): AnnotationMessageHandler | null {
    // defaults here track pywwt's
    if (msg.shape == "circle") {
      const circ = new Circle();
      circ.set_fill(false);
      circ.set_skyRelative(true);
      circ.setCenter(owner.wwtRARad * R2D, owner.wwtDecRad * R2D);
      return new AnnotationMessageHandler(owner, circ, msg.id);
    } else if (msg.shape == "polygon") {
      const poly = new Poly();
      poly.set_fill(false);
      return new AnnotationMessageHandler(owner, poly, msg.id);
    } else if (msg.shape == "line") {
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
    const setting: [string, any] = [msg.setting, msg.value];

    if (this.ann instanceof Circle && isCircleAnnotationSetting(setting)) {
      applyCircleAnnotationSetting(this.ann, setting);
    } else if (this.ann instanceof Poly && isPolyAnnotationSetting(setting)) {
      applyPolyAnnotationSetting(this.ann, setting);
    } else if (
      this.ann instanceof PolyLine &&
      isPolyLineAnnotationSetting(setting)
    ) {
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

  constructor(
    code: string,
    modifiers?: {
      ctrl?: boolean;
      alt?: boolean;
      shift?: boolean;
      meta?: boolean;
    }
  ) {
    this.code = code;
    this.ctrl = modifiers?.ctrl ?? false;
    this.alt = modifiers?.alt ?? false;
    this.shift = modifiers?.shift ?? false;
    this.meta = modifiers?.meta ?? false;
  }

  matches(event: KeyboardEvent): boolean {
    return (
      event.code === this.code &&
      event.ctrlKey === this.ctrl &&
      event.altKey === this.alt &&
      event.shiftKey === this.shift &&
      event.metaKey === this.meta
    );
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
    zoomIn = [new KeyPressInfo("KeyZ"), new KeyPressInfo("PageUp")],
    zoomOut = [new KeyPressInfo("KeyX"), new KeyPressInfo("PageDown")],
    moveUp = [new KeyPressInfo("KeyI"), new KeyPressInfo("ArrowUp")],
    moveDown = [new KeyPressInfo("KeyK"), new KeyPressInfo("ArrowDown")],
    moveLeft = [new KeyPressInfo("KeyJ"), new KeyPressInfo("ArrowLeft")],
    moveRight = [new KeyPressInfo("KeyL"), new KeyPressInfo("ArrowRight")],
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

  makeListener(
    actionName: KeyboardControlSettings["actionTypes"][number],
    action: () => void
  ): (e: KeyboardEvent) => void {
    return (e) => {
      for (const keyPress of this[actionName]) {
        if (keyPress.matches(e)) {
          action();
        }
      }
    };
  }
}

interface AngleCoordinates {
  ra: number;
  dec: number;
}

interface RawSourceInfo {
  ra: number;
  dec: number;
  catalogName: string;
  colNames: string[];
  values: string[];
}

/** Get the source of a MessageEvent as a Window, if it is one.
 *
 * The problem here is that on Chrome, if the event is a cross-origin message
 * event, `event.source instanceof Window` returns false even if the source is a
 * window, because that object comes from a different JS context than the one
 * that is currently executing, so its `Window` type is different than ours. On
 * other browsers, or same-origin events, the problem doesn't manifest.
 * Meanwhile, the ServiceWorker type is only defined on HTTPS connections and
 * localhost, so it's sometimes missing.
 *
 * See:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof#instanceof_and_multiple_context_e.g._frames_or_windows
 */
function eventSourceAsWindow(e: MessageEvent): Window | null {
  if (
    !(e.source instanceof MessagePort) &&
    (typeof ServiceWorker === "undefined" ||
      !(e.source instanceof ServiceWorker))
  ) {
    return e.source as Window;
  }

  return null;
}

/** The main "research app" Vue component. */
@Component
export default class App extends WWTAwareComponent {
  @Prop({ default: null }) readonly allowedOrigin!: string | null;
  @Prop({ default: () => new KeyboardControlSettings({}) })
  private _kcs!: KeyboardControlSettings;

  defaultColor = Color.fromArgb(1, 255, 255, 255);
  wwtComponentNamespace = wwtEngineNamespace;
  lastClosePt: RawSourceInfo | null = null;
  lastSelectedSource: Source | null = null;
  distanceThreshold = 0.01;
  hideAllChrome = false;
  hipsUrl = "http://www.worldwidetelescope.org/wwtweb/catalog.aspx?W=hips"; // Temporary
  isMouseMoving = false;

  // From the store
  catalogNameMappings!: { [catalogName: string]: [string, string] };
  hipsCatalogs!: ImagesetInfo[];
  sources!: Source[];

  addResearchAppCatalogHips!: (catalog: ImagesetInfo) => void;
  addSource!: (source: Source) => void;
  removeResearchAppCatalogHips!: (catalog: ImagesetInfo) => void;
  visibleHipsCatalogs!: () => ImagesetInfo[];

  // Lifecycle management

  beforeCreate(): void {
    this.$options.computed = {
      ...mapState(wwtResearchAppNamespace, {
        catalogNameMappings: (state, _getters) =>
          (state as WWTResearchAppModule).catalogNameMappings,
        hipsCatalogs: (state, _getters) =>
          (state as WWTResearchAppModule).hipsCatalogs,
        sources: (state, _getters) => (state as WWTResearchAppModule).sources,
      }),
      ...mapGetters(wwtResearchAppNamespace, ["visibleHipsCatalogs"]),
      ...this.$options.computed,
    };

    this.$options.methods = {
      ...this.$options.methods,
      ...mapMutations(wwtResearchAppNamespace, [
        "addResearchAppCatalogHips",
        "addSource",
        "removeResearchAppCatalogHips",
      ]),
    };
  }

  created() {
    this.statusMessageDestination = null;
    this.initializeHandlers();
  }

  mounted() {
    if (screenfull.isEnabled) {
      screenfull.on("change", this.onFullscreenEvent);
    }

    this.waitForReady().then(() => {
      // This returns a promise but I don't think that we need to wait for that
      // to resolve before going ahead and starting to listen for messages.
      this.loadImageCollection({ url: this.hipsUrl, loadChildFolders: true });

      // Don't start listening for messages until the engine is ready to go.
      // There's no point in returning a "not ready yet" error or anything since
      // the client has to handle the "app isn't yet listening for messages"
      // state anyway.
      //
      // For now let's just not worry about removing this listener ...
      window.addEventListener(
        "message",
        (event) => {
          // We have to be careful with event.source -- see this function's docs.
          const sourceAsWindow = eventSourceAsWindow(event);

          if (
            this.allowedOrigin !== null &&
            event.origin == this.allowedOrigin
          ) {
            // You could imagine wanting to send status updates to multiple
            // destinations, but let's start simple.
            if (this.statusMessageDestination === null) {
              if (sourceAsWindow !== null) {
                this.statusMessageDestination = sourceAsWindow;
                // Hardcode the status update rate to max out at 5 Hz.
                this.updateIntervalId = window.setInterval(
                  () => this.maybeUpdateStatus(),
                  200
                );
              }
            }

            const message = event.data;

            // Special handling for ping-pong to specifically reply to the pinger --
            // one day we should get better about talking to multiple clients.
            if (isPingPongMessage(message)) {
              if (sourceAsWindow !== null) {
                if (message.sessionId !== undefined) {
                  this.statusMessageSessionId = message.sessionId;
                }

                sourceAsWindow.postMessage(message, event.origin);
              } else if (event.source instanceof Window) {
                /* can't-happen, but needed to make TypeScript happy */
              } else if (event.source !== null) {
                event.source.postMessage(message);
              }
            } else {
              this.onMessage(message);
            }
          }
        },
        false
      );
    });

    // Handling key presses
    window.addEventListener(
      "keydown",
      this._kcs.makeListener("zoomIn", () => this.doZoom(true))
    );
    window.addEventListener(
      "keydown",
      this._kcs.makeListener("zoomOut", () => this.doZoom(false))
    );
    window.addEventListener(
      "keydown",
      this._kcs.makeListener("moveUp", () =>
        this.doMove(0, this._kcs.moveAmount)
      )
    );
    window.addEventListener(
      "keydown",
      this._kcs.makeListener("moveDown", () =>
        this.doMove(0, -this._kcs.moveAmount)
      )
    );
    window.addEventListener(
      "keydown",
      this._kcs.makeListener("moveLeft", () =>
        this.doMove(this._kcs.moveAmount, 0)
      )
    );
    window.addEventListener(
      "keydown",
      this._kcs.makeListener("moveRight", () =>
        this.doMove(-this._kcs.moveAmount, 0)
      )
    );
    window.addEventListener(
      "keydown",
      this._kcs.makeListener("tiltLeft", () =>
        this.doTilt(this._kcs.tiltAmount, 0)
      )
    );
    window.addEventListener(
      "keydown",
      this._kcs.makeListener("tiltRight", () =>
        this.doTilt(-this._kcs.tiltAmount, 0)
      )
    );
    window.addEventListener(
      "keydown",
      this._kcs.makeListener("tiltUp", () =>
        this.doTilt(0, this._kcs.tiltAmount)
      )
    );
    window.addEventListener(
      "keydown",
      this._kcs.makeListener("tiltDown", () =>
        this.doTilt(0, -this._kcs.tiltAmount)
      )
    );
    window.addEventListener(
      "keydown",
      this._kcs.makeListener("bigMoveUp", () =>
        this.doMove(0, this._kcs.bigMoveFactor * this._kcs.moveAmount)
      )
    );
    window.addEventListener(
      "keydown",
      this._kcs.makeListener("bigMoveDown", () =>
        this.doMove(0, this._kcs.bigMoveFactor * -this._kcs.moveAmount)
      )
    );
    window.addEventListener(
      "keydown",
      this._kcs.makeListener("bigMoveLeft", () =>
        this.doMove(this._kcs.bigMoveFactor * this._kcs.moveAmount, 0)
      )
    );
    window.addEventListener(
      "keydown",
      this._kcs.makeListener("bigMoveRight", () =>
        this.doMove(this._kcs.bigMoveFactor * -this._kcs.moveAmount, 0)
      )
    );
  }

  destroyed() {
    if (screenfull.isEnabled) {
      screenfull.off("change", this.onFullscreenEvent);
    }

    if (this.updateIntervalId !== null) {
      window.clearInterval(this.updateIntervalId);
      this.updateIntervalId = null;
    }
  }

  // Incoming message handling

  private messageHandlers: Map<string, (msg: any) => boolean> = new Map();

  private initializeHandlers() {
    // These handlers must take care to type-check that the input
    // message actually fully obeys the expected schema!

    this.messageHandlers.set(
      "load_image_collection",
      this.handleLoadImageCollection
    );

    this.messageHandlers.set(
      "set_background_by_name",
      this.handleSetBackgroundByName
    );
    this.messageHandlers.set(
      "set_foreground_by_name",
      this.handleSetForegroundByName
    );
    this.messageHandlers.set(
      "set_foreground_opacity",
      this.handleSetForegroundOpacity
    );
    this.messageHandlers.set("set_viewer_mode", this.handleSetViewerMode);

    this.messageHandlers.set(
      "center_on_coordinates",
      this.handleCenterOnCoordinates
    );
    this.messageHandlers.set("track_object", this.handleTrackObject);
    this.messageHandlers.set("set_datetime", this.handleSetDatetime);
    this.messageHandlers.set("pause_time", this.handlePauseTime);
    this.messageHandlers.set("resume_time", this.handleResumeTime);

    this.messageHandlers.set("modify_settings", this.handleModifySettings);
    this.messageHandlers.set("setting_set", this.handleModifyEngineSetting);

    this.messageHandlers.set(
      "image_layer_create",
      this.handleCreateImageSetLayer
    );
    this.messageHandlers.set("image_layer_order", this.handleSetLayerOrder);
    this.messageHandlers.set(
      "image_layer_stretch",
      this.handleStretchFitsLayer
    );
    this.messageHandlers.set(
      "image_layer_cmap",
      this.handleSetFitsLayerColormap
    );
    this.messageHandlers.set("image_layer_set", this.handleModifyFitsLayer);
    this.messageHandlers.set(
      "image_layer_remove",
      this.handleRemoveImageSetLayer
    );

    this.messageHandlers.set("table_layer_create", this.handleCreateTableLayer);
    this.messageHandlers.set("table_layer_update", this.handleUpdateTableLayer);
    this.messageHandlers.set("table_layer_set", this.handleModifyTableLayer);
    this.messageHandlers.set("table_layer_remove", this.handleRemoveTableLayer);

    this.messageHandlers.set("layer_hipscat_load", this.handleLoadHipsCatalog);
    this.messageHandlers.set(
      "layer_hipscat_datainview",
      this.handleGetHipsCatalogDataInView
    );

    this.messageHandlers.set("annotation_create", this.handleCreateAnnotation);
    this.messageHandlers.set("annotation_set", this.handleModifyAnnotation);
    this.messageHandlers.set("circle_set_center", this.handleSetCircleCenter);
    this.messageHandlers.set("line_add_point", this.handleAddLinePoint);
    this.messageHandlers.set("polygon_add_point", this.handleAddPolygonPoint);
    this.messageHandlers.set("remove_annotation", this.handleRemoveAnnotation);
    this.messageHandlers.set("clear_annotations", this.handleClearAnnotations);

    this.messageHandlers.set("load_tour", this.handleLoadTour);
    this.messageHandlers.set("pause_tour", this.handlePauseTour);
    this.messageHandlers.set("resume_tour", this.handleResumeTour);

    // Ignore incoming view_state messages. When testing the app, you might want
    // to launch it as (e.g.)
    // `http://localhost:8080/?origin=http://localhost:8080/` so that you can
    // manually send it messages using postMessage in the JS console. But in
    // this setup, the app also receives every message that it sends, because
    // its send and receive origins are the same! The resulting "unhandled
    // message" report can actually be useful for examining outgoing messages,
    // but it gets annoying for the view state messages that are sent so
    // frequently. So, ignore those.
    this.messageHandlers.set("wwt_view_state", this.ignoreMessage);
  }

  onMessage(msg: any) {
    const key = String(msg.type || msg.event);
    const handler = this.messageHandlers.get(key);
    let handled = false;

    if (handler !== undefined) {
      handled = handler(msg);
    }

    if (!handled) {
      console.warn(
        "WWT research app received unhandled message, as follows:",
        msg
      );
    }
  }

  private ignoreMessage(_msg: any): boolean {
    return true;
  }

  // Various message handlers that don't comfortably fit elsewhere:

  private handleLoadImageCollection(msg: any): boolean {
    if (!classicPywwt.isLoadImageCollectionMessage(msg)) return false;

    this.loadImageCollection({
      url: msg.url,
      loadChildFolders: msg.loadChildFolders,
    }).then(() => {
      if (this.statusMessageDestination != null && this.allowedOrigin != null) {
        const completedMessage: classicPywwt.LoadImageCollectionCompletedMessage =
          {
            event: "load_image_collection_completed",
            threadId: msg.threadId,
            url: msg.url,
          };

        this.statusMessageDestination.postMessage(
          completedMessage,
          this.allowedOrigin
        );
      }
    });
    return true;
  }

  private handleCenterOnCoordinates(msg: any): boolean {
    if (!classicPywwt.isCenterOnCoordinatesMessage(msg)) return false;

    const rollRad = msg.roll == undefined ? undefined : msg.roll * D2R;
    this.gotoRADecZoom({
      raRad: msg.ra * D2R,
      decRad: msg.dec * D2R,
      zoomDeg: msg.fov * 6,
      instant: msg.instant,
      rollRad: rollRad,
    });
    return true;
  }

  private handleModifyEngineSetting(msg: any): boolean {
    if (!classicPywwt.isModifySettingMessage(msg)) return false;

    const setting: [string, any] = [msg.setting, msg.value];

    if (!isEngineSetting(setting)) return false;

    this.applySetting(setting);
    return true;
  }

  private handleSetDatetime(msg: any): boolean {
    if (!classicPywwt.isSetDatetimeMessage(msg)) return false;

    this.setTime(moment.utc(msg.isot).toDate());
    return true;
  }

  private handlePauseTime(msg: any): boolean {
    if (!classicPywwt.isPauseTimeMessage(msg)) return false;

    this.setClockSync(false);
    return true;
  }

  private handleResumeTime(msg: any): boolean {
    if (!classicPywwt.isResumeTimeMessage(msg)) return false;

    this.setClockSync(true);
    this.setClockRate(msg.rate);
    return true;
  }

  private handleTrackObject(msg: any): boolean {
    if (!classicPywwt.isTrackObjectMessage(msg)) return false;

    if (msg.code in SolarSystemObjects) {
      this.setTrackedObject(msg.code as SolarSystemObjects);
    }
    return true;
  }

  private handleModifySettings(msg: any): boolean {
    const appModified = settings.maybeAsModifiedAppSettings(msg);

    if (appModified !== null) {
      for (const s of appModified) {
        if (s[0] == "hideAllChrome") this.hideAllChrome = s[1];
      }

      return true;
    }

    return false;
  }

  wwtOnMouseMove(event: MouseEvent) {
    if (this.hipsCatalogs.length == 0) {
      return;
    }
    const pt = { x: event.offsetX, y: event.offsetY };
    const raDecDeg = this.findRADecForScreenPoint(pt);
    const raDecRad = { ra: D2R * raDecDeg.ra, dec: D2R * raDecDeg.dec };
    const closestPt = this.closestInView(raDecRad, this.distanceThreshold);
    if (closestPt == null && this.lastClosePt == null) {
      return;
    }
    const needsUpdate =
      closestPt == null ||
      this.lastClosePt == null ||
      this.lastClosePt.ra != closestPt.ra ||
      this.lastClosePt.dec != closestPt.dec;
    if (needsUpdate) {
      this.lastClosePt = closestPt;
    }
    this.isMouseMoving = true;
  }

  wwtOnMouseDown(_event: MouseEvent) {
    this.isMouseMoving = false;
  }

  wwtOnMouseUp(_event: MouseEvent) {
    if (!this.isMouseMoving && this.lastClosePt !== null) {
      const source = this.sourceCreator(this.lastClosePt);
      this.addSource(source);
      this.lastSelectedSource = source;
    }
    this.isMouseMoving = false;
  }

  newSourceName = (function () {
    let count = 0;

    return function () {
      count += 1;
      return `Source ${count}`;
    };
  })();

  nameForSource(catalogData: any, catalogName: string): string {
    for (const [key, [from, to]] of Object.entries(this.catalogNameMappings)) {
      if (from in catalogData && catalogName === key) {
        return `${to}: ${catalogData[from]}`;
      }
    }
    return this.newSourceName();
  }

  sourceCreator(sourceInfo: RawSourceInfo): Source {
    const obj: any = {};
    for (let i = 0; i < sourceInfo.values.length; i++) {
      obj[sourceInfo.colNames[i]] = sourceInfo.values[i];
    }
    return {
      ra: sourceInfo.ra,
      dec: sourceInfo.dec,
      catalogName: sourceInfo.catalogName,
      catalogData: obj,
      name: this.nameForSource(obj, sourceInfo.catalogName),
    };
  }

  // ImageSet layers, including FITS layers:

  // These maps are keyed by "external" layer IDs
  private fitsLayers: Map<string, ImageSetLayerMessageHandler> = new Map();

  private getFitsLayerHandler(
    msg: AnyFitsLayerMessage
  ): ImageSetLayerMessageHandler {
    let handler = this.fitsLayers.get(msg.id);

    if (handler === undefined) {
      handler = new ImageSetLayerMessageHandler(this);
      this.fitsLayers.set(msg.id, handler);
    }

    return handler;
  }

  private handleCreateImageSetLayer(msg: any): boolean {
    if (classicPywwt.isCreateFitsLayerMessage(msg)) {
      const createImageSetMessage: classicPywwt.CreateImageSetLayerMessage = {
        event: msg.event,
        url: msg.url,
        id: msg.id,
        mode: "fits",
      };
      this.getFitsLayerHandler(createImageSetMessage).handleCreateMessage(
        createImageSetMessage
      );
      return true;
    }

    if (classicPywwt.isCreateImageSetLayerMessage(msg)) {
      this.getFitsLayerHandler(msg).handleCreateMessage(msg);
      return true;
    }

    return false;
  }

  private handleSetLayerOrder(msg: any): boolean {
    if (!classicPywwt.isSetLayerOrderMessage(msg)) return false;

    this.getFitsLayerHandler(msg).handleSetLayerOrderMessage(msg);
    return true;
  }

  private handleStretchFitsLayer(msg: any): boolean {
    if (!classicPywwt.isStretchFitsLayerMessage(msg)) return false;

    this.getFitsLayerHandler(msg).handleStretchMessage(msg);
    return true;
  }

  private handleSetFitsLayerColormap(msg: any): boolean {
    if (!classicPywwt.isSetFitsLayerColormapMessage(msg)) return false;

    this.getFitsLayerHandler(msg).handleSetColormapMessage(msg);
    return true;
  }

  private handleModifyFitsLayer(msg: any): boolean {
    if (!classicPywwt.isModifyFitsLayerMessage(msg)) return false;

    this.getFitsLayerHandler(msg).handleModifyMessage(msg);
    return true;
  }

  private handleRemoveImageSetLayer(msg: any): boolean {
    if (!classicPywwt.isRemoveImageSetLayerMessage(msg)) return false;

    // NB we never remove the handler! It's tricky due to async issues.
    this.getFitsLayerHandler(msg).handleRemoveMessage(msg);
    return true;
  }

  // Table layers:

  private tableLayers: Map<string, TableLayerMessageHandler> = new Map();

  private getTableLayerHandler(
    msg: AnyTableLayerMessage
  ): TableLayerMessageHandler {
    let handler = this.tableLayers.get(msg.id);

    if (handler === undefined) {
      handler = new TableLayerMessageHandler(this);
      this.tableLayers.set(msg.id, handler);
    }

    return handler;
  }

  private handleCreateTableLayer(msg: any): boolean {
    if (!classicPywwt.isCreateTableLayerMessage(msg)) return false;

    this.getTableLayerHandler(msg).handleCreateMessage(msg);
    return true;
  }

  private handleUpdateTableLayer(msg: any): boolean {
    if (!classicPywwt.isUpdateTableLayerMessage(msg)) return false;

    this.getTableLayerHandler(msg).handleUpdateMessage(msg);
    return true;
  }

  private handleModifyTableLayer(msg: any): boolean {
    if (!classicPywwt.isModifyTableLayerMessage(msg)) return false;

    this.getTableLayerHandler(msg).handleModifyMessage(msg);
    return true;
  }

  private handleRemoveTableLayer(msg: any): boolean {
    if (!classicPywwt.isRemoveTableLayerMessage(msg)) return false;

    // NB we never remove the handler! It's tricky due to async issues.
    this.getTableLayerHandler(msg).handleRemoveMessage(msg);
    return true;
  }

  // Annotations:

  private annotations: Map<string, AnnotationMessageHandler> = new Map();

  private createAnnotationHandler(
    msg: classicPywwt.CreateAnnotationMessage
  ): void {
    const handler = AnnotationMessageHandler.tryCreate(this, msg);

    if (handler !== null) {
      this.annotations.set(msg.id, handler);
    }
  }

  private lookupAnnotationHandler(
    msg: AnyAnnotationMessage
  ): AnnotationMessageHandler | undefined {
    return this.annotations.get(msg.id);
  }

  private handleCreateAnnotation(msg: any): boolean {
    if (!classicPywwt.isCreateAnnotationMessage(msg)) return false;

    this.createAnnotationHandler(msg);
    return true;
  }

  private handleModifyAnnotation(msg: any): boolean {
    if (!classicPywwt.isModifyAnnotationMessage(msg)) return false;

    const handler = this.lookupAnnotationHandler(msg);
    if (handler !== undefined) {
      handler.handleModifyAnnotationMessage(msg);
    }
    return true;
  }

  private handleSetCircleCenter(msg: any): boolean {
    if (!classicPywwt.isSetCircleCenterMessage(msg)) return false;

    const handler = this.lookupAnnotationHandler(msg);
    if (handler !== undefined) {
      handler.handleSetCircleCenterMessage(msg);
    }
    return true;
  }

  private handleAddLinePoint(msg: any): boolean {
    if (!classicPywwt.isAddLinePointMessage(msg)) return false;

    const handler = this.lookupAnnotationHandler(msg);
    if (handler !== undefined) {
      handler.handleAddLinePointMessage(msg);
    }
    return true;
  }

  private handleAddPolygonPoint(msg: any): boolean {
    if (!classicPywwt.isAddPolygonPointMessage(msg)) return false;

    const handler = this.lookupAnnotationHandler(msg);
    if (handler !== undefined) {
      handler.handleAddPolygonPointMessage(msg);
    }
    return true;
  }

  private handleRemoveAnnotation(msg: any): boolean {
    if (!classicPywwt.isRemoveAnnotationMessage(msg)) return false;

    const handler = this.lookupAnnotationHandler(msg);
    if (handler !== undefined) {
      handler.handleRemoveAnnotationMessage(msg);
    }
    this.annotations.delete(msg.id);
    return true;
  }

  private handleClearAnnotations(msg: any): boolean {
    if (!classicPywwt.isClearAnnotationsMessage(msg)) return false;

    this.clearAnnotations();
    return true;
  }

  // Tours:

  private handleLoadTour(msg: any): boolean {
    if (!classicPywwt.isLoadTourMessage(msg)) return false;

    this.loadTour({
      url: msg.url,
      play: true,
    });
    return true;
  }

  private handlePauseTour(msg: any): boolean {
    if (!classicPywwt.isPauseTourMessage(msg)) return false;

    this.toggleTourPlayPauseState(); // note half-assed semantics here!
    return true;
  }

  private handleResumeTour(msg: any): boolean {
    if (!classicPywwt.isResumeTourMessage(msg)) return false;

    this.toggleTourPlayPauseState(); // note half-assed semantics here!
    return true;
  }

  // Outgoing messages

  updateIntervalId: number | null = null;
  // we need to declare this variable specially to make sure that Vue doesn't
  // try to make it reactive, which would cause it to try to read fields that
  // are prohibited in cross-origin situations:
  private statusMessageDestination!: Window | null;
  statusMessageSessionId = "default";
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
      ra != this.lastUpdatedRA ||
      dec != this.lastUpdatedDec ||
      fov != this.lastUpdatedFov ||
      clockRate != this.lastUpdatedClockRate ||
      Date.now() - this.lastUpdatedTimestamp > 60000;

    if (!needUpdate) return;

    const message: ViewStateMessage = {
      type: "wwt_view_state",
      sessionId: this.statusMessageSessionId,
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

  @Watch("wwtClockDiscontinuities")
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

  get curAvailableImagesets() {
    if (this.wwtAvailableImagesets == null) return [];
    return this.wwtAvailableImagesets.filter(
      (info) =>
        info.type == this.wwtRenderType && !info.extension.includes("tsv")
    );
  }

  get curAvailableCatalogs() {
    if (this.wwtAvailableImagesets == null) return [];
    return this.wwtAvailableImagesets.filter(
      (info) =>
        info.type == this.wwtRenderType && info.extension.includes("tsv")
    );
  }

  get curBackgroundImagesetName() {
    if (this.wwtBackgroundImageset == null) return "";
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

  private handleSetBackgroundByName(msg: any): boolean {
    if (!classicPywwt.isSetBackgroundByNameMessage(msg)) return false;

    this.setBackgroundImageByName(msg.name);
    return true;
  }

  private handleSetForegroundByName(msg: any): boolean {
    if (!classicPywwt.isSetForegroundByNameMessage(msg)) return false;

    this.setForegroundImageByName(msg.name);
    return true;
  }

  private handleSetForegroundOpacity(msg: any): boolean {
    if (!classicPywwt.isSetForegroundOpacityMessage(msg)) return false;

    this.setForegroundOpacity(msg.value);
    return true;
  }

  private handleSetViewerMode(msg: any): boolean {
    if (!classicPywwt.isSetViewerModeMessage(msg)) return false;

    this.setBackgroundImageByName(msg.mode);
    this.setForegroundImageByName(msg.mode);
    return true;
  }

  // HiPS catalogs (see also the table layer support)

  addHips(catalog: ImagesetInfo): Promise<Imageset> {
    this.addResearchAppCatalogHips(catalog);
    return this.addCatalogHipsByName({ name: catalog.name }).then((imgset) => {
      const hips = imgset.get_hipsProperties();

      if (hips !== null) {
        const catId = hips.get_catalogSpreadSheetLayer().id.toString();
        this.applyTableLayerSettings({
          id: catId,
          settings: [
            ["color", this.defaultColor],
            ["opacity", this.defaultColor.a],
          ],
        });
      }

      return imgset;
    });
  }

  get catalogToAdd() {
    return new ImagesetInfo("", "", ImageSetType.sky, "", "");
  }

  set catalogToAdd(catalog: ImagesetInfo) {
    this.addHips(catalog);
  }

  @Watch("curAvailableCatalogs")
  onAvailableCatalogsChanged(catalogs: ImagesetInfo[]) {
    // Notify clients about the new catalogs

    if (this.statusMessageDestination === null || this.allowedOrigin === null)
      return;

    const msg: ApplicationStateMessage = {
      type: "wwt_application_state",
      sessionId: this.statusMessageSessionId,
      hipsCatalogNames: catalogs.map((img) => img.name),
    };

    this.statusMessageDestination.postMessage(msg, this.allowedOrigin);
  }

  @Watch("lastSelectedSource")
  onLastSelectedSourceChanged(source: Source) {
    // Notify clients when a source is selected

    if (this.statusMessageDestination === null || this.allowedOrigin === null)
      return;

    const msg: selections.SelectionStateMessage = {
      type: "wwt_selection_state",
      sessionId: this.statusMessageSessionId,
      mostRecentSource: source,
    };

    this.statusMessageDestination.postMessage(msg, this.allowedOrigin);
  }

  @Watch("sources", { deep: true })
  onSelectedSourcesChanged(sources: Source[]) {
    // Notify clients when the list of selected sources is changed
    // By making this a deep watcher, it keeps of track of any change
    // in the list - even events like a property of a list entry changing

    if (this.statusMessageDestination === null || this.allowedOrigin === null)
      return;

    const msg: selections.SelectionStateMessage = {
      type: "wwt_selection_state",
      sessionId: this.statusMessageSessionId,
      selectedSources: sources,
    };

    this.statusMessageDestination.postMessage(msg, this.allowedOrigin);
  }

  // A client has requested that we load a HiPS catalog. Once it's loaded we
  // reply to the client with the details of the catalog-as-spreadsheet-layer,
  // so that it can know what the catalog's characteristics are.
  private handleLoadHipsCatalog(msg: any): boolean {
    if (!layers.isLoadHipsCatalogMessage(msg)) return false;

    for (const cat of this.curAvailableCatalogs) {
      if (cat.name == msg.name) {
        this.addHips(cat).then((imgset) => {
          const hips = imgset.get_hipsProperties();
          if (hips === null) throw new Error("internal consistency failure");

          const layer = hips.get_catalogSpreadSheetLayer();

          // Register in the table-layer framework

          let handler = this.tableLayers.get(msg.tableId);

          if (handler === undefined) {
            handler = new TableLayerMessageHandler(this);
            this.tableLayers.set(msg.tableId, handler);
          }

          handler.setupHipsCatalog(imgset, layer);

          // Reply?

          if (msg.threadId === undefined) return;

          if (
            this.statusMessageDestination === null ||
            this.allowedOrigin === null
          )
            return;

          const settings = extractSpreadSheetLayerSettings(layer);
          const pysettings: classicPywwt.PywwtSpreadSheetLayerSetting[] = [];

          for (const s of settings) {
            const ps = convertSpreadSheetLayerSetting(s);
            if (ps !== null) pysettings.push(ps);
          }

          const ssli: layers.SpreadSheetLayerInfo = {
            header: layer.get_header(),
            settings: pysettings,
          };

          const reply: layers.LoadHipsCatalogCompletedMessage = {
            event: "layer_hipscat_load_completed",
            threadId: msg.threadId,
            spreadsheetInfo: ssli,
          };

          this.statusMessageDestination.postMessage(reply, this.allowedOrigin);
        });

        break;
      }
    }

    return true;
  }

  private handleGetHipsCatalogDataInView(msg: any): boolean {
    if (!layers.isGetHipsCatalogDataInViewMessage(msg)) return false;

    // Unlike most table-layer messages, here we don't bother to try to work
    // well when messages are out-of-order or what have you.

    const handler = this.tableLayers.get(msg.tableId);
    if (handler !== undefined) {
      handler.handleGetHipsDataInViewMessage(msg).then((reply) => {
        if (reply !== null) {
          if (
            this.statusMessageDestination !== null &&
            this.allowedOrigin !== null
          )
            this.statusMessageDestination.postMessage(
              reply,
              this.allowedOrigin
            );
        }
      });
    }

    return true;
  }

  // "Tools" menu

  currentTool: ToolType = null;

  get showCrossfader() {
    if (this.wwtIsTourPlaying) return false; // maybe show this if tour player is active but not playing?

    if (
      this.wwtForegroundImageset == null ||
      this.wwtForegroundImageset === undefined
    )
      return false;

    return this.wwtForegroundImageset != this.wwtBackgroundImageset;
  }

  get showAddImageryTool() {
    return !this.wwtIsTourPlaying;
  }

  get showBackgroundChooser() {
    return !this.wwtIsTourPlaying;
  }

  get showCatalogTool() {
    return !this.wwtIsTourPlaying;
  }

  get showCatalogChooser() {
    return this.currentTool == "choose-catalog";
  }

  get showCollectionLoader() {
    return !this.wwtIsTourPlaying;
  }

  get haveImagery() {
    return this.activeImagesetLayerStates.length > 0;
  }

  get haveCatalogs() {
    return this.hipsCatalogs.length > 0;
  }

  get haveSources() {
    return this.sources.length > 0;
  }

  get showToolMenu() {
    // This should return true if there are any tools to show.
    return this.showCrossfader || this.showBackgroundChooser;
  }

  selectTool(name: ToolType) {
    if (this.currentTool == name) {
      this.currentTool = null;
    } else {
      this.currentTool = name;
    }
  }

  // Add Imagery As Layer tool

  get imageryToAdd() {
    return new ImagesetInfo("", "", ImageSetType.sky, "", "");
  }

  set imageryToAdd(iinfo: ImagesetInfo) {
    const msg: classicPywwt.CreateImageSetLayerMessage = {
      event: "image_layer_create",
      url: iinfo.url,
      id: iinfo.name,
      mode: "preloaded",
    };

    this.getFitsLayerHandler(msg).handleCreateMessage(msg);
  }

  get curAvailableImageryData() {
    if (this.wwtAvailableImagesets == null) return [];

    // Currently (2021 August) the engine code requires that the
    // filetype/extension field of an imageset be exactly ".fits" if it will be
    // rendered with the FITS machinery. There are some datasets out there that
    // include multiple space-separated extensions in this attribute, and of
    // course there are different FITS-like extensions in use, so this might get
    // more sophisticated in the future. If so, this logic will need to be
    // updated.

    return this.wwtAvailableImagesets.filter(
      (info) => info.type == this.wwtRenderType && info.extension == ".fits"
    );
  }

  // Load WTML Collection tool

  wtmlCollectionUrl = "";

  submitWtmlCollectionUrl() {
    if (this.wtmlCollectionUrl) {
      this.loadImageCollection({
        url: this.wtmlCollectionUrl,
        loadChildFolders: true,
      }).then((_folder) => {
        this.$notify({
          group: "load-collection",
          type: "success",
          text: "WTML collection successfully loaded",
        });
      });

      this.wtmlCollectionUrl = "";
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
      this.zoom(1 / 1.3);
    } else {
      this.zoom(1.3);
    }
  }

  doMove(x: number, y: number) {
    this.move({ x: x, y: y });
  }

  doTilt(x: number, y: number) {
    this.tilt({ x: x, y: y });
  }

  // For filtering imagesets
  filterImagesets(imagesets: ImagesetInfo[], searchText: string) {
    return imagesets.filter(
      (iset) =>
        iset.name.toLowerCase().includes(searchText) ||
        iset.description.toLowerCase().includes(searchText)
    );
  }

  filterCatalogs(imagesets: ImagesetInfo[], searchText: string) {
    return imagesets.filter(
      (iset) =>
        iset.name.toLowerCase().includes(searchText) ||
        iset.description.toLowerCase().includes(searchText)
    );
  }

  closestInView(
    target: AngleCoordinates,
    threshold?: number
  ): RawSourceInfo | null {
    let minDist = Infinity;
    let closestPt = null;

    const rowSeparator = "\r\n";
    const colSeparator = "\t";

    for (const catalog of this.visibleHipsCatalogs()) {
      const catalogName = catalog.name;
      const layer = this.layerForHipsCatalog(catalogName);
      if (layer == null) {
        continue;
      }
      const hipsStr = layer.getTableDataInView();
      const rows = hipsStr.split(rowSeparator);
      const header = rows.shift();
      if (!header) {
        return null;
      }
      const colNames = header.split(colSeparator);

      const lngCol = layer.get_lngColumn();
      const latCol = layer.get_latColumn();

      for (const row of rows) {
        const values = row.split(colSeparator);
        const ra = D2R * Number(values[lngCol]);
        const dec = D2R * Number(values[latCol]);
        const pt = { ra: ra, dec: dec };
        const dist = distance(target.ra, target.dec, pt.ra, pt.dec);
        if (dist < minDist) {
          closestPt = {
            ra: ra,
            dec: dec,
            colNames: colNames,
            values: values,
            catalogName: catalogName,
          };
          minDist = dist;
        }
      }
    }
    if (!threshold || minDist < threshold) {
      return closestPt;
    }
    return null;
  }

  data() {
    return {
      showPopover: false,
    };
  }

  /** The factor of 0.00002 converts between the WWT
   * engine zoom and the distance between points.
   * This value doesn't come from anywhere in particular,
   * other than the cursor -> pointer change feeling natural
   */
  updateDistanceThreshold = debounce((app: App, newZoom: number) => {
    app.distanceThreshold = 0.00002 * newZoom;
  }, 20);

  @Watch("wwtZoomDeg", { immediate: true })
  onZoomChange(val: number) {
    this.updateDistanceThreshold(this, val);
  }
}
</script>

<style lang="less">
html {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #000;

  // Activated in cases like interactive FITS stretch adjustment:
  &.pointer-tracking {
    cursor: crosshair;
  }
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

#overlays {
  margin: 5px;
}

#controls {
  position: absolute;
  z-index: 10;
  top: 0.5rem;
  right: 0.5rem;
  color: #fff;

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

#webgl2-popup {
  position: absolute;
  z-index: 10;
  bottom: 3rem;
  left: 50%;
  color: #fff;
  transform: translate(-50%, -50%);

  a {
    color: #5588ff;
  }
}

#tools {
  position: absolute;
  top: 0.5rem;
  left: 50%;
  color: #fff;

  .tool-container {
    position: relative;
    left: -50%;
    z-index: 10;
  }

  .opacity-range {
    width: 50vw;
  }

  a {
    text-decoration: none;
    color: #9bf;

    &:hover {
      text-decoration: underline;
    }
  }
}

#display-panel {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  width: 25vw;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  background: rgba(65, 65, 65, 0.6);

  p {
    margin: 0;
  }
}

.display-section-header {
  font-size: 70%;
  padding: 2px 5px;

  /* Some tomfoolery to give a little strikethrough effect
  * in the section header presentation */

  display: flex;
  align-items: center;

  &::before,
  &::after {
    content: "";
    height: 2px;
    background-color: white;
  }

  &::before {
    margin-right: 0.5rem;
    width: 1rem;
  }

  &::after {
    margin-left: 0.5rem;
    flex-grow: 1;
  }
}

.last-row {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

.icon {
  padding: 0px 5px;
  color: white;
}

.load-collection-container {
  width: 35vw;

  .load-collection-label {
    width: 100%;
    font-size: 120%;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .load-collection-row {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    width: 100%;
    margin-top: 0.2rem;

    label {
      margin-right: 0.5rem;
    }

    input {
      flex: 1;
    }
  }

  .load-collection-icon {
    cursor: pointer;
    color: #9bf;

    &:hover {
      color: #88f;
    }
  }
}

.vue-notification-group {
  margin-right: 2.5rem;
  margin-top: 0.75rem;
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

  &[aria-hidden="true"] {
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.15s, visibility 0.15s;
  }

  &[aria-hidden="false"] {
    visibility: visible;
    opacity: 1;
    transition: opacity 0.15s;
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
      color: #fff;
    }
  }
}

.item-selector {
  width: 25vw;
  vertical-align: middle;
  padding: 5px;
  white-space: nowrap;
  text-overflow: ellipsis;
  // Note: `overflow: hidden` breaks the dropdown
}

.item-select-container {
  display: flex;
}

.item-select-title {
  text-align: center;
  color: white;
  font-weight: bold;
  font-size: 19px;
  background: none;
  float: left;
  height: 100%;
  margin: auto;
  padding: 0px 10px 0px 0px;
}

.item-selector * {
  background: #cccccc;

  .vs__dropdown-option--highlight {
    color: red;
  }
}

.item-option {
  & h4 {
    margin: 0;
  }

  & em {
    margin: 0;
    font-size: small;
  }
}

.pointer {
  cursor: pointer;
}

/**
This makes the last element of the last list item in the
display panel have the rounded bottom edge
The alternative to this is to have Vue bind a class to the last element
*/
#display-panel > *:last-child > *:last-child > *:last-child {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
</style>
