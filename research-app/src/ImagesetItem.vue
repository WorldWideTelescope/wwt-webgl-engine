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
      </div>
    </transition-expand>
  </div>
</template>

<script lang="ts">
import { mapGetters, mapMutations, mapState } from "vuex";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import { ImageSetLayerSetting } from "@wwtelescope/engine";
import { ApplyFitsLayerSettingsOptions } from "@wwtelescope/engine-helpers";
import { ImageSetLayerState } from "@wwtelescope/engine-vuex";

import { wwtEngineNamespace } from "./namespaces";

@Component
export default class ImagesetItem extends Vue {
  @Prop({ required: true }) imageset!: ImageSetLayerState;

  // Vuex integration

  beforeCreate(): void {
    this.$options.methods = {
      ...mapMutations(wwtEngineNamespace, [
        "applyFitsLayerSettings",
        "deleteLayer",
      ]),
      ...this.$options.methods,
    };
  }

  applyFitsLayerSettings!: (_o: ApplyFitsLayerSettingsOptions) => void;
  deleteLayer!: (id: string) => void;

  // Local state

  hasFocus = false;
  isSelected = false;

  get twoWayOpacity(): number {
    return this.imageset.settings.opacity;
  }

  set twoWayOpacity(v: number) {
    this.applySettings([["opacity", v]]);
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

.icon-button {
  cursor: pointer;
  display: inline-block;
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

.flex-row {
  display: inline-flex;
  flex-flow: row nowrap;
  align-items: center;
}

.scrubber {
  flex: 1;
  cursor: pointer;
}
</style>
