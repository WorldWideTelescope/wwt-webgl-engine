import Vue from "vue";
import VTooltip from "v-tooltip";
import Vuex from "vuex";

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faAdjust,
  faCompress,
  faExpand,
  faMountain,
  faPlay,
  faPause,
  faSearchMinus,
  faSearchPlus,
  faSlidersH,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { createPlugin } from "@wwtelescope/engine-vuex";
import { EmbedSettings } from "@wwtelescope/embed-common";

import Embed from "./Embed.vue";

Vue.config.productionTip = false;

Vue.use(VTooltip);
Vue.use(Vuex);

const store = new Vuex.Store({});

Vue.use(createPlugin(), {
  store,
  namespace: "wwt-embed"
});

library.add(faAdjust);
library.add(faCompress);
library.add(faExpand);
library.add(faMountain);
library.add(faPlay);
library.add(faPause);
library.add(faSearchMinus);
library.add(faSearchPlus);
library.add(faSlidersH);
Vue.component('font-awesome-icon', FontAwesomeIcon);

const queryParams = new URLSearchParams(window.location.search);
const settings = EmbedSettings.fromQueryParams(queryParams.entries());

new Vue({
  store,
  el: "#app",
  render: createElement => {
    return createElement(Embed, {
      props: {
        "wwtNamespace": "wwt-embed",
        "embedSettings": settings
      }
    });
  }
});