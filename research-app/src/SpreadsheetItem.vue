<template>
  <div
    id="root-container"
    @mouseenter="hasFocus = true"
    @mouseleave="hasFocus = false"
    @focus="hasFocus = true"
    @blur="hasFocus = false"
  >
    <div
      id="main-container"
    >
      <label
        v-show="!editing"
        focusable="false"
        id="name-label"
        class="ellipsize"
        @click="isSelected = !isSelected"
        @keyup.enter="isSelected = !isSelected"
        >{{ layer.name }}</label
      >
      <input v-show="editing" class="name-input" @blur="editing = false" />
      <font-awesome-icon
        v-if="!isLayerHips"
        v-hide="!hasFocus"
        @click="handleEditClick"
        :class="['icon-button', { 'icon-active': editing }]"
        icon="pencil-alt"
      />
      <font-awesome-icon
        v-hide="!hasFocus"
        class="icon-button"
        :icon="visible ? 'eye' : 'eye-slash'"
        @click="handleToggle"
      />
      <font-awesome-icon
        v-hide="!hasFocus"
        class="icon-button"
        icon="times"
        @click="handleDelete"
      />
    </div>
    <transition-expand>
      <div v-if="isSelected" class="detail-container">
        <div class="detail-row" v-if="isLayerHips">
          <span class="prompt">URL:</span
          ><span class="ellipsize">{{ layer.url }}</span>
        </div>

        <div class="detail-row" v-if="isLayerHips && layer.description.length > 0">
          <span class="prompt">Description:</span
          ><span>{{ layer.description }}</span>
        </div>

        <div class="detail-row">
          <span class="prompt">Color:</span>
          <v-popover class="circle-popover">
            <font-awesome-icon
              icon="circle"
              size="lg"
              :style="{
                color: `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`,
              }"
            ></font-awesome-icon>
            <template slot="popover">
              <vue-color-chrome
                :value="this.color"
                @input="handleColorChange"
              ></vue-color-chrome>
            </template>
          </v-popover>
        </div>

        <div class="detail-row">
          <span class="prompt">Marker:</span
          ><select v-model="plotType">
            <option
              v-for="pt in uiPlotTypes"
              v-bind:value="pt.wwt"
              v-bind:key="pt.desc"
            >
              {{ pt.desc }}
            </option>
          </select>
        </div>

        <div class="detail-row">
          <span class="prompt">Size adjust:</span>
          <div class="flex-row">
            <font-awesome-icon
              class="icon-button"
              size="lg"
              icon="minus-circle"
              @keyup.enter="doAdjustSize(false)"
              @click="doAdjustSize(false)"
              tabindex="0"
            />
            <input
              type="text"
              class="scale-factor-input"
              v-model.lazy="scaleFactorDbText"
            />
            <font-awesome-icon
              class="icon-button"
              size="lg"
              icon="plus-circle"
              @keyup.enter="doAdjustSize(true)"
              @click="doAdjustSize(true)"
              tabindex="0"
            />
          </div>
        </div>
      </div>
    </transition-expand>
  </div>
</template>

<script lang="ts">
import { mapGetters, mapMutations, mapState } from "vuex";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import {
  Color,
  Guid,
  SpreadSheetLayerSetting,
  SpreadSheetLayerSettingsInterfaceRO,
} from "@wwtelescope/engine";
import { ApplyTableLayerSettingsOptions } from "@wwtelescope/engine-helpers";
import { PlotTypes } from "@wwtelescope/engine-types";

import { wwtEngineNamespace, wwtResearchAppNamespace } from "./namespaces";
import { CatalogLayerInfo, ImagesetInfo } from "@wwtelescope/engine-vuex";

interface UiPlotTypes {
  wwt: PlotTypes;
  desc: string;
}

const uiPlotTypes: UiPlotTypes[] = [
  { wwt: PlotTypes.gaussian, desc: "Gaussian" },
  { wwt: PlotTypes.circle, desc: "Circle" },
  { wwt: PlotTypes.pushPin, desc: "Push-pin" },
  // The other types don't currently render well.
  // "point": starts out OK but gets gnarly if the catalog is dense and you zoom in.
  // "square": actually renders as a flag
  // "custom": handled same as push-pin in the engine
];

interface VueColorData {
  rgba: {
    a: number;
    r: number;
    g: number;
    b: number;
  };
}

@Component
export default class CatalogItem extends Vue {
  @Prop({ required: true }) layer!: CatalogLayerInfo;
  @Prop({ required: false, default: Color.fromArgb(1, 255, 255, 255) })

  defaultColor!: Color;

  uiPlotTypes = uiPlotTypes;

  // Vuex integration

  beforeCreate(): void {
    this.$options.computed = {
      ...mapState(wwtResearchAppNamespace, {
        visible: (_state, getters) =>
          getters["researchAppTableLayerVisibility"](this.layer),
      }),
      ...mapGetters(wwtEngineNamespace, [
        "spreadsheetState",
      ]),
      ...this.$options.computed,
    };

    this.$options.methods = {
      ...this.$options.methods,
      ...mapMutations(wwtEngineNamespace, [
        "applyTableLayerSettings",
        "deleteLayer",
        "removeCatalogHipsByName",
      ]),
      ...mapMutations(wwtResearchAppNamespace, [
        "removeResearchAppTableLayer",
        "setResearchAppTableLayerVisibility",
      ]),
    };
  }

  // Tied to the store value
  visible!: boolean;

  spreadsheetState!: (layer: CatalogLayerInfo) => SpreadSheetLayerSettingsInterfaceRO | null;

  applyTableLayerSettings!: (_o: ApplyTableLayerSettingsOptions) => void;
  deleteLayer!: (id: string | Guid) => void;
  removeCatalogHipsByName!: (name: string) => void;
  removeResearchAppTableLayer!: (layer: CatalogLayerInfo) => void;
  setResearchAppTableLayerVisibility!: (args: {
    layer: CatalogLayerInfo;
    visible: boolean;
  }) => void;

  // Local state

  editing = false;
  hasFocus = false;
  isSelected = false;
  isLayerHips = false;

  layerId(): string {
    return this.layer instanceof ImagesetInfo ? this.layer.name : this.layer.id;
  }

  layerState(): SpreadSheetLayerSettingsInterfaceRO | null {
    return this.spreadsheetState(this.layer);
  }

  get color(): Color {
    const state = this.layerState();

    if (state !== null) {
      return state.get_color();
    } else {
      return this.defaultColor;
    }
  }

  set color(value: Color) {
    this.applySettings([
      ["color", value],
      ["opacity", value.a],
    ]);
  }

  get enabled(): boolean {
    const state = this.layerState();

    if (state !== null) {
      return state.get_enabled();
    } else {
      return true;
    }
  }

  get plotType(): PlotTypes {
    const state = this.layerState();

    if (state !== null) {
      return state.get_plotType();
    }

    return PlotTypes.gaussian;
  }

  set plotType(value: PlotTypes) {
    this.applySettings([["plotType", value]]);
  }

  get scaleFactorDb(): number {
    const state = this.layerState();

    if (state !== null) {
      return 10 * Math.log10(state.get_scaleFactor());
    }

    return 0.0;
  }

  set scaleFactorDb(value: number) {
    this.applySettings([["scaleFactor", Math.pow(10, 0.1 * value)]]);
  }

  // I can't find a customizable Vue numeric input that has good TypeScript
  // support, so we just hand-roll the processing to give nice textual
  // presentation.
  get scaleFactorDbText(): string {
    if (this.scaleFactorDb == 0) {
      return "0.00";
    } else if (this.scaleFactorDb < 0) {
      return this.scaleFactorDb.toFixed(2);
    } else {
      return "+" + this.scaleFactorDb.toFixed(2);
    }
  }

  set scaleFactorDbText(value: string) {
    const n = Number(value);

    if (isFinite(n)) {
      this.scaleFactorDb = n;
    }
  }

  // Implementation

  mounted() {
    this.isLayerHips = this.layer instanceof ImagesetInfo;
  }

  private applySettings(settings: SpreadSheetLayerSetting[]) {
    // For HiPS layers, this builds on the hack/simplification that the GUID of
    // the catalog's spreadsheet layer is its `datasetName`, even though that 
    // is absolutely not a v4 GUID at all.
    this.applyTableLayerSettings({
      id: this.layerId(),
      settings: settings,
    });
  }

  handleDelete() {
    this.removeResearchAppTableLayer(this.layer);
    if (this.layer instanceof ImagesetInfo) {
      this.removeCatalogHipsByName(this.layer.name);
    } else {
      this.deleteLayer(this.layer.id);
    }
  }

  handleToggle() {
    this.setResearchAppTableLayerVisibility({
      layer: this.layer,
      visible: !this.visible,
    });
  }

  handleColorChange(colorData: VueColorData) {
    const rgba = colorData["rgba"];
    this.color = Color.fromArgb(rgba["a"], rgba["r"], rgba["g"], rgba["b"]);
  }

  handleEditClick() {
    this.editing = !this.editing;
  }

  @Watch("visible")
  onVisibilityChange(val: boolean) {
    this.applySettings([["enabled", val]]);
  }

  @Watch("enabled")
  onEnabledChange(val: boolean) {
    this.setResearchAppTableLayerVisibility({
      layer: this.layer,
      visible: val,
    });
  }

  @Watch("editing")
  editingChanged(val: boolean, _oldVal: boolean) {
    const input: HTMLInputElement = this.$el.getElementsByClassName(
      "name-input"
    )[0] as HTMLInputElement;
    if (val) {
      input.value = this.layer.name;
    } else {
      this.layer.name = input.value;
    }
  }

  doAdjustSize(bigger: boolean) {
    if (bigger) {
      this.scaleFactorDb += 0.5;
    } else {
      this.scaleFactorDb -= 0.5;
    }
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
  display: flex;
  justify-content: space-between;
  gap: 2px;
}

#name-label {
  display: inline-block;
  flex: 1;
  padding-right: 10px;

  &:hover {
    cursor: pointer;
  }
}

.circle-popover {
  display: inline;

  &:hover {
    cursor: pointer;
  }
}

.detail-container {
  font-size: 9pt;
  margin: 0px 5px;
  padding-left: 15px;
}

.icon-active {
  color: darkred;
}

.icon-button {
  cursor: pointer;
  margin: 2px;
  width: 1em;
}

.name-input {
  display: inline-block;
  background: #999999;
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
  width: 100%;
}

.flex-row {
  display: inline-flex;
  flex-flow: row nowrap;
  align-items: center;
  flex: 50%;
}

.scale-factor-input {
  width: 50%;
  text-align: center;
}

// For styling the nested vue-color component
// This lets us style that component without de-scoping this CSS
/deep/ * {
  &.vc-chrome-body {
    background-color: #404040;
  }

  &.vc-chrome-fields .vc-input__input {
    background-color: #cccccc;
  }

  &.vc-chrome-fields .vc-input__label {
    color: #cccccc;
  }

  &.vc-chrome-toggle-icon path {
    fill: #cccccc;
  }

  &.vc-chrome-toggle-icon:hover path {
    fill: #404040;
  }
}
</style>
