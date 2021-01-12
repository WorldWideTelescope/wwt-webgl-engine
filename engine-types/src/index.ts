// Copyright 2020 the .NET Foundation
// Licensed under the MIT License
//
// Based types used in the WWT WebGL engine.
//
// Try to keep everything alphabetized.

/* eslint-disable @typescript-eslint/camelcase */

export enum AltTypes {
  depth = 0,
  altitude = 1,
  distance = 2,
  seaLevel = 3,
  terrain = 4
}

export enum AltUnits {
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

export enum BandPass {
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

export enum Classification {
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

export enum DataTypes {
  byteT = 0,
  int16T = 1,
  int32T = 2,
  floatT = 3,
  doubleT = 4,
  none = 5,
}

export enum FadeType {
  fadeIn = 1,
  fadeOut = 2,
  both = 3,
  none = 4,
}

export enum FolderGroup {
  explorer = 0,
  tour = 1,
  search = 2,
  constellation = 3,
  view = 4,
  goTo = 5,
  community = 6,
  context = 7,
  voTable = 8,
  imageStack = 9
}

export enum FolderRefreshType {
  interval = 0,
  conditionalGet = 1,
  viewChange = 2,
}

export enum FolderType {
  earth = 0,
  planet = 1,
  sky = 2,
  panorama = 3,
}

export enum ImageSetType {
  earth = 0,
  planet = 1,
  sky = 2,
  panorama = 3,
  solarSystem = 4,
  sandbox = 5
}

export enum ProjectionType {
  mercator = 0,
  equirectangular = 1,
  tangent = 2,
  tan = 2,
  toast = 3,
  spherical = 4,
  skyImage = 5,
  plotted = 6
}

export enum ReferenceFrames {
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

export enum ReferenceFrameTypes {
  fixedSherical = 0,
  orbital = 1,
  trajectory = 2,
  synodic = 3
}

export enum ScaleTypes {
  linear = 0,
  log = 1,
  power = 2,
  squareRoot = 3,
  histogramEqualization = 4,
}

export enum SolarSystemObjects {
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

/** Items implementing IThumbnail in WWT can be exposed in its folder explorer
 * interface, or equivalently can be contained in its Folder objects.
 */
export interface Thumbnail {
  get_name(): string;
  get_thumbnailUrl(): string;
  set_thumbnailUrl(url: string): string;
  get_isImage(): boolean;
  get_isTour(): boolean;
  get_isFolder(): boolean;
  get_isCloudCommunityItem(): boolean;
  get_readOnly(): boolean;
  get_children(): Thumbnail[] | null;
}


// TypeScript-ification of the engine settings

export enum WWTBooleanSetting {
  actualPlanetScale,
  constellations,
  earthCutawayView,
  localHorizonMode,
  galacticMode,
  milkyWayModel,
  showAltAzGrid,
  showAltAzGridText,
  showClouds,
  showConstellations,
  showConstellationBoundries,
  showConstellationFigures,
  showConstellationLabels,
  showConstellationPictures,
  showConstellationSelection,
  showCrosshairs,
  showEarthSky,
  showEcliptic,
  showEclipticGrid,
  showEclipticGridText,
  showEclipticOverviewText,
  showElevationModel,
  showEquatorialGridText,
  showFieldOfView,
  showGalacticGrid,
  showGalacticGridText,
  showGrid,
  showHorizon,
  showHorizonPanorama,
  showISSModel,
  showMoonsAsPointSource,
  showPrecessionChart,
  showSkyGrids,
  showSkyNode,
  showSkyOverlays,
  showSkyOverlaysIn3d,
  showSolarSystem,
  smoothPan,
  solarSystemCMB,
  solarSystemCosmos,
  solarSystemMilkyWay,
  solarSystemOrbits,
  solarSystemOverlays,
  solarSystemLighting,
  solarSystemMultiRes,
  solarSystemMinorPlanets,
  solarSystemMinorOrbits,
  solarSystemPlanets,
  solarSystemStars,
}

export enum WWTColorSetting {
  constellationBoundryColor,
  constellationFigureColor,
  constellationSelectionColor,
  crosshairsColor
}

export enum WWTConstellationFilterSetting {
  constellationArtFilter,
  constellationBoundariesFilter,
  constellationFiguresFilter,
  constellationNamesFilter
}

export enum WWTNumberSetting {
  fovCamera,
  fovEyepiece,
  fovTelescope,
  locationAltitude,
  locationLat,
  locationLng,
  minorPlanetsFilter,
  plantOrbitsFilter,
  solarSystemScale
}

export enum WWTStringSetting {
  constellationsEnabled
}

/** TODO: does wwtlib expose a better color type that we should be using? In the
 * Settings class, colors are just straight strings.
 */
export class WWTColor {
  c: string;

  constructor(c: string) {
    this.c = c;
  }
}

/** Placeholder for the engine ConstellationFilter type. */
export interface ConstellationFilterInterface {
  clone(): ConstellationFilterInterface;
}

export type WWTSetting =
  [WWTBooleanSetting, boolean] |
  [WWTColorSetting, WWTColor] |
  [WWTConstellationFilterSetting, ConstellationFilterInterface] |
  [WWTNumberSetting, number] |
  [WWTStringSetting, string];

/** Core settings for the WWT rendering engine.
 *
 * This corresponds to the `ISettings` interface, which is implemented by the
 * `Settings` and `TourStop` classes.
*/
export interface SettingsInterface {
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

  // getSetting()
}
