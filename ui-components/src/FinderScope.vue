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

<script setup lang="ts">
import { ref } from 'vue';
import { formatDecimalHours, fmtHours, D2R, H2R, R2D, fmtDegLat, formatSexagesimal } from "@wwtelescope/astro";
import { AstroCalc, Circle, Constellations, Coordinates, Imageset, Place, RiseSetDetails, Settings, SpaceTimeController } from "@wwtelescope/engine";
import { engineStore } from '@wwtelescope/engine-pinia';
import { Classification, ImageSetType } from '@wwtelescope/engine-types';

import { FinderScopeProps } from "./types";

defineProps<FinderScopeProps>();

const canvasSize = 150;
const width = 400;
const alpha = Math.PI / 18;
const place = ref<Place | null>(null);
const circle = ref<Circle | null>(null);
let crosshairsDrawn = true;
const crosshairsColor = "rgba(216, 216, 216, 0.5)";
const backgroundColor = "rgba(25, 30, 43, 0.7)";
</script>
