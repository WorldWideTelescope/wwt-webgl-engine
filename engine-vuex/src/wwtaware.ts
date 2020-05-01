import { Component, Vue, Prop } from "vue-property-decorator";
import { createNamespacedHelpers } from "vuex";

import { WWTSetting } from "@pkgw/engine-types";

import { GotoRADecZoomParams, WWTEngineVuexState } from "./store";

@Component
export class WWTAwareComponent extends Vue {
  @Prop({default: "wwt"}) readonly wwtNamespace!: string;

  beforeCreate(): void {
    // Wire up this component to its backing WWT Vuex state module. We have to
    // wait until now to do so because we don't know a priori which Vuex module
    // namespace we'll be using. TODO: would like to be able to validate that
    // the namespace actually exists
    const namespace = this.$options.propsData ? (this.$options.propsData as any).wwtNamespace : "wwt";  // eslint-disable-line @typescript-eslint/no-explicit-any
    const { mapActions, mapMutations, mapState } = createNamespacedHelpers(namespace);

    this.$options.computed = {
      ...mapState({
        wwtRARad: (state, _getters) => (state as WWTEngineVuexState).raRad,
        wwtDecRad: (state, _getters) => (state as WWTEngineVuexState).decRad,
        wwtCurrentTime: (state, _getters) => (state as WWTEngineVuexState).currentTime,
      }),
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
        "waitForReady",
      ]),
      ...mapMutations([
        "applySetting",
        "setBackgroundImageByName",
        "setForegroundImageByName",
      ]),
    };
  }

  // Teach TypeScript about everything we wired up.
  wwtRARad!: number;
  wwtDecRad!: number;
  wwtCurrentTime!: Date;

  applySetting(_s: WWTSetting): void {}  // eslint-disable-line @typescript-eslint/no-empty-function
  setBackgroundImageByName(_n: string): void {}  // eslint-disable-line @typescript-eslint/no-empty-function
  setForegroundImageByName(_n: string): void {}  // eslint-disable-line @typescript-eslint/no-empty-function

  gotoRADecZoom(_o: GotoRADecZoomParams): Promise<void> { throw new Error("unreachable(?)"); }
  waitForReady(): Promise<void> { throw new Error("unreachable(?)"); }
}
