// Copyright 2020 the .NET Foundation
// Licensed under the MIT License

import { WWTSetting } from "@pkgw/engine-types";

// TypeScript magic to allow fallible reverse mapping of string-valued enums.
// https://stackoverflow.com/q/57922745/3760486
type StringEnum = {[key: string]: string};

function keysOf<K extends {}>(o: K): (keyof K)[];
function keysOf(o: any) { return Object.keys(o); }  // eslint-disable-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any

function enumLookup<E extends StringEnum>(
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

export enum PlanetaryBodies {
  Sun = "sun",
  Mercury = "mercury",
  Venus = "venus",
  Earth = "earth",
  Mars = "mars",
  Jupiter = "jupiter",
  Saturn = "saturn",
  Uranus = "uranus",
  Neptune = "neptune",
  Pluto = "pluto",
  Moon = "moon",
  Io = "io",
  Europa = "europa",
  Ganymede = "ganymede",
  Callisto = "callisto",
}

export enum CreditMode {
  Default = "default",
  None = "no"
}

export class EmbedSettings {
  backgroundImagesetName = "Digitized Sky Survey (Color)";
  foregroundImagesetName = "";
  creditMode = CreditMode.Default;
  wwtSettings: WWTSetting[] = [];

  constructor(options: EmbedOptions) {
    Object.assign(this, options);
  }

  static fromQueryString(qs: string): EmbedSettings {
    const queryParams = new URLSearchParams(qs);
    const o: EmbedOptions = {};

    // seeming bug that `for (let x of queryParams) {}` doesn't work in TypeScript
    queryParams.forEach((value, key) => {
      switch (key) {
        case "bg":
          o.backgroundImagesetName = value;
          break;

        case "fg":
          o.foregroundImagesetName = value;
          break;

        case "cred":
          o.creditMode = enumLookup(CreditMode, value);
          break;

        case "planet":
          if (value == "mars") {
            // Gnarly historical thing that the default Mars imageset
            // is named thusly:
            o.backgroundImagesetName = "Visible Imagery";
            o.foregroundImagesetName = "Visible Imagery";
          } else if (value == "earth") {
            o.backgroundImagesetName = "Bing Maps Aerial";
            o.foregroundImagesetName = "Bing Maps Aerial";
          } else {
            o.backgroundImagesetName = value;
            o.foregroundImagesetName = value;
          }
          break;

        case "threed":
          o.backgroundImagesetName = "3D Solar System View";
          o.foregroundImagesetName = "";
          break;
      }
    });

    return new EmbedSettings(o);
  }
}

/** This has the same fields as [[EmbedSettings]], but they are all optional. */
export type EmbedOptions = Partial<EmbedSettings>;

/** A class to help building query strings that get parsed into EmbedSettings
 * objects. There are a few shorthands for setups where the "implementation
 * details" are a bit weird or might change.
 */
export class EmbedQueryStringBuilder {
  o: EmbedOptions = {};
  threeDMode = false;
  planetaryBody: PlanetaryBodies | null = null;

  constructor() {
    // Get the associated checkbox to appear checked at startup:
    this.o.creditMode = CreditMode.Default;
  }

  toQueryItems(): Array<[string, string]> {
    const result: Array<[string, string]> = [];

    if (this.threeDMode) {
      result.push(["threed", ""]);
    } else if (this.planetaryBody !== null) {
      result.push(["planet", this.planetaryBody]);
    } else {
      if (this.o.backgroundImagesetName !== undefined && this.o.backgroundImagesetName.length)
        result.push(["bg", this.o.backgroundImagesetName]);
      if (this.o.foregroundImagesetName !== undefined && this.o.foregroundImagesetName.length)
        result.push(["fg", this.o.foregroundImagesetName]);
    }

    if (this.o.creditMode && this.o.creditMode != CreditMode.Default) {
      result.push(["cred", this.o.creditMode]);
    }

    return result;
  }

  /** Compile these settings to an embed query string.
   *
   * If it is not empty, the returned query string begins with a question mark.
   *
   * @returns A query string such as `"?bg=foo&fg=bar"`.
   */
  toQueryString(): string {
    const qs = new URLSearchParams(this.toQueryItems()).toString();
    if (qs.length)
      return "?" + qs;
    return "";
  }
}