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
  // AltTypes,
  // AltUnits,
  BandPass,
  Classification,
  ConstellationFilterInterface,
  FolderGroup,
  FolderRefreshType,
  FolderType,
  ImageSetType,
  ProjectionType,
  // ReferenceFrames,
  // ReferenceFrameTypes,
  // SolarSystemObjects
  Thumbnail,
  SolarSystemObjects,
} from "@wwtelescope/engine-types";

/** A generic callback type. */
export interface Action {
  (): void;
}

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

export class ConstellationFilter implements ConstellationFilterInterface {
  clone(): ConstellationFilter;
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

/** An imagery layer that can be displayed in WWT. */
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
   * @param url: The URL of the WTML collection file to load.
   */
  loadImageCollection(url: string): void;
}

/** A variety of settings for the WWT rendering engine. */
export class Settings {
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

export class WWTControl {
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
