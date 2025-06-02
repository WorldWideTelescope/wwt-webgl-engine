<template>
  <div
    class="finder-scope"
    v-if="modelValue && place"
    :style="cssVars"
  >
    <canvas class="fs-crosshairs"></canvas>
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
        v-if="isSurvey"
      >
        <p><label>RA</label>: <span>{{ formatHms(place.get_RA()) }}</span></p>
        <p><label>Dec</label>: <span>{{ formatHms(place.get_dec()) }}</span></p>
      </div>
      <h5 v-if="credits"><strong>Image Credit:</strong> {{ credits }}</h5>
    </div>
  </div>
</template>

<script lang="ts">
import { mapActions, mapState } from "pinia";
import { defineComponent, PropType } from 'vue';
import { fmtHours } from "@wwtelescope/astro";
import { Circle, Constellations, Imageset, Place } from "@wwtelescope/engine";
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
    return {
      place: null as Place | null,
      circle: null as Circle | null,
      crosshairsDrawn: false,
      infoWidth: 180,
      canvasSize: 150,
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
        this.removeAnnotation(this.circle);
        this.circle = null;
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
      if (this.circle === null) {
        this.addAnnotation(circle);
        this.circle = circle;
      }
    },
    drawCrosshairs() {
      const canvas = this.$el.querySelector(".fs-crosshairs") as HTMLCanvasElement;
      canvas.height = 170;
      canvas.width = 170;
      const context = canvas.getContext("2d");
      if (context === null) {
        return;
      }
  
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = canvas.width / 2;

      context.beginPath();
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      context.fillStyle = "transparent";
      context.fill();
      context.lineWidth = 4;
      context.strokeStyle = "rgba(25, 30, 43, 0.7)";
      context.stroke();

      context.beginPath();
      context.fillStyle = "rgba(25, 30, 43, 0.7)";
      context.arc(centerX, centerY, radius, 0.5 * Math.PI, Math.PI);
      context.lineTo(0, canvas.height);
      context.lineTo(centerX, canvas.height);
      context.fill();
      context.stroke();

      context.beginPath();
      context.moveTo(0, centerY);
      context.lineTo(canvas.width, centerY);
      context.strokeStyle = "rgba(216, 216, 216, 0.5)";
      context.lineWidth = 1;
      context.stroke();

      context.beginPath();
      context.moveTo(centerX, 0);
      context.lineTo(centerX, canvas.height);
      context.stroke();

    },
    clearCrosshairs() {
      const canvas = this.$el.querySelector(".fs-crosshairs") as HTMLCanvasElement;
      const context = canvas.getContext("2d");
      context?.clearRect(0, 0, canvas.width, canvas.height);
    }
  },

  computed: {
    ...mapState(engineStore, [
      "raRad",
      "decRad",
      "findRADecForScreenPoint",
    ]),
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
      return {
        "--left": `${this.position[0]}px`,
        "--top": `${this.position[1]}px`,
        "--canvas-size": `${this.canvasSize}px`,
        "--info-width": `${this.infoWidth}px`,
        "--width": `${this.width}px`,
      };
    },
    width() {
      return this.infoWidth + this.canvasSize;
    }
  },

  watch: {
    raRad(_ra: number) {
      this.updateClosest();
    },
    decRad(_dec: number) {
      this.updateClosest();
    },
    modelValue(value: boolean) {
      this.clearCircle();
      if (value) {
        this.updateCircleForPlace(this.place);
      }

      this.$nextTick(() => {
        if (value && !this.crosshairsDrawn) {
          this.drawCrosshairs();
        }
      });
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

  .fs-header, .fs-info {
    margin-left: 5px;
  }
}

.fs-crosshairs {
  position: absolute;
  width: var(--canvas-size);
  height: var(--canvas-size);
  top: 0;
  right: calc(var(--canvas-size) / 4);
}

.fs-header {
  position: absolute;
  top: calc(var(--canvas-size) / 2);
  left: 0;
  background: rgba(25, 30, 43, 0.7);
  width: calc(var(--width) - var(--canvas-size));

  a {
    height: fit-content;
  }

  img {
    border: 1px solid gray;
    padding: 2px;
    border-radius: 2px;
  }
}

.fs-info {
  position: absolute;
  top: calc(50px + var(--canvas-size) / 2);
  left: 0;
  background: rgba(25, 30, 43, 0.7);
  width: var(--info-width);

  div {
    font-size: 10pt;
    font-style: normal;
  }
}
</style>
