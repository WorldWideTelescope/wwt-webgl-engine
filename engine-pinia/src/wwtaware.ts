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
 * WWT Pinia interface](#md:the-wwt-pinia-interface). A component inheriting from
 * this class can use whichever ones it needs without having to set up that
 * integration itself.
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
 *
 * # The WWT Pinia Interface
 *
 * A component deriving from {@link WWTAwareComponent}, or any other piece of
 * code that has access to the WWT Pinia store, can monitor or manipulate the
 * state of the WWT renderer.
 *
 * Here we document all of the available interfaces, grouping them by category.
 * As a reminder, in the Pinia paradigm, state is expressed in [state variables]
 * and [getters], and modified either directly or through [actions] (which can
 * be asynchronous).
 *
 * [state variables]: https://pinia.vuejs.org/core-concepts/state.html
 *
 * [getters]: https://pinia.vuejs.org/core-concepts/getters.html
 *
 * [actions]: https://pinia.vuejs.org/core-concepts/actions.html
 *
 * ## Initialization
 *
 * Actions:
 *
 * - {@link waitForReady}
 * - {@link setupForImageset}
 *
 * ## Basic View Information
 *
 * State:
 *
 * - {@link wwtCurrentTime}
 * - {@link wwtClockDiscontinuities}
 * - {@link wwtClockRate}
 * - {@link wwtDecRad}
 * - {@link wwtRARad}
 * - {@link wwtZoomDeg}
 * - {@link wwtRollRad}
 *
 * Getters:
 *
 * - {@link findRADecForScreenPoint}
 * - {@link findScreenPointForRADec}
 *
 * Actions:
 *
 * - {@link gotoRADecZoom}
 * - {@link timeToRADecZoom}
 * - {@link gotoTarget}
 * - {@link setClockRate}
 * - {@link setClockSync}
 * - {@link setTime}
 * - {@link setTrackedObject}
 * - {@link zoom}
 * - {@link move}
 * - {@link tilt}
 *
 * ## Image Sets
 *
 * State:
 *
 * - {@link wwtAvailableImagesets}
 * - {@link wwtBackgroundImageset}
 * - {@link wwtForegroundImageset}
 * - {@link wwtForegroundOpacity}
 * - {@link wwtRenderType}
 *
 * Getters:
 *
 * - {@link lookupImageset}
 *
 * Actions:
 *
 * - {@link loadImageCollection}
 * - {@link addImagesetToRepository}
 * - {@link setBackgroundImageByName}
 * - {@link setForegroundImageByName}
 * - {@link setForegroundOpacity}
 * - {@link setupForImageset}
 *
 *
 * ## General Layer Management
 *
 * State:
 *
 * - {@link wwtActiveLayers}
 *
 * Getters:
 *
 * - {@link layerById}
 *
 * Actions:
 *
 * - {@link deleteLayer}
 *
 * ## Imageset Layers (including FITS imagery)
 *
 * State:
 *
 * - {@link wwtActiveLayers}
 * - {@link wwtImagesetLayers}
 *
 * Getters:
 *
 * - {@link activeImagesetLayerStates}
 * - {@link imagesetForLayer}
 * - {@link imagesetStateForLayer}
 * - {@link imagesetLayerById}
 *
 * Actions:
 *
 * - {@link addImageSetLayer}
 * - {@link loadFitsLayer} (deprecated)
 * - {@link applyFitsLayerSettings}
 * - {@link setFitsLayerColormap}
 * - {@link stretchFitsLayer}
 * - {@link setImageSetLayerOrder}
 * - {@link deleteLayer}
 *
 * ## Tabular (“Spreadsheet”) Data Layers
 *
 * State:
 *
 * - {@link wwtActiveLayers}
 * - {@link wwtSpreadSheetLayers}
 *
 * Getters:
 *
 * - {@link spreadSheetLayer}
 * - {@link spreadsheetState}
 * - {@link spreadSheetLayerById}
 * - {@link spreadsheetStateById}
 *
 * Actions:
 *
 * - {@link createTableLayer}
 * - {@link applyTableLayerSettings}
 * - {@link updateTableLayer}
 * - {@link deleteLayer}
 *
 * ## Annotations
 *
 * Actions:
 *
 * - {@link addAnnotation}
 * - {@link clearAnnotations}
 * - {@link removeAnnotation}
 *
 * ## Progressive HiPS Catalogs
 *
 * These have some characteristics of both imagesets and tabular ("spreadsheet")
 * data layers.
 *
 * Getters:
 *
 * - {@link layerForHipsCatalog}
 * - {@link spreadsheetStateForHipsCatalog}
 *
 * Actions:
 *
 * - {@link addCatalogHipsByName}
 * - {@link applyTableLayerSettings}
 * - {@link getCatalogHipsDataInView}
 * - {@link removeCatalogHipsByName}
 *
 * ## Tours
 *
 * State:
 *
 * - {@link wwtIsTourPlayerActive}
 * - {@link wwtIsTourPlaying}
 * - {@link wwtTourCompletions}
 * - {@link wwtTourRunTime}
 * - {@link wwtTourStopStartTimes}
 * - {@link wwtTourTimecode}
 *
 * Actions:
 *
 * - {@link loadTour}
 * - {@link seekToTourTimecode}
 * - {@link setTourPlayerLeaveSettingsWhenStopped}
 * - {@link startTour}
 * - {@link toggleTourPlayPauseState}
 *
 * ## Miscellaneous
 *
 * State:
 *
 * - {@link wwtShowWebGl2Warning}
 *
 * Actions:
 *
 * - {@link applySetting}
 * - {@link viewAsTourXml}
 * - {@link captureFrame}
 * - {@link captureVideo}
 **/
export const WWTAwareComponent = defineComponent({
  props: {
    /** The namespace of the Pinia module used to track the WWT component’s state.
     * This prop should have the same value in all components in the app that
     * reference WWT.
     */
    wwtNamespace: { type: String, default: "wwt", required: false },
    wwtFreestandingAssetBaseurl: String,
  },

  computed: {
    // Renamed getters:
    ...mapState(engineStore, {

      /** The GUIDs of all rendered layers, in their draw order.
       *
       * This list gives the GUIDs of the layers that are currently candidates for
       * rendering. This list is determined by the hierarchy of "layer maps"
       * registered with the engine and its current rendering mode. Layers in this
       * list might not be actually rendered if their `enabled` flag is false, if
       * they are fully transparent, and so on.
       **/
      wwtActiveLayers: 'activeLayers',

      /** Information about the imagesets that are available to be used as a background.
         *
         * The info includes the name, which can then be used to set the background image
         * via the {@link setBackgroundImageByName} mutation.
         */
      wwtAvailableImagesets: 'availableImagesets',

      /** The current background [Imageset](../../engine/classes/Imageset-1.html), or
       * null if it is undefined.
       *
       * You can cause this state variable to change using the
       * {@link setBackgroundImageByName} mutation.
       * **/
      wwtBackgroundImageset: 'backgroundImageset',

      /** The current time of WWT internal clock. In normal operation this variable
       * will change with every rendered WWT frame, or every 30 ms or so.
       */
      wwtCurrentTime: 'currentTime',

      /** The number of times that the progression of the WWT internal clock has
       * been changed discontinuously.
       *
       * The main use of this state variable is that you can
       * [watch](https://vuejs.org/api/reactivity-core.html#watch) for changes to it and be alerted
       * when the clock has been altered. */
      wwtClockDiscontinuities: 'clockDiscontinuities',

      /** The rate at which the WWT internal clock progresses compared to real time.
       * If the WWT clock is paused, this will be zero. Negative and fractional
       * values are both possible. */
      wwtClockRate: 'clockRate',

      /** The current declination of the center of the WWT view, in radians.
       *
       * TODO: define the meaning here for view modes other than "sky."
       */
      wwtDecRad: 'decRad',

      /** The current foreground [Imageset](../../engine/classes/Imageset-1.html), or
       * null if it is undefined.
       *
       * You can cause this state variable to change using the
       * {@link setForegroundImageByName} mutation.
       * **/
      wwtForegroundImageset: 'foregroundImageset',

      /** The opacity of the foreground imageset. Values range between 0 (invisible)
        * and 100 (fully opaque). */
      wwtForegroundOpacity: 'foregroundOpacity',

      /** A table of activated imageset layers.
       *
       * Use {@link imagesetStateForLayer} to access information about a particular
       * layer.
       */
      wwtImagesetLayers: 'imagesetLayers',

      /** Whether a tour has been loaded up and is available for playback. */
      wwtIsTourPlayerActive: 'isTourPlayerActive',

      /** Whether a tour is actively playing back right now. This can spontaneously become
        * false if the tour completes playing. */
      wwtIsTourPlaying: 'isTourPlaying',

      /** The current right ascension of the center of the WWT view, in radians.
       *
       * TODO: define the meaning here for view modes other than "sky."
       */
      wwtRARad: 'raRad',

      /** The current mode of the WWT renderer.
       *
       * This is derived from the "type" of the active background imageset. To
       * change the mode, change the background imageset with
       * {@link setBackgroundImageByName}.
       */
      wwtRenderType: 'renderType',

      /** The current roll of the view camera, in radians */
      wwtRollRad: 'rollRad',

      /** Whether or not to show a warning about recommending WebGL 2 */
      wwtShowWebGl2Warning: 'showWebGl2Warning',

      /** A table of activated imageset layers.
       *
       * Use {@link imagesetStateForLayer} to access information about a particular
       * layer.
       */
      wwtSpreadSheetLayers: 'spreadSheetLayers',

      /** The number of times that a WWT tour has completed playing.
       *
       * The main use of this state variable is that you can
       * [watch](https://vuejs.org/api/reactivity-core.html#watch) for changes to it and be alerted
       * when a tour finishes. Watching {@link wwtIsTourPlaying} doesn't suffice because
       * that will trigger when a tour is paused. */
      wwtTourCompletions: 'tourCompletions',

      /** The total runtime of the current tour, in seconds, if there is one. */
      wwtTourRunTime: 'tourRunTime',

      /** The timecodes at which the current tour’s "stops" begin, in seconds.
       *
       * Each WWT tour is composed of one or more "stops", each of which has a fixed
       * wall-clock duration. This variable gives the start times of the stops under
       * the assumption that they all follow one another in sequence. It is possible
       * to have nonlinear flow from one stop to the next.
       *
       * If no tour is loaded, this is an empty array.
       */
      wwtTourStopStartTimes: 'tourStopStartTimes',

      /** The "timecode" of the current tour playback progression.
       *
       * The "timecode" is approximately the number of seconds elapsed since tour
       * playback began. More precisely, however, it is the start time of the
       * current tour stop, plus however much wall-clock time has elapsed while at
       * that stop. Because it is possible for stops to link to each other
       * non-linearly, it is also possible for the timecode to progress non-linearly
       * even when the tour plays back without user interaction.
       *
       * In combination with {@link wwtTourStopStartTimes}, you can use this value to
       * determine the index number of the currently active tour stop.
       *
       * If no tour is loaded, this is zero.
       */
      wwtTourTimecode: 'tourTimecode',

      /** The WWT zoom level, in degrees.
       *
       * TODO: define the semantics here in 3D and other modes.
       *
       * In 2D sky mode, the zoom level is the angular height of the viewport,
       * *times six*.
       */
      wwtZoomDeg: 'zoomDeg',
    }),

    // Getters re-exported without renaming:
    ...mapState(engineStore, [
      /** Get the reactive state for the active imageset layers
       *
       * These layers are created using the {@link addImageSetLayer} action. The state
       * structures returned by this function are part of the reactive store, so
       * you can wire them up to your UI and they will update correctly. The list is
       * returned in the engine's render order.
       *
       * @returns The layer states
       */
      "activeImagesetLayerStates",

      /** Get the right ascension and declination, in degrees, for x, y coordinates on the screen */
      "findRADecForScreenPoint",

      /** Given an RA and Dec position, return the x, y coordinates of the screen point */
      "findScreenPointForRADec",

      /** Get the actual WWT `Layer` for the layer with the given ID.
       *
       * Do not use this function for UI purposes -- the WWT layer object is not
       * integrated into the reactive state system, and so if you use it as a
       * basis for UI elements, those elements will not be updated properly
       * if/when the layer's settings change. If you know the specific type of
       * your layer, you can use functions like {@link imagesetStateForLayer} or
       * {@link spreadSheetStateById} to get reactive data structures.
       *
       * @param id The layer's identifier.
       */
      "layerById",

      /** Look up the WWT engine object for an active imageset layer.
       *
       * This getter gets the WWT `Imageset` object associated with an imageset
       * layer. The returned object is *not* part of the Vue(x) reactivity system,
       * so you shouldn't use it to set up UI elements, but you can obtain more
       * detailed information about the imageset than is stored in the state
       * management system. For UI purposes, use {@link imagesetStateForLayer}.
       *
       * @param guidtext The GUID of the layer to query, as a string
       * @returns The layer's underlying imageset, or null if the GUID is
       * unrecognized
       */
      "imagesetForLayer",

      /** Get the actual WWT `ImageSetLayer` for the imageset layer with the given ID.
       *
       * Do not use this function for UI purposes -- the WWT layer object is not
       * integrated into the reactive state system, and so if you use it as a basis
       * for UI elements, those elements will not be updated properly if/when the
       * layer's settings change. Use {@link imagesetStateForLayer} instead.
       *
       * @param id The imageset layer's identifier.
       */
      "imagesetLayerById",

      /** Look up the reactive state for an active imageset layer.
       *
       * These layers are created using the {@link addImageSetLayer} action. The state
       * returned by this function is part of the reactive store, so you can
       * wire it up to your UI and it will update as the layer settings are changed.
       * If you need "runtime" state not captured in the reactivity system, you may
       * need to use {@link imagesetForLayer} instead.
       *
       * @param guidtext The GUID of the layer to query, as a string
       * @returns The layer state, or null if the GUID is unrecognized
       */
      "imagesetStateForLayer",

      /** Get the actual WWT `SpreadSheetLayer` for the named HiPS catalog.
       *
       * Do not use this function for UI purposes -- the WWT layer object is not
       * integrated into the reactive state system, and so if you use it as a basis
       * for UI elements, those elements will not be updated properly if/when the
       * layer's settings change. Use {@link spreadsheetStateForHipsCatalog} instead.
       *
       * @param name The `datasetName` of the HiPS catalog
       */
      "layerForHipsCatalog",

      /** Look up an [Imageset](../../engine/classes/Imageset-1.html) in the engine’s
       * table of ones with registered names.
       *
       * This delegates to
       * [WWTControl.getImagesetByName()](../../engine/classes/WWTControl-1.html#getimagesetbyname),
       * which has very eager name-matching rules. But if nothing matches, null is
       * returned.
       *
       * Imagesets are not added to the engine’s list of names automatically. In
       * order for an imageset to be findable by this function, its containing
       * folder must have been loaded using the {@link loadImageCollection} action.
       */
      "lookupImageset",

      /** Get the actual WWT `SpreadSheetLayer` for the table layer with the given ID.
       *
       * Do not use this function for UI purposes -- the WWT layer object is not
       * integrated into the reactive state system, and so if you use it as a basis
       * for UI elements, those elements will not be updated properly if/when the
       * layer's settings change. Use {@link spreadsheetState} instead.
       *
       * @param id The table layer's identifier.
       */
      "spreadSheetLayerById",

      /** Get the actual WWT `SpreadSheetLayer` for the table layer corresponding
       * to the given CatalogLayerInfo.
       *
       * Do not use this function for UI purposes -- the WWT layer object is not
       * integrated into the reactive state system, and so if you use it as a basis
       * for UI elements, those elements will not be updated properly if/when the
       * layer's settings change. Use {@link spreadsheetState} instead.
       *
       * @param id The table layer's identifier.
       */
      "spreadSheetLayer",

      /** Get reactive `SpreadSheetLayer` settings for the table layer corresponding to
       * the given CatalogLayerInfo.
       *
       * The returned data structure is a component of the app's reactive state. You can
       * therefore use the settings to construct UI elements, and they will update
       * reactively as the state evolves. The actual data structures used by WWT are
       * separate, but the two mirror each other.
       *
       * @param catalog A CatalogLayerInfo object corresponding to the layer.
       */
      "spreadsheetState",

      /** Get reactive `SpreadSheetLayer` settings for the table layer with the given ID.
       *
       * The returned data structure is a component of the app's reactive state. You can
       * therefore use the settings to construct UI elements, and they will update
       * reactively as the state evolves. The actual data structures used by WWT are
       * separate, but the two mirror each other.
       *
       * @param id The identifier of the table layer.
       */
      "spreadsheetStateById",

      /** Get reactive `SpreadSheetLayer` settings for the named HiPS catalog.
       *
       * The returned data structure is a component of the app's reactive state. You can
       * therefore use the settings to construct UI elements, and they will update
       * reactively as the state evolves. The actual data structures used by WWT are
       * separate, but the two mirror each other.
       *
       * @param name The `datasetName` of the HiPS catalog
       */
      "spreadsheetStateForHipsCatalog",
    ]),
  },

  methods: {
    ...mapActions(engineStore, [

      /** Add a "catalog HiPS" dataset to the current view, by name.
       *
       * If the catalog name is not in the engine's registry, the promise rejects.
       */
      "addCatalogHipsByName",

      /** Request the creation of a tabular data layer.
       *
       * The action resolves to a new [SpreadSheetLayer](../../engine/classes/SpreadSheetLayer.html) instance.
       */
      "createTableLayer",

      /** Request an export of the catalog HiPS data within the current viewport. */
      "getCatalogHipsDataInView",

      /** Command the view to steer to a specific configuration.
       *
       * The async action completes when the view arrives, or when
       * a subsequent view command overrides this one.
       *
       * TODO: document semantics when not in 2D sky mode!
       */
      "gotoRADecZoom",

      /** Returns the time it would take, in seconds, to navigate to the given target. */
      "timeToRADecZoom",

      /** Command the view to steer as specified in
       * [the options](../../engine-helpers/interfaces/GotoTargetOptions.html).
       *
       * The async action completes when the view arrives, or when
       * a subsequent view command overrides this one.
       */
      "gotoTarget",

      /** Request the engine to load the specified image collection.
       *
       * The image collection is a [WTML file](https://docs.worldwidetelescope.org/data-guide/1/data-file-formats/collections/)
       * Images in collections loaded this way become usable for name-based lookup
       * by interfaces such as {@link setForegroundImageByName}.
       *
       * The action resolves to a [Folder](../../engine/classes/Folder.html) instance.
       * It’s asynchronous because the specified WTML file has to be downloaded.
       */
      "loadImageCollection",

      /** Add an imageset directly into the engine's database.
       *
       * If an imageset with the same URL has already been loaded, this is a
       * no-op.
       *
       * This returns the imageset that ultimately resides in the engine's
       * database. It could either be the input argument, if it was newly added,
       * or a pre-existing imageset in the no-op condition.
       */
      "addImagesetToRepository",

      /** Deprecated. Use addImageSetLayer instead.
       * Request the creation of a FITS image layer.
       *
       * The action resolves to a new [ImageSetLayer](../../engine/classes/ImageSetLayer.html) instance.
       * It’s asynchronous because the requested FITS file has to be downloaded.
       */
      "loadFitsLayer",

      /** Request the creation of a image layer. Either a single FITS or an image set.
       *
       * The action resolves to a new [ImageSetLayer](../../engine/classes/ImageSetLayer.html) instance.
       * It’s asynchronous because the requested url has to be downloaded.
       */
      "addImageSetLayer",

      /** Request the engine to load a tour file.
       *
       * The action resolves when the load is complete. It’s asynchronous because
       * the full WTT tour file has to be downloaded.
      */
      "loadTour",

      /** Get the current view as a one-slide tour, serialized to XML */
      "viewAsTourXml",

      /** Wait for the WWT engine to become ready for usage.
       *
       * You should invoke this action and wait for is completion before trying to
       * do anything else with a WWT-aware component. The action resolves when the
       * WWT engine has completed its initialization, which involes the download of
       * some supporting data files.
       */
      "waitForReady",

      // Formerly mutations
      // TODO: Alphabetize this into one big list

      /** Add an [Annotation](../../engine/classes/Annotation.html) to the view. */
      "addAnnotation",

      /** Alter one or more settings of the specified FITS image layer as specified
       * in [the options](../../engine-helpers/interfaces/ApplyFitsLayerSettingsOptions.html).
       */
      "applyFitsLayerSettings",

      /** Alter one or more settings of the specified tabular data layers as specified
       * in [the options](../../engine-helpers/interfaces/ApplyTableLayerSettingsOptions.html).
       */
      "applyTableLayerSettings",

      /** Alter one [WWT engine setting](../../engine/modules.html#enginesetting). */
      "applySetting",

      /** Capture the current frame as an image `Blob` with the desired width, height, and format.
       * The first argument is a callback function to execute on the created `Blob`. */
      'captureFrame',

      /** Capture a video as a stream of image `Blob`s with the desired width, height and format.
       * The number of frames per second and total frame count are specified as well. */
      'captureVideo',

      /** Clear all [Annotations](../../engine/classes/Annotation.html) from the view. */
      "clearAnnotations",

      /** Delete the specified layer from the layer manager.
       *
       * A layer may be identified by either its name or its [id](../../engine/classes/Layer.html#id).
       */
      "deleteLayer",

      /** Remove the specified [Annotation](../../engine/classes/Annotation.html) from the view. */
      "removeAnnotation",

      /** Remove a "catalog HiPS" dataset to the current view, by name. */
      "removeCatalogHipsByName",

      /** Seek tour playback to the specified timecode.
       *
       * See {@link wwtTourTimecode} for a definition of the tour timecode.
       *
       * An important limitation is that the engine can only seek to the very
       * beginning of a tour stop. If you request a timecode in the middle of a
       * slide, the seek will actually occur to the start time of that slide.
       */
      "seekToTourTimecode",

      /** Set the current background [Imageset](../../engine/classes/Imageset-1.html)
       * based on its name.
       *
       * The name lookup here is effectively done using {@link lookupImageset}. If
       * the name is not found, the current background imageset remains unchanged.
       *
       * Changing the background imageset may change the value of {@link wwtRenderType},
       * and the overall "mode" of the WWT renderer.
       */
      "setBackgroundImageByName",

      /** Set the rate at which the WWT clock progresses compared to wall-clock time.
       *
       * A value of 10 means that the WWT clock progresses ten times faster than
       * real time. A value of -0.1 means that the WWT clock moves backwards, ten
       * times slower than real time.
       *
       * Altering this causes an increment in {@link wwtClockDiscontinuities}.
       */
      "setClockRate",

      /** Set whether the WWT clock should progress with real time.
       *
       * See
       * [SpaceTimeController.set_syncToClock()](../../engine/modules/SpaceTimeController.html#set_synctoclock).
       * This interface effectively allows you to pause the WWT clock.
       *
       * Altering this causes an increment in {@link wwtClockDiscontinuities}.
       */
      "setClockSync",

      /** Set the colormap used for a FITS image layer according to
       * [the options](../../engine-helpers/interfaces/SetFitsLayerColormapOptions.html).
       */
      "setFitsLayerColormap",

      /** Set the current foreground [Imageset](../../engine/classes/Imageset-1.html)
       * based on its name.
       *
       * The name lookup here is effectively done using {@link lookupImageset}. If
       * the name is not found, the current foreground imageset remains unchanged.
       */
      "setForegroundImageByName",

      /** Set the opacity of the foreground imageset.
       *
       * Valid values are between 0 (invisible) and 100 (fully opaque).
       */
      "setForegroundOpacity",

      /** Change the [ImageSetLayer](../../engine/classes/ImageSetLayer.html)
       * position in the draw cycle.
       */
      "setImageSetLayerOrder",

      /** Set whether the renderer settings of tours should remain applied after
       * those tours finish playing back.
       *
       * This specialized option helps avoid jarring visual effects when tours
       * finish playing. If a tour activates a renderer option like "local horizon
       * mode", by default that option will turn off when the tour finishes, causing
       * the view to suddenly change. If this option is set to True, that setting
       * will remain active, preventing the sudden change.
       */
      "setTourPlayerLeaveSettingsWhenStopped",

      /** Set the current time of WWT's internal clock.
       *
       * Altering this causes an increment in {@link wwtClockDiscontinuities}.
       */
      "setTime",

      /** Set the "tracked object" in the 3D solar system view.
       *
       * Allowed values are
       * [defined in @wwtelescope/engine-types](../../engine-types/enums/SolarSystemObjects.html).
       */
      "setTrackedObject",

      /** Set up the background and foreground imagesets according to
       * [the options](../../engine-helpers/interfaces/SetupForImagesetOptions.html)
       *
       * The main use of this interface is that it provides a mechanism to guess
       * the appropriate background imageset given a foreground imageset that you
       * want to show.
       */
      "setupForImageset",

      /** Start playback of the currently loaded tour.
       *
       * Nothing happens if no tour is loaded.
       */
      "startTour",

      /** Alter the "stretch" of a FITS image layer according to
       * [the options](../../engine-helpers/interfaces/StretchFitsLayerOptions.html).
       */
      "stretchFitsLayer",

      /** Toggle the play/pause state of the current tour.
       *
       * Nothing happens if no tour is loaded.
       */
      "toggleTourPlayPauseState",

      /** Update the contents of a tabular data layer according to
       * [the options](../../engine-helpers/interfaces/UpdateTableLayerOptions.html).
       */
      "updateTableLayer",

      //"updateAvailableImagesets",

      /** Set the zoom level of the view.
       *
       * This action may result in an action that takes a perceptible amount of
       * time to resolve, if the "smooth pan" renderer option is enabled. To have
       * proper asynchronous feedback about when the zoom operation completes, use
       * {@link gotoRADecZoom}.
       */
      "zoom",

      /** Moves the position of the view */
      "move",

      /** Tilts the position of the view */
      "tilt",
    ]),
  }

});
