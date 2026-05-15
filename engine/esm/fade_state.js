import { registerType } from "./typesystem.js";

import { Settings } from "./settings.js";

export function FadeState(options) {
    this.target = options.target;
    this.start = ("start" in options) ? options.start : options.target();
    this.opacity = this.start;
    this.startTimestamp = null;
    this.duration = options.duration || 400;
    this.onFinish = options.onFinish;
    this.finished = true;
}

FadeState.forSetting = function(setting, duration) {
    function getter() {
      return Number(Settings.get_active()[`get_${setting}`]());
    }
    function onFinish(state) {
      state.start = state.target();
    }
    
    return new FadeState({ target: getter, start: getter(), duration: duration, onFinish: onFinish });
}

var FadeState$ = {
    finish: function() {
        this.startTimestamp = null;
        if (this.onFinish) {
            this.onFinish(this);
        }
        this.finished = true;
    },

    set_target: function(target) {
        this.target = target;
    },

    // We use `Date.now()` rather than `performance.now()` in what follows
    // for compatibility with Internet Explorer
    update: function() {
      var target = (typeof this.target === "function") ? this.target() : this.target;
      if (this.opacity == target) {
          if (!this.finished) { this.finish(); }
      } else if (this.startTimestamp == null) {
          this.finished = false;
          this.startTimestamp = Date.now();
      } else {
          var elapsed = Date.now() - this.startTimestamp;
          var upper = Math.max(this.start, target);
          var lower = Math.min(this.start, target);
          this.opacity = Math.min(upper, Math.max(lower, this.start + elapsed * (target - this.start) / this.duration));
      }
    }
};


registerType("FadeState", [FadeState, FadeState$, null]);
