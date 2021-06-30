import Vue from "vue";
import VTooltip from "v-tooltip";
import Vuex from "vuex";

import vSelect from 'vue-select';
import Chrome from 'vue-color/src/components/Chrome.vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faAdjust,
  faCompress,
  faExpand,
  faMountain,
  faSearchMinus,
  faSearchPlus,
  faSlidersH,
  faEyeSlash,
  faEye,
  faChevronDown,
  faChevronUp,
  faPlus,
  faWindowClose,
  faTimes,
  faMapMarkedAlt,
  faCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { createPlugin } from "@wwtelescope/engine-vuex";

import App from "./App.vue";
import CatalogItem from "./CatalogItem.vue";
import TransitionExpand from "./TransitionExpand.vue";
import WWTResearchAppModule from "./store";
import { wwtEngineNamespace, wwtResearchAppNamespace } from "./namespaces";

Vue.config.productionTip = false;

Vue.use(VTooltip);
Vue.use(Vuex);

const store = new Vuex.Store({});
store.registerModule(wwtResearchAppNamespace, WWTResearchAppModule);

Vue.use(createPlugin(), {
  store,
  namespace: wwtEngineNamespace,
});

library.add(faAdjust);
library.add(faCompress);
library.add(faExpand);
library.add(faMountain);
library.add(faSearchMinus);
library.add(faSearchPlus);
library.add(faSlidersH);
library.add(faEyeSlash);
library.add(faEye);
library.add(faChevronUp);
library.add(faChevronDown);
library.add(faPlus);
library.add(faWindowClose);
library.add(faTimes);
library.add(faMapMarkedAlt);
library.add(faCircle);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component("v-select", vSelect);
Vue.component('catalog-item', CatalogItem);
Vue.component('transition-expand', TransitionExpand);
Vue.component('vue-color-chrome', Chrome);

// If postMessages are to be allowed, our creator has to tell us where they'll
// come from. This only trivially prevents unexpected messages; it of course
// does nothing about XSS where someone loads us up inside an iframe that they
// control. This is OK because right now this app has no sense of user logins or
// other credentials that can be abused.
const queryParams = new URLSearchParams(window.location.search);
const allowedOrigin = queryParams.get('origin');
if (allowedOrigin === null) {
  console.log("WWT embed: no \"?origin=\" given, so no incoming messages will be allowed")
}

new Vue({
  store,
  el: "#app",
  render: createElement => {
    return createElement(App, {
      props: {
        "wwtNamespace": wwtEngineNamespace,
        "allowedOrigin": allowedOrigin,
      }
    });
  }
});
