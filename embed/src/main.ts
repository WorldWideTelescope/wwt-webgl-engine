import Vue from "vue";
import Vuex from "vuex";

import { createPlugin } from "@wwtelescope/engine-vuex";
import { EmbedSettings } from "@wwtelescope/embed-common";

import Embed from "./Embed.vue";

Vue.config.productionTip = false;

Vue.use(Vuex);

const store = new Vuex.Store({});

Vue.use(createPlugin(), {
  store,
  namespace: "wwt-embed"
});

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