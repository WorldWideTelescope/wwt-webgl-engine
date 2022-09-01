// Copyright 2020-2021 the .NET Foundation
// Licensed under the MIT License

import { Component, Vue, Prop } from "vue-property-decorator";
import { createNamespacedHelpers } from "vuex";

import {
  ImageSetType,
  SolarSystemObjects,
} from "@wwtelescope/engine-types";

import {
  Annotation,
  EngineSetting,
  Folder,
  Guid,
  Imageset,
  ImageSetLayer,
  InViewReturnMessage,
  SpreadSheetLayer,
  SpreadSheetLayerSettingsInterfaceRO,
} from "@wwtelescope/engine";

import {
  AddCatalogHipsByNameOptions,
  ApplyFitsLayerSettingsOptions,
  ApplyTableLayerSettingsOptions,
  GetCatalogHipsDataInViewOptions,
  GotoTargetOptions,
  AddImageSetLayerOptions,
  LoadFitsLayerOptions,
  SetLayerOrderOptions,
  SetFitsLayerColormapOptions,
  SetupForImagesetOptions,
  SpreadSheetLayerState,
  StretchFitsLayerOptions,
  UpdateTableLayerOptions,
} from "@wwtelescope/engine-helpers";

import {
  CatalogLayerInfo,
  CreateTableLayerParams,
  GotoRADecZoomParams,
  ImagesetInfo,
  ImageSetLayerState,
  LoadTourParams,
  LoadImageCollectionParams,
  WWTEngineVuexState,
} from "./store";

/** A class for Vue components that wish to interact with a [[WWTComponent]]
 * through the Vuex state management system.
 *
 * Skip to [The WWT Vuex Interface](#the-wwt-vuex-interface) for a quick summary
 * of how WWT's state is exposed and controlled in Vuex.
 *
 * ## Introduction
 *
 * Vue applications are composed of multiple [components]. In a WWT-powered app,
 * one of those components will be a `<WorldWideTelescope>` component containing
 * the actual WWT rendering window. The other components of the app will wish to
 * monitor or alter the state of the WWT rendering window. The
 * [[WWTAwareComponent]] class provides a convenient framework for doing so.
 *
 * [components]: https://vuejs.org/v2/guide/components.html
 *
 * In particular, if your component’s TypeScript class [extends] this class, it
 * will automatically be set up with fields and methods allowing you to interact
 * with the WWT engine’s state. A minimal example:
 *
 * [extends]: https://www.typescriptlang.org/docs/handbook/classes.html#inheritance
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
 *   import { Component } from "vue-property-decorator";
 *   import { fmtDegLat, fmtHours } from "@wwtelescope/astro";
 *   import { WWTAwareComponent } from "@wwtelescope/engine-vuex";
 *
 *   @Component
 *   export default class App extends WWTAwareComponent {
 *     get coordText() {
 *       return `${fmtHours(this.wwtRARad)} ${fmtDegLat(this.wwtDecRad)}`;
 *     }
 *   }
 * </script>
 * ```
 *
 * This simple `App` component will display the coordinates of the current center
 * of the WWT view, and the coordinate readout will update automagically as the
 * user interacts with the view.
 *
 * ## Props
 *
 * Classes inheriting from [[WWTAwareComponent]] automatically define a prop
 * named [[wwtNamespace]]. This should be set to the namespace of the [Vuex
 * module] used to track the `<WorldWideTelescope>` component’s state — that is,
 * it should have the same value as that component’s own `wwtNamespace` prop.
 * The default value is `"wwt"`.
 *
 * [Vuex module]: https://vuex.vuejs.org/guide/modules.html
 *
 * ## The WWT Vuex Interface
 *
 * Your [[WWTAwareComponent]] can monitor or manipulate the state of the WWT
 * renderer using the following interfaces, grouped by category. As a reminder,
 * in the Vuex paradigm, state is expressed in [state variables] and [getters],
 * and modified through instantaneous [mutations] and asynchronous [actions].
 *
 * [state variables]: https://vuex.vuejs.org/guide/state.html
 * [getters]: https://vuex.vuejs.org/guide/getters.html
 * [mutations]: https://vuex.vuejs.org/guide/mutations.html
 * [actions]: https://vuex.vuejs.org/guide/actions.html
 *
 * ### Initialization
 *
 * Mutations:
 *
 * - [[setupForImageset]]
 *
 * Actions:
 *
 * - [[waitForReady]]
 *
 * ### Basic View Information
 *
 * State:
 *
 * - [[wwtCurrentTime]]
 * - [[wwtClockDiscontinuities]]
 * - [[wwtClockRate]]
 * - [[wwtDecRad]]
 * - [[wwtRARad]]
 * - [[wwtZoomDeg]]
 *
 * Getters:
 *
 * - [[findRADecForScreenPoint]]
 *
 * Mutations:
 *
 * - [[setClockRate]]
 * - [[setClockSync]]
 * - [[setTime]]
 * - [[setTrackedObject]]
 * - [[zoom]]
 *
 * Actions:
 *
 * - [[gotoRADecZoom]]
 * - [[gotoTarget]]
 *
 * ### Image Sets
 *
 * State:
 *
 * - [[wwtAvailableImagesets]]
 * - [[wwtBackgroundImageset]]
 * - [[wwtForegroundImageset]]
 * - [[wwtForegroundOpacity]]
 * - [[wwtRenderType]]
 *
 * Getters:
 *
 * - [[lookupImageset]]
 *
 * Mutations:
 *
 * - [[setBackgroundImageByName]]
 * - [[setForegroundImageByName]]
 * - [[setForegroundOpacity]]
 * - [[setupForImageset]]
 * - [[updateAvailableImagesets]]
 *
 * Actions:
 *
 * - [[loadImageCollection]]
 *
 * ### Imageset Layers (including FITS imagery)
 *
 * State:
 *
 * - [[wwtActiveLayers]]
 * - [[wwtImagesetLayers]]
 *
 * Getters:
 *
 * - [[activeImagesetLayerStates]]
 * - [[imagesetForLayer]]
 * - [[imagesetStateForLayer]]
 *
 * Mutations:
 *
 * - [[applyFitsLayerSettings]]
 * - [[setFitsLayerColormap]]
 * - [[stretchFitsLayer]]
 * - [[setImageSetLayerOrder]]
 * - [[deleteLayer]]
 *
 * Actions:
 *
 * - [[addImageSetLayer]]
 * - [[loadFitsLayer]] (deprecated)
 *
 * ### Tabular Data Layers
 *
 * State:
 *
 * - [[wwtActiveLayers]]
 * - [[wwtSpreadSheetLayers]]
 *
 * Mutations:
 *
 * - [[applyTableLayerSettings]]
 * - [[updateTableLayer]]
 * - [[deleteLayer]]
 *
 * Actions:
 *
 * - [[createTableLayer]]
 *
 * ### Annotations
 *
 * Mutations:
 *
 * - [[addAnnotation]]
 * - [[clearAnnotations]]
 * - [[removeAnnotation]]
 *
 * ### Progressive HiPS Catalogs
 *
 * These have some characteristics of both imagesets and tabular ("spreadsheet") data
 * layers.
 *
 * Getters:
 *
 * - [[layerForHipsCatalog]]
 * - [[spreadsheetStateForHipsCatalog]]
 *
 * Mutations:
 *
 * - [[applyTableLayerSettings]]
 * - [[removeCatalogHipsByName]]
 *
 * Actions:
 *
 * - [[addCatalogHipsByName]]
 * - [[getCatalogHipsDataInView]]
 *
 * ### Tours
 *
 * State:
 *
 * - [[wwtIsTourPlayerActive]]
 * - [[wwtIsTourPlaying]]
 * - [[wwtTourCompletions]]
 * - [[wwtTourRunTime]]
 * - [[wwtTourStopStartTimes]]
 * - [[wwtTourTimecode]]
 *
 * Mutations:
 *
 * - [[seekToTourTimecode]]
 * - [[setTourPlayerLeaveSettingsWhenStopped]]
 * - [[startTour]]
 * - [[toggleTourPlayPauseState]]
 *
 * Actions:
 *
 * - [[loadTour]]
 *
 * ### Miscellaneous
 *
 * State:
 *
 * - [[showWebGl2Warning]]
 *
 * Mutations:
 *
 * - [[applySetting]]
 **/
@Component
export class WWTAwareComponent extends Vue {
  /** The namespace of the Vuex module used to track the WWT component’s state.
   * This prop should have the same value in all components in the app that
   * reference WWT.
   */
  @Prop({ default: "wwt" }) readonly wwtNamespace!: string;

  beforeCreate(): void {
    // Wire up this component to its backing WWT Vuex state module. We have to
    // wait until now to do so because we don't know a priori which Vuex module
    // namespace we'll be using. TODO: would like to be able to validate that
    // the namespace actually exists
    const namespace = this.$options.propsData ? (this.$options.propsData as any).wwtNamespace : "wwt";  // eslint-disable-line @typescript-eslint/no-explicit-any
    const { mapActions, mapGetters, mapMutations, mapState } = createNamespacedHelpers(namespace);

    this.$options.computed = {
      ...mapState({
        wwtActiveLayers: (state, _getters) => (state as WWTEngineVuexState).activeLayers,
        wwtAvailableImagesets: (state, _getters) => (state as WWTEngineVuexState).availableImagesets,
        wwtBackgroundImageset: (state, _getters) => (state as WWTEngineVuexState).backgroundImageset,
        wwtCurrentTime: (state, _getters) => (state as WWTEngineVuexState).currentTime,
        wwtClockDiscontinuities: (state, _getters) => (state as WWTEngineVuexState).clockDiscontinuities,
        wwtClockRate: (state, _getters) => (state as WWTEngineVuexState).clockRate,
        wwtDecRad: (state, _getters) => (state as WWTEngineVuexState).decRad,
        wwtForegroundImageset: (state, _getters) => (state as WWTEngineVuexState).foregroundImageset,
        wwtForegroundOpacity: (state, _getters) => (state as WWTEngineVuexState).foregroundOpacity,
        wwtImagesetLayers: (state, _getters) => (state as WWTEngineVuexState).imagesetLayers,
        wwtIsTourPlayerActive: (state, _getters) => (state as WWTEngineVuexState).isTourPlayerActive,
        wwtIsTourPlaying: (state, _getters) => (state as WWTEngineVuexState).isTourPlaying,
        wwtRARad: (state, _getters) => (state as WWTEngineVuexState).raRad,
        wwtRenderType: (state, _getters) => (state as WWTEngineVuexState).renderType,
        wwtRollRad: (state, _getters) => (state as WWTEngineVuexState).rollRad,
        wwtTourCompletions: (state, _getters) => (state as WWTEngineVuexState).tourCompletions,
        wwtTourRunTime: (state, _getters) => (state as WWTEngineVuexState).tourRunTime,
        wwtTourStopStartTimes: (state, _getters) => (state as WWTEngineVuexState).tourStopStartTimes,
        wwtTourTimecode: (state, _getters) => (state as WWTEngineVuexState).tourTimecode,
        wwtZoomDeg: (state, _getters) => (state as WWTEngineVuexState).zoomDeg,
        wwtShowWebGl2Warning: (state, _getters) => (state as WWTEngineVuexState).showWebGl2Warning,
        wwtSpreadSheetLayers: (state, _getters) => (state as WWTEngineVuexState).spreadSheetLayers,
      }),
      ...mapGetters([
        "activeImagesetLayerStates",
        "findRADecForScreenPoint",
        "findScreenPointForRADec",
        "imagesetForLayer",
        "imagesetStateForLayer",
        "layerForHipsCatalog",
        "lookupImageset",
        "spreadSheetLayerById",
        "spreadSheetLayer",
        "spreadsheetState",
        "spreadsheetStateById",
        "spreadsheetStateForHipsCatalog",
      ]),
      ...this.$options.computed,
    };

    // TODO: is there a convenient way to namespace these? Also note that we
    // have to forcibly override pre-existing methods (i.e., the
    // this.$options.methods comes before the mapActions) since we have to
    // define dummy methods to make TypeScript happy.
    this.$options.methods = {
      ...this.$options.methods,
      ...mapActions([
        "addCatalogHipsByName",
        "createTableLayer",
        "getCatalogHipsDataInView",
        "gotoRADecZoom",
        "gotoTarget",
        "loadImageCollection",
        "loadFitsLayer",
        "addImageSetLayer",
        "loadTour",
        "viewAsTourXml",
        "waitForReady",
      ]),
      ...mapMutations([
        "addAnnotation",
        "applyFitsLayerSettings",
        "applyTableLayerSettings",
        "applySetting",
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
        "updateAvailableImagesets",
        "zoom",
        "move",
        "tilt",
      ]),
    };
  }

  // Teach TypeScript about everything we wired up. State:

  /** The GUIDs of all rendered layers, in their draw order.
   *
   * This list gives the GUIDs of the layers that are currently candidates for
   * rendering. This list is determined by the hierarchy of "layer maps"
   * registered with the engine and its current rendering mode. Layers in this
   * list might not be actually rendered if their `enabled` flag is false, if
   * they are fully transparent, and so on.
   **/
  wwtActiveLayers!: string[];

  /** Information about the imagesets that are available to be used as a background.
   *
   * The info includes the name, which can then be used to set the background image
   * via the [[setBackgroundImageByName]] mutation.
   */
  wwtAvailableImagesets!: ImagesetInfo[];

  /** The current background [Imageset](../../engine/classes/imageset.html), or
   * null if it is undefined.
   *
   * You can cause this state variable to change using the
   * [[setBackgroundImageByName]] mutation.
   * **/
  wwtBackgroundImageset!: Imageset | null;

  /** The number of times that the progression of the WWT internal clock has
   * been changed discontinuously.
   *
   * The main use of this state variable is that you can
   * [watch](https://vuex.vuejs.org/api/#watch) for changes to it and be alerted
   * when the clock has been altered. */
  wwtClockDiscontinuities!: number;

  /** The rate at which the WWT internal clock progresses compared to real time.
   * If the WWT clock is paused, this will be zero. Negative and fractional
   * values are both possible. */
  wwtClockRate!: number;

  /** The current time of WWT internal clock. In normal operation this variable
   * will change with every rendered WWT frame, or every 30 ms or so.
   */
  wwtCurrentTime!: Date;

  /** The current declination of the center of the WWT view, in radians.
   *
   * TODO: define the meaning here for view modes other than "sky."
   */
  wwtDecRad!: number;

  /** The current foreground [Imageset](../../engine/classes/imageset.html), or
   * null if it is undefined.
   *
   * You can cause this state variable to change using the
   * [[setForegroundImageByName]] mutation.
   * **/
  wwtForegroundImageset!: Imageset | null;

  /** The opacity of the foreground imageset. Values range between 0 (invisible)
   * and 100 (fully opaque). */
  wwtForegroundOpacity!: number;

  /** A table of activated imageset layers.
   *
   * Use [[imagesetStateForLayer]] to access information about a particular
   * layer.
   */
  wwtImagesetLayers!: { [guidtext: string]: ImageSetLayerState };

  /** Whether a tour has been loaded up and is available for playback. */
  wwtIsTourPlayerActive!: boolean;

  /** Whether a tour is actively playing back right now. This can spontaneously become
   * false if the tour completes playing. */
  wwtIsTourPlaying!: boolean;

  /** The current right ascension of the center of the WWT view, in radians.
   *
   * TODO: define the meaning here for view modes other than "sky."
   */
  wwtRARad!: number;

  /** The current mode of the WWT renderer.
   *
   * This is derived from the "type" of the active background imageset. To
   * change the mode, change the background imageset with
   * [[setBackgroundImageByName]].
   */
  wwtRenderType!: ImageSetType;

  /** The current roll of the view camera, in radians */
  wwtRollRad!: number;

  /** A table of activated imageset layers.
   *
   * Use [[imagesetStateForLayer]] to access information about a particular
   * layer.
   */
  wwtSpreadSheetLayers!: { [guidtext: string]: SpreadSheetLayerState };

  /** The number of times that a WWT tour has completed playing.
   *
   * The main use of this state variable is that you can
   * [watch](https://vuex.vuejs.org/api/#watch) for changes to it and be alerted
   * when a tour finishes. Watching [[wwtIsTourPlaying]] doesn't suffice because
   * that will trigger when a tour is paused. */
  wwtTourCompletions!: number;

  /** The total runtime of the current tour, in seconds, if there is one. */
  wwtTourRunTime!: number | null;

  /** The timecodes at which the current tour’s "stops" begin, in seconds.
   *
   * Each WWT tour is composed of one or more "stops", each of which has a fixed
   * wall-clock duration. This variable gives the start times of the stops under
   * the assumption that they all follow one another in sequence. It is possible
   * to have nonlinear flow from one stop to the next.
   *
   * If no tour is loaded, this is an empty array.
   */
  wwtTourStopStartTimes!: number[];

  /** The "timecode" of the current tour playback progression.
   *
   * The "timecode" is approximately the number of seconds elapsed since tour
   * playback began. More precisely, however, it is the start time of the
   * current tour stop, plus however much wall-clock time has elapsed while at
   * that stop. Because it is possible for stops to link to each other
   * non-linearly, it is also possible for the timecode to progress non-linearly
   * even when the tour plays back without user interaction.
   *
   * In combination with [[wwtTourStopStartTimes]], you can use this value to
   * determine the index number of the currently active tour stop.
   *
   * If no tour is loaded, this is zero.
   */
  wwtTourTimecode!: number;

  /** The WWT zoom level, in degrees.
   *
   * TODO: define the semantics here in 3D and other modes.
   *
   * In 2D sky mode, the zoom level is the angular height of the viewport,
   * *times six*.
   */
  wwtZoomDeg!: number;

  wwtShowWebGl2Warning!: boolean;

  // Getters

  /** Get the reactive state for the active imageset layers
   *
   * These layers are created using the [[addImageSetLayer]] action. The state
   * structures returned by this function are part of the reactive Vuex store, so
   * you can wire them up to your UI and they will update correctly. The list is
   * returned in the engine's render order.
   *
   * @returns The layer states
   */
  activeImagesetLayerStates!: ImageSetLayerState[];

  /** Look up the WWT engine object for an active imageset layer.
   *
   * This getter gets the WWT `Imageset` object associated with an imageset
   * layer. The returned object is *not* part of the Vue(x) reactivity system,
   * so you shouldn't use it to set up UI elements, but you can obtain more
   * detailed information about the imageset than is stored in the state
   * management system. For UI purposes, use [[imagesetStateForLayer]].
   *
   * @param guidtext The GUID of the layer to query, as a string
   * @returns The layer's underlying imageset, or null if the GUID is
   * unrecognized
   */
  imagesetForLayer!: (guidtext: string) => Imageset | null;

  /** Look up the reactive state for an active imageset layer.
   *
   * These layers are created using the [[addImageSetLayer]] action. The state
   * returned by this function is part of the reactive Vuex store, so you can
   * wire it up to your UI and it will update as the layer settings are changed.
   * If you need "runtime" state not captured in the reactivity system, you may
   * need to use [[imagesetForLayer]] instead.
   *
   * @param guidtext The GUID of the layer to query, as a string
   * @returns The layer state, or null if the GUID is unrecognized
   */
  imagesetStateForLayer!: (guidtext: string) => ImageSetLayerState | null;

  /** Look up an [Imageset](../../engine/classes/imageset.html) in the engine’s
   * table of ones with registered names.
   *
   * This delegates to
   * [WWTControl.getImagesetByName()](../../engine/wwtcontrol.html#getimagesetbyname),
   * which has very eager name-matching rules. But if nothing matches, null is
   * returned.
   *
   * Imagesets are not added to the engine’s list of names automatically. In
   * order for an imageset to be findable by this function, its containing
   * folder must have been loaded using the [[loadImageCollection]] action.
   */
  lookupImageset!: (_n: string) => Imageset | null;

  /** Get the right ascension and declination, in degrees, for x, y coordinates on the screen */
  findRADecForScreenPoint!: (pt: { x: number; y: number }) => { ra: number; dec: number };

  /** Given an RA and Dec position, return the x, y coordinates of the screen point */
  findScreenPointForRADec!: (pt:  { ra: number; dec: number }) => { x: number; y: number };

  /** Get the actual WWT `SpreadSheetLayer` for the table layer with the given ID.
   *
   * Do not use this function for UI purposes -- the WWT layer object is not
   * integrated into the reactive state system, and so if you use it as a basis
   * for UI elements, those elements will not be updated properly if/when the
   * layer's settings change. Use [[spreadsheetState]] instead.
   *
   * @param id The table layer's identifier.
   */
  spreadSheetLayerById!: (id: string) => SpreadSheetLayer | null;

  /** Get the actual WWT `SpreadSheetLayer` for the named HiPS catalog.
   *
   * Do not use this function for UI purposes -- the WWT layer object is not
   * integrated into the reactive state system, and so if you use it as a basis
   * for UI elements, those elements will not be updated properly if/when the
   * layer's settings change. Use [[spreadsheetStateForHipsCatalog]] instead.
   *
   * @param name The `datasetName` of the HiPS catalog
   */
  layerForHipsCatalog!: (name: string) => SpreadSheetLayer | null;

  /** Get the actual WWT `SpreadSheetLayer` for the table layer corresponding
   * to the given CatalogLayerInfo.
   *
   * Do not use this function for UI purposes -- the WWT layer object is not
   * integrated into the reactive state system, and so if you use it as a basis
   * for UI elements, those elements will not be updated properly if/when the
   * layer's settings change. Use [[spreadsheetState]] instead.
   *
   * @param id The table layer's identifier.
   */
  spreadSheetLayer!: (catalog: CatalogLayerInfo) => SpreadSheetLayer | null;

  // Mutations

  /** Add an [Annotation](../../engine/classes/annotation.html) to the view. */
  addAnnotation!: (_a: Annotation) => void;

  /** Alter one or more settings of the specified FITS image layer as specified
   * in [the options](../../engine-helpers/interfaces/applyfitslayersettingsoptions.html).
   */
  applyFitsLayerSettings!: (_o: ApplyFitsLayerSettingsOptions) => void;

  /** Alter one or more settings of the specified tabular data layers as specified
   * in [the options](../../engine-helpers/interfaces/applytablelayersettingsoptions.html).
   */
  applyTableLayerSettings!: (_o: ApplyTableLayerSettingsOptions) => void;

  /** Alter one [WWT engine setting](../../engine/modules.html#enginesetting). */
  applySetting!: (_s: EngineSetting) => void;

  /** Clear all [Annotations](../../engine/classes/annotation.html) from the view. */
  clearAnnotations!: () => void;

  /** Delete the specified layer from the layer manager.
   *
   * A layer may be identified by either its name or its [id](../../engine/classes/layer.html#id).
   */
  deleteLayer!: (id: string | Guid) => void;

  /** Remove the specified [Annotation](../../engine/classes/annotation.html) from the view. */
  removeAnnotation!: (_a: Annotation) => void;

  /** Remove a "catalog HiPS" dataset to the current view, by name. */
  removeCatalogHipsByName!: (name: string) => void;

  /** Seek tour playback to the specified timecode.
   *
   * See [[wwtTourTimecode]] for a definition of the tour timecode.
   *
   * An important limitation is that the engine can only seek to the very
   * beginning of a tour stop. If you request a timecode in the middle of a
   * slide, the seek will actually occur to the start time of that slide.
   */
  seekToTourTimecode!: (value: number) => void;

  /** Set the current background [Imageset](../../engine/classes/imageset.html)
   * based on its name.
   *
   * The name lookup here is effectively done using [[lookupImageset]]. If
   * the name is not found, the current background imageset remains unchanged.
   *
   * Changing the background imageset may change the value of [[wwtRenderType]],
   * and the overall "mode" of the WWT renderer.
   */
  setBackgroundImageByName!: (_n: string) => void;

  /** Set the rate at which the WWT clock progresses compared to wall-clock time.
   *
   * A value of 10 means that the WWT clock progresses ten times faster than
   * real time. A value of -0.1 means that the WWT clock moves backwards, ten
   * times slower than real time.
   *
   * Altering this causes an increment in [[wwtClockDiscontinuities]].
   */
  setClockRate!: (_r: number) => void;

  /** Set whether the WWT clock should progress with real time.
   *
   * See
   * [SpaceTimeController.set_syncToClock()](../../engine/modules/spacetimecontroller.html#set_synctoclock).
   * This interface effectively allows you to pause the WWT clock.
   *
   * Altering this causes an increment in [[wwtClockDiscontinuities]].
   */
  setClockSync!: (_s: boolean) => void;

  /** Set the colormap used for a FITS image layer according to
   * [the options](../../engine-helpers/interfaces/setfitslayercolormapoptions.html).
   */
  setFitsLayerColormap!: (_o: SetFitsLayerColormapOptions) => void;

  /** Set the current foreground [Imageset](../../engine/classes/imageset.html)
   * based on its name.
   *
   * The name lookup here is effectively done using [[lookupImageset]]. If
   * the name is not found, the current foreground imageset remains unchanged.
   */
  setForegroundImageByName!: (_n: string) => void;

  /** Set the opacity of the foreground imageset.
   *
   * Valid values are between 0 (invisible) and 100 (fully opaque).
   */
  setForegroundOpacity!: (o: number) => void;

  /** Change the [ImageSetLayer](../../engine/classes/imagesetlayer.html)
   * position in the draw cycle.
   */
  setImageSetLayerOrder!: (_o: SetLayerOrderOptions) => void;

  /** Set the current time of WWT's internal clock.
   *
   * Altering this causes an increment in [[wwtClockDiscontinuities]].
   */
  setTime!: (d: Date) => void;

  /** Set whether the renderer settings of tours should remain applied after
   * those tours finish playing back.
   *
   * This specialized option helps avoid jarring visual effects when tours
   * finish playing. If a tour activates a renderer option like "local horizon
   * mode", by default that option will turn off when the tour finishes, causing
   * the view to suddenly change. If this option is set to True, that setting
   * will remain active, preventing the sudden change.
   */
  setTourPlayerLeaveSettingsWhenStopped!: (v: boolean) => void;

  /** Set the "tracked object" in the 3D solar system view.
   *
   * Allowed values are
   * [defined in @wwtelescope/engine-types](../../engine-types/enums/solarsystemobjects.html).
   */
  setTrackedObject!: (o: SolarSystemObjects) => void;

  /** Set up the background and foreground imagesets according to
   * [the options](../../engine-helpers/interfaces/setupforimagesetoptions.html)
   *
   * The main use of this interface is that it provides a mechanism to guess
   * the appropriate background imageset given a foreground imageset that you
   * want to show.
   */
  setupForImageset!: (o: SetupForImagesetOptions) => void;

    /** Get reactive `SpreadSheetLayer` settings for the table layer with the given ID.
   *
   * The returned data structure is a component of the app's Vuex state. You can
   * therefore use the settings to construct UI elements, and they will update
   * reactively as the state evolves. The actual data structures used by WWT are
   * separate, but the two mirror each other.
   *
   * @param id The identifier of the table layer.
   */
  spreadsheetStateById!: (id: string) => SpreadSheetLayerSettingsInterfaceRO | null;

  /** Get reactive `SpreadSheetLayer` settings for the named HiPS catalog.
   *
   * The returned data structure is a component of the app's Vuex state. You can
   * therefore use the settings to construct UI elements, and they will update
   * reactively as the state evolves. The actual data structures used by WWT are
   * separate, but the two mirror each other.
   *
   * @param name The `datasetName` of the HiPS catalog
   */
  spreadsheetStateForHipsCatalog!: (name: string) => SpreadSheetLayerSettingsInterfaceRO | null;

  /** Get reactive `SpreadSheetLayer` settings for the table layer corresponding to 
   * the given CatalogLayerInfo.
   *
   * The returned data structure is a component of the app's Vuex state. You can
   * therefore use the settings to construct UI elements, and they will update
   * reactively as the state evolves. The actual data structures used by WWT are
   * separate, but the two mirror each other.
   *
   * @param catalog A CatalogLayerInfo object corresponding to the layer.
   */
    spreadsheetState!: (catalog: CatalogLayerInfo) => SpreadSheetLayerSettingsInterfaceRO | null;

  /** Start playback of the currently loaded tour.
   *
   * Nothing hppanes if no tour is loaded.
   */
  startTour!: () => void;

  /** Alter the "stretch" of a FITS image layer according to
   * [the options](../../engine-helpers/interfaces/stretchfitslayeroptions.html).
   */
  stretchFitsLayer!: (o: StretchFitsLayerOptions) => void;

  /** Toggle the play/pause state of the current tour.
   *
   * Nothing happens if no tour is loaded.
   */
  toggleTourPlayPauseState!: () => void;

  /** Update the contents of a tabular data layer according to
   * [the options](../../engine-helpers/interfaces/updatetablelayeroptions.html).
   */
  updateTableLayer!: (o: UpdateTableLayerOptions) => void;

  /** Set the zoom level of the view.
   *
   * This mutation may result in an action that takes a perceptible amount of
   * time to resolve, if the "smooth pan" renderer option is enabled. To have
   * proper asynchronous feedback about when the zoom operation completes, use
   * [[gotoRADecZoom]].
   */
  zoom!: (f: number) => void;

  /** Moves the position of the view */
  move!: (args: { x: number; y: number }) => void;

  /** Tilts the position of the view */
  tilt!: (args: { x: number; y: number }) => void;

  // Actions

  /** Add a "catalog HiPS" dataset to the current view, by name.
   *
   * If the catalog name is not in the engine's registry, the promise rejects.
   */
  addCatalogHipsByName!: (_o: AddCatalogHipsByNameOptions) => Promise<Imageset>;

  /** Request the creation of a tabular data layer.
   *
   * The action resolves to a new [SpreadSheetLayer](../../engine/classes/spreadsheetlayer.html) instance.
   */
  createTableLayer!: (_o: CreateTableLayerParams) => Promise<SpreadSheetLayer>;

  /** Request an export of the catalog HiPS data within the current viewport. */
  getCatalogHipsDataInView!: (o: GetCatalogHipsDataInViewOptions) => Promise<InViewReturnMessage>;

  /** Command the view to steer to a specific configuration.
   *
   * The async action completes when the view arrives, or when
   * a subsequent view command overrides this one.
   *
   * TODO: document semantics when not in 2D sky mode!
   */
  gotoRADecZoom!: (_o: GotoRADecZoomParams) => Promise<void>;

  /** Command the view to steer as specified in
   * [the options](../../engine-helpers/interfaces/gototargetoptions.html).
   *
   * The async action completes when the view arrives, or when
   * a subsequent view command overrides this one.
   */
  gotoTarget!: (o: GotoTargetOptions) => Promise<void>;

  /** Request the engine to load the specified image collection.
   *
   * The image collection is a [WTML file](https://docs.worldwidetelescope.org/data-guide/1/data-file-formats/collections/)
   * Images in collections loaded this way become usable for name-based lookup
   * by interfaces such as [[setForegroundImageByName]].
   *
   * The action resolves to a [Folder](../../engine/classes/folder.html) instance.
   * It’s asynchronous because the specified WTML file has to be downloaded.
   */
  loadImageCollection!: (_o: LoadImageCollectionParams) => Promise<Folder>;

  /** Deprecated. Use addImageSetLayer instead.
   * Request the creation of a FITS image layer.
   *
   * The action resolves to a new [ImageSetLayer](../../engine/classes/imagesetlayer.html) instance.
   * It’s asynchronous because the requested FITS file has to be downloaded.
   */
  loadFitsLayer!: (_o: LoadFitsLayerOptions) => Promise<ImageSetLayer>;

  /** Request the creation of a image layer. Either a single FITS or an image set.
   *
   * The action resolves to a new [ImageSetLayer](../../engine/classes/imagesetlayer.html) instance.
   * It’s asynchronous because the requested url has to be downloaded.
   */
  addImageSetLayer!: (_o: AddImageSetLayerOptions) => Promise<ImageSetLayer>;

  /** Request the engine to load a tour file.
   *
   * The action resolves when the load is complete. It’s asynchronous because
   * the full WTT tour file has to be downloaded.
  */
  loadTour!: (o: LoadTourParams) => Promise<void>;

  viewAsTourXml!: () => Promise<string | null>;

  /** Wait for the WWT engine to become ready for usage.
   *
   * You should invoke this action and wait for is completion before trying to
   * do anything else with a WWT-aware component. The action resolves when the
   * WWT engine has completed its initialization, which involes the download of
   * some supporting data files.
   */
  waitForReady!: () => Promise<void>;

}
