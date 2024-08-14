// Copyright 2020-2023 the .NET Foundation
// Licensed under the MIT License

import { defineStore } from 'pinia';

import { D2R, H2R } from "@wwtelescope/astro";

import {
  AltUnits,
  ImageSetType,
  ScaleTypes,
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
  Layer,
  LayerMap,
  SpreadSheetLayer,
  SpreadSheetLayerSettingsInterfaceRO,
  TileCache,
  WWTControl,
} from "@wwtelescope/engine";

import {
  AddCatalogHipsByNameOptions,
  AddImageSetLayerOptions,
  ApplyFitsLayerSettingsOptions,
  ApplyTableLayerSettingsOptions,
  applyImageSetLayerSetting,
  applySpreadSheetLayerSetting,
  CaptureFrameOptions,
  GetCatalogHipsDataInViewOptions,
  GotoTargetOptions,
  ImageSetLayerState as ImageSetLayerSettings,
  LoadFitsLayerOptions,
  SetFitsLayerColormapOptions,
  SetLayerOrderOptions,
  SetupForImagesetOptions,
  SpreadSheetLayerState,
  StretchFitsLayerOptions,
  UpdateTableLayerOptions,
  WWTInstance,
  CaptureVideoOptions,
} from "@wwtelescope/engine-helpers";

/** @hidden */
interface WWTLinkedCallback {
  (): void;
}

/** The class of the global `$wwt` magic singleton. */
export class WWTGlobalState {
  inst: WWTInstance | null = null;
  onLinkedCallbacks: WWTLinkedCallback[] = [];

  link(inst: WWTInstance): void {
    if (this.inst !== null)
      throw new Error("must unlink WWT Pinia global state before relinking");

    this.inst = inst;

    for (const cb of this.onLinkedCallbacks) {
      cb();
    }

    this.onLinkedCallbacks = [];
  }

  unlink(): void {
    this.inst = null;
  }
}

/** This class holds basic information about an imageset.
 *
 * Discover imagesets through the {@link engineStore.availableImagesets}
 * state variable. In standard practice there will be hundreds of available
 * imagesets of many different kinds.
 *
 * Imagesets may be uniquely identified by their associated image data {@link url}.
 * (If you really need to have multiple imagesets associated with the same URL,
 * add a `#fragment` to the end.)
 */
export class ImagesetInfo {
  /** The URL of the image data. */
  url: string;

  /** The user-facing name of the imageset. */
  name: string;

  /** The type of the imageset: panorama, sky, ... */
  type: ImageSetType;

  /** The internal GUID of the layer, if it is a HiPS layer */
  id: string | null;

  /** An (application-specific) string giving some additional information about
   * the imageset. */
  description: string;

  /** The image filename extension(s) associated with this imageset.
   *
   * May include multiple extensions separated by spaces. May also start with a
   * leading period.
   */
  extension: string;

  constructor(url: string, name: string, type: ImageSetType, description: string, extension: string, id: string | null = null) {
    this.url = url;
    this.name = name;
    this.type = type;
    this.description = description;
    this.extension = extension;
    this.id = id;
  }

  static fromImageset(imageset: Imageset): ImagesetInfo {
    return new ImagesetInfo(imageset.get_url(), imageset.get_name(), imageset.get_dataSetType(), imageset.get_creditsText(), imageset.get_extension(), imageset.get_hipsProperties()?.get_catalogSpreadSheetLayer().id.toString() ?? null);
  }
}

/** Information about a spreadsheet (data table) layer. */
export class SpreadSheetLayerInfo {
  /** The user-facing name of the layer */
  name: string;

  /** The internal GUID of the layer */
  id: string;

  /** The reference frame in which the data are defined. */
  referenceFrame: string;

  setName(name: string) {
    this.name = name;
  }

  constructor(id: string, referenceFrame: string, name?: string) {
    this.id = id;
    this.referenceFrame = referenceFrame;
    this.name = name ?? id;
  }
}

/** This type defines the union of the various spreadsheet layers.
 *
 * Currently this includes standard spreadsheet layers, and HiPS catalog
 * layers, which are a sort of hybrid between spreadsheet and imageset
 * layers.
 */
export type CatalogLayerInfo = SpreadSheetLayerInfo | ImagesetInfo;

/** Information about an active imageset layer. */
export class ImageSetLayerState {
  /** Layer parameters exposed in WWT's generic "settings" system.
   *
   * This field is an instance of the [@wwtelescope/engine-helpers]
   * [ImageSetLayerState] class (which has the same name as this class, but is
   * different).
   *
   * [@wwtelescope/engine-helpers]: ../../engine-helpers/
   * [ImageSetLayerState]: ../../engine-helpers/classes/ImageSetLayerState.html
  */
  settings: ImageSetLayerSettings;

  /** For FITS-like images, the "stretch" used for color-mapping the image data. */
  scaleType: ScaleTypes;

  /** For FITS-like images, the lower cutoff used for color-mapping the image data. */
  vmin: number;

  /** For FITS-like images, the upper cutoff used for color-mapping the image data. */
  vmax: number;

  /** For FITS-like images, the name of the color map used to render the image
   * data.
   *
   * See [here](../../engine/modules/ColorMapContainer.html#fromnamedcolormap)
   * for the supported options. */
  colormapName: string;

  private guidText: string;

  constructor(source: ImageSetLayer) {
    this.guidText = source.id.toString();
    this.settings = new ImageSetLayerSettings(source);

    const fits = source.get_imageSet().get_fitsProperties();
    this.scaleType = fits.scaleType;
    this.vmin = fits.lowerCut;
    this.vmax = fits.upperCut;
    this.colormapName = fits.colorMapName;
  }

  getGuid(): string {
    return this.guidText;
  }
}

/** This interface expresses the properties exposed by the WWT Engine’s Pinia
 * store module. These are re-exposed by {@link WWTAwareComponent} with their
 * names prefixed with `wwt`.
 *
 * **This support interface is intentionally undocumented — see [The WWT Pinia
 * Interface](../functions/engineStore.html#md:the-wwt-pinia-interface)
 * instead!** This interface is entirely redundant with the items defined
 * {@link engineStore} and we have opted to centralize the in-depth
 * documentation there.
 */
export interface WWTEnginePiniaState {
  // NOTE: We were orginally alphabetizing these all, but now I think it will be
  // better to group topically related fields.

  // NOTE 2: as per the above, any items changed here should also be changed in
  // the definition of WWTAwareComponent, and documentation should go there.

  /** Information about the imagesets that are available to be used as a background.
   *
   * The info includes the name, which can then be used to set the background image
   * via the {@link setBackgroundImageByName} mutation.
   *
   * In {@link WWTAwareComponent} this item is exposed under the name
   * `wwtAvailableImagesets`.
   */
  availableImagesets: ImagesetInfo[];

  /** The current background [Imageset](../../engine/classes/Imageset-1.html), or
   * null if it is undefined.
   *
   * You can cause this state variable to change using the
   * {@link setBackgroundImageByName} mutation.
   *
   * In {@link WWTAwareComponent} this item is exposed under the name
   * `wwtBackgroundImageset`.
   */
  backgroundImageset: Imageset | null;

  /** The number of times that the progression of the WWT internal clock has
   * been changed discontinuously.
   *
   * The main use of this state variable is that you can
   * [watch](https://vuejs.org/api/reactivity-core.html#watch) for changes to it and be alerted
   * when the clock has been altered.
   *
   * In {@link WWTAwareComponent} this item is exposed under the name
   * `wwtClockDiscontinuities`.
   */
  clockDiscontinuities: number;

  /** The rate at which the WWT internal clock progresses compared to real time.
   * If the WWT clock is paused, this will be zero. Negative and fractional
   * values are both possible.
   *
   * In {@link WWTAwareComponent} this item is exposed under the name
   * `wwtClockRate`.
   */
  clockRate: number;

  /** The current time of WWT internal clock. In normal operation this variable
   * will change with every rendered WWT frame, or every 30 ms or so.
   *
   * In {@link WWTAwareComponent} this item is exposed under the name
   * `wwtCurrentTime`.
   */
  currentTime: Date;

  /** The current declination of the center of the WWT view, in radians.
   *
   * TODO: define the meaning here for view modes other than "sky."
   *
   * In {@link WWTAwareComponent} this item is exposed under the name
   * `wwtDecRad`.
   */
  decRad: number;

  /** The current foreground [Imageset](../../engine/classes/Imageset-1.html), or
   * null if it is undefined.
   *
   * You can cause this state variable to change using the
   * {@link setForegroundImageByName} mutation.
   *
   * In {@link WWTAwareComponent} this item is exposed under the name
   * `wwtForegroundImageset`.
   */
  foregroundImageset: Imageset | null;

  /** The opacity of the foreground imageset. Values range between 0 (invisible)
    * and 100 (fully opaque).
   *
   * In {@link WWTAwareComponent} this item is exposed under the name
   * `wwtForegroundOpacity`.
    */
  foregroundOpacity: number;

  /** Whether a tour has been loaded up and is available for playback.
   *
   * In {@link WWTAwareComponent} this item is exposed under the name
   * `wwtIsTourPlayerActive`.
   */
  isTourPlayerActive: boolean;

  /** Whether a tour is actively playing back right now. This can spontaneously become
   * false if the tour completes playing.
   *
   * In {@link WWTAwareComponent} this item is exposed under the name
   * `wwtIsTourPlaying`.
   */
  isTourPlaying: boolean;

  /** The current right ascension of the center of the WWT view, in radians.
   *
   * TODO: define the meaning here for view modes other than "sky."
   *
   * In {@link WWTAwareComponent} this item is exposed under the name
   * `wwtRARad`.
   */
  raRad: number;

  /** The current mode of the WWT renderer.
   *
   * This is derived from the "type" of the active background imageset. To
   * change the mode, change the background imageset with
   * {@link setBackgroundImageByName}.
   *
   * In {@link WWTAwareComponent} this item is exposed under the name
   * `wwtRenderType`.
   */
  renderType: ImageSetType;

  /** The current roll of the view camera, in radians.
   *
   * In {@link WWTAwareComponent} this item is exposed under the name
   * `wwtRollRad`.
   */
  rollRad: number;

  /** The time at which the Vue/Pinia system started up. */
  timeAtStartup: number;

  /** The number of times that a WWT tour has completed playing.
   *
   * The main use of this state variable is that you can
   * [watch](https://vuejs.org/api/reactivity-core.html#watch) for changes to it and be alerted
   * when a tour finishes. Watching {@link isTourPlaying} doesn't suffice because
   * that will trigger when a tour is paused.
   *
   * In {@link WWTAwareComponent} this item is exposed under the name
   * `wwtTourCompletions`.
   */
  tourCompletions: number;

  /** The total runtime of the current tour, in seconds, if there is one.
   *
   * In {@link WWTAwareComponent} this item is exposed under the name
   * `wwtTourRunTime`.
   */
  tourRunTime: number | null;

  /** The timecodes at which the current tour’s "stops" begin, in seconds.
   *
   * Each WWT tour is composed of one or more "stops", each of which has a fixed
   * wall-clock duration. This variable gives the start times of the stops under
   * the assumption that they all follow one another in sequence. It is possible
   * to have nonlinear flow from one stop to the next.
   *
   * If no tour is loaded, this is an empty array.
   *
   * In {@link WWTAwareComponent} this item is exposed under the name
   * `wwtTourStopStartTimes`.
   */
  tourStopStartTimes: number[];

  /** The "timecode" of the current tour playback progression.
   *
   * The "timecode" is approximately the number of seconds elapsed since tour
   * playback began. More precisely, however, it is the start time of the
   * current tour stop, plus however much wall-clock time has elapsed while at
   * that stop. Because it is possible for stops to link to each other
   * non-linearly, it is also possible for the timecode to progress non-linearly
   * even when the tour plays back without user interaction.
   *
   * In combination with {@link tourStopStartTimes}, you can use this value to
   * determine the index number of the currently active tour stop.
   *
   * If no tour is loaded, this is zero.
   *
   * In {@link WWTAwareComponent} this item is exposed under the name
   * `wwtTourTimecode`.
   */
  tourTimecode: number;

  /** Whether or not to show a warning about recommending WebGL 2
   *
   * In {@link WWTAwareComponent} this item is exposed under the name
   * `wwtShowWebGl2Warning`.
   */
  showWebGl2Warning: boolean;

  /** The WWT zoom level, in degrees.
   *
   * TODO: define the semantics here in 3D and other modes.
   *
   * In 2D sky mode, the zoom level is the angular height of the viewport,
   * *times six*.
   *
   * In {@link WWTAwareComponent} this item is exposed under the name
   * `wwtZoomDeg`.
   */
  zoomDeg: number;

  // Layers and layer management

  /** The GUIDs of all rendered layers, in their draw order.
   *
   * This list gives the GUIDs of the layers that are currently candidates for
   * rendering. This list is determined by the hierarchy of "layer maps"
   * registered with the engine and its current rendering mode. Layers in this
   * list might not be actually rendered if their `enabled` flag is false, if
   * they are fully transparent, and so on.
   *
   * In {@link WWTAwareComponent} this item is exposed under the name
   * `wwtActiveLayers`.
   */
  activeLayers: string[];

  /** A table of activated imageset layers.
   *
   * Use {@link imagesetStateForLayer} to access information about a particular
   * layer.
   *
   * In {@link WWTAwareComponent} this item is exposed under the name
   * `wwtImagesetLayers`.
   */
  imagesetLayers: { [guidtext: string]: ImageSetLayerState };

  /** A table of activated imageset layers.
   *
   * Use {@link imagesetStateForLayer} to access information about a particular
   * layer.
   *
   * In {@link WWTAwareComponent} this item is exposed under the name
   * `wwtSpreadSheetLayers`.
   */
  spreadSheetLayers: { [guidtext: string]: SpreadSheetLayerState };
}

/** The parameters for the {{@link engineStore.createTableLayer} action. */
export interface CreateTableLayerParams {
  /** The name to assign the layer. TODO: understand where (if anywhere) this name is exposed. */
  name: string;

  /** The name of the reference frame to which this layer is attached. */
  referenceFrame: string;

  /** The table data, as big CSV string. */
  dataCsv: string;
}

/** The parameters for the {{@link engineStore.timeToRADecZoom} action. */
export interface TimeToRADecZoomParams {
  /** The right ascension of the target, in radians. */
  raRad: number;

  /** The declination of the target, in radians. */
  decRad: number;

  /** The zoom level of the target, in *degrees*. */
  zoomDeg: number;

  /** Optional: The target roll of the target, in radians. */
  rollRad?: number;
}

/** The parameters for the {{@link engineStore.gotoRADecZoom} action. */
export interface GotoRADecZoomParams {
  /** The right ascension to go to, in radians. */
  raRad: number;

  /** The declination to go to, in radians. */
  decRad: number;

  /** The zoom level to go to, in *degrees*. This is the final angular height of
   * the WWT viewport. */
  zoomDeg: number;

  /** Whether the view should navigate instantly or pan smoothly.
   *
   * Smooth panning is generally preferable from a UX perspective because it
   * gives the engine time to download any data files that it may need to render
   * the view.
   */
  instant: boolean;

  /** Optional: The target roll of the camera, in radians. */
  rollRad?: number;
}

/** The parameters for the {{@link engineStore.loadTour} action. */
export interface LoadTourParams {
  /** The tour URL to load. */
  url: string;

  /** Whether to start playing it immediately. */
  play: boolean;
}

/** The parameters for the {{@link engineStore.loadImageCollection} action. */
export interface LoadImageCollectionParams {
  /** The WTML URL to load. */
  url: string;
  /** Optional, Recursively load any child folders. Defaults to false*/
  loadChildFolders?: boolean;
}

/** This function creates the list of currently active layers.
 * Keeping this functionality outside of the store allows us to use it from
 * inside either an action or a mutation.
 */
function activeLayersList(wwt: WWTGlobalState): string[] {
  if (wwt.inst === null)
    throw new Error('cannot get activeLayersList without linking to WWTInstance');

  const layers: string[] = [];

  function accum(lm: LayerMap) {
    for (const layer of lm.layers) {
      layers.push(layer.id.toString());
    }

    for (const [_mapname, sublm] of Object.entries(lm.childMaps)) {
      accum(sublm);
    }
  }

  const rootlm = wwt.inst.lm.get_allMaps()[wwt.inst.ctl.getCurrentReferenceFrame()];
  if (rootlm) {
    accum(rootlm);
  }

  return layers;
}


/** This function creates the list of currently available imagesets.
 * Keeping this functionality outside of the store allows us to use it from
 * inside either an action or a mutation.
 */
function availableImagesets(): ImagesetInfo[] {
  return WWTControl.getImageSets().map(ImagesetInfo.fromImageset);
}

/** The [Pinia] “use store” function defining the state of the WWT engine.
 *
 * [Pinia]: https://pinia.vuejs.org/core-concepts/#Defining-a-Store
 *
 * According to modern conventions, this function should be named
 * `useWWTEngineStore()`. Calling it returns a [Pinia store
 * object](https://pinia.vuejs.org/api/modules/pinia.html#Store) that allows you
 * to access and modify the WWT state. To get a broad sense of how Pinia store
 * objects may be used  in general, [explore the Pinia
 * documentation](https://pinia.vuejs.org/core-concepts/).
 *
 * See [The WWT Pinia Interface](#md:the-wwt-pinia-interface) below for an
 * organized overview of all of the ways your code can control WWT using this
 * framework.
 *
 * ## Example
 *
 * If you were implementing a WWT-aware component using the Vue [“Composition
 * API”][comp-api] with a `<script setup>` single-file component, you might
 * write something like:
 *
 * [comp-api]: https://vuejs.org/guide/introduction.html#api-styles
 *
 * ```vue
 * <template>
 *   <div id="app">
 *     <!-- Include a WWT Component: -->
 *     <WorldWideTelescope></WorldWideTelescope>
 *     <p class="coord-overlay">{{ coordText }}</p>
 *   </div>
 * </template>
 *
 * <script setup lang="ts">
 * import { computed } from "vue";
 * import { fmtDegLat, fmtHours } from "@wwtelescope/astro";
 * import { engineStore } from "@wwtelescope/engine-pinia";
 *
 * const wwt = engineStore();
 * const coordText = computed(() => `${fmtHours(wwt.raRad)} ${fmtDegLat(wwt.decRad)}`);
 * </script>
 *
 * <style lang="less">
 * #app { ... blah blah ... }
 * </style>
 * ```
 *
 * If you wanted to define a Vue component manually in TypeScript using the
 * Options API, you could manually connect some of its state or methods to the
 * WWT Pinia store with code like:
 *
 * ```ts
 * import { defineComponent } from "vue";
 * import { mapActions } from "pinia";
 * import { engineStore } from "@wwtelescope/engine-pinia";
 *
 * export class MyWWTAwareComponent extends defineComponent({
 *   methods: {
 *    ...mapActions(engineStore, ["gotoRADecZoom"])
 *   }
 * }) {}
 * ```
 *
 * This would define a component with an associated method named `gotoRADecZoom`
 * that would be magically wired up to the corresponding {@link gotoRADecZoom}
 * store action. However, the whole point of the {@link WWTAwareComponent} class
 * is to make it so that you don’t need to write this code yourself: it exposes
 * all of the store’s state and methods in a predefined component. Instead of
 * manually mapping out of the store as written above, you can just extend it
 * and get everything “for free”.
 *
 * # The WWT Pinia Interface
 *
 * Here we document all of the available WWT interfaces, grouping them by
 * category. As a reminder, in the Pinia paradigm, state is expressed in [state
 * variables] and [getters], and modified either directly or through [actions]
 * (which can be asynchronous).
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
 * - {@link currentTime}
 * - {@link clockDiscontinuities}
 * - {@link clockRate}
 * - {@link decRad}
 * - {@link raRad}
 * - {@link zoomDeg}
 * - {@link rollRad}
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
 * - {@link availableImagesets}
 * - {@link backgroundImageset}
 * - {@link foregroundImageset}
 * - {@link foregroundOpacity}
 * - {@link renderType}
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
 * - {@link activeLayers}
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
 * - {@link activeLayers}
 * - {@link imagesetLayers}
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
 * - {@link activeLayers}
 * - {@link spreadSheetLayers}
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
 * - {@link isTourPlayerActive}
 * - {@link isTourPlaying}
 * - {@link tourCompletions}
 * - {@link tourRunTime}
 * - {@link tourStopStartTimes}
 * - {@link tourTimecode}
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
 * - {@link showWebGl2Warning}
 *
 * Actions:
 *
 * - {@link applySetting}
 * - {@link viewAsTourXml}
 * - {@link captureFrame}
 * - {@link captureVideo}
 * - {@link clearTileCache}
 */
export const engineStore = defineStore('wwt-engine', {
  // NOTE: We were originally alphabetizing these all, but now I think it will
  // be better to group topically related fields.

  // Through typedoc magic, these fields are documented via the docstrings that
  // appear in the `WWTEnginePiniaState` interface definition.
  state: (): WWTEnginePiniaState => ({
    activeLayers: [],
    availableImagesets: [],
    backgroundImageset: null,
    clockDiscontinuities: 0,
    clockRate: 1.0,
    currentTime: new Date(),
    decRad: 0.0,
    foregroundImageset: null,
    foregroundOpacity: 100,
    imagesetLayers: {},
    isTourPlayerActive: false,
    isTourPlaying: false,
    raRad: 0.0,
    renderType: ImageSetType.sky,
    rollRad: 0,
    spreadSheetLayers: {},
    timeAtStartup: Date.now(),
    tourCompletions: 0,
    tourRunTime: null,
    tourStopStartTimes: [],
    tourTimecode: 0.0,
    showWebGl2Warning: false,
    zoomDeg: 0.0,
  }),

  getters: {
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
    lookupImageset(_state) {
      return (imagesetName: string) => {
        if (this.$wwt.inst === null)
          throw new Error('cannot lookupImageset without linking to WWTInstance');
        return this.$wwt.inst.ctl.getImagesetByName(imagesetName);
      }
    },

    /** Get the right ascension and declination, in degrees, for x, y coordinates on the screen */
    findRADecForScreenPoint(_state) {
      return (pt: { x: number; y: number }): { ra: number; dec: number } => {
        if (this.$wwt.inst === null)
          throw new Error('cannot findRADecForScreenPoint without linking to WWTInstance');
        const coords = this.$wwt.inst.ctl.getCoordinatesForScreenPoint(pt.x, pt.y);
        return { ra: (15 * coords.x + 720) % 360, dec: coords.y };
      }
    },

    /** Given an RA and Dec position, return the x, y coordinates of the screen point */
    findScreenPointForRADec(_state) {
      return (pt: { ra: number; dec: number }): { x: number; y: number } => {
        if (this.$wwt.inst === null)
          throw new Error('cannot findScreenPointForRADec without linking to WWTInstance');
        return this.$wwt.inst.ctl.getScreenPointForCoordinates(pt.ra / 15, pt.dec);
      }
    },

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
    imagesetStateForLayer(state) {
      return (guidtext: string): ImageSetLayerState | null => {
        return state.imagesetLayers[guidtext] || null;
      }
    },

    // NOTE that this getter is defined in a weird way. This is intentional as a
    // "bug fix" but I forget the reasoning: see commit
    // efa9bf14656aa97b6f7609ec411e768dfb42bdf8 . This makes it so tha this
    // docstring is no rendered in the HTML docs :-(

    /** Get the reactive state for the active imageset layers
     *
     * These layers are created using the {@link addImageSetLayer} action. The state
     * structures returned by this function are part of the reactive store, so
     * you can wire them up to your UI and they will update correctly. The list is
     * returned in the engine's render order.
     *
     * @returns The layer states
     */
    activeImagesetLayerStates(): ImageSetLayerState[] {
      const states: ImageSetLayerState[] = [];

      for (const guid of this.activeLayers) {
        const layerState = this.imagesetLayers[guid];
        if (layerState) {
          states.push(layerState);
        }
      }

      return states;
    },

    catalogLayerKey(_state) {
      return (catalog: CatalogLayerInfo): string => {
        return catalog.id ?? "";
      }
    },

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
    imagesetForLayer(_state) {
      return (guidtext: string): Imageset | null => {
        if (this.$wwt.inst === null)
          throw new Error('cannot get imagesetForLayer without linking to WWTInstance');

        const layer = this.$wwt.inst.lm.get_layerList()[guidtext];

        if (layer !== null && layer instanceof ImageSetLayer) {
          return layer.get_imageSet();
        } else {
          return null;
        }
      }
    },

    /** Get the actual WWT `ImageSetLayer` for the imageset layer with the given ID.
     *
     * Do not use this function for UI purposes -- the WWT layer object is not
     * integrated into the reactive state system, and so if you use it as a basis
     * for UI elements, those elements will not be updated properly if/when the
     * layer's settings change. Use {@link imagesetStateForLayer} instead.
     *
     * @param id The imageset layer's identifier.
     */
    imagesetLayerById(_state) {
      return (id: string): ImageSetLayer | null => {
        if (this.$wwt.inst === null)
          throw new Error('cannot get imagesetLayerById without linking to WWTInstance');
        const layer = this.layerById(id);
        if (layer !== null && layer instanceof ImageSetLayer) {
          return layer;
        } else {
          return null;
        }
      }
    },

    /** Get the actual WWT `SpreadSheetLayer` for the named HiPS catalog.
     *
     * Do not use this function for UI purposes -- the WWT layer object is not
     * integrated into the reactive state system, and so if you use it as a basis
     * for UI elements, those elements will not be updated properly if/when the
     * layer's settings change. Use {@link spreadsheetStateForHipsCatalog} instead.
     *
     * @param name The `datasetName` of the HiPS catalog
     */
    layerForHipsCatalog(_state) {
      return (name: string): SpreadSheetLayer | null => {
        if (this.$wwt.inst === null)
          throw new Error('cannot get layerForHipsCatalog without linking to WWTInstance');

        const id = Guid.createFrom(name).toString();
        return this.spreadSheetLayerById(id);
      }
    },

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
    layerById(_state) {
      return (id: string): Layer | null => {
        if (this.$wwt.inst === null)
          throw new Error('cannot get layerById without linking to WWTInstance');
        return this.$wwt.inst.lm.get_layerList()[id];
      }
    },

    /** Get reactive `SpreadSheetLayer` settings for the named HiPS catalog.
     *
     * The returned data structure is a component of the app's reactive state. You can
     * therefore use the settings to construct UI elements, and they will update
     * reactively as the state evolves. The actual data structures used by WWT are
     * separate, but the two mirror each other.
     *
     * @param name The `datasetName` of the HiPS catalog
     */
    spreadsheetStateForHipsCatalog(state) {
      return (name: string): SpreadSheetLayerSettingsInterfaceRO | null => {
        if (this.$wwt.inst === null)
          throw new Error('cannot get spreadsheetStateForHipsCatalog without linking to WWTInstance');

        const id = Guid.createFrom(name).toString();
        return state.spreadSheetLayers[id] || null;
      }
    },

    /** Get the actual WWT `SpreadSheetLayer` for the table layer with the given ID.
     *
     * Do not use this function for UI purposes -- the WWT layer object is not
     * integrated into the reactive state system, and so if you use it as a basis
     * for UI elements, those elements will not be updated properly if/when the
     * layer's settings change. Use {@link spreadsheetState} instead.
     *
     * @param id The table layer's identifier.
     */
    spreadSheetLayerById(_state) {
      return (id: string): SpreadSheetLayer | null => {
        if (this.$wwt.inst === null)
          throw new Error('cannot get spreadsheetLayerById without linking to WWTInstance');
        const layer = this.layerById(id);
        if (layer !== null && layer instanceof SpreadSheetLayer) {
          return layer;
        } else {
          return null;
        }
      }
    },

    /** Get reactive `SpreadSheetLayer` settings for the table layer with the given ID.
     *
     * The returned data structure is a component of the app's reactive state. You can
     * therefore use the settings to construct UI elements, and they will update
     * reactively as the state evolves. The actual data structures used by WWT are
     * separate, but the two mirror each other.
     *
     * @param id The identifier of the table layer.
     */
    spreadsheetStateById(state) {
      return (id: string): SpreadSheetLayerSettingsInterfaceRO | null => {
        return state.spreadSheetLayers[id] || null;
      }
    },

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
    spreadSheetLayer(_state) {
      return (catalog: CatalogLayerInfo): SpreadSheetLayer | null => {
        if (this.$wwt.inst === null)
          throw new Error('cannot get spreadSheetLayer without linking to WWTInstance');

        const key = this.catalogLayerKey(catalog);
        return this.spreadSheetLayerById(key);
      }
    },

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
    spreadsheetState(state) {
      return (catalog: CatalogLayerInfo): SpreadSheetLayerSettingsInterfaceRO | null => {
        const key = this.catalogLayerKey(catalog);
        return state.spreadSheetLayers[key] || null;
      }
    }
  },

  actions: {
    /** @hidden */
    internalLinkToInstance(wwt: WWTInstance): void {
      this.$wwt.link(wwt);
    },

    /** @hidden */
    internalUnlinkFromInstance(): void {
      this.$wwt.unlink();
    },

    /** @hidden */
    internalUpdate(): void {
      if (this.$wwt.inst === null)
        throw new Error('cannot internalUpdate without linking to WWTInstance');

      const wwt = this.$wwt.inst;

      const raRad = wwt.si.getRA() * H2R;
      if (this.raRad != raRad)
        this.raRad = raRad;

      const decRad = wwt.si.getDec() * D2R;
      if (this.decRad != decRad)
        this.decRad = decRad;

      const zoomDeg = wwt.ctl.renderContext.viewCamera.zoom;
      if (this.zoomDeg != zoomDeg)
        this.zoomDeg = zoomDeg;

      const rollRad = wwt.ctl.renderContext.viewCamera.rotation;
      if (this.rollRad != rollRad)
        this.rollRad = rollRad;

      const bg = wwt.ctl.renderContext.get_backgroundImageset() || null; // TEMP
      if (this.backgroundImageset != bg)
        this.backgroundImageset = bg;

      const time = wwt.stc.get_now();
      if (this.currentTime != time)
        this.currentTime = time;

      const fg = wwt.ctl.renderContext.get_foregroundImageset() || null; // TEMP
      if (this.foregroundImageset != fg)
        this.foregroundImageset = fg;

      if (this.foregroundOpacity != wwt.ctl.renderContext.viewCamera.opacity)
        this.foregroundOpacity = wwt.ctl.renderContext.viewCamera.opacity;

      if (this.renderType != wwt.ctl.renderType)
        this.renderType = wwt.ctl.renderType;

      const player = wwt.getActiveTourPlayer();
      this.tourTimecode = wwt.getEffectiveTourTimecode();

      if (player !== null) {
        this.isTourPlayerActive = true;
        this.isTourPlaying = wwt.getIsTourPlaying(player);
      } else {
        this.isTourPlayerActive = false;
        this.isTourPlaying = false;
      }

      const showWebGl2Warning = !wwt.si.isUsingWebGl2()
        && (Date.now() - this.timeAtStartup) < 15000;
      if (this.showWebGl2Warning != showWebGl2Warning) {
        this.showWebGl2Warning = showWebGl2Warning;
      }
    },

    /** @hidden */
    internalIncrementTourCompletions(): void {
      this.tourCompletions += 1;
    },

    /** Alter one [WWT engine setting](../../engine/modules.html#enginesetting). */
    applySetting(setting: EngineSetting): void {
      if (this.$wwt.inst === null)
        throw new Error('cannot applySetting without linking to WWTInstance');
      this.$wwt.inst.applySetting(setting);
    },

    /** Set the current background [Imageset](../../engine/classes/Imageset-1.html)
     * based on its name.
     *
     * The name lookup here is effectively done using {@link lookupImageset}. If
     * the name is not found, the current background imageset remains unchanged.
     *
     * Changing the background imageset may change the value of {@link renderType},
     * and the overall "mode" of the WWT renderer.
     */
    setBackgroundImageByName(imagesetName: string): void {
      if (this.$wwt.inst === null)
        throw new Error('cannot setBackgroundImageByName without linking to WWTInstance');
      this.$wwt.inst.setBackgroundImageByName(imagesetName);
    },

    /** Set the current foreground [Imageset](../../engine/classes/Imageset-1.html)
     * based on its name.
     *
     * The name lookup here is effectively done using {@link lookupImageset}. If
     * the name is not found, the current foreground imageset remains unchanged.
     */
    setForegroundImageByName(imagesetName: string): void {
      if (this.$wwt.inst === null)
        throw new Error('cannot setForegroundImageByName without linking to WWTInstance');
      this.$wwt.inst.setForegroundImageByName(imagesetName);
    },

    /** Set the opacity of the foreground imageset.
     *
     * Valid values are between 0 (invisible) and 100 (fully opaque).
     */
    setForegroundOpacity(opacity: number): void {
      if (this.$wwt.inst === null)
        throw new Error('cannot setForegroundOpacity without linking to WWTInstance');
      this.$wwt.inst.setForegroundOpacity(opacity);
      this.foregroundOpacity = opacity;
    },

    /** Set up the background and foreground imagesets according to
     * [the options](../../engine-helpers/interfaces/SetupForImagesetOptions.html)
     *
     * The main use of this interface is that it provides a mechanism to guess
     * the appropriate background imageset given a foreground imageset that you
     * want to show.
     */
    setupForImageset(options: SetupForImagesetOptions): void {
      if (this.$wwt.inst === null)
        throw new Error('cannot setupForImageset without linking to WWTInstance');
      this.$wwt.inst.setupForImageset(options);
    },

    /** Set the zoom level of the view.
     *
     * This action may result in an action that takes a perceptible amount of
     * time to resolve, if the "smooth pan" renderer option is enabled. To have
     * proper asynchronous feedback about when the zoom operation completes, use
     * {@link gotoRADecZoom}.
     */
    zoom(factor: number): void {
      if (this.$wwt.inst === null)
        throw new Error('cannot zoom without linking to WWTInstance');
      this.$wwt.inst.ctl.zoom(factor);
    },

    /** Moves the position of the view */
    move(args: { x: number; y: number }): void {
      if (this.$wwt.inst === null)
        throw new Error('cannot move without linking to WWTInstance');
      this.$wwt.inst.ctl.move(args.x, args.y);
    },

    /** Tilts the position of the view */
    tilt(args: { x: number; y: number }): void {
      if (this.$wwt.inst === null)
        throw new Error('cannot tilt without linking to WWTInstance');
      this.$wwt.inst.ctl._tilt(args.x, args.y);
    },

    /** Set the current time of WWT's internal clock.
     *
     * Altering this causes an increment in {@link clockDiscontinuities}.
     */
    setTime(time: Date): void {
      if (this.$wwt.inst === null)
        throw new Error('cannot setTime without linking to WWTInstance');
      this.$wwt.inst.stc.set_now(time);
      this.clockDiscontinuities += 1;
    },

    /** Set the rate at which the WWT clock progresses compared to wall-clock time.
     *
     * A value of 10 means that the WWT clock progresses ten times faster than
     * real time. A value of -0.1 means that the WWT clock moves backwards, ten
     * times slower than real time.
     *
     * Altering this causes an increment in {@link clockDiscontinuities}.
     */
    setClockRate(rate: number): void {
      if (this.$wwt.inst === null)
        throw new Error('cannot setClockRate without linking to WWTInstance');

      if (this.$wwt.inst.stc.get_timeRate() != rate) {
        this.$wwt.inst.stc.set_timeRate(rate);
        this.clockRate = rate;
        this.clockDiscontinuities += 1;
      }
    },

    /** Set whether the WWT clock should progress with real time.
     *
     * See
     * [SpaceTimeController.set_syncToClock()](../../engine/modules/SpaceTimeController.html#set_synctoclock).
     * This interface effectively allows you to pause the WWT clock.
     *
     * Altering this causes an increment in {@link clockDiscontinuities}.
     */
    setClockSync(isSynced: boolean): void {
      if (this.$wwt.inst === null)
        throw new Error('cannot setClockSync without linking to WWTInstance');

      if (this.$wwt.inst.stc.get_syncToClock() != isSynced) {
        this.$wwt.inst.stc.set_syncToClock(isSynced);

        if (isSynced) {
          this.clockRate = this.$wwt.inst.stc.get_timeRate();
        } else {
          this.clockRate = 0;
        }

        this.clockDiscontinuities += 1;
      }
    },

    /** Start playback of the currently loaded tour.
     *
     * Nothing happens if no tour is loaded.
     */
    startTour(): void {
      if (this.$wwt.inst === null)
        throw new Error('cannot start tour without linking to WWTInstance');

      const player = this.$wwt.inst.getActiveTourPlayer();
      if (player === null)
        throw new Error('no tour to start');

      player.play();
    },

    /** Stop playing the currently loaded tour.
      *
      * Nothing happens if no tour is currently playing.
      */
    stopTour(): void {
      if (this.$wwt.inst === null)
        throw new Error('cannot stop tour without linking to WWTInstance');

      const player = this.$wwt.inst.getActiveTourPlayer();
      if (player === null)
        throw new Error('no tour to stop');

      // The argument here is currently unused in the engine
      player.stop(false);
    },

    /** Close the active tour player, if there is one active.
      *
      * Any tour that is currently playing will be stopped.
      */
    closeTourPlayer(): void {
      if (this.$wwt.inst === null)
        throw new Error('cannot close tour player without linking to WWTInstance');

      const player = this.$wwt.inst.getActiveTourPlayer();
      if (player !== null) {
        player.close();
        this.$wwt.inst.ctl.uiController = null;
      }
    },

    /** Toggle the play/pause state of the current tour.
     *
     * Nothing happens if no tour is loaded.
     */
    toggleTourPlayPauseState(): void {
      if (this.$wwt.inst === null)
        throw new Error('cannot play/pause tour without linking to WWTInstance');

      const player = this.$wwt.inst.getActiveTourPlayer();
      if (player === null)
        throw new Error('no tour to play/pause');

      // Despite the unclear name, this function does toggle play/pause state.
      player.pauseTour();
    },

    /** Set whether the renderer settings of tours should remain applied after
     * those tours finish playing back.
     *
     * This specialized option helps avoid jarring visual effects when tours
     * finish playing. If a tour activates a renderer option like "local horizon
     * mode", by default that option will turn off when the tour finishes, causing
     * the view to suddenly change. If this option is set to True, that setting
     * will remain active, preventing the sudden change.
     */
    setTourPlayerLeaveSettingsWhenStopped(value: boolean): void {
      if (this.$wwt.inst === null)
        throw new Error('cannot setTourPlayerLeaveSettingsWhenStopped without linking to WWTInstance');

      const player = this.$wwt.inst.getActiveTourPlayer();
      if (player === null)
        throw new Error('no tour player to control');

      player.set_leaveSettingsWhenStopped(value);
    },

    /** Seek tour playback to the specified timecode.
     *
     * See {@link tourTimecode} for a definition of the tour timecode.
     *
     * An important limitation is that the engine can only seek to the very
     * beginning of a tour stop. If you request a timecode in the middle of a
     * slide, the seek will actually occur to the start time of that slide.
     */
    seekToTourTimecode(value: number): void {
      if (this.$wwt.inst === null)
        throw new Error('cannot seekToTourTimecode without linking to WWTInstance');

      this.$wwt.inst.seekToTourTimecode(value);
    },

    /** Get the current view as a one-slide tour, serialized to XML */
    async viewAsTourXml(name: string): Promise<string | null> {
      WWTControl.singleton.createTour(name || "");
      const editor = WWTControl.singleton.tourEdit;
      editor.addSlide(false);
      const tour = editor.get_tour();
      if (tour === null) {
        return Promise.resolve(null);
      }
      const blob = tour.saveToBlob();
      const reader = new FileReader();
      reader.readAsText(blob);

      let tourXml = "";
      return new Promise((resolve, _reject) => {
        reader.onloadend = () => {
          tourXml += reader.result;
          resolve(tourXml);
        }
      });
    },

    /** Wait for the WWT engine to become ready for usage.
     *
     * You should invoke this action and wait for is completion before trying to
     * do anything else with a WWT-aware component. The action resolves when the
     * WWT engine has completed its initialization, which involes the download of
     * some supporting data files.
     */
    async waitForReady(): Promise<void> {
      if (this.$wwt.inst !== null) {
        return this.$wwt.inst.waitForReady();
      } else {
        return new Promise((resolve, _reject) => {
          const waitThenResolve = (): void => {
            (this.$wwt.inst as WWTInstance).waitForReady().then(resolve);
          };

          if (this.$wwt.inst !== null) {
            waitThenResolve();
          } else {
            this.$wwt.onLinkedCallbacks.push(waitThenResolve);
          }
        });
      }
    },

    /** Command the view to steer to a specific configuration.
     *
     * The async action completes when the view arrives, or when
     * a subsequent view command overrides this one.
     *
     * TODO: document semantics when not in 2D sky mode!
     */
    async gotoRADecZoom(
      { raRad, decRad, zoomDeg, instant, rollRad }: GotoRADecZoomParams
    ): Promise<void> {
      if (this.$wwt.inst === null)
        throw new Error('cannot gotoRADecZoom without linking to WWTInstance');
      return this.$wwt.inst.gotoRADecZoom(raRad, decRad, zoomDeg, instant, rollRad);
    },

    /** Returns the time it would take, in seconds, to navigate to the given target. */
    timeToRADecZoom(
      { raRad, decRad, zoomDeg, rollRad }: TimeToRADecZoomParams
    ): number {
      if (this.$wwt.inst === null)
        throw new Error('cannot get timeToRADecZoom without linking to WWTInstance');
      return this.$wwt.inst.timeToRADecZoom(raRad, decRad, zoomDeg, rollRad);
    },

    /** Command the view to steer as specified in
     * [the options](../../engine-helpers/interfaces/GotoTargetOptions.html).
     *
     * The async action completes when the view arrives, or when
     * a subsequent view command overrides this one.
     */
    async gotoTarget(options: GotoTargetOptions): Promise<void> {
      if (this.$wwt.inst === null)
        throw new Error('cannot gotoTarget without linking to WWTInstance');
      return this.$wwt.inst.gotoTarget(options);
    },

    /** Set the "tracked object" in the 3D solar system view.
     *
     * Allowed values are
     * [defined in @wwtelescope/engine-types](../../engine-types/enums/SolarSystemObjects.html).
     */
    setTrackedObject(obj: SolarSystemObjects): void {
      if (this.$wwt.inst === null)
        throw new Error('cannot setTrackedObject without linking to WWTInstance');
      this.$wwt.inst.ctl.renderContext.set_solarSystemTrack(obj);
    },

    /** Request the engine to load a tour file.
     *
     * The action resolves when the load is complete. It’s asynchronous because
     * the full WTT tour file has to be downloaded.
    */
    async loadTour(
      { url, play }: LoadTourParams
    ): Promise<void> {
      if (this.$wwt.inst === null)
        throw new Error('cannot loadTour without linking to WWTInstance');

      if (play)
        await this.$wwt.inst.loadAndPlayTour(url);
      else
        await this.$wwt.inst.loadTour(url);

      let tourRunTime: number | null = null;
      const tourStopStartTimes: number[] = [];

      const player = this.$wwt.inst.getActiveTourPlayer();
      if (player !== null) {
        const tour = player.get_tour();
        if (tour !== null) {
          tourRunTime = tour.get_runTime() * 0.001; // ms => s
          const nStops = tour.get_tourStops().length;

          for (let i = 0; i < nStops; i++) {
            tourStopStartTimes.push(tour.elapsedTimeTillTourstop(i));
          }
        }
      }

      this.tourRunTime = tourRunTime;
      this.tourStopStartTimes = tourStopStartTimes;
    },

    /** Request the engine to load the specified image collection.
     *
     * The image collection is a [WTML file](https://docs.worldwidetelescope.org/data-guide/1/data-file-formats/collections/)
     * Images in collections loaded this way become usable for name-based lookup
     * by interfaces such as {@link setForegroundImageByName}.
     *
     * The action resolves to a [Folder](../../engine/classes/Folder.html) instance.
     * It’s asynchronous because the specified WTML file has to be downloaded.
     */
    async loadImageCollection(
      { url, loadChildFolders }: LoadImageCollectionParams
    ): Promise<Folder> {
      if (this.$wwt.inst === null)
        throw new Error('cannot loadImageCollection without linking to WWTInstance');
      const result = await this.$wwt.inst.loadImageCollection(url, loadChildFolders);
      this.availableImagesets = availableImagesets();
      return result;
    },

    /** Add an imageset directly into the engine's database.
     *
     * If an imageset with the same URL has already been loaded, this is a
     * no-op.
     *
     * This returns the imageset that ultimately resides in the engine's
     * database. It could either be the input argument, if it was newly added,
     * or a pre-existing imageset in the no-op condition.
     */
    addImagesetToRepository(imgset: Imageset): Imageset {
      if (this.$wwt.inst === null)
        throw new Error('cannot addImagesetToRepository without linking to WWTInstance');

      return this.$wwt.inst.addImagesetToRepository(imgset);
    },

    // General layers

    /** Delete the specified layer from the layer manager.
     *
     * A layer may be identified by either its name or its [id](../../engine/classes/Layer.html#id).
     */
    deleteLayer(id: string | Guid): void {
      if (this.$wwt.inst === null)
        throw new Error('cannot deleteLayer without linking to WWTInstance');

      let stringId = "";

      if (typeof id === "string") {
        stringId = id;
        const guid = Guid.fromString(id);
        this.$wwt.inst.lm.deleteLayerByID(guid, true, true);
      } else {
        stringId = id.toString();
        this.$wwt.inst.lm.deleteLayerByID(id, true, true);
      }

      // Mirror modification in the reactive system. Here we just
      // delete willy-nilly and ignore any missing cases.
      delete this.imagesetLayers[stringId];
      delete this.spreadSheetLayers[stringId];

      this.activeLayers = activeLayersList(this.$wwt);
    },

    // Imageset layers, including FITS layers

    /** Request the creation of a image layer. Either a single FITS or an image set.
     *
     * The action resolves to a new [ImageSetLayer](../../engine/classes/ImageSetLayer.html) instance.
     * It’s asynchronous because the requested url has to be downloaded.
     */
    async addImageSetLayer(
      options: AddImageSetLayerOptions
    ): Promise<ImageSetLayer> {
      if (this.$wwt.inst === null)
        throw new Error('cannot addImageSetLayer without linking to WWTInstance');

      // Mirror the layer state into the reactivity system.
      const wwtLayer = await this.$wwt.inst.addImageSetLayer(options);
      const guidText = wwtLayer.id.toString();
      this.imagesetLayers[guidText] = new ImageSetLayerState(wwtLayer);

      this.activeLayers = activeLayersList(this.$wwt);
      return wwtLayer;
    },

    /** Deprecated. Use addImageSetLayer instead.
     * Request the creation of a FITS image layer.
     *
     * The action resolves to a new [ImageSetLayer](../../engine/classes/ImageSetLayer.html) instance.
     * It’s asynchronous because the requested FITS file has to be downloaded.
     */
    async loadFitsLayer(
      options: LoadFitsLayerOptions
    ): Promise<ImageSetLayer> {
      if (this.$wwt.inst === null)
        throw new Error('cannot loadFitsLayer without linking to WWTInstance');

      const addImageSetLayerOptions: AddImageSetLayerOptions = {
        url: options.url,
        mode: "fits",
        name: options.name,
        goto: options.gotoTarget
      };

      return this.$wwt.inst.addImageSetLayer(addImageSetLayerOptions);
    },

    /** Change the [ImageSetLayer](../../engine/classes/ImageSetLayer.html)
     * position in the draw cycle.
     */
    setImageSetLayerOrder(options: SetLayerOrderOptions): void {
      if (this.$wwt.inst === null)
        throw new Error('cannot setImageSetLayerOrder without linking to WWTInstance');

      this.$wwt.inst.setImageSetLayerOrder(options);
      this.activeLayers = activeLayersList(this.$wwt);
    },

    /** Alter the "stretch" of a FITS image layer according to
     * [the options](../../engine-helpers/interfaces/StretchFitsLayerOptions.html).
     */
    stretchFitsLayer(options: StretchFitsLayerOptions): void {
      if (this.$wwt.inst === null)
        throw new Error('cannot stretchFitsLayer without linking to WWTInstance');

      this.$wwt.inst.stretchFitsLayer(options);

      // Update the reactive mirror.
      const state = this.imagesetLayers[options.id];
      if (state) {
        state.scaleType = options.stretch;
        state.vmin = options.vmin;
        state.vmax = options.vmax;
      }
    },

    /** Set the colormap used for a FITS image layer according to
     * [the options](../../engine-helpers/interfaces/SetFitsLayerColormapOptions.html).
     */
    setFitsLayerColormap(options: SetFitsLayerColormapOptions): void {
      if (this.$wwt.inst === null)
        throw new Error('cannot setFitsLayerColormap without linking to WWTInstance');

      this.$wwt.inst.setFitsLayerColormap(options);

      // Update the reactive mirror.
      const state = this.imagesetLayers[options.id];
      if (state) {
        state.colormapName = options.name;
      }
    },

    /** Alter one or more settings of the specified FITS image layer as specified
     * in [the options](../../engine-helpers/interfaces/ApplyFitsLayerSettingsOptions.html).
     */
    applyFitsLayerSettings(options: ApplyFitsLayerSettingsOptions): void {
      if (this.$wwt.inst === null)
        throw new Error('cannot applyFitsLayerSettings without linking to WWTInstance');

      this.$wwt.inst.applyFitsLayerSettings(options);

      // Update the reactive mirror.
      const state = this.imagesetLayers[options.id];
      if (state) {
        for (const s of options.settings) {
          applyImageSetLayerSetting(state.settings, s);
        }
      }
    },

    // Spreadsheet layers

    /** Request the creation of a tabular data layer.
     *
     * The action resolves to a new [SpreadSheetLayer](../../engine/classes/SpreadSheetLayer.html) instance.
     */
    async createTableLayer(
      options: CreateTableLayerParams
    ): Promise<SpreadSheetLayer> {
      if (this.$wwt.inst === null)
        throw new Error('cannot createTableLayer without linking to WWTInstance');

      const layer = this.$wwt.inst.lm.createSpreadsheetLayer(
        options.referenceFrame,
        options.name,
        options.dataCsv
      );

      // Value-add init copied from the pywwt JS component.
      // Override any column guesses:
      layer.set_lngColumn(-1);
      layer.set_latColumn(-1);
      layer.set_altColumn(-1);
      layer.set_sizeColumn(-1);
      layer.set_colorMapColumn(-1);
      layer.set_startDateColumn(-1);
      layer.set_endDateColumn(-1);
      layer.set_xAxisColumn(-1);
      layer.set_yAxisColumn(-1);
      layer.set_zAxisColumn(-1);

      layer.set_altUnit(AltUnits.meters);
      layer.set_referenceFrame(options.referenceFrame);

      if (options.referenceFrame == 'Sky') {
        layer.set_astronomical(true);
      }

      // Currently, table creation is synchronous, but treat it as async
      // in case our API needs to get more sophisticated later.
      const prom = Promise.resolve(layer);

      // Mirror the layer state into the reactivity system.
      const wwtLayer = await prom;
      const guidText = wwtLayer.id.toString();
      this.spreadSheetLayers[guidText] = new SpreadSheetLayerState(wwtLayer);

      this.activeLayers = activeLayersList(this.$wwt);
      return wwtLayer;
    },

    /** Alter one or more settings of the specified tabular data layers as specified
     * in [the options](../../engine-helpers/interfaces/ApplyTableLayerSettingsOptions.html).
     */
    applyTableLayerSettings(options: ApplyTableLayerSettingsOptions): void {
      if (this.$wwt.inst === null)
        throw new Error('cannot applyTableLayerSettings without linking to WWTInstance');

      this.$wwt.inst.applyTableLayerSettings(options);

      // Mirror changes in the reactive framework.
      const state = this.spreadSheetLayers[options.id];

      if (state !== undefined) {
        for (const s of options.settings) {
          applySpreadSheetLayerSetting(state, s);
        }
      }
    },

    /** Update the contents of a tabular data layer according to
     * [the options](../../engine-helpers/interfaces/UpdateTableLayerOptions.html).
     */
    updateTableLayer(options: UpdateTableLayerOptions): void {
      if (this.$wwt.inst === null)
        throw new Error('cannot updateTableLayer without linking to WWTInstance');
      this.$wwt.inst.updateTableLayer(options);

      // Nothing to mirror in reactive-land -- this call affects the table data.
    },

    // Progressive HiPS catalogs.
    //
    // These have some characteristics of imagesets, and some characteristics
    // of spreadsheet layers.

    /** Add a "catalog HiPS" dataset to the current view, by name.
     *
     * If the catalog name is not in the engine's registry, the promise rejects.
     */
    async addCatalogHipsByName(options: AddCatalogHipsByNameOptions): Promise<Imageset> {
      if (this.$wwt.inst == null)
        throw new Error('cannot addCatalogHipsByName without linking to WWTInstance');

      const imgset = await this.$wwt.inst.addCatalogHipsByName(options);

      // Mirror the spreadsheet layer aspect into the reactivity system.

      const hips = imgset.get_hipsProperties();

      if (hips !== null) {
        const wwtLayer = hips.get_catalogSpreadSheetLayer();
        const guidText = wwtLayer.id.toString();
        this.spreadSheetLayers[guidText] = new SpreadSheetLayerState(wwtLayer);
        const info = availableImagesets().find(x => x.name === options.name);
        if (info !== undefined) {
          info.id = guidText;
        }
      }

      this.activeLayers = activeLayersList(this.$wwt);
      return imgset;
    },

    /** Request an export of the catalog HiPS data within the current viewport. */
    getCatalogHipsDataInView(options: GetCatalogHipsDataInViewOptions): Promise<InViewReturnMessage> {
      if (this.$wwt.inst == null)
        throw new Error('cannot getCatalogHipsDataInView without linking to WWTInstance');
      return this.$wwt.inst.getCatalogHipsDataInView(options);
    },

    /** Remove a "catalog HiPS" dataset to the current view, by name. */
    removeCatalogHipsByName(name: string): void {
      if (this.$wwt.inst == null)
        throw new Error('cannot removeCatalogHipsByName without linking to WWTInstance');

      this.$wwt.inst.ctl.removeCatalogHipsByName(name);

      const id = Guid.createFrom(name).toString();
      delete this.spreadSheetLayers[id];

      this.activeLayers = activeLayersList(this.$wwt);
    },

    // Annotations

    /** Add an [Annotation](../../engine/classes/Annotation.html) to the view. */
    addAnnotation(ann: Annotation): void {
      if (this.$wwt.inst === null)
        throw new Error('cannot addAnnotation without linking to WWTInstance');
      this.$wwt.inst.si.addAnnotation(ann);
    },

    /** Remove the specified [Annotation](../../engine/classes/Annotation.html) from the view. */
    removeAnnotation(ann: Annotation): void {
      if (this.$wwt.inst === null)
        throw new Error('cannot removeAnnotation without linking to WWTInstance');
      this.$wwt.inst.si.removeAnnotation(ann);
    },

    /** Clear all [Annotations](../../engine/classes/Annotation.html) from the view. */
    clearAnnotations(): void {
      if (this.$wwt.inst === null)
        throw new Error('cannot clearAnnotations without linking to WWTInstance');
      this.$wwt.inst.si.clearAnnotations();
    },

    // Capturing the current display

    /** Capture the current frame as an image `Blob` with the desired width, height, and format.
     * The first argument is a callback function to execute on the created `Blob`. */
    captureFrame(options: CaptureFrameOptions): Promise<Blob | null> {
      if (this.$wwt.inst === null)
        throw new Error('cannot captureThumbnail without linking to WWTInstance');
      return this.$wwt.inst.captureFrame(options);
    },

    /** Capture a video as a stream of image `Blob`s with the desired width, height and format.
     * The number of frames per second and total frame count are specified as well. */
    captureVideo(options: CaptureVideoOptions): ReadableStream<Blob | null> {
      if (this.$wwt.inst === null)
        throw new Error("cannot captureVideo without linking to WWTInstance");
      return this.$wwt.inst.captureVideo(options);
    },

    /** Clear the current cache of tiles.
      * The intended use case here is if a network issue caused a necessary tile to not load.
      * This should only be used when necessary, as any previously downloaded tiles will need
      * to be re-fetched.
      * */
    clearTileCache(): void {
      TileCache.clearCache();
    }
  },
});
