// Copyright 2022 the .NET Foundation
// Licensed under the MIT License

/** Messages relating to tours.
 *
 * This module contains messages and types relating to WWT tours,
 *  in particular obtaining the current view as a tour.
 *  However, note that the [[classicPywwt]] module defines a bunch
 *  of messages on the same topic, especially concerning
 *  loading and playback of tours.
 *
 * The defined messages are:
 *
 * - [[GetViewAsTourMessage]] leading to [[GetViewAsTourReply]]
 *
 * */

export interface GetViewAsTourMessage {
  type: "get_view_as_tour";
  threadId: string;
}

export function isGetViewAsTourMessage(o: any): o is GetViewAsTourMessage { // eslint-disable-line @typescript-eslint/no-explicit-any
  return o.type === "get_view_as_tour" &&
    typeof o.threadId === "string";
}

export interface GetViewAsTourReply {
  type: "get_view_as_tour_reply";
  threadId: string;
  tourXml: string | null;
}
