<template>
  <div id="app">
    <b-container>
      <header>
        <b-navbar toggleble="lg" variant="info" type="dark" sticky>
          <b-navbar-brand href="#">WWT Embed Creator</b-navbar-brand>
          <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
          <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav class="ml-auto">
              <b-nav-item href="https://worldwidetelescope.org/home/"
                >WWT Home</b-nav-item
              >
            </b-navbar-nav>
          </b-collapse>
        </b-navbar>
      </header>

      <main role="main" class="mt-4">
        <b-tabs no-fade content-class="mt-3" v-model="currentTabIndex">
          <b-tab title="Home" active>
            <p>
              Wecome to the AAS WorldWide Telescope embed creator tool! This
              site helps you create HTML code that you can use to embed WWT in
              your own websites.
            </p>

            <h4 class="mt-5">Mode</h4>

            <p>
              WWT offers several view modes. Click one of the tabs at the top,
              or one of the following links:
            </p>

            <ul>
              <li>
                <a href="#" @click="currentTabIndex = 1">Show an Image</a>
              </li>
              <li>
                <a href="#" @click="currentTabIndex = 2">Planetary Body View</a>
              </li>
            </ul>

            <h4 class="mt-5">Global Settings</h4>

            <b-form-group
              label="Here are some generic settings that you can alter:"
            >
              <b-form-checkbox
                v-model="qsb.o.creditMode"
                name="credit-mode-checkbox"
                :value="CreditMode.Default"
                :unchecked-value="CreditMode.None"
                >Show “Powered by” credit overlay</b-form-checkbox
              >
            </b-form-group>
          </b-tab>

          <b-tab title="Show an Image">
            <p>
              Yay images.
            </p>
          </b-tab>

          <b-tab title="Planetary Body View">
            <p>
              In this mode, the user can explore a spherical body shown in
              isolation: no surrounding stars or other planets.
            </p>

            <h4>Settings</h4>

            <b-form-group
              label="Imagery selection:"
              label-cols="2"
              label-class="pt-0"
            >
              <b-form-radio
                v-model="qsb.planetaryBody"
                name="planetary-imagery"
                :value="PlanetaryBodies.Sun"
                >Sun</b-form-radio
              >
              <b-form-radio
                v-model="qsb.planetaryBody"
                name="planetary-imagery"
                :value="PlanetaryBodies.Mercury"
                >Mercury</b-form-radio
              >
              <b-form-radio
                v-model="qsb.planetaryBody"
                name="planetary-imagery"
                :value="PlanetaryBodies.Venus"
                >Venus</b-form-radio
              >
              <b-form-radio
                v-model="qsb.planetaryBody"
                name="planetary-imagery"
                :value="PlanetaryBodies.Earth"
                >Earth</b-form-radio
              >
              <b-form-radio
                v-model="qsb.planetaryBody"
                name="planetary-imagery"
                :value="PlanetaryBodies.Moon"
                class="pl-5"
                >Moon</b-form-radio
              >
              <b-form-radio
                v-model="qsb.planetaryBody"
                name="planetary-imagery"
                :value="PlanetaryBodies.Mars"
                >Mars</b-form-radio
              >
              <b-form-radio
                v-model="qsb.planetaryBody"
                name="planetary-imagery"
                :value="PlanetaryBodies.Mars"
                >Jupiter</b-form-radio
              >
              <b-form-radio
                v-model="qsb.planetaryBody"
                name="planetary-imagery"
                :value="PlanetaryBodies.Io"
                class="pl-5"
                >Io</b-form-radio
              >
              <b-form-radio
                v-model="qsb.planetaryBody"
                name="planetary-imagery"
                :value="PlanetaryBodies.Europa"
                class="pl-5"
                >Europa</b-form-radio
              >
              <b-form-radio
                v-model="qsb.planetaryBody"
                name="planetary-imagery"
                :value="PlanetaryBodies.Ganymede"
                class="pl-5"
                >Ganymede</b-form-radio
              >
              <b-form-radio
                v-model="qsb.planetaryBody"
                name="planetary-imagery"
                :value="PlanetaryBodies.Callisto"
                class="pl-5"
                >Callisto</b-form-radio
              >
              <b-form-radio
                v-model="qsb.planetaryBody"
                name="planetary-imagery"
                :value="PlanetaryBodies.Saturn"
                >Saturn</b-form-radio
              >
              <b-form-radio
                v-model="qsb.planetaryBody"
                name="planetary-imagery"
                :value="PlanetaryBodies.Uranus"
                >Uranus</b-form-radio
              >
              <b-form-radio
                v-model="qsb.planetaryBody"
                name="planetary-imagery"
                :value="PlanetaryBodies.Neptune"
                >Neptune</b-form-radio
              >
              <b-form-radio
                v-model="qsb.planetaryBody"
                name="planetary-imagery"
                :value="PlanetaryBodies.Pluto"
                >Pluto</b-form-radio
              >
            </b-form-group>
          </b-tab>
        </b-tabs>

        <hr class="mt-5" />

        <b-row>
          <b-col>
            <h4>Preview</h4>
            <iframe :src="iframeSource" class="w-100 wwt-preview">
              <p>
                Cannot preview because your browser does not support iframes.
              </p>
            </iframe>
          </b-col>
          <b-col>
            <h4>Embed Code</h4>
            <b-form-textarea
              readonly
              id="embed-code-textarea"
              v-model="embedCode"
              rows="5"
            ></b-form-textarea>
            <div class="mt-2 d-flex align-items-center">
              <b-button
                variant="primary"
                v-clipboard:copy="embedCode"
                v-clipboard:success="onClipboardSuccess"
                v-clipboard:error="onClipboardError"
                >Copy to Clipboard</b-button
              >
              <span
                class="ml-2"
                :class="{ 'fade-out': clipboardNoticeFadeOut }"
                id="clipboard-notice"
                >{{ clipboardNoticeText }}</span
              >
            </div>
          </b-col>
        </b-row>
      </main>

      <footer class="text-muted mt-5">
        <p class="float-right">
          <a href="#">Back to top</a>
        </p>
        <p>
          Copyright 2020
          <a href="https://aas.org/">American Astronomical Society</a>.
        </p>
      </footer>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  BButton,
  BCollapse,
  BContainer,
  BFormCheckbox,
  BFormGroup,
  BFormRadio,
  BFormTextarea,
  BNavbar,
  BNavbarBrand,
  BNavbarNav,
  BNavbarToggle,
  BNavItem,
  BRow,
  BTab,
  BTabs
} from "bootstrap-vue";

import {
  CreditMode,
  EmbedQueryStringBuilder,
  PlanetaryBodies
} from "@wwtelescope/embed-common";

// From Tom Gruner @ http://stackoverflow.com/a/12034334/1660815 (without forward-slash subst)
const entityMap: { [index: string]: string } = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};

function escapeHtml(source: string) {
  return source.replace(/[&<>"']/g, s => entityMap[s]);
}

@Component({
  components: {
    BButton,
    BCollapse,
    BContainer,
    BFormCheckbox,
    BFormGroup,
    BFormRadio,
    BFormTextarea,
    BNavbar,
    BNavbarBrand,
    BNavbarNav,
    BNavbarToggle,
    BNavItem,
    BRow,
    BTab,
    BTabs
  }
})
export default class Creator extends Vue {
  CreditMode = CreditMode;
  PlanetaryBodies = PlanetaryBodies;

  qsb = new EmbedQueryStringBuilder();

  currentTabIndex = 0;
  clipboardNoticeFadeOut = false;
  clipboardNoticeText = "";

  get queryString() {
    return this.qsb.toQueryString();
  }

  get iframeSource() {
    return `https://web.wwtassets.org/embed/1/wwt/${this.queryString}`;
  }

  get embedCode() {
    return `<iframe src="${escapeHtml(this.iframeSource)}">
  <p>Cannot display WWT because your browser does not support iframes.</p>
</iframe>`;
  }

  onClipboardSuccess() {
    this.clipboardNoticeText = "Copied!";
    this.clipboardNoticeFadeOut = true;
    setTimeout(() => {
      this.clipboardNoticeText = "";
      this.clipboardNoticeFadeOut = false;
    }, 2000);
  }

  onClipboardError() {
    this.clipboardNoticeText = "Error copying to clipboard :-(";
    this.clipboardNoticeFadeOut = true;
    setTimeout(() => {
      this.clipboardNoticeText = "";
      this.clipboardNoticeFadeOut = false;
    }, 2000);
  }
}
</script>

<style lang="scss">
.wwt-preview {
  height: 360px;
}

#clipboard-notice {
  transition: color 2s;

  &.fade-out {
    color: transparent;
  }
}
</style>
