import Vue from 'vue';

import { WWTGlobalState } from "./store";

declare module 'vue/types/vue' {
  interface Vue {
    $wwt: WWTGlobalState;
  }

  interface VueConstructor {
    $wwt: WWTGlobalState;
  }
}