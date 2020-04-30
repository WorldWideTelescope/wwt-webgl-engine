// Copyright 2020 the .NET Foundation
// Licensed under the MIT License
//
// Based types used in the WWT WebGL engine.
//
// Try to keep everything alphabetized.

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

export class ConstellationFilter {}

export type WWTSetting =
  [WWTBooleanSetting, boolean] |
  [WWTColorSetting, WWTColor] |
  [WWTConstellationFilterSetting, ConstellationFilter] |
  [WWTNumberSetting, number] |
  [WWTStringSetting, string];
