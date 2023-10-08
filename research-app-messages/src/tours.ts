// Copyright 2022-2023 the .NET Foundation
// Licensed under the MIT License

// Note: module-level docstring found in `index.ts`

/** A command instructing the app to return the current view as a one-slide WWT
 * Tour data payload.
 *
 * This message will result in a {@link GetViewAsTourReply} if the input
 * parameters are all correct.
 *
 * The underlying implementation maps to
 * [WWTAwareComponent.viewAsTourXml](../../engine-pinia/classes/WWTAwareComponent.html#viewAsTourXml).
 */
export interface GetViewAsTourMessage {
  /** The tag identifying this message type. */
  type: "get_view_as_tour";

  /** Arbitrary text that will be included in message responses. */
  threadId: string;
}

/** A type-guard function for {@link GetViewAsTourMessage} */
export function isGetViewAsTourMessage(o: any): o is GetViewAsTourMessage { // eslint-disable-line @typescript-eslint/no-explicit-any
  return o.type === "get_view_as_tour" &&
    typeof o.threadId === "string";
}

/** The app's response to {@link GetViewAsTourMessage}, containing the current
 * view serialized as a one-slide WWT Tour. */
export interface GetViewAsTourReply {
  /** The tag identifying this message type. */
  type: "get_view_as_tour_reply";

  /** The threadId of the triggering message. */
  threadId: string;

  /** The serialized view, if tour conversion was successful.
   *
   * This blob can in principle be large, if the view contains a large data
   * asset that the engine wants to serialize into the tour data payload.
   */
  tourXml: string | null;
}
