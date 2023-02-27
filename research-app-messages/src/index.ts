// Copyright 2020-2021 the .NET Foundation
// Licensed under the MIT License

// Toplevel documentation found at @/docs/engine/research-app-messages-index.md

import * as classicPywwt from './classic_pywwt';
import * as layers from './layers';
import * as selections from './selections';
import * as settings from './settings';
import * as tours from './tours';

export {
  classicPywwt,
  layers,
  selections,
  settings,
  tours,
};

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

  /** An app/client session identifier.
   *
   * If a single client is communicating with multiple apps, it needs to be able
   * to tell which app is the source of any update messages. This session
   * identifier allows clients to do so. The default value is "default". But if
   * a client sends a [[PingPongMessage]] with a customized ``sessionId`` field,
   * that value will start appearing in these view state update messages.
   */
  sessionId: string;

  /** The current right ascension of the view, in radians. */
  raRad: number;

  /** The current declination of the view, in radians. */
  decRad: number;

  /** The current height of the viewport (zoom level), in degrees. */
  fovDeg: number;

  /** The current roll angle of the view, in degrees */
  rollDeg: number;

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
    typeof o.sessionId === "string" &&
    typeof o.raRad === "number" &&
    typeof o.decRad === "number" &&
    typeof o.fovDeg === "number" &&
    typeof o.engineClockISOT === "string" &&
    typeof o.systemClockISOT === "string" &&
    typeof o.engineClockRateFactor === "number";
}


/** Information about the current state of the WWT application.
 *
 * This message may be broadcasted by the application in response to various
 * events such as loading of imagery catalogs. Clients can monitor these
 * messages and synchronize their internal state as needed. Implementors should
 * keep in mind that each application might have multiple clients, so state
 * updates may seem to arrive "spontaneously" in response to actions initiated
 * by third parties.
 *
 * Not all fields of this message will always be present, depending on the
 * nature of the event triggering the emission of this message. A message
 * missing a particular field should be treated as conveying no information
 * about the state described by that field.
 */
export interface ApplicationStateMessage {
  /** A message type identifier. */
  type: "wwt_application_state";

  /** An app/client session identifier.
   *
   * If a single client is communicating with multiple apps, it needs to be able
   * to tell which app is the source of any unsolicited messages. This session
   * identifier allows clients to do so. The default value is "default". But if
   * a client sends a [[PingPongMessage]] with a customized ``sessionId`` field,
   * that value will start appearing in these view state update messages.
   */
  sessionId: string;

  /** The names of the available HiPS catalog datasets. */
  hipsCatalogNames?: string[];
}


/** A "ping" or "pong" message.
 *
 * If you send this message to the app, it will reply with its own
 * [[PingPongMessage]] that repeats your [[threadId]] and [[sessionId]].
 *
 * If you're trying to communicate with the WWT research app through the
 * [postMessage()] web API, there's no surefire way to know that the app is
 * actually receiving your messages. This is a particular issue when the app is
 * starting up. The least-bad way to account for this is to periodically send
 * pings and wait until you start getting replies. The [[threadId]] parameter
 * makes it possible to distinguish messages between multiple instances of the
 * app and multiple app clients.
 *
 * [postMessage()]:
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
 *
 * This message also includes a [[sessionId]] field that allows clients to set
 * up customized tagging in [[ViewStateMessage]] updates, which is helpful when
 * a client is messaging with multiple apps and needs to distinguish their
 * replies.
 * */
export interface PingPongMessage {
  /** The tag identifying this message type. */
  type: "wwt_ping_pong";

  /** Arbitrary text that will be included in message responses. */
  threadId: string;

  /** A client session identifier string.
   *
   * If specified, the app will start sending [[ViewStateMessage]] updates to
   * the sender of this ping-pong message, and those updates will be tagged with
   * this session ID. This is useful if a client is communicating with multiple
   * apps and its messaging transport mechanism prevents it from identifying the
   * origin of the various messages that it receives.
   */
  sessionId?: string;
}

/** Type guard function for [[PingPongMessage]]. */
export function isPingPongMessage(o: any): o is PingPongMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.type === "string" &&
    o.type == "wwt_ping_pong" &&
    typeof o.threadId === "string" &&
    (o.sessionId === undefined || typeof o.sessionId === "string");
}


/** A message sent by the app to enable drag operations over the app. The
 * message is triggered when the pointer moves over the app with any button
 * pressed.
 * */
export interface PointerMoveMessage {
  /** The tag identifying this message type. */
  type: "wwt_pointer_move";

  /** The clientX property of the originating pointer move event. */
  clientX: number;

  /** The clientY property of the originating pointer move event. */
  clientY: number;

  /** An app/client session identifier.
   *
   * If a single client is communicating with multiple apps, it needs to be able
   * to tell which app is the source of any update messages. This session
   * identifier allows clients to do so. The default value is "default". But if
   * a client sends a [[PingPongMessage]] with a customized ``sessionId`` field,
   * that value will start appearing in these view state update messages.
   */
  sessionId?: string;
}

/** Type guard function for [[PointerMoveMessage]]. */
export function isPointerMoveMessage(o: any): o is PointerMoveMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.type === "string" &&
    o.type == "wwt_pointer_move" &&
    typeof o.clientX === "number" &&
    typeof o.clientY === "number" &&
    (o.sessionId === undefined || typeof o.sessionId === "string");
}


/** A message sent by the app to enable drag operations over the app. The
 * message is triggered when the pointerup event is triggered within the app.
 * */
export interface PointerUpMessage {
  /** The tag identifying this message type. */
  type: "wwt_pointer_up";

  /** The clientX property of the originating pointer up event. */
  clientX: number;

  /** The clientY property of the originating pointer up event. */
  clientY: number;

  /** An app/client session identifier.
   *
   * If a single client is communicating with multiple apps, it needs to be able
   * to tell which app is the source of any update messages. This session
   * identifier allows clients to do so. The default value is "default". But if
   * a client sends a [[PingPongMessage]] with a customized ``sessionId`` field,
   * that value will start appearing in these view state update messages.
   */
  sessionId?: string;
}

/** Type guard function for [[PointerUpMessage]]. */
export function isPointerUpMessage(o: any): o is PointerUpMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.type === "string" &&
    o.type == "wwt_pointer_up" &&
    typeof o.clientX === "number" &&
    typeof o.clientY === "number" &&
    (o.sessionId === undefined || typeof o.sessionId === "string");
}