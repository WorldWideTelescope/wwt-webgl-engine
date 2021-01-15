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

export enum CoordinatesType {
  spherical = 0,
  rectangular = 1,
  orbital = 2,
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

export enum PlotTypes {
  gaussian = 0,
  point = 1,
  circle = 2,
  square = 3,
  pushPin = 4,
  custom = 5,
}

export enum PointScaleTypes {
  linear = 0,
  power = 1,
  log = 2,
  constant = 3,
  stellarMagnitude = 4,
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

export enum RAUnits {
  hours = 0,
  degrees = 1,
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

/** Settings for the WWT engine that don't depend on types defined in
 * the engine itself. */
export type BaseEngineSetting =
  ["actualPlanetScale", boolean] |
  ["constellations", boolean] |
  ["constellationsEnabled", string] |
  ["earthCutawayView", boolean] |
  ["fovCamera", number] |
  ["fovEyepiece", number] |
  ["fovTelescope", number] |
  ["localHorizonMode", boolean] |
  ["galacticMode", boolean] |
  ["locationAltitude", number] |
  ["locationLat", number] |
  ["locationLng", number] |
  ["milkyWayModel", boolean] |
  ["showAltAzGrid", boolean] |
  ["showAltAzGridText", boolean] |
  ["showClouds", boolean] |
  ["showConstellations", boolean] |
  ["showConstellationBoundries", boolean] |
  ["showConstellationFigures", boolean] |
  ["showConstellationLabels", boolean] |
  ["showConstellationPictures", boolean] |
  ["showConstellationSelection", boolean] |
  ["showCrosshairs", boolean] |
  ["showEarthSky", boolean] |
  ["showEcliptic", boolean] |
  ["showEclipticGrid", boolean] |
  ["showEclipticGridText", boolean] |
  ["showEclipticOverviewText", boolean] |
  ["showElevationModel", boolean] |
  ["showEquatorialGridText", boolean] |
  ["showFieldOfView", boolean] |
  ["showGalacticGrid", boolean] |
  ["showGalacticGridText", boolean] |
  ["showGrid", boolean] |
  ["showHorizon", boolean] |
  ["showHorizonPanorama", boolean] |
  ["showISSModel", boolean] |
  ["showMoonsAsPointSource", boolean] |
  ["showPrecessionChart", boolean] |
  ["showSkyGrids", boolean] |
  ["showSkyNode", boolean] |
  ["showSkyOverlays", boolean] |
  ["showSkyOverlaysIn3d", boolean] |
  ["showSolarSystem", boolean] |
  ["smoothPan", boolean] |
  ["solarSystemCMB", boolean] |
  ["solarSystemCosmos", boolean] |
  ["solarSystemMilkyWay", boolean] |
  ["solarSystemOrbits", boolean] |
  ["solarSystemOverlays", boolean] |
  ["solarSystemLighting", boolean] |
  ["solarSystemMultiRes", boolean] |
  ["solarSystemMinorPlanets", boolean] |
  ["solarSystemMinorOrbits", boolean] |
  ["solarSystemPlanets", boolean] |
  ["solarSystemStars", boolean] |
  ["minorPlanetsFilter", number] |
  ["plantOrbitsFilter", number] |
  ["solarSystemScale", number];

// I'm not aware of any smart TypeScripty way to automate the construction of this table :-(
const baseEngineSettingTypeInfo = {
  "actualPlanetScale/boolean": true,
  "constellations/boolean": true,
  "constellationsEnabled/string": true,
  "earthCutawayView/boolean": true,
  "fovCamera/number": true,
  "fovEyepiece/number": true,
  "fovTelescope/number": true,
  "localHorizonMode/boolean": true,
  "galacticMode/boolean": true,
  "locationAltitude/number": true,
  "locationLat/number": true,
  "locationLng/number": true,
  "milkyWayModel/boolean": true,
  "showAltAzGrid/boolean": true,
  "showAltAzGridText/boolean": true,
  "showClouds/boolean": true,
  "showConstellations/boolean": true,
  "showConstellationBoundries/boolean": true,
  "showConstellationFigures/boolean": true,
  "showConstellationLabels/boolean": true,
  "showConstellationPictures/boolean": true,
  "showConstellationSelection/boolean": true,
  "showCrosshairs/boolean": true,
  "showEarthSky/boolean": true,
  "showEcliptic/boolean": true,
  "showEclipticGrid/boolean": true,
  "showEclipticGridText/boolean": true,
  "showEclipticOverviewText/boolean": true,
  "showElevationModel/boolean": true,
  "showEquatorialGridText/boolean": true,
  "showFieldOfView/boolean": true,
  "showGalacticGrid/boolean": true,
  "showGalacticGridText/boolean": true,
  "showGrid/boolean": true,
  "showHorizon/boolean": true,
  "showHorizonPanorama/boolean": true,
  "showISSModel/boolean": true,
  "showMoonsAsPointSource/boolean": true,
  "showPrecessionChart/boolean": true,
  "showSkyGrids/boolean": true,
  "showSkyNode/boolean": true,
  "showSkyOverlays/boolean": true,
  "showSkyOverlaysIn3d/boolean": true,
  "showSolarSystem/boolean": true,
  "smoothPan/boolean": true,
  "solarSystemCMB/boolean": true,
  "solarSystemCosmos/boolean": true,
  "solarSystemMilkyWay/boolean": true,
  "solarSystemOrbits/boolean": true,
  "solarSystemOverlays/boolean": true,
  "solarSystemLighting/boolean": true,
  "solarSystemMultiRes/boolean": true,
  "solarSystemMinorPlanets/boolean": true,
  "solarSystemMinorOrbits/boolean": true,
  "solarSystemPlanets/boolean": true,
  "solarSystemStars/boolean": true,
  "minorPlanetsFilter/number": true,
  "plantOrbitsFilter/number": true,
  "solarSystemScale/number": true,
}

/** Type guard function for BaseEngineSetting. */
export function isBaseEngineSetting(obj: [string, any]): obj is BaseEngineSetting {  // eslint-disable-line @typescript-eslint/no-explicit-any
  const key = obj[0] + "/" + typeof obj[1];
  return (key in baseEngineSettingTypeInfo);
}

/** Placeholder for the engine ConstellationFilter type. */
export interface ConstellationFilterInterface {
  clone(): ConstellationFilterInterface;
}

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

/** Settings for instances of the Layer type.  */
export type BaseLayerSetting =
  ["astronomical", boolean] |
  ["fadeSpan", number] |
  ["name", string] |
  ["opacity", number] |
  ["opened", boolean] |
  ["referenceFrame", string] |
  ["version", number];

const baseLayerSettingTypeInfo = {
  "astronomical/boolean": true,
  "fadeSpan/number": true,
  "name/string": true,
  "opacity/number": true,
  "opened/boolean": true,
  "referenceFrame/string": true,
  "version/number": true,
}

/** Type guard function for BaseLayerSetting. */
export function isBaseLayerSetting(obj: [string, any]): obj is BaseLayerSetting {  // eslint-disable-line @typescript-eslint/no-explicit-any
  const key = obj[0] + "/" + typeof obj[1];
  return key in baseLayerSettingTypeInfo;
}

/** Settings specifically for instances of the ImageSetLayer type.  */
export type BaseImageSetLayerSetting =
  BaseLayerSetting |
  ["colorMapperName", string] |
  ["overrideDefaultLayer", boolean];

const baseImageSetLayerSettingTypeInfo = {
  "colorMapperName/string": true,
  "overrideDefaultLayer/boolean": true,
};

/** Type guard function for BaseImageSetLayerSetting. */
export function isBaseImageSetLayerSetting(obj: [string, any]): obj is BaseImageSetLayerSetting {  // eslint-disable-line @typescript-eslint/no-explicit-any
  const key = obj[0] + "/" + typeof obj[1];
  return (key in baseImageSetLayerSettingTypeInfo) || isBaseLayerSetting(obj);
}

/** Settings specifically for instances of the SpreadSheetLayer type. */
export type BaseSpreadSheetLayerSetting =
  ["altColumn", number] |
  ["altType", AltTypes] |
  ["altUnit", AltUnits] |
  ["barChartBitmask", number] |
  ["beginRange", Date] |
  ["cartesianCustomScale", number] |
  ["cartesianScale", AltUnits] |
  ["colorMapColumn", number] |
  ["colorMapperName", string] |
  ["coordinatesType", CoordinatesType] |
  ["decay", number] |
  ["dynamicColor", boolean] |
  ["dynamicData", boolean] |
  ["endDateColumn", number] |
  ["endRange", Date] |
  ["geometryColumn", number] |
  ["hyperlinkColumn", number] |
  ["hyperlinkFormat", string] |
  ["latColumn", number] |
  ["lngColumn", number] |
  ["markerColumn", number] |
  ["markerIndex", number] |
  ["markerScale", number] |
  ["nameColumn", number] |
  ["normalizeColorMap", boolean] |
  ["normalizeColorMapMax", number] |
  ["normalizeColorMapMin", number] |
  ["normalizeSize", boolean] |
  ["normalizeSizeClip", boolean] |
  ["normalizeSizeMax", number] |
  ["normalizeSizeMin", number] |
  ["plotType", PlotTypes] |
  ["pointScaleType", PointScaleTypes] |
  ["raUnits", RAUnits] |
  ["scaleFactor", number] |
  ["showFarSide", boolean] |
  ["sizeColumn", number] |
  ["startDateColumn", number] |
  ["timeSeries", boolean] |
  ["xAxisColumn", number] |
  ["xAxisReverse", boolean] |
  ["yAxisColumn", number] |
  ["yAxisReverse", boolean] |
  ["zAxisColumn", number] |
  ["zAxisReverse", boolean] |
  BaseLayerSetting;

// See implementation below -- we need to handle enums specially
// to make sure that inputs are in-range.
const baseSpreadSheetLayerSettingTypeInfo: {[k: string]: string} = {
  "altColumn/number": "",
  "altType/number": "AltTypes",
  "altUnit/number": "AltUnits",
  "barChartBitmask/number": "",
  "beginRange/Date": "",
  "cartesianCustomScale/number": "",
  "cartesianScale/number": "AltUnits",
  "colorMapColumn/number": "",
  "colorMapperName/string": "",
  "coordinatesType/number": "CoordinatesType",
  "decay/number": "",
  "dynamicColor/boolean": "",
  "dynamicData/boolean": "",
  "endDateColumn/number": "",
  "endRange/Date": "",
  "geometryColumn/number": "",
  "hyperlinkColumn/number": "",
  "hyperlinkFormat/string": "",
  "latColumn/number": "",
  "lngColumn/number": "",
  "markerColumn/number": "",
  "markerIndex/number": "",
  "markerScale/number": "",
  "nameColumn/number": "",
  "normalizeColorMap/boolean": "",
  "normalizeColorMapMax/number": "",
  "normalizeColorMapMin/number": "",
  "normalizeSize/boolean": "",
  "normalizeSizeClip/boolean": "",
  "normalizeSizeMax/number": "",
  "normalizeSizeMin/number": "",
  "plotType/number": "PlotTypes",
  "pointScaleType/number": "PointScaleTypes",
  "raUnits/number": "RAUnits",
  "scaleFactor/number": "",
  "showFarSide/boolean": "",
  "sizeColumn/number": "",
  "startDateColumn/number": "",
  "timeSeries/boolean": "",
  "xAxisColumn/number": "",
  "xAxisReverse/boolean": "",
  "yAxisColumn/number": "",
  "yAxisReverse/boolean": "",
  "zAxisColumn/number": "",
  "zAxisReverse/boolean": "",
};

/** Type guard function for BaseSpreadSheetLayerSetting. */
export function isBaseSpreadSheetLayerSetting(obj: [string, any]): obj is BaseSpreadSheetLayerSetting {  // eslint-disable-line @typescript-eslint/no-explicit-any
  if (isBaseLayerSetting(obj))
    return true;

  const key = obj[0] + "/" + typeof obj[1];
  const enumType = baseSpreadSheetLayerSettingTypeInfo[key];

  if (enumType === undefined) {
    return false;
  } else if (enumType == "") {
    return true;
  } else if (enumType == "AltTypes") {
    return obj[1] in AltTypes;
  } else if (enumType == "AltUnits") {
    return obj[1] in AltUnits;
  } else if (enumType == "CoordinatesType") {
    return obj[1] in CoordinatesType;
  } else if (enumType == "PlotTypes") {
    return obj[1] in PlotTypes;
  } else if (enumType == "PointScaleTypes") {
    return obj[1] in PointScaleTypes;
  } else if (enumType == "RAUnits") {
    return obj[1] in RAUnits;
  } else {
    throw new Error('internal bug isBaseSpreadSheetLayerSetting');
  }
}

// TypeScript magic to allow fallible reverse mapping of string-valued enums.
// https://stackoverflow.com/q/57922745/3760486
type StringEnum = {[key: string]: string};

function keysOf<K extends {}>(o: K): (keyof K)[];
function keysOf(o: any) { return Object.keys(o); }  // eslint-disable-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any

export function enumLookup<E extends StringEnum>(
  stringEnum: E,
  s: string
): E[keyof E] | undefined {
  for (const enumKey of keysOf(stringEnum)) {
    if (stringEnum[enumKey] === s) {
      return stringEnum[enumKey] as E[keyof E];
    }
  }
  return undefined;
}