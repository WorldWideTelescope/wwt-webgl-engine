<template>
  <div
    class="finder-scope"
    v-show="modelValue && place"
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
      <div><strong>Classification:</strong> <span>{{ classification }}</span></div>
      <div v-if="isSurvey"><strong>Constellation:</strong> <span>{{ constellation }}</span></div>
      <div><strong>Names:</strong> <span>{{ names }}</span></div>
      <hr />
      <div
        v-if="place && isSurvey"
      >
        <div><label>RA</label>: <span>{{ formatHms(place.get_RA()) }}</span></div>
        <div><label>Dec</label>: <span>{{ formatHms(place.get_dec()) }}</span></div>
      </div>
      <h5 v-if="credits"><strong>Image Credit:</strong> {{ credits }}</h5>
    </div>
  </div>
</template>

<script lang="ts">
import { mapActions, mapState } from "pinia";
import { defineComponent, PropType } from 'vue';
import { fmtHours } from "@wwtelescope/astro";
import { Circle, Constellations, Coordinates, Imageset, Place } from "@wwtelescope/engine";
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
    const width = 350;
    const alpha = Math.PI / 18;
    return {
      place: null as Place | null,
      circle: null as Circle | null,
      crosshairsDrawn: false,
      alpha,
      width,
      canvasSize,
    };
  },

  emits: {
    "update:modelValue": (_value: boolean) => true,
    "place": (_place: Place) => true,
  },

  methods: {
    ...mapActions(engineStore, [
      "addAnnotation",
      "removeAnnotation",
    ]),
    close(): void {
      this.$emit("update:modelValue", false);
    },
    formatHms(angleRad: number): string {
      return fmtHours(angleRad);
    },
    updateClosest() {
      const position = this.findRADecForScreenPoint({ x: this.position[0], y: this.position[1] });
      this.searchProvider.closestLocation({ raDeg: position.ra, decDeg: position.dec }).then(place => {
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
        console.log("Adding circle");
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
      const radius = canvas.width / 2;

      context.strokeStyle = "rgba(25, 30, 43, 0.7)";
      context.fillStyle = "transparent";
      context.lineWidth = 4;

      context.beginPath();
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      context.fill();
      context.stroke();

      context.fillStyle = "rgba(25, 30, 43, 0.7)";
      context.strokeStyle = "transparent";
      context.lineWidth = 0;

      context.beginPath();
      context.arc(centerX, centerY, radius, 0.5 * Math.PI, Math.PI);
      context.lineTo(0, canvas.height);
      context.lineTo(centerX, canvas.height);
      context.fill();
      context.stroke();

      context.strokeStyle = "rgba(216, 216, 216, 0.5)";
      context.lineWidth = 1;

      context.beginPath();
      context.moveTo(0, centerY);
      context.lineTo(canvas.width, centerY);
      context.stroke();

      context.beginPath();
      context.moveTo(centerX, 0);
      context.lineTo(centerX, canvas.height);
      context.stroke();

      this.crosshairsDrawn = true;

    },
    clearCrosshairs() {
      const canvas = this.$el.querySelector(".fs-crosshairs") as HTMLCanvasElement;
      if (canvas !== null) {
        const context = canvas.getContext("2d");
        context?.clearRect(0, 0, canvas.width, canvas.height);
      }
      this.crosshairsDrawn = false;
    }
  },

  computed: {
    ...mapState(engineStore, [
      "currentTime",
      "raRad",
      "decRad",
      "findRADecForScreenPoint",
    ]),
    // altAz(): Coordinates | null {
    //   if (this.place === null) {
    //     return null;
    //   }
    //   return Coordinates.equitorialToHorizon(
    //     Coordinates.fromRaDec(this.place.get_RA(), this.place.get_dec()),
    //     Coordinates.fromLatLng(),
    //     this.currentTime,
    //   );
    // },
    constellation(): string {
      return Constellations.fullNames[this.place?.get_constellation() ?? ""];
    },
    classification(): string {
      const type = Classification[this.place?.get_classification() ?? Classification.unidentified];
      const addSpaces = /(?<!^)([A-Z])/;
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
      return this.place?.get_thumbnailUrl() ?? (this.imageset?.get_thumbnailUrl());
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
      };
    },
    infoWidth() {
      const deltaX = 0.5 * this.canvasSize * (1 - Math.cos(Math.PI / 2 + this.alpha));
      return this.width - deltaX;
    },
    headerHeight() {
      return 0.5 * this.canvasSize * Math.abs(Math.sin(Math.PI - this.alpha) - Math.sin(Math.PI / 2 + this.alpha));
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
      if (value) {
        this.updateClosest();
      } else {
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
    }
  }
});
</script>

<style scoped lang="less">
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

  .fs-header, .fs-info {
    margin-left: 5px;
  }
}

.fs-moveable {
  pointer-events: none;
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
  top: calc(var(--canvas-size) - var(--header-height));
  left: 0;
  background: rgba(25, 30, 43, 0.7);
  width: calc(var(--width) - var(--canvas-size) - 1px);
  height: var(--header-height);

  a {
    height: fit-content;
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
  }
}

.fs-info {
  position: absolute;
  top: var(--canvas-size);
  left: 0;
  background: rgba(25, 30, 43, 0.7);
  width: var(--info-width);

  div {
    font-size: 10pt;
    font-style: normal;
  }
}
</style>
