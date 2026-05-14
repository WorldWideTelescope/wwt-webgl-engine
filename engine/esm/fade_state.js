import { registerType } from "./typesystem.js";

import { Settings } from "./settings.js";

export function FadeState(getter, duration) {
    this.getter = getter;
    this.opacity = getter();
    this.start = null;
    this.duration = duration || 400;
}

FadeState.fromSetting = function(setting, duration) {
    function getter() {
      return Number(Settings.get_active()[`get_${setting}`]());
    }
    return new FadeState(getter, duration);
}

var FadeState$ = {
    reset: function() {
        this.start = null;
    },

    // We use `Date.now()` rather than `performance.now()` in what follows
    // for compatibility with Internet Explorer
    update: function() {
      var target = this.getter();
      if (this.opacity == target) {
          this.reset();
      } else if (this.start == null) {
          this.start = Date.now();
      } else {
          // NB: This assumes that we are always going from 0 -> 1 or 1 -> 0
          // It will need slight tweaking if we eventually make this not the case
          var elapsed = Date.now() - this.start;
          this.opacity = Math.min(1, Math.max(0, 1 - target + elapsed * Math.sign(target - this.opacity) / this.duration));
      }
    }
};


registerType("FadeState", [FadeState, FadeState$, null]);
