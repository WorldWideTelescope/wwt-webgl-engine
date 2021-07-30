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
        v-show="!editing"
        focusable="false"
        class="name-label"
        @click="isSelected = !isSelected"
        @keyup.enter="isSelected = !isSelected"
        >{{ source.name }}</label
      >
      <input v-show="editing" class="name-input" @blur="editing = false" />
      <span id="buttons-container">
        <a href="#" v-hide="!hasFocus" @click="handleDelete" class="icon-link"
          ><font-awesome-icon class="icon" icon="times"
        /></a>
        <a
          href="#"
          v-hide="!hasFocus"
          @click="handleMarkerClick"
          class="icon-link"
          ><font-awesome-icon class="icon" icon="map-marker-alt"
        /></a>
        <a
          href="#"
          v-hide="!hasFocus"
          @click="handleEditClick"
          class="icon-link"
          ><font-awesome-icon
            :class="['icon', { 'icon-active': editing }]"
            icon="pencil-alt"
        /></a>
      </span>
    </div>
    <transition-expand>
      <div v-if="isSelected" class="detail-container">
        <div class="detail-row">
          <span class="prompt">RA:</span><span>{{ this.raStr }}</span>
        </div>
        <div class="detail-row">
          <span class="prompt">Dec:</span><span>{{ this.decStr }}</span>
        </div>
        <div class="detail-row">
          <span class="prompt">Catalog:</span
          ><span>{{ this.source.catalogName }}</span>
        </div>
        <div class="detail-row">
          <span class="prompt">Query Coordinates:</span
          ><a
            :href="this.simbadCoordinatesURL"
            target="_blank"
            rel="noopener noreferrer"
            >SIMBAD</a
          >
          |
          <a
            :href="this.nedCoordinatesURL"
            target="_blank"
            rel="noopener noreferrer"
            >NED</a
          >
        </div>
      </div>
    </transition-expand>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */

import { mapActions, mapMutations, mapState } from "vuex";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import { Source } from "./store";
import { wwtEngineNamespace, wwtResearchAppNamespace } from "./namespaces";
import { WWTEngineVuexState } from "@wwtelescope/engine-vuex";
import { fmtDegLat, fmtHours } from "@wwtelescope/astro";

const R2D = 180 / Math.PI;

@Component
export default class SourceItem extends Vue {
  @Prop({ required: true }) source!: Source;
  hasFocus = false;
  isSelected = false;
  editing = false;

  // From the stores
  wwtDegZoom!: number;
  gotoRADecZoom!: (args: {
    raRad: number;
    decRad: number;
    zoomDeg: number;
    instant: boolean;
    rollRad?: number;
  }) => Promise<void>;
  removeSource!: (source: Source) => void;

  beforeCreate(): void {
    this.$options.computed = {
      ...mapState(wwtEngineNamespace, {
        wwtDegZoom: (state, _getters) => (state as WWTEngineVuexState).zoomDeg,
      }),
      ...this.$options.computed,
    };

    this.$options.methods = {
      ...this.$options.methods,
      ...mapActions(wwtEngineNamespace, ["gotoRADecZoom"]),
      ...mapMutations(wwtResearchAppNamespace, [
        "removeSource",
        "setSourceName",
      ]),
    };
  }

  handleDelete() {
    this.removeSource(this.source);
  }

  handleMarkerClick() {
    this.gotoRADecZoom({
      zoomDeg: this.source.zoomDeg ?? this.wwtDegZoom,
      raRad: this.source.ra,
      decRad: this.source.dec,
      instant: false,
    }).catch((err) => console.log(err));
  }

  handleEditClick() {
    this.editing = !this.editing;
  }

  @Watch("editing")
  editingChanged(val: boolean, _oldVal: boolean) {
    const input: HTMLInputElement = this.$el.getElementsByClassName(
      "name-input"
    )[0] as HTMLInputElement;
    if (val) {
      input.value = this.sourceName;
    } else {
      this.sourceName = input.value;
    }
  }

  get raStr() {
    return fmtHours(this.source.ra);
  }

  get decStr() {
    return fmtDegLat(this.source.dec);
  }

  get searchRadius() {
    // The return value is in arcminutes
    // The minimum value that this can return is 1/6 arcminute = 10 arcseconds
    return Math.max((2 * this.wwtDegZoom) / 360, 1 / 6);
  }

  get sourceName(): string {
    return this.source.name;
  }

  set sourceName(name: string) {
    this.source.name = name;
  }

  get simbadCoordinatesURL() {
    const baseURL = "http://simbad.u-strasbg.fr/simbad/sim-coo?";
    const params = {
      "output.format": "HTML",
      Coord: `${this.source.ra * R2D} ${this.source.dec * R2D}`,
      Radius: String(this.searchRadius),
      "Radius.unit": "arcmin",
    };
    return baseURL + new URLSearchParams(params).toString();
  }

  get nedCoordinatesURL() {
    const raString = fmtHours(this.source.ra, "h", "m") + "s";
    const decString = fmtDegLat(this.source.dec, "d", "m") + "s";
    const baseURL = "https://ned.ipac.caltech.edu/conesearch?";
    const params = {
      in_csys: "Equatorial",
      in_equinox: "J2000",
      coordinates: `${raString} ${decString}`,
      radius: String(this.searchRadius),
      hconst: "67.8",
      omegam: "0.308",
      omegav: "0.692",
      wmap: "4",
      corr_z: "1",
      z_constraint: "Unconstrained",
      z_unit: "z",
      ot_include: "ANY",
      nmp_op: "ANY",
      search_type: "Near Position Search",
      out_csys: "Same as Input",
      obj_sort: "Distance to search center",
    };
    return baseURL + new URLSearchParams(params).toString();
  }
}
</script>

<style scoped>
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

.name-label {
  display: inline-block;
  width: 62%;
}

.name-input {
  display: inline-block;
  background: #999999;
}

#buttons-container {
  width: 38%;
}

a {
  color: turquoise;
}

a:visited {
  color: lightcoral;
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

.icon-active {
  color: darkred;
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
  padding: 5px 0px;
}
</style>
