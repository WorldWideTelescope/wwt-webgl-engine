// Copyright 2020 the .NET Foundation
// Licensed under the MIT License

import { R2D, R2H } from "@wwtelescope/astro";

import {
  ConstellationFilter,
  WWTBooleanSetting,
  WWTColor,
  WWTColorSetting,
  WWTConstellationFilterSetting,
  WWTNumberSetting,
  WWTSetting,
  WWTStringSetting,
} from "@wwtelescope/engine-types";

import {
  ScriptInterface,
  SpaceTimeControllerObject,
  WWTControl,
  SpaceTimeController
} from "@wwtelescope/engine";


export const enum InitControlViewType {
  Sky = "Sky",
  Earth = "earth",
};

/** Options for the [[WWTInstance]] constructor. */
export interface InitControlSettings {
  /** The identifier of the DOM element to which to attach the control. If
   * unspecified, defaults to `"wwt"`. */
  elId?: string;

  /** Whether to immediately launch the WWT engine's internal rendering loop. If
   * unspecified, defaults to `false`. */
  startInternalRenderLoop?: boolean;

  /** The starting latitude (or declination) of the WWT view, in degrees. */
  startLatDeg?: number;

  /** The starting longitude (or right ascension) of the WWT view, in degrees. */
  startLngDeg?: number;

  /** The starting zoom level of the WWT view, in degrees. */
  startZoomDeg?: number;

  /** The starting mode of the WWT view. */
  startMode?: InitControlViewType;
};

const initControlDefaults: InitControlSettings = {
  elId: "wwt",
  startInternalRenderLoop: false,
  startLatDeg: 0,
  startLngDeg: 0,
  startZoomDeg: 360,
  startMode: InitControlViewType.Sky,
};

interface ResolveFunction<T> {
  (value?: T): void;
}

interface RejectFunction {
  (reason?: any): void;
}

class SavedPromise<T> {
  readonly seqnum: number;
  readonly resolve: ResolveFunction<T>;
  readonly reject: RejectFunction;

  constructor(seqnum: number, resolve: ResolveFunction<T>, reject: RejectFunction) {
    this.seqnum = seqnum;
    this.resolve = resolve;
    this.reject = reject;
  }
}

export class WWTInstance {
  readonly ctl: WWTControl;
  readonly si: ScriptInterface;
  readonly stc: SpaceTimeControllerObject;

  /** Create a WWT control, attaching it to a DOM element.
   *
   * @param options Options to apply to the control.
   *
   * Compared to the underlying library, this class provides a more JavaScript-y
   * API.
   */
  constructor(
    options: InitControlSettings = {}
  ) {
    const o = { ...initControlDefaults, ...options };

    // We pretend that these objects aren't all singletons. One day.
    this.si = WWTControl.initControl6(
      o.elId as string,
      o.startInternalRenderLoop as boolean,
      o.startLatDeg as number,
      o.startLngDeg as number,
      o.startZoomDeg as number,
      o.startMode as InitControlViewType,
    );
    this.ctl = WWTControl.singleton;
    this.stc = SpaceTimeController;

    // Override some defaults
    this.applySetting([WWTBooleanSetting.showConstellationBoundries, false]);
    this.applySetting([WWTBooleanSetting.showConstellationFigures, false]);
    this.applySetting([WWTBooleanSetting.showConstellationSelection, false]);
    this.applySetting([WWTBooleanSetting.showCrosshairs, false]);

    // Ready promise initialization:
    this.si.add_ready((si) => {
      for (let p of this.ready_promises) {
        p.resolve();
      }

      this.ready_fired = true;
      this.ready_promises = [];
    });

    // Arrival promise initialization:
    this.si.add_arrived((si, args) => {
      for (let p of this.arrive_promises) {
        if (p.seqnum < this.arrive_seqnum) {
          p.reject("superseded");
        } else {
          p.resolve();
        }
      }

      this.arrive_promises = [];
    });
  }

  // Ready promises

  private ready_promises: SavedPromise<void>[] = [];
  private ready_fired: boolean = false;

  async waitForReady(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ready_fired) {
        resolve();
      } else {
        this.ready_promises.push(new SavedPromise(0, resolve, reject));
      }
    });
  }

  // Arrival promises

  private arrive_promises: SavedPromise<void>[] = [];
  private arrive_seqnum: number = 0;

  private makeArrivePromise(instant_resolve: boolean): Promise<void> {
    this.arrive_seqnum += 1;
    let seq = this.arrive_seqnum;

    for (let p of this.arrive_promises) {
      p.reject("superseded");
    }

    this.arrive_promises = [];

    return new Promise((resolve, reject) => {
      if (this.arrive_seqnum > seq) {
        reject("superseded");
      } else if (instant_resolve) {
        resolve();
      } else {
        this.arrive_promises.push(new SavedPromise(seq, resolve, reject));
      }
    });
  }

  async gotoRADecZoom(ra_rad: number, dec_rad: number, zoom_deg: number, instant: boolean) {
    this.ctl.gotoRADecZoom(
      ra_rad * R2H,
      dec_rad * R2D,
      zoom_deg,
      instant
    );
    return this.makeArrivePromise(instant);
  }

  // "Mutator" type operations -- not async.

  applySetting(setting: WWTSetting) {
    let value: any = setting[1];
    let sname: string;

    if (typeof value === "boolean") {
      sname = WWTBooleanSetting[setting[0]];
    } else if (typeof value === "number") {
      sname = WWTNumberSetting[setting[0]];
    } else if (typeof value === "string") {
      sname = WWTStringSetting[setting[0]];
    } else if (value instanceof WWTColor) {
      sname = WWTColorSetting[setting[0]];
    } else if (value instanceof ConstellationFilter) {
      sname = WWTConstellationFilterSetting[setting[0]];
    } else {
      throw new Error("can't happen");
    }

    (this.si.settings as any)["set_" + sname](value);
  }

  setBackgroundImageByName(imagesetName: string) {
    this.ctl.setBackgroundImageByName(imagesetName);
  }

  setForegroundImageByName(imagesetName: string) {
    this.ctl.setForegroundImageByName(imagesetName);
  }
}
