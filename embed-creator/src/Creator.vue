<template>
  <div id="app">
    <b-container>
      <header>
        <b-navbar toggleble="lg" variant="info" type="dark" sticky>
          <b-navbar-brand href="#">WWT Embed Creator — <i>beta</i></b-navbar-brand>
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
                <a href="#" @click="currentTabIndex = 2">Play a Guided Tour</a>
              </li>
              <li>
                <a href="#" @click="currentTabIndex = 3">View a Planetary Body</a>
              </li>
            </ul>

            <h4 class="mt-5">Global Settings</h4>

            <b-form-group
              label="Here are some generic settings that you can alter:"
            >
              <b-form-checkbox
                v-model="qsb.s.showCrosshairs"
                name="crosshairs-checkbox"
                >Show crosshairs in view center</b-form-checkbox
              >
              <b-form-checkbox
                v-model="qsb.s.showCoordinateReadout"
                name="coordinate-readout-checkbox"
                >Show coordinate readout</b-form-checkbox
              >
              <b-form-checkbox
                v-model="qsb.s.creditMode"
                name="credit-mode-checkbox"
                :value="CreditMode.Default"
                :unchecked-value="CreditMode.None"
                >Show “Powered by” credit overlay</b-form-checkbox
              >
              <b-form-checkbox
                v-model="suggestDefaultStyling"
                name="default-styling-checkbox"
                >Include CSS style suggestion in sample embed code</b-form-checkbox
              >
            </b-form-group>

            <h5 class="mt-4">Custom Data Loading</h5>

            <b-form-group
              label="URL of additional WTML collection to load:"
            >
              <b-form-input
                v-model="qsb.s.wtmlUrl"
                name="wtml-input"
                type="url"
                placeholder="https://example.com/data.wtml"
                ></b-form-input>
            </b-form-group>
          </b-tab>

          <b-tab title="Show an Image">
            <p>
              WWT can showcase an image of your choosing. In order to do so, it
              has to be told both where to find the image data <b>and</b>
              where the image should be placed on the sky. Different web
              services can analyze images to extract the necessary information.
              <i>Choose one of the follow tabs for instructions</i>:
            </p>

            <b-tabs no-fade class="ml-4 mr-4" content-class="mt-3">
              <b-tab title="AstroPix" active>
                <p><a href="https://astropix.ipac.caltech.edu/">AstroPix</a>
                from <a href="https://www.ipac.caltech.edu/">IPAC</a> collects
                astronomical imagery from observatories across the world and in
                space. To embed an image from AstroPix:</p>

                <ol>
                  <li>Navigate to the AstroPix page for the image you want, with
                  a URL looking like: <a
                  href="https://astropix.ipac.caltech.edu/image/eso/potw2003a">https://astropix.ipac.caltech.edu/image/...</a>.
                  (Click the link for a sample.)</li>
                  <li>In the “View Options” section at the top-right, find the
                  link labeled “View in WorldWide Telescope”. <i>If you don’t
                  see such a link, the image doesn’t come tagged with enough
                  positional information to be shown in WWT</i>, unfortunately.</li>
                  <li>Copy the URL of that WWT link. In most browsers, you
                  should right- or control-click the link and select the menu
                  item labeled something like “Copy Link Location”.</li>
                  <li>Paste the WWT URL in the box below!</li>
                </ol>

                <b-form-group
                  label="“View in WorldWide Telescope” link URL:"
                >
                  <b-form-input
                    name="img-astropix-showimage-url-input"
                    type="url"
                    :state="showImageUrlValidity"
                    @input="onShowImageUrlInput"
                    placeholder="http://www.worldwidetelescope.org/wwtweb/ShowImage.aspx?..."
                  ></b-form-input>
                </b-form-group>
              </b-tab>

              <b-tab title="Astrometry.net">
                <p><a href="http://nova.astrometry.net/">Astrometry.net</a>
                is a brilliant service that can derive astrometric solutions for sky images
                even if they’re completely unlabeled. To embed an image from Astrometry.net:</p>

                <ol>
                  <li>Navigate to the page for the image you want, with a URL
                  looking like: <a
                  href="http://nova.astrometry.net/user_images/3437740">http://nova.astrometry.net/user_images/...</a>.
                  (Click the link for a sample.)</li>
                  <li>In the “Calibration” section to the right, find the link
                  labeled “view in WorldWide Telescope”.</li>
                  <li>Copy the URL of that WWT link. In most browsers, you
                  should right- or control-click the link and select the menu
                  item labeled something like “Copy Link Location”.</li>
                  <li>Paste the WWT URL in the box below!</li>
                </ol>

                <b-form-group
                  label="“View in WorldWide Telescope” link URL:"
                >
                  <b-form-input
                    name="img-astrometry-showimage-url-input"
                    type="url"
                    :state="showImageUrlValidity"
                    @input="onShowImageUrlInput"
                    placeholder="http://www.worldwidetelescope.org/wwtweb/ShowImage.aspx?..."
                  ></b-form-input>
                </b-form-group>
              </b-tab>

              <b-tab title="Astronomy Image Explorer">
                <p>The <a href="http://www.astroexplorer.org/">Astronomy Image
                Explorer</a> (AIE) is a comprehensive database of images
                published in the astronomical research literature. That database
                includes images of the sky with the coordinate information
                needed to display in WWT.</p>

                <ol>
                  <li>To search for a usable image from <a
                  href="http://www.astroexplorer.org/">the AIE homepage</a>,
                  click the “Images with astrometry” selector in the “Content
                  Type” section of search filters in the left-hand column.</li>
                  <li>Navigate to the page for the image you want, with a URL
                  looking like: <a
                  href="http://www.astroexplorer.org/details/308158864287067800170087_0002101.000/eyJjb250ZW50VHlwZXMiOlsiSW1hZ2VzIl0sImFzdHJvbWV0cmljYWxseVRhZ2dlZCI6dHJ1ZSwicGFnZSI6MSwic2hvdyI6MjV9">http://www.astroexplorer.org/details/...</a>.
                  (Click the link for a sample.)</li>
                  <li>Find the button link labeled “View in WWT” in the
                  header.</li>
                  <li>Copy the URL of that WWT link. In most browsers, you
                  should right- or control-click the link and select the menu
                  item labeled something like “Copy Link Location”.</li>
                  <li>Paste the WWT URL in the box below!</li>
                </ol>

                <b-form-group
                  label="“View in WWT link URL:"
                >
                  <b-form-input
                    name="img-aie-showimage-url-input"
                    type="url"
                    :state="showImageUrlValidity"
                    @input="onShowImageUrlInput"
                    placeholder="http://www.worldwidetelescope.org/wwtweb/ShowImage.aspx?..."
                  ></b-form-input>
                </b-form-group>
              </b-tab>

              <b-tab title="Manual WTML Specification">
                <p>If you know what you’re doing — show an image from a <a
                href="https://docs.worldwidetelescope.org/data-guide/1/data-file-formats/collections/">WTML
                collection</a>.</p>

                <b-form-group
                  label="WTML collection URL:"
                >
                  <b-form-input
                    v-model="qsb.s.wtmlUrl"
                    name="img-wtml-input"
                    type="url"
                    placeholder="https://example.com/data.wtml"
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  label="Imageset name inside WTML:"
                >
                  <b-form-input
                    v-model="qsb.s.foregroundImagesetName"
                    name="img-imgsetname-input"
                    type="text"
                    placeholder="My Image Name"
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  label="Place inside WTML:"
                >
                  <b-form-input
                    v-model="qsb.s.wtmlPlace"
                    name="img-placename-input"
                    type="text"
                    placeholder="My Place Name"
                  ></b-form-input>
                </b-form-group>
              </b-tab>
            </b-tabs>
          </b-tab>

          <b-tab title="Play a Guided Tour">
            <p>
              <a
              href="https://docs.worldwidetelescope.org/user-manual/1/guidedtours/">Guided
              Tours</a> are scripted, multimedia experiences that guide the
              viewer through WWT’s simulated universe. If you have a tour file
              (extension <code>.wtt</code>) available somewhere online, you can
              create a WWT embed that plays it automatically.
            </p>

            <p>Looking for a sample? Copy and paste <a
            href="https://data1.wwtassets.org/packages/2020/06_ngc6441/NGC6441.WTT">this link URL</a>.</p>

            <b-form-group
              label="Tour URL:"
            >
              <b-form-input
                name="img-tour-url-input"
                type="url"
                v-model="qsb.s.tourUrl"
                placeholder="https://example.com/tour.wtt"
              ></b-form-input>
            </b-form-group>
          </b-tab>

          <b-tab title="View a Planetary Body">
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
                :value="PlanetaryBodies.Jupiter"
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
            <iframe :src="iframeSource" class="w-100 wwt-preview" allow="accelerometer; autoplay; clipboard-write; gyroscope" allowfullscreen>
              <p>
                Cannot preview because your browser does not support iframes.
              </p>
            </iframe>

            <b-button
              variant="primary"
              class="mt-2"
              :href="iframeSource"
              target="_blank"
              >Open Preview in New Window
                <font-awesome-icon icon="external-link-alt" />
              </b-button
            >
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
            <p class="mt-4" v-show="suggestDefaultStyling">
              You should apply CSS <code>style</code> settings to control the
              size of the iframe. The settings suggested above can safely be
              changed.
            </p>
            <p class="mt-4" v-show="!suggestDefaultStyling">
              You will need to add appropriate CSS to control the size of the
              iframe. For instance: <code>.wwt-embed { width: 100%; height:
              360px; }</code>
            </p>
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
import {
  BButton,
  BCollapse,
  BContainer,
  BFormCheckbox,
  BFormGroup,
  BFormInput,
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
} from "bootstrap-vue-3";

import {
  CreditMode,
  EmbedQueryStringBuilder,
  PlanetaryBodies
} from "@wwtelescope/embed-common";
import { defineComponent } from "@vue/runtime-core";

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

export default defineComponent({

  components: {
    BButton,
    BCollapse,
    BContainer,
    BFormCheckbox,
    BFormGroup,
    BFormInput,
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
  },

  data() {
    return {
      CreditMode: CreditMode,
      PlanetaryBodies: PlanetaryBodies,
      qsb: new EmbedQueryStringBuilder(),
      currentTabIndex: 0,
      clipboardNoticeFadeOut: false,
      clipboardNoticeText: "",
      showImageUrlValidity: null as boolean | null,
      suggestDefaultStyling: true
    }
  },

  computed: {
    queryString(): string {
      const qs = new URLSearchParams(this.qsb.toQueryItems()).toString();
      if (qs.length)
        return "?" + qs;
      return "";
    },

    iframeBaseUrl(): string {
      // note: in production, the environment variable will be replaced with a literal value
      if (process.env.NODE_ENV == "development") {
        return "http://localhost:23000/";
      }

      return "https://web.wwtassets.org/embed/1/wwt/";
    },

    iframeSource(): string {
      return `${this.iframeBaseUrl}${this.queryString}`;
    },

    embedCode(): string {
      const style = this.suggestDefaultStyling ? " frameborder=\"0\" style=\"width: 100%; height: 360px;\"" : "";
      return `<iframe class="wwt-embed" src="${escapeHtml(this.iframeSource)}" allow="accelerometer; autoplay; clipboard-write; gyroscope" allowfullscreen ${style}>
      <p>Cannot display WorldWide Telescope because your browser does not support iframes.</p>
      </iframe>`;
    }

  },

  methods: {
    onShowImageUrlInput(url: string) {
      let urlIsOk = false;

      try {
        const parsed = new URL(url);
        const queryParams = new URLSearchParams(parsed.search);

        if (parsed.pathname.toLowerCase() == "/wwtweb/showimage.aspx") {
          const name = (queryParams.get("name") || "").replace(",", "");
          queryParams.set("wtml", "true");
          parsed.search = "?" + queryParams.toString();
          this.qsb.s.wtmlUrl = parsed.toString();
          this.qsb.s.wtmlPlace = name;
          urlIsOk = true;
        }
      } catch {
        // We get an exception if `url` can't be parsed in the `new URL()` call.
        urlIsOk = false;
      }

      this.showImageUrlValidity = urlIsOk;

      if (urlIsOk) {
        // Clear out state for other modes with which we're mutually exclusive.
        this.qsb.planetaryBody = null;
      }
    },

    onClipboardSuccess() {
      this.clipboardNoticeText = "Copied!";
      this.clipboardNoticeFadeOut = true;
      setTimeout(() => {
        this.clipboardNoticeText = "";
        this.clipboardNoticeFadeOut = false;
      }, 2000);
    },

    onClipboardError() {
      this.clipboardNoticeText = "Error copying to clipboard :-(";
      this.clipboardNoticeFadeOut = true;
      setTimeout(() => {
        this.clipboardNoticeText = "";
        this.clipboardNoticeFadeOut = false;
      }, 2000);
    }

  }

});
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
