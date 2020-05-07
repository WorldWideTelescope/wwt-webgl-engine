// Copyright 2020 the .NET Foundation
// Licensed under the MIT License

import { WWTSetting, WWTBooleanSetting } from "@pkgw/engine-types";

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
  showCoordinateReadout = false;
  showCrosshairs = false;
  wtmlUrl = "";

  static fromQueryParams(qp: IterableIterator<[string, string]>): EmbedSettings {
    const s = new EmbedSettings();

    for (const [key, value] of qp) {
      switch (key) {
        case "bg":
          s.backgroundImagesetName = value;
          break;

        case "ch":
          s.showCrosshairs = true;
          break;

        case "cro":
          s.showCoordinateReadout = true;
          break;

        case "cred":
          {
            const m = enumLookup(CreditMode, value);
            if (m !== undefined)
              s.creditMode = m;
          }
          break;

        case "fg":
          s.foregroundImagesetName = value;
          break;

        case "planet":
          if (value == "mars") {
            // Gnarly historical thing that the default Mars imageset
            // is named thusly:
            s.backgroundImagesetName = "Visible Imagery";
            s.foregroundImagesetName = "Visible Imagery";
          } else if (value == "earth") {
            s.backgroundImagesetName = "Bing Maps Aerial";
            s.foregroundImagesetName = "Bing Maps Aerial";
          } else {
            s.backgroundImagesetName = value;
            s.foregroundImagesetName = value;
          }
          break;

        case "threed":
          s.backgroundImagesetName = "3D Solar System View";
          s.foregroundImagesetName = "";
          break;

        case "wtml":
          s.wtmlUrl = value;
          break;
      }
    }

    return s;
  }

  asSettings(): WWTSetting[] {
    const s: WWTSetting[] = [];
    s.push([WWTBooleanSetting.showCrosshairs, this.showCrosshairs]);
    return s;
  }
}

/** A class to help building query strings that get parsed into EmbedSettings
 * objects. There are a few shorthands for setups where the "implementation
 * details" are a bit weird or might change.
 */
export class EmbedQueryStringBuilder {
  s: EmbedSettings = new EmbedSettings();
  threeDMode = false;
  planetaryBody: PlanetaryBodies | null = null;

  toQueryItems(): Array<[string, string]> {
    const result: Array<[string, string]> = [];
    const defaults = new EmbedSettings();

    if (this.threeDMode) {
      result.push(["threed", ""]);
    } else if (this.planetaryBody !== null) {
      result.push(["planet", this.planetaryBody]);
    } else {
      if (this.s.backgroundImagesetName.length && this.s.backgroundImagesetName != defaults.backgroundImagesetName)
        result.push(["bg", this.s.backgroundImagesetName]);
      if (this.s.foregroundImagesetName.length && this.s.foregroundImagesetName != defaults.foregroundImagesetName)
        result.push(["fg", this.s.foregroundImagesetName]);
    }

    if (this.s.creditMode && this.s.creditMode != CreditMode.Default) {
      result.push(["cred", this.s.creditMode]);
    }

    if (this.s.showCoordinateReadout) {
      result.push(["cro", ""]);
    }

    if (this.s.showCrosshairs) {
      result.push(["ch", ""]);
    }

    if (this.s.wtmlUrl.length) {
      result.push(["wtml", this.s.wtmlUrl]);
    }

    return result;
  }
}