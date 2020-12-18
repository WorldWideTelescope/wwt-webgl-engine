import { Component, Vue, Prop } from "vue-property-decorator";
import { createNamespacedHelpers } from "vuex";

import { ImageSetType, WWTSetting } from "@wwtelescope/engine-types";
import { Folder, Imageset } from "@wwtelescope/engine";
import { GotoTargetOptions, SetupForImagesetOptions } from "@wwtelescope/engine-helpers";

import {
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
        wwtDecRad: (state, _getters) => (state as WWTEngineVuexState).decRad,
        wwtForegroundImageset: (state, _getters) => (state as WWTEngineVuexState).foregroundImageset,
        wwtForegroundOpacity: (state, _getters) => (state as WWTEngineVuexState).foregroundOpacity,
        wwtIsTourPlayerActive: (state, _getters) => (state as WWTEngineVuexState).isTourPlayerActive,
        wwtIsTourPlaying: (state, _getters) => (state as WWTEngineVuexState).isTourPlaying,
        wwtRARad: (state, _getters) => (state as WWTEngineVuexState).raRad,
        wwtRenderType: (state, _getters) => (state as WWTEngineVuexState).renderType,
        wwtTourRunTime: (state, _getters) => (state as WWTEngineVuexState).tourRunTime,
        wwtTourStopStartTimes: (state, _getters) => (state as WWTEngineVuexState).tourStopStartTimes,
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
        "gotoRADecZoom",
        "gotoTarget",
        "loadImageCollection",
        "loadTour",
        "waitForReady",
      ]),
      ...mapMutations([
        "applySetting",
        "setBackgroundImageByName",
        "setForegroundImageByName",
        "setForegroundOpacity",
        "setTourPlayerLeaveSettingsWhenStopped",
        "setupForImageset",
        "startTour",
        "toggleTourPlayPauseState",
        "zoom",
      ]),
    };
  }

  // Teach TypeScript about everything we wired up. State:
  wwtBackgroundImageset!: Imageset | null;
  wwtCurrentTime!: Date;
  wwtDecRad!: number;
  wwtForegroundImageset!: Imageset | null;
  wwtForegroundOpacity!: number;
  wwtIsTourPlayerActive!: boolean;
  wwtIsTourPlaying!: boolean;
  wwtRARad!: number;
  wwtRenderType!: ImageSetType;
  wwtTourRunTime!: number | null;
  wwtTourStopStartTimes!: number[];

  // Getters
  lookupImageset!: (_n: string) => Imageset | null;

  // Mutations
  applySetting!: (_s: WWTSetting) => void;
  setBackgroundImageByName!: (_n: string) => void;
  setForegroundImageByName!: (_n: string) => void;
  setForegroundOpacity!: (o: number) => void;
  setTourPlayerLeaveSettingsWhenStopped!: (v: boolean) => void;
  setupForImageset!: (o: SetupForImagesetOptions) => void;
  startTour!: () => void;
  toggleTourPlayPauseState!: () => void;
  zoom!: (f: number) => void;

  // Actions
  gotoRADecZoom!: (_o: GotoRADecZoomParams) => Promise<void>;
  gotoTarget!: (o: GotoTargetOptions) => Promise<void>;
  loadImageCollection!: (_o: LoadImageCollectionParams) => Promise<Folder>;
  loadTour!: (o: LoadTourParams) => Promise<void>;
  waitForReady!: () => Promise<void>;
}
