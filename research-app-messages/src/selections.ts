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
  }

export interface SelectionStateMessage {

    /** The tag identifying this message type. */
    type: "wwt_selection_state";
  
    /** An app/client session identifier.
     *
     * If a single client is communicating with multiple apps, it needs to be able
     * to tell which app is the source of any update messages. This session
     * identifier allows clients to do so. The default value is "default". But if
     * a client sends a [[PingPongMessage]] with a customized ``sessionId`` field,
     * that value will start appearing in these view state update messages.
     */
    sessionId: string;
  
    /** The most recent source that was added to the selection list. */
    mostRecentSource?: Source;
  
    /** The list of sources that are currently selected. */
    selectedSources?: Source[];
  }
  