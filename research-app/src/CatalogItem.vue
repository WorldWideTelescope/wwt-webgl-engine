<template>
  <div id="root-container">
    <div id="main-container" @mouseenter="hasFocus = true" @mouseleave="hasFocus = false" @focus="hasFocus = true" @blur="hasFocus = false">
      <label focusable="false" id="name-label" @click="isSelected = !isSelected" @keyup.enter="isSelected = !isSelected" >{{catalog.name}}</label>
      <span id="buttons-container">
        <a href="#" v-hide="!hasFocus" @click="handleDelete" class="icon-link"><font-awesome-icon class="icon" icon="times"/></a>
        <a href="#" v-hide="!hasFocus" @click="handleToggle" class="icon-link"><font-awesome-icon v-if="visible" class="icon" icon="eye"/><font-awesome-icon v-if="!visible" class="icon" icon="eye-slash"/></a>
      </span>
    </div>
    <transition-expand>
      <div v-if="isSelected" class="detail-container">
        <div class="detail-row"><span class="prompt">URL:</span><span class="url-holder">{{ catalog.url }}</span></div>
        <div class="detail-row" v-if="catalog.description.length > 0"><span class="prompt">Description:</span><span>{{ catalog.description }}</span></div>
        <div class="detail-row"><span class="prompt">Color:</span>
          <v-popover class="circle-popover">
            <font-awesome-icon icon="circle" size="lg" :style="{ 'color' : `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})` }"></font-awesome-icon>
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
import { Color } from '@wwtelescope/engine';

import { wwtEngineNamespace, wwtResearchAppNamespace } from "./namespaces";

interface VueColorData {
  'rgba': {
    'a': number;
    'r': number;
    'g': number;
    'b': number;
  };
}

@Component
export default class CatalogItem extends Vue {
    @Prop({required: true}) catalog!: ImagesetInfo;
    @Prop({required: false, default: Color.fromArgb(1, 255, 255, 255)}) defaultColor!: Color;
    hasFocus = false;
    isSelected = false;
    color = new Color();

    // Tied to the store value
    visible!: boolean;
    
    beforeCreate(): void {
      this.$options.computed = {
        ...mapState(wwtResearchAppNamespace, {
          visible: (_state, getters) => getters['researchAppHipsCatalogVisibility'](this.catalog),
        }),
        ...mapGetters(wwtEngineNamespace, [
          "hipsCatalogColorByName",
        ]),
        ...this.$options.computed,
      }
      
      this.$options.methods = {
        ...this.$options.methods,
        ...mapMutations(wwtEngineNamespace, [
          "removeCatalogHipsByName",
          "setCatalogHipsColorByName",
          "setCatalogHipsOpacityByName",
        ]),
        ...mapMutations(wwtResearchAppNamespace, [
          "removeResearchAppCatalogHips",
          "setResearchAppCatalogHipsVisibility",
        ])
      };
    }

    mounted() {
      this.color = this.defaultColor;
    }

    removeCatalogHipsByName!: (name: string) => void;
    removeResearchAppCatalogHips!: (catalog: ImagesetInfo) => void;
    setCatalogHipsColorByName!: (obj: { name: string; color: Color }) => void;
    setCatalogHipsOpacityByName!: (obj: { name: string; opacity: number }) => void;
    setResearchAppCatalogHipsVisibility!: (args: { catalog: ImagesetInfo; visibility: boolean}) => void;

    handleDelete() {
      this.removeResearchAppCatalogHips(this.catalog);
      this.removeCatalogHipsByName(this.catalog.name);
    }

    handleToggle() {
      this.setResearchAppCatalogHipsVisibility({ catalog: this.catalog, visibility: !this.visible });
    }

    handleColorChange(colorData: VueColorData) {
      const rgba = colorData['rgba'];
      const newColor = Color.fromArgb(rgba['a'], rgba['r'], rgba['g'], rgba['b']);
      this.color = newColor;
      if (this.visible) {
        this.setCatalogHipsColorByName({name: this.catalog.name, color: newColor});
      }
    }

    @Watch('visible')
    onVisibilityChange(val: boolean, oldVal: boolean) {
      if (val) {
        this.setCatalogHipsColorByName({ name: this.catalog.name, color: this.color });
      } else {
        this.setCatalogHipsOpacityByName({ name: this.catalog.name, opacity: 0 });
      }
    }

}
</script>

<style scoped lang="less">

#root-container {
  background: #404040;
  color: white;
  font-weight: bold;
  font-size: 12pt;
  padding: 0px;
  overflow: hidden;
}

#main-container {
  width: calc(100% - 10px);
  padding: 5px;
}

#main-container:hover {
    background: #999999;
}

#name-label {
    display: inline-block;
    width: 75%;
}

#buttons-container {
    width: 25%;
}

.circle-popover {
  display: inline;
}

.detail-container {
    font-size: 9pt;
    margin: 0px 5px;
    padding-left: 15px;
    background: #404040;
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

.url-holder {
    overflow-wrap: break-word;
    word-wrap: break-word;
}

.prompt {
  font-size: 11pt;
  font-weight: bold;
  padding-right: 5px;
}

.detail-row {
  padding: 5px 0px;
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
