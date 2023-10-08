// Copyright 2021-2023 the .NET Foundation
// Licensed under the MIT License

// Note: module-level docstring found in `index.ts`

export const ImageSetTypes = ["earth", "planet", "sky", "panorama", "solarSystem", "sandbox"] as const;
export type ImageSetType = (typeof ImageSetTypes)[number];

/** This class holds basic information about an imageset.
 *
 * Imagesets may be uniquely identified by their associated image data {@link url}.
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

/** Basic information abou a spreadsheet layer. */
export interface SpreadSheetLayerInfo {
  /* The user-facing name of the layer */
  name: string;

  /* The internal GUID of the layer */
  id: string;

  /* The reference frame in which the data are defined. */
  referenceFrame: string;
}

export type CatalogLayerInfo = SpreadSheetLayerInfo | ImagesetInfo;

/** Information about a selected source in the engine. */
export interface Source {
  /** The right ascension of the source, in radians. */
  ra: number;

  /** The declination of the source, in radians. */
  dec: number;

  /** A user-facing name for he source */
  name: string;

  /** Information about the layer containing the source. Details depend on
   * whether this is a spreadsheet/tabular layer (in which case it is
   * {@link SpreadSheetLayerInfo} or a HiPS progressive catalog layer (in which
   * case it is {@link ImagesetInfo}).
   */
  catalogLayer: CatalogLayerInfo;

  /** If present, defines the FOV setting (in degrees) that WWT will use when
   * moving to the source. */
  zoomDeg?: number;

  /** All associated data for the source, as a key-value map. The contents here
   * will depend on the contens of the catalog from which this source
   * originated. */
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

  /** An app/client session identifier. See the description for {@link ViewStateMessage.sessionId}.
   */
  sessionId: string;

  /** The most recent source that was added to the selection list. */
  mostRecentSource?: Source;

  /** The list of sources that are currently selected. */
  selectedSources?: Source[];
}

/** Manually add a selected source to the research app UI.
 *
 * The primary intended use case of this message is to allow saved UI state to
 * be reconstructed.
 */
export interface AddSourceMessage {
  /** The tag identifying this message type */
  type: "add_source";

  /** The source to be added */
  source: Source;
}

/** A type-guard function for {@link AddSourceMessage}. */
export function isAddSourceMessage(o: any): o is AddSourceMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return o.type === 'add_source' &&
    typeof o.source === 'object';
}

/** Modify whether the sources in a particular layer can be interactively
 * selected by the user.
 *
 * Sometimes you want to display a layer of sources, but you don't want the user
 * to be able to click on them for interactive selection. This message helps you
 * accomplish that.
 * 
 * See also {@link ModifyAllSelectabilityMessage}.
 */
export interface ModifySelectabilityMessage {
  /** The tag identifying this message type */
  type: "modify_selectability";

  /** The identifier of the layer to modify. */
  id: string;

  /** Whether to make the layer selectable. */
  selectable: boolean;
}

/** A type-guard function for {@link ModifySelectabilityMessage}. */
export function isModifySelectabilityMessage(o: any): o is ModifySelectabilityMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return o.type === 'modify_selectability' &&
    typeof o.id === 'string' &&
    typeof o.selectable === 'boolean';
}

/** Modify whether the sources in all layers can be interactively selected by
 * the user.
 *
 * Sometimes you want to display various tables of sources, but you don't want
 * the user to be able to click on them for interactive selection. This message
 * helps you accomplish that.
 *
 * See also {@link ModifySelectabilityMessage}.
 */
export interface ModifyAllSelectabilityMessage {

  /** The tag identifying this message type. */
  type: "modify_all_selectability";

  /** Whether to make all layers selectable. */
  selectable: boolean;
}

/** A type-guard function for {@link ModifyAllSelectabilityMessage}. */
export function isModifyAllSelectabilityMessage(o: any): o is ModifyAllSelectabilityMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return o.type === 'modify_all_selectability' &&
    typeof o.selectable === 'boolean';
}
