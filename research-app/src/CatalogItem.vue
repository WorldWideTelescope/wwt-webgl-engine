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
        focusable="false"
        id="name-label"
        class="ellipsize"
        @click="isSelected = !isSelected"
        @keyup.enter="isSelected = !isSelected"
        >{{ catalog.name }}
      </label>
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
        <div class="detail-row">
          <span class="prompt">URL:</span
          ><span class="ellipsize">{{ catalog.url }}</span>
        </div>

        <div class="detail-row" v-if="catalog.description.length > 0">
          <span class="prompt">Description:</span
          ><span>{{ catalog.description }}</span>
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

import { ImagesetInfo } from "@wwtelescope/engine-vuex";
import {
  Color,
  SpreadSheetLayerSetting,
  SpreadSheetLayerSettingsInterfaceRO,
} from "@wwtelescope/engine";
import { ApplyTableLayerSettingsOptions } from "@wwtelescope/engine-helpers";
import { PlotTypes } from "@wwtelescope/engine-types";

import { wwtEngineNamespace, wwtResearchAppNamespace } from "./namespaces";

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
  @Prop({ required: true }) catalog!: ImagesetInfo;
  @Prop({ required: false, default: Color.fromArgb(1, 255, 255, 255) })
  defaultColor!: Color;

  uiPlotTypes = uiPlotTypes;

  // Vuex integration

  beforeCreate(): void {
    this.$options.computed = {
      ...mapState(wwtResearchAppNamespace, {
        visible: (_state, getters) =>
          getters["researchAppHipsCatalogVisibility"](this.catalog),
      }),
      ...mapGetters(wwtEngineNamespace, ["spreadsheetStateForHipsCatalog"]),
      ...this.$options.computed,
    };

    this.$options.methods = {
      ...this.$options.methods,
      ...mapMutations(wwtEngineNamespace, [
        "applyTableLayerSettings",
        "removeCatalogHipsByName",
      ]),
      ...mapMutations(wwtResearchAppNamespace, [
        "removeResearchAppCatalogHips",
        "setResearchAppCatalogHipsVisibility",
      ]),
    };
  }

  // Tied to the store value
  visible!: boolean;

  spreadsheetStateForHipsCatalog!: (
    _n: string
  ) => SpreadSheetLayerSettingsInterfaceRO | null;

  applyTableLayerSettings!: (_o: ApplyTableLayerSettingsOptions) => void;
  removeCatalogHipsByName!: (name: string) => void;
  removeResearchAppCatalogHips!: (catalog: ImagesetInfo) => void;
  setResearchAppCatalogHipsVisibility!: (args: {
    catalog: ImagesetInfo;
    visible: boolean;
  }) => void;

  // Local state

  hasFocus = false;
  isSelected = false;

  get color(): Color {
    const state = this.spreadsheetStateForHipsCatalog(this.catalog.name);

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
    const state = this.spreadsheetStateForHipsCatalog(this.catalog.name);

    if (state !== null) {
      return state.get_enabled();
    } else {
      return true;
    }
  }

  get plotType(): PlotTypes {
    const state = this.spreadsheetStateForHipsCatalog(this.catalog.name);

    if (state !== null) {
      return state.get_plotType();
    }

    return PlotTypes.gaussian;
  }

  set plotType(value: PlotTypes) {
    this.applySettings([["plotType", value]]);
  }

  get scaleFactorDb(): number {
    const state = this.spreadsheetStateForHipsCatalog(this.catalog.name);

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
    this.color = this.defaultColor;
  }

  private applySettings(settings: SpreadSheetLayerSetting[]) {
    // Building on the hack/simplification that the GUID of the catalog's
    // spreadsheet layer is its `datasetName`, even though that is absolutely
    // not a v4 GUID at all.
    this.applyTableLayerSettings({
      id: this.catalog.name,
      settings: settings,
    });
  }

  handleDelete() {
    this.removeResearchAppCatalogHips(this.catalog);
    this.removeCatalogHipsByName(this.catalog.name);
  }

  handleToggle() {
    this.setResearchAppCatalogHipsVisibility({
      catalog: this.catalog,
      visible: !this.visible,
    });
  }

  handleColorChange(colorData: VueColorData) {
    const rgba = colorData["rgba"];
    this.color = Color.fromArgb(rgba["a"], rgba["r"], rgba["g"], rgba["b"]);
  }

  @Watch("visible")
  onVisibilityChange(val: boolean) {
    this.applySettings([["enabled", val]]);
  }

  @Watch("enabled")
  onEnabledChange(val: boolean) {
    this.setResearchAppCatalogHipsVisibility({
      catalog: this.catalog,
      visible: val,
    });
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

.icon-button {
  cursor: pointer;
  margin: 2px;
  width: 1em;
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
