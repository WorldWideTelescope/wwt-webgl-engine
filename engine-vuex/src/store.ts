// Copyright 2020-2021 the .NET Foundation
// Licensed under the MIT License

// The high-level docs in `wwtaware.ts` contain the developer-friendly
// descriptions of pretty much everything in this file. Update those docs when
// adding new features here.

import Vue from "vue";
import { Module, VuexModule, Mutation, MutationAction, Action } from 'vuex-module-decorators';

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
  LayerMap,
  SpreadSheetLayer,
  SpreadSheetLayerSettingsInterfaceRO,
  WWTControl,
} from "@wwtelescope/engine";

import {
  AddCatalogHipsByNameOptions,
  AddImageSetLayerOptions,
  ApplyFitsLayerSettingsOptions,
  ApplyTableLayerSettingsOptions,
  applyImageSetLayerSetting,
  applySpreadSheetLayerSetting,
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
} from "@wwtelescope/engine-helpers";

interface WWTLinkedCallback {
  (): void;
}

export class WWTGlobalState {
  inst: WWTInstance | null = null;
  onLinkedCallbacks: WWTLinkedCallback[] = [];

  link(inst: WWTInstance): void {
    if (this.inst !== null)
      throw new Error("must unlink WWT Vuex global state before relinking");

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
 * Discover imagesets through the [[WWTAwareComponent.wwtAvailableImagesets]]
 * state variable. In standard practice there will be hundreds of available
 * imagesets of many different kinds.
 *
 * Imagesets may be uniquely identified by their associated image data [[url]].
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

  /** An (application-specific) string giving some additional information about
   * the imageset. */
  description: string;

  /** The image filename extension(s) associated with this imageset.
   *
   * May include multiple extensions separated by spaces. May also start with a
   * leading period.
   */
  extension: string;

  constructor(url: string, name: string, type: ImageSetType, description: string, extension: string) {
    this.url = url;
    this.name = name;
    this.type = type;
    this.description = description;
    this.extension = extension;
  }
}

/** Information about an active imageset layer. */
export class ImageSetLayerState {
  /** Layer parameters exposed in WWT's generic "settings" system.
   *
   * This field is an instance of the [@wwtelescope/engine-helpers]
   * [ImageSetLayerState] class (which has the same name as this class, but is
   * different).
   *
   * [@wwtelescope/engine-helpers]: ../../engine-helpers/
   * [ImageSetLayerState]: ../../engine-helpers/classes/imagesetlayerstate.html
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
   * See [here](../../engine/modules/colormapcontainer.html#fromnamedcolormap)
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

/** This interface expresses the properties exposed by the WWT Engine’s Vuex
 * store module.
 *
 * See [[WWTAwareComponent]] for an organized overview of the different aspects
 * of WWT state that are exposed in the Vuex framework, along with associated
 * getters, actions, and mutations.
 *
 * Much of this interface duplicates state that is already stored within the WWT
 * engine itself (i.e., the `WWTInstance`). Due to the way that the Vue/Vuex
 * reactivity framework works, we need to mirror the engine state into Vuex. The
 * first reason to do this is that, as far as I can tell, there's no good way to
 * integrate the "external" state of the WWT instance into the reactivity
 * framework so that dependencies can be mapped correctly. And we can't just
 * integrate the WWT instance into the reactivity framework -- well, I haven't
 * tried, but I'm 99% sure that it won't work with all of the WebGL textures and
 * whatnot. I.e., the WWT types that hold state are not "plain old data".
 *
 * The second reason is that it is recommended for app state to be flattened and
 * normalized when expressed in Vuex, as in [this post]. The WWT engine
 * certainly does *not* express its state in such a manner.
 *
 * [this post]:
 * https://forum.vuejs.org/t/vuex-best-practices-for-complex-objects/10143/2
 *
 * The duplication of WWT's data structures is annoying, but the actual amount
 * of mirrored data isn't very big.
 */
export interface WWTEngineVuexState {
  // NOTE: We were orginally alphabetizing these all, but now I think it will be
  // better to group topically related fields.

  /** Info about the imagesets that are available in the engine to be used as backgrounds */
  availableImagesets: ImagesetInfo[];

  /** The current imageset acting as the background imagery, if defined. */
  backgroundImageset: Imageset | null;

  /** The number of times that the WWT engine clock has been changed in a
   * discontinuous manner.
   *
   * The point of this property is that one can watch() it and get alerted to
   * when this happens.
   */
  clockDiscontinuities: number;

  /** The rate at which the WWT engine clock progresses, compared to real time. */
  clockRate: number;

  /** The current WWT clock time of the view, as a UTC Date. */
  currentTime: Date;

  /** The current declination of the view, in radians.
   *
   * TODO: define this properly for planetary lat/lng views!
   */
  decRad: number;

  /** The current imageset acting as the foreground imagery, if defined. */
  foregroundImageset: Imageset | null;

  /** The opacity with which the foreground imageset is rendered; valid
   * values are between 0 and 100 (inclusive).
   */
  foregroundOpacity: number;

  /** Whether the tour playback mode is active.
   *
   * Specifically, this is true if the `WWTControl` has a `uiController` item
   * that is a `TourPlayer` item. See also [[isTourPlaying]].
   */
  isTourPlayerActive: boolean;

  /** Whether a tour is actively playing righ now.
   *
   * It might be the case that a tour player is active, but the tour is paused.
   */
  isTourPlaying: boolean;

  /** The current right ascension of the view, in radians.
   *
   * TODO: define this properly for planetary lat/lng views!
   */
  raRad: number;

  /** The current mode of the renderer */
  renderType: ImageSetType;

  /** The number of times that a tour has played through to the end.
   *
   * The point of this property is that one can watch() it and get alerted to
   * tour completion.
   */
  tourCompletions: number;

  /** The total run-time of the current tour, if there is one, measured in seconds. */
  tourRunTime: number | null;

  /** The start times of the stops in the tour, measured in seconds.
   *
   * It is possible for tour stops to be linked in a non-linear order, such that
   * actual playback won't proceed linearly in the way that this API would imply.
   */
  tourStopStartTimes: number[];

  /** How far we have progressed into the current tour, in seconds.
   *
   * This number does not necessarily progress monotonically due to the way that
   * WWT measures tour playback progress. We associate a start time with each
   * "stop" in the tour, and can measure progress through a stop, but stops do
   * not necessarily transition from one to another in linear fashion.
   *
   * That being said, this number should range between 0 and the runtime of the
   * current tour. If no tour is loaded, it will be zero.
   */
  tourTimecode: number;

  showWebGl2Warning: boolean;

  /** The current zoom level of the view, in degrees.
   *
   * The zoom level is the angular height of the viewport, times size.
   *
   * TODO: define this properly for 3D modes!
   */
  zoomDeg: number;

  // Layers and layer management

  /** The GUIDs of all rendered layers, in their draw order. */
  activeLayers: string[];

  /** Settings for all registered imageset layers. */
  imagesetLayers: { [guidtext: string]: ImageSetLayerState };

  /** Settings for all registered WWT spreadsheet layers. */
  spreadSheetLayers: { [guidtext: string]: SpreadSheetLayerState };
}

/** The parameters for the [[WWTEngineVuexModule.createTableLayer]] action. */
export interface CreateTableLayerParams {
  /** The name to assign the layer. TODO: understand where (if anywhere) this name is exposed. */
  name: string;

  /** The name of the reference frame to which this layer is attached. */
  referenceFrame: string;

  /** The table data, as big CSV string. */
  dataCsv: string;
}

/** The parameters for the [[WWTEngineVuexModule.gotoRADecZoom]] action. */
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

/** The parameters for the [[WWTEngineVuexModule.loadTour]] action.
 */
export interface LoadTourParams {
  /** The tour URL to load. */
  url: string;

  /** Whether to start playing it immediately. */
  play: boolean;
}

/** The parameters for the [[WWTEngineVuexModule.loadImageCollection]] action. */
export interface LoadImageCollectionParams {
  /** The WTML URL to load. */
  url: string;
  /** Optional, Recursively load any child folders. Defaults to false*/
  loadChildFolders?: boolean;
}

/** The store module class for the WWT Vuex implementation.
 *
 * See [[WWTAwareComponent]] for an organized overview of the state variables,
 * getters, actions, and mutations exposed by this module.
 */
@Module({
  namespaced: true,
  stateFactory: true,
})
export class WWTEngineVuexModule extends VuexModule implements WWTEngineVuexState {
  // NOTE: We were orginally alphabetizing these all, but now I think it will be
  // better to group topically related fields.

  availableImagesets: ImagesetInfo[] = [];
  backgroundImageset: Imageset | null = null;
  clockDiscontinuities = 0;
  clockRate = 1.0;
  currentTime = new Date();
  decRad = 0.0;
  foregroundImageset: Imageset | null = null;
  foregroundOpacity = 100;
  isTourPlayerActive = false;
  isTourPlaying = false;
  raRad = 0.0;
  renderType = ImageSetType.sky;
  timeAtStartup = Date.now();
  tourCompletions = 0;
  tourRunTime: number | null = null;
  tourStopStartTimes: number[] = [];
  tourTimecode = 0.0;
  showWebGl2Warning = false;
  zoomDeg = 0.0;

  get lookupImageset() {
    // This is how you create a parametrized getter in vuex-module-decorators:
    return function (imagesetName: string): Imageset | null {
      if (Vue.$wwt.inst === null)
        throw new Error('cannot lookupImageset without linking to WWTInstance');
      return Vue.$wwt.inst.ctl.getImagesetByName(imagesetName);
    }
  }

  get findRADecForScreenPoint() {
    return function (pt: { x: number; y: number }): { ra: number; dec: number } {
      if (Vue.$wwt.inst === null)
        throw new Error('cannot findRADecForScreenPoint without linking to WWTInstance');
      const coords = Vue.$wwt.inst.ctl.getCoordinatesForScreenPoint(pt.x, pt.y);
      return { ra: (15 * coords.x + 720) % 360, dec: coords.y };
    }
  }

  @Mutation
  internalLinkToInstance(wwt: WWTInstance): void {
    Vue.$wwt.link(wwt);
  }

  @Mutation
  internalUnlinkFromInstance(): void {
    Vue.$wwt.unlink();
  }

  @Mutation
  internalUpdate(): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot internalUpdate without linking to WWTInstance');

    const wwt = Vue.$wwt.inst;

    const raRad = wwt.si.getRA() * H2R;
    if (this.raRad != raRad)
      this.raRad = raRad;

    const decRad = wwt.si.getDec() * D2R;
    if (this.decRad != decRad)
      this.decRad = decRad;

    const zoomDeg = wwt.ctl.renderContext.viewCamera.zoom;
    if (this.zoomDeg != zoomDeg)
      this.zoomDeg = zoomDeg;

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
  }

  @Mutation
  internalIncrementTourCompletions(): void {
    this.tourCompletions += 1;
  }

  @Mutation
  applySetting(setting: EngineSetting): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot applySetting without linking to WWTInstance');
    Vue.$wwt.inst.applySetting(setting);
  }

  @Mutation
  setBackgroundImageByName(imagesetName: string): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot setBackgroundImageByName without linking to WWTInstance');
    Vue.$wwt.inst.setBackgroundImageByName(imagesetName);
  }

  @Mutation
  setForegroundImageByName(imagesetName: string): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot setForegroundImageByName without linking to WWTInstance');
    Vue.$wwt.inst.setForegroundImageByName(imagesetName);
  }

  @Mutation
  setForegroundOpacity(opacity: number): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot setForegroundOpacity without linking to WWTInstance');
    Vue.$wwt.inst.setForegroundOpacity(opacity);
    this.foregroundOpacity = opacity;
  }

  @Mutation
  setupForImageset(options: SetupForImagesetOptions): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot setupForImageset without linking to WWTInstance');
    Vue.$wwt.inst.setupForImageset(options);
  }

  @Mutation
  zoom(factor: number): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot zoom without linking to WWTInstance');
    Vue.$wwt.inst.ctl.zoom(factor);
  }

  @Mutation
  move(args: { x: number; y: number }): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot move without linking to WWTInstance');
    Vue.$wwt.inst.ctl.move(args.x, args.y);
  }

  @Mutation
  tilt(args: { x: number; y: number }): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot tilt without linking to WWTInstance');
    Vue.$wwt.inst.ctl._tilt(args.x, args.y);
  }

  @Mutation
  setTime(time: Date): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot setTime without linking to WWTInstance');
    Vue.$wwt.inst.stc.set_now(time);
    this.clockDiscontinuities += 1;
  }

  @Mutation
  setClockRate(rate: number): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot setClockRate without linking to WWTInstance');

    if (Vue.$wwt.inst.stc.get_timeRate() != rate) {
      Vue.$wwt.inst.stc.set_timeRate(rate);
      this.clockRate = rate;
      this.clockDiscontinuities += 1;
    }
  }

  @Mutation
  setClockSync(isSynced: boolean): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot setClockSync without linking to WWTInstance');

    if (Vue.$wwt.inst.stc.get_syncToClock() != isSynced) {
      Vue.$wwt.inst.stc.set_syncToClock(isSynced);

      if (isSynced) {
        this.clockRate = Vue.$wwt.inst.stc.get_timeRate();
      } else {
        this.clockRate = 0;
      }

      this.clockDiscontinuities += 1;
    }
  }

  @Mutation
  startTour(): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot start tour without linking to WWTInstance');

    const player = Vue.$wwt.inst.getActiveTourPlayer();
    if (player === null)
      throw new Error('no tour to start');

    player.play();
  }

  @Mutation
  toggleTourPlayPauseState(): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot play/pause tour without linking to WWTInstance');

    const player = Vue.$wwt.inst.getActiveTourPlayer();
    if (player === null)
      throw new Error('no tour to play/pause');

    // Despite the unclear name, this function does toggle play/pause state.
    player.pauseTour();
  }

  @Mutation
  setTourPlayerLeaveSettingsWhenStopped(value: boolean): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot setTourPlayerLeaveSettingsWhenStopped without linking to WWTInstance');

    const player = Vue.$wwt.inst.getActiveTourPlayer();
    if (player === null)
      throw new Error('no tour player to control');

    player.set_leaveSettingsWhenStopped(value);
  }

  @Mutation
  seekToTourTimecode(value: number): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot seekToTourTimecode without linking to WWTInstance');

    Vue.$wwt.inst.seekToTourTimecode(value);
  }

  @Action({ rawError: true })
  async waitForReady(): Promise<void> {
    if (Vue.$wwt.inst !== null) {
      return Vue.$wwt.inst.waitForReady();
    } else {
      return new Promise((resolve, _reject) => {
        const waitThenResolve = (): void => {
          (Vue.$wwt.inst as WWTInstance).waitForReady().then(resolve);
        };

        if (Vue.$wwt.inst !== null) {
          waitThenResolve();
        } else {
          Vue.$wwt.onLinkedCallbacks.push(waitThenResolve);
        }
      });
    }
  }

  @Action({ rawError: true })
  async gotoRADecZoom(
    { raRad, decRad, zoomDeg, instant, rollRad }: GotoRADecZoomParams
  ): Promise<void> {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot gotoRADecZoom without linking to WWTInstance');
    return Vue.$wwt.inst.gotoRADecZoom(raRad, decRad, zoomDeg, instant, rollRad);
  }

  @Action({ rawError: true })
  async gotoTarget(options: GotoTargetOptions): Promise<void> {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot gotoTarget without linking to WWTInstance');
    return Vue.$wwt.inst.gotoTarget(options);
  }

  @Mutation
  setTrackedObject(obj: SolarSystemObjects): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot setTrackedObject without linking to WWTInstance');
    Vue.$wwt.inst.ctl.renderContext.set_solarSystemTrack(obj);
  }

  @MutationAction
  async loadTour(
    { url, play }: LoadTourParams
  ) {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot loadTour without linking to WWTInstance');

    if (play)
      await Vue.$wwt.inst.loadAndPlayTour(url);
    else
      await Vue.$wwt.inst.loadTour(url);

    let tourRunTime: number | null = null;
    const tourStopStartTimes: number[] = [];

    const player = Vue.$wwt.inst.getActiveTourPlayer();
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

    return { tourRunTime, tourStopStartTimes };
  }

  @Mutation
  updateAvailableImagesets(): void {
    this.availableImagesets = WWTControl.getImageSets()
      .map(imageset => new ImagesetInfo(imageset.get_url(), imageset.get_name(), imageset.get_dataSetType(), imageset.get_creditsText(), imageset.get_extension()));
  }

  @Action({ rawError: true })
  async loadImageCollection(
    { url, loadChildFolders }: LoadImageCollectionParams
  ): Promise<Folder> {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot loadImageCollection without linking to WWTInstance');
    const result = await Vue.$wwt.inst.loadImageCollection(url, loadChildFolders);
    this.context.commit('updateAvailableImagesets');
    return result;
  }

  // General layers

  activeLayers: string[] = [];

  @Mutation
  internalUpdateActiveLayers(): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot get internalUpdateActiveLayers without linking to WWTInstance');

    const layers: string[] = [];

    function accum(lm: LayerMap) {
      for (const layer of lm.layers) {
        layers.push(layer.id.toString());
      }

      for (const [_mapname, sublm] of Object.entries(lm.childMaps)) {
        accum(sublm);
      }
    }

    const rootlm = Vue.$wwt.inst.lm.get_allMaps()[Vue.$wwt.inst.ctl.getCurrentReferenceFrame()];
    if (rootlm) {
      accum(rootlm);
    }

    this.activeLayers = layers;
  }

  @Mutation
  deleteLayer(id: string | Guid): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot deleteLayer without linking to WWTInstance');

    let stringId = "";

    if (typeof id === "string") {
      stringId = id;
      const guid = Guid.fromString(id);
      Vue.$wwt.inst.lm.deleteLayerByID(guid, true, true);
    } else {
      stringId = id.toString();
      Vue.$wwt.inst.lm.deleteLayerByID(id, true, true);
    }

    // Mirror modification in the reactive system. Here we just
    // delete willy-nilly and ignore any missing cases.

    Vue.delete(this.imagesetLayers, stringId);
    Vue.delete(this.spreadSheetLayers, stringId);

    this.context.commit('internalUpdateActiveLayers');
  }

  // Imageset layers, including FITS layers

  imagesetLayers: { [guidtext: string]: ImageSetLayerState } = {};

  get imagesetStateForLayer() {
    return (guidtext: string): ImageSetLayerState | null => {
      if (Vue.$wwt.inst === null)
        throw new Error('cannot get imagesetStateForLayer without linking to WWTInstance');
      return this.imagesetLayers[guidtext] || null;
    }
  }

  get activeImagesetLayerStates() {
    const states: ImageSetLayerState[] = [];

    for (const guid of this.activeLayers) {
      const state = this.imagesetLayers[guid];
      if (state) {
        states.push(state);
      }
    }

    return states;
  }

  @Action({ rawError: true })
  async addImageSetLayer(
    options: AddImageSetLayerOptions
  ): Promise<ImageSetLayer> {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot addImageSetLayer without linking to WWTInstance');

    // Mirror the layer state into the reactivity system.
    const wwtLayer = await Vue.$wwt.inst.addImageSetLayer(options);
    const guidText = wwtLayer.id.toString();
    Vue.set(this.imagesetLayers, guidText, new ImageSetLayerState(wwtLayer));

    this.context.commit('internalUpdateActiveLayers');
    return wwtLayer;
  }

  // deprecated, but maintained for compatibility:
  @Action({ rawError: true })
  async loadFitsLayer(
    options: LoadFitsLayerOptions
  ): Promise<ImageSetLayer> {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot loadFitsLayer without linking to WWTInstance');

    const addImageSetLayerOptions: AddImageSetLayerOptions = {
      url: options.url,
      mode: "fits",
      name: options.name,
      goto: options.gotoTarget
    };

    return Vue.$wwt.inst.addImageSetLayer(addImageSetLayerOptions);
  }

  @Mutation
  setImageSetLayerOrder(options: SetLayerOrderOptions): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot setImageSetLayerOrder without linking to WWTInstance');

    Vue.$wwt.inst.setImageSetLayerOrder(options);
    this.context.commit('internalUpdateActiveLayers');
  }


  @Mutation
  stretchFitsLayer(options: StretchFitsLayerOptions): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot stretchFitsLayer without linking to WWTInstance');

    Vue.$wwt.inst.stretchFitsLayer(options);

    // Update the reactive mirror.
    const state = this.imagesetLayers[options.id];
    if (state) {
      state.scaleType = options.stretch;
      state.vmin = options.vmin;
      state.vmax = options.vmax;
    }
  }

  @Mutation
  setFitsLayerColormap(options: SetFitsLayerColormapOptions): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot setFitsLayerColormap without linking to WWTInstance');

    Vue.$wwt.inst.setFitsLayerColormap(options);

    // Update the reactive mirror.
    const state = this.imagesetLayers[options.id];
    if (state) {
      state.colormapName = options.name;
    }
  }

  @Mutation
  applyFitsLayerSettings(options: ApplyFitsLayerSettingsOptions): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot applyFitsLayerSettings without linking to WWTInstance');

    Vue.$wwt.inst.applyFitsLayerSettings(options);

    // Update the reactive mirror.
    const state = this.imagesetLayers[options.id];
    if (state) {
      for (const s of options.settings) {
        applyImageSetLayerSetting(state.settings, s);
      }
    }
  }

  // Spreadsheet layers

  spreadSheetLayers: { [guidtext: string]: SpreadSheetLayerState } = {};

  @Action({ rawError: true })
  async createTableLayer(
    options: CreateTableLayerParams
  ): Promise<SpreadSheetLayer> {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot createTableLayer without linking to WWTInstance');

    const layer = Vue.$wwt.inst.lm.createSpreadsheetLayer(
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
    const prom = new Promise<SpreadSheetLayer>((resolve, _reject) => resolve(layer));

    // Mirror the layer state into the reactivity system.
    const wwtLayer = await prom;
    const guidText = wwtLayer.id.toString();
    Vue.set(this.spreadSheetLayers, guidText, new SpreadSheetLayerState(wwtLayer));

    this.context.commit('internalUpdateActiveLayers');
    return wwtLayer;
  }

  @Mutation
  applyTableLayerSettings(options: ApplyTableLayerSettingsOptions): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot applyTableLayerSettings without linking to WWTInstance');

    Vue.$wwt.inst.applyTableLayerSettings(options);

    // Mirror changes in the reactive framework.
    const state = this.spreadSheetLayers[options.id];

    if (state !== undefined) {
      for (const s of options.settings) {
        applySpreadSheetLayerSetting(state, s);
      }
    }
  }

  @Mutation
  updateTableLayer(options: UpdateTableLayerOptions): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot updateTableLayer without linking to WWTInstance');
    Vue.$wwt.inst.updateTableLayer(options);

    // Nothing to mirror in reactive-land -- this call affects the table data.
  }

  // Progressive HiPS catalogs.
  //
  // These have some characteristics of imagesets, and some characteristics
  // of spreadsheet layers.

  get layerForHipsCatalog() {
    return function (name: string): SpreadSheetLayer | null {
      if (Vue.$wwt.inst === null)
        throw new Error('cannot get layerForHipsCatalog without linking to WWTInstance');

      // NOTE! There is an intense hack in the HiPS catalog support where the
      // GUID of each HiPS catalog's SpreadSheetLayer is the `datasetName` from
      // the catalog metadata. This is possible because the WWT `Guid` class
      // doesn't actually do any validation, and just accepts any string you
      // give it.
      const layer = Vue.$wwt.inst.lm.get_layerList()[name];

      if (layer !== null && layer instanceof SpreadSheetLayer) {
        return layer;
      } else {
        return null;
      }
    }
  }

  get spreadsheetStateForHipsCatalog() {
    return (name: string): SpreadSheetLayerSettingsInterfaceRO | null => {
      if (Vue.$wwt.inst === null)
        throw new Error('cannot get spreadsheetStateForHipsCatalog without linking to WWTInstance');

      // NOTE: hack as described above -- the name is the GUID.
      return this.spreadSheetLayers[name] || null;
    }
  }

  @Action({ rawError: true })
  async addCatalogHipsByName(options: AddCatalogHipsByNameOptions): Promise<Imageset> {
    if (Vue.$wwt.inst == null)
      throw new Error('cannot addCatalogHipsByName without linking to WWTInstance');

    const imgset = await Vue.$wwt.inst.addCatalogHipsByName(options);

    // Mirror the spreadsheet layer aspect into the reactivity system.

    const hips = imgset.get_hipsProperties();

    if (hips !== null) {
      const wwtLayer = hips.get_catalogSpreadSheetLayer();
      const guidText = wwtLayer.id.toString();
      Vue.set(this.spreadSheetLayers, guidText, new SpreadSheetLayerState(wwtLayer));
    }

    this.context.commit('internalUpdateActiveLayers');
    return imgset;
  }

  @Action({ rawError: true })
  getCatalogHipsDataInView(options: GetCatalogHipsDataInViewOptions): Promise<InViewReturnMessage> {
    if (Vue.$wwt.inst == null)
      throw new Error('cannot getCatalogHipsDataInView without linking to WWTInstance');
    return Vue.$wwt.inst.getCatalogHipsDataInView(options);
  }

  @Mutation
  removeCatalogHipsByName(name: string): void {
    if (Vue.$wwt.inst == null)
      throw new Error('cannot removeCatalogHipsByName without linking to WWTInstance');

    Vue.$wwt.inst.ctl.removeCatalogHipsByName(name);

    // Un-mirror the spreadsheet layer aspect from the reactivity system. Here
    // we leverage the quasi-hack that the GUID of the spreadsheet layer is set
    // to the HiPS dataset name (which is most assuredly not in UUIDv4 format).

    Vue.delete(this.spreadSheetLayers, name);

    this.context.commit('internalUpdateActiveLayers');
  }

  // Annotations

  @Mutation
  addAnnotation(ann: Annotation): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot addAnnotation without linking to WWTInstance');
    Vue.$wwt.inst.si.addAnnotation(ann);
  }

  @Mutation
  removeAnnotation(ann: Annotation): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot removeAnnotation without linking to WWTInstance');
    Vue.$wwt.inst.si.removeAnnotation(ann);
  }

  @Mutation
  clearAnnotations(): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot clearAnnotations without linking to WWTInstance');
    Vue.$wwt.inst.si.clearAnnotations();
  }
}
