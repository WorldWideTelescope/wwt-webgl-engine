import "@babel/polyfill";
import "mutationobserver-shim";
import Vue from "vue";
import VueClipboard from "vue-clipboard2";

import "./plugins/bootstrap-vue";
import Creator from "./Creator.vue";

Vue.config.productionTip = false;

Vue.use(VueClipboard);

new Vue({
  render: h => h(Creator)
}).$mount("#app");
