// Originally `AAVENUS.CPP`
// "Purpose: Implementation for the algorithms which obtain the heliocentric position of Venus"
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
import { Venus } from "aa-js";

// CAAVenus

export function CAAVenus() { }

CAAVenus.eclipticLongitude = function (JD) {
    return Venus.getEclipticLongitude(JD);
};

CAAVenus.eclipticLatitude = function (JD) {
    return Venus.getEclipticLatitude(JD);
};

CAAVenus.radiusVector = function (JD) {
    return Venus.getRadiusVector(JD);
};

var CAAVenus$ = {};

registerType("CAAVenus", [CAAVenus, CAAVenus$, null]);
