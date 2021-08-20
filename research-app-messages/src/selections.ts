/**
 * Information about a selected source in the engine.
 * The values for right ascension and declination are given in radians.
 * `catalogName` gives the name of the associated HiPS catalog,
 * while `name` gives a string name for the source.
 */
 export interface Source {
    ra: number;
    dec: number;
    name: string;
    catalogName: string;
    zoomDeg?: number;
    catalogData: {
      [field: string]: string | undefined;
    }
  }

  /** Information about the current state of source and catalog selection
 * inside the WWT application
 * 
 * This message is broadcasted by the application whenever one of the user's selection
 * options inside of the application is adjusted. The Vue listeners for the selected
 * catalogs and sources are deep listeners, meaning that this message will be broadcasted
 * whenever a property of one of their items changes.
 * 
 * Not all fields of this message will always be present, depending on the
 * nature of the event triggering the emission of this message. A message
 * missing a particular field should be treated as conveying no information
 * about the state described by that field.
 */
export interface SelectionStateMessage {

    /** The tag identifying this message type. */
    type: "wwt_selection_state";
  
    /** An app/client session identifier. See the description for [[ViewStateMessage.sessionId]].
     */
    sessionId: string;
  
    /** The most recent source that was added to the selection list. */
    mostRecentSource?: Source;
  
    /** The list of sources that are currently selected. */
    selectedSources?: Source[];
  }
  