// Copyright 2020 the .NET Foundation
// Licensed under the MIT License

import { createPinia } from 'pinia';

export { SetupForImagesetOptions } from "@wwtelescope/engine-helpers";

export {
  CatalogLayerInfo,
  CreateTableLayerParams,
  GotoRADecZoomParams,
  ImagesetInfo,
  ImageSetLayerState,
  LoadImageCollectionParams,
  LoadTourParams,
  SpreadSheetLayerInfo,
  WWTEngineVuexState,
  useEngineStore
} from "./store";

export { WWTAwareComponent } from "./wwtaware";

import WWTComponent from "./Component.vue";
import { WWTGlobalState } from './store';
export { WWTComponent }

const pinia = createPinia();
pinia.use(({ store }) => {
  store.$wwt = new WWTGlobalState();
});
