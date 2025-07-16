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
      ref="canvas"
      class="canvas"
      :width="size"
      :height="size"
    >
    </canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { D2R } from "@wwtelescope/astro";
import { Coordinates, WWTControl } from '@wwtelescope/engine';
import { WWTAwareComponent } from '@wwtelescope/engine-pinia';

interface Point {
  x: number;
  y: number;
}

export default defineComponent({
  extends: WWTAwareComponent,
  props: {
    size: { type: Number, default: 300 },
    boxColor: { type: String, default: "yellow" },
    axisColor: { type: String, default: "rgba(255, 255, 255, 0.4)", },
    backgroundColor: { type: String, default: "rgba(133, 133, 133, 0.7)", },
    ellipseColor: { type: String, default: "rgba(255, 255, 255, 0.6)", },
  },
  data() {
    return {
      context: null as CanvasRenderingContext2D | null,
    };
  },
  mounted() {
    const canvas = this.$refs.canvas as HTMLCanvasElement;
    this.context = this.context || canvas.getContext("2d");
    canvas.height = this.size;
    canvas.width = this.size;
    canvas.style.height = `${this.size}px`;
    canvas.style.width = `${this.size}px`;
    this.$watch(
      (vm: typeof this) => [vm.wwtRARad, vm.wwtDecRad, vm.wwtZoomDeg, vm.wwtRollRad],
      _value => this.update()
    );
  },
  methods: {
    update() {
      if (!this.context) {
        return;
      }
      const canvas = this.$refs.canvas as HTMLCanvasElement;
      this.context.clearRect(0, 0, canvas.width, canvas.height);
      const sphereSize = canvas.height;
      const radius = sphereSize / 2;
      const factor = 0.5;
      const pointSize = factor * sphereSize;
      const centerF = { x: pointSize, y: pointSize };
      const center = { x: pointSize, y: pointSize };
      const points: Point[] = [];
      let z = 0;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const wwtCanvas = WWTControl.singleton.canvas as HTMLCanvasElement;
      const coordinates = [
        this.findRADecForScreenPoint({ x: 0, y : 0 }), 
        this.findRADecForScreenPoint({ x: wwtCanvas.width, y : 0 }), 
        this.findRADecForScreenPoint({ x: wwtCanvas.width, y : wwtCanvas.height }), 
        this.findRADecForScreenPoint({ x: 0, y : wwtCanvas.height }), 
      ];
      coordinates.forEach(coord => {
        if (!this.context) {
          return;
        }
        const corner = new Coordinates((coord.ra - 180) * D2R, coord.dec * D2R);
        const ptX = centerF.x - (Math.cos((corner.get_RA() + 6) / 12 * Math.PI) * Math.cos(corner.get_lat() * D2R) * radius);
        const ptY = centerF.y - (Math.sin(corner.get_lat() * D2R) * radius);
        const point = { x: ptX, y: ptY };
        points.push(point);
        z += (Math.sin((corner.get_RA() + 6) / 12 * Math.PI) * Math.cos(corner.get_lat() * D2R) * radius);
        this.context.beginPath();
        this.context.lineWidth = 1;
        this.context.strokeStyle  = this.boxColor;
        this.context.moveTo(center.x, center.y);
        this.context.lineTo(point.x, point.y);
        this.context.closePath();
        this.context.stroke();
      });
      this.context.beginPath();
      this.context.lineWidth = 1;
      this.context.strokeStyle  = this.boxColor;
      this.context.moveTo(points[0].x, points[0].y);
      points.slice(1).forEach(point => {
        this.context?.lineTo(point.x, point.y);
      });
      this.context.closePath();
      const opacity = z > 0 ? 0.9 : 0.5;
      this.context.fillStyle = `rgba(from ${this.boxColor} r g b / ${opacity})`;
      this.context.fill();
      this.context.stroke();
    }
  },
  computed: {
    cssVars() {
      return {
        "--width": `${this.size}px`,
        "--height": `${this.size}px`,
        "--axis-color": this.axisColor,
        "--background-color": this.backgroundColor,
        "--ellipse-color": this.ellipseColor,
      };
    }
  },
})
</script>

<style lang="less">
.skyball {
  margin: 2px auto;
  position: relative;
  height: var(--height);
  width: var(--width);
  border: solid 1px var(--ellipse-color);
  border-radius: 50%;
  background-color: var(--background-color);
  .v-ellipse {
    position: absolute;
    top: 0px;
    left: 41%;
    height: 100%;
    width: 21%;
    border: solid 1px var(--ellipse-color);
    border-radius: 50%;
  }
  .h-ellipse {
    position: absolute;
    left: 0px;
    top: 41%;
    width: 100%;
    height: 21%;
    border: solid 1px var(--ellipse-color);
    border-radius: 50%;
  }
  .x-axis {
    position: absolute;
    border-bottom: solid 1px var(--axis-color);
    height: 0;
    width: 100%;
    top: 50%;
    left: -1px;
  }
  .y-axis {
    position: absolute;
    border-right: solid 1px var(--axis-color);
    width: 0;
    height: 100%;
    left: 50%;
    top: -1px;
  }
}
</style>
