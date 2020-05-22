<template>
  <div id="app">
    <WorldWideTelescope wwt-namespace="wwt-embed"></WorldWideTelescope>
    <div id="overlays">
      <p v-show="embedSettings.showCoordinateReadout">{{ coordText }}</p>
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

import { fmtDegLat, fmtDegLon, fmtHours } from "@pkgw/astro";
import { ImageSetType } from "@pkgw/engine-types";
import { SetupForImagesetOptions, WWTAwareComponent } from "@pkgw/engine-vuex";
import { CreditMode, EmbedSettings } from "@pkgw/embed-common";

@Component
export default class Embed extends WWTAwareComponent {
  CreditMode = CreditMode

  @Prop({ default: new EmbedSettings() }) readonly embedSettings!: EmbedSettings;

  get coordText() {
    if (this.wwtRenderType == ImageSetType.sky) {
      return `${fmtHours(this.wwtRARad)} ${fmtDegLat(this.wwtDecRad)}`;
    }

    return `${fmtDegLon(this.wwtRARad)} ${fmtDegLat(this.wwtDecRad)}`;
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
    });
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

#credits {
  position: absolute;
  bottom: 0.5rem;
  right: 1rem;
  color: #ddd;
  font-size: 70%;

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
</style>
