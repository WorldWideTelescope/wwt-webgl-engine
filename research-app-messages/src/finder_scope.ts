// Note: module-level doctring found in `index.ts`

export interface FinderScopePlaceMessage {
  /** The tag identifying the message type */
  type: "finder_scope_place";

  /**
   * The currently selected `Place`, represented as an XML string.
   * If the `Place` has changed to be empty, we send null
   */ 
  place: string | null;
}
