import Vue from "vue";
import Vuex from "vuex";

import { createPlugin } from "@pkgw/engine-vuex";
import { EmbedSettings } from "@pkgw/embed-common";

import Embed from "./Embed.vue";

Vue.config.productionTip = false;

Vue.use(Vuex);

const store = new Vuex.Store({});

Vue.use(createPlugin(), {
  store,
  namespace: "wwt-embed"
});

const settings = EmbedSettings.fromQueryString(window.location.search);

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