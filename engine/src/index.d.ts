// Copyright 2020 the .NET Foundation
// Licensed under the MIT License
//
// TypeScript definitions for the WWT WebGL engine. Base data types that do not
// strictly depend on the engine implementation should go in the
// `@wwtelescope/engine-types` package.
//
// Try to keep everything alphabetized.

export as namespace wwtlib;

import {
  AltTypes,
  AltUnits,
  BandPass,
  BaseEngineSetting,
  BaseImageSetLayerSetting,
  BaseLayerSetting,
  BaseSpreadSheetLayerSetting,
  Classification,
  ConstellationFilterInterface,
  CoordinatesType,
  DataTypes,
  FadeType,
  FolderGroup,
  FolderRefreshType,
  FolderType,
  ImageSetType,
  MarkerScales,
  PointScaleTypes,
  PlotTypes,
  ProjectionType,
  RAUnits,
  // ReferenceFrames,
  // ReferenceFrameTypes,
  Thumbnail,
  ScaleTypes,
  SolarSystemObjects,
  SettingsInterface,
} from "@wwtelescope/engine-types";

/** A generic callback type. */
export interface Action {
  (): void;
}

/** A visual annotation in the WWT view. */
export class Annotation {
  //get_center
  get_id(): string;
  set_id(v: string): string;
  get_label(): string;
  set_label(v: string): string;
  /** Ranges between 0 and 1. */
  get_opacity(): number;
  set_opacity(v: number): number;
  get_showHoverLabel(): boolean;
  set_showHoverLabel(v: boolean): boolean;
  get_tag(): string;
  set_tag(v: string): string;

  hitTest(renderContext: RenderContext, ra: number, dec: number, x: number, y: number): boolean;
}

/** Possible settings that can be applied to generic annotations.
 *
 * Specific annotation instances (e.g. Circles) can have additional settings.
 */
export type AnnotationSetting =
  // NOTE: isAnnotationSetting in engine-helpers needs to be kept in sync.
  ["id", string] |
  ["label", string] |
  ["opacity", number] |
  ["showHoverLabel", boolean] |
  ["tag", string];

export class ArrivedEventArgs {
  /** Get the current right ascension of the view, in hours. */
  get_RA(): number;

  /** Get the current declination of the view, in degrees. */
  get_dec(): number;

  /** Get the current viewport height, in degrees. */
  get_zoom(): number;
}

export interface ArrivedEventCallback {
  /** Called when the WWT view has arrived at a commanded position. */
  (si: ScriptInterface, args: ArrivedEventArgs): void;
}

export class CameraParameters {
  lat: number;
  lng: number;
  zoom: number;
  rotation: number;
  angle: number;
  raDec: boolean;
  opacity: number;
  target: SolarSystemObjects;
  targetReferenceFrame: string | null;
  //viewTarget: Vector3d;

  copy(): CameraParameters;
  get_RA(): number;
  set_RA(v: number): number;
  get_dec(): number;
  set_dec(v: number): number;
}

/** A simple circular annotation. */
export class Circle extends Annotation {
  get_fill(): boolean;
  set_fill(v: boolean): boolean;
  get_fillColor(): string;
  /** The color is parsed using [[Color.fromName]]. */
  set_fillColor(v: string): string;
  get_lineColor(): string;
  /** The color is parsed using [[Color.load]]. */
  set_lineColor(v: string): string;
  /** This parameter currently DOES NOTHING because the WebGL renderer doesn't yet support parametrizable line widths. */
  get_lineWidth(): number;
  /** This parameter currently DOES NOTHING because the WebGL renderer doesn't yet support parametrizable line widths. */
  set_lineWidth(v: number): number;
  get_radius(): number;
  set_radius(v: number): number;
  get_skyRelative(): boolean;
  set_skyRelative(v: boolean): boolean;

  /** Set the position of this circle's center. */
  setCenter(raDeg: number, decDeg: number): void;
}

/** Possible settings that can be applied to Circle annotations. */
export type CircleAnnotationSetting =
  // NOTE: isCircleAnnotationSetting in engine-helpers needs to be kept in sync.
  AnnotationSetting |
  ["fill", boolean] |
  ["fillColor", string] |
  ["lineColor", string] |
  ["lineWidth", number] |
  ["radius", number] |
  ["skyRelative", boolean];

export class CollectionLoadedEventArgs {
  /** Get the URL of the collection that was just loaded. */
  get_url(): string;
}

export interface CollectionLoadedEventCallback {
  /** Called when the WWT engine has loaded a new collection.
   *
   * The collection is associated with a `Folder` object in the engine, but this
   * callback only provides the URL that was loaded.
   */
  (si: ScriptInterface, args: CollectionLoadedEventArgs): void;
}

export class Color {
  /** The alpha channel value, in the range 0 to 255 (inclusive). */
  a: number;

  /** The red channel value, in the range 0 to 255 (inclusive). */
  r: number;

  /** The green channel value, in the range 0 to 255 (inclusive). */
  g: number;

  /** The blue channel value, in the range 0 to 255 (inclusive). */
  b: number;

  /** The color name, if defined; otherwise an empty string. */
  name: string;

  /** If the color's *name* is non-empty, return that. Otherwise return its
   * textualization in the form `rgb(R,G,B)`. The alpha channel is ignored.
   */
  toFormat(): string;

  /** If the color's *name* is non-empty, return that. Otherwise return its
   * textualization in the form `#RRGGBB`, with hexadecimal values. The alpha
   * channel is ignored.
   */
  toString(): string;

  /** If the color's *name* is non-empty, return that. Otherwise return its
   * textualization in the form `AARRGGBB`, with hexadecimal values.
   */
  toSimpleHex(): string;
}

export namespace Color {
  /** Create a new color from individual ARGB components, each in the range 0-255. */
  export function fromArgb(a: number, r: number, g: number, b: number): Color;

  /** Create a color from its name, as defined by the following schemes:
   *
   * - A string of the form `x:A:R:G:B`, where `x` is any text not containing a colon,
   *   and ARGB are integers between 0 and 255.
   * - A string of the form `x:name`, where `x` is as above and `name` is lowercased
   *   and re-evaluated by this function.
   * - A hex code of the form `#RRGGBB`. Alpha is 255.
   * - A hex code of the form `AARRGGBB`, with no hash mark.
   * - The name of one of the HTML Known Colors in lowercase (https://www.w3schools.com/colors/colors_names.asp)
   * - Otherwise, white.
   */
  export function fromName(name: string): Color;

  /** Create a color from a hex string `RRGGBB` with alpha=255. */
  export function fromHex(hex: string): Color;

  /** Create a color from a hex string `AARRGGBB`. */
  export function fromSimpleHex(hex: string): Color;

  /** This function is the same as [[Color.fromName]]. */
  export function load(name: string): Color;
}

/** A mapping from scalar values to colors. */
export class ColorMapContainer {
  /** Find the color in this map closest to the input scalar.
   *
   * The input value should be between 0 and 1. Zero maps to the first color in
   * the list; one to the last. Intermediate values map linearly. Out-of-bounds
   * values are clamped.
   */
  findClosestColor(value: number): Color;
}

export namespace ColorMapContainer {
  /** Create a new ColorMapContainer from the specified list of ARGB colors. */
  export function fromArgbList(colors: [number, number, number, number][]): ColorMapContainer;

  /** Create a new ColorMapContainer from the specified list of color hex codes,
   * each having the form `#rrggbb`. */
  export function fromStringList(colors: string[]): ColorMapContainer;

  /** Create a new ColorMapContainer from the named preset value.
   *
   * The presets are extracted from Matplotlib. Accepted values include:
   *
   * - viridis
   * - plasma
   * - inferno
   * - magma
   * - cividis
   * - greys
   * - gray
   * - purples
   * - blues
   * - greens
   * - oranges
   * - reds
   * - rdylbu
   */
  export function fromNamedColormap(name: string): ColorMapContainer;
}


export class ConstellationFilter implements ConstellationFilterInterface {
  clone(): ConstellationFilter;
}

/** The full EngineSetting type, which augments engine-types' BaseEngineSetting
 * with types that are only provided within the engine itself.
 */
export type EngineSetting = BaseEngineSetting |
  // NOTE: isEngineSetting in engine-helpers needs to be kept in sync.
  ["constellationArtFilter", ConstellationFilter] |
  ["constellationBoundariesFilter", ConstellationFilter] |
  ["constellationBoundryColor", Color] |
  ["constellationFigureColor", Color] |
  ["constellationFiguresFilter", ConstellationFilter] |
  ["constellationNamesFilter", ConstellationFilter] |
  ["constellationSelectionColor", Color] |
  ["crosshairsColor", Color];

export class FitsImage extends WcsImage {
  histogramMaxCount: number;
  width: number;
  height: number;
  numAxis: number;
  bZero: number;
  bScale: number;
  dataType: DataTypes;
  containsBlanks: boolean;
  blankValue: number;
  maxVal: number;
  minVal: number;
  transparentBlack: boolean;

  computeHistogram(count: number): number[];
}

export class Folder implements Thumbnail {
  get_browseable(): boolean;
  set_browseable(v: boolean): boolean;
  get_browseableSpecified(): boolean;
  set_browseableSpecified(v: boolean): boolean;
  get_children(): Thumbnail[] | null;
  get_dirty(): boolean;
  set_dirty(v: boolean): boolean;
  get_folders(): Folder[];
  set_folders(v: Folder[]): Folder[];
  get_group(): FolderGroup;
  set_group(v: FolderGroup): FolderGroup;
  get_imagesets(): Imageset[];
  set_imagesets(v: Imageset[]): Imageset[];
  get_isCloudCommunityItem(): boolean;
  get_isFolder(): boolean;
  get_isImage(): boolean;
  get_isTour(): boolean;
  get_msrCommunityId(): number;
  set_msrCommunityId(v: number): number;
  get_msrComponentId(): number;
  set_msrComponentId(v: number): number;
  get_name(): string;
  set_name(name: string): string;
  get_permission(): number;
  set_permission(v: number): number;
  get_places(): Place[];
  set_places(v: Place[]): Place[];
  get_readOnly(): boolean;
  set_readOnly(v: boolean): boolean;
  get_refreshInterval(): string;
  set_refreshInterval(v: string): string;
  get_refreshType(): FolderRefreshType;
  set_refreshType(v: FolderRefreshType): FolderRefreshType;
  get_refreshTypeSpecified(): boolean;
  set_refreshTypeSpecified(v: boolean): boolean;
  get_searchable(): boolean;
  set_searchable(v: boolean): boolean;
  get_subType(): string;
  set_subType(v: string): string;
  get_thumbnailUrl(): string;
  set_thumbnailUrl(url: string): string;
  //get_tours()
  //set_tours()
  get_type(): FolderType;
  set_type(v: FolderType): FolderType;
  get_url(): string;
  set_url(url: string): string;
  get_versionDependent(): boolean;
  set_versionDependent(v: boolean): boolean;

  loadFromUrl(url: string, complete: Action): void;
  addChildFolder(child: Folder): void;
  removeChildFolder(child: Folder): void;
  addChildPlace(place: Place): void;
  removeChildPlace(place: Place): void;
  refresh(): void;
  childLoadCallback(callback: Action): void;
}

/** An simple Version 4 GUID */
export class Guid {
  toString(): string;
}

export namespace Guid {
  /** Create a new, random GUID string (not an instance of the GUID class) */
  export function create(): string;

  /** Create a new GUID with a random value. */
  export function newGuid(): Guid;

  /** Create an instance of the GUID class from its string representation. */
  export function fromString(id: string): Guid;
}

/** Imagery that can be displayed in WWT. */
export class Imageset implements Thumbnail {
  get_altUrl(): string;
  set_altUrl(url: string): string;

  get_bandPass(): BandPass;
  set_bandPass(bp: BandPass): BandPass;

  get_baseLevel(): number;
  set_baseLevel(bl: number): number;

  get_baseTileDegrees(): number;
  set_baseTileDegrees(v: number): number;

  get_bottomsUp(): boolean;
  set_bottomsUp(bu: boolean): boolean;

  get_centerX(): number;
  set_centerX(cx: number): number;

  get_centerY(): number;
  set_centerY(cy: number): number;

  get_children(): Thumbnail[];

  get_creditsText(): string;
  set_creditsText(ct: string): string;

  get_creditsUrl(): string;
  set_creditsUrl(cu: string): string;

  get_dataSetType(): ImageSetType;
  set_dataSetType(st: ImageSetType): ImageSetType;

  get_defaultSet(): boolean;
  set_defaultSet(ds: boolean): boolean;

  get_demUrl(): string;
  set_demUrl(url: string): string;

  get_elevationModel(): boolean;
  set_elevationModel(em: boolean): boolean;

  get_extension(): string;
  set_extension(ext: string): string;

  get_generic(): boolean;
  set_generic(g: boolean): boolean;

  get_imageSetID(): number;
  set_imageSetID(id: number): number;

  get_isCloudCommunityItem(): boolean;
  get_isFolder(): boolean;
  get_isImage(): boolean;
  get_isTour(): boolean;

  get_levels(): number;
  set_levels(levels: number): number;

  get_meanRadius(): number;
  set_meanRadius(mr: number): number;

  get_mercator(): boolean;
  set_mercator(m: boolean): boolean;

  get_name(): string;
  set_name(name: string): string;

  get_offsetX(): number;
  set_offsetX(ox: number): number;

  get_offsetY(): number;
  set_offsetY(oy: number): number;

  get_projection(): ProjectionType;
  set_projection(pt: ProjectionType): ProjectionType;

  get_readOnly(): boolean;

  get_referenceFrame(): string;
  set_referenceFrame(rf: string): string;

  get_rotation(): number;
  set_rotation(r: number): number;

  get_quadTreeTileMap(): string;
  set_quadTreeTileMap(qttm: string): string;

  get_singleImage(): boolean;
  set_singleImage(si: boolean): boolean;

  get_sparse(): boolean;
  set_sparse(s: boolean): boolean;

  get_thumbnailUrl(): string;
  set_thumbnailUrl(url: string): string;

  get_url(): string;
  set_url(url: string): string;

  get_widthFactor(): number;
  set_widthFactor(f: number): number;

  getHashCode(): number;
}

export namespace Imageset {
  export function create(
    name: string,
    url: string,
    dataSetType: ImageSetType,
    bandPass: BandPass,
    projection: ProjectionType,
    imageSetID: number,
    baseLevel: number,
    levels: number,
    unused_tileSize: null,
    baseTileDegrees: number,
    extension: string,
    bottomsUp: boolean,
    quadTreeMap: string,
    centerX: number,
    centerY: number,
    rotation: number,
    sparse: boolean,
    thumbnailUrl: string,
    defaultSet: boolean,
    elevationModel: boolean,
    widthFactor: number,
    offsetX: number,
    offsetY: number,
    creditsText: string,
    creditsUrl: string,
    demUrl: string,
    altUrl: string,
    meanRadius: number,
    referenceFrame: string
  ): Imageset;
}

/** An imageset renderable as its own independent layer. */
export class ImageSetLayer extends Layer {
  colorMapperName: string;

  // get_colorMapper(): ColorMapContainer
  get_colorMapperName(): string;
  set_colorMapperName(v: string): string;
  get_imageSet(): Imageset;
  set_imageSet(v: Imageset): Imageset;
  get_overrideDefaultLayer(): boolean;
  set_overrideDefaultLayer(v: boolean): boolean;

  getFitsImage(): FitsImage | null;;
  setImageScalePhysical(st: ScaleTypes, min: number, max: number): void;
  setImageScaleRaw(st: ScaleTypes, min: number, max: number): void;
  setImageZ(z: number): void;
}

export namespace ImageSetLayer {
  /** Create a new ImageSetLayer for the specified imageset. */
  export function create(set: Imageset): ImageSetLayer;
}

/** The full ImageSetLayerSetting type, which augments engine-types' BaseImageSetLayerSetting
 * with types that are only provided within the engine itself.
 */
export type ImageSetLayerSetting = LayerSetting | BaseImageSetLayerSetting;

export interface ImagesetLoadedCallback {
  (layer: ImageSetLayer): void;
}

/** An abstract class for graphical layers that are incorporated into the WWT
 * rendering engine. */
export class Layer {
  id: Guid;
  loadedFromTour: boolean;
  tourDocument: TourDocument | null;
  /** The layer opacity, between 0 and 1. */
  opacity: number;
  opened: boolean;
  version: number;
  color: Color;
  enabled: boolean;
  astronomical: boolean;

  getFileStreamUrl(filename: string): string | null;

  get_astronomical(): boolean;
  set_astronomical(v: boolean): boolean;
  get_color(): Color;
  set_color(v: Color): Color;
  get_endTime(): Date;
  set_endTime(v: Date): Date;
  get_fadeSpan(): number;
  set_fadeSpan(v: number): number;
  get_fadeType(): FadeType;
  set_fadeType(v: FadeType): FadeType;
  get_name(): string;
  set_name(v: string): string;
  get_opacity(): number;
  set_opaciy(v: number): number;
  get_opened(): boolean;
  set_opened(v: boolean): boolean;
  get_referenceFrame(): string;
  set_referenceFrame(v: string): string;
  get_startTime(): Date;
  set_startTime(v: Date): Date;
  get_version(): number;
  set_version(v: number): number;
}

export namespace LayerManager {
  export function get_tourLayers(): boolean;
  export function set_tourLayers(v: boolean): boolean;
  //export function get_layerMaps(): {[name: string]: LayerMap}
  export function get_layerList(): {[guidtext: string]: Layer};

  export function add(layer: Layer, updateTree: boolean): void;
  export function addFitsImageSetLayer(imageset: ImageSetLayer, title: string): ImageSetLayer;
  export function addImageSetLayer(imageset: Imageset, title: string): ImageSetLayer;
  export function createSpreadsheetLayer(frame: string, name: string, data: string): SpreadSheetLayer;
  export function deleteLayerByID(id: Guid, removeFromParent: boolean, updateTree: boolean): void;
  // addVoTableLayer
  export function getMoonFile(url: string): void;
  export function initLayers(): void;
  export function mergeToursLayers(): void;
}

/** An alias for the type implicitly defined by the static
 * [[LayerManager]] namespace. */
export type LayerManagerObject = typeof LayerManager;

/** The full LayerSetting type, which augments engine-types' BaseLayerSetting
 * with types that are only provided within the engine itself.
 */
export type LayerSetting = BaseLayerSetting |
  // NOTE: isLayerSetting in engine-helpers needs to be kept in sync.
  ["color", Color];

export class Place implements Thumbnail {
  annotation: string;
  angularSize: number;
  htmlDescription: string;

  get_annotation(): string;
  set_annotation(v: string): string;
  get_backgroundImageset(): Imageset | null;
  set_backgroundImageset(v: Imageset | null): Imageset | null;
  get_children(): Thumbnail[];
  get_classification(): Classification;
  set_classification(v: Classification): Classification;
  get_constellation(): string;
  set_constellation(v: string): string;
  get_dec(): number;
  set_dec(v: number): number;
  get_distance(): number;
  set_distance(v: number): number;
  get_elevation(): number;
  set_elevation(v: number): number;
  get_isCloudCommunityItem(): boolean;
  get_isFolder(): boolean;
  get_isImage(): boolean;
  get_isTour(): boolean;
  get_lat(): number;
  set_lat(v: number): number;
  get_lng(): number;
  set_lng(v: number): number;
  get_magnitude(): number;
  set_magnitude(v: number): number;
  get_name(): string;
  get_names(): string[];
  set_names(v: string[]): string[];
  get_opacity(): number;
  set_opacity(v: number): number;
  get_RA(): number;
  set_RA(v: number): number;
  get_readOnly(): boolean;
  get_searchDistance(): number;
  set_searchDistance(v: number): number;
  get_studyImageset(): Imageset | null;
  set_studyImageset(v: Imageset | null): Imageset | null;
  //get_tag()
  //set_tag()
  get_target(): SolarSystemObjects;
  set_target(v: SolarSystemObjects): SolarSystemObjects;
  get_thumbnailUrl(): string;
  set_thumbnailUrl(v: string): string;
  get_type(): ImageSetType;
  set_type(v: ImageSetType): ImageSetType;
  get_url(): string;
  set_url(v: string): string;
  get_zoomLevel(): number;
  set_zoomLevel(v: number): number;

  updatePlanetLocation(jNow: number): void;
}


/** A polygonal annotation. */
export class Poly extends Annotation {
  get_fill(): boolean;
  set_fill(v: boolean): boolean;
  get_fillColor(): string;
  /** The color is parsed using [[Color.fromName]]. */
  set_fillColor(v: string): string;
  get_lineColor(): string;
  /** The color is parsed using [[Color.load]]. */
  set_lineColor(v: string): string;
  /** This parameter currently DOES NOTHING because the WebGL renderer doesn't yet support parametrizable line widths. */
  get_lineWidth(): number;
  /** This parameter currently DOES NOTHING because the WebGL renderer doesn't yet support parametrizable line widths. */
  set_lineWidth(v: number): number;

  /** Add a point to this annotation's definition. */
  addPoint(raDeg: number, decDeg: number): void;
}

/** Possible settings that can be applied to Poly annotations. */
export type PolyAnnotationSetting =
  // NOTE: isPolyAnnotationSetting in engine-helpers needs to be kept in sync.
  AnnotationSetting |
  ["fill", boolean] |
  ["fillColor", string] |
  ["lineColor", string] |
  ["lineWidth", number];

/** An annotation composed of a sequence of lines. */
export class PolyLine extends Annotation {
  get_lineColor(): string;
  /** The color is parsed using [[Color.load]]. */
  set_lineColor(v: string): string;
  /** This parameter currently DOES NOTHING because the WebGL renderer doesn't yet support parametrizable line widths. */
  get_lineWidth(): number;
  /** This parameter currently DOES NOTHING because the WebGL renderer doesn't yet support parametrizable line widths. */
  set_lineWidth(v: number): number;

  /** Add a point to this annotation's definition. */
  addPoint(raDeg: number, decDeg: number): void;
}

/** Possible settings that can be applied to PolyLine annotations. */
export type PolyLineAnnotationSetting =
  // NOTE: isPolyLineAnnotationSetting in engine-helpers needs to be kept in sync.
  AnnotationSetting |
  ["lineColor", string] |
  ["lineWidth", number];

export interface ReadyEventCallback {
  /** Called when the WWT engine has finished its initialization. */
  (si: ScriptInterface): void;
}

export class RenderContext {
  height: number;
  width: number;
  lighting: boolean;
  space: boolean;
  viewCamera: CameraParameters;
  targetCamera: CameraParameters;
  alt: number;
  az: number;
  targetAlt: number;
  targetAz: number;
  targetAltitude: number;
  customTrackingParams: CameraParameters;
  perspectiveFov: number;
  nearPlane: number;

  get_backgroundImageset(): Imageset | null;
  set_backgroundImageset(v: Imageset | null): Imageset | null;
  get_dec(): number;
  get_foregroundImageset(): Imageset | null;
  set_foregroundImageset(v: Imageset | null): Imageset | null;
  get_fovAngle(): number;
  get_fovLocal(): number;
  set_fovLocal(): number;
  get_fovScale(): number;
  set_fovScale(v: number): number;
  get_nominalRadius(): number;
  set_nominalRadius(v: number): number;
  get_RA(): number;
  get_sandboxMode(): boolean;
  get_solarSystemCameraDistance(): number;
  get_solarSystemTrack(): SolarSystemObjects;
  set_solarSystemTrack(v: SolarSystemObjects): SolarSystemObjects;
  get_trackingFrame(): string;
  set_trackingFrame(v: string): string;
  get_twoSidedLighting(): boolean;
  set_twoSidedLighting(v: boolean): boolean;

  getAltitudeForLatLongForPlanet(
    planetID: number,
    viewLat: number,
    viewLong: number
  ): number;
  onTarget(place: Place): boolean;
}

export class ScriptInterface {
  /** The rendering settings associated with the viewer. */
  settings: Settings;

  /** Get the current right ascension of the view, in hours. */
  getRA(): number;

  /** Get the current declination of the view, in degrees. */
  getDec(): number;

  /** Register a callback to be called when the WWT view arrives at a commanded
   * position.
   * */
  add_arrived(callback: ArrivedEventCallback): void;

  /** Deregister an "arrive" callback.
   *
   * The deregistration is performed by object equality check. Since the
   * callback in question is a function, if you want to use this function you
   * probably need to save the callback in some kind of variable for future
   * retrieval.
   */
  remove_arrived(callback: ArrivedEventCallback): void;

  /** Register a callback to be called when the engine completes loading a
   * WTML collection document that it was told to download.
   */
  add_collectionLoaded(callback: CollectionLoadedEventCallback): void;

  /** Deregister a "collectionLoaded" callback.
   *
   * The deregistration is performed by object equality check. Since the
   * callback in question is a function, if you want to use this function you
   * probably need to save the callback in some kind of variable for future
   * retrieval.
   */
  remove_collectionLoaded(callback: CollectionLoadedEventCallback): void;

  /** Register a callback to be called when the WWT engine has finished its
   * initialization.
   */
  add_ready(callback: ReadyEventCallback): void;

  /** Deregister a "ready" callback. */
  remove_ready(callback: ReadyEventCallback): void;

  /** Register a callback to be called when [[WWTControl.loadTour]] or
   * [[WWTControl.playTour]] have finished loading a tour.
   */
  add_tourReady(callback: ScriptInterfaceCallback): void;

  /** Deregister a "tourReady" callback. */
  remove_tourReady(callback: ScriptInterfaceCallback): void;

  /** Load a WTML collection and the imagesets that it contains.
   *
   * This function triggers a download of the specified URL, which should return
   * an XML document in the [WTML collection][wtml] format. Any `ImageSet`
   * entries in the collection, or `Place` entries containing image sets, will
   * be added to the WWT instance’s list of available imagery. Subsequent calls
   * to functions like [[WWTControl.setForegroundImageByName]] will be able to
   * locate the new imagesets and display them to the user.
   *
   * If the URL is not accessible due to CORS restrictions, the request will
   * automatically be routed through the WWT’s CORS proxying service.
   *
   * After the collection is successfully loaded, a `collectionLoaded` event
   * will be issued, which you can listen for using the [[add_collectionLoaded]]
   * method.
   *
   * [wtml]: https://docs.worldwidetelescope.org/data-guide/1/data-file-formats/collections/
   *
   * @param url The URL of the WTML collection file to load.
   */
  loadImageCollection(url: string): void;

  /** Set the opacity with which the foreground imageset is rendered.
   *
   * @param opacity The opacity, between 0 (invisible) and 100 (fully opaque).
   */
  setForegroundOpacity(opacity: number): void;

  /** Initiate the loading of a single-file FITS layer
   *
   * Although this function will return an ImageSetLayer object immediately, the
   * FITS information won't be ready until the FITS file is downloaded and
   * parsed. The callback will be called after this completes.
   *
   * The specified URL will be downloaded and parsed as a FITS file. This API is
   * therefore insufficient for large datasets, since they become impractical to
   * download as whole files.
   */
  loadFitsLayer(
    url: string,
    name: string,
    gotoTarget: boolean,
    callback: ImagesetLoadedCallback
  ): ImageSetLayer;

  /** Create a circle annotation.
   *
   * It is *not* automatically added to the renderer. Use [[addAnnotation]] to do that.
   */
  createCircle(fill: boolean): Circle;

  /** Create a polygonal annotation.
   *
   * It is *not* automatically added to the renderer. Use [[addAnnotation]] to do that.
   */
  createPolygon(fill: boolean): Poly;

  /** Create a multi-line annotation.
   *
   * It is *not* automatically added to the renderer. Use [[addAnnotation]] to do that.
   */
  createPolyLine(unused: boolean): PolyLine;

  /** Add an annotation to the renderer. */
  addAnnotation(ann: Annotation): void;

  /** Remove an annotation from the renderer. */
  removeAnnotation(ann: Annotation): void;

  /** Remove all annotations from the renderer. */
  clearAnnotations(): void;
}

/** A generic [[ScriptInterface]] callback. */
export interface ScriptInterfaceCallback {
  (si: ScriptInterface): void;
}


/** A variety of settings for the WWT rendering engine. */
export class Settings implements SettingsInterface {
  get_constellationFigureColor(): string;
  set_constellationFigureColor(v: string): string;
  get_constellationBoundryColor(): string;
  set_constellationBoundryColor(v: string): string;
  get_constellationSelectionColor(): string;
  set_constellationSelectionColor(v: string): string;
  get_showCrosshairs(): boolean;
  set_showCrosshairs(v: boolean): boolean;
  get_smoothPan(): boolean;
  set_smoothPan(v: boolean): boolean;
  get_crosshairsColor(): string;
  set_crosshairsColor(v: string): string;
  get_actualPlanetScale(): boolean;
  set_actualPlanetScale(v: boolean): boolean;
  get_fovCamera(): number;
  get_fovEyepiece(): number;
  get_fovTelescope(): number;
  get_locationAltitude(): number;
  set_locationAltitude(v: number): number;
  get_locationLat(): number;
  set_locationLat(v: number): number;
  get_locationLng(): number;
  set_locationLng(v: number): number;
  get_showClouds(): boolean;
  get_showConstellationBoundries(): boolean;
  set_showConstellationBoundries(v: boolean): boolean;
  get_showConstellationFigures(): boolean;
  set_showConstellationFigures(v: boolean): boolean;
  get_showConstellationSelection(): boolean;
  set_showConstellationSelection(v: boolean): boolean;
  get_showEcliptic(): boolean;
  set_showEcliptic(v: boolean): boolean;
  get_showElevationModel(): boolean;
  set_showElevationModel(v: boolean): boolean;
  get_showFieldOfView(): boolean;
  get_showGrid(): boolean;
  set_showGrid(v: boolean): boolean;
  get_showHorizon(): boolean;
  set_showHorizon(v: boolean): boolean;
  get_showHorizonPanorama(): boolean;
  get_showMoonsAsPointSource(): boolean;
  get_showSolarSystem(): boolean;
  set_showSolarSystem(v: boolean): boolean;
  get_localHorizonMode(): boolean;
  set_localHorizonMode(v: boolean): boolean;
  get_galacticMode(): boolean;
  set_galacticMode(v: boolean): boolean;
  get_solarSystemStars(): boolean;
  set_solarSystemStars(v: boolean): boolean;
  get_solarSystemMilkyWay(): boolean;
  set_solarSystemMilkyWay(v: boolean): boolean;
  get_solarSystemCosmos(): boolean;
  set_solarSystemCosmos(v: boolean): boolean;
  get_solarSystemOrbits(): boolean;
  set_solarSystemOrbits(v: boolean): boolean;
  get_solarSystemOverlays(): boolean;
  set_solarSystemOverlays(v: boolean): boolean;
  get_solarSystemLighting(): boolean;
  set_solarSystemLighting(v: boolean): boolean;
  get_solarSystemMultiRes(): boolean;
  set_solarSystemMultiRes(v: boolean): boolean;
  get_solarSystemScale(): number;
  set_solarSystemScale(v: number): number;
  get_showEquatorialGridText(): boolean;
  set_showEquatorialGridText(v: boolean): boolean;
  get_showGalacticGrid(): boolean;
  set_showGalacticGrid(v: boolean): boolean;
  get_showGalacticGridText(): boolean;
  set_showGalacticGridText(v: boolean): boolean;
  get_showEclipticGrid(): boolean;
  set_showEclipticGrid(v: boolean): boolean;
  get_showEclipticGridText(): boolean;
  set_showEclipticGridText(v: boolean): boolean;
  get_showEclipticOverviewText(): boolean;
  set_showEclipticOverviewText(v: boolean): boolean;
  get_showAltAzGrid(): boolean;
  set_showAltAzGrid(v: boolean): boolean;
  get_showAltAzGridText(): boolean;
  set_showAltAzGridText(v: boolean): boolean;
  get_showPrecessionChart(): boolean;
  set_showPrecessionChart(v: boolean): boolean;
  get_showConstellationPictures(): boolean;
  set_showConstellationPictures(v: boolean): boolean;
  get_showConstellationLabels(): boolean;
  set_showConstellationLabels(v: boolean): boolean;
  get_solarSystemCMB(): boolean;
  set_solarSystemCMB(v: boolean): boolean;
  get_solarSystemMinorPlanets(): boolean;
  set_solarSystemMinorPlanets(v: boolean): boolean;
  get_solarSystemPlanets(): boolean;
  set_solarSystemPlanets(v: boolean): boolean;
  get_showEarthSky(): boolean;
  set_showEarthSky(v: boolean): boolean;
  get_solarSystemMinorOrbits(): boolean;
  set_solarSystemMinorOrbits(v: boolean): boolean;
  get_constellationsEnabled(): string;
  set_constellationsEnabled(v: string): string;
  get_constellationFiguresFilter(): ConstellationFilter;
  set_constellationFiguresFilter(v: ConstellationFilter): ConstellationFilter;
  get_constellationBoundariesFilter(): ConstellationFilter;
  set_constellationBoundariesFilter(v: ConstellationFilter): ConstellationFilter;
  get_constellationNamesFilter(): ConstellationFilter;
  set_constellationNamesFilter(v: ConstellationFilter): ConstellationFilter;
  get_constellationArtFilter(): ConstellationFilter;
  set_constellationArtFilter(v: ConstellationFilter): ConstellationFilter;
  get_showSkyOverlays(): boolean;
  set_showSkyOverlays(v: boolean): boolean;
  get_showConstellations(): boolean;
  set_showConstellations(v: boolean): boolean;
  get_showSkyNode(): boolean;
  set_showSkyNode(v: boolean): boolean;
  get_showSkyGrids(): boolean;
  set_showSkyGrids(v: boolean): boolean;
  get_showSkyOverlaysIn3d(): boolean;
  set_showSkyOverlaysIn3d(v: boolean): boolean;
  get_earthCutawayView(): boolean;
  set_earthCutawayView(v: boolean): boolean;
  get_showISSModel(): boolean;
  set_showISSModel(v: boolean): boolean;
  get_milkyWayModel(): boolean;
  set_milkyWayModel(v: boolean): boolean;
  get_minorPlanetsFilter(): number;
  set_minorPlanetsFilter(v: number): number;
  get_planetOrbitsFilter(): number;
  set_planetOrbitsFilter(v: number): number;
  get_constellations(): boolean;
  set_constellations(v: boolean): boolean;
}

export namespace SpaceTimeController {
  /** Have the WWT clock immediately lock onto to the system clock.
   *
   * This function not only has the effect of calling [[set_syncToClock]] with a
   * true argument, it also sets the offset between the two clocks to be zero.
   */
  export function syncTime(): void;

  /** Get the current time as a JavaScript Date in the UTC timescale. */
  export function get_now(): Date;

  /** Set the current time as a JavaScript Date in the UTC timescale.
   *
   * @param date The date.
   * @returns The date that was just set.
   */
  export function set_now(date: Date): Date;

  /** Get whether the WWT clock moves at the same rate as the system clock.
   *
   * Note that this value may be true but there may still be a constant offset
   * between the two clocks.
   */
  export function get_syncToClock(): boolean;

  /** Set whether the WWT clock moves at the same rate as the system clock.
   *
   * @param sync Whether the clock rates are to be synchronized.
   * @returns The input argument.
   *
   * If set to false, the WWT clock will stop advancing, ignoring the value of
   * [[get_timeRate]]. If set to true, the WWT clock will resume advancing from
   * where it left off, possibly inducing an offset between the WWT clock and
   * the system clock.
   */
  export function set_syncToClock(sync: boolean): boolean;

  /** Get the rate at which the WWT clock advances relative to the system time.
   *
   * A value of 1 means that the two clocks stay in sync. A value of 10 means
   * that time in WWT proceeds 10 times faster than system time. The rate may be
   * negative.
   */
  export function get_timeRate(): number;

  /** Set the rate at which the WWT clock advances relative to the system time.
   *
   * @param rate The rate factor.
   * @returns The input argument.
   *
   * A value of 1 means that the two clocks stay in sync. A value of 10 means
   * that time in WWT proceeds 10 times faster than system time. The rate may be
   * negative.
   *
   * Do not set the rate to zero. Instead, call [[set_syncToClock]] with a false
   * argument.
   */
  export function set_timeRate(rate: number): number;

  /** Get the current time as a Julian date in the UTC timescale (which is
   * problematic)
   *
   * Julian dates measure time as a continuous number of days since a reference
   * point far in the past. Dates around the present will be numbers larger than
   * 2.4 million.
   *
   * Note that it is not rigorously correct to express UTC times as Julian
   * dates, because it is not well-defined how to handle leap seconds. As such,
   * the accuracy of time-dependent computations in WWT should only be
   * trusted to granularities of about a minute.
   */
  export function get_jNow(): number;

  /** Convert a Julian date to a JavaScript UTC datetime.
   *
   * @param jdate The Julian date, usually a number around 2.4 million.
   * @returns A Javascript datetime.
   *
   * See [[get_jNow]] for commentary on this conversion, which is not rigorously
   * correct and can only be trusted to granularities of less than around a
   * minute.
   */
  export function julianToUtc(jdate: number): Date;

  /** Convert a JavaScript UTC datetime to a Julian date.
   *
   * @param date The datetime.
   * @returns A Julian date.
   *
   * See [[get_jNow]] for commentary on this conversion, which is not rigorously
   * correct and can only be trusted to granularities of less than around a
   * minute.
   */
  export function utcToJulian(date: Date): number;
}

/** An alias for the type implicitly defined by the static
 * [[SpaceTimeController]] namespace. */
export type SpaceTimeControllerObject = typeof SpaceTimeController;


/** A tabular data layer. */
export class SpreadSheetLayer extends Layer {
  colorMapperName: string;

  get_altColumn(): number;
  set_altColumn(v: number): number;
  get_altType(): AltTypes;
  set_altType(v: AltTypes): AltTypes;
  get_altUnit(): AltUnits;
  set_altUnit(v: AltUnits): AltUnits;
  get_barChartBitmask(): number;
  set_barChartBitmask(v: number): number;
  get_beginRange(): Date;
  set_beginRange(v: Date): Date;
  get_cartesianCustomScale(): number;
  set_cartesianCustomScale(v: number): number;
  get_cartesianScale(): AltUnits;
  set_cartesianScale(v: AltUnits): AltUnits;
  // get_colorMap
  get_colorMapColumn(): number;
  set_colorMapColumn(v: number): number;
  get_colorMapper(): ColorMapContainer;
  get_colorMapperName(): string;
  set_colorMapperName(v: string): string;
  get_coordinatesType(): CoordinatesType;
  set_coordinatesType(v: CoordinatesType): CoordinatesType;
  get_decay(): number;
  set_decay(v: number): number;
  get_dynamicColor(): boolean;
  set_dynamicColor(v: boolean): boolean;
  get_dynamicData(): boolean;
  set_dynamicData(v: boolean): boolean;
  get_endDateColumn(): number;
  set_endDateColumn(v: number): number;
  get_endRange(): Date;
  set_endRange(v: Date): Date;
  get_geometryColumn(): number;
  set_geometryColumn(v: number): number;
  get_header(): string[];
  get_hyperlinkColumn(): number;
  set_hyperlinkColumn(v: number): number;
  get_hyperlinkFormat(): string;
  set_hyperlinkFormat(v: string): string;
  get_latColumn(): number;
  set_latColumn(v: number): number;
  get_lngColumn(): number;
  set_lngColumn(v: number): number;
  get_markerColumn(): number;
  set_markerColumn(v: number): number;
  get_markerIndex(): number;
  set_markerIndex(v: number): number;
  // get_markerMix
  get_markerScale(): MarkerScales;
  set_markerScale(v: MarkerScales): MarkerScales;
  get_nameColumn(): number;
  set_nameColumn(v: number): number;
  get_normalizeColorMap(): boolean;
  set_normalizeColorMap(v: boolean): boolean;
  get_normalizeColorMapMax(): number;
  set_normalizeColorMapMax(v: number): number;
  get_normalizeColorMapMin(): number;
  set_normalizeColorMapMin(v: number): number;
  get_normalizeSize(): boolean;
  set_normalizeSize(v: boolean): boolean;
  get_normalizeSizeClip(): boolean;
  set_normalizeSizeClip(v: boolean): boolean;
  get_normalizeSizeMax(): number;
  set_normalizeSizeMax(v: number): number;
  get_normalizeSizeMin(): number;
  set_normalizeSizeMin(v: number): number;
  get_plotType(): PlotTypes;
  set_plotType(v: PlotTypes): PlotTypes;
  get_pointScaleType(): PointScaleTypes;
  set_pointScaleType(v: PointScaleTypes): PointScaleTypes;
  get_raUnits(): RAUnits;
  set_raUnits(v: RAUnits): RAUnits;
  get_scaleFactor(): number;
  set_scaleFactor(v: number): number;
  get_showFarSide(): boolean;
  set_showFarSide(v: boolean): boolean;
  get_sizeColumn(): number;
  set_sizeColumn(v: number): number;
  get_startDateColumn(): number;
  set_startDateColumn(v: number): number;
  get_timeSeries(): boolean;
  set_timeSeries(v: boolean): boolean;
  get_xAxisColumn(): number;
  set_xAxisColumn(v: number): number;
  get_xAxisReverse(): boolean;
  set_xAxisReverse(v: boolean): boolean;
  get_yAxisColumn(): number;
  set_yAxisColumn(v: number): number;
  get_yAxisReverse(): boolean;
  set_yAxisReverse(v: boolean): boolean;
  get_zAxisColumn(): number;
  set_zAxisColumn(v: number): number;
  get_zAxisReverse(): boolean;
  set_zAxisReverse(v: boolean): boolean;

  updateData(data: string, purgeOld: boolean, purgeAll: boolean, hasHeader: boolean): boolean;
}

/** The full SpreadSheetLayerSetting type, which augments engine-types'
 * BaseSpreadSheetLayerSetting with types that are only provided within the
 * engine itself.
 */
export type SpreadSheetLayerSetting = LayerSetting | BaseSpreadSheetLayerSetting;

/** A WWT tour. */
export class TourDocument {
  /** Get this tour's "attributes and credits" text.
   *
   * TODO: determine and document any markup / formatting semantics.
   */
  get_attributesAndCredits(): string;

  /** Set this tour's "attributes and credits" text". */
  set_attributesAndCredits(aandc: string): string;

  /** Get the "author URL" of this tour. */
  get_authorUrl(): string;

  /** Set the "author URL" of this tour. */
  set_authorUrl(title: string): string;

  /** Get the index number of the currently active tour stop.
   *
   * In principle, this should maybe be a property of a tour player, not a tour
   * document, but here we are. This will be negative if the tour isn't
   * currently playing.
   */
  get_currentTourstopIndex(): number;

  /** Get this tour's description.
   *
   * TODO: document any markup semantics, etc.
   */
  get_description(): string;

  /** Set this tour's description. */
  set_description(desc: string): string;

  /** Get the tour's run-time, in milliseconds. An integer. */
  get_runTime(): number;

  /** Get this tour's title. */
  get_title(): string;

  /** Set this tour's title. */
  set_title(title: string): string;

  /** Get the set of stops that comprise this tour. */
  get_tourStops(): TourStop[];

  //get_author();
  //get_authorContactText();
  //get_authorEmailOther();
  //get_authorEmail();
  //get_authorImageUrl();
  //get_authorImage();
  //get_authorPhone();
  //get_authorThumbnailFilename();
  //get_editMode();
  //get_fileName();
  //get_id();
  //get_keywords(): string;
  //get_level(): UserLevel;
  //get_objects(): string;
  //get_organizationUrl();
  //get_orgName();
  //get_orgUrl();
  //get_tagId();
  //get_taxonomy(): string;
  //get_tourDirty();
  //get_tourThumbnailFilename();
  //get_type(): Classification;
  //get_workingDirectory();

  /** Calculate how much time must elapse in the tour playback to reach
   * the specified tour stop.
   *
   * @param index The index number of the tour stop to query
   * @returns The amount of time, in seconds.
   */
  elapsedTimeTillTourstop(index: number): number;

  /** Get the stop index of a tour stop, given its identifier.
   *
   * If the ID is the empty string or "Next", the current tour stop index *will
   * be incremented* and returned.
   *
   * @param id The tour stop ID, or an empty string or "Next"
   * @returns The tour stop index
   */
  getTourStopIndexByID(id: string): number;
}


export interface TourEndedCallback {
  /** Called when a [[TourPlayer]] has finished playing its tour. */
  (player: TourPlayer): void;
}


/** An object that manages the playback of a tour.
 *
 * Each [[TourPlayer]] may be associated with an underlying [[TourDocument]],
 * which defines the tour in question. It may be accessed using the [[get_tour]]
 * method.
 */
export class TourPlayer implements UiController {
  /** Get the tour associated with this tour player, if there is one. */
  get_tour(): TourDocument | null;

  /** Set the tour associated with this tour player. */
  set_tour(tour: TourDocument | null): TourDocument | null;

  /** Get whether this player will leave slide [[Settings]] applied when it stops. */
  get_leaveSettingsWhenStopped(): boolean;

  /** Set whether this player will leave slide [[Settings]] applied when it stops. */
  set_leaveSettingsWhenStopped(v: boolean): boolean;

  /** Force the currently playing tour to advance to the next slide. */
  nextSlide(): void;

  /** Start or resume playing the current tour.
   *
   * TODO: clarify semantics about where we start from. Beginning of the current
   * slide, I think?
   */
  play(): void;

  /** Start playing the current tour from the beginning of the specified stop.
   */
  playFromTourstop(stop: TourStop): void;

  /** Stop playing the current tour.
   *
   * TODO: clarify how this differs from `pauseTour`.
   */
  stop(ignored: boolean): void;

  /** Stop playing the current tour, if needed, and clear the current tour document. */
  close(): void;

  /** Toggle the playback state of the current tour, to or from paused. */
  pauseTour(): void;
}

// Static TourPlayer methods.
export namespace TourPlayer {
  /** Get whether a player is currently actually playing its tour.
   *
   * Note that this is a static method on the TourPlayer class, even though most
   * player state is associated with class instances.
   */
  export function get_playing(): boolean;

  //export function set_playing(v: boolean): boolean;

  /** Register a callback to be called when a tour player finishes playing its
   * tour. Note that this function is static.
   */
  export function add_tourEnded(callback: TourEndedCallback): void;

  /** Deregister a "tourEnded" callback.
   *
   * The deregistration is performed by object equality check. Since the
   * callback in question is a function, if you want to use this function you
   * probably need to save the callback in some kind of variable for future
   * retrieval.
   */
  export function remove_tourEnded(callback: TourEndedCallback): void;
}


/** A stop in a [[TourDocument]]. */
export class TourStop implements SettingsInterface {
  get_description(): string;
  set_description(desc: string): string;
  /** Get the stop duration, in integer milliseconds */
  get_duration(): number;
  set_duration(value: number): number;
  /** Get the place that defines the ending camera position of this stop. */
  get_endTarget(): Place;
  set_endTarget(p: Place): Place;
  get_id(): string;
  set_id(id: string): string;
  get_name(): string;
  set_name(name: string): string;
  /** Get the place that defines the starting camera position of this stop. */
  get_target(): Place;
  set_target(p: Place): Place;
  get_tourStopType(): ImageSetType;
  get_tweenPosition(): number;
  set_tweenPosition(value: number): number;

  // get_overlays()
  // layers: Guid=>LayerInfo dict

  // SettingsInterface:
  get_actualPlanetScale(): boolean;
  get_constellationArtFilter(): ConstellationFilterInterface;
  get_constellationBoundariesFilter(): ConstellationFilterInterface;
  get_constellationFiguresFilter(): ConstellationFilterInterface;
  get_constellationNamesFilter(): ConstellationFilterInterface;
  get_constellationsEnabled(): string;
  get_earthCutawayView(): boolean;
  get_fovCamera(): number;
  get_fovEyepiece(): number;
  get_fovTelescope(): number;
  get_galacticMode(): boolean;
  get_localHorizonMode(): boolean;
  get_locationAltitude(): number;
  get_locationLat(): number;
  get_locationLng(): number;
  get_milkyWayModel(): boolean;
  get_minorPlanetsFilter(): number;
  get_planetOrbitsFilter(): number;
  get_showAltAzGrid(): boolean;
  get_showAltAzGridText(): boolean;
  get_showClouds(): boolean;
  get_showConstellationBoundries(): boolean;
  get_showConstellationFigures(): boolean;
  get_showConstellationLabels(): boolean;
  get_showConstellationPictures(): boolean;
  get_showConstellationSelection(): boolean;
  get_showConstellations(): boolean;
  get_showEarthSky(): boolean;
  get_showEcliptic(): boolean;
  get_showEclipticGrid(): boolean;
  get_showEclipticGridText(): boolean;
  get_showEclipticOverviewText(): boolean;
  get_showElevationModel(): boolean;
  get_showEquatorialGridText(): boolean;
  get_showFieldOfView(): boolean;
  get_showGalacticGrid(): boolean;
  get_showGalacticGridText(): boolean;
  get_showGrid(): boolean;
  get_showHorizon(): boolean;
  get_showHorizonPanorama(): boolean;
  get_showISSModel(): boolean;
  get_showMoonsAsPointSource(): boolean;
  get_showPrecessionChart(): boolean;
  get_showSkyGrids(): boolean;
  get_showSkyNode(): boolean;
  get_showSkyOverlays(): boolean;
  get_showSkyOverlaysIn3d(): boolean;
  get_showSolarSystem(): boolean;
  get_solarSystemCMB(): boolean;
  get_solarSystemCosmos(): boolean;
  get_solarSystemLighting(): boolean;
  get_solarSystemMilkyWay(): boolean;
  get_solarSystemMinorOrbits(): boolean;
  get_solarSystemMinorPlanets(): boolean;
  get_solarSystemMultiRes(): boolean;
  get_solarSystemOrbits(): boolean;
  get_solarSystemOverlays(): boolean;
  get_solarSystemPlanets(): boolean;
  get_solarSystemScale(): number;
  get_solarSystemStars(): boolean;
}


/** Items implement IUiController in WWT can, well, control the UI. It's
 * implemented by Object3d, TourEditor, and TourPlayer.
 *
 * This interface doesn't implement any methods that are generically useful to
 * library consumers.
 * */
export interface UiController { }


export class WcsImage {
  cd1_1: number;
  cd1_2: number;
  cd2_1: number;
  cd2_2: number;
  centerX: number;
  centerY: number;
  copyright: string;
  creditsUrl: string;
  description: string;
  filename: string;
  hasLocation: boolean;
  hasPixel: boolean;
  hasRotation: boolean;
  hasScale: boolean;
  hasSize: boolean;
  keywords: string[];
  referenceX: number;
  referenceY: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  sizeX: number;
  sizeY: number;

  get_cd1_1(): number;
  set_cd1_1(v: number): number;
  get_cd1_2(): number;
  set_cd1_2(v: number): number;
  get_cd2_1(): number;
  set_cd2_1(v: number): number;
  get_cd2_2(): number;
  set_cd2_2(v: number): number;
  get_centerX(): number;
  set_centerX(v: number): number;
  get_centerY(): number;
  set_centerY(v: number): number;
  get_colorCombine(): boolean;
  set_colorCombine(v: boolean): boolean;
  get_copyright(): string;
  set_copyright(v: string): string;
  get_creditsUrl(): string;
  set_creditsUrl(v: string): string;
  get_description(): string;
  set_description(v: string): string;
  get_filename(): string;
  set_filename(v: string): string;
  get_keywords(): string[];
  set_keywords(v: string[]): string[];
  get_referenceX(): number;
  set_referenceX(v: number): number;
  get_referenceY(): number;
  set_referenceY(v: number): number;
  get_rotation(): number;
  set_rotation(v: number): number;
  get_scaleX(): number;
  set_scaleX(v: number): number;
  get_scaleY(): number;
  set_scaleY(v: number): number;
  get_sizeX(): number;
  set_sizeX(v: number): number;
  get_sizeY(): number;
  set_sizeY(v: number): number;
  get_validWcs(): boolean;
  set_validWcs(v: boolean): boolean;

  adjustScale(width: number, height: number): void;
  calculateRotationFromCD(): void;
  calculateScaleFromCD(): void;
}

export class WWTControl {
  /** Special UI state that may be active such as a [[TourPlayer]]. */
  uiController: UiController | null;

  /** State of the WWT rendering engine. */
  renderContext: RenderContext;

  /** The current mode that the renderer is in.
   *
   * This value tracks the type of the background imageset. It is updated at the
   * beginning of [[renderOneFrame]], not immediately upon alteration of the
   * background image set.
   */
  renderType: ImageSetType;

  /** Render the view.
   *
   * Note that there also exists a similar method named `render`, but it
   * automatically runs itself in a rendering loop outside of control of the caller,
   * so its use is discouraged.
   */
  renderOneFrame(): void;

  /** Start navigating the view to the specified position.
   *
   * @param ra_hours The target right ascension, in hours.
   * @param dec_deg The target declination, in degrees.
   * @param zoom The target zoom level (see below)
   * @param instant Whether to snap the view instantly or move gradually.
   *
   * If `instant` is true or the commanded camera position is extremely close to the
   * current camera position, the view will update instantly. Otherwise it will
   * scroll there smoothly, taking an unpredictable amount of time to arrive.
   *
   * The zoom level is the height of the viewport in degrees, times six.
   *
   * Navigating the view in this way ends any "tracking" status of the current view.
   */
  gotoRADecZoom(ra_hours: number, dec_deg: number, zoom: number, instant: boolean): void;

  /** Start navigating the view to the specified [[Place]].
   *
   * @param place The destination of the view
   * @param noZoom If true, the zoom, angle, and rotation of the target camera
   * position will be set to match the current camera position. Otherwise, these
   * parameters will be reset to reasonable defaults.
   * @param instant If true, the view camera will immediately snap to the
   * destination position. Otherwise, it will gradually move.
   * @param trackObject If true, the camera will continue tracking the view
   * target as it moves with the progression of the WWT internal clock.
   *
   */
  gotoTarget(place: Place, noZoom: boolean, instant: boolean, trackObject: boolean): void;

  /** Change the zoom of the current view. The change is not necessarily
   * instantaneous, depending on whether the "smooth pan" setting is activated.
   *
   * @param factor The multiplicative factor by which to change the zoom level.
   * A number larger than one causes the field of view to increase, i.e. a zoom
   * out.
   *
   */
  zoom(factor: number): void;

  /** Look up an imageset by its name.
   *
   * The name matching is case-insensitive, matches on substrings, and moves
   * through a list of imagesets that may be populated in an unpredictable
   * order. Therefore even if you provide a name that is an exact match for an
   * existing imageset, you might get a different one than you expect.
   *
   * @param imagesetName The name to look up.
   * @returns An imageset with a matching name, or null if none was found.
   */
  getImagesetByName(imagesetName: string): Imageset | null;

  /** Find a "default" imageset for the specified type and bandpass.
   *
   * This function searches the control’s database of imagery and returns a
   * "default" imageset for the given settings. First preference is given to an
   * imageset with matching `type` and `bandpass` that has a
   * [[Imageset.get_defaultSet]] of true (corresponding to the `StockSet` XML
   * attribute). If no such set exists, the first set with matching `type` and
   * `bandpass` is returned, regardless of its `defaultSet` setting. If there is
   * still no such result, the first imageset with the same `type`, ignoring
   * `bandpass`, is returned. Finally if all else fails, the first imageset in
   * the database is returned.
   *
   * @param type The type of imageset to search.
   * @param bandpass The bandpass to prefer.
   * @returns The chosen default imageset.
   */
  getDefaultImageset(type: ImageSetType, bandpass: BandPass): Imageset;

  /** Set the background imageset using a name-based lookup.
   *
   * This function may change the viewer mode (e.g. sky, panorama, 3D solar
   * system, etc.). To avoid display artifacts when switching to a planetary
   * mode, set the foreground imageset to the same value using
   * [[setForegroundImageByName]].
   *
   * The imageset lookup is done using [[getImagesetByName]]. If the imageset is
   * not found, this function silently does nothing.
   *
   * @param imagesetName: The imageset name.
   */
  setBackgroundImageByName(imagesetName: string): void;

  /** Set the foreground imageset using a name-based lookup.
   *
   * The imageset lookup is done using [[getImagesetByName]]. If the imageset is
   * not found, this function silently does nothing.
   *
   * Note that this function does not alter the camera in any way. You will need
   * to use additional API calls if you want to navigate the view to the
   * imageset in question.
   *
   * @param imagesetName: The imageset name.
   */
  setForegroundImageByName(imagesetName: string): void;

  /** Start loading the tour stored at the specified URL.
   *
   * When loading is complete, a `tourReady` event will be issued, which you can
   * listen for using the [[add_tourReady]] method. You can then get access to a
   * [[TourPlayer]] by casting the [[uiController]] property of this
   * [[WWTControl]]:
   *
   * ```
   * if (ctl.uiController !== null && ctl.uiController instanceof TourPlayer) {
   *   const player: TourPlayer = ctl.uiController;
   *   // ...
   * }
   * ```
   */
  loadTour(url: string): void;

  /** Load the tour stored at the specified URL and start playing it.
   *
   * When loading is complete, a `tourReady` event will be issued, which you can
   * listen for using the [[add_tourReady]] method.
   *
   * See also [[loadTour]], which provides more flexibility to the caller.
   */
  playTour(url: string): void;

  /** Start playing the currently active tour. */
  playCurrentTour(): void;

  /** Pause the currently playing tour. */
  pauseCurrentTour(): void;

  /** Stop the currently playing tour. */
  stopCurrentTour(): void;

  /** Set the maximum allowed user zoom level in 3D ("solar system") mode.
   *
   * @param limit The new zoom limit.
   *
   * This sets how far the user can zoom out when operating in the 3D mode. XXX:
   * I do not know what units this value is measured in! The default value is
   * 10^16.
  */
  setSolarSystemMaxZoom(limit: number): void;

  /** Set the minimum allowed user zoom level in 3D ("solar system") mode.
   *
   * @param limit The new zoom limit.
   *
   * This sets how far the user can zoom in when operating in the 3D mode. XXX:
   * I do not know what units this value is measured in! The default value is
   * 10^-8.
  */
  setSolarSystemMinZoom(limit: number): void;

  /** Set the maximum allowed user zoom level in 2D modes.
   *
   * @param limit The new zoom limit.
   *
   * This sets how far the user can zoom out when operating in a 2D mode such as Sky mode.
   * The zoom number is the angular height of the viewport, measured in degrees, times 6.
   * The default value is 360, corresponding to a viewport height of 60 degrees.
  */
  set_zoomMax(limit: number): number;

  /** Set the minimum allowed user zoom level in 2D modes.
   *
   * @param limit The new zoom limit.
   *
   * *Note*, this limit is not enforced when the user is manually zooming the view in and
   * out. It is only enforced for programmatic moves such a loading a new Place.
   *
   * This sets how far the user can zoom in when operating in a 2D mode such as Sky mode.
   * The zoom number is the angular height of the viewport, measured in degrees, times 6.
   * The default value corresponds to a viewport height of 47 arcseconds.
  */
  set_zoomMin(limit: number): number;
}

export namespace Wtml {
  /** Load a WTML collection and register its imagesets with the [[WWTControl]].
   *
   * This function launches an asychronous operation to retrieve the collection
   * data from the specified URL. As such, the returned [[Folder]] object will
   * start out blank and unpopulated. Its contents will be filled in from the
   * parsed data at some point in the future, at which point the `complete`
   * callback will be called.
   *
   * @param url The URL from which to retrieve the WTML data.
   * @param complete A callback to be called after the folder is successfully
   * loaded.
   * @returns A folder object that will be populated asynchronously.
   */
  export function getWtmlFile(url: string, complete: Action): Folder;
}

export namespace WWTControl {
  /** Initialize the WWT engine and launch its rendering loop.
   *
   * @param divId The `id` of the DOM element into which the WWT WebGL surface
   * will be inserted.
   * @return A handle to a [[ScriptInterface]] associated with this engine
   * instance.
   *
   * The engine is not immediately usable since it must perform initialization
   * that includes fetching resources from the network.
   */
  export function initControl(divId: string): ScriptInterface;

  /** Initialize the WWT engine with defaults.
   *
   * The same as [[initControl6]], with `startLat` and `startLng` defaulting to
   * 0, `startZoom` defaulting to 360, and `startMode` defaulting to `"Sky"`.
   */
  export function initControl2(divId: string, startRenderLoop: boolean): ScriptInterface;

  /** Initialize the WWT engine.
   *
   * @param divId The `id` of the DOM element into which the WWT WebGL surface
   * will be inserted.
   * @param startRenderLoop If true, the engine's internal rendering loop will
   * be launched immediately.
   * @param startLat The starting declination or latitude for the view, in
   * degrees.
   * @param startLng The starting longitude or right ascension for the view, in
   * degrees.
   * @param startZoom The starting zoom level for the view.
   * @param startMode The starting mode for the view: one of `"earth"` or
   * `"Sky"`.
   * @return A handle to a [[ScriptInterface]] associated with this engine
   * instance.
   *
   * The engine is not immediately usable since it must perform initialization
   * that includes fetching resources from the network.
   *
   * If the value of `startMode` is not recognized, Sky mode is assumed.
   *
   * Additional variants of this function, taking additional arguments, may be
   * added over time. Existing versions will be preserved to maintain backwards
   * compatibility.
   */
  export function initControl6(
    divId: string,
    startRenderLoop: boolean,
    startLat: number,
    startLng: number,
    startZoom: number,
    startMode: string
  ): ScriptInterface;

  /** The global WWTControl singleton instance. */
  export const singleton: WWTControl;
}
