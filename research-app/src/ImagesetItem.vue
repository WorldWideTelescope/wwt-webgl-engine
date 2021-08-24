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
      <span id="buttons-container">
        <a href="#" v-hide="!hasFocus" @click="handleDelete" class="icon-link"
          ><font-awesome-icon class="icon" icon="times"
        /></a>
        <a href="#" v-hide="!hasFocus" @click="handleToggle" class="icon-link"
          ><font-awesome-icon
            v-if="enabled"
            class="icon"
            icon="eye" /><font-awesome-icon
            v-if="!enabled"
            class="icon"
            icon="eye-slash"
        /></a>
      </span>
    </div>
    <transition-expand>
      <div v-if="isSelected" class="detail-container">
        <div class="detail-row">
          <span class="prompt">URL:</span><span class="ellipsize">nothing</span>
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

  get enabled(): boolean {
    return this.imageset.settings.enabled;
  }

  // Implementation

  private applySettings(settings: ImageSetLayerSetting[]) {
    this.applyFitsLayerSettings({
      //id: this.guid,
      id: this.imageset.getGuid(),
      settings: settings,
    });
  }

  handleDelete() {
    //this.deleteLayer(this.guid);
    this.deleteLayer(this.imageset.getGuid());
  }

  handleToggle() {
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
</style>
