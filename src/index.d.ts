// Copyright 2020 the .NET Foundation
// Licensed under the MIT License
//
// TypeScript definitions for the WWT WebGL engine.
//
// Try to keep everything alphabetized.

export as namespace wwtlib;

declare enum AltTypes {
  depth = 0,
  altitude = 1,
  distance = 2,
  seaLevel = 3,
  terrain = 4
}

declare enum AltUnits {
  meters = 1,
  feet = 2,
  inches = 3,
  miles = 4,
  kilometers = 5,
  astronomicalUnits = 6,
  lightYears = 7,
  parsecs = 8,
  megaParsecs = 9,
  custom = 10
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

declare enum BandPass {
  gamma = 0,
  xRay = 1,
  ultraviolet = 2,
  visible = 3,
  hydrogenAlpha = 4,
  IR = 4,
  microwave = 5,
  radio = 6,
  visibleNight = 6
}

declare enum Classification {
  star = 1,
  supernova = 2,
  blackHole = 4,
  neutronStar = 8,
  doubleStar = 16,
  multipleStars = 32,
  asterism = 64,
  constellation = 128,
  openCluster = 256,
  globularCluster = 512,
  nebulousCluster = 1024,
  nebula = 2048,
  emissionNebula = 4096,
  planetaryNebula = 8192,
  reflectionNebula = 16384,
  darkNebula = 32768,
  giantMolecularCloud = 65536,
  supernovaRemnant = 131072,
  interstellarDust = 262144,
  quasar = 524288,
  galaxy = 1048576,
  spiralGalaxy = 2097152,
  irregularGalaxy = 4194304,
  ellipticalGalaxy = 8388608,
  knot = 16777216,
  plateDefect = 33554432,
  clusterOfGalaxies = 67108864,
  otherNGC = 134217728,
  unidentified = 268435456,
  solarSystem = 536870912,
  unfiltered = 1073741823,
  stellar = 63,
  stellarGroupings = 2032,
  nebulae = 523264,
  galactic = 133693440,
  other = 436207616
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
export class Imageset {
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

declare enum ImageSetType {
  earth = 0,
  planet = 1,
  sky = 2,
  panorama = 3,
  solarSystem = 4,
  sandbox = 5
}

declare enum ProjectionType {
  mercator = 0,
  equirectangular = 1,
  tangent = 2,
  tan = 2,
  toast = 3,
  spherical = 4,
  skyImage = 5,
  plotted = 6
}

export interface ReadyEventCallback {
  /** Called when the WWT engine has finished its initialization. */
  (si: ScriptInterface): void;
}

declare enum ReferenceFrames {
  sky = 0,
  ecliptic = 1,
  galactic = 2,
  sun = 3,
  mercury = 4,
  venus = 5,
  earth = 6,
  mars = 7,
  jupiter = 8,
  saturn = 9,
  uranus = 10,
  neptune = 11,
  pluto = 12,
  moon = 13,
  io = 14,
  europa = 15,
  ganymede = 16,
  callisto = 17,
  custom = 18,
  identity = 19,
  sandbox = 20
}

declare enum ReferenceFrameTypes {
  fixedSherical = 0,
  orbital = 1,
  trajectory = 2,
  synodic = 3
}

export class ScriptInterface {
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

  /** Register a callback to be called when the WWT engine has finished its
   * initialization.
   */
  add_ready(callback: ReadyEventCallback): void;

  /** Deregister a "ready" callback. */
  remove_ready(callback: ReadyEventCallback): void;
}

declare enum SolarSystemObjects {
  sun = 0,
  mercury = 1,
  venus = 2,
  mars = 3,
  jupiter = 4,
  saturn = 5,
  uranus = 6,
  neptune = 7,
  pluto = 8,
  moon = 9,
  io = 10,
  europa = 11,
  ganymede = 12,
  callisto = 13,
  ioShadow = 14,
  europaShadow = 15,
  ganymedeShadow = 16,
  callistoShadow = 17,
  sunEclipsed = 18,
  earth = 19,
  custom = 20,
  undefined = 65536
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
   * @param imagesetName: The imageset name.
  */
  setForegroundImageByName(imagesetName: string): void;
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
