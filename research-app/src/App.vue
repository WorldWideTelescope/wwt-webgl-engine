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
import { isEngineSetting, isImageSetLayerSetting } from "@wwtelescope/engine-helpers";
import { ImageSetType } from "@wwtelescope/engine-types";
import { WWTAwareComponent } from "@wwtelescope/engine-vuex";

import { classicPywwt, ViewStateMessage } from "@wwtelescope/research-app-messages";

const D2R = Math.PI / 180.0;

type ToolType = "crossfade" | null;

@Component
export default class App extends WWTAwareComponent {
  @Prop({default: null}) readonly allowedOrigin!: string | null;

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
      this.loadImageCollection({ url: msg.url });
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
      this.gotoRADecZoom({
        raRad: msg.ra * D2R,
        decRad: msg.dec * D2R,
        zoomDeg: msg.fov, // TODO: make sure we're not off by a factor of 6 here
        instant: msg.instant,
      });
    } else if (classicPywwt.isModifySettingMessage(msg)) {
      const setting: [string, any] = [msg.setting, msg.value];  // eslint-disable-line @typescript-eslint/no-explicit-any

      if (isEngineSetting(setting)) {
        this.applySetting(setting);
      }
    } else if (classicPywwt.isCreateFitsLayerMessage(msg)) {
      this.applyCreateFitsLayerMessage(msg);
    } else if (classicPywwt.isStretchFitsLayerMessage(msg)) {
      this.applyStretchFitsLayerMessage(msg);
    } else if (classicPywwt.isSetFitsLayerColormapMessage(msg)) {
      this.applySetFitsLayerColormapMessage(msg);
    } else if (classicPywwt.isModifyFitsLayerMessage(msg)) {
      this.applyModifyFitsLayerMessage(msg);
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
    } else {
      console.warn("WWT research app received unrecognized message, as follows:", msg);
    }

    // TODO:
    // AddLinePointMessage
    // AddPolygonPointMessage
    // ClearAnnotationsMessage
    // CreateAnnotationMessage
    // CreateTableLayerMessage
    // ModifyAnnotationMessage
    // ModifyTableLayerMessage
    // RemoveAnnotationMessage
    // RemoveFitsLayerMessage
    // RemoveTableLayerMessage
    // SetCircleCenterMessage
    // TrackObjectMessage
    // UpdateTableLayerMessage
  }

  // Maps external layer IDs to internal ones
  private layerIdMap: Map<string, string> = new Map();

  private applyCreateFitsLayerMessage(msg: classicPywwt.CreateFitsLayerMessage): void {
    this.loadFitsLayer({
      url: msg.url,
      name: msg.id,
      gotoTarget: true,
    }).then((layer) => {
      this.layerIdMap.set(msg.id, layer.id.toString());
    });
  }

  // Keyed by external, not internal, ID.
  private layerStretchVersions: Map<string, number> = new Map();

  private applyStretchFitsLayerMessage(msg: classicPywwt.StretchFitsLayerMessage): void {
    const prev = this.layerStretchVersions.get(msg.id);
    if (prev !== undefined && msg.version <= prev) {
      return;
    }

    // TODO: have a real solution in case the layer isn't yet loaded, etc.
    const intId = this.layerIdMap.get(msg.id);
    if (intId !== undefined) {
      this.stretchFitsLayer({
        id: intId,
        stretch: msg.stretch,
        vmin: msg.vmin,
        vmax: msg.vmax,
      });
    }
  }

  // Keyed by external, not internal, ID.
  private layerColormapVersions: Map<string, number> = new Map();

  private applySetFitsLayerColormapMessage(msg: classicPywwt.SetFitsLayerColormapMessage): void {
    const prev = this.layerColormapVersions.get(msg.id);
    if (prev !== undefined && msg.version <= prev) {
      return;
    }

    // TODO: have a real solution in case the layer isn't yet loaded, etc.
    const intId = this.layerIdMap.get(msg.id);
    if (intId !== undefined) {
      this.setFitsLayerColormap({
        id: intId,
        name: msg.cmap,
      });
    }
  }

  private applyModifyFitsLayerMessage(msg: classicPywwt.ModifyFitsLayerMessage): void {
    const setting: [string, any] = [msg.setting, msg.value];  // eslint-disable-line @typescript-eslint/no-explicit-any

    if (!isImageSetLayerSetting(setting)) {
      return;
    }

    // TODO: have a real solution in case the layer isn't yet loaded, etc.
    const intId = this.layerIdMap.get(msg.id);
    if (intId !== undefined) {
      this.applyFitsLayerSettings({
        id: intId,
        settings: [setting],
      });
    }
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
