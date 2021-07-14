// Copyright 2020 the .NET Foundation
// Licensed under the MIT License

// Toplevel documentation found at @/docs/engine/research-app-messages-index.md

import * as classicPywwt from './classic_pywwt';

export { classicPywwt };


/** Information about the current position of the WWT view.
 *
 * Frontends (e.g., [embedded WWT apps][embed]) periodically send this
 * information to backends (e.g., [pywwt]) so that they can be aware of what's
 * going on with the view.
 *
 * [embed]: https://docs.worldwidetelescope.org/research-app/latest/embedding/
 * [pywwt]: https://pywwt.readthedocs.io/
 *
 * The WWT clock time isn't sent directly, so that constant updates aren't
 * needed in the common case that the clock is running. If you care about the
 * current time of the WWT clock, you should maintain state that tracks the most
 * recently provided values of the [[engineClockISOT]], [[systemClockISOT]], and
 * [[engineClockRateFactor]] fields. If you need to estimate the current time of
 * the WWT clock, you should calculate:
 *
 * ```
 * const engineDelta = (getCurrentTime() - systemClock) * engineClockRateFactor;
 * const currentEngineTime = engineClock + engineDelta;
 * ```
 *
 * This calculation assumes that the frontend and backend system clocks are in
 * OK agreement. You could try to do better by tracking the difference between
 * the frontend and backend system clocks, but your accuracy is always going to
 * be limited because messages from the frontend are propagating over *some*
 * channel with unknown latency, and this simple protocol doesn't have any
 * mechanism for determining this latency. File an issue if you think that you
 * have an application that calls for higher accuracy than is made possible
 * here.
 *
 * Updates are sent no more frequently than every ten-or-so of milliseconds, and
 * no less frequently than every minute or so. If the clock rate parameters
 * change discontinuously, an update is sent immediately.
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

  /** The current value of WWT's internal clock, as an
   * [ISO-T](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations)
   * datetime string.
   * */
  engineClockISOT: string;

  /** The current datetime of the computer running the WWT frontend, as an
   * [ISO-T](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations)
   * datetime string.
   * */
  systemClockISOT: string;

  /** The current rate at which the WWT clock is running compared to the
   * frontend system clock. Zero indicates that the WWT clock is paused. */
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
