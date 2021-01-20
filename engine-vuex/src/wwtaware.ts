import { Component, Vue, Prop } from "vue-property-decorator";
import { createNamespacedHelpers } from "vuex";

import {
  ImageSetType,
  SolarSystemObjects,
} from "@wwtelescope/engine-types";

import {
  EngineSetting,
  Folder,
  Guid,
  Imageset,
  ImageSetLayer,
  SpreadSheetLayer,
} from "@wwtelescope/engine";

import {
  ApplyFitsLayerSettingsOptions,
  ApplyTableLayerSettingsOptions,
  GotoTargetOptions,
  LoadFitsLayerOptions,
  SetFitsLayerColormapOptions,
  SetupForImagesetOptions,
  StretchFitsLayerOptions,
  UpdateTableLayerOptions,
} from "@wwtelescope/engine-helpers";

import {
  CreateTableLayerParams,
  GotoRADecZoomParams,
  LoadTourParams,
  LoadImageCollectionParams,
  WWTEngineVuexState
} from "./store";

@Component
export class WWTAwareComponent extends Vue {
  @Prop({default: "wwt"}) readonly wwtNamespace!: string;

  beforeCreate(): void {
    // Wire up this component to its backing WWT Vuex state module. We have to
    // wait until now to do so because we don't know a priori which Vuex module
    // namespace we'll be using. TODO: would like to be able to validate that
    // the namespace actually exists
    const namespace = this.$options.propsData ? (this.$options.propsData as any).wwtNamespace : "wwt";  // eslint-disable-line @typescript-eslint/no-explicit-any
    const { mapActions, mapGetters, mapMutations, mapState } = createNamespacedHelpers(namespace);

    this.$options.computed = {
      ...mapState({
        wwtBackgroundImageset: (state, _getters) => (state as WWTEngineVuexState).backgroundImageset,
        wwtCurrentTime: (state, _getters) => (state as WWTEngineVuexState).currentTime,
        wwtClockDiscontinuities: (state, _getters) => (state as WWTEngineVuexState).clockDiscontinuities,
        wwtClockRate: (state, _getters) => (state as WWTEngineVuexState).clockRate,
        wwtDecRad: (state, _getters) => (state as WWTEngineVuexState).decRad,
        wwtForegroundImageset: (state, _getters) => (state as WWTEngineVuexState).foregroundImageset,
        wwtForegroundOpacity: (state, _getters) => (state as WWTEngineVuexState).foregroundOpacity,
        wwtIsTourPlayerActive: (state, _getters) => (state as WWTEngineVuexState).isTourPlayerActive,
        wwtIsTourPlaying: (state, _getters) => (state as WWTEngineVuexState).isTourPlaying,
        wwtRARad: (state, _getters) => (state as WWTEngineVuexState).raRad,
        wwtRenderType: (state, _getters) => (state as WWTEngineVuexState).renderType,
        wwtTourCompletions: (state, _getters) => (state as WWTEngineVuexState).tourCompletions,
        wwtTourRunTime: (state, _getters) => (state as WWTEngineVuexState).tourRunTime,
        wwtTourStopStartTimes: (state, _getters) => (state as WWTEngineVuexState).tourStopStartTimes,
        wwtTourTimecode: (state, _getters) => (state as WWTEngineVuexState).tourTimecode,
        wwtZoomDeg: (state, _getters) => (state as WWTEngineVuexState).zoomDeg,
      }),
      ...mapGetters([
        "lookupImageset",
      ]),
      ...this.$options.computed,
    };

    // TODO: is there a convenient way to namespace these? Also note that we
    // have to forcibly override pre-existing methods (i.e., the
    // this.$options.methods comes before the mapActions) since we have to
    // define dummy methods to make TypeScript happy.
    this.$options.methods = {
      ...this.$options.methods,
      ...mapActions([
        "createTableLayer",
        "gotoRADecZoom",
        "gotoTarget",
        "loadImageCollection",
        "loadFitsLayer",
        "loadTour",
        "waitForReady",
      ]),
      ...mapMutations([
        "applyFitsLayerSettings",
        "applyTableLayerSettings",
        "applySetting",
        "deleteLayer",
        "seekToTourTimecode",
        "setBackgroundImageByName",
        "setClockRate",
        "setClockSync",
        "setFitsLayerColormap",
        "setForegroundImageByName",
        "setForegroundOpacity",
        "setTourPlayerLeaveSettingsWhenStopped",
        "setTime",
        "setTrackedObject",
        "setupForImageset",
        "startTour",
        "stretchFitsLayer",
        "toggleTourPlayPauseState",
        "updateTableLayer",
        "zoom",
      ]),
    };
  }

  // Teach TypeScript about everything we wired up. State:
  wwtBackgroundImageset!: Imageset | null;
  wwtClockDiscontinuities!: number;
  wwtClockRate!: number;
  wwtCurrentTime!: Date;
  wwtDecRad!: number;
  wwtForegroundImageset!: Imageset | null;
  wwtForegroundOpacity!: number;
  wwtIsTourPlayerActive!: boolean;
  wwtIsTourPlaying!: boolean;
  wwtRARad!: number;
  wwtRenderType!: ImageSetType;
  wwtTourCompletions!: number;
  wwtTourRunTime!: number | null;
  wwtTourStopStartTimes!: number[];
  wwtTourTimecode!: number;
  wwtZoomDeg!: number;

  // Getters
  lookupImageset!: (_n: string) => Imageset | null;

  // Mutations
  applyFitsLayerSettings!: (_o: ApplyFitsLayerSettingsOptions) => void;
  applyTableLayerSettings!: (_o: ApplyTableLayerSettingsOptions) => void;
  applySetting!: (_s: EngineSetting) => void;
  deleteLayer!: (id: string | Guid) => void;
  seekToTourTimecode!: (value: number) => void;
  setBackgroundImageByName!: (_n: string) => void;
  setClockRate!: (_r: number) => void;
  setClockSync!: (_s: boolean) => void;
  setFitsLayerColormap!: (_o: SetFitsLayerColormapOptions) => void;
  setForegroundImageByName!: (_n: string) => void;
  setForegroundOpacity!: (o: number) => void;
  setTime!: (d: Date) => void;
  setTourPlayerLeaveSettingsWhenStopped!: (v: boolean) => void;
  setTrackedObject!: (o: SolarSystemObjects) => void;
  setupForImageset!: (o: SetupForImagesetOptions) => void;
  startTour!: () => void;
  stretchFitsLayer!: (o: StretchFitsLayerOptions) => void;
  toggleTourPlayPauseState!: () => void;
  updateTableLayer!: (o: UpdateTableLayerOptions) => void;
  zoom!: (f: number) => void;

  // Actions
  createTableLayer!: (_o: CreateTableLayerParams) => Promise<SpreadSheetLayer>;
  gotoRADecZoom!: (_o: GotoRADecZoomParams) => Promise<void>;
  gotoTarget!: (o: GotoTargetOptions) => Promise<void>;
  loadImageCollection!: (_o: LoadImageCollectionParams) => Promise<Folder>;
  loadFitsLayer!: (_o: LoadFitsLayerOptions) => Promise<ImageSetLayer>;
  loadTour!: (o: LoadTourParams) => Promise<void>;
  waitForReady!: () => Promise<void>;
}
