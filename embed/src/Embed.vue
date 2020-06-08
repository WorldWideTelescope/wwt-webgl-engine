<template>
  <div id="app">
    <WorldWideTelescope wwt-namespace="wwt-embed"></WorldWideTelescope>

    <div id="overlays">
      <p v-show="embedSettings.showCoordinateReadout">{{ coordText }}</p>
    </div>

    <div id="tool-menu">
      <v-popover>
        <font-awesome-icon class="tooltip-target" icon="sliders-h" size="lg"></font-awesome-icon>
        <template slot="popover">
          <ul class="tooltip-content tool-menu">
            <li><a href="#" @click="selectTool('crossfade')"><font-awesome-icon icon="adjust" /> Crossfade</a></li>
            <li><a href="#" @click="selectTool('choose-background')"><font-awesome-icon icon="mountain" /> Choose background</a></li>
          </ul>
        </template>
      </v-popover>
    </div>

    <div id="tools">
      <div class="tool-container">
      <template v-if="currentTool == 'crossfade'">
        <span>Foreground opacity:</span> <input class="opacity-range" type="range" v-model="foregroundOpacity">
      </template>
      <template v-else-if="currentTool == 'choose-background'">
        <span>Background imagery:</span>
        <select v-model="curBackgroundImagesetName">
          <option v-for="bg in backgroundImagesets" v-bind:value="bg.imagesetName">
            {{ bg.displayName }}
          </option>
        </select>
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
import { Component, Prop } from "vue-property-decorator";

import { fmtDegLat, fmtDegLon, fmtHours } from "@wwtelescope/astro";
import { ImageSetType } from "@wwtelescope/engine-types";
import { SetupForImagesetOptions, WWTAwareComponent } from "@wwtelescope/engine-vuex";
import { CreditMode, EmbedSettings } from "@wwtelescope/embed-common";

type ToolType = "crossfade" | "choose-background" | null;

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

@Component
export default class Embed extends WWTAwareComponent {
  CreditMode = CreditMode

  @Prop({ default: new EmbedSettings() }) readonly embedSettings!: EmbedSettings;

  backgroundImagesets: BackgroundImageset[] = [];
  currentTool: ToolType = null;

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

  created() {
    let prom = this.waitForReady().then(() => {
      for (const s of this.embedSettings.asSettings()) {
        this.applySetting(s);
      }
    });

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
        //this.setForegroundImageByName(this.embedSettings.foregroundImagesetName);
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
    });
  }

  selectTool(name: ToolType) {
    if (this.currentTool == name) {
      this.currentTool = null;
    } else {
      this.currentTool = name;
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
    width: 100%;
    height: 100%;
    border-style: none;
    border-width: 0;
    margin: 0;
    padding: 0;
  }
}

#overlays {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  color: #FFF;

  p {
    margin: 0;
    padding: 0;
    line-height: 1;
  }
}

#tool-menu {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  color: #FFF;

  .tooltip-target {
    cursor: pointer;
  }
}

#tools {
  position: absolute;
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

#credits {
  position: absolute;
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
