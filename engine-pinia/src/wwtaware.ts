// Copyright 2020-2023 the .NET Foundation
// Licensed under the MIT License

import { defineComponent } from "vue";
import { mapActions, mapState } from "pinia";
import { engineStore } from "./store";

/** This is a helper base class for Vue components that wish to interact with a
 * {@link WWTComponent} through the Pinia state management system. It is only
 * recommended for using using Vue’s [“options API”][opt-api]. If you are
 * instead using the “composition API”, it is recommended to use
 * {@link engineStore} directly.
 *
 * [opt-api]: https://vuejs.org/guide/introduction.html#api-styles
 *
 * This class doesn’t implement any special functionality itself. All it does is
 * provide a set of state variables and methods that are pre-connected to [the
 * WWT Pinia interface][api-summary]. A component inheriting from this class can
 * use whichever ones it needs without having to set up that integration itself.
 * For that reason, **the detailed API associated with this class is
 * intentionally undocumented**, so that the in-depth documentation can be
 * centralized in one place: see [the API summary][api-summary] associated with
 * the {@link engineStore} function.
 *
 * [api-summary]: ../functions/engineStore.html#md:the-wwt-pinia-interface
 *
 * # Example
 *
 * Say that you are creating a simple WWT-powered app with a main `App.vue`
 * component that includes a WWT sub-component and a readout of the current
 * coordinates of the WWT view center. Your app Vue file might look like this:
 *
 * ```vue
 * <template>
 *   <div id="app">
 *     <WorldWideTelescope wwt-namespace="mywwt"></WorldWideTelescope>
 *     <p class="coord-overlay">{{ coordText }}</p>
 *   </div>
 * </template>
 *
 * <script lang="ts">
 *   import { defineComponent } from "vue";
 *   import { fmtDegLat, fmtHours } from "@wwtelescope/astro";
 *   import { WWTAwareComponent } from "@wwtelescope/engine-pinia";
 *
 *   export default App = defineComponent({
 *     extends: WWTAwareComponent, // <== we are extending WWTAwareComponent
 *
 *     computed: {
 *      coordText() {
 *        // We don't have to define `wwtRARad` and `wwtDecRad` ourselves:
 *        return `${fmtHours(this.wwtRARad)} ${fmtDegLat(this.wwtDecRad)}`;
 *      }
 *     }
 *   });
 * </script>
 * ```
 *
 * Because this component extends {@link WWTAwareComponent}, it automatically
 * has getters for {@link wwtRARad} and {@link wwtDecRad} that can be used to
 * set up the coordinate readout easily.
 *
 * Note that [the `extends` option is not recommended (or easily used) in the
 * Composition API][1], which is why it is recommended to use
 * {@link engineStore} directly instead.
 *
 * [1]: https://vuejs.org/api/options-composition.html#extends
 **/
export const WWTAwareComponent = defineComponent({
  props: {
    /** This property is unused. It is retained for API compatibility from the
     * days of Vuex.
     */
    wwtNamespace: { type: String, default: "wwt", required: false },

    /** @hidden this was a mistake; keep it just in case */
    wwtFreestandingAssetBaseurl: String,
  },

  computed: {
    // Renamed getters/properties:
    ...mapState(engineStore, {
      wwtActiveLayers: 'activeLayers',
      wwtAvailableImagesets: 'availableImagesets',
      wwtBackgroundImageset: 'backgroundImageset',
      wwtCurrentTime: 'currentTime',
      wwtClockDiscontinuities: 'clockDiscontinuities',
      wwtClockRate: 'clockRate',
      wwtDecRad: 'decRad',
      wwtForegroundImageset: 'foregroundImageset',
      wwtForegroundOpacity: 'foregroundOpacity',
      wwtImagesetLayers: 'imagesetLayers',
      wwtIsTourPlayerActive: 'isTourPlayerActive',
      wwtIsTourPlaying: 'isTourPlaying',
      wwtRARad: 'raRad',
      wwtRenderType: 'renderType',
      wwtRollRad: 'rollRad',
      wwtShowWebGl2Warning: 'showWebGl2Warning',
      wwtSpreadSheetLayers: 'spreadSheetLayers',
      wwtTourCompletions: 'tourCompletions',
      wwtTourRunTime: 'tourRunTime',
      wwtTourStopStartTimes: 'tourStopStartTimes',
      wwtTourTimecode: 'tourTimecode',
      wwtZoomDeg: 'zoomDeg',
    }),

    // Properties/getters re-exported without renaming:
    ...mapState(engineStore, [
      "activeImagesetLayerStates",
      "findRADecForScreenPoint",
      "findScreenPointForRADec",
      "layerById",
      "imagesetForLayer",
      "imagesetLayerById",
      "imagesetStateForLayer",
      "layerForHipsCatalog",
      "lookupImageset",
      "spreadSheetLayerById",
      "spreadSheetLayer",
      "spreadsheetState",
      "spreadsheetStateById",
      "spreadsheetStateForHipsCatalog",
    ]),
  },

  methods: {
    ...mapActions(engineStore, [
      "addCatalogHipsByName",
      "createTableLayer",
      "getCatalogHipsDataInView",
      "gotoRADecZoom",
      "timeToRADecZoom",
      "gotoTarget",
      "loadImageCollection",
      "addImagesetToRepository",
      "loadFitsLayer",
      "addImageSetLayer",
      "loadTour",
      "viewAsTourXml",
      "waitForReady",
      // Formerly mutations
      "addAnnotation",
      "applyFitsLayerSettings",
      "applyTableLayerSettings",
      "applySetting",
      'captureFrame',
      'captureVideo',
      "clearAnnotations",
      "deleteLayer",
      "removeAnnotation",
      "removeCatalogHipsByName",
      "seekToTourTimecode",
      "setBackgroundImageByName",
      "setClockRate",
      "setClockSync",
      "setFitsLayerColormap",
      "setForegroundImageByName",
      "setForegroundOpacity",
      "setImageSetLayerOrder",
      "setTourPlayerLeaveSettingsWhenStopped",
      "setTime",
      "setTrackedObject",
      "setupForImageset",
      "startTour",
      "stretchFitsLayer",
      "toggleTourPlayPauseState",
      "updateTableLayer",
      //"updateAvailableImagesets",
      "zoom",
      "move",
      "tilt",
    ]),
  }
});
