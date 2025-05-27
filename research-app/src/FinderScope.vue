<template>
  <div
    class="finder-scope"
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
import { defineComponent } from 'vue';
import { Constellations, Imageset, Place } from "@wwtelescope/engine";
import { fmtHours } from "@wwtelescope/astro";
import { Classification, ImageSetType } from '@wwtelescope/engine-types';

export default defineComponent({
  props: {
    modelValue: { type: Boolean, required: true },
    place: { type: Place, required: true },
    position: { type: Array, required: true },
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
  },

  computed: {
    constellation(): string {
      return Constellations.fullNames[this.place.get_constellation()];
    },
    classification(): string {
      const type = Classification[this.place.get_classification()];
      const addSpaces = /(?<!^)([A-Z])/;
      const cls = type.replace(addSpaces, " $1");
      return cls.charAt(0).toUpperCase() + cls.slice(1);
    },
    credits(): string | undefined {
      return this.imageset?.get_creditsText();
    },
    imageset(): Imageset | null {
      return this.place.get_backgroundImageset() ?? this.place.get_studyImageset();
    },
    thumbnail(): string {
      return this.place.get_thumbnailUrl() ?? (this.imageset?.get_thumbnailUrl());
    },
    isSurvey(): boolean {
      return this.place.get_type() == ImageSetType.sky;
    },
    names(): string {
      const names = this.place.get_names();
      return names.length > 0 ? names.join(", ") : this.place.get_name();
    },
    queryStringName(): string {
      const nameSegments = this.place.get_name().split(";");
      const index = nameSegments.length > 1 ? 1 : 0;
      const name = encodeURIComponent(nameSegments[index]);
      return name.replace(/%20/g, "+");
    },
    cssVars() {
      return {
        "--top": this.position[0],
        "--left": this.position[1],
      };
    },
  }
});
</script>

<style scoped lang="less">
.finder-scope {
  position: relative;
}
</style>
