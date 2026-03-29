// Originally `AAELEMENTSPLANETARYORBIT.CPP`
// "Purpose: Implementation for the algorithms to calculate the elements of the planetary orbits"
// Last update of original: PJN / 29-12-2003
//
// Translated into C# and released by Microsoft, then transpiled into JavaScript
// by ScriptSharp, for the WorldWide Telescope project.
//
// The legal notices in the original code are as follows:
//
// Copyright (c) 2003 - 2007 by PJ Naughter (Web: www.naughter.com, Email: pjna@naughter.com)
//
// All rights reserved.
//
// Copyright / Usage Details:
//
// You are allowed to include the source code in any product (commercial, shareware, freeware or otherwise)
// when your product is released in binary form. You are allowed to modify the source code in any way you want
// except you cannot modify the copyright details at the top of each module. If you want to distribute source
// code with your application, then you are only allowed to distribute versions released by the author. This is
// to maintain a single distribution point for the source code.

import { registerType } from "../typesystem.js";
import { CT } from "./coordinate_transformation.js";

import { Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Equinox } from "aa-js";


// EPO - was CAAElementsPlanetaryOrbit

export function EPO() { }

EPO.mercuryMeanLongitude = function (JD) {
    return Mercury.getMeanLongitude(JD);
};

EPO.mercurySemimajorAxis = function (UnnamedParameter1) {
    // TODO: getSemiMajorAxis is not exported from AA.js - should it be?
    return Mercury.orbitalElements.semiMajorAxis[0];
};

EPO.mercuryEccentricity = function (JD) {
    return Mercury.getEccentricity(JD);
};

EPO.mercuryInclination = function (JD) {
    return Mercury.getInclination(JD);
};

EPO.mercuryLongitudeAscendingNode = function (JD) {
    return Mercury.getLongitudeOfAscendingNode(JD);
};

EPO.mercuryLongitudePerihelion = function (JD) {
    return Mercury.getLongitudeOfPerihelion(JD);
};

EPO.venusMeanLongitude = function (JD) {
    return Venus.getMeanLongitude(JD);
};

EPO.venusSemimajorAxis = function (UnnamedParameter1) {
    return Venus.orbitalElements.semiMajorAxis[0];
};

EPO.venusEccentricity = function (JD) {
    return Venus.getEccentricity(JD);
};

EPO.venusInclination = function (JD) {
    return Venus.getInclination(JD);
};

EPO.venusLongitudeAscendingNode = function (JD) {
    return Venus.getLongitudeOfAscendingNode(JD);
};

EPO.venusLongitudePerihelion = function (JD) {
    return Venus.getLongitudeOfPerihelion(JD);
};

EPO.earthMeanLongitude = function (JD) {
    var T = (JD - 2451545) / 36525;
    var Tsquared = T * T;
    var Tcubed = Tsquared * T;
    return CT.m360(100.466457 + 36000.7698278 * T + 0.00030322 * Tsquared + 2E-08 * Tcubed);
};

EPO.earthSemimajorAxis = function (UnnamedParameter1) {
    return 1.000001018;
};

EPO.earthEccentricity = function (JD) {
    var T = (JD - 2451545) / 36525;
    var Tsquared = T * T;
    var Tcubed = Tsquared * T;
    return 0.01670863 - 4.2037E-05 * T - 1.267E-07 * Tsquared + 1.4E-10 * Tcubed;
};

EPO.earthInclination = function (UnnamedParameter1) {
    return 0;
};

EPO.earthLongitudePerihelion = function (JD) {
    var T = (JD - 2451545) / 36525;
    var Tsquared = T * T;
    var Tcubed = Tsquared * T;
    return CT.m360(102.937348 + 1.17195366 * T + 0.00045688 * Tsquared - 1.8E-08 * Tcubed);
};

EPO.marsMeanLongitude = function (JD) {
    return Mars.getMeanLongitude(JD);
};

EPO.marsSemimajorAxis = function (UnnamedParameter1) {
    return Mars.orbitalElements.semiMajorAxis[0];
};

EPO.marsEccentricity = function (JD) {
    return Mars.getEccentricity(JD);
};

EPO.marsInclination = function (JD) {
    return Mars.getInclination();
};

EPO.marsLongitudeAscendingNode = function (JD) {
    return Mars.getLongitudeOfAscendingNode(JD);
};

EPO.marsLongitudePerihelion = function (JD) {
    return Mars.getLongitudeOfPerihelion(JD);
};

EPO.jupiterMeanLongitude = function (JD) {
    return Jupiter.getMeanLongitude(JD);
};

EPO.jupiterSemimajorAxis = function (JD) {
    return Jupiter.orbitalElements.semiMajorAxis[0];
};

EPO.jupiterEccentricity = function (JD) {
    return Jupiter.getEccentricity(JD);
};

EPO.jupiterInclination = function (JD) {
    return Jupiter.getInclination(JD);
};

EPO.jupiterLongitudeAscendingNode = function (JD) {
    return Jupiter.getLongitudeOfAscendingNode(JD);
};

EPO.jupiterLongitudePerihelion = function (JD) {
    return Jupiter.getLongitudeOfPerihelion(JD);
};

EPO.saturnMeanLongitude = function (JD) {
    return Saturn.getMeanLongitude(JD);
};

EPO.saturnSemimajorAxis = function (JD) {
    Saturn.orbitalElements.semiMajorAxis[0];
};

EPO.saturnEccentricity = function (JD) {
    return Saturn.getEccentricity(JD);
};

EPO.saturnInclination = function (JD) {
    return Saturn.getInclination(JD);
};

EPO.saturnLongitudeAscendingNode = function (JD) {
    return Saturn.getLongitudeOfAscendingNode(JD);
};

EPO.saturnLongitudePerihelion = function (JD) {
    return Saturn.getLongitudeOfPerihelion(JD);
};

EPO.uranusMeanLongitude = function (JD) {
    return Uranus.getMeanLongitude(JD);
};

EPO.uranusSemimajorAxis = function (JD) {
    var T = (JD - 2451545) / 36525;
    var Tsquared = T * T;
    return 19.218446062 - 3.72E-08 * T + 9.8E-10 * Tsquared;
};

EPO.uranusEccentricity = function (JD) {
    return Uranus.getEccentricity(JD);
};

EPO.uranusInclination = function (JD) {
    return Uranus.getInclination(JD);
};

EPO.uranusLongitudeAscendingNode = function (JD) {
    return Uranus.getLongitudeOfAscendingNode(JD);
};

EPO.uranusLongitudePerihelion = function (JD) {
    return Uranus.getLongitudeOfPerihelion(JD);
};

EPO.neptuneMeanLongitude = function (JD) {
    return Neptune.getMeanLongitude(JD);
};

EPO.neptuneSemimajorAxis = function (JD) {
    var T = (JD - 2451545) / 36525;
    var Tsquared = T * T;
    return 30.110386869 - 1.663E-07 * T + 6.9E-10 * Tsquared;
};

EPO.neptuneEccentricity = function (JD) {
    return Neptune.getEccentricity(JD);
};

EPO.neptuneInclination = function (JD) {
    return Neptune.getInclination(JD);
};

EPO.neptuneLongitudeAscendingNode = function (JD) {
    return Neptune.getLongitudeOfAscendingNode(JD);
};

EPO.neptuneLongitudePerihelion = function (JD) {
    return Neptune.getLongitudeOfPerihelion(JD);
};

EPO.mercuryMeanLongitudeJ2000 = function (JD) {
    return Mercury.getMeanLongitude(JD, Equinox.StandardJ2000);
};

EPO.mercuryInclinationJ2000 = function (JD) {
    return Mercury.getInclination(JD, Equinox.StandardJ2000);
};

EPO.mercuryLongitudeAscendingNodeJ2000 = function (JD) {
    return Mercury.getLongitudeOfAscendingNode(JD, Equinox.StandardJ2000);
};

EPO.mercuryLongitudePerihelionJ2000 = function (JD) {
    return Mercury.getLongitudeOfPerihelion(JD, Equinox.StandardJ2000);
};

EPO.venusMeanLongitudeJ2000 = function (JD) {
    return Venus.getMeanLongitude(JD, Equinox.StandardJ2000);
};

EPO.venusInclinationJ2000 = function (JD) {
    return Venus.getInclination(JD, Equinox.StandardJ2000);
};

EPO.venusLongitudeAscendingNodeJ2000 = function (JD) {
    return Venus.getLongitudeOfAscendingNode(JD, Equinox.StandardJ2000);
};

EPO.venusLongitudePerihelionJ2000 = function (JD) {
    return Venus.getLongitudeOfPerihelion(JD, Equinox.StandardJ2000);
};

EPO.earthMeanLongitudeJ2000 = function (JD) {
    var T = (JD - 2451545) / 36525;
    var Tsquared = T * T;
    var Tcubed = Tsquared * T;
    return CT.m360(100.466457 + 35999.3728565 * T - 5.68E-06 * Tsquared - 1E-09 * Tcubed);
};

EPO.earthInclinationJ2000 = function (JD) {
    var T = (JD - 2451545) / 36525;
    var Tsquared = T * T;
    var Tcubed = Tsquared * T;
    return 0.0130548 * T - 9.31E-06 * Tsquared - 3.4E-08 * Tcubed;
};

EPO.earthLongitudeAscendingNodeJ2000 = function (JD) {
    var T = (JD - 2451545) / 36525;
    var Tsquared = T * T;
    var Tcubed = Tsquared * T;
    return CT.m360(174.873176 - 0.241098 * T + 4.262E-05 * Tsquared + 1E-09 * Tcubed);
};

EPO.earthLongitudePerihelionJ2000 = function (JD) {
    var T = (JD - 2451545) / 36525;
    var Tsquared = T * T;
    var Tcubed = Tsquared * T;
    return CT.m360(102.937348 + 0.3225654 * T + 0.00014799 * Tsquared - 3.9E-08 * Tcubed);
};

EPO.marsMeanLongitudeJ2000 = function (JD) {
    return Mars.getMeanLongitude(JD, Equinox.StandardJ2000);
};

EPO.marsInclinationJ2000 = function (JD) {
    return Mars.getInclination(JD, Equinox.StandardJ2000);
};

EPO.marsLongitudeAscendingNodeJ2000 = function (JD) {
    return Mars.getLongitudeOfAscendingNode(JD, Equinox.StandardJ2000);
};

EPO.marsLongitudePerihelionJ2000 = function (JD) {
    return Mars.getLongitudeOfPerihelion(JD, Equinox.StandardJ2000);
};

EPO.jupiterMeanLongitudeJ2000 = function (JD) {
    return Jupiter.getMeanLongitude(JD, Equinox.StandardJ2000);
};

EPO.jupiterInclinationJ2000 = function (JD) {
    return Jupiter.getInclination(JD, Equinox.StandardJ2000);
};

EPO.jupiterLongitudeAscendingNodeJ2000 = function (JD) {
    return Jupiter.getLongitudeOfAscendingNode(JD, Equinox.StandardJ2000);
};

EPO.jupiterLongitudePerihelionJ2000 = function (JD) {
    return Jupiter.getLongitudeOfPerihelion(JD, Equinox.StandardJ2000);
};

EPO.saturnMeanLongitudeJ2000 = function (JD) {
    return Saturn.getMeanLongitude(JD, Equinox.StandardJ2000);
};

EPO.saturnInclinationJ2000 = function (JD) {
    return Saturn.getInclination(JD, Equinox.StandardJ2000);
};

EPO.saturnLongitudeAscendingNodeJ2000 = function (JD) {
    return Saturn.getLongitudeOfAscendingNode(JD, Equinox.StandardJ2000);
};

EPO.saturnLongitudePerihelionJ2000 = function (JD) {
    return Saturn.getLongitudeOfPerihelion(JD, Equinox.StandardJ2000);
};

EPO.uranusMeanLongitudeJ2000 = function (JD) {
    return Uranus.getMeanLongitude(JD, Equinox.StandardJ2000);
};

EPO.uranusInclinationJ2000 = function (JD) {
    return Uranus.getInclination(JD, Equinox.StandardJ2000);
};

EPO.uranusLongitudeAscendingNodeJ2000 = function (JD) {
    return Uranus.getLongitudeOfAscendingNode(JD, Equinox.StandardJ2000);
};

EPO.uranusLongitudePerihelionJ2000 = function (JD) {
    return Uranus.getLongitudeOfPerihelion(JD, Equinox.StandardJ2000);
};

EPO.neptuneMeanLongitudeJ2000 = function (JD) {
    return Neptune.getMeanLongitude(JD, Equinox.StandardJ2000);
};

EPO.neptuneInclinationJ2000 = function (JD) {
    return Neptune.getInclination(JD, Equinox.StandardJ2000);
};

EPO.neptuneLongitudeAscendingNodeJ2000 = function (JD) {
    return Neptune.getLongitudeOfAscendingNode(JD, Equinox.StandardJ2000);
};

EPO.neptuneLongitudePerihelionJ2000 = function (JD) {
    return Neptune.getLongitudeOfPerihelion(JD, Equinox.StandardJ2000);
};

var EPO$ = {};

registerType("EPO", [EPO, EPO$, null]);
