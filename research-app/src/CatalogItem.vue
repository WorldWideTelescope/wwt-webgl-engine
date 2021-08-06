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
        >{{ catalog.name }}</label
      >
      <span id="buttons-container">
        <a href="#" v-hide="!hasFocus" @click="handleDelete" class="icon-link"
          ><font-awesome-icon class="icon" icon="times"
        /></a>
        <a href="#" v-hide="!hasFocus" @click="handleToggle" class="icon-link"
          ><font-awesome-icon
            v-if="visible"
            class="icon"
            icon="eye" /><font-awesome-icon
            v-if="!visible"
            class="icon"
            icon="eye-slash"
        /></a>
      </span>
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
      </div>
    </transition-expand>
  </div>
</template>

<script lang="ts">
import { mapGetters, mapMutations, mapState } from "vuex";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import { ImagesetInfo } from "@wwtelescope/engine-vuex";
import { Color, Imageset, SpreadSheetLayerSetting } from "@wwtelescope/engine";
import { ApplyTableLayerSettingsOptions } from "@wwtelescope/engine-helpers";

import { wwtEngineNamespace, wwtResearchAppNamespace } from "./namespaces";

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

  hasFocus = false;
  isSelected = false;
  color = new Color();
  // Tied to the store value
  visible!: boolean;

  tableId = "";

  // Vuex integration

  beforeCreate(): void {
    this.$options.computed = {
      ...mapState(wwtResearchAppNamespace, {
        visible: (_state, getters) =>
          getters["researchAppHipsCatalogVisibility"](this.catalog),
      }),
      ...mapGetters(wwtEngineNamespace, ["lookupImageset"]),
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

  applyTableLayerSettings!: (_o: ApplyTableLayerSettingsOptions) => void;
  lookupImageset!: (_n: string) => Imageset | null;
  removeCatalogHipsByName!: (name: string) => void;
  removeResearchAppCatalogHips!: (catalog: ImagesetInfo) => void;
  setResearchAppCatalogHipsVisibility!: (args: {
    catalog: ImagesetInfo;
    visible: boolean;
  }) => void;

  // Implementation

  mounted() {
    this.color = this.defaultColor;
  }

  private applySettings(settings: SpreadSheetLayerSetting[]) {
    if (!this.tableId) {
      // This is potentially a bit racey -- the table ID isn't set up until
      // the HiPS catalog has loaded its metadata, which is asynchronous and
      // depends on a network request.
      const imgset = this.lookupImageset(this.catalog.name);

      if (imgset !== null) {
        const hips = imgset.get_hipsProperties();

        if (hips !== null) {
          this.tableId = hips.get_catalogSpreadSheetLayer().id.toString();
        }
      }
    }

    this.applyTableLayerSettings({
      id: this.tableId,
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
    const newColor = Color.fromArgb(rgba["a"], rgba["r"], rgba["g"], rgba["b"]);
    this.color = newColor;

    if (this.visible) {
      this.applySettings([
        ["color", this.color],
        ["opacity", this.color.a],
      ]);
    }
  }

  @Watch("visible")
  onVisibilityChange(val: boolean) {
    if (val) {
      this.applySettings([
        ["color", this.color],
        ["opacity", this.color.a],
      ]);
    } else {
      this.applySettings([["opacity", 0]]);
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

.icon {
  color: white;
  margin: auto 1%;
  float: right;
}

.icon-link {
  height: 100%;
  background: #404040;
}

.prompt {
  font-size: 11pt;
  font-weight: bold;
  padding-right: 5px;
}

.detail-row {
  padding: 1px 0px;
}

.ellipsize {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
