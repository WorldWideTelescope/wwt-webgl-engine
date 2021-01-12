// Copyright 2020 the .NET Foundation
// Licensed under the MIT License

// Toplevel documentation found at @/docs/research-app-messages-index.md

import * as classicPywwt from './classic_pywwt';

/** The "classic" message formats used by pywwt. */
export { classicPywwt };


/** Information about the current position of the WWT view.
 *
 * Frontends periodically send this information to backends so that they can be
 * aware of what's going on with the view. The WWT clock time isn't sent
 * directly so that constant updates aren't needed in the common case that the
 * clock is running.
 */
export interface ViewStateMessage {
  /** A message type identifier. */
  type: "wwt_view_state";

  /** The current right ascension of the view, in radians. */
  raRad: number;

  /** The current declination of the view, in radians. */
  decRad: number;

  /** The current height of the viewport (zoom level), in degrees. */
  fovDeg: number;

  /** The current value of WWT's internal clock, as an ISO-T datetime string. */
  engineClockISOT: string;

  /** The current datetime of the computer running the WWT frontend, as an ISO-T
   * datetime string. */
  systemClockISOT: string;

  /** The current rate at which the WWT clock is running compared to the
   * frontend system clock. 0 indicates that the WWT clock is paused. */
  engineClockRateFactor: number;
}

/** Type guard function for ViewStateMessage. */
export function isViewStateMessage(o: any): o is ViewStateMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.type === "string" &&
    o.type == "wwt_view_state" &&
    typeof o.raRad === "number" &&
    typeof o.decRad === "number" &&
    typeof o.fovDeg === "number" &&
    typeof o.engineClockISOT === "string" &&
    typeof o.systemClockISOT === "string" &&
    typeof o.engineClockRateFactor === "number";
}
