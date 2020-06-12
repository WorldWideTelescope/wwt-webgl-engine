// Copyright 2020 the .NET Foundation
// Licensed under the MIT License

import Vue from "vue";
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';

import { D2R, H2R } from "@wwtelescope/astro";
import { ImageSetType, WWTSetting } from "@wwtelescope/engine-types";
import { Folder, Imageset } from "@wwtelescope/engine";
import { GotoTargetOptions, SetupForImagesetOptions, WWTInstance } from "@wwtelescope/engine-helpers";

interface WWTLinkedCallback {
  (): void;
}

export class WWTGlobalState {
  inst: WWTInstance | null = null;
  onLinkedCallbacks: WWTLinkedCallback[] = [];

  link(inst: WWTInstance): void {
    if (this.inst !== null)
      throw new Error("must unlink WWT Vuex global state before relinking");

    this.inst = inst;

    for (const cb of this.onLinkedCallbacks) {
      cb();
    }

    this.onLinkedCallbacks = [];
  }

  unlink(): void {
    this.inst = null;
  }
}

/** This interface expresses the properties exposed by the WWT Engine’s
 * Vuex store module.
 */
export interface WWTEngineVuexState {
  /** The current imageset acting as the background imagery, if defined. */
  backgroundImageset: Imageset | null;

  /** The current WWT clock time of the view, as a UTC Date. */
  currentTime: Date;

  /** The current right ascension of the view, in radians.
   *
   * TODO: define this properly for planetary lat/lng views!
   */
  raRad: number;

  /** The current declination of the view, in radians.
   *
   * TODO: define this properly for planetary lat/lng views!
   */
  decRad: number;

  /** The current imageset acting as the foreground imagery, if defined. */
  foregroundImageset: Imageset | null;

  /** The opacity with which the foreground imageset is rendered; valid
   * values are between 0 and 100 (inclusive).
   */
  foregroundOpacity: number;

  /** Whether the tour playback mode is active.
   *
   * Specifically, this is true if the `WWTControl` has a `uiController` item
   * that is a `TourPlayer` item.
   */
  isTourPlayerActive: boolean;

  /** The current mode of the renderer */
  renderType: ImageSetType;
}

/** The parameters for the [[WWTEngineVuexModule.gotoRADecZoom]] action. */
export interface GotoRADecZoomParams {
  /** The right ascension to go to, in radians. */
  raRad: number;

  /** The declination to go to, in radians. */
  decRad: number;

  /** The zoom level to go to, in *degrees*. This is the final angular height of
   * the WWT viewport. */
  zoomDeg: number;

  /** Whether the view should navigate instantly or pan smoothly.
   *
   * Smooth panning is generally preferable from a UX perspective because it
   * gives the engine time to download any data files that it may need to render
   * the view.
   */
  instant: boolean;
}

/** The parameters for the [[WWTEngineVuexModule.loadAndPlayTour]] action. */
export interface LoadAndPlayTourParams {
  /** The tour URL to load. */
  url: string;
}

/** The parameters for the [[WWTEngineVuexModule.loadImageCollection]] action. */
export interface LoadImageCollectionParams {
  /** The WTML URL to load. */
  url: string;
}

@Module({
  namespaced: true,
  stateFactory: true,
})
export class WWTEngineVuexModule extends VuexModule implements WWTEngineVuexState {
  raRad = 0.0;
  decRad = 0.0;
  backgroundImageset: Imageset | null = null;
  currentTime = new Date();
  foregroundImageset: Imageset | null = null;
  foregroundOpacity = 100;
  isTourPlayerActive = false;
  renderType = ImageSetType.sky;

  get lookupImageset() {
    // This is how you create a parametrized getter in vuex-module-decorators:
    return function (imagesetName: string): Imageset | null {
      if (Vue.$wwt.inst === null)
        throw new Error('cannot lookupImageset without linking to WWTInstance');
      return Vue.$wwt.inst.ctl.getImagesetByName(imagesetName);
    }
  }

  @Mutation
  internalLinkToInstance(wwt: WWTInstance): void {
    Vue.$wwt.link(wwt);
  }

  @Mutation
  internalUnlinkFromInstance(): void {
    Vue.$wwt.unlink();
  }

  @Mutation
  internalUpdate(): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot internalUpdate without linking to WWTInstance');

    const wwt = Vue.$wwt.inst;

    const raRad = wwt.si.getRA() * H2R;
    if (this.raRad != raRad)
      this.raRad = raRad;

    const decRad = wwt.si.getDec() * D2R;
    if (this.decRad != decRad)
      this.decRad = decRad;

    const bg = wwt.ctl.renderContext.get_backgroundImageset() || null; // TEMP
    if (this.backgroundImageset != bg)
      this.backgroundImageset = bg;

    const time = wwt.stc.get_now();
    if (this.currentTime != time)
      this.currentTime = time;

    const fg = wwt.ctl.renderContext.get_foregroundImageset() || null; // TEMP
    if (this.foregroundImageset != fg)
      this.foregroundImageset = fg;

    if (this.foregroundOpacity != wwt.ctl.renderContext.viewCamera.opacity)
      this.foregroundOpacity = wwt.ctl.renderContext.viewCamera.opacity;

    if (this.renderType != wwt.ctl.renderType)
      this.renderType = wwt.ctl.renderType;

    this.isTourPlayerActive = (wwt.getActiveTourPlayer() !== null);
  }

  @Mutation
  applySetting(setting: WWTSetting): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot applySetting without linking to WWTInstance');
    Vue.$wwt.inst.applySetting(setting);
  }

  @Mutation
  setBackgroundImageByName(imagesetName: string): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot setBackgroundImageByName without linking to WWTInstance');
    Vue.$wwt.inst.setBackgroundImageByName(imagesetName);
  }

  @Mutation
  setForegroundImageByName(imagesetName: string): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot setForegroundImageByName without linking to WWTInstance');
    Vue.$wwt.inst.setForegroundImageByName(imagesetName);
  }

  @Mutation
  setForegroundOpacity(opacity: number): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot setForegroundOpacity without linking to WWTInstance');
    Vue.$wwt.inst.setForegroundOpacity(opacity);
    this.foregroundOpacity = opacity;
  }

  @Mutation
  setupForImageset(options: SetupForImagesetOptions): void {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot setupForImageset without linking to WWTInstance');
    Vue.$wwt.inst.setupForImageset(options);
  }

  @Action({ rawError: true })
  async waitForReady(): Promise<void> {
    if (Vue.$wwt.inst !== null) {
      return Vue.$wwt.inst.waitForReady();
    } else {
      return new Promise((resolve, _reject) => {
        const waitThenResolve = (): void => {
          (Vue.$wwt.inst as WWTInstance).waitForReady().then(resolve);
        };

        if (Vue.$wwt.inst !== null) {
          waitThenResolve();
        } else {
          Vue.$wwt.onLinkedCallbacks.push(waitThenResolve);
        }
      });
    }
  }

  @Action({ rawError: true })
  async gotoRADecZoom(
    {raRad, decRad, zoomDeg, instant}: GotoRADecZoomParams
  ): Promise<void> {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot gotoRADecZoom without linking to WWTInstance');
    return Vue.$wwt.inst.gotoRADecZoom(raRad, decRad, zoomDeg, instant);
  }

  @Action({ rawError: true })
  async gotoTarget(options: GotoTargetOptions): Promise<void> {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot gotoTarget without linking to WWTInstance');
    return Vue.$wwt.inst.gotoTarget(options);
  }

  @Action({ rawError: true })
  async loadAndPlayTour(
    {url}: LoadAndPlayTourParams
  ): Promise<void> {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot loadAndPlayTour without linking to WWTInstance');
    return Vue.$wwt.inst.loadAndPlayTour(url);
  }

  @Action({ rawError: true })
  async loadImageCollection(
    {url}: LoadImageCollectionParams
  ): Promise<Folder> {
    if (Vue.$wwt.inst === null)
      throw new Error('cannot loadImageCollection without linking to WWTInstance');
    return Vue.$wwt.inst.loadImageCollection(url);
  }
}