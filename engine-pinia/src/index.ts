// Copyright 2020 the .NET Foundation
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

export { WWTAwareComponent } from "./wwtaware";

// Can't figure out a one-liner way to re-export the default export from
// Component.vue under a specific name, so:
import WWTComponent from "./Component.vue";
export { WWTComponent }

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
 * This Pinia instance is initialized with a special `$wwt` singleton value that
 * the {@link WWTComponent} uses to share global state with Pinia.
 */
export const wwtPinia = createPinia();

wwtPinia.use(({ store }) => {
  store.$wwt = new WWTGlobalState();
});
