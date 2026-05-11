// Originally `AANUTATION.CPP`
// "Purpose: Implementation for the algorithms for Nutation"
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
import { C3D, CT } from "./coordinate_transformation.js";
import { CAAEarth } from "./earth.js";

import { Earth } from "aa-js";


// NUC - was NutationCoefficient

export function NUC(D, M, Mprime, F, omega, sincoeff1, sincoeff2, coscoeff1, coscoeff2) {
    this.d = 0;
    this.m = 0;
    this.mprime = 0;
    this.f = 0;
    this.omega = 0;
    this.sincoeff1 = 0;
    this.sincoeff2 = 0;
    this.coscoeff1 = 0;
    this.coscoeff2 = 0;
    this.d = D;
    this.m = M;
    this.mprime = Mprime;
    this.f = F;
    this.omega = omega;
    this.sincoeff1 = sincoeff1;
    this.sincoeff2 = sincoeff2;
    this.coscoeff1 = coscoeff1;
    this.coscoeff2 = coscoeff2;
}

var NUC$ = {};

registerType("NUC", [NUC, NUC$, null]);

// CAANutation

export function CAANutation() { }

CAANutation.nutationInLongitude = function (JD) {
    return Earth.getNutationInLongitude(JD);
};

CAANutation.nutationInObliquity = function (JD) {
    return Earth.getNutationInObliquity(JD);
};

CAANutation.nutationInRightAscension = function (Alpha, Delta, Obliquity, NutationInLongitude, NutationInObliquity) {
    Alpha = CT.h2R(Alpha);
    Delta = CT.d2R(Delta);
    Obliquity = CT.d2R(Obliquity);
    return (Math.cos(Obliquity) + Math.sin(Obliquity) * Math.sin(Alpha) * Math.tan(Delta)) * NutationInLongitude - Math.cos(Alpha) * Math.tan(Delta) * NutationInObliquity;
};

CAANutation.nutationInDeclination = function (Alpha, Delta, Obliquity, NutationInLongitude, NutationInObliquity) {
    Alpha = CT.h2R(Alpha);
    Delta = CT.d2R(Delta);
    Obliquity = CT.d2R(Obliquity);
    return Math.sin(Obliquity) * Math.cos(Alpha) * NutationInLongitude + Math.sin(Alpha) * NutationInObliquity;
};

CAANutation.meanObliquityOfEcliptic = function (JD) {
    return Earth.getMeanObliquityOfEcliptic(JD);
};

CAANutation.trueObliquityOfEcliptic = function (JD) {
    return Earth.getTrueObliquityOfEcliptic(JD);
};

var CAANutation$ = {};

registerType("CAANutation", [CAANutation, CAANutation$, null]);
