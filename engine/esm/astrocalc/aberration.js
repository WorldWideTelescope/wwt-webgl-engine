// Originally `AAABERRATION.CPP`
// "Purpose: Implementation for the algorithms for Aberration"
// Last update of original: PJN / 21-04-2005
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
import { C3D, COR, CT } from "./coordinate_transformation.js";
import { CAASun } from "./sun.js";

import { Earth } from "aa-js";
import { Vector3d } from "../double3d.js";


// ACFT

export function ACFT(L2, L3, L4, L5, L6, L7, L8, Ldash, D, Mdash, F, xsin, xsint, xcos, xcost, ysin, ysint, ycos, ycost, zsin, zsint, zcos, zcost) {
    this.l2 = 0;
    this.l3 = 0;
    this.l4 = 0;
    this.l5 = 0;
    this.l6 = 0;
    this.l7 = 0;
    this.l8 = 0;
    this.ldash = 0;
    this.d = 0;
    this.mdash = 0;
    this.f = 0;
    this.xsin = 0;
    this.xsint = 0;
    this.xcos = 0;
    this.xcost = 0;
    this.ysin = 0;
    this.ysint = 0;
    this.ycos = 0;
    this.ycost = 0;
    this.zsin = 0;
    this.zsint = 0;
    this.zcos = 0;
    this.zcost = 0;
    this.l2 = L2;
    this.l3 = L3;
    this.l4 = L4;
    this.l5 = L5;
    this.l6 = L6;
    this.l7 = L7;
    this.l8 = L8;
    this.ldash = Ldash;
    this.d = D;
    this.mdash = Mdash;
    this.f = F;
    this.xsin = xsin;
    this.xsint = xsint;
    this.xcos = xcos;
    this.xcost = xcost;
    this.ysin = ysin;
    this.ysint = ysint;
    this.ycos = ycos;
    this.ycost = ycost;
    this.zsin = zsin;
    this.zsint = zsint;
    this.zcos = zcos;
    this.zcost = zcost;
}

var ACFT$ = {};

registerType("ACFT", [ACFT, ACFT$, null]);


// Coefficients

const g_ACft = [new ACFT(0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1719914, -2, -25, 0, 25, -13, 1578089, 156, 10, 32, 684185, -358), new ACFT(0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6434, 141, 28007, -107, 25697, -95, -5904, -130, 11141, -48, -2559, -55), new ACFT(0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 715, 0, 0, 0, 6, 0, -657, 0, -15, 0, -282, 0), new ACFT(0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 715, 0, 0, 0, 0, 0, -656, 0, 0, 0, -285, 0), new ACFT(0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 486, -5, -236, -4, -216, -4, -446, 5, -94, 0, -193, 0), new ACFT(0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 159, 0, 0, 0, 2, 0, -147, 0, -6, 0, -61, 0), new ACFT(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 26, 0, 0, 0, -59, 0), new ACFT(0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 39, 0, 0, 0, 0, 0, -36, 0, 0, 0, -16, 0), new ACFT(0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 33, 0, -10, 0, -9, 0, -30, 0, -5, 0, -13, 0), new ACFT(0, 2, 0, -1, 0, 0, 0, 0, 0, 0, 0, 31, 0, 1, 0, 1, 0, -28, 0, 0, 0, -12, 0), new ACFT(0, 3, -8, 3, 0, 0, 0, 0, 0, 0, 0, 8, 0, -28, 0, 25, 0, 8, 0, 11, 0, 3, 0), new ACFT(0, 5, -8, 3, 0, 0, 0, 0, 0, 0, 0, 8, 0, -28, 0, -25, 0, -8, 0, -11, 0, -3, 0), new ACFT(2, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, -19, 0, 0, 0, -8, 0), new ACFT(1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -19, 0, 0, 0, 0, 0, 17, 0, 0, 0, 8, 0), new ACFT(0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, -16, 0, 0, 0, -7, 0), new ACFT(0, 1, 0, -2, 0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 15, 0, 1, 0, 7, 0), new ACFT(0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 16, 0, 0, 0, 1, 0, -15, 0, -3, 0, -6, 0), new ACFT(0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 11, 0, -1, 0, -1, 0, -10, 0, -1, 0, -5, 0), new ACFT(2, -2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -11, 0, -10, 0, 0, 0, -4, 0, 0, 0), new ACFT(0, 1, 0, -1, 0, 0, 0, 0, 0, 0, 0, -11, 0, -2, 0, -2, 0, 9, 0, -1, 0, 4, 0), new ACFT(0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, -7, 0, -8, 0, -8, 0, 6, 0, -3, 0, 3, 0), new ACFT(0, 3, 0, -2, 0, 0, 0, 0, 0, 0, 0, -10, 0, 0, 0, 0, 0, 9, 0, 0, 0, 4, 0), new ACFT(1, -2, 0, 0, 0, 0, 0, 0, 0, 0, 0, -9, 0, 0, 0, 0, 0, -9, 0, 0, 0, -4, 0), new ACFT(2, -3, 0, 0, 0, 0, 0, 0, 0, 0, 0, -9, 0, 0, 0, 0, 0, -8, 0, 0, 0, -4, 0), new ACFT(0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, -9, 0, -8, 0, 0, 0, -3, 0, 0, 0), new ACFT(2, -4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -9, 0, 8, 0, 0, 0, 3, 0, 0, 0), new ACFT(0, 3, -2, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, -8, 0, 0, 0, -3, 0), new ACFT(0, 0, 0, 0, 0, 0, 0, 1, 2, -1, 0, 8, 0, 0, 0, 0, 0, -7, 0, 0, 0, -3, 0), new ACFT(8, -12, 0, 0, 0, 0, 0, 0, 0, 0, 0, -4, 0, -7, 0, -6, 0, 4, 0, -3, 0, 2, 0), new ACFT(8, -14, 0, 0, 0, 0, 0, 0, 0, 0, 0, -4, 0, -7, 0, 6, 0, -4, 0, 3, 0, -2, 0), new ACFT(0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, -6, 0, -5, 0, -4, 0, 5, 0, -2, 0, 2, 0), new ACFT(3, -4, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, -1, 0, -2, 0, -7, 0, 1, 0, -4, 0), new ACFT(0, 2, 0, -2, 0, 0, 0, 0, 0, 0, 0, 4, 0, -6, 0, -5, 0, -4, 0, -2, 0, -2, 0), new ACFT(3, -3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -7, 0, -6, 0, 0, 0, -3, 0, 0, 0), new ACFT(0, 2, -2, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, -5, 0, -4, 0, -5, 0, -2, 0, -2, 0), new ACFT(0, 0, 0, 0, 0, 0, 0, 1, -2, 0, 0, 5, 0, 0, 0, 0, 0, -5, 0, 0, 0, -2, 0)];


// ABR - was CAAAberration

export function ABR() { }

ABR.earthVelocity = function (JD) {
  const earthVelocity = Earth.getEarthVelocity(JD);
  return Vector3d.create(earthVelocity.X, earthVelocity.Y, earthVelocity.Z);
};

ABR.eclipticAberration = function (Lambda, Beta, JD) {
    const eclipticCoords = { longitude: Lambda, latitude: Beta };
    const abr = Earth.getAnnualEclipticAberration(JD, eclipticCoords);
    const aberration = new COR();
    aberration.x = abr.DeltaLongitude;
    aberration.y = abr.DeltaLatitude;
    return aberration;
};

ABR.equatorialAberration = function (Alpha, Delta, JD) {
    const equatorialCoords = { rightAscension: Alpha, declination: Delta };
    const abr = Earth.getAnnualEquatorialAberration(JD, equatorialCoords);
    var aberration = new COR();
    aberration.x = abr.DeltaRightAscension;
    aberration.y = abr.DeltaDeclination;
    return aberration;
};

var ABR$ = {};

registerType("ABR", [ABR, ABR$, null]);
