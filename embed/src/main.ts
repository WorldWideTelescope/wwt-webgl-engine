import { createApp } from "vue";

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
import Popper from "vue3-popper";

import { EmbedSettings } from "@wwtelescope/embed-common";
import { wwtPinia, WWTComponent } from "@wwtelescope/engine-vuex";

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

createApp(Embed, {
    wwtNamespace: "wwt-engine",
    embedSettings: settings
  })
  .use(wwtPinia)
  .component('WorldWideTelescope', WWTComponent)
  .component('Popper', Popper)
  .component('font-awesome-icon', FontAwesomeIcon)
  .component('vue-slider', VueSlider)
  .provide('wwtNamespace', 'wwt-embed')
  .provide('embedSettings', settings)
  .mount("#app");
