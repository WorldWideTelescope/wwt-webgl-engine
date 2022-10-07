import "@babel/polyfill";
import "mutationobserver-shim";
import { createApp } from "vue";
import VueClipboard from "vue-clipboard2";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import Creator from "./Creator.vue";

import BootstrapVue from "bootstrap-vue-3";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";

library.add(faExternalLinkAlt);

createApp(Creator)
  .use(VueClipboard)
  .use(BootstrapVue)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount("#app");
