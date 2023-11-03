// Copyright 2020-2023 the .NET Foundation
// Licensed under the MIT License

// This type moved to a lower-level dependency, but we re-export it to maintain
// API compatibility.
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
  TimeToRADecZoomParams,
  WWTEnginePiniaState,
  engineStore,
} from "./store";

export { default as WWTComponent } from "./Component.vue";
export { WWTAwareComponent } from "./wwtaware";

// Finally, we define the `wwtPinia` thingie.

import { createPinia } from "pinia";
import { WWTGlobalState } from "./store";

/** A Pinia instance customized for use in WWT-based applications.
 *
 * In most cases, you would use this variable in the following way while
 * initializing your Vue app:
 *
 * ```ts
 * import { createApp } from "vue";
 * import { wwtPinia, WWTComponent } from "@wwtelescope/engine-pinia";
 *
 * import MyApp from "./MyApp.vue";
 *
 * createApp(MyApp)
 *   .use(wwtPinia)
 *   .component("WorldWideTelescope", WWTComponent)
 *   .mount("#app");
 * ```
 *
 * Once you’ve activated the special WWT Pinia instance in this way, you can
 * interact with the WWT engine state via the {@link engineStore} interface.
 *
 * This Pinia instance is initialized with a special `$wwt` singleton value that
 * the {@link WWTComponent} uses to share global state with Pinia.
 */
export const wwtPinia = createPinia();

wwtPinia.use(({ store }) => {
  store.$wwt = new WWTGlobalState();
});
