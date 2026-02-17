// Originally `AAEARTH.CPP`
// "Purpose: Implementation for the algorithms which calculate the position of Earth"
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

import { Earth, Equinox } from "aa-js";


// VSC

export function VSC(a, b, c) {
    this.a = 0;
    this.b = 0;
    this.c = 0;
    this.a = a;
    this.b = b;
    this.c = c;
}

var VSC$ = {};

registerType("VSC", [VSC, VSC$, null]);

// CAAEarth

export function CAAEarth() { }

CAAEarth.eclipticLongitude = function (JD) {
    // NB: This AA function can take an optional second `equinox` parameter
    // which can be either MeanOfTheDate (default) or J2000
    return Earth.getEclipticLongitude(JD);
};

CAAEarth.eclipticLatitude = function (JD) {
    // NB: This AA function can take an optional second `equinox` parameter
    // which can be either MeanOfTheDate (default) or J2000
    return Earth.getEclipticLatitude(JD);
};

CAAEarth.radiusVector = function (JD) {
    return Earth.getRadiusVector(JD);
};

CAAEarth.sunMeanAnomaly = function (JD) {
    return Earth.getMeanAnomaly(JD);
};

CAAEarth.eccentricity = function (JD) {
    return Earth.getEccentricity(JD);
};

CAAEarth.eclipticLongitudeJ2000 = function (JD) {
    return Earth.getEclipticLongitude(JD, Equinox.StandardJ2000);
};

CAAEarth.eclipticLatitudeJ2000 = function (JD) {
    return Earth.getEclipticLatitude(JD, Equinox.StandardJ2000);
};

var CAAEarth$ = {};

registerType("CAAEarth", [CAAEarth, CAAEarth$, null]);
