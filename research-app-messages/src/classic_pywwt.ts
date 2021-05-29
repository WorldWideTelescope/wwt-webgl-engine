// Copyright 2020-2021 the .NET Foundation
// Licensed under the MIT License

/** Messages created for older versions of the
 * [pywwt](https://pywwt.readthedocs.io/) Python package.
 *
 * These can be grouped into the following categories:
 *
 * ### View Control
 *
 * - [[CenterOnCoordinatesMessage]]
 * - [[PauseTimeMessage]]
 * - [[ResumeTimeMessage]]
 * - [[SetDatetimeMessage]]
 * - [[SetViewerModeMessage]]
 * - [[TrackObjectMessage]]
 *
 * ### Image set Layers
 *
 * - [[CreateImageSetLayerMessage]]
 * - [[ModifyFitsLayerMessage]]
 * - [[RemoveImageSetLayerMessage]]
 * - [[SetFitsLayerColormapMessage]]
 * - [[StretchFitsLayerMessage]]
 *
 * ### Data Table Layers
 *
 * - [[CreateTableLayerMessage]]
 * - [[ModifyTableLayerMessage]]
 * - [[RemoveTableLayerMessage]]
 * - [[UpdateTableLayerMessage]]
 *
 * ### Image Sets
 *
 * - [[LoadImageCollectionMessage]]
 * - [[SetBackgroundByNameMessage]]
 * - [[SetForegroundByNameMessage]]
 * - [[SetForegroundOpacityMessage]]
 *
 * ### Annotations
 *
 * - [[AddLinePointMessage]]
 * - [[AddPolygonPointMessage]]
 * - [[ClearAnnotationsMessage]]
 * - [[CreateAnnotationMessage]]
 * - [[ModifyAnnotationMessage]]
 * - [[RemoveAnnotationMessage]]
 * - [[SetCircleCenterMessage]]
 *
 * ## Tours
 *
 * - [[LoadTourMessage]]
 * - [[PauseTourMessage]]
 * - [[ResumeTourMessage]]
 *
 * ## Miscellaneous
 *
 * - [[ModifySettingMessage]]
 */

// As far as I can tell, I have to implement all of these type guard functions manually :-(

/** A command to add a point to a line annotation.
*/
export interface AddLinePointMessage {
  /** The tag identifying this message type. */
  event: "line_add_point";

  /** The identifier of the annotation to modify. */
  id: string;

  /** The right ascension of the new point to add, in degrees. */
  ra: number;

  /** The declination of the new point to add, in degrees. */
  dec: number;
}

/** Type guard function for AddLinePointMessage. */
export function isAddLinePointMessage(o: any): o is AddLinePointMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "line_add_point" &&
    typeof o.id === "string" &&
    typeof o.ra === "number" &&
    typeof o.dec === "number";
}

/** A command to add a point to a polygon annotation.
*/
export interface AddPolygonPointMessage {
  /** The tag identifying this message type. */
  event: "polygon_add_point";

  /** The identifier of the annotation to modify. */
  id: string;

  /** The right ascension of the new point to add, in degrees. */
  ra: number;

  /** The declination of the new point to add, in degrees. */
  dec: number;
}

/** Type guard function for AddPolygonPointMessage. */
export function isAddPolygonPointMessage(o: any): o is AddPolygonPointMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "polygon_add_point" &&
    typeof o.id === "string" &&
    typeof o.ra === "number" &&
    typeof o.dec === "number";
}

/** A command to center the view on a new set of coordinates. */
export interface CenterOnCoordinatesMessage {
  /** The tag identifying this message type. */
  event: "center_on_coordinates";

  /** The right ascension to center on, in degrees */
  ra: number;

  /** The declination to center on, in degrees */
  dec: number;

  /** The field-of-view height (zoom level) to adopt, in degrees */
  fov: number;

  /** Whether the view should instantly snap to the specified location, or move
   * gradually.
   *
   * Because WWT must download imagery on-the-fly as it moves to new locations,
   * instant movement can result in a somewhat unpleasant user experience as new
   * low-resolution data have to be tiled in.
   */
  instant: boolean;

  /** Optional, The roll of the camera, in degrees */
  roll?: number;
}

/** Type guard function for CenterOnCoordinatesMessage. */
export function isCenterOnCoordinatesMessage(o: any): o is CenterOnCoordinatesMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "center_on_coordinates" &&
    typeof o.ra === "number" &&
    typeof o.dec === "number" &&
    typeof o.fov === "number" &&
    typeof o.instant === "boolean" &&
    (o.roll === undefined || typeof o.roll === "number");
}

/** A command to clear all of the current annotations. */
export interface ClearAnnotationsMessage {
  /** The tag identifying this message type. */
  event: "clear_annotations";
}

/** Type guard function for ClearAnnotationsMessage. */
export function isClearAnnotationsMessage(o: any): o is ClearAnnotationsMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "clear_annotations";
}


/** A command to create an annotation.
 *
 * The annotation will be created at the current view center location.
*/
export interface CreateAnnotationMessage {
  /** The tag identifying this message type. */
  event: "annotation_create";

  /** The annotation type. */
  shape: "circle" | "line" | "polygon";

  /** An identifier for referring to this annotation later. */
  id: string;
}

/** Type guard function for CreateAnnotationMessage. */
export function isCreateAnnotationMessage(o: any): o is CreateAnnotationMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "annotation_create" &&
    typeof o.shape === "string" &&
    (o.shape == "circle" || o.shape == "line" || o.shape == "polygon") &&
    typeof o.id === "string";
}


/** A command to create an image set layer. */
export interface CreateImageSetLayerMessage {
  /** The tag identifying this message type. */
  event: "image_layer_create";

  /** An identifier for referring to this image layer later. */
  id: string;

  /** The URL from which to obtain the FITS file or image set. */
  url: string;

  /** Tell WWT what type of layer you are Adding.
   * OR let WWT try to autodetect the type of the data.
   * Default, autodetect. */
  mode: "autodetect" | "fits" | "preloaded";

  /** Go to centre of the data. Defaults to true.*/
  goto?: boolean;
  }

/** Type guard function for CreateImageSetLayerMessage. */
export function isCreateImageSetLayerMessage(o: any): o is CreateImageSetLayerMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "image_layer_create" &&
    typeof o.id === "string" &&
    typeof o.url === "string" &&
    typeof o.mode  === "string" &&
    (o.mode == "autodetect" || o.mode == "fits" || o.mode == "preloaded") &&
    (o.goto === undefined || typeof o.goto === "boolean");
}

/** Deprecated, use CreateImageSetLayerMessage instead.
 *  A command to create a fits layer. */
export interface CreateFitsLayerMessage {
  /** The tag identifying this message type. */
  event: "image_layer_create";
  /** An identifier for referring to this fits layer later. */
  id: string;
  /** The URL from which to obtain the FITS file. */
  url: string;
}

/** Type guard function for CreateFitsLayerMessage. */
export function isCreateFitsLayerMessage(o: any): o is CreateFitsLayerMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "image_layer_create" &&
    typeof o.id === "string" &&
    typeof o.url === "string";
}

/** A command to set a layer's order in the draw cycle. */
export interface SetLayerOrderMessage {
  /** The tag identifying this message type. */
  event: "image_layer_order";
  /** An identifier for referring to this layer. */
  id: string;
  /** A sequence number, in case messages arrive out-of-order. */
  version: number;
  /** The prefered position of the layer in the draw cycle.
   * 0 being the first layer to be drawn. */
  order: number;
}

/** Type guard function for SetLayerOrderMessage. */
export function isSetLayerOrderMessage(o: any): o is SetLayerOrderMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "image_layer_order" &&
    typeof o.id === "string" &&
    typeof o.version === "number" &&
    typeof o.order === "number";
}

/** A command to create a table layer. */
export interface CreateTableLayerMessage {
  /** The tag identifying this message type. */
  event: "table_layer_create";

  /** An identifier for referring to this layer later. */
  id: string;

  /** The table data, as BASE64-encoded CSV data. */
  table: string;

  /** The reference frame in which the data are defined. TODO: details! */
  frame: string;
}

/** Type guard function for CreateTableLayerMessage. */
export function isCreateTableLayerMessage(o: any): o is CreateTableLayerMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "table_layer_create" &&
    typeof o.id === "string" &&
    typeof o.table === "string" &&
    typeof o.frame === "string";
}


/** A command to load a WTML image collection into the frontend's registry. */
export interface LoadImageCollectionMessage {
  /** The tag identifying this message type. */
  event: "load_image_collection";

  /** The URL of the collection to load. */
  url: string;

  /** Optional, Recursively load any child folders. Defaults to False*/
  loadChildFolders?: boolean;
}

/** Type guard function for LoadImageCollectionMessage. */
export function isLoadImageCollectionMessage(o: any): o is LoadImageCollectionMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "load_image_collection" &&
    typeof o.url === "string" &&
    (o.loadChildFolders === undefined || typeof o.loadChildFolders === "boolean");
}


/** A command to load and play a WWT guided tour file. */
export interface LoadTourMessage {
  /** The tag identifying this message type. */
  event: "load_tour";

  /** The URL of the collection to load. */
  url: string;
}

/** Type guard function for LoadTourMessage. */
export function isLoadTourMessage(o: any): o is LoadTourMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "load_tour" &&
    typeof o.url === "string";
}


/** A command to modify an annotation in a generic way.
 *
 * This interface does not validate the setting name or its value.
*/
export interface ModifyAnnotationMessage {
  /** The tag identifying this message type. */
  event: "annotation_set";

  /** The identifier of the annotation to modify. */
  id: string;

  /** The setting name. */
  setting: string;

  /** The setting value. */
  value: any;  // eslint-disable-line @typescript-eslint/no-explicit-any
}

/** Type guard function for ModifyAnnotationMessage. */
export function isModifyAnnotationMessage(o: any): o is ModifyAnnotationMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "annotation_set" &&
    typeof o.id === "string" &&
    typeof o.setting === "string" &&
    typeof o.value !== "undefined"; // note that this one is unusual
}


/** A command to modify a FITS layer in a generic way.
 *
 * This interface does not validate the setting name or its value.
*/
export interface ModifyFitsLayerMessage {
  /** The tag identifying this message type. */
  event: "image_layer_set";

  /** The identifier of the FITS layer to modify. */
  id: string;

  /** The setting name. */
  setting: string;

  /** The setting value. */
  value: any;  // eslint-disable-line @typescript-eslint/no-explicit-any
}

/** Type guard function for ModifyFitsLayerMessage. */
export function isModifyFitsLayerMessage(o: any): o is ModifyFitsLayerMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "image_layer_set" &&
    typeof o.id === "string" &&
    typeof o.setting === "string" &&
    typeof o.value !== "undefined"; // note that this one is unusual
}


/** A command to change a WWT engine setting.
 *
 * This interface does not validate the specified setting name.
*/
export interface ModifySettingMessage {
  /** The tag identifying this message type. */
  event: "setting_set";

  /** The setting name. */
  setting: string;

  /** The setting value. */
  value: any;  // eslint-disable-line @typescript-eslint/no-explicit-any
}

/** Type guard function for ModifySettingMessage. */
export function isModifySettingMessage(o: any): o is ModifySettingMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "setting_set" &&
    typeof o.setting === "string" &&
    typeof o.value !== "undefined"; // note that this one is unusual
}


/** A command to modify a table layer in a generic way.
 *
 * This interface does not validate the setting name or its value.
*/
export interface ModifyTableLayerMessage {
  /** The tag identifying this message type. */
  event: "table_layer_set";

  /** The identifier of the layer to modify. */
  id: string;

  /** The setting name. */
  setting: string;

  /** The setting value. */
  value: any;  // eslint-disable-line @typescript-eslint/no-explicit-any
}

/** Type guard function for ModifyTableLayerMessage. */
export function isModifyTableLayerMessage(o: any): o is ModifyTableLayerMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "table_layer_set" &&
    typeof o.id === "string" &&
    typeof o.setting === "string" &&
    typeof o.value !== "undefined"; // note that this one is unusual
}


/** A command to pause progress of WWT's internal clock. */
export interface PauseTimeMessage {
  /** The tag identifying this message type. */
  event: "pause_time";
}

/** Type guard function for PauseTimeMessage. */
export function isPauseTimeMessage(o: any): o is PauseTimeMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "pause_time";
}


/** A command to pause playback of the current tour. */
export interface PauseTourMessage {
  /** The tag identifying this message type. */
  event: "pause_tour";
}

/** Type guard function for PauseTourMessage. */
export function isPauseTourMessage(o: any): o is PauseTourMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "pause_tour";
}


/** A command to remove an annotation. */
export interface RemoveAnnotationMessage {
  /** The tag identifying this message type. */
  event: "remove_annotation";

  /** The identifier of the annotation to remove. */
  id: string;
}

/** Type guard function for RemoveAnnotationMessage. */
export function isRemoveAnnotationMessage(o: any): o is RemoveAnnotationMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "remove_annotation" &&
    typeof o.id === "string";
}


/** A command to remove a image set layer. */
export interface RemoveImageSetLayerMessage {
  /** The tag identifying this message type. */
  event: "image_layer_remove";

  /** The identifier of the layer to remove. */
  id: string;
}

/** Type guard function for RemoveImageSetLayerMessage. */
export function isRemoveImageSetLayerMessage(o: any): o is RemoveImageSetLayerMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "image_layer_remove" &&
    typeof o.id === "string";
}


/** A command to remove a table layer. */
export interface RemoveTableLayerMessage {
  /** The tag identifying this message type. */
  event: "table_layer_remove";

  /** The identifier of the layer to remove. */
  id: string;
}

/** Type guard function for RemoveTableLayerMessage. */
export function isRemoveTableLayerMessage(o: any): o is RemoveTableLayerMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "table_layer_remove" &&
    typeof o.id === "string";
}


/** A command to resume progress of WWT's internal clock. */
export interface ResumeTimeMessage {
  /** The tag identifying this message type. */
  event: "resume_time";

  /** The rate at which the WWT clock should progess, compared to real time. */
  rate: number;
}

/** Type guard function for ResumeTimeMessage. */
export function isResumeTimeMessage(o: any): o is ResumeTimeMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "resume_time" &&
    typeof o.rate === "number"
}


/** A command to resume playback of the current tour.
 *
 * Due to the way that WWT's tour playback control works, playback will start at
 * the beginning of the current slide, which may not be exactly where playback
 * was paused.
*/
export interface ResumeTourMessage {
  /** The tag identifying this message type. */
  event: "resume_tour";
}

/** Type guard function for ResumeTourMessage. */
export function isResumeTourMessage(o: any): o is ResumeTourMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "resume_tour";
}


/** A command to select the background imagery to show. */
export interface SetBackgroundByNameMessage {
  /** The tag identifying this message type. */
  event: "set_background_by_name";

  /** The name (partial or complete) of the imageset to use. */
  name: string;
}

/** Type guard function for SetBackgroundByNameMessage. */
export function isSetBackgroundByNameMessage(o: any): o is SetBackgroundByNameMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "set_background_by_name" &&
    typeof o.name === "string";
}


/** A command to modify an annotation in a generic way.
 *
 * This interface does not validate the setting name or its value.
*/
export interface SetCircleCenterMessage {
  /** The tag identifying this message type. */
  event: "circle_set_center";

  /** The identifier of the annotation to modify. */
  id: string;

  /** The new right ascension of the circle's center, in degrees. */
  ra: number;

  /** The new declination of the circle's center, in degrees. */
  dec: number;
}

/** Type guard function for SetCircleCenterMessage. */
export function isSetCircleCenterMessage(o: any): o is SetCircleCenterMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "circle_set_center" &&
    typeof o.id === "string" &&
    typeof o.ra === "number" &&
    typeof o.dec === "number";
}


/** A command to set the current value of the WWT clock. */
export interface SetDatetimeMessage {
  /** The tag identifying this message type. */
  event: "set_datetime";

  /** The date, in "ISO-T" (ISO 8601) format, e.g. "1995-12-17T03:24:00" */
  isot: string;
}

/** Type guard function for SetDatetimeMessage. */
export function isSetDatetimeMessage(o: any): o is SetDatetimeMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "set_datetime" &&
    typeof o.isot === "string";
}


/** A command to adjust the colormap used for a FITS image layer. */
export interface SetFitsLayerColormapMessage {
  /** The tag identifying this message type. */
  event: "image_layer_cmap";

  /** The identifier of the image layer to modify. */
  id: string;

  /** A sequence number, in case messages arrive out-of-order. */
  version: number;

  /** The name of the colormap to use. TODO: define these! */
  cmap: string;
}

/** Type guard function for SetFitsLayerColormapMessage. */
export function isSetFitsLayerColormapMessage(o: any): o is SetFitsLayerColormapMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "image_layer_cmap" &&
    typeof o.id === "string" &&
    typeof o.version === "number" &&
    typeof o.cmap === "string";
}


/** A command to select the foreground imagery to show. */
export interface SetForegroundByNameMessage {
  /** The tag identifying this message type. */
  event: "set_foreground_by_name";

  /** The name (partial or complete) of the imageset to use. */
  name: string;
}

/** Type guard function for SetForegroundByNameMessage. */
export function isSetForegroundByNameMessage(o: any): o is SetForegroundByNameMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "set_foreground_by_name" &&
    typeof o.name === "string";
}


/** A command to set the opacity of the foreground imagery. */
export interface SetForegroundOpacityMessage {
  /** The tag identifying this message type. */
  event: "set_foreground_opacity";

  /** The opacity value, between 0 and 100. */
  value: number;
}

/** Type guard function for SetForegroundOpacityMessage. */
export function isSetForegroundOpacityMessage(o: any): o is SetForegroundOpacityMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "set_foreground_opacity" &&
    typeof o.value === "number";
}


/** A command to set the WWT viewer mode.
 *
 * Implementations should set the foreground and background imagery by name to
 * the specified value. The WWT viewer mode is determined from the mode of its
 * currently active background imageset.
 */
export interface SetViewerModeMessage {
  /** The tag identifying this message type. */
  event: "set_viewer_mode";

  /** The "mode" string. This is really an imageset name that can be passed to
   * setForegroundImagesetByName or setBackgroundImagesetByName.
   */
  mode: string;
}

/** Type guard function for SetViewerModeMessage. */
export function isSetViewerModeMessage(o: any): o is SetViewerModeMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "set_viewer_mode" &&
    typeof o.mode === "string";
}


/** A command to adjust the "stretch" of a FITS image layer. */
export interface StretchFitsLayerMessage {
  /** The tag identifying this message type. */
  event: "image_layer_stretch";

  /** The identifier of the image layer to modify. */
  id: string;

  /** A sequence number, in case messages arrive out-of-order. */
  version: number;

  /** The kind of stretch type to use. TODO: enum-ify! 0..4 = lin/log/pow/sqrt/histeq */
  stretch: number;

  /** The data value to use for the minimum stretch bound. */
  vmin: number;

  /** The data value to use for the maximum stretch bound. */
  vmax: number;
}

/** Type guard function for StretchFitsLayerMessage. */
export function isStretchFitsLayerMessage(o: any): o is StretchFitsLayerMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "image_layer_stretch" &&
    typeof o.id === "string" &&
    typeof o.version === "number" &&
    typeof o.stretch === "number" &&
    typeof o.vmin === "number" &&
    typeof o.vmax === "number";
}


/** A command to tell WWT to track an object in its view.
 */
export interface TrackObjectMessage {
  /** The tag identifying this message type. */
  event: "track_object";

  /** The SolarSystemObjects code of the object to track. */
  code: number;
}

/** Type guard function for TrackObjectMessage. */
export function isTrackObjectMessage(o: any): o is TrackObjectMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "track_object" &&
    typeof o.code === "number";
}


/** A command to update a table layer. */
export interface UpdateTableLayerMessage {
  /** The tag identifying this message type. */
  event: "table_layer_update";

  /** An identifier for referring to this layer later. */
  id: string;

  /** The table data, as BASE64-encoded CSV data. */
  table: string;
}

/** Type guard function for UpdateTableLayerMessage. */
export function isUpdateTableLayerMessage(o: any): o is UpdateTableLayerMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof o.event === "string" &&
    o.event == "table_layer_update" &&
    typeof o.id === "string" &&
    typeof o.table === "string";
}


export type PywwtMessage =
  AddLinePointMessage |
  AddPolygonPointMessage |
  CenterOnCoordinatesMessage |
  ClearAnnotationsMessage |
  CreateAnnotationMessage |
  CreateImageSetLayerMessage |
  CreateTableLayerMessage |
  LoadImageCollectionMessage |
  LoadTourMessage |
  ModifyAnnotationMessage |
  ModifyFitsLayerMessage |
  ModifyTableLayerMessage |
  ModifySettingMessage |
  PauseTimeMessage |
  PauseTourMessage |
  RemoveAnnotationMessage |
  RemoveImageSetLayerMessage |
  RemoveTableLayerMessage |
  ResumeTourMessage |
  ResumeTimeMessage |
  SetBackgroundByNameMessage |
  SetCircleCenterMessage |
  SetDatetimeMessage |
  SetFitsLayerColormapMessage |
  SetForegroundByNameMessage |
  SetForegroundOpacityMessage |
  SetViewerModeMessage |
  StretchFitsLayerMessage |
  TrackObjectMessage |
  UpdateTableLayerMessage;


/** If the input object is a classic pywwt message, rewrite any relative URLs
 * that it contains.
 *
 * The motivation for this function is to allow data exchange from a
 * Jupyter(Lab) server to the WWT research app. It is possible to publish data
 * by hooking into the Jupyter server, but that layer of code doesn't always
 * know the URL at which it is exposed to the world. So, such layers need to
 * supply relative URLs in their messages, and then the JavaScript layer needs
 * to modify those messages to turn them into absolute URLs. That's what this
 * function enables. The input is modified in-place.
*/
export function applyBaseUrlIfApplicable(o: any, baseurl: string): void {  // eslint-disable-line @typescript-eslint/no-explicit-any
  if (isCreateImageSetLayerMessage(o)) {
    o.url = new URL(o.url, baseurl).toString();
  } else if (isLoadImageCollectionMessage(o)) {
    o.url = new URL(o.url, baseurl).toString();
  } else if (isLoadTourMessage(o)) {
    o.url = new URL(o.url, baseurl).toString();
  }
}

/** Spreadsheet/table layer setting values as serialized in pywwt. Enumerations
 * are given stringy values, columns are mapped from indices to names, etc.
 */
export type PywwtSpreadSheetLayerSetting =
  ["altColumn", string | number] | // pywwt customization
  ["altType", string] | // pywwt customization
  ["altUnit", string] | // pywwt customization
  ["astronomical", boolean] |
  ["barChartBitmask", number] |
  ["beginRange", Date] |
  ["cartesianCustomScale", number] |
  ["cartesianScale", string] | // pywwt customization
  ["color", string] | // pywwt customization
  ["colorMapColumn", string | number] | // pywwt customization
  ["colorMapperName", string] |
  ["coordinatesType", string] | // pywwt customization
  ["decay", number] |
  ["dynamicColor", boolean] |
  ["dynamicData", boolean] |
  ["endDateColumn", string | number] | // pywwt customization
  ["endRange", Date] |
  ["fadeSpan", number] |
  ["geometryColumn", string | number] | // pywwt customization
  ["hyperlinkColumn", string | number] | // pywwt customization
  ["hyperlinkFormat", string] |
  ["latColumn", string | number] | // pywwt customization
  ["lngColumn", string | number] | // pywwt customization
  ["markerColumn", string | number] | // pywwt customization
  ["markerIndex", number] |
  ["markerScale", string] | // pywwt customization
  ["name", string] |
  ["nameColumn", string | number] | // pywwt customization
  ["normalizeColorMap", boolean] |
  ["normalizeColorMapMax", number] |
  ["normalizeColorMapMin", number] |
  ["normalizeSize", boolean] |
  ["normalizeSizeClip", boolean] |
  ["normalizeSizeMax", number] |
  ["normalizeSizeMin", number] |
  ["opacity", number] |
  ["opened", boolean] |
  ["plotType", string] | // pywwt customization
  ["pointScaleType", number] | // pywwt customization -- but unlike other enums, a number not a string
  ["raUnits", string] | // pywwt customization
  ["referenceFrame", string] |
  ["scaleFactor", number] |
  ["showFarSide", boolean] |
  ["sizeColumn", string | number] | // pywwt customization
  ["startDateColumn", string | number] | // pywwt customization
  ["timeSeries", boolean] |
  ["version", number] |
  ["xAxisColumn", string | number] | // pywwt customization
  ["xAxisReverse", boolean] |
  ["yAxisColumn", string | number] | // pywwt customization
  ["yAxisReverse", boolean] |
  ["zAxisColumn", string | number] | // pywwt customization
  ["zAxisReverse", boolean];

const pywwtSpreadSheetLayerSettingTypeInfo: {[i: string]: boolean} = {
  "altColumn/string": true,
  "altColumn/number": true,
  "altType/string": true,
  "altUnit/string": true,
  "astronomical/boolean": true,
  "barChartBitmask/number": true,
  "beginRange/Date": true,
  "cartesianCustomScale/number": true,
  "cartesianScale/string": true,
  "color/string": true,
  "colorMapColumn/string": true,
  "colorMapColumn/number": true,
  "colorMapperName/string": true,
  "coordinatesType/string": true,
  "decay/number": true,
  "dynamicColor/boolean": true,
  "dynamicData/boolean": true,
  "endDateColumn/string": true,
  "endDateColumn/number": true,
  "endRange/Date": true,
  "fadeSpan/number": true,
  "geometryColumn/string": true,
  "geometryColumn/number": true,
  "hyperlinkColumn/string": true,
  "hyperlinkColumn/number": true,
  "hyperlinkFormat/string": true,
  "latColumn/string": true,
  "latColumn/number": true,
  "lngColumn/string": true,
  "lngColumn/number": true,
  "markerColumn/string": true,
  "markerColumn/number": true,
  "markerIndex/number": true,
  "markerScale/string": true,
  "name/string": true,
  "nameColumn/string": true,
  "nameColumn/number": true,
  "normalizeColorMap/boolean": true,
  "normalizeColorMapMax/number": true,
  "normalizeColorMapMin/number": true,
  "normalizeSize/boolean": true,
  "normalizeSizeClip/boolean": true,
  "normalizeSizeMax/number": true,
  "normalizeSizeMin/number": true,
  "opacity/number": true,
  "opened/boolean": true,
  "plotType/string": true,
  "pointScaleType/number": true,
  "raUnits/string": true,
  "referenceFrame/string": true,
  "scaleFactor/number": true,
  "showFarSide/boolean": true,
  "sizeColumn/string": true,
  "sizeColumn/number": true,
  "startDateColumn/string": true,
  "startDateColumn/number": true,
  "timeSeries/boolean": true,
  "version/number": true,
  "xAxisColumn/string": true,
  "xAxisColumn/number": true,
  "xAxisReverse/boolean": true,
  "yAxisColumn/string": true,
  "yAxisColumn/number": true,
  "yAxisReverse/boolean": true,
  "zAxisColumn/string": true,
  "zAxisColumn/number": true,
  "zAxisReverse/boolean": true,
};

/** Type guard function for PywwtSpreadSheetSetting. */
export function isPywwtSpreadSheetLayerSetting(obj: [string, any]): obj is PywwtSpreadSheetLayerSetting {  // eslint-disable-line @typescript-eslint/no-explicit-any
  const key = obj[0] + "/" + typeof obj[1];
  return (key in pywwtSpreadSheetLayerSettingTypeInfo);
}
