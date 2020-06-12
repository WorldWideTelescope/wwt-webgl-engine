import "@babel/polyfill";
import "mutationobserver-shim";
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import "./plugins/bootstrap-vue";
import Creator from "./Creator.vue";

Vue.config.productionTip = false;

Vue.use(VueClipboard);

library.add(faExternalLinkAlt);
Vue.component('font-awesome-icon', FontAwesomeIcon);

new Vue({
  render: h => h(Creator)
}).$mount("#app");
