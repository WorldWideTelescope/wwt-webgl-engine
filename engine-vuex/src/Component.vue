<template>
  <div :id="uniqueId" class="wwtelescope-component"></div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { createNamespacedHelpers } from "vuex";

import { WWTInstance } from "@wwtelescope/engine-helpers";

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
    const { mapActions, mapMutations } = createNamespacedHelpers(namespace);

    this.$options.methods = {
      ...mapMutations([
        "internalIncrementTourCompletions",
        "internalLinkToInstance",
        "internalUnlinkFromInstance",
        "internalUpdate",
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
      startInternalRenderLoop: false,

      // Start at the Galactic Center by default. RA of the GC ~= 266.4 deg; in WWT, lng = 360 - RA.
      startLatDeg: -28.9,
      startLngDeg: 93.6,
    });

    this.internalLinkToInstance(this.wwt);

    const render = () => {
      const wwt = this.wwt as WWTInstance;

      this.renderLoopId = window.requestAnimationFrame(render);
      wwt.ctl.renderOneFrame();
      this.internalUpdate();
    };

    const wwtcmpt0 = document.getElementById("wwtcmpt0");
    if (wwtcmpt0 != null){
      const wwtCanvas = wwtcmpt0.children[0];
      if (wwtCanvas != null) {
        wwtCanvas.addEventListener('webglcontextlost', (event) => {
          const e = event as WebGLContextEvent;
          console.log("Vue: WebGL context lost: " + e.statusMessage);
          if (this.renderLoopId !== undefined) {
            window.cancelAnimationFrame(this.renderLoopId);
          }
          e.preventDefault();
        }, false);
        wwtCanvas.addEventListener('webglcontextrestored', (event) => {
          const e = event as WebGLContextEvent;
          console.log("Vue: WebGL context restored: " + e.statusMessage);
          render();
        }, false);
      }

    }

    // Wait for the WWT engine to signal readiness, then wait another tick, then
    // start the rendering loop. This way, if a user wants to do some
    // initialization that has to wait for the ready signal, we won't flash any
    // weirdly-initialized content.
    this.waitForReady().then(() => {
      Vue.nextTick().then(() => {
        this.renderLoopId = window.requestAnimationFrame(render);
      });
    });

    this.wwt.tourEndedCallback = ((_tp) => {
      this.internalIncrementTourCompletions();
    });
  }

  destroyed() {
    if (this.renderLoopId !== undefined) {
      window.cancelAnimationFrame(this.renderLoopId);
      this.renderLoopId = undefined;
    }

    if (this.wwt !== undefined) {
      this.wwt.tourEndedCallback = null;
    }

    this.internalUnlinkFromInstance();
  }

  // Hacks to make TypeScript happy with our programmatically-created properties
  internalIncrementTourCompletions!: () => void;
  internalLinkToInstance!: (_wwt: WWTInstance) => void;
  internalUnlinkFromInstance!: () => void;
  internalUpdate!: () => void;
  waitForReady!: () => Promise<void>;
}
</script>
