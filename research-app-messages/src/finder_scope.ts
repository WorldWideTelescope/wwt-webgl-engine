// Copyright 2021-2023 the .NET Foundation
// Licensed under the MIT License

// Note: module-level doctring found in `index.ts`


/** Information about the current state of the focused `Place` in the research app's
* Finder Scope.
*
* If the scope's focused `Place` changes to be empty (including when the scope is closed),
* the value of the `placeXml` field will be null. The XML serialization of the `Place` uses
* the standard serialization employed elsewhere by the web engine.
*/
export interface FinderScopePlaceMessage {
  /** The tag identifying the message type */
  type: "finder_scope_place";

  /**
   * The currently selected `Place`, represented as an XML string.
   * If the `Place` has changed to be empty, we send null
   */ 
  placeXml: string | null;
}
