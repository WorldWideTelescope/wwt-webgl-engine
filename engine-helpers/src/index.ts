// Copyright 2020 the .NET Foundation
// Licensed under the MIT License

import { D2H, R2D, R2H } from "@wwtelescope/astro";

import {
  ImageSetType,
  isBaseEngineSetting,
  isBaseLayerSetting,
  isBaseImageSetLayerSetting,
  isBaseSpreadSheetLayerSetting,
} from "@wwtelescope/engine-types";

import {
  Annotation,
  AnnotationSetting,
  Circle,
  CircleAnnotationSetting,
  Color,
  ConstellationFilter,
  EngineSetting,
  Folder,
  Imageset,
  ImageSetLayer,
  ImageSetLayerSetting,
  Layer,
  LayerManager,
  LayerManagerObject,
  LayerSetting,
  Place,
  Poly,
  PolyAnnotationSetting,
  PolyLine,
  PolyLineAnnotationSetting,
  ScriptInterface,
  SpaceTimeControllerObject,
  TourPlayer,
  Wtml,
  WWTControl,
  SpaceTimeController,
  SpreadSheetLayer,
  SpreadSheetLayerSetting,
} from "@wwtelescope/engine";


// Type guards for the augmented setting types

const annotationSettingTypeInfo: {[ix: string]: boolean} = {
  "id/string": true,
  "label/string": true,
  "opacity/number": true,
  "showHoverLabel/boolean": true,
  "tag/string": true,
}

/** Type guard function for AnnotationSetting. */
export function isAnnotationSetting(obj: [string, any]): obj is AnnotationSetting {  // eslint-disable-line @typescript-eslint/no-explicit-any
  const key = obj[0] + "/" + typeof obj[1];
  return key in annotationSettingTypeInfo;
}

/** Apply a setting to a generic Annotation. */
export function applyAnnotationSetting(ann: Annotation, setting: AnnotationSetting): void {
  const funcName = "set_" + setting[0];
  const value: any = setting[1];  // eslint-disable-line @typescript-eslint/no-explicit-any
  (ann as any)[funcName](value);  // eslint-disable-line @typescript-eslint/no-explicit-any
}


const circleAnnotationSettingTypeInfo: {[ix: string]: boolean} = {
  "fill/boolean": true,
  "fillColor/string": true,
  "lineColor/string": true,
  "lineWidth/number": true,
  "radius/number": true,
  "skyRelative/boolean": true,
}

/** Type guard function for CircleAnnotationSetting. */
export function isCircleAnnotationSetting(obj: [string, any]): obj is CircleAnnotationSetting {  // eslint-disable-line @typescript-eslint/no-explicit-any
  const key = obj[0] + "/" + typeof obj[1];
  return (key in circleAnnotationSettingTypeInfo) || isAnnotationSetting(obj);
}

/** Apply a setting to a generic CircleAnnotation. */
export function applyCircleAnnotationSetting(circle: Circle, setting: CircleAnnotationSetting): void {
  const funcName = "set_" + setting[0];
  const value: any = setting[1];  // eslint-disable-line @typescript-eslint/no-explicit-any
  (circle as any)[funcName](value);  // eslint-disable-line @typescript-eslint/no-explicit-any
}


const polyAnnotationSettingTypeInfo: {[ix: string]: boolean} = {
  "fill/boolean": true,
  "fillColor/string": true,
  "lineColor/string": true,
  "lineWidth/number": true,
}

/** Type guard function for PolyAnnotationSetting. */
export function isPolyAnnotationSetting(obj: [string, any]): obj is PolyAnnotationSetting {  // eslint-disable-line @typescript-eslint/no-explicit-any
  const key = obj[0] + "/" + typeof obj[1];
  return (key in polyAnnotationSettingTypeInfo) || isAnnotationSetting(obj);
}

/** Apply a setting to a generic PolyAnnotation. */
export function applyPolyAnnotationSetting(poly: Poly, setting: PolyAnnotationSetting): void {
  const funcName = "set_" + setting[0];
  const value: any = setting[1];  // eslint-disable-line @typescript-eslint/no-explicit-any
  (poly as any)[funcName](value);  // eslint-disable-line @typescript-eslint/no-explicit-any
}


const polyLineAnnotationSettingTypeInfo: {[ix: string]: boolean} = {
  "fill/boolean": true,
  "fillColor/string": true,
  "lineColor/string": true,
  "lineWidth/number": true,
}

/** Type guard function for PolyLineAnnotationSetting. */
export function isPolyLineAnnotationSetting(obj: [string, any]): obj is PolyLineAnnotationSetting {  // eslint-disable-line @typescript-eslint/no-explicit-any
  const key = obj[0] + "/" + typeof obj[1];
  return (key in polyLineAnnotationSettingTypeInfo) || isAnnotationSetting(obj);
}

/** Apply a setting to a generic PolyLineAnnotation. */
export function applyPolyLineAnnotationSetting(polyLine: PolyLine, setting: PolyLineAnnotationSetting): void {
  const funcName = "set_" + setting[0];
  const value: any = setting[1];  // eslint-disable-line @typescript-eslint/no-explicit-any
  (polyLine as any)[funcName](value);  // eslint-disable-line @typescript-eslint/no-explicit-any
}


const engineSettingTypeInfo = {
  "constellationArtFilter/ConstellationFilter": true,
  "constellationBoundariesFilter/ConstellationFilter": true,
  "constellationBoundryColor/Color": true,
  "constellationFigureColor/Color": true,
  "constellationFiguresFilter/ConstellationFilter": true,
  "constellationNamesFilter/ConstellationFilter": true,
  "constellationSelectionColor/Color": true,
  "crosshairsColor/Color": true,
};

/** Type guard function for EngineSetting. */
export function isEngineSetting(obj: [string, any]): obj is EngineSetting {  // eslint-disable-line @typescript-eslint/no-explicit-any
  let typekey: string = typeof obj[1];

  if (obj[1] instanceof Color) {
    typekey = "Color";
  } else if (obj[1] instanceof ConstellationFilter) {
    typekey = "ConstellationFilter";
  }

  const key = obj[0] + "/" + typekey;
  return (key in engineSettingTypeInfo) || isBaseEngineSetting(obj);
}


const layerSettingTypeInfo = {
  "color/Color": true,
};

/** Type guard function for LayerSetting. */
export function isLayerSetting(obj: [string, any]): obj is LayerSetting {  // eslint-disable-line @typescript-eslint/no-explicit-any
  let typekey: string = typeof obj[1];

  if (obj[1] instanceof Color) {
    typekey = "Color";
  }

  const key = obj[0] + "/" + typekey;
  return (key in layerSettingTypeInfo) || isBaseLayerSetting(obj);
}

/** Apply a setting to a generic Layer. */
export function applyLayerSetting(layer: Layer, setting: LayerSetting): void {
  const funcName = "set_" + setting[0];
  const value: any = setting[1];  // eslint-disable-line @typescript-eslint/no-explicit-any
  (layer as any)[funcName](value);  // eslint-disable-line @typescript-eslint/no-explicit-any
}


/** Type guard function for ImageSetLayerSetting. */
export function isImageSetLayerSetting(obj: [string, any]): obj is ImageSetLayerSetting {  // eslint-disable-line @typescript-eslint/no-explicit-any
  // No special settings specific to non-base ImageSetLayerSetting.
  return isLayerSetting(obj) || isBaseImageSetLayerSetting(obj);
}

/** Apply a setting to an ImageSetLayer. */
export function applyImageSetLayerSetting(layer: ImageSetLayer, setting: ImageSetLayerSetting): void {
  const funcName = "set_" + setting[0];
  const value: any = setting[1];  // eslint-disable-line @typescript-eslint/no-explicit-any
  (layer as any)[funcName](value);  // eslint-disable-line @typescript-eslint/no-explicit-any
}


/** Type guard function for SpreadSheetLayerSetting. */
export function isSpreadSheetLayerSetting(obj: [string, any]): obj is SpreadSheetLayerSetting {  // eslint-disable-line @typescript-eslint/no-explicit-any
  // No special settings specific to non-base SpreadSheetLayerSetting.
  return isLayerSetting(obj) || isBaseSpreadSheetLayerSetting(obj);
}

/** Apply a setting to an SpreadSheetLayer. */
export function applySpreadSheetLayerSetting(layer: SpreadSheetLayer, setting: SpreadSheetLayerSetting): void {
  const funcName = "set_" + setting[0];
  const value: any = setting[1];  // eslint-disable-line @typescript-eslint/no-explicit-any
  (layer as any)[funcName](value);  // eslint-disable-line @typescript-eslint/no-explicit-any
}


// The WWTInstance wrapper class and friends.

export const enum InitControlViewType {
  Sky = "Sky",
  Earth = "earth",
}

/** Options for the [[WWTInstance]] constructor. */
export interface InitControlSettings {
  /** The identifier of the DOM element to which to attach the control. If
   * unspecified, defaults to `"wwt"`. */
  elId?: string;

  /** Whether to immediately launch the WWT engine's internal rendering loop. If
   * unspecified, defaults to `false`. */
  startInternalRenderLoop?: boolean;

  /** The starting latitude (or declination) of the WWT view, in degrees. */
  startLatDeg?: number;

  /** The starting longitude (or right ascension) of the WWT view, in degrees. */
  startLngDeg?: number;

  /** The starting zoom level of the WWT view, in degrees. */
  startZoomDeg?: number;

  /** The starting mode of the WWT view. */
  startMode?: InitControlViewType;
}

const initControlDefaults: InitControlSettings = {
  elId: "wwt",
  startInternalRenderLoop: false,
  startLatDeg: 0,
  startLngDeg: 0,
  startZoomDeg: 360,
  startMode: InitControlViewType.Sky,
};

/** Options for [[WWTInstance.gotoTarget]]. */
export interface GotoTargetOptions {
  /** The destination of the view. */
  place: Place;

  /** If true, the zoom, angle, and rotation of the target camera position will
   * be set to match the current camera position. Otherwise, these parameters
   * will be reset to reasonable defaults. */
  noZoom: boolean;

  /** If true, the view camera will immediately snap to the destination
   * position. Otherwise, it will gradually move. */
  instant: boolean;

  /** If true, the camera will continue tracking the view target as it moves
   * with the progression of the WWT internal clock. */
  trackObject: boolean;
}

/** Options for [[WWTInstance.loadFitsLayer]]. */
export interface LoadFitsLayerOptions {
  /** The URL of the FITS file. */
  url: string;

  /** A name to use for the new layer. */
  name: string;

  /** Whether to seek the view to the positon of the FITS file on the sky,
   * if/when it successfully loads.
   */
  gotoTarget: boolean;
}

/** Options for [[WWTInstance.stretchFitsLayer]]. */
export interface StretchFitsLayerOptions {
  /** The ID of the FITS layer. */
  id: string;

  /** The kind of stretch type to use. TODO: enum-ify! 0..4 = lin/log/pow/sqrt/histeq */
  stretch: number;

  /** The data value to use for the minimum stretch bound. */
  vmin: number;

  /** The data value to use for the maximum stretch bound. */
  vmax: number;
}

/** Options for [[WWTInstance.setFitsLayerColormap]]. */
export interface SetFitsLayerColormapOptions {
  /** The ID of the FITS layer. */
  id: string;

  /** The name of the colormap. TODO: document! */
  name: string;
}

export interface ApplyFitsLayerSettingsOptions {
  /** The ID of the FITS layer. */
  id: string;

  /** The settings to apply. */
  settings: ImageSetLayerSetting[];
}

export interface UpdateTableLayerOptions {
  /** The ID of the table ("spreadsheet") layer. */
  id: string;

  /** The new data, as CSV text. */
  dataCsv: string;
}

export interface ApplyTableLayerSettingsOptions {
  /** The ID of the table ("spreadsheet") layer. */
  id: string;

  /** The settings to apply. */
  settings: SpreadSheetLayerSetting[];
}

/** Options for [[WWTInstance.setupForImageset]]. */
export interface SetupForImagesetOptions {
  /** The imageset to foreground. */
  foreground: Imageset;

  /** The background imageset to use. If unspecified, a sensible default is
   * chosen. */
  background?: Imageset;
}

interface ResolveFunction<T> {
  (value: T): void;
}

interface RejectFunction {
  (reason?: any): void;  // eslint-disable-line @typescript-eslint/no-explicit-any
}

class SavedPromise<P, T> {
  readonly payload: P;
  readonly resolve: ResolveFunction<T>;
  readonly reject: RejectFunction;

  constructor(payload: P, resolve: ResolveFunction<T>, reject: RejectFunction) {
    this.payload = payload;
    this.resolve = resolve;
    this.reject = reject;
  }
}

export class WWTInstance {
  readonly ctl: WWTControl;
  readonly lm: LayerManagerObject;
  readonly si: ScriptInterface;
  readonly stc: SpaceTimeControllerObject;

  /** Create a WWT control, attaching it to a DOM element.
   *
   * @param options Options to apply to the control.
   *
   * Compared to the underlying library, this class provides a more JavaScript-y
   * API.
   */
  constructor(
    options: InitControlSettings = {}
  ) {
    const o = { ...initControlDefaults, ...options };

    // We pretend that these objects aren't all singletons. One day.
    this.si = WWTControl.initControl6(
      o.elId as string,
      o.startInternalRenderLoop as boolean,
      o.startLatDeg as number,
      o.startLngDeg as number,
      o.startZoomDeg as number,
      o.startMode as InitControlViewType,
    );
    this.ctl = WWTControl.singleton;
    this.lm = LayerManager;
    this.stc = SpaceTimeController;

    // Override some defaults
    this.applySetting(["showConstellationBoundries", false]);
    this.applySetting(["showConstellationFigures", false]);
    this.applySetting(["showConstellationSelection", false]);
    this.applySetting(["showCrosshairs", false]);

    // Ready promise initialization:
    this.si.add_ready((_si) => {
      for (const p of this.readyPromises) {
        p.resolve();
      }

      this.readyFired = true;
      this.readyPromises = [];
    });

    // Arrival promise initialization:
    this.si.add_arrived((_si, _args) => {
      for (const p of this.arrivePromises) {
        if (p.payload < this.arriveSeqnum) {
          p.reject("superseded");
        } else {
          p.resolve();
        }
      }

      this.arrivePromises = [];
    });

    // TourReady promise init:
    this.si.add_tourReady((_si) => {
      for (const p of this.tourReadyPromises) {
        if (p.payload < this.tourReadySeqnum) {
          p.reject("superseded");
        } else {
          p.resolve();
        }
      }

      this.tourReadyPromises = [];
    });

    // TourEnded event init:
    TourPlayer.add_tourEnded((_tpclass) => {
      const tp = this.getActiveTourPlayer();

      if (tp !== null && this.tourEndedCallback !== null) {
        this.tourEndedCallback(tp);
      }
    });
  }

  // Ready promises

  private readyPromises: SavedPromise<null, void>[] = [];
  private readyFired = false;

  async waitForReady(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.readyFired) {
        resolve();
      } else {
        this.readyPromises.push(new SavedPromise(null, resolve, reject));
      }
    });
  }

  // Arrival promises

  private arrivePromises: SavedPromise<number, void>[] = [];
  private arriveSeqnum = 0;

  private makeArrivePromise(instantResolve: boolean): Promise<void> {
    this.arriveSeqnum += 1;
    const seq = this.arriveSeqnum;

    for (const p of this.arrivePromises) {
      p.reject("superseded");
    }

    this.arrivePromises = [];

    return new Promise((resolve, reject) => {
      if (this.arriveSeqnum > seq) {
        reject("superseded");
      } else if (instantResolve) {
        resolve();
      } else {
        this.arrivePromises.push(new SavedPromise(seq, resolve, reject));
      }
    });
  }

  async gotoRADecZoom(raRad: number, decRad: number, zoomDeg: number, instant: boolean): Promise<void> {
    this.ctl.gotoRADecZoom(
      raRad * R2H,
      decRad * R2D,
      zoomDeg,
      instant
    );
    return this.makeArrivePromise(instant);
  }

  /** Command the view to show a Place.
   *
   * @param options The options for the goto command.
   */
  async gotoTarget(options: GotoTargetOptions): Promise<void> {
    this.ctl.gotoTarget(
      options.place,
      options.noZoom,
      options.instant,
      options.trackObject
    );
    return this.makeArrivePromise(options.instant);
  }

  // Collection-loaded promises. To simplify the handling, we never load the
  // same URL more than once. Otherwise, all of the timing issues about multiple
  // requests for the same URL get gnarly to handle. And as far as the engine is
  // concerned, collection loads are idempotent.

  private collectionLoadedPromises: SavedPromise<string, Folder>[] = [];
  private collectionRequests: Map<string, Folder | null> = new Map();

   /** Load a WTML collection and the imagesets that it contains.
   *
   * This function triggers a download of the specified URL, which should return
   * an XML document in the [WTML collection][wtml] format. Any `ImageSet`
   * entries in the collection, or `Place` entries containing image sets, will
   * be added to the WWT instance’s list of available imagery. Subsequent calls
   * to functions like [[setForegroundImageByName]] will be able to locate the
   * new imagesets and display them to the user.
   *
   * Each unique URL is only requested once. Once a given URL has been
   * successfully loaded, the promise returned by additional calls will resolve
   * immediately. URL uniqueness is tested with simple string equality, so if
   * you really want to load the same URL more than once you could add a
   * fragment specifier.
   *
   * If the URL is not accessible due to CORS restrictions, the request will
   * automatically be routed through the WWT’s CORS proxying service.
   *
   * [wtml]: https://docs.worldwidetelescope.org/data-guide/1/data-file-formats/collections/
   *
   * @param url: The URL of the WTML collection file to load.
   * @returns: A promise that resolves to an initialized Folder object.
   */
  async loadImageCollection(url: string): Promise<Folder> {
    const curState = this.collectionRequests.get(url);

    // If we've already loaded the folder, insta-resolve to it.
    if (curState !== undefined && curState !== null) {
      return Promise.resolve(curState);
    }

    // If we haven't even issued the request, do so.
    if (curState === undefined) {
      // Mark this URL as having an in-flight request.
      this.collectionRequests.set(url, null);

      // We need some internal mutability here to allow the getWtmlFile callback
      // to find the Folder variable, which we only get as a return value from
      // the function.
      const holder: { f: Folder | null } = { f: null };

      holder.f = Wtml.getWtmlFile(url, () => {
        // The folder at this URL is now fully loaded.
        const f = holder.f as Folder;
        this.collectionRequests.set(url, f);

        this.collectionLoadedPromises = this.collectionLoadedPromises.filter((p) => {
          if (p.payload == url) {
            p.resolve(f);
            return false;
          }

          // Don't filter out promises for other URLs.
          return true;
        });
      });
    }

    return new Promise((resolve, reject) => {
      const curState = this.collectionRequests.get(url);

      // By the time this promise callback is called, maybe the Folder has fully
      // loaded?
      if (curState !== undefined && curState !== null) {
        resolve(curState);
      } else {
        // If not, queue ourselves up to be resolved when the data finally come
        // through.
        this.collectionLoadedPromises.push(new SavedPromise(url, resolve, reject));
      }
    });
  }

  // Layers

  /** Load a remote FITS file into a data layer and display it.
   *
   * The FITS file must be downloaded and processed, so this API is
   * asynchronous, and is not appropriate for files that might be large.
   */
  async loadFitsLayer(options: LoadFitsLayerOptions): Promise<ImageSetLayer> {
    return new Promise((resolve, _reject) => {
      this.si.loadFitsLayer(options.url, options.name, options.gotoTarget, (layer) => {
        resolve(layer);
      })
    });
  }

  /** Change the "stretch" settings of a FITS image layer. */
  stretchFitsLayer(options: StretchFitsLayerOptions): void {
    const layer = this.lm.get_layerList()[options.id];
    if (layer && layer instanceof ImageSetLayer) {
      layer.setImageScalePhysical(options.stretch, options.vmin, options.vmax);

      // This is kind of random, but follows the pywwt API implementation.
      const fits = layer.getFitsImage();
      if (fits !== null) {
        fits.transparentBlack = false;
      }
    }
  }

  /** Change the colormap settings of a FITS image layer. */
  setFitsLayerColormap(options: SetFitsLayerColormapOptions): void {
    const layer = this.lm.get_layerList()[options.id];
    if (layer && layer instanceof ImageSetLayer) {
      layer.set_colorMapperName(options.name);
    }
  }

  /** Apply settings to a FITS image layer. */
  applyFitsLayerSettings(options: ApplyFitsLayerSettingsOptions): void {
    const layer = this.lm.get_layerList()[options.id];
    if (layer && layer instanceof ImageSetLayer) {
      for (const setting of options.settings) {
        applyImageSetLayerSetting(layer, setting);
      }
    }
  }

  /** Update the data within a tabular data layer. */
  updateTableLayer(options: UpdateTableLayerOptions): void {
    const layer = this.lm.get_layerList()[options.id];
    if (layer && layer instanceof SpreadSheetLayer) {
      layer.updateData(options.dataCsv, true, true, true);
    }
  }

  /** Apply settings to a tabular data layer. */
  applyTableLayerSettings(options: ApplyTableLayerSettingsOptions): void {
    const layer = this.lm.get_layerList()[options.id];
    if (layer && layer instanceof SpreadSheetLayer) {
      for (const setting of options.settings) {
        applySpreadSheetLayerSetting(layer, setting);
      }
    }
  }

  // "Mutator" type operations -- not async.

  applySetting(setting: EngineSetting): void {
    const funcName = "set_" + setting[0];
    const value: any = setting[1];  // eslint-disable-line @typescript-eslint/no-explicit-any
    (this.si.settings as any)[funcName](value);  // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  setBackgroundImageByName(imagesetName: string): void {
    this.ctl.setBackgroundImageByName(imagesetName);
  }

  setForegroundImageByName(imagesetName: string): void {
    this.ctl.setForegroundImageByName(imagesetName);
  }

  /** Set the opacity with which the foreground imageset is rendered.
   *
   * @param opacity The opacity, between 0 (invisible) and 100 (fully opaque).
   */
  setForegroundOpacity(opacity: number): void {
    this.si.setForegroundOpacity(opacity);
  }

  /** Set up the view to instantaneously display the specified imageset.
   *
   * This function aspires to provide a one-stop shop for configuring the engine
   * to show one arbitrary imageset. It aims to automatically choose the right,
   * or at least justifiable, values for things like the background imageset,
   * the camera position, and the zoom level.
   *
   * Because this function makes instantaneous changes, it is not appropriate
   * for interactive use. It is intended to be used as a WWT view is being
   * initialized.
   *
   * @param imageset The imageset to display.
   */
  setupForImageset(options: SetupForImagesetOptions): void {
    let bkg;

    if (options.background) {
      bkg = options.background;
    } else {
      bkg = this.ctl.getDefaultImageset(options.foreground.get_dataSetType(), options.foreground.get_bandPass())
    }

    let imageHeightDeg;

    if (options.foreground.get_levels() > 0) {
      // For tiled images, baseTileDegrees gives the image angular height
      // directly, modulo a factor of two uncertainty depending on how the image
      // pixel height rounds up to a power of two.
      imageHeightDeg = options.foreground.get_baseTileDegrees();
    } else {
      // Unfortunately, for untiled images we don't have the information needed
      // to assess the image's angular height reliably. In many cases offsetY
      // will be about half of the pixel height, but it could be anything.
      imageHeightDeg = options.foreground.get_baseTileDegrees() * options.foreground.get_offsetY() * 2;
    }

    const place = new Place();
    place.set_type(options.foreground.get_dataSetType());
    place.set_backgroundImageset(bkg);
    place.set_studyImageset(options.foreground);

    let noZoom = false;

    switch (options.foreground.get_dataSetType()) {
    case ImageSetType.sky:
      if (imageHeightDeg == 180) {
        // All-sky image -- special behavior
        noZoom = true;
      } else  {
        place.set_RA(options.foreground.get_centerX() * D2H);
        place.set_dec(options.foreground.get_centerY());
        place.set_zoomLevel(imageHeightDeg * 6);
      }
      break;

    case ImageSetType.earth:
    case ImageSetType.planet:
      place.set_zoomLevel(120); // a pleasing default, according to me

      if (imageHeightDeg != 180) {
        // need to verify that this is right
        place.set_lng(options.foreground.get_centerX());
        place.set_lat(options.foreground.get_centerY());
      }
      break;

    default:
      // TODO: more cases ...
      place.set_zoomLevel(360);
      break;
    }

    this.ctl.renderContext.set_backgroundImageset(bkg);

    this.ctl.gotoTarget(
      place,
      noZoom,
      true, // instant
      true // trackObject
    );
  }

  // Tours

  /** If the tour playback mode is active, get the active TourPlayer object. */
  getActiveTourPlayer(): TourPlayer | null {
    if (this.ctl.uiController === null)
      return null;

    if (this.ctl.uiController instanceof TourPlayer)
      return this.ctl.uiController;

    return null;
  }

  /** Find out whether a tour is playing.
   *
   * For obscure reasons, this is a static method in WWT that is not attached to
   * a TourPlayer instance. We take one as an argument for future-proofiness.
   */
  getIsTourPlaying(_player: TourPlayer): boolean {
    return TourPlayer.get_playing();
  }

  private tourReadyPromises: SavedPromise<number, void>[] = [];
  private tourReadySeqnum = 0;

  /** A callback to be invoked when a tour completes playing. */
  public tourEndedCallback: ((tp: TourPlayer) => void) | null = null;

  /** Load a tour from a URL.
   *
   * Once the tour has loaded, you can use [[getActiveTourPlayer]] to get the
   * tour player controller and the underlying tour document.
   *
   * @param url The URL of the tour to load and play.
   * @returns A promise that resolves when the tour has loaded.
   */
  async loadTour(url: string): Promise<void> {
    this.ctl.loadTour(url);

    this.tourReadySeqnum += 1;
    const seq = this.tourReadySeqnum;

    for (const p of this.tourReadyPromises) {
      p.reject("superseded");
    }

    this.tourReadyPromises = [];

    return new Promise((resolve, reject) => {
      if (this.tourReadySeqnum > seq) {
        reject("superseded");
      } else {
        this.tourReadyPromises.push(new SavedPromise(seq, resolve, reject));
      }
    });
  }

  /** Load a tour from a URL and start playing it.
   *
   * @param url The URL of the tour to load and play.
   * @returns A promise that resolves when the tour has loaded and started
   * playing.
   */
  async loadAndPlayTour(url: string): Promise<void> {
    this.ctl.playTour(url);

    this.tourReadySeqnum += 1;
    const seq = this.tourReadySeqnum;

    for (const p of this.tourReadyPromises) {
      p.reject("superseded");
    }

    this.tourReadyPromises = [];

    return new Promise((resolve, reject) => {
      if (this.tourReadySeqnum > seq) {
        reject("superseded");
      } else {
        this.tourReadyPromises.push(new SavedPromise(seq, resolve, reject));
      }
    });
  }

  /** Find out how far we have progressed into the tour, in seconds.
   *
   * This number does not necessarily progress monotonically due to the way that
   * WWT measures tour playback progress. We associate a start time with each
   * "stop" in the tour, and can measure progress through a stop, but stops do
   * not necessarily transition from one to another in linear fashion.
   *
   * That being said, this number should range between 0 and the runtime of the
   * current tour. If no tour is loaded, it will be zero.
   */
  getEffectiveTourTimecode(): number {
    const player = this.getActiveTourPlayer();
    if (player === null)
      return 0.0;

    const tour = player.get_tour();
    if (tour === null)
      return 0.0;

    const idx = tour.get_currentTourstopIndex();
    if (idx < 0)
      return 0.0;

    const base = tour.elapsedTimeTillTourstop(idx);
    const stop = tour.get_tourStops()[idx];
    const delta = stop.get_tweenPosition() * stop.get_duration() * 0.001; // ms => s
    const value = base + delta;

    // It's possible for our math to yield a value slightly larger than the
    // nominal tour runtime, which can upset code that expects the value to stay
    // rigorously within that bound. So, clamp it to be sure.

    if (value < 0)
      return 0.0;

    const runTime = tour.get_runTime() * 0.001; // ms => s

    if (value > runTime)
      return runTime;

    return value;
  }

  /** "Seek" tour playback to approximately the specified timecode (in seconds).
   *
   * The tour will start playing back.
   *
   * This operation is approximate because WWT can only resume playback from the
   * beginning of a "tour stop". So, if the desired timecode is in the middle of
   * such a stop, playback will start there, not at the exact value that was
   * commanded. This can be a little annoying when a slide is long.
   *
   * If no tour or tour player is active, nothing happens.
   */
  seekToTourTimecode(value: number): void {
    const player = this.getActiveTourPlayer();
    if (player === null)
      return;

    const tour = player.get_tour();
    if (tour === null)
      return;

    // Figure out the stop index that best matches the specified timecode.
    const stops = tour.get_tourStops()
    let index = stops.length - 1;

    for (let i = 0; i < stops.length; i++) {
      const tStart = tour.elapsedTimeTillTourstop(i);

      if (tStart >= value) {
        index = i - 1;
        break;
      }
    }

    if (index < 0) {
      index = 0;
    }

    // Apply the change.
    player.playFromTourstop(stops[index]);
  }
}
