import "@babel/polyfill";
import "mutationobserver-shim";
import { createApp } from "vue";
import VueClipboard from "vue-clipboard2";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import "./plugins/bootstrap-vue";
import Creator from "./Creator.vue";

library.add(faExternalLinkAlt);

createApp(Creator)
  .use(VueClipboard)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount("#app");
