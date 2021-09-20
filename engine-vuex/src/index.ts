// Copyright 2020 the .NET Foundation
// Licensed under the MIT License

import { VueConstructor, PluginObject } from "vue/types";
import { Store } from "vuex/types";

export { SetupForImagesetOptions } from "@wwtelescope/engine-helpers";

export {
  CreateTableLayerParams,
  GotoRADecZoomParams,
  ImagesetInfo,
  ImageSetLayerState,
  isImageSetInfo,
  LoadImageCollectionParams,
  LoadTourParams,
  SpreadSheetLayerInfo,
  WWTEngineVuexModule,
  WWTEngineVuexState,
} from "./store";

export { WWTAwareComponent } from "./wwtaware";

import WWTComponent from "./Component.vue";
export { WWTComponent }

// The Vue plugin that activates everything.

import { WWTEngineVuexModule, WWTGlobalState } from "./store";

/** Docstring for engine plugin options. */
export interface WWTEnginePluginOptions<S> {
  store: Store<S>;
  namespace: string;
}

/** This function is a hack to allow TypeScript to infer the `<S>` parent store type. */
export function createPlugin<S>(): PluginObject<WWTEnginePluginOptions<S>> {
  return {
    install(Vue: VueConstructor, options: WWTEnginePluginOptions<S> | undefined): void {
      if (!options || !options.store) {
        throw new Error('You must provide a "store" when initializing the WWT engine-vuex plugin.');
      }

      options.store.registerModule(options.namespace, WWTEngineVuexModule);
      Vue.component('WorldWideTelescope', WWTComponent);
      Vue.$wwt = new WWTGlobalState();
    }
  }
}
