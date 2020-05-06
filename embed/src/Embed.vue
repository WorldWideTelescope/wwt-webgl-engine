<template>
  <div id="app">
    <WorldWideTelescope wwt-namespace="wwt-embed"></WorldWideTelescope>
    <div id="overlays">
      <p>RA: {{ raText }}</p>
      <p>Dec: {{ decText }}</p>
      <p>Time: {{ wwtCurrentTime }}</p>
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

import { fmtDegLat, fmtHours } from "@pkgw/astro";
import { WWTAwareComponent } from "@pkgw/engine-vuex";
import { CreditMode, EmbedSettings } from "@pkgw/embed-common";

@Component
export default class Embed extends WWTAwareComponent {
  CreditMode = CreditMode

  @Prop({ default: new EmbedSettings() }) readonly embedSettings!: EmbedSettings;

  get raText() {
    return fmtHours(this.wwtRARad);
  }

  get decText() {
    return fmtDegLat(this.wwtDecRad);
  }

  created() {
    this.waitForReady().then(() => {
      for (const s of this.embedSettings.asSettings()) {
        this.applySetting(s);
      }

      this.setBackgroundImageByName(this.embedSettings.backgroundImagesetName);

      if (this.embedSettings.foregroundImagesetName.length)
        this.setForegroundImageByName(this.embedSettings.foregroundImagesetName);
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
  top: 1rem;
  color: #FFF;
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
