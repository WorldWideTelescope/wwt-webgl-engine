import Vue from "vue";
import VTooltip from "v-tooltip";
import Vuex from "vuex";

import { VNode, VNodeDirective } from "vue";

import vSelect from 'vue-select';
import Chrome from 'vue-color/src/components/Chrome.vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faAdjust,
  faArrowCircleRight,
  faChevronDown,
  faChevronUp,
  faCircle,
  faCompress,
  faCopy,
  faCrosshairs,
  faExpand,
  faEye,
  faEyeSlash,
  faImage,
  faMapMarkedAlt,
  faMapMarkerAlt,
  faMinusCircle,
  faMountain,
  faPencilAlt,
  faPhotoVideo,
  faPlus,
  faPlusCircle,
  faSave,
  faSearchMinus,
  faSearchPlus,
  faSlidersH,
  faTimes,
  faWindowClose,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import Notifications from 'vue-notification';

import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';

import { createPlugin } from "@wwtelescope/engine-vuex";

import App from "./App.vue";
import ImagesetItem from "./ImagesetItem.vue";
import SourceItem from "./SourceItem.vue";
import SpreadsheetItem from "./SpreadsheetItem.vue";
import TransitionExpand from "./TransitionExpand.vue";
import { WWTResearchAppModule } from "./store";
import { wwtEngineNamespace, wwtResearchAppNamespace } from "./namespaces";

Vue.config.productionTip = false;

Vue.use(Notifications);
Vue.use(VTooltip);
Vue.use(Vuex);

const store = new Vuex.Store({});
store.registerModule(wwtResearchAppNamespace, WWTResearchAppModule);

Vue.use(createPlugin(), {
  store,
  namespace: wwtEngineNamespace,
});

library.add(faAdjust);
library.add(faArrowCircleRight);
library.add(faChevronDown);
library.add(faChevronUp);
library.add(faCircle);
library.add(faCompress);
library.add(faCrosshairs);
library.add(faExpand);
library.add(faEye);
library.add(faEyeSlash);
library.add(faImage);
library.add(faMapMarkedAlt);
library.add(faMapMarkerAlt);
library.add(faMinusCircle);
library.add(faMountain);
library.add(faPencilAlt);
library.add(faPhotoVideo);
library.add(faPlus);
library.add(faPlusCircle);
library.add(faSearchMinus);
library.add(faSearchPlus);
library.add(faSlidersH);
library.add(faTimes);
library.add(faWindowClose);
library.add(faSave);
library.add(faCopy);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('vue-color-chrome', Chrome);
Vue.component('v-select', vSelect);
Vue.component('vue-slider', VueSlider);

Vue.component('spreadsheet-item', SpreadsheetItem);
Vue.component('imageset-item', ImagesetItem);
Vue.component('source-item', SourceItem);
Vue.component('transition-expand', TransitionExpand);

/** v-hide directive take from https://www.ryansouthgate.com/2020/01/30/vue-js-v-hide-element-whilst-keeping-occupied-space/ */
// Extract the function out, up here, so I'm not writing it twice
const update = (el: HTMLElement,
  binding: VNodeDirective,
  _vnode: VNode,
  _oldVnode: VNode) => el.style.visibility = (binding.value) ? "hidden" : "";

/**
* Hides an HTML element, keeping the space it would have used if it were visible (css: Visibility)
*/
Vue.directive("hide", {
  // Run on initialisation (first render) of the directive on the element
  bind: update,
  // Run on subsequent updates to the value supplied to the directive
  update: update
});

// If postMessages are to be allowed, our creator has to tell us where they'll
// come from. This only trivially prevents unexpected messages; it of course
// does nothing about XSS where someone loads us up inside an iframe that they
// control. This is OK because right now this app has no sense of user logins or
// other credentials that can be abused.
const queryParams = new URLSearchParams(window.location.search);
let allowedOrigin = queryParams.get('origin');
const messages = queryParams.get('messages');
if (messages !== null) {
  allowedOrigin = window.location.origin;
  console.log("WWT embed: incoming messages allowed from current origin in order to restore state");
} else if (allowedOrigin === null) {
  console.log("WWT embed: no \"?origin=\" given, so no incoming messages will be allowed");
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
