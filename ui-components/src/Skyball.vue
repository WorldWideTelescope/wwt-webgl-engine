<template>
  <div 
    class="skyball"
    :style="cssVars"
  >
    <div class="v-ellipse"></div>
    <div class="h-ellipse"></div>
    <div class="x-axis"></div>
    <div class="y-axis"></div>
    <canvas
      class="skyball-canvas"
      :width="width"
      :height="height"
    >
    </canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    size: { type: Number, default: 300 },
    boxColor: { type: String, default: "yellow" },
    axisColor: { type: String, default: "rgba(255, 255, 255, 0.4)", },
    backgroundColor: { type: String, default: "rgba(133, 133, 133, 0.7)", },
    ellipseColor: { type: String, default: "rgba(255, 255, 255, 0.6)", },
  },
  data() {
    return {
      setup: false,
      canvas: null as HTMLCanvasElement | null,
      context: null as CanvasRenderingContext2D | null,
    };
  },
  methods: {
    getCanvas(): HTMLCanvasElement {
      return this.$el.querySelector(".skyball-canvas") as HTMLCanvasElement;
    },
    setupCanvas() {
      if (this.setup) {
        return;
      }
      this.canvas = this.canvas || this.getCanvas();
      if (this.canvas) {
        this.context = this.context || this.canvas.getContext("2d");
        this.canvas.height = this.size;
        this.canvas.width = this.size;
        this.canvas.style.height = `${this.size}px`;
        this.canvas.style.width = `${this.size}px`;
        if (this.context) {
          this.setup = true;
        }
      }
    },
  },
  mounted() {
    if (!this.$refs.skyball) {
      return;
    }
    this.setupCanvas();
    if (this.context) {
      this.waitForReady().then(this.update);      
    }
  },
})
</script>
