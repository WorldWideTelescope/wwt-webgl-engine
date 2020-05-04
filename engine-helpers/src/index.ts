// Copyright 2020 the .NET Foundation
// Licensed under the MIT License

import { R2D, R2H } from "@pkgw/astro";

import {
  WWTBooleanSetting,
  WWTColor,
  WWTColorSetting,
  WWTConstellationFilterSetting,
  WWTNumberSetting,
  WWTSetting,
  WWTStringSetting,
} from "@pkgw/engine-types";

import {
  ConstellationFilter,
  ScriptInterface,
  SpaceTimeControllerObject,
  WWTControl,
  SpaceTimeController
} from "@pkgw/engine";


export const enum InitControlViewType {
  Sky = "Sky",
  Earth = "earth",
}

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
}

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
  (reason?: any): void;  // eslint-disable-line @typescript-eslint/no-explicit-any
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
    this.si.add_ready((_si) => {
      for (const p of this.readyPromises) {
        p.resolve();
      }

      this.readyFired = true;
      this.readyPromises = [];
    });

    // Arrival promise initialization:
    this.si.add_arrived((_si, _args) => {
      for (const p of this.arrivePromises) {
        if (p.seqnum < this.arriveSeqnum) {
          p.reject("superseded");
        } else {
          p.resolve();
        }
      }

      this.arrivePromises = [];
    });
  }

  // Ready promises

  private readyPromises: SavedPromise<void>[] = [];
  private readyFired = false;

  async waitForReady(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.readyFired) {
        resolve();
      } else {
        this.readyPromises.push(new SavedPromise(0, resolve, reject));
      }
    });
  }

  // Arrival promises

  private arrivePromises: SavedPromise<void>[] = [];
  private arriveSeqnum = 0;

  private makeArrivePromise(instantResolve: boolean): Promise<void> {
    this.arriveSeqnum += 1;
    const seq = this.arriveSeqnum;

    for (const p of this.arrivePromises) {
      p.reject("superseded");
    }

    this.arrivePromises = [];

    return new Promise((resolve, reject) => {
      if (this.arriveSeqnum > seq) {
        reject("superseded");
      } else if (instantResolve) {
        resolve();
      } else {
        this.arrivePromises.push(new SavedPromise(seq, resolve, reject));
      }
    });
  }

  async gotoRADecZoom(raRad: number, decRad: number, zoomDeg: number, instant: boolean): Promise<void> {
    this.ctl.gotoRADecZoom(
      raRad * R2H,
      decRad * R2D,
      zoomDeg,
      instant
    );
    return this.makeArrivePromise(instant);
  }

  // "Mutator" type operations -- not async.

  applySetting(setting: WWTSetting): void {
    const value: any = setting[1];  // eslint-disable-line @typescript-eslint/no-explicit-any
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

    (this.si.settings as any)["set_" + sname](value);  // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  setBackgroundImageByName(imagesetName: string): void {
    this.ctl.setBackgroundImageByName(imagesetName);
  }

  setForegroundImageByName(imagesetName: string): void {
    this.ctl.setForegroundImageByName(imagesetName);
  }
}
