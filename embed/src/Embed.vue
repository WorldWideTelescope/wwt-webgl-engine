<template>
  <div id="app">
    <WorldWideTelescope
      wwt-namespace="wwt-embed"
      v-bind:style="{height: wwtComponentLayout.height, top: wwtComponentLayout.top}"
    ></WorldWideTelescope>

    <transition name="fade">
      <div class="modal" id="modal-loading" v-show="isLoadingState">
        <div class="container">
          <div class="spinner"></div>
          <p>Loading …</p>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div class="modal" id="modal-readytostart" v-show="isReadyToStartState" @click="startInteractive()">
        <div>
          <font-awesome-icon class="icon" icon="play"></font-awesome-icon>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div id="overlays">
        <p v-show="embedSettings.showCoordinateReadout">{{ coordText }}</p>
      </div>
    </transition>

    <ul id="controls">
      <li v-show="showToolMenu">
        <v-popover placement="left">
          <font-awesome-icon class="tooltip-target" icon="sliders-h" size="lg"></font-awesome-icon>
          <template slot="popover">
            <ul class="tooltip-content tool-menu">
              <li v-show="showCrossfader"><a href="#" v-close-popover @click="selectTool('crossfade')"><font-awesome-icon icon="adjust" /> Crossfade</a></li>
              <li v-show="showBackgroundChooser"><a href="#" v-close-popover @click="selectTool('choose-background')"><font-awesome-icon icon="mountain" /> Choose background</a></li>
              <li v-show="showPlaybackControls"><a href="#" v-close-popover @click="selectTool('playback-controls')"><font-awesome-icon icon="redo" /> Tour player controls</a></li>
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
      <template v-else-if="currentTool == 'choose-background'">
        <span>Background imagery:</span>
        <select v-model="curBackgroundImagesetName">
          <option v-for="bg in backgroundImagesets" v-bind:value="bg.imagesetName" v-bind:key="bg.imagesetName">
            {{ bg.displayName }}
          </option>
        </select>
      </template>
      <template v-else-if="currentTool == 'playback-controls'">
        <div class="playback-controls">
          <font-awesome-icon v-bind:icon="tourPlaybackIcon"
            size="lg" class="clickable" @click="tourPlaybackButtonClicked()"></font-awesome-icon>
          <vue-slider
            class="scrubber"
            v-model="twoWayTourTimecode"
            :max="wwtTourRunTime"
            :marks="wwtTourStopStartTimes"
            :tooltip-formatter="formatTimecode"
            :adsorb="true"
            :duration="0"
            :interval="0.001"
            :contained="true"
            :hide-label="true"
            :use-keyboard="false"
          ></vue-slider>
        </div>
      </template>
      </div>
    </div>

    <div id="credits" v-show="embedSettings.creditMode == CreditMode.Default">
      <p>Powered by <a href="https://worldwidetelescope.org/home/">AAS WorldWide
      Telescope</a>
      <a href="https://worldwidetelescope.org/home/"><img alt="WWT Logo" src="./assets/logo_wwt.png" /></a>
      <a href="https://aas.org/"><img alt="AAS Logo" src="./assets/logo_aas.png" /></a>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from "vue-property-decorator";

import * as screenfull from "screenfull";

import { fmtDegLat, fmtDegLon, fmtHours } from "@wwtelescope/astro";
import { ImageSetType } from "@wwtelescope/engine-types";
import { SetupForImagesetOptions, WWTAwareComponent } from "@wwtelescope/engine-vuex";
import { CreditMode, EmbedSettings } from "@wwtelescope/embed-common";

/** The overall state of the WWT embed component. */
enum ComponentState {
  /** Waiting for resources and/or content to load. Not yet ready to start. */
  LoadingResources,

  /** Resources have loaded. We can start when the user activates us. */
  ReadyToStart,

  /** The user has activated us. */
  Started,
}

type ToolType = "crossfade" | "choose-background" | "playback-controls" | null;

class BackgroundImageset {
  public imagesetName: string;
  public displayName: string;

  constructor(displayName: string, imagesetName: string) {
    this.displayName = displayName;
    this.imagesetName = imagesetName;
  }
}

const skyBackgroundImagesets: BackgroundImageset[] = [
  new BackgroundImageset("Optical (Terapixel DSS)", "Digitized Sky Survey (Color)"),
  new BackgroundImageset("Low-frequency radio (VLSS)", "VLSS: VLA Low-frequency Sky Survey (Radio)"),
  new BackgroundImageset("Infrared (2MASS)", "2Mass: Imagery (Infrared)"),
  new BackgroundImageset("Infrared (SFD dust map)", "SFD Dust Map (Infrared)"),
  new BackgroundImageset("Ultraviolet (GALEX)", "GALEX (Ultraviolet)"),
  new BackgroundImageset("X-Ray (ROSAT RASS)", "RASS: ROSAT All Sky Survey (X-ray)"),
  new BackgroundImageset("Gamma Rays (FERMI LAT 8-year)", "Fermi LAT 8-year (gamma)"),
];

type Shape = { width: number; height: number };
const defaultWindowShape: Shape = {width: 1200, height: 900};

type WwtComponentLayout = { top: string; height: string };

@Component
export default class Embed extends WWTAwareComponent {
  CreditMode = CreditMode

  @Prop({ default: new EmbedSettings() }) readonly embedSettings!: EmbedSettings;

  componentState = ComponentState.LoadingResources;
  backgroundImagesets: BackgroundImageset[] = [];
  currentTool: ToolType = null;
  fullscreenModeActive = false;
  tourPlaybackJustEnded = false;
  windowShape = defaultWindowShape;

  get isLoadingState() {
    return this.componentState == ComponentState.LoadingResources;
  }

  get isReadyToStartState() {
    return this.componentState == ComponentState.ReadyToStart;
  }

  get coordText() {
    if (this.wwtRenderType == ImageSetType.sky) {
      return `${fmtHours(this.wwtRARad)} ${fmtDegLat(this.wwtDecRad)}`;
    }

    return `${fmtDegLon(this.wwtRARad)} ${fmtDegLat(this.wwtDecRad)}`;
  }

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

  get fullscreenAvailable() {
    return screenfull.isEnabled;
  }

  get showBackgroundChooser() {
    if (this.wwtIsTourPlaying)
      return false;

    // TODO: we should wire in choices for other modes!
    return this.wwtRenderType == ImageSetType.sky;
  }

  get showCrossfader() {
    if (this.wwtIsTourPlaying)
      return false; // maybe show this if tour player is active but not playing?

    if (this.wwtForegroundImageset == null || this.wwtForegroundImageset === undefined)
      return false;

    return this.wwtForegroundImageset != this.wwtBackgroundImageset;
  }

  get showPlaybackControls() {
    return this.wwtIsTourPlayerActive && !this.wwtIsTourPlaying;
  }

  get showToolMenu() {
    // This should return true if there are any tools to show.
    return this.showBackgroundChooser || this.showCrossfader || this.showPlaybackControls;
  }

  created() {
    let prom = this.waitForReady().then(() => {
      for (const s of this.embedSettings.asSettings()) {
        this.applySetting(s);
      }
    });

    if (this.embedSettings.tourUrl.length) {
      prom = prom.then(async () => {
        // TODO: figure out a good thing to do here
        this.backgroundImagesets = [];

        await this.loadTour({
          url: this.embedSettings.tourUrl,
          play: false,
        });

        this.componentState = ComponentState.ReadyToStart;
        this.setTourPlayerLeaveSettingsWhenStopped(true);
        this.currentTool = "playback-controls";
      });
    } else {
      // Many more possibilities if we're not playing a tour ...
      if (this.embedSettings.wtmlUrl.length) {
        prom = prom.then(async () => {
          const folder = await this.loadImageCollection({
            url: this.embedSettings.wtmlUrl
          });

          if (this.embedSettings.wtmlPlace) {
            for (const pl of folder.get_places()) {
              if (pl.get_name() == this.embedSettings.wtmlPlace) {
                /* This is nominally an async Action, but with `instant: true` it's ... instant */
                this.gotoTarget({
                  place: pl,
                  noZoom: false,
                  instant: true,
                  trackObject: true
                })
              }
            }
          }
        });
      }

      prom.then(() => {
        // setupForImageset() will apply a default background that is appropriate
        // for the foreground, but we want to be able to override it.

        let backgroundWasInitialized = false;
        let bgName = this.embedSettings.backgroundImagesetName;

        if (this.embedSettings.foregroundImagesetName.length) {
          const img = this.lookupImageset(this.embedSettings.foregroundImagesetName);

          if (img !== null) {
            const options: SetupForImagesetOptions = { foreground: img };

            // For setup of planetary modes to work, we need to pass the specified
            // background imageset to setupForImageset().
            if (bgName.length) {
              const bkg = this.lookupImageset(bgName);
              if (bkg !== null) {
                options.background = bkg;
                backgroundWasInitialized = true;
              }
            }

            this.setupForImageset(options);
          }
        }

        if (!backgroundWasInitialized) {
          if (!bgName.length) {
            // Empty bgname implies that we should choose a default background. If
            // setupForImageset() didn't do that for us, go with:
            bgName = "Digitized Sky Survey (Color)";
          }

          this.setBackgroundImageByName(bgName);
        }

        // TODO: DTRT in different modes.
        this.backgroundImagesets = [...skyBackgroundImagesets];
        let foundBG = false;

        for (const bgi of this.backgroundImagesets) {
          if (bgi.imagesetName == bgName) {
            foundBG = true;
            break;
          }
        }

        if (!foundBG) {
          this.backgroundImagesets.unshift(new BackgroundImageset(bgName, bgName));
        }

        this.componentState = ComponentState.Started;
      });
    }
  }

  mounted() {
    if (screenfull.isEnabled) {
      screenfull.on('change', this.onFullscreenEvent);
    }

    window.addEventListener('resize', this.onResizeEvent);
    // ResizeObserver not yet in TypeScript but we should start using it when
    // available. If we're in an iframe, our shape might change spontaneously.
    // const ro = new ResizeObserver(entries => this.onResizeEvent());
    // ro.observer(this.$el);
    this.onResizeEvent();
  }

  destroyed() {
    if (screenfull.isEnabled) {
      screenfull.off('change', this.onFullscreenEvent);
    }

    window.removeEventListener('resize', this.onResizeEvent);
  }

  selectTool(name: ToolType) {
    if (this.currentTool == name) {
      this.currentTool = null;
    } else {
      this.currentTool = name;
    }
  }

  doZoom(zoomIn: boolean) {
    if (zoomIn) {
      this.zoom(1/1.3);
    } else {
      this.zoom(1.3);
    }
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

  onResizeEvent() {
    const width = this.$el.clientWidth;
    const height = this.$el.clientHeight;

    if (width > 0 && height > 0) {
      this.windowShape = {width, height};
    } else {
      this.windowShape = defaultWindowShape;
    }
  }

  startInteractive() {
    this.componentState = ComponentState.Started;

    if (this.embedSettings.tourUrl.length) {
      this.startTour();
    }
  }

  get tourPlaybackIcon() {
    if (this.tourPlaybackJustEnded) {
      return "undo-alt";
    }

    if (this.wwtIsTourPlaying) {
      return "pause";
    }

    return "play";
  }

  tourPlaybackButtonClicked() {
    if (this.wwtIsTourPlayerActive) {
      // If we're playing and our window is tall, we have styling active that
      // keeps the WWT widget in a widescreen-ish format to preserve tour
      // layout. If we're stopping playback, this styling will go away. Since
      // the WWT widget tracks its view height as an angular size, we need to
      // tweak it in order to preserve continuity when the tour is paused. This
      // isn't 100% necessary but is cool when it works. It doesn't work if the
      // pause occurs in a very zoomed-out state, where we can't zoom out any
      // farther because we hit the zoom clamps.
      //
      // Keep this in sync with wwtComponentLayout.
      //
      // TODO: make sure this works in 3D mode.
      let newView = null;

      if (this.wwtIsTourPlaying && this.wwtComponentLayout.top != '0') {
        const curHeight = this.windowShape.width * 0.75;
        newView = {
          raRad: 1.0 * this.wwtRARad,
          decRad: 1.0 * this.wwtDecRad,
          zoomDeg: this.wwtZoomDeg * this.windowShape.height / curHeight,
          instant: true,
        };
      }

      if (this.tourPlaybackJustEnded) {
        // Restart from beginning. (seekToTourTimecode() starts playback.)
        this.seekToTourTimecode(0);
        this.tourPlaybackJustEnded = false;
      } else {
        this.toggleTourPlayPauseState();
      }

      if (newView !== null) {
        this.gotoRADecZoom(newView);
      }
    }
  }

  formatTimecode(seconds: number): string {
    if (seconds < 0)
      return "-:--"

    const minutes = Math.floor(seconds / 60);
    seconds = Math.round(seconds - 60 * minutes);
    return minutes.toString() + ":" + seconds.toString().padStart(2, "0");
  }

  get twoWayTourTimecode() {
    return this.wwtTourTimecode;
  }

  set twoWayTourTimecode(code: number) {
    this.seekToTourTimecode(code);
    this.tourPlaybackJustEnded = false;
  }

  @Watch('wwtTourCompletions')
  onTourCompletionsChanged(_count: number) {
    this.tourPlaybackJustEnded = true;
  }

  // This property is used to achieve a widescreen effect when playing tours
  // back on a portrait-mode screen, such as on a mobile device. Tours have to
  // be designed with a target screen aspect ratio in mind, so without the
  // widescreen effect the content will get cut off.
  //
  // Keep this in sync with toggleTourPlayback.
  get wwtComponentLayout(): WwtComponentLayout  {
    if (this.wwtIsTourPlaying) {
      if (this.windowShape.height > this.windowShape.width) {
        const wwtHeight = this.windowShape.width * 0.75; // => 4:3 aspect ratio
        const height = wwtHeight + 'px';
        const top = 0.5 * (this.windowShape.height - wwtHeight) + 'px';
        return { top, height };
      }
    }

    return { top: '0', height: '100%' };
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

.modal {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 100;

  color: #FFF;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}

#modal-loading {
  background-color: #000;

  .container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    .spinner {
      background-image: url('assets/lunar_loader.gif');
      background-repeat: no-repeat;
      background-size: contain;
      width: 3rem;
      height: 3rem;
    }

    p {
      margin: 0 0 0 1rem;
      padding: 0;
      font-size: 150%;
    }
  }
}

#modal-readytostart {
  cursor: pointer;
  color: #999;

  &:hover {
    color: #2aa5f7;
  }

  div {
    margin: 0;
    padding: 0;
    background-image: url('assets/wwt_globe_bg.png');
    background-repeat: no-repeat;
    background-size: contain;
    width: 20rem;
    height: 20rem;
    max-width: 70%;
    max-height: 70%;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon {
      width: 60%;
      height: 60%;
      margin-left: 14%;
      margin-top: 3%;
    }
  }
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

  .clickable {
    cursor: pointer;
  }
}


.playback-controls {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 75vw;

  .clickable {
    margin: 0 8px;
    cursor: pointer;
  }

  .scrubber {
    flex: 1;
    cursor: pointer;
  }
}

#credits {
  position: absolute;
  z-index: 10;
  bottom: 0.5rem;
  right: 1rem;
  color: #ddd;
  font-size: 70%;

  p {
    margin: 0;
    padding: 0;
    line-height: 1;
  }

  a {
    text-decoration: none;
    color: #fff;

    &:hover {
      text-decoration: underline;
    }
  }

  img {
    height: 24px;
    vertical-align: middle;
    margin: 2px;
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
