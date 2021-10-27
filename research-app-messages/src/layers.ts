// Copyright 2021 the .NET Foundation
// Licensed under the MIT License

/** Messages relating to layers.
 *
 * This module contains messages and types relating to various graphical layers
 * that can be added to the WWT view. However, note that the [[classicPywwt]]
 * module defines a bunch of messages on the same topic, especially concerning
 * imageset and data-table layers.
 *
 * The defined messages are:
 *
 * - [[LoadHipsCatalogMessage]] leading to [[LoadHipsCatalogCompletedMessage]]
 * - [[GetHipsCatalogDataInViewMessage]] leading to [[GetHipsCatalogDataInViewReply]]
 *
 * */

import { PywwtSpreadSheetLayerSetting } from './classic_pywwt';

/** Tell the app to load a named HiPS catalog into its view.
 *
 * HiPS catalogs are a bit funky because in some ways, they behave like
 * imagesets, while in other ways, they behave like data table layers.
 *
 * This message may result in a [[LoadHipsCatalogCompletedMessage]] reply, if
 * you specify the [[threadId]].
 */
export interface LoadHipsCatalogMessage {
  /** The tag identifying this message type. */
  event: 'layer_hipscat_load';

  /** An identifier for referring to this catalog as a table layer later. */
  tableId: string;

  /** The name of the catalog to load.
   *
   * The engine must "know about" this catalog by having loaded a WTML file that
   * defines it. It comes pre-loaded with a library of well-known catalogs. The
   * recognized catalog names can be learned through
   * [[ApplicationStateMessage.hipsCatalogNames]].
   */
  name: string;

  /** If specified, a "thread id" that will be used for a response message with
   * information about the table's contents.
   *
   * While HiPS catalogs resemble spreadsheet layers in many ways, they are
   * different in that clients don't know their table structure. If this item is
   * provided, the app will reply with a message conveying information about the
   * catalog's characteristics.
   */
  threadId?: string;
}

/** A type-guard function for [[LoadHipsCatalogMessage]]. */
export function isLoadHipsCatalogMessage(o: any): o is LoadHipsCatalogMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return o.event === 'layer_hipscat_load' &&
    typeof o.tableId === 'string' &&
    typeof o.name === 'string' &&
    (typeof o.threadId === 'undefined' || typeof o.threadId === 'string');
}

export interface LoadHipsCatalogCompletedMessage {
  /** The tag identifying this message type. */
  event: 'layer_hipscat_load_completed';

  /** The thread-ID for this response message. */
  threadId: string;

  /** Information about the catalog's spreadsheet characteristics. */
  spreadsheetInfo: SpreadSheetLayerInfo;
}

export function isLoadHipsCatalogCompletedMessage(o: any): o is LoadHipsCatalogCompletedMessage {
  return o.event == 'layer_hipscat_load_completed' &&
    typeof o.threadId == 'string' &&
    typeof o.spreadsheetInfo == 'object';
}

/** Information about a "spreadsheet" layer in the engine.
 *
 * This interface is used when a client needs to learn about a spreadsheet layer
 * that it didn't create.
 */
export interface SpreadSheetLayerInfo {
  /** The names of the columns in the data table. */
  header: string[];

  /** Various settings controlling the later's presentation. */
  settings: PywwtSpreadSheetLayerSetting[];
}


/** Ask the app to return the HiPS catalog data in the current viewport.
 *
 * This message will result in a [[GetHipsCatalogDataInViewReply]] if the
 * input parameters are all correct.
 */
export interface GetHipsCatalogDataInViewMessage {
  /** The tag identifying this message type. */
  event: 'layer_hipscat_datainview';

  /** A "thread id" that will be used for the response message with
   * the tabular data.
   */
  threadId: string;

  /** The client's identifier for this HiPS catalog. */
  tableId: string;

  /** Whether to limit the amount of data downloaded.
   *
   * It is *strongly* recommended that you set this to true. HiPS catalogs may
   * contain gigabytes of data, and if the viewport is zoomed out, an unlimited
   * request may attempt to download and transfer that much information.
   */
  limit: boolean;
}

/** A type-guard function for [[GetHipsCatalogDataInViewMessage]]. */
export function isGetHipsCatalogDataInViewMessage(o: any): o is GetHipsCatalogDataInViewMessage {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return o.event === 'layer_hipscat_datainview' &&
    typeof o.threadId === 'string' &&
    typeof o.tableId === 'string' &&
    typeof o.limit === 'boolean';
}

export interface GetHipsCatalogDataInViewReply {
  /** The tag identifying this message type. */
  event: 'layer_hipscat_datainview_reply';

  /** The threadId of the triggering message. */
  threadId: string;

  /** The table data, as tab-separated textual values with Windows (\r\n) newlines. */
  data: string;

  /** A flag indicating whether the data-fetch operation was aborted.
   *
   * The operation could potentially have been aborted due to a timeout or
   * hitting a limit on the amount of data to be returned at once.
   * */
  aborted: boolean;
}

/** A command to modify multiple table layer settings in a generic way.
 * 
 * This interface does not validate the setting names or their values.
 */
export interface MultiModifyTableLayerMessage {
  /** The tag identifying this message type */
  event: "table_layer_set_multi";

  /** The identifier of the layer to modify */
  id: string;

  /** The names of the settings to modify */
  settings: string[];

  /** The values for these settings, in the same order as the setting names */
  values: any[];
}

export function isMultiModifyTableLayerMessage(o: any): o is MultiModifyTableLayerMessage {
  return o.event === 'table_layer_set_multi' &&
    typeof o.id === 'string' &&
    typeof o.settings === 'object' &&
    typeof o.values === 'object';
}

/** A command to modify multiple FITS layer settings in a generic way.
 * 
 * This interface does not validate the setting names or their values.
 */
export interface MultiModifyFitsLayerMessage {
  /** The tag identifying this message type */
  event: "image_layer_set_multi";

  /** The identifier of the IFTS layer to modify */
  id: string;

  /** The names of the settings to modify */
  settings: string[];

  /** The values for these settings, in the same order as the setting names */
  values: any[];
}

export function isMultiModifyFitsLayerMessage(o: any): o is MultiModifyFitsLayerMessage {
  return o.event === 'image_layer_set_multi' &&
    typeof o.id === 'string' &&
    typeof o.settings === 'object' &&
    typeof o.values === 'object';
}
