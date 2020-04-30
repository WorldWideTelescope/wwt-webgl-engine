<template>
  <div :id="uniqueId" class="wwtelescope-component"></div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { createNamespacedHelpers } from "vuex";

import { D2R, H2R } from "@wwtelescope/astro";
import { WWTInstance } from "@wwtelescope/engine-helpers";

import { WWTEngineVuexState } from "./store";

let idCounter = 0;

/** This is the component docstring. */
@Component
export default class WWTComponent extends Vue {
  /** This is the uniqueId */
  uniqueId!: string;
  wwt: WWTInstance | undefined;
  renderLoopId: number | undefined;

  @Prop({default: "wwt"}) readonly wwtNamespace!: string;

  beforeCreate() {
    // Wire up this component to its backing Vuex state module.
    const namespace = this.$options.propsData ? (this.$options.propsData as any).wwtNamespace : "wwt";  // eslint-disable-line @typescript-eslint/no-explicit-any
    const { mapActions, mapMutations, mapState } = createNamespacedHelpers(namespace);

    this.$options.computed = {
      ...mapState({
        raRad: (state, _getters) => (state as WWTEngineVuexState).raRad,
        decRad: (state, _getters) => (state as WWTEngineVuexState).decRad,
        currentTime: (state, _getters) => (state as WWTEngineVuexState).currentTime,
      }),
    };

    this.$options.methods = {
      ...mapMutations([
        "internalLinkToInstance",
        "internalUnlinkFromInstance",
        "internalUpdateRA",
        "internalUpdateDec",
        "internalUpdateCurrentTime",
      ]),
      ...mapActions([
        "waitForReady",
      ])
    };

    // Create a globally unique ID for the div that the WWT engine can latch onto.
    const uid = `wwtcmpt${idCounter}`;
    Object.defineProperties(this, {
      uniqueId: { get() { return uid; } },
    });
    idCounter += 1;
  }

  mounted() {
    this.wwt = new WWTInstance({
      elId: this.uniqueId,
      startInternalRenderLoop: false
    });

    this.internalLinkToInstance(this.wwt);

    const render = () => {
      const wwt = this.wwt as WWTInstance;

      this.renderLoopId = window.requestAnimationFrame(render);
      wwt.ctl.renderOneFrame();

      const raRad = wwt.si.getRA() * H2R;
      if (this.raRad != raRad)
        this.internalUpdateRA(raRad);

      const decRad = wwt.si.getDec() * D2R;
      if (this.decRad != decRad)
        this.internalUpdateDec(decRad);

      const time = wwt.stc.get_now();
      if (this.currentTime != time)
        this.internalUpdateCurrentTime(time);
    };

    // Wait for the WWT engine to signal readiness, then wait another tick, then
    // start the rendering loop. This way, if a user wants to do some
    // initialization that has to wait for the ready signal, we won't flash any
    // weirdly-initialized content.
    this.waitForReady().then(() => {
      Vue.nextTick().then(() => {
        this.renderLoopId = window.requestAnimationFrame(render);
      });
    });
  }

  destroyed() {
    if (this.renderLoopId !== undefined) {
      window.cancelAnimationFrame(this.renderLoopId);
      this.renderLoopId = undefined;
    }

    this.internalUnlinkFromInstance();
  }

  // Hacks to make TypeScript happy with our programmatically-created properties
  raRad!: number;
  decRad!: number;
  currentTime!: Date;
  internalLinkToInstance(_wwt: WWTInstance): void {}  // eslint-disable-line @typescript-eslint/no-empty-function
  internalUnlinkFromInstance(): void {}  // eslint-disable-line @typescript-eslint/no-empty-function
  internalUpdateRA(_newRARad: number): void {}  // eslint-disable-line @typescript-eslint/no-empty-function
  internalUpdateDec(_newDecRad: number): void {}  // eslint-disable-line @typescript-eslint/no-empty-function
  internalUpdateCurrentTime(_newTime: Date): void {}  // eslint-disable-line @typescript-eslint/no-empty-function
  waitForReady(): Promise<void> { throw new Error("unreachable (?)"); }
}
</script>
