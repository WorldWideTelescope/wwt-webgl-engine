import { createApp } from "vue";
import FloatingVue from "floating-vue";

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faAdjust,
  faCompress,
  faExpand,
  faMountain,
  faPlay,
  faPause,
  faRedo,
  faSearchMinus,
  faSearchPlus,
  faSlidersH,
  faUndoAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';

import { EmbedSettings } from "@wwtelescope/embed-common";

import Embed from "./Embed.vue";

library.add(faAdjust);
library.add(faCompress);
library.add(faExpand);
library.add(faMountain);
library.add(faPlay);
library.add(faPause);
library.add(faRedo);
library.add(faSearchMinus);
library.add(faSearchPlus);
library.add(faSlidersH);
library.add(faUndoAlt);

const queryParams = new URLSearchParams(window.location.search);
const settings = EmbedSettings.fromQueryParams(queryParams.entries());

createApp(Embed)
  .use(FloatingVue)
  .component('font-awesome-icon', FontAwesomeIcon)
  .component('vue-slider', VueSlider)
  .provide('wwtNamespace', 'wwt-embed')
  .provide('embedSettings', settings)
  .mount("#app");
