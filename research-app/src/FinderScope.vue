<template>
  <div
    class="finder-scope"
    v-if="place"
    :style="cssVars"
  >
    <div class="moveable">
      <font-awesome-icon
        icon="xmark"
        size="lg"
        class="close-icon"
        @keyup.enter="close"
        @click="close"
      ></font-awesome-icon>
      <a class="thumbnail">
        <img :src="thumbnail" />
      </a>
      <h4 v-if="isSurvey"><strong>Constellation:</strong> <span>{{ constellation }}</span></h4>
      <h4><strong>Names:</strong> <span>{{ names }}</span></h4>
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
import { mapState } from "pinia";
import { defineComponent, PropType } from 'vue';
import { fmtHours } from "@wwtelescope/astro";
import { Constellations, Imageset, Place } from "@wwtelescope/engine";
import { engineStore } from '@wwtelescope/engine-pinia';
import { Classification, ImageSetType } from '@wwtelescope/engine-types';

import { SearchDataProvider } from './search';

export default defineComponent({
  props: {
    modelValue: { type: Boolean, required: true },
    searchProvider: { type: Object as PropType<SearchDataProvider>, required: true },
    position: { type: Array, required: true },
  },

  data() {
    return {
      place: null as Place | null,
    };
  },

  emits: {
    "update:modelValue": (_value: boolean) => true,
  },

  methods: {
    close(): void {
      this.$emit("update:modelValue", false);
      console.log("CLOSE");
    },
    formatHms(angleRad: number): string {
      return fmtHours(angleRad);
    },
    updateClosest(raRad: number, decRad: number) {
      this.searchProvider.closestLocation({ ra: raRad, dec: decRad }).then(place => {
        this.place = place;
      });
    }
  },

  computed: {
    ...mapState(engineStore, [
      "raRad",
      "decRad",
    ]),
    constellation(): string {
      return Constellations.fullNames[this.place?.get_constellation() ?? ""];
    },
    classification(): string {
      const type = Classification[this.place?.get_classification() ?? 0];
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
        "--top": `${this.position[0]}px`,
        "--left": `${this.position[1]}px`,
      };
    },
  },

  watch: {
    raRad(ra: number) {
      this.updateClosest(ra, this.decRad);
    },
    decRad(dec: number) {
      this.updateClosest(this.raRad, dec);
    }
  }
});
</script>

<style scoped lang="less">
.finder-scope {
  position: absolute;
  top: var(--top);
  left: var(--left);
  background: rgba(25, 30, 43, 0.7);
  color: rgba(255, 255, 255, 0.8);
  pointer-events: auto;
}
</style>
