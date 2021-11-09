export const ImageSetTypes = ["earth", "planet", "sky", "panorama", "solarSystem", "sandbox"] as const;
export type ImageSetType = (typeof ImageSetTypes)[number];

/** This class holds basic information about an imageset.
 *
 * Discover imagesets through the [[WWTAwareComponent.wwtAvailableImagesets]]
 * state variable. In standard practice there will be hundreds of available
 * imagesets of many different kinds.
 *
 * Imagesets may be uniquely identified by their associated image data [[url]].
 * (If you really need to have multiple imagesets associated with the same URL,
 * add a `#fragment` to the end.)
 */
 export interface ImagesetInfo {
  /** The URL of the image data. */
  url: string;

  /** The user-facing name of the imageset. */
  name: string;

  /** The type of the imageset: panorama, sky, ... */
  type: ImageSetType;

  /** An (application-specific) string giving some additional information about
   * the imageset. */
  description: string;

  /** The image filename extension(s) associated with this imageset.
   *
   * May include multiple extensions separated by spaces. May also start with a
   * leading period.
   */
  extension: string;
}

export interface SpreadSheetLayerInfo {
  /* The user-facing name of the layer */
  name: string;

  /* The internal GUID of the layer */
  id: string;

  /* The reference frame in which the data are defined. */
  referenceFrame: string;
}

export type CatalogLayerInfo = SpreadSheetLayerInfo | ImagesetInfo;

/**
 * Information about a selected source in the engine.
 * The values for right ascension and declination are given in radians.
 * `name` gives a string name for the source.
 * `catalogLayer` contains information about the layer, which varies
 * based on the layer type.
 * For a standard spreadsheet layer, see [[SpreadSheetLayerInfo]]
 * For a HiPS catalog, see [[ImagesetInfo]].
 * `layerData` contains all of the associated data for the source, 
 * which will depends on the contents of the particular catalog.
 * `zoomDeg`, if present, defines the FOV, in degrees, that WWT will
 * use when moving to the source.
 */
export interface Source {
  ra: number;
  dec: number;
  name: string;
  catalogLayer: CatalogLayerInfo;
  zoomDeg?: number;
  layerData: {
    [field: string]: string | undefined;
  };
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
  
export interface AddSourceMessage {

  /** The tag identifying this message type */
  type: "add_source";

  /** The source to be added */
  source: Source;
}

export function isAddSourceMessage(o: any): o is AddSourceMessage {
  return o.type === 'add_source' &&
      typeof o.source === 'object';
}
