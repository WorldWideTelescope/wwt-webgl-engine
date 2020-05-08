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
  Folder,
  ScriptInterface,
  SpaceTimeControllerObject,
  Wtml,
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

class SavedPromise<P, T> {
  readonly payload: P;
  readonly resolve: ResolveFunction<T>;
  readonly reject: RejectFunction;

  constructor(payload: P, resolve: ResolveFunction<T>, reject: RejectFunction) {
    this.payload = payload;
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
        if (p.payload < this.arriveSeqnum) {
          p.reject("superseded");
        } else {
          p.resolve();
        }
      }

      this.arrivePromises = [];
    });
  }

  // Ready promises

  private readyPromises: SavedPromise<null, void>[] = [];
  private readyFired = false;

  async waitForReady(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.readyFired) {
        resolve();
      } else {
        this.readyPromises.push(new SavedPromise(null, resolve, reject));
      }
    });
  }

  // Arrival promises

  private arrivePromises: SavedPromise<number, void>[] = [];
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

  // Collection-loaded promises. To simplify the handling, we never load the
  // same URL more than once. Otherwise, all of the timing issues about multiple
  // requests for the same URL get gnarly to handle. And as far as the engine is
  // concerned, collection loads are idempotent.

  private collectionLoadedPromises: SavedPromise<string, Folder>[] = [];
  private collectionRequests: Map<string, Folder | null> = new Map();

   /** Load a WTML collection and the imagesets that it contains.
   *
   * This function triggers a download of the specified URL, which should return
   * an XML document in the [WTML collection][wtml] format. Any `ImageSet`
   * entries in the collection, or `Place` entries containing image sets, will
   * be added to the WWT instance’s list of available imagery. Subsequent calls
   * to functions like [[setForegroundImageByName]] will be able to locate the
   * new imagesets and display them to the user.
   *
   * Each unique URL is only requested once. Once a given URL has been
   * successfully loaded, the promise returned by additional calls will resolve
   * immediately. URL uniqueness is tested with simple string equality, so if
   * you really want to load the same URL more than once you could add a
   * fragment specifier.
   *
   * If the URL is not accessible due to CORS restrictions, the request will
   * automatically be routed through the WWT’s CORS proxying service.
   *
   * [wtml]: https://docs.worldwidetelescope.org/data-guide/1/data-file-formats/collections/
   *
   * @param url: The URL of the WTML collection file to load.
   * @returns: A promise that resolves to an initialized [[Folder]] object.
   */
  async loadImageCollection(url: string): Promise<Folder> {
    const curState = this.collectionRequests.get(url);

    // If we've already loaded the folder, insta-resolve to it.
    if (curState !== undefined && curState !== null) {
      return Promise.resolve(curState);
    }

    // If we haven't even issued the request, do so.
    if (curState === undefined) {
      // Mark this URL as having an in-flight request.
      this.collectionRequests.set(url, null);

      // We need some internal mutability here to allow the getWtmlFile callback
      // to find the Folder variable, which we only get as a return value from
      // the function.
      const holder: { f: Folder | null } = { f: null };

      holder.f = Wtml.getWtmlFile(url, () => {
        // The folder at this URL is now fully loaded.
        const f = holder.f as Folder;
        this.collectionRequests.set(url, f);

        this.collectionLoadedPromises = this.collectionLoadedPromises.filter((p) => {
          if (p.payload == url) {
            p.resolve(f);
            return false;
          }

          // Don't filter out promises for other URLs.
          return true;
        });
      });
    }

    return new Promise((resolve, reject) => {
      const curState = this.collectionRequests.get(url);

      // By the time this promise callback is called, maybe the Folder has fully
      // loaded?
      if (curState !== undefined && curState !== null) {
        resolve(curState);
      } else {
        // If not, queue ourselves up to be resolved when the data finally come
        // through.
        this.collectionLoadedPromises.push(new SavedPromise(url, resolve, reject));
      }
    });
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
