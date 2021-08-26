<template>
  <div id="root-container">
    <div
      id="main-container"
      @mouseenter="hasFocus = true"
      @mouseleave="hasFocus = false"
      @focus="hasFocus = true"
      @blur="hasFocus = false"
    >
      <label
        focusable="false"
        id="name-label"
        class="ellipsize"
        @click="isSelected = !isSelected"
        @keyup.enter="isSelected = !isSelected"
        >{{ imageset.settings.name }}</label
      >
      <span id="buttons-container" v-hide="!hasFocus">
        <a href="#" @click="handleDelete" class="icon-link"
          ><font-awesome-icon class="icon" icon="times"
        /></a>
        <a href="#" @click="handleVisibility" class="icon-link"
          ><font-awesome-icon
            class="icon"
            :icon="imageset.settings.enabled ? 'eye' : 'eye-slash'"
        /></a>
      </span>
    </div>
    <transition-expand>
      <div v-if="isSelected" class="detail-container">
        <div class="detail-row">
          <span class="prompt">Opacity:</span>
          <vue-slider
            class="scrubber"
            v-model="twoWayOpacity"
            :max="1"
            :duration="0"
            :interval="0.01"
            :contained="true"
            :hide-label="true"
            :use-keyboard="true"
          ></vue-slider>
        </div>

        <div class="detail-row">
          <span class="prompt">Colormap:</span
          ><select v-model="twoWayColorMapperName">
            <option
              v-for="x in uiColorMaps"
              v-bind:value="x.wwt"
              v-bind:key="x.desc"
            >
              {{ x.desc }}
            </option>
          </select>
        </div>

        <div class="detail-row">
          <span class="prompt">Stretch:</span
          ><select v-model="twoWayScaleType">
            <option
              v-for="x in uiScaleTypes"
              v-bind:value="x.wwt"
              v-bind:key="x.desc"
            >
              {{ x.desc }}
            </option>
          </select>
        </div>

        <div class="detail-row">
          <span class="prompt">Low cutoff:</span>
          <input
            type="text"
            class="detail-input"
            v-model.lazy="twoWayVMinText"
          />
          <font-awesome-icon
            class="icon-button"
            icon="crosshairs"
            size="lg"
            @click="handleCutoffInteract(false)"
            @keyup.enter="handleCutoffInteract(false)"
          ></font-awesome-icon>
        </div>

        <div class="detail-row">
          <span class="prompt">High cutoff:</span>
          <input
            type="text"
            class="detail-input"
            v-model.lazy="twoWayVMaxText"
          />
          <font-awesome-icon
            class="icon-button"
            icon="crosshairs"
            size="lg"
            @click="handleCutoffInteract(true)"
            @keyup.enter="handleCutoffInteract(true)"
          ></font-awesome-icon>
        </div>
      </div>
    </transition-expand>
  </div>
</template>

<script lang="ts">
import { mapActions, mapMutations } from "vuex";
import { Component, Prop, Vue } from "vue-property-decorator";

import { ScaleTypes } from "@wwtelescope/engine-types";
import { ImageSetLayerSetting } from "@wwtelescope/engine";
import {
  ApplyFitsLayerSettingsOptions,
  StretchFitsLayerOptions,
} from "@wwtelescope/engine-helpers";
import { ImageSetLayerState } from "@wwtelescope/engine-vuex";

import { wwtEngineNamespace } from "./namespaces";

interface UiColorMaps {
  wwt: string;
  desc: string;
}

const uiColorMaps: UiColorMaps[] = [
  { wwt: "viridis", desc: "Viridis" },
  { wwt: "plasma", desc: "Plasma" },
  { wwt: "inferno", desc: "Inferno" },
  { wwt: "magma", desc: "Magma" },
  { wwt: "cividis", desc: "Cividis" },
  { wwt: "rdylbu", desc: "Thermal (Red-Yellow-Blue)" },
  { wwt: "gray", desc: "Black-to-White" },
  { wwt: "greys", desc: "White-to-Black" },
  { wwt: "purples", desc: "White-to-Purple" },
  { wwt: "blues", desc: "White-to-Blue" },
  { wwt: "greens", desc: "White-to-Green" },
  { wwt: "oranges", desc: "White-to-Orange" },
  { wwt: "reds", desc: "White-to-Red" },
];

interface UiScaleTypes {
  wwt: ScaleTypes;
  desc: string;
}

const uiScaleTypes: UiScaleTypes[] = [
  { wwt: ScaleTypes.linear, desc: "Linear" },
  { wwt: ScaleTypes.log, desc: "Logarithmic" },
  { wwt: ScaleTypes.squareRoot, desc: "Square Root" },
  { wwt: ScaleTypes.power, desc: "Exponential" },

  // Not fully implemented ... I think ...?
  //{ wwt: ScaleTypes.histogramEqualization, desc: "Hist-Eq" },
];

@Component
export default class ImagesetItem extends Vue {
  @Prop({ required: true }) imageset!: ImageSetLayerState;

  uiColorMaps = uiColorMaps;
  uiScaleTypes = uiScaleTypes;

  // Vuex integration

  beforeCreate(): void {
    this.$options.methods = {
      ...mapMutations(wwtEngineNamespace, [
        "applyFitsLayerSettings",
        "deleteLayer",
        "stretchFitsLayer",
      ]),
      ...this.$options.methods,
    };
  }

  applyFitsLayerSettings!: (_o: ApplyFitsLayerSettingsOptions) => void;
  deleteLayer!: (id: string) => void;
  stretchFitsLayer!: (o: StretchFitsLayerOptions) => void;

  // Local state

  hasFocus = false;
  isSelected = false;

  get twoWayOpacity(): number {
    return this.imageset.settings.opacity;
  }

  set twoWayOpacity(v: number) {
    this.applySettings([["opacity", v]]);
  }

  get twoWayColorMapperName(): string {
    return this.imageset.settings.colorMapperName;
  }

  set twoWayColorMapperName(v: string) {
    this.applySettings([["colorMapperName", v]]);
  }

  get twoWayScaleType(): ScaleTypes {
    return this.imageset.scaleType;
  }

  set twoWayScaleType(v: ScaleTypes) {
    const o: StretchFitsLayerOptions = {
      id: this.imageset.getGuid(),
      vmin: this.imageset.vmin,
      vmax: this.imageset.vmax,
      stretch: v,
    };

    this.stretchFitsLayer(o);
  }

  get twoWayVMax(): number {
    return this.imageset.vmax;
  }

  set twoWayVMax(v: number) {
    const o: StretchFitsLayerOptions = {
      id: this.imageset.getGuid(),
      vmin: this.imageset.vmin,
      vmax: v,
      stretch: this.imageset.scaleType,
    };

    this.stretchFitsLayer(o);
  }

  get twoWayVMaxText(): string {
    return "" + this.twoWayVMax;
  }

  set twoWayVMaxText(v: string) {
    const n = Number(v);

    if (isFinite(n)) {
      this.twoWayVMax = n;
    }
  }

  get twoWayVMin(): number {
    return this.imageset.vmin;
  }

  set twoWayVMin(v: number) {
    const o: StretchFitsLayerOptions = {
      id: this.imageset.getGuid(),
      vmin: v,
      vmax: this.imageset.vmax,
      stretch: this.imageset.scaleType,
    };

    this.stretchFitsLayer(o);
  }

  get twoWayVMinText(): string {
    return "" + this.twoWayVMin;
  }

  set twoWayVMinText(v: string) {
    const n = Number(v);

    if (isFinite(n)) {
      this.twoWayVMin = n;
    }
  }

  // Implementation

  private applySettings(settings: ImageSetLayerSetting[]) {
    this.applyFitsLayerSettings({
      id: this.imageset.getGuid(),
      settings: settings,
    });
  }

  handleDelete() {
    this.deleteLayer(this.imageset.getGuid());
  }

  handleVisibility() {
    this.applySettings([["enabled", !this.imageset.settings.enabled]]);
  }

  handleCutoffInteract(isMax: boolean) {
    let lastrx = 0;
    let lastry = 0;
    let lastCommittedValue = isMax ? this.imageset.vmax : this.imageset.vmin;

    const update = () => {
      const other = isMax ? this.twoWayVMin : this.twoWayVMax;
      const scale = Math.abs(other - lastCommittedValue);
      const delta = scale * Math.pow(10, -1 - lastry);
      const newvalue = lastCommittedValue + delta * lastrx;

      if (Number.isFinite(newvalue)) {
        if (isMax) {
          this.twoWayVMax = newvalue;
        } else {
          this.twoWayVMin = newvalue;
        }
      }
    };

    const onmove = (event: PointerEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      lastrx = (2 * event.clientX) / w - 1; // range: -1 (left edge) => +1 (right edge)
      lastry = (2 * event.clientY) / h - 1; // range: -1 (top edge) => +1 (bottom edge)
      update();
    };

    const onkeydown = (event: KeyboardEvent) => {
      if (event.code == "Space") {
        if (isMax) {
          lastCommittedValue = this.twoWayVMax;
        } else {
          lastCommittedValue = this.twoWayVMin;
        }

        update();
      }
    };

    const cleanup = (event: PointerEvent) => {
      document.documentElement.classList.remove("pointer-tracking");
      document.removeEventListener("pointermove", onmove);
      document.removeEventListener("keydown", onkeydown);
    };

    document.addEventListener("pointermove", onmove);
    document.addEventListener("pointerup", cleanup);
    document.addEventListener("pointercancel", cleanup);
    document.addEventListener("keydown", onkeydown);
    document.documentElement.classList.add("pointer-tracking");
  }
}
</script>

<style scoped lang="less">
#root-container {
  color: white;
  font-weight: bold;
  font-size: 12pt;
  padding: 0px;
  overflow: hidden;

  &:hover {
    background: #999999;
  }
}

#main-container {
  width: calc(100% - 10px);
  padding: 5px;
}

#name-label {
  display: inline-block;
  width: 75%;
  vertical-align: middle;

  &:hover {
    cursor: pointer;
  }
}

#buttons-container {
  width: 25%;
}

.detail-container {
  font-size: 9pt;
  margin: 0px 5px;
  padding-left: 15px;
}

.icon {
  color: white;
  margin: auto 1%;
  float: right;
}

.icon-link {
  height: 100%;
  background: #404040;
}

.icon-button {
  cursor: pointer;
  margin: 2px;
}

.prompt {
  font-size: 11pt;
  font-weight: bold;
  padding-right: 5px;
}

.detail-row {
  padding: 1px 0px;

  // Get nice vertical alignment in individual rows
  display: flex;
  align-items: center;
}

.ellipsize {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.scrubber {
  flex: 1;
  cursor: pointer;
}

.detail-input {
  flex: 1;
  text-align: center;
}
</style>
