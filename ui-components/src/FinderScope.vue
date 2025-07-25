<template>
  <div
    v-show="modelValue && place"
    class="finder-scope"
    :style="cssVars"
  >
    <canvas class="fs-crosshairs"></canvas>
    <div class="fs-moveable"></div>
    <div class="fs-header">
      <a class="thumbnail">
        <img :src="thumbnail" />
      </a>
      <font-awesome-icon
        icon="xmark"
        size="lg"
        class="close-icon"
        @keyup.enter="close"
        @click="close"
      ></font-awesome-icon>
    </div>
    <div class="fs-info">
      <div>
        <div><strong>Classification:</strong> <span>{{ classification }}</span></div>
        <div v-if="isSurvey"><strong>Constellation:</strong> <span>{{ constellation }}</span></div>
        <div><strong>Names:</strong> <span>{{ names }}</span></div>
        <hr />
        <div
          v-if="place && isSurvey"
          class="fs-values"
        >
          <div class="fs-value"><label>RA:</label> <span>{{ formatHms(place.get_RA() * H2R) }}</span></div>
          <div class="fs-value"><label>Dec:</label> <span>{{ formatDegLat(place.get_dec() * D2R) }}</span></div>
          <div v-if="altAz" class="fs-value"><label>Alt:</label> <span>{{ formatDegLat(altAz.get_alt() * D2R) }}</span></div>
          <div v-if="altAz" class="fs-value"><label>Az:</label> <span>{{ formatDegAz(altAz.get_az() * D2R) }}</span></div>
          <div v-if="riseSet" class="fs-value"><label>Rise:</label>
            <span v-if="!riseSet.bNeverRises">{{ formatDecimal(riseSet.rise) }}</span>
            <span v-else>N/A</span>
          </div>
          <div v-if="riseSet" class="fs-value"><label>Transit:</label><span>{{ formatDecimal(riseSet.transit) }}</span></div>
          <div v-if="riseSet" class="fs-value"><label>Set:</label>
            <span v-if="riseSet.bValid || riseSet.bNeverRises">{{ formatDecimal(riseSet.set) }}</span>
            <span v-else>N/A</span>
          </div>
        </div>
      </div>
      <h5 v-if="credits"><strong>Image Credit:</strong> {{ credits }}</h5>
      <div class="fs-buttons">
        <button 
          v-if="place"
          @click="showObject"
        >
          Show Object
        </button>
        <button
          v-if="imageset != null"
          @click="setAsBackground"
        >
          Set as background
        </button>
        <button
          v-if="imageset != null"
          @click="setAsForeground"
        >
          Set as foreground
        </button>
      </div>
      <div class="fs-logos">
        <a
          v-for="(info, index) in infoURLData"
          :key="index"
          :class="['icon-link', info.name]"
          :alt="info.alt"
          :href="info.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img :src="info.img">
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapActions, mapState } from "pinia";
import { defineComponent, PropType } from 'vue';
import { formatDecimalHours, fmtHours, D2R, H2R, R2D, fmtDegLat, formatSexagesimal } from "@wwtelescope/astro";
import { AstroCalc, Circle, Constellations, Coordinates, Imageset, Place, RiseSetDetails, Settings, SpaceTimeController } from "@wwtelescope/engine";
import { engineStore } from '@wwtelescope/engine-pinia';
import { Classification, ImageSetType } from '@wwtelescope/engine-types';

import { SearchDataProvider } from './search';

export default defineComponent({
  props: {
    modelValue: { type: Boolean, required: true },
    searchProvider: { type: Object as PropType<SearchDataProvider>, required: true },
    position: { type: Object as PropType<[number, number]>, required: true },
  },

  data() {
    const canvasSize = 150;
    const width = 400;
    const alpha = Math.PI / 18;
    return {
      place: null as Place | null,
      circle: null as Circle | null,
      crosshairsDrawn: false,
      crosshairsColor: "rgba(216, 216, 216, 0.5)",
      backgroundColor: "rgba(25, 30, 43, 0.7)",
      alpha,
      width,
      canvasSize,
      D2R,
      H2R,
    };
  },

  emits: {
    "update:modelValue": (_value: boolean) => true,
    "place": (_place: Place | null) => true,
  },

  unmounted() {
    this.clearCircle();
  },

  methods: {
    ...mapActions(engineStore, [
      "addAnnotation",
      "addImagesetToRepository",
      "removeAnnotation",
      "gotoTarget",
      "setBackgroundImageByName",
      "setForegroundImageByName",
      "setForegroundOpacity",
    ]),
    close(): void {
      this.$emit("update:modelValue", false);
    },
    formatHms(angleRad: number): string {
      return fmtHours(angleRad, "h", "m", 1, "s");
    },
    formatDegLat(lat: number): string {
      return fmtDegLat(lat);
    },
    formatDegAz(az: number): string {
      return formatSexagesimal({
        value: az * R2D,
        showPlus: false,
        padWhole: 2,
        firstSeparator: ":",
        secondSeparator: ":",
        precision: 0,
      });
    },
    formatDecimal(hours: number): string {
      return formatDecimalHours(hours); 
    },
    showObject() {
      if (this.place !== null) {
        this.gotoTarget({
          place: this.place,
          noZoom: false,
          instant: false,
          trackObject: true,
        });
      }
    },
    setAsForeground() {
      if (this.imageset != null) {
        this.addImagesetToRepository(this.imageset);
        this.setForegroundImageByName(this.imageset.get_name());
        this.setForegroundOpacity(100);
      }
    },
    setAsBackground() {
      if (this.imageset != null) {
        this.addImagesetToRepository(this.imageset);
        this.setBackgroundImageByName(this.imageset.get_name());
      }
    },
    updateClosest() {
      const position = this.findRADecForScreenPoint({ x: this.position[0], y: this.position[1] });
      this.searchProvider.placeForLocation({ raDeg: position.ra, decDeg: position.dec }).then(place => {
        this.place = place;
      });
    },
    clearCircle() {
      if (this.circle !== null) {
        this.circle.set_opacity(0);
      }
    },
    updateCircleForPlace(place: Place | null) {
      if (place === null) {
        this.clearCircle();
        return;
      }
      const circle = this.circle !== null ? this.circle : new Circle();
      circle.set_id("finder-scope");
      circle.setCenter(place.get_RA() * 15, place.get_dec());
      circle.set_radius(0.22);
      circle.set_skyRelative(false);
      circle.set_lineWidth(3);
      circle.set_opacity(this.modelValue ? 1 : 0);
      if (this.circle === null) {
        this.circle = circle;
        this.addAnnotation(circle);
      }
    },
    drawCrosshairs() {
      const canvas = this.$el.querySelector(".fs-crosshairs") as HTMLCanvasElement;
      canvas.height = this.canvasSize;
      canvas.width = this.canvasSize;
      const context = canvas.getContext("2d");
      if (context === null) {
        return;
      }
  
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = this.circleRadius;

      const gap = this.canvasSize - 2 * this.circleRadius;

      context.strokeStyle = this.crosshairsColor;
      context.lineWidth = 1;

      context.beginPath();
      context.moveTo(gap, centerY + gap);
      context.lineTo(canvas.width - gap, centerY + gap);
      context.stroke();

      context.beginPath();
      context.moveTo(centerX + gap, gap);
      context.lineTo(centerX + gap, canvas.height - gap);
      context.stroke();

      context.strokeStyle = this.backgroundColor;
      context.fillStyle = "transparent";
      context.lineWidth = 4;

      context.beginPath();
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      context.stroke();

      context.fillStyle = this.backgroundColor;
      context.strokeStyle = "transparent";
      context.lineWidth = 0;

      context.beginPath();
      context.arc(centerX, centerY, radius, 0.5 * Math.PI, Math.PI);
      context.lineTo(0, canvas.height);
      context.lineTo(centerX, canvas.height);
      context.fill();

      this.crosshairsDrawn = true;
    },
    clearCrosshairs() {
      const canvas = this.$el.querySelector(".fs-crosshairs") as HTMLCanvasElement;
      if (canvas !== null) {
        const context = canvas.getContext("2d");
        context?.clearRect(0, 0, canvas.width, canvas.height);
      }
      this.crosshairsDrawn = false;
    },
  },

  computed: {
    ...mapState(engineStore, [
      "currentTime",
      "raRad",
      "decRad",
      "findRADecForScreenPoint",
      "zoomDeg",
    ]),
    altAz(): Coordinates | null {
      if (!this.modelValue || this.place === null) {
        return null;
      }
      return Coordinates.equitorialToHorizon(
        Coordinates.fromRaDec(this.place.get_RA(), this.place.get_dec()),
        Coordinates.fromLatLng(this.wwtSettings.get_locationLat(), this.wwtSettings.get_locationLng()),
        this.currentTime,
      );
    },
    constellation(): string {
      return Constellations.fullNames[this.place?.get_constellation() ?? ""];
    },
    classification(): string {
      const type = Classification[this.place?.get_classification() ?? Classification.unidentified];
      // I would prefer to do something like the following, but lookbehind isn't supported
      // for Safari <= 16.3. But all of our classification names are all letters, so this should be fine
      // const addSpaces = /(?<!^)([A-Z])/g;
      const addSpaces = /[a-zA-Z]([A-Z])/g;
      const cls = type.replace(addSpaces, " $1");
      return cls.charAt(0).toUpperCase() + cls.slice(1);
    },
    credits(): string | undefined {
      return this.imageset?.get_creditsText();
    },
    imageset(): Imageset | null | undefined {
      return this.place?.get_backgroundImageset() ?? this.place?.get_studyImageset();
    },
    thumbnail(): string | undefined {
      return this.place?.get_thumbnailUrl() ?? this.imageset?.get_thumbnailUrl();
    },
    isSurvey(): boolean {
      return this.place?.get_type() == ImageSetType.sky;
    },
    names(): string {
      if (!this.place) {
        return "";
      }
      const names = this.place.get_names();
      return names.length > 0 ? names.join(", ") : this.place.get_name();
    },
    queryStringName(): string {
      if (!this.place) {
        return "";
      }
      const nameSegments = this.place.get_name().split(";");
      const index = nameSegments.length > 1 ? 1 : 0;
      const name = encodeURIComponent(nameSegments[index]);
      return name.replace(/%20/g, "+");
    },
    cssVars() {
      const left = this.position[0] - this.width + 0.5 * this.canvasSize;
      const top = this.position[1] - 0.5 * this.canvasSize;
      return {
        "--left": `${left}px`,
        "--top": `${top}px`,
        "--canvas-size": `${this.canvasSize}px`,
        "--header-height": `${this.headerHeight}px`,
        "--info-width": `${this.infoWidth}px`,
        "--width": `${this.width}px`,
        "--fs-background-color": this.backgroundColor,
        "--fs-crosshairs-color": this.crosshairsColor,
      };
    },
    circleRadius(): number {
      return 0.5 * this.canvasSize - 2;
    },
    infoWidth() {
      const deltaX = 0.5 * this.canvasSize * (1 - Math.cos(Math.PI / 2 + this.alpha));
      return this.width - deltaX;
    },
    headerHeight() {
      return 0.5 * this.canvasSize * Math.abs(Math.sin(Math.PI - this.alpha) - Math.sin(Math.PI / 2 + this.alpha));
    },
    riseSet(): RiseSetDetails | null {
      if (this.place === null) {
        return null;
      }
      let type = 0;
      const offset = this.place.get_classification() == Classification.solarSystem ? 0 : 0.5;
      switch (this.place.get_name().toLowerCase()) {
        case "sun":
          type = 1;
          break;
        case "moon":
          type = 2;
          break;
        default:
          type = 0;
          break;
      }
      return AstroCalc.getRiseTransitSet(
        SpaceTimeController.get_jNow() + offset, this.wwtSettings.get_locationLat(), -this.wwtSettings.get_locationLng(),
        this.place.get_RA(), this.place.get_dec(), this.place.get_RA(), this.place.get_dec(),
        this.place.get_RA(), this.place.get_dec(), type);
    },
    wwtSettings(): Settings {
      return Settings.get_active();
    },
    infoURLData() {
      return [
        {
          name: "wikipedia",
          img: "https://upload.wikimedia.org/wikipedia/en/8/80/Wikipedia-logo-v2.svg",
          url: `https://wikipedia.org/wiki/Special:Search?search=${this.queryStringName}`,
          alt: "Look up on Wikipedia",
        },
        {
          name: "ads",
          img: "https://ui.adsabs.harvard.edu/help/img/bbb_assets/ads_partial_logo_dark_background.svg",
          url: `https://ui.adsabs.harvard.edu/search/q=object:%22${this.queryStringName}%22`,
          alt: "Look up on SAO/NASA ADS",
        },
        {
          name: "simbad",
          img: "https://cds.unistra.fr/img/cds/simbad.svg",
          url: `https://simbad.u-strasbg.fr/simbad/sim-id?Ident=${this.queryStringName}`,
          alt: "Look up on SIMBAD",
        },
        {
          name: "ned",
          img: "https://www.ipac.caltech.edu/system/activities/logos/61/small/NED-small_copy.png",
          url: `https://ned.ipac.caltech.edu/cgi-bin/nph-imgdata?objname=${this.queryStringName}`,
          alt: "Look up on NED",
        },
        {
          name: "esasky",
          img: "https://sky.esa.int/esasky/esasky_cl_7_3_9_2025_07_03T09_50_05Z/E36D5EC1618ABCDE1D2EAF66AE09752C.cache.png",
          url: `http://sky.esa.int/?action=goto&target=${(this.place?.get_RA() ?? 0)*15}%20${this.place?.get_dec() ?? 0}&hips=DSS2%20color&fov=${this.zoomDeg/6}&cooframe=J2000&sci=true`,
          alt: "View in ESASky",
        }
      ];
    }
  },

  watch: {
    raRad(_ra: number) {
      if (this.modelValue) {
        this.updateClosest();
      }
    },
    decRad(_dec: number) {
      if (this.modelValue) {
        this.updateClosest();
      }
    },
    position(_location: [number, number]) {
      if (this.modelValue) {
        this.updateClosest();
      }
    },
    modelValue(value: boolean) {
      if (!value) {
        this.place = null;
      }
      this.$nextTick(() => {
        if (value && !this.crosshairsDrawn) {
          this.drawCrosshairs();
        }
      });
    },
    place(newPlace: Place | null) {
      this.updateCircleForPlace(newPlace);
      this.$emit("place", newPlace);
    }
  }
});
</script>

<style lang="less">
.finder-scope {

  position: absolute;
  top: var(--top);
  left: var(--left);
  width: var(--width);
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  pointer-events: auto;
  padding: 5px;
  min-height: var(--canvas-size);
  height: fit-content;
  padding: 0px;
  pointer-events: none;

  .fs-header, .fs-info {
    margin-left: 5px;
  }
}

.fs-moveable {
  position: absolute;
  top: 0;
  left: 0;
  width: calc(var(--width) - var(--canvas-size));
  height: calc(var(--canvas-size) - var(--header-height));
}

.fs-crosshairs {
  position: absolute;
  width: var(--canvas-size);
  height: var(--canvas-size);
  top: 0;
  right: 0;
}

.fs-header {
  position: absolute;
  pointer-events: auto;
  top: calc(var(--canvas-size) - var(--header-height));
  left: 0;
  background: var(--fs-background-color);
  width: calc(var(--width) - var(--canvas-size) - 4px);
  height: var(--header-height);

  a {
    margin-top: 5px;
    height: fit-content;
    display: inline-block;
  }

  img {
    border: 1px solid gray;
    padding: 2px;
    border-radius: 2px;
  }

  .close-icon {
    position: absolute;
    top: 7px;
    right: 7px;

    &:hover {
      cursor: pointer;
    }
  }
}

.fs-info {
  pointer-events: auto;
  position: absolute;
  top: var(--canvas-size);
  left: 0;
  background: var(--fs-background-color);
  width: var(--info-width);

  div {
    font-size: 10pt;
    font-style: normal;
  }
}

.fs-buttons {
  display: flex;
  flex-direction: row;
  gap: 10px;

  button {
    background: transparent;
    border: 1px solid var(--fs-crosshairs-color);
    border-radius: 2px;
    color: white;

    &:hover {
      background: white;
      color: var(--fs-background-color);
      cursor: pointer;
    }
  }
}

.fs-values {
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  grid-template-columns: repeat(2, 1fr);
  grid-auto-flow: column;
  column-gap: 10px;

  .fs-value {
    display: flex;
    justify-content: space-between;
  }
}

.fs-logos {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;

  .icon-link img {
    width: 36px;
    margin: 2px;
  }
}
</style>
