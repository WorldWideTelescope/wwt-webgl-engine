import { ss } from "./ss.js";
import { registerType, registerEnum } from "./typesystem.js";

import {
  Util,
  Rectangle,
  Guid,
  Mouse,
} from "./util.js";

import {
  globalRenderContext,
  tileCacheGetTile,
  useGlVersion2,
  set_globalRenderContext,
  set_tileDemEnabled,
  set_tilePrepDevice,
  set_tileUvMultiple,
  set_useGl,
  set_useGlVersion2,
} from "./render_globals.js";

import {
  globalScriptInterface,
  globalWWTControl,
  layerManagerGetAllMaps,
  makeNewHipsProperties,
  set_freestandingMode,
  set_globalScriptInterface,
  set_globalWWTControl,
  set_makeNewFolder,
  set_makeNewHipsProperties,
} from "./data_globals.js";

import { BlendState } from "./blend_state.js";
import { Color, Colors } from "./color.js";
import { URLHelpers } from "./url_helpers.js";

import {
  PositionTexture,
  PositionColoredTextured,
  Vector3d,
  Vector2d,
  Matrix3d,
  DoubleUtilities,
  PlaneD,
  Vector4d,
} from "./double3d.js";

import { WEBGL } from "./graphics/webgl_constants.js";
import { PositionTextureVertexBuffer } from "./graphics/gl_buffers.js"
import { Texture } from "./graphics/texture.js";
import { TileShader } from "./graphics/shaders.js";

import {
  SimpleLineList,
  OrbitLineList,
} from "./graphics/primitives3d.js";

import { Sprite2d } from "./graphics/sprite2d.js";

import { Coordinates } from "./coordinates.js";
import { IThumbnail } from "./interfaces.js";

import { Annotation, Circle, Poly, PolyLine } from "./annotation.js";
import { BasePlanets } from "./baseplanets.js";
import { CameraParameters } from "./camera_parameters.js";
import { WebFile } from "./web_file.js";
import { UiTools } from "./ui_tools.js";

import { FitsImage } from "./layers/fits_image.js";
import { FitsImageJs } from "./layers/fits_image_js.js";

import { RenderTriangle } from "./render_triangle.js";
import { Triangle } from "./triangle.js";
import { Tile } from "./tile.js";
import { ProjectionType, ImageSetType, Imageset } from "./imageset.js";
import { Settings } from "./settings.js";
import { Constellations } from "./constellations.js";
import { SpaceTimeController } from "./space_time_controller.js";
import { Planets } from "./planets.js";
import { Place } from "./place.js";
import { FolderUp } from "./folder_up.js";
import { Grids } from "./grids.js";
import { KeplerVertex } from "./kepler_vertex.js";
import { MinorPlanets } from "./minor_planets.js";
import { TileCache } from "./tile_cache.js";
import { Tour } from "./tour.js";
import { VideoOutputType } from "./video_output_type.js";
import { ViewMoverSlew, ViewMoverKenBurnsStyle } from "./view_mover.js";
import { Dialog } from "./utilities/dialog.js";

import { Layer } from "./layers/layer.js";
import { GreatCirlceRouteLayer } from "./layers/great_circle_route_layer.js";
import { GridLayer } from "./layers/grid_layer.js";
import { ImageSetLayer } from "./layers/imageset_layer.js";
import { Object3dLayer } from "./layers/object3d.js";
import { EllipseRenderer } from "./layers/orbit.js";
import { OrbitLayer } from "./layers/orbit_layer.js";
import { VoTable } from "./layers/vo_table.js";

import { TourPlayer } from "./tours/tour_player.js";

import { SpreadSheetLayer, CatalogSpreadSheetLayer } from "./layers/spreadsheet_layer.js";
import { VoTableLayer } from "./layers/vo_table_layer.js";
import { LayerManager } from "./layers/layer_manager.js";

import { TourDocument } from "./tours/tour_document.js";
import { TourEditTab } from "./tours/tour_edit.js";


// wwtlib.PointType

export var PointType = {
  move: 0,
  line: 1,
  dash: 2,
  start: 3
};

registerType("PointType", PointType);
registerEnum("PointType", PointType);

// wwtlib.FolderGroup

export var FolderGroup = {
  explorer: 0,
  tour: 1,
  search: 2,
  constellation: 3,
  view: 4,
  goTo: 5,
  community: 6,
  context: 7,
  voTable: 8,
  imageStack: 9
};

registerType("FolderGroup", FolderGroup);
registerEnum("FolderGroup", FolderGroup);

// wwtlib.FolderRefreshType

export var FolderRefreshType = {
  interval: 0,
  conditionalGet: 1,
  viewChange: 2
};

registerType("FolderRefreshType", FolderRefreshType);
registerEnum("FolderRefreshType", FolderRefreshType);

// wwtlib.FolderType

export var FolderType = {
  earth: 0,
  planet: 1,
  sky: 2,
  panorama: 3
};

registerType("FolderType", FolderType);
registerEnum("FolderType", FolderType);

// wwtlib.ThumbnailSize

export var ThumbnailSize = {
  small: 0,
  big: 1
};

registerType("ThumbnailSize", ThumbnailSize);
registerEnum("ThumbnailSize", ThumbnailSize);

// wwtlib.Classification
//
// This was defined in `IPlace.cs`, which we've folded into `interfaces.js`.

export var Classification = {
  star: 1,
  supernova: 2,
  blackHole: 4,
  neutronStar: 8,
  doubleStar: 16,
  multipleStars: 32,
  asterism: 64,
  constellation: 128,
  openCluster: 256,
  globularCluster: 512,
  nebulousCluster: 1024,
  nebula: 2048,
  emissionNebula: 4096,
  planetaryNebula: 8192,
  reflectionNebula: 16384,
  darkNebula: 32768,
  giantMolecularCloud: 65536,
  supernovaRemnant: 131072,
  interstellarDust: 262144,
  quasar: 524288,
  galaxy: 1048576,
  spiralGalaxy: 2097152,
  irregularGalaxy: 4194304,
  ellipticalGalaxy: 8388608,
  knot: 16777216,
  plateDefect: 33554432,
  clusterOfGalaxies: 67108864,
  otherNGC: 134217728,
  unidentified: 268435456,
  solarSystem: 536870912,
  unfiltered: 1073741823,
  stellar: 63,
  stellarGroupings: 2032,
  nebulae: 523264,
  galactic: 133693440,
  other: 436207616
};

registerType("Classification", Classification);
registerEnum("Classification", Classification);

// wwtlib.StockSkyOverlayTypes
//
// This was defined in `Tours/ISettings.cs`, which we've folded into `interfaces.js`.

export var StockSkyOverlayTypes = {
  empty: 0,
  equatorialGrid: 1,
  equatorialGridText: 2,
  galacticGrid: 3,
  galacticGridText: 4,
  eclipticGrid: 5,
  eclipticGridText: 6,
  eclipticOverview: 7,
  eclipticOverviewText: 8,
  precessionChart: 9,
  altAzGrid: 10,
  altAzGridText: 11,
  constellationFigures: 12,
  constellationBoundaries: 13,
  constellationFocusedOnly: 14,
  constellationNames: 15,
  constellationPictures: 16,
  fadeToBlack: 17,
  fadeToLogo: 18,
  fadeToGradient: 19,
  screenBroadcast: 20,
  fadeRemoteOnly: 21,
  skyGrids: 22,
  constellations: 23,
  solarSystemStars: 24,
  solarSystemMilkyWay: 25,
  solarSystemCosmos: 26,
  solarSystemOrbits: 27,
  solarSystemPlanets: 28,
  solarSystemAsteroids: 29,
  solarSystemLighting: 30,
  solarSystemMinorOrbits: 31,
  showEarthCloudLayer: 32,
  showElevationModel: 33,
  showAtmosphere: 34,
  multiResSolarSystemBodies: 35,
  auroraBorialis: 36,
  earthCutAway: 37,
  showSolarSystem: 38,
  clouds8k: 39,
  filedOfView: 40,
  showISSModel: 41,
  solarSystemCMB: 42,
  mpcZone1: 43,
  mpcZone2: 44,
  mpcZone3: 45,
  mpcZone4: 46,
  mpcZone5: 47,
  mpcZone6: 48,
  mpcZone7: 49,
  orbitFilters: 50
};

registerType("StockSkyOverlayTypes", StockSkyOverlayTypes);
registerEnum("StockSkyOverlayTypes", StockSkyOverlayTypes);

// wwtlib.DialogResult

export var DialogResult = {
  OK: 1
};

registerType("DialogResult", DialogResult);
registerEnum("DialogResult", DialogResult);

// wwtlib.Formatting

export var Formatting = {
  indented: 1
};

registerType("Formatting", Formatting);
registerEnum("Formatting", Formatting);

// GFX

export function GFX() { }

registerType("GFX", [GFX, null, null]);

// wwtlib.HipsProperties

export function HipsProperties(dataset) {
  this._properties = {};
  this._catalogColumnInfo = null;
  this._catalogSpreadSheetLayer = new CatalogSpreadSheetLayer();
  this._downloadComplete = false;
  this.dataset = dataset;
  this._datasetName = dataset.get_name();
  this._url = dataset.get_url();
  if (this._url.toLowerCase().indexOf('norder') > -1) {
    this._url = this._url.substring(0, this._url.toLowerCase().indexOf('norder'));
  }
  this._url += 'properties';
  this._download();
}

var HipsProperties$ = {
  get_properties: function () {
    return this._properties;
  },

  get_catalogSpreadSheetLayer: function () {
    return this._catalogSpreadSheetLayer;
  },

  set_catalogSpreadSheetLayer: function (value) {
    this._catalogSpreadSheetLayer = value;
    return value;
  },

  get_catalogColumnInfo: function () {
    return this._catalogColumnInfo;
  },

  set_catalogColumnInfo: function (value) {
    this._catalogColumnInfo = value;
    return value;
  },

  get_downloadComplete: function () {
    return this._downloadComplete;
  },

  _download: function () {
    this._webFile = new WebFile(this._url);
    this._webFile.onStateChange = ss.bind('_onPropertiesDownloadComplete', this);
    this._webFile.send();
  },

  _onPropertiesDownloadComplete: function () {
    if (this._webFile.get_state() === 1) {
      this._parseProperties(this._webFile.getText());
      if (ss.keyExists(this.get_properties(), 'dataproduct_type') && this.get_properties()['dataproduct_type'].toLowerCase() === 'catalog') {
        this._catalogColumnInfo = VoTable.loadFromUrl(ss.replaceString(this._url, '/properties', '/metadata.xml'), ss.bind('_onCatalogMetadataDownloadComplete', this));
      }
      else {
        if (ss.keyExists(this.get_properties(), 'hips_data_range')) {
          var hips_data_range = this.get_properties()['hips_data_range'];
          this.dataset.get_fitsProperties().minVal = parseFloat(hips_data_range.split(' ')[0]);
          this.dataset.get_fitsProperties().maxVal = parseFloat(hips_data_range.split(' ')[1]);
          this.dataset.get_fitsProperties().lowerCut = this.dataset.get_fitsProperties().minVal;
          this.dataset.get_fitsProperties().upperCut = this.dataset.get_fitsProperties().maxVal;
        }
        if (ss.keyExists(this.get_properties(), 'hips_pixel_cut')) {
          var hips_pixel_cut = this.get_properties()['hips_pixel_cut'];
          this.dataset.get_fitsProperties().lowerCut = parseFloat(hips_pixel_cut.split(' ')[0]);
          this.dataset.get_fitsProperties().upperCut = parseFloat(hips_pixel_cut.split(' ')[1]);
          if (!ss.keyExists(this.get_properties(), 'hips_data_range')) {
            this.dataset.get_fitsProperties().minVal = this.dataset.get_fitsProperties().lowerCut;
            this.dataset.get_fitsProperties().maxVal = this.dataset.get_fitsProperties().upperCut;
          }
        }
        this._downloadComplete = true;
        if (this._onDownloadComplete != null) {
          this._onDownloadComplete();
        }
      }
    }
  },

  _onCatalogMetadataDownloadComplete: function () {
    this._catalogSpreadSheetLayer.useHeadersFromVoTable(this._catalogColumnInfo);
    this._catalogSpreadSheetLayer.set_name(this._datasetName);
    this._catalogSpreadSheetLayer.id = Guid.createFrom(this._datasetName);
    LayerManager.addSpreadsheetLayer(this.get_catalogSpreadSheetLayer(), 'Sky');
    this._downloadComplete = true;
    if (this._onDownloadComplete != null) {
      this._onDownloadComplete();
    }
  },

  setDownloadCompleteListener: function (listener) {
    this._onDownloadComplete = listener;
  },

  _parseProperties: function (data) {
    var lines = data.split('\n');
    var $enum1 = ss.enumerate(lines);
    while ($enum1.moveNext()) {
      var line = $enum1.current;
      if (!ss.whitespace(line) && !ss.startsWith(line, '#')) {
        var parts = line.split('=');
        if (parts.length === 2) {
          var key = ss.trim(parts[0]);
          var val = ss.trim(parts[1]);
          if (!ss.whitespace(key) && !ss.whitespace(val)) {
            this.get_properties()[key] = val;
          }
        }
      }
    }
  }
};

registerType("HipsProperties", [HipsProperties, HipsProperties$, null]);

set_makeNewHipsProperties(function (imageset) {
  return new HipsProperties(imageset);
});


// wwtlib.Folder
// requires: Place, Imageset, Tour, FolderUp

export function Folder() {
  this.parent = null;
  this.isProxy = false;
  this._versionDependent = false;
  this._readOnly = true;
  this._dirty = false;
  this._thumbnail = null;
  this._proxyFolder = null;
  this._lastUpdate = new Date();
  this._childList = [];
  this._itemsField = [];
  this._imagesets = [];
  this._tours = [];
  this._folders = [];
  this._places = [];
  this._groupField = 0;
  this._refreshTypeField = 0;
  this._refreshTypeFieldSpecified = false;
  this._browseableField = true;
  this._browseableFieldSpecified = false;
  this._searchableField = false;
  this._typeField = 0;
  this._communityIdField = 0;
  this._componentIdField = 0;
  this._permissionField = 0;
}

var Folder$ = {
  toString: function () {
    return this._nameField;
  },

  get_versionDependent: function () {
    return this._versionDependent;
  },

  set_versionDependent: function (value) {
    this._versionDependent = value;
    var $enum1 = ss.enumerate(this._folders);
    while ($enum1.moveNext()) {
      var folder = $enum1.current;
      folder.set_versionDependent(this._versionDependent);
    }
    return value;
  },

  get_readOnly: function () {
    return this._readOnly;
  },

  set_readOnly: function (value) {
    this._readOnly = value;
    return value;
  },

  get_dirty: function () {
    return this._dirty;
  },

  set_dirty: function (value) {
    this._dirty = value;
    return value;
  },

  loadFromUrlWithErrorCallback: function (url, complete, onError) {
    this._onError = onError;
    this.loadFromUrl(url, complete);
  },

  loadFromUrl: function (url, complete) {
    this._onComplete = complete;
    this._webFile = new WebFile(URLHelpers.singleton.rewrite(url, 1));
    this._webFile.onStateChange = ss.bind('_loadData', this);
    this._webFile.send();
  },

  _loadData: function () {
    if (this._webFile.get_state() === 2) {
      console.error(this._webFile.get_message());
      if (this._onError != null) {
        this._onError();
      }
    } else if (this._webFile.get_state() === 1) {
      var node = Util.selectSingleNode(this._webFile.getXml(), 'Folder');
      if (node == null) {
        var doc = this._webFile.getXml();
        if (doc != null) {
          node = Util.selectSingleNode(doc, 'Folder');
        }
      }
      if (node != null) {
        this._clearChildren();
        this._parseXML(node);
      }
      if (this._onComplete != null) {
        this._onComplete();
      }
    }
  },

  _clearChildren: function () {
    this._folders.length = 0;
    this._tours.length = 0;
    this._places.length = 0;
    this.get_imagesets().length = 0;
  },

  _parseXML: function (node) {
    if (node.attributes.getNamedItem('Name') != null) {
      this._nameField = node.attributes.getNamedItem('Name').nodeValue;
    } else {
      this._nameField = '';
    }
    if (node.attributes.getNamedItem('Url') != null) {
      this._urlField = node.attributes.getNamedItem('Url').nodeValue;
    }
    if (node.attributes.getNamedItem('Thumbnail') != null) {
      this._thumbnailUrlField = node.attributes.getNamedItem('Thumbnail').nodeValue;
    }
    var $enum1 = ss.enumerate(node.childNodes);
    while ($enum1.moveNext()) {
      var child = $enum1.current;
      switch (child.nodeName) {
        case 'Folder':
          var temp = new Folder();
          temp.parent = this;
          temp._parseXML(child);
          this._folders.push(temp);
          break;
        case 'Place':
          this._places.push(Place._fromXml(child));
          break;
        case 'ImageSet':
          this.get_imagesets().push(Imageset.fromXMLNode(child));
          break;
        case 'Tour':
          this.get_tours().push(Tour._fromXml(child));
          break;
      }
    }
  },

  addChildFolder: function (child) {
    this._folders.push(child);
    this._dirty = true;
  },

  removeChildFolder: function (child) {
    ss.remove(this._folders, child);
    this._dirty = true;
  },

  addChildPlace: function (child) {
    this._places.push(child);
    this._dirty = true;
  },

  removeChildPlace: function (child) {
    ss.remove(this._places, child);
    this._dirty = true;
  },

  get_thumbnail: function () {
    return this._thumbnail;
  },

  set_thumbnail: function (value) {
    this._thumbnail = value;
    return value;
  },

  get_bounds: function () {
    return this._bounds;
  },

  set_bounds: function (value) {
    this._bounds = value;
    return value;
  },

  get_isImage: function () {
    return false;
  },

  get_isTour: function () {
    return false;
  },

  get_isFolder: function () {
    return true;
  },

  get_isCloudCommunityItem: function () {
    return !!this._communityIdField || this._permissionField > 0;
  },

  refresh: function () {
    if (this._proxyFolder == null) {
      this._proxyFolder = new Folder();
      this._proxyFolder.isProxy = true;
      this._proxyFolder.parent = this.parent;
    }
    this._proxyFolder.loadFromUrlWithErrorCallback(this._urlField, this._childReadyCallback, this._childReadyCallback);
    this._childReadyCallback = null;
  },

  childLoadCallback: function (callback) {
    this._childReadyCallback = callback;
    var temp = this.get_children();
    if (this._proxyFolder == null) {
      callback();
    }
  },

  get_children: function () {
    if (ss.emptyString(this._urlField)) {
      this._childList.length = 0;
      if (this.parent != null) {
        var folderUp = new FolderUp();
        folderUp.parent = this.parent;
        this._childList.push(folderUp);
      }
      if (this.get_folders() != null) {
        var $enum1 = ss.enumerate(this.get_folders());
        while ($enum1.moveNext()) {
          var folder = $enum1.current;
          this._childList.push(folder);
        }
      }
      if (this.get_imagesets() != null) {
        var $enum2 = ss.enumerate(this.get_imagesets());
        while ($enum2.moveNext()) {
          var imset = $enum2.current;
          this._childList.push(imset);
        }
      }
      if (this.get_places() != null) {
        var $enum3 = ss.enumerate(this.get_places());
        while ($enum3.moveNext()) {
          var place = $enum3.current;
          this._childList.push(place);
        }
      }
      if (this.get_tours() != null) {
        var $enum4 = ss.enumerate(this.get_tours());
        while ($enum4.moveNext()) {
          var tour = $enum4.current;
          this._childList.push(tour);
        }
      }
      return this._childList;
    } else {
      var ts = (this._lastUpdate - ss.now()) / 1000;
      if (this.get_refreshType() === 1 || this._proxyFolder == null || (!this.get_refreshType() && (parseInt(this._refreshIntervalField) < ts))) {
        this.refresh();
      }
      if (this._proxyFolder != null) {
        return this._proxyFolder.get_children();
      }
      else {
        return null;
      }
    }
  },

  get_msrCommunityId: function () {
    return this._communityIdField;
  },

  set_msrCommunityId: function (value) {
    this._communityIdField = value;
    return value;
  },

  get_msrComponentId: function () {
    return this._componentIdField;
  },

  set_msrComponentId: function (value) {
    this._componentIdField = value;
    return value;
  },

  get_permission: function () {
    return this._permissionField;
  },

  set_permission: function (value) {
    this._permissionField = value;
    return value;
  },

  get_folders: function () {
    return this._folders;
  },

  set_folders: function (value) {
    this._folders = value;
    return value;
  },

  get_places: function () {
    return this._places;
  },

  set_places: function (value) {
    this._places = value;
    return value;
  },

  get_imagesets: function () {
    return this._imagesets;
  },

  set_imagesets: function (value) {
    this._imagesets = value;
    return value;
  },

  get_tours: function () {
    return this._tours;
  },

  set_tours: function (value) {
    this._tours = value;
    return value;
  },

  get_name: function () {
    if (this._nameField == null) {
      return '';
    } else {
      return this._nameField;
    }
  },

  set_name: function (value) {
    this._nameField = value;
    return value;
  },

  get_group: function () {
    return this._groupField;
  },

  set_group: function (value) {
    this._groupField = value;
    return value;
  },

  get_url: function () {
    return this._urlField;
  },

  set_url: function (value) {
    this._urlField = value;
    return value;
  },

  get_thumbnailUrl: function () {
    if (ss.emptyString(this._thumbnailUrlField)) {
      return URLHelpers.singleton.engineAssetUrl('thumb_folder.jpg');
    }
    return this._thumbnailUrlField;
  },

  set_thumbnailUrl: function (value) {
    this._thumbnailUrlField = value;
    return value;
  },

  get_refreshType: function () {
    return this._refreshTypeField;
  },

  set_refreshType: function (value) {
    this._refreshTypeField = value;
    this.set_refreshTypeSpecified(true);
    return value;
  },

  get_refreshTypeSpecified: function () {
    return this._refreshTypeFieldSpecified;
  },

  set_refreshTypeSpecified: function (value) {
    this._refreshTypeFieldSpecified = value;
    return value;
  },

  get_refreshInterval: function () {
    return this._refreshIntervalField;
  },

  set_refreshInterval: function (value) {
    this._refreshIntervalField = value;
    return value;
  },

  get_browseable: function () {
    return this._browseableField;
  },

  set_browseable: function (value) {
    this._browseableField = value;
    this._browseableFieldSpecified = true;
    return value;
  },

  get_browseableSpecified: function () {
    return this._browseableFieldSpecified;
  },

  set_browseableSpecified: function (value) {
    this._browseableFieldSpecified = value;
    return value;
  },

  get_searchable: function () {
    return this._searchableField;
  },

  set_searchable: function (value) {
    this._searchableField = value;
    return value;
  },

  get_type: function () {
    return this._typeField;
  },

  set_type: function (value) {
    this._typeField = value;
    return value;
  },

  get_subType: function () {
    return this._subTypeField;
  },

  set_subType: function (value) {
    this._subTypeField = value;
    return value;
  }
};

registerType("Folder", [Folder, Folder$, null, IThumbnail]);

set_makeNewFolder(function () {
  return new Folder();
});


// wwtlib.FolderBrowser
// Requires: WWTControl

export function FolderBrowser() {
  this._items = [];
  this.top = 10;
  this.left = 10;
  this._indexTouchDown = -1;
  this._mouseDown = false;
  this._lastX = 0;
  this._lastY = 0;
  this._ignoreClick = false;
  this._thumbnailSize = 0;
  this._horzSpacing = 110;
  this._vertSpacing = 75;
  this._thumbHeight = 65;
  this._thumbWidth = 110;
  this._horzMultiple = 110;
  this._rowCount = 1;
  this._colCount = 6;
  this._dragging = false;
  this._startIndex = 0;
  this._startOffset = 0;
  this._selectedItem = -1;
  this._hoverItem = -1;
  this.showAddButton = false;
  this.width = 0;
  this.height = 0;
  this._addButtonHover = false;
  this.imageClicked = false;
}

FolderBrowser._downloading = false;
FolderBrowser._imagesLoaded = false;
FolderBrowser._imageLoadCount = 0;

FolderBrowser.create = function () {
  var temp = new FolderBrowser();
  temp.height = 85;
  temp.width = 1920;
  temp.canvas = document.createElement('canvas');
  temp.canvas.width = temp.width;
  temp.canvas.height = temp.height;
  temp.setup();
  temp.loadImages();
  return temp;
};

var FolderBrowser$ = {
  setup: function () {
    this.canvas.addEventListener('click', ss.bind('onClick', this), false);
    this.canvas.addEventListener('dblclick', ss.bind('onDoubleClick', this), false);
    this.canvas.addEventListener('mousemove', ss.bind('onMouseMove', this), false);
    this.canvas.addEventListener('mouseup', ss.bind('onMouseUp', this), false);
    this.canvas.addEventListener('mousedown', ss.bind('onMouseDown', this), false);
    this.canvas.addEventListener('touchstart', ss.bind('onTouchStart', this), false);
    this.canvas.addEventListener('touchmove', ss.bind('onTouchMove', this), false);
    this.canvas.addEventListener('touchend', ss.bind('onTouchEnd', this), false);
    this.canvas.addEventListener('mouseout', ss.bind('onMouseUp', this), false);
  },

  onTouchStart: function (e) {
    var ev = e;
    ev.preventDefault();
    this._mouseDown = true;
    this._lastX = ev.targetTouches[0].pageX;
    this._lastY = ev.targetTouches[0].pageY;
    this._indexTouchDown = this._getItemIndexFromCursor(Vector2d.create(ev.targetTouches[0].pageX, ev.targetTouches[0].pageY));
  },

  onTouchMove: function (e) {
    var ev = e;
    ev.preventDefault();
    if (this._mouseDown) {
      var curX = ev.targetTouches[0].pageX - this._lastX;
      var curY = ev.targetTouches[0].pageY - this._lastY;
      if (this._mouseDown) {
        this._dragging = true;
      }
      if (!this._dragging) {
        var newHover = this._getItemIndexFromCursor(Vector2d.create(ev.targetTouches[0].pageX, ev.targetTouches[0].pageY));
        if (this._hoverItem !== newHover) {
          this._hoverItem = newHover;
        }
      }
      else {
        var tiles = Math.round(((ev.targetTouches[0].pageX - this._lastX) + this._startOffset) / this._horzSpacing);
        var offset = Math.round(((ev.targetTouches[0].pageX - this._lastX) + this._startOffset) - (tiles * this._horzSpacing));
        this._startOffset = offset;
        this._startIndex -= tiles;
        if (this._startIndex < 0) {
          this._startOffset -= (this._horzSpacing * this._startIndex);
          this._startIndex = 0;
        }
        this._lastX = ev.targetTouches[0].pageX;
        this._lastY = ev.targetTouches[0].pageY;
      }
      this.refresh();
    }
  },

  onTouchEnd: function (e) {
    var ev = e;
    ev.preventDefault();
    if (this._dragging) {
      this._dragging = false;
      this._ignoreClick = true;
    } else if (this._indexTouchDown > -1 && this._mouseDown) {
      this._handleClick(this._indexTouchDown);
    }
    this._startOffset = 0;
    this._mouseDown = false;
    this.refresh();
  },

  onClick: function (e) {
    if (!this._ignoreClick) {
      var index = this._getItemIndexFromCursor(Vector2d.create(e.offsetX, e.offsetY));
      this._handleClick(index);
    } else {
      this._ignoreClick = false;
    }
  },

  _handleClick: function (index) {
    var $this = this;

    if (index > -1) {
      if (ss.canCast(this._items[index], Place)) {
        var place = this._items[index];
        globalWWTControl.gotoTarget(place, false, false, true);
        return;
      }
      if (ss.canCast(this._items[index], Imageset)) {
        var imageset = this._items[index];
        globalRenderContext.set_backgroundImageset(imageset);
        return;
      }
      if (ss.canCast(this._items[index], Tour)) {
        var tour = this._items[index];
        globalWWTControl.playTour(tour.get_tourUrl());
        return;
      }
      if (ss.canCast(this._items[index], Folder)) {
        var folder = this._items[index];
        this._startIndex = 0;
        folder.childLoadCallback(function () {
          $this._items = folder.get_children();
          $this.refresh();
        });
        return;
      }
      if (ss.canCast(this._items[index], FolderUp)) {
        var folderUp = this._items[index];
        if (folderUp.parent != null) {
          this._startIndex = 0;
          folderUp.parent.childLoadCallback(function () {
            $this._items = folderUp.parent.get_children();
            $this.refresh();
          });
        }
        return;
      }
    }
    return;
  },

  onDoubleClick: function (e) {
    RenderTriangle.renderingOn = !RenderTriangle.renderingOn;
  },

  onGestureChange: function (e) {
    var g = e;
    this._mouseDown = false;
    var delta = g.scale;
  },

  onMouseDown: function (e) {
    this._mouseDown = true;
    this._lastX = Mouse.offsetX(this.canvas, e);
    this._lastY = Mouse.offsetY(this.canvas, e);
  },

  onMouseMove: function (e) {
    if (this._mouseDown) {
      this._dragging = true;
    }
    if (!this._dragging) {
      var newHover = this._getItemIndexFromCursor(Vector2d.create(Mouse.offsetX(this.canvas, e), Mouse.offsetY(this.canvas, e)));
      if (this._hoverItem !== newHover) {
        this._hoverItem = newHover;
      }
    } else {
      var tiles = Math.round(((Mouse.offsetX(this.canvas, e) - this._lastX) + this._startOffset) / this._horzSpacing);
      var offset = Math.round(((Mouse.offsetX(this.canvas, e) - this._lastX) + this._startOffset) - (tiles * this._horzSpacing));
      this._startOffset = offset;
      this._startIndex -= tiles;
      if (this._startIndex < 0) {
        this._startOffset -= (this._horzSpacing * this._startIndex);
        this._startIndex = 0;
      }
      this._lastX = Mouse.offsetX(this.canvas, e);
      this._lastY = Mouse.offsetY(this.canvas, e);
    }
    this.refresh();
  },

  onMouseUp: function (e) {
    if (this._dragging) {
      this._startOffset = 0;
      this._dragging = false;
      this._ignoreClick = true;
    }
    this._mouseDown = false;
    this.refresh();
  },

  loadImages: function () {
    var $this = this;

    if (!FolderBrowser._imagesLoaded && !FolderBrowser._downloading) {
      FolderBrowser._imageLoadCount = 0;
      FolderBrowser._imagesLoaded = false;
      FolderBrowser._downloading = true;
      FolderBrowser._bmpBackground = document.createElement('img');
      FolderBrowser._bmpBackground.src = 'images/thumbBackground.png';
      FolderBrowser._bmpBackground.addEventListener('load', function (e) {
        FolderBrowser._imageLoadCount++;
        if (FolderBrowser._imageLoadCount === 5) {
          FolderBrowser._downloading = false;
          FolderBrowser._imagesLoaded = true;
          $this.refresh();
        }
      }, false);
      FolderBrowser._bmpBackgroundHover = document.createElement('img');
      FolderBrowser._bmpBackgroundHover.src = 'images/thumbBackgroundHover.png';
      FolderBrowser._bmpBackgroundHover.addEventListener('load', function (e) {
        FolderBrowser._imageLoadCount++;
        if (FolderBrowser._imageLoadCount === 5) {
          FolderBrowser._downloading = false;
          FolderBrowser._imagesLoaded = true;
          $this.refresh();
        }
      }, false);
      FolderBrowser._bmpBackgroundWide = document.createElement('img');
      FolderBrowser._bmpBackgroundWide.src = 'images/thumbBackgroundWide.png';
      FolderBrowser._bmpBackgroundWide.addEventListener('load', function (e) {
        FolderBrowser._imageLoadCount++;
        if (FolderBrowser._imageLoadCount === 5) {
          FolderBrowser._downloading = false;
          FolderBrowser._imagesLoaded = true;
          $this.refresh();
        }
      }, false);
      FolderBrowser._bmpBackgroundWideHover = document.createElement('img');
      FolderBrowser._bmpBackgroundWideHover.src = 'images/thumbBackgroundWideHover.png';
      FolderBrowser._bmpBackgroundWideHover.addEventListener('load', function (e) {
        FolderBrowser._imageLoadCount++;
        if (FolderBrowser._imageLoadCount === 5) {
          FolderBrowser._downloading = false;
          FolderBrowser._imagesLoaded = true;
          $this.refresh();
        }
      }, false);
      FolderBrowser._bmpDropInsertMarker = document.createElement('img');
      FolderBrowser._bmpDropInsertMarker.src = 'images/dragInsertMarker.png';
      FolderBrowser._bmpDropInsertMarker.addEventListener('load', function (e) {
        FolderBrowser._imageLoadCount++;
        if (FolderBrowser._imageLoadCount === 5) {
          FolderBrowser._downloading = false;
          FolderBrowser._imagesLoaded = true;
          $this.refresh();
        }
      }, false);
    }
  },

  get_thumbnailSize: function () {
    return this._thumbnailSize;
  },

  set_thumbnailSize: function (value) {
    this._thumbnailSize = value;
    switch (value) {
      case 1:
        this._horzSpacing = 180;
        this._vertSpacing = 75;
        this._thumbHeight = 65;
        this._thumbWidth = 180;
        break;
      case 0:
        this._horzSpacing = 110;
        this._vertSpacing = 75;
        this._thumbHeight = 65;
        this._thumbWidth = 110;
        break;
    }
    this._updatePaginator();
    this.refresh();
    return value;
  },

  refresh: function () {
    if (this.width !== window.innerWidth) {
      this.width = window.innerWidth;
    }
    this.paint();
  },

  get_rowCount: function () {
    return this._rowCount;
  },

  set_rowCount: function (value) {
    if (this._rowCount !== value) {
      this._rowCount = value;
      this._updatePaginator();
    }
    return value;
  },

  _updatePaginator: function () { },

  get_colCount: function () {
    return this._colCount;
  },

  set_colCount: function (value) {
    if (this._colCount !== value) {
      this._colCount = value;
      this._updatePaginator();
    }
    return value;
  },

  get_itemsPerPage: function () {
    return this._rowCount * this._colCount;
  },

  get_currentPage: function () {
    return this._startIndex / this.get_itemsPerPage();
  },

  get_pageCount: function () {
    return Math.max(1, ((this._items.length + this.get_itemsPerPage() - 1) + ((this.showAddButton) ? 1 : 0)) / this.get_itemsPerPage());
  },

  paint: function () {
    var $this = this;

    var g = this.canvas.getContext('2d');
    g.fillStyle = 'rgb(20, 22, 31)';
    g.fillRect(0, 0, this.width, this.height);
    if (!FolderBrowser._imagesLoaded) {
      return;
    }
    var netHeight = (this.height - 10 * 2);
    var netWidth = (this.width - 10 * 2);
    this.set_rowCount(Math.round(Math.max(netHeight / this._thumbHeight, 1)));
    this.set_colCount(Math.round(Math.max(netWidth / this._horzSpacing, 1)));
    this._horzMultiple = (netWidth + 13) / this.get_colCount();
    this._startIndex = Math.round((this._startIndex / this.get_itemsPerPage()) * this.get_itemsPerPage());
    var rectf;
    var index = this._startIndex;
    for (var y = 0; y < this._rowCount; y++) {
      for (var x = 0; x < this._colCount; x++) {
        if (index >= this._items.length) {
          if (!this._items.length || this.showAddButton) {
            rectf = Rectangle.create(this.left + x * this._horzMultiple + 3 + this._startOffset, this.top + y * this._vertSpacing, this._thumbWidth - 10, 60);
            g.drawImage((this._thumbnailSize === 1) ? FolderBrowser._bmpBackgroundWide : FolderBrowser._bmpBackground, ss.truncate((x * this._horzMultiple)) + this._startOffset, y * this._vertSpacing);
          }
          break;
        }
        rectf = Rectangle.create(this.left + x * this._horzMultiple + 3 + this._startOffset, this.top + y * this._vertSpacing, this._thumbWidth - 14, 60);
        var textBrush = 'white';
        if (index === this._hoverItem || (index === this._selectedItem && this._hoverItem === -1)) {
          g.drawImage((this._thumbnailSize === 1) ? FolderBrowser._bmpBackgroundWideHover : FolderBrowser._bmpBackgroundHover, this.left + ss.truncate((x * this._horzMultiple)) + this._startOffset, this.top + y * this._vertSpacing);
          textBrush = 'yellow';
        }
        else {
          g.drawImage((this._thumbnailSize === 1) ? FolderBrowser._bmpBackgroundWide : FolderBrowser._bmpBackground, this.left + ss.truncate((x * this._horzMultiple)) + this._startOffset, this.top + y * this._vertSpacing);
        }
        this._items[index].set_bounds(Rectangle.create((this.left + x * this._horzMultiple) + this._startOffset, this.top + (y * this._vertSpacing), ss.truncate(this._horzMultiple), this._vertSpacing));
        try {
          var bmpThumb = this._items[index].get_thumbnail();
          if (bmpThumb != null) {
            g.drawImage(bmpThumb, this.left + (x * this._horzMultiple) + 2 + this._startOffset, this.top + y * this._vertSpacing + 3);
            g.strokeStyle = 'rgb(0,0,0)';
            g.rect(this.left + ss.truncate((x * this._horzMultiple)) + 2 + this._startOffset, this.top + y * this._vertSpacing + 3, this._items[index].get_thumbnail().width, this._items[index].get_thumbnail().height);
          }
          else {
            this._items[index].set_thumbnail(document.createElement('img'));
            this._items[index].get_thumbnail().src = this._items[index].get_thumbnailUrl();
            this._items[index].get_thumbnail().addEventListener('load', function (e) {
              $this.refresh();
            }, false);
          }
        }
        catch ($e1) {
        }
        g.fillStyle = textBrush;
        g.strokeStyle = textBrush;
        g.lineWidth = 1;
        g.font = 'normal 8pt Arial';
        g.fillText(this._items[index].get_name(), rectf.x, rectf.y + rectf.height, rectf.width);
        index++;
      }
      if (index >= this._items.length) {
        break;
      }
    }
  },

  _getItemIndexFromCursor: function (testPointIn) {
    var testPoint = Vector2d.create(testPointIn.x + this.left, testPointIn.y + this.top);
    this.imageClicked = false;
    var index = -1;
    var xpos = ss.truncate((testPoint.x / this._horzMultiple));
    var xPart = ss.truncate((testPoint.x % this._horzMultiple));
    if (xpos >= this._colCount) {
      return -1;
    }
    if (xpos < 0) {
      return -1;
    }
    var ypos = ss.truncate((testPoint.y / this._vertSpacing));
    var yPart = ss.truncate((testPoint.y % this._vertSpacing));
    if (ypos >= this._rowCount) {
      return -1;
    }
    if (ypos < 0) {
      return -1;
    }
    index = this._startIndex + ypos * this._colCount + xpos;
    if (index === this._items.length) {
      this._addButtonHover = true;
    } else {
      this._addButtonHover = false;
    }
    if (index > this._items.length - 1) {
      return -1;
    }
    if ((this._items[index]).get_isImage() && yPart < 16 && xPart > 78) {
      this.imageClicked = true;
    }
    return index;
  },

  _addItems: function (list) {
    this._items = list;
  }
};

registerType("FolderBrowser", [FolderBrowser, FolderBrowser$, null]);


// The `Layer.fromXml` function, which needs to be aware of a bunch of layer
// subclasses.

Layer.fromXml = function (layerNode, someFlag) {
  var layerClassName = layerNode.attributes.getNamedItem('Type').nodeValue;
  var overLayType = ss.replaceString(layerClassName, 'TerraViewer.', '');
  if (overLayType == null) {
    return null;
  }
  var newLayer = null;
  switch (overLayType) {
    case 'SpreadSheetLayer':
      newLayer = new SpreadSheetLayer();
      break;
    case 'GreatCirlceRouteLayer':
      newLayer = new GreatCirlceRouteLayer();
      break;
    case 'GridLayer':
      newLayer = new GridLayer();
      break;
    case 'ImageSetLayer':
      newLayer = new ImageSetLayer();
      break;
    case 'Object3dLayer':
      newLayer = new Object3dLayer();
      break;
    case 'OrbitLayer':
      newLayer = new OrbitLayer();
      break;
    case 'VoTableLayer':
      newLayer = new VoTableLayer();
      break;
    default:
      return null;
  }
  newLayer.initFromXml(layerNode);
  return newLayer;
};


// 3D planets -- separating out this chunk of code for dependency-ordering reasons.

export function Planets3d() { }

Planets3d._ringsTriangleLists = new Array(2);
Planets3d._ringImage = null;
Planets3d._triangleCountRings = 192 + 1 * 2;
Planets3d._ringsVertexBuffer = null;

Planets3d.getImageSetNameNameFrom3dId = function (id) {
  switch (id) {
    case 0:
      return 'Sun';
    case 1:
      return 'Mercury';
    case 2:
      return 'Venus';
    case 3:
      return 'Visible Imagery';
    case 4:
      return 'Jupiter';
    case 5:
      return 'Saturn';
    case 6:
      return 'Uranus';
    case 7:
      return 'Neptune';
    case 8:
      return 'Pluto';
    case 9:
      return 'Moon';
    case 10:
      return 'Io (Jupiter)';
    case 11:
      return 'Europa (Jupiter)';
    case 12:
      return 'Ganymede (Jupiter)';
    case 13:
      return 'Callisto (Jupiter)';
    case 19:
      return 'Bing Maps Aerial';
    default:
      return '';
  }
};

Planets3d.initPlanetResources = function (renderContext) { };

Planets3d.drawPlanets3D = function (renderContext, opacity, centerPoint) {
  Planets3d.initPlanetResources(renderContext);
  var distss = UiTools.solarSystemToMeters(renderContext.get_solarSystemCameraDistance());
  var moonFade = Math.min(1, Math.max(Util.log10(distss) - 7.3, 0));
  var fade = Math.min(1, Math.max(Util.log10(distss) - 8.6, 0));
  if (Settings.get_active().get_solarSystemOrbits() && fade > 0) {
    for (var ii = 1; ii < 10; ii++) {
      var id = ii;
      if (ii === 9) {
        id = 19;
      }
      var angle = Math.atan2(Planets._planet3dLocations[id].z, Planets._planet3dLocations[id].x);
      Planets3d._drawSingleOrbit(renderContext, Planets.planetColors[id], id, centerPoint, angle, Planets._planet3dLocations[id], fade);
    }
    var mid = 9;
    Planets3d._drawSingleOrbit(renderContext, Planets.planetColors[mid], mid, centerPoint, 0, Planets._planet3dLocations[mid], fade);
  }
  ss.clearKeys(Planets._drawOrder);
  var camera = renderContext.cameraPosition.copy();
  for (var planetId = 0; planetId < 14; planetId++) {
    if (!(Settings.get_active().get_solarSystemLighting() && Planets._planetLocations[planetId].eclipsed)) {
      var distVector = Vector3d.subtractVectors(camera, Vector3d.subtractVectors(Planets._planet3dLocations[planetId], centerPoint));
      if (!ss.keyExists(Planets._drawOrder, distVector.length())) {
        Planets._drawOrder[distVector.length()] = planetId;
      }
    }
  }
  var distVectorEarth = Vector3d.subtractVectors(camera, Vector3d.subtractVectors(Planets._planet3dLocations[19], centerPoint));
  if (!ss.keyExists(Planets._drawOrder, distVectorEarth.length())) {
    Planets._drawOrder[distVectorEarth.length()] = 19;
  }
  var $enum1 = ss.enumerate(ss.keys(Planets._drawOrder));
  while ($enum1.moveNext()) {
    var key = $enum1.current;
    var planetId = Planets._drawOrder[key];
    Planets3d._drawPlanet3d(renderContext, planetId, centerPoint);
  }
  return true;
};

Planets3d._drawSingleOrbit = function (renderContext, eclipticColor, id, centerPoint, startAngle, planetNow, opacity) {
  // mu is the standard gravitational parameter GM, where G
  // is the gravitational constant and M is the mass of the
  // central body.
  const muSun = 1.327124400188e11; // km^3/s^2
  const muEarth = 3.9860044189e5;
  const muMoon = 4.9027779e3;
  const muJupiter = 1.26686534e8;

  if (opacity < 0.01) {
    return;
  }
  if (renderContext.gl == null) {
    var count = Planets._orbitalSampleRate;
    var planetDropped = false;
    var viewPoint = renderContext.get_viewPoint();
    var ctx = renderContext.device;
    ctx.save();
    ctx.strokeStyle = eclipticColor.toString();
    ctx.lineWidth = 2;
    ctx.globalAlpha = 1;
    var point = new Vector3d();
    var pointTest = new Vector3d();
    var lastPoint = new Vector3d();
    var firstPoint = true;
    var translate = Matrix3d.translation(Vector3d.negate(centerPoint));
    var mat = Matrix3d.multiplyMatrix(translate, renderContext.WVP);
    var matWV = Matrix3d.multiplyMatrix(translate, renderContext.WV);
    for (var i = 0; i < count; i++) {
      var pnt = Planets._orbits[id][i];
      var angle = (Math.atan2(Planets._orbits[id][i].z, Planets._orbits[id][i].x) + Math.PI * 2 - startAngle) % (Math.PI * 2);
      var alpha = ss.truncate((angle / (Math.PI * 2) * 255));
      var alphaD = alpha / 255;
      if (alpha < 2 && !planetDropped) {
        pnt = planetNow;
        alphaD = 1;
      }
      pointTest = matWV.transform(pnt);
      point = mat.transform(pnt);
      if (pointTest.z > 0) {
        if (firstPoint) {
          firstPoint = false;
        }
        else {
          ctx.beginPath();
          ctx.globalAlpha = alphaD * opacity;
          ctx.moveTo(lastPoint.x, lastPoint.y);
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
        }
      }
      lastPoint = point;
    }
    ctx.restore();
  }
  else {
    if (id !== 9) {
      var count = Planets._orbitalSampleRate;
      var planetDropped = false;
      var viewPoint = renderContext.get_viewPoint();
      var point = new Vector3d();
      var pointTest = new Vector3d();
      var lastPoint = new Vector3d();
      var lastColor = new Color();
      var firstPoint = true;
      var list = new OrbitLineList();
      for (var i = 0; i < count; i++) {
        var pnt = Planets._orbits[id][i].copy();
        var angle = (Math.atan2(pnt.z, pnt.x) + Math.PI * 2 - startAngle) % (Math.PI * 2);
        var alpha = ss.truncate((angle / (Math.PI * 2) * 255));
        var alphaD = alpha / 255;
        var color = Color.fromArgb(alpha, eclipticColor.r, eclipticColor.g, eclipticColor.b);
        if (alpha < 2 && !planetDropped && !firstPoint) {
          pnt = Vector3d.subtractVectors(planetNow, centerPoint);
          alphaD = 1;
          alpha = 255;
          color.a = 255;
          lastColor.a = 255;
          list.addLine(lastPoint, pnt.copy(), lastColor._clone(), color._clone());
          lastColor.a = 0;
          color.a = 0;
          pnt = Planets._orbits[id][i].copy();
          planetDropped = true;
        }
        pnt = Vector3d.subtractVectors(pnt, centerPoint);
        if (firstPoint) {
          firstPoint = false;
        }
        else {
          list.addLine(lastPoint, pnt, lastColor, color);
        }
        lastPoint = pnt;
        lastColor = color._clone();
      }
      list.drawLines(renderContext, 1, Colors.get_white());
      list.clear();
    } else {
      var mu = 0;
      switch (id) {
        case 9:
          mu = muEarth + muMoon;
          break;
        case 10:
        case 11:
        case 12:
        case 13:
          mu = muJupiter;
          break;
        default:
          mu = muSun;
          break;
      }
      var deltaT = 1 / 1440 * 0.1;
      var r0 = Planets.getPlanetPositionDirect(id, Planets._jNow);
      var r1 = Planets.getPlanetPositionDirect(id, Planets._jNow - deltaT);
      var v = Vector3d.scale(Vector3d.subtractVectors(r0, r1), 1 / deltaT);
      var elements = Planets._stateVectorToKeplerian(r0, v, mu);
      Planets3d._drawSingleOrbitElements(renderContext, eclipticColor, id, centerPoint, startAngle, planetNow, elements);
    }
  }
};

Planets3d._drawSingleOrbitElements = function (renderContext, eclipticColor, id, centerPoint, xstartAngle, planetNow, el) {
  var scaleFactor;
  switch (id) {
    case 9:
      if (Settings.get_active().get_solarSystemScale() > 1) {
        scaleFactor = Settings.get_active().get_solarSystemScale() / 2;
      }
      else {
        scaleFactor = 1;
      }
      break;
    case 10:
    case 11:
    case 12:
    case 13:
      scaleFactor = Settings.get_active().get_solarSystemScale();
      break;
    default:
      scaleFactor = 1;
      break;
  }
  var translation = Vector3d.negate(centerPoint);
  if (id === 9) {
    translation.add(Planets._planet3dLocations[19]);
  }
  else if (id === 10 || id === 11 || id === 12 || id === 13) {
    translation.add(Planets._planet3dLocations[4]);
  }
  var currentPosition = Vector3d.subtractVectors(planetNow, centerPoint);
  var worldMatrix = Matrix3d.multiplyMatrix(Matrix3d.multiplyMatrix(el.orientation, Matrix3d.translation(translation)), renderContext.get_world());
  EllipseRenderer.drawEllipseWithPosition(renderContext, el.a / 149598000 * scaleFactor, el.e, el.ea, eclipticColor, worldMatrix, currentPosition);
};

Planets3d.isPlanetInFrustum = function (renderContext, rad) {
  var frustum = renderContext.get_frustum();
  var center = Vector3d.create(0, 0, 0);
  var centerV4 = new Vector4d(0, 0, 0, 1);
  for (var i = 0; i < 6; i++) {
    if (frustum[i].dot(centerV4) + rad < 0) {
      return false;
    }
  }
  return true;
};

Planets3d._drawPlanet3d = function (renderContext, planetID, centerPoint) {
  if (planetID === 0) {
    TileShader.minLightingBrightness = 1;
  }
  else {
    TileShader.minLightingBrightness = 0.025;
    if (planetID === 19) {
      TileShader.atmosphereColor = Color.fromArgb(255, 65, 157, 217);
    } else {
      TileShader.atmosphereColor = Color.fromArgb(0, 0, 0, 0);
    }
  }
  var matOld = renderContext.get_world();
  var matOldBase = renderContext.get_worldBase();
  var matOldNonRotating = renderContext.get_worldBaseNonRotating();
  var radius = Planets.getAdjustedPlanetRadius(planetID);
  Planets.setupPlanetMatrix(renderContext, planetID, centerPoint, true);
  var planetWidth = 1;
  if (planetID === 5) {
    planetWidth = 3;
  }
  if (Planets3d.isPlanetInFrustum(renderContext, planetWidth)) {
    var matOld2 = renderContext.get_world();
    var matOldBase2 = renderContext.get_worldBase();
    var matOldNonRotating2 = renderContext.get_worldBaseNonRotating();
    var sun = Planets._planet3dLocations[0].copy();
    var planet = Planets._planet3dLocations[planetID].copy();
    sun = matOld.transform(sun);
    planet = matOld.transform(planet);
    renderContext.set_world(matOld);
    renderContext.set_worldBase(matOldBase);
    renderContext.set_worldBaseNonRotating(matOldNonRotating);
    Planets._setupMatrixForPlanetGeometry(renderContext, planetID, centerPoint, true);
    var sunPosition = Vector3d.subtractVectors(sun, planet);
    sunPosition.normalize();
    renderContext.set_sunPosition(sunPosition);
    TileShader.sunPosition = Vector3d.subtractVectors(Planets._planet3dLocations[0], planet);
    var loc = Vector3d.subtractVectors(Planets._planet3dLocations[planetID], centerPoint);
    loc.subtract(renderContext.cameraPosition);
    var dist = loc.length();
    var sizeIndexParam = (2 * Math.atan(0.5 * (radius / dist))) / Math.PI * 180;
    var sizeIndex = 0;
    if (sizeIndexParam > 10.5) {
      sizeIndex = 0;
    } else if (sizeIndexParam > 3.9) {
      sizeIndex = 1;
    } else if (sizeIndexParam > 0.72) {
      sizeIndex = 2;
    } else if (sizeIndexParam > 0.05) {
      sizeIndex = 3;
    } else {
      sizeIndex = 4;
    }
    if (planetID === 19 && sizeIndex < 2) {
      var width = Settings.get_active().get_solarSystemScale() * 1E-05;
    }
    if (sizeIndex < 4) {
      var oldLighting = renderContext.lighting;
      if (planetID === 5) {
        if (renderContext.gl == null) {
          renderContext.lighting = false;
          Planets3d.drawSaturnsRings(renderContext, false, dist);
          renderContext.lighting = oldLighting;
        }
      }
      if (!planetID) {
        renderContext.lighting = false;
      }
      Planets3d._drawSphere(renderContext, planetID);
      if (planetID === 5) {
        if (renderContext.gl == null) {
          renderContext.lighting = false;
          Planets3d.drawSaturnsRings(renderContext, true, dist);
        }
        else {
          renderContext.lighting = false;
          Planets3d._drawRings(renderContext);
          renderContext.lighting = oldLighting;
        }
      }
      renderContext.lighting = oldLighting;
    } else {
      if (!planetID) {
        BasePlanets.drawPointPlanet(renderContext, new Vector3d(), (10 * Planets._planetDiameters[planetID]), Planets.planetColors[planetID], true);
      }
      else if (planetID < 9 || planetID === 19) {
        var size = (800 * Planets._planetDiameters[planetID]);
        BasePlanets.drawPointPlanet(renderContext, new Vector3d(), Math.max(0.05, Math.min(0.1, size)), Planets.planetColors[planetID], true);
      }
      else if (sizeIndexParam > 0.002) {
        var size = (800 * Planets._planetDiameters[planetID]);
        BasePlanets.drawPointPlanet(renderContext, new Vector3d(), Math.max(0.05, Math.min(0.1, size)), Planets.planetColors[planetID], true);
      }
    }
  }
  LayerManager._draw(renderContext, 1, false, Planets.getNameFrom3dId(planetID), true, false);
  renderContext.set_world(matOld);
  renderContext.set_worldBase(matOldBase);
  renderContext.set_worldBaseNonRotating(matOldNonRotating);
};

Planets3d.drawSaturnsRings = function (renderContext, front, distance) {
  if (Planets3d._ringsTriangleLists[0] == null) {
    Planets3d._ringImage = document.createElement('img');
    var xdomimg = Planets3d._ringImage;
    xdomimg.crossOrigin = 'anonymous';
    Planets3d._ringImage.src = URLHelpers.singleton.engineAssetUrl('saturnringsshadow.png');
    Planets3d._ringsTriangleLists[0] = [];
    Planets3d._ringsTriangleLists[1] = [];
    var ringSize = 2.25;
    var TopLeft = Vector3d.create(-ringSize, 0, -ringSize);
    var TopRight = Vector3d.create(ringSize, 0, -ringSize);
    var BottomLeft = Vector3d.create(-ringSize, 0, ringSize);
    var BottomRight = Vector3d.create(ringSize, 0, ringSize);
    var center = Vector3d.create(0, 0, 0);
    var leftCenter = Vector3d.create(-ringSize, 0, 0);
    var topCenter = Vector3d.create(0, 0, -ringSize);
    var bottomCenter = Vector3d.create(0, 0, ringSize);
    var rightCenter = Vector3d.create(ringSize, 0, 0);
    var level = 6;
    var vertexList;
    vertexList = [];
    var Width = 1024;
    var Height = 1024;
    vertexList.push(PositionTexture.createPosSize(TopLeft, 0, 0, Width, Height));
    vertexList.push(PositionTexture.createPosSize(TopRight, 1, 0, Width, Height));
    vertexList.push(PositionTexture.createPosSize(BottomLeft, 0, 1, Width, Height));
    vertexList.push(PositionTexture.createPosSize(BottomRight, 1, 1, Width, Height));
    var childTriangleList = [];
    childTriangleList.push(Triangle.create(0, 2, 1));
    childTriangleList.push(Triangle.create(2, 3, 1));
    var count = 5;
    while (count-- > 1) {
      var newList = [];
      var $enum1 = ss.enumerate(childTriangleList);
      while ($enum1.moveNext()) {
        var tri = $enum1.current;
        tri.subDivideNoNormalize(newList, vertexList);
      }
      childTriangleList = newList;
    }
    var miter = 0.6 / (Width / 256);
    var $enum2 = ss.enumerate(childTriangleList);
    while ($enum2.moveNext()) {
      var tri = $enum2.current;
      var p1 = vertexList[tri.a];
      var p2 = vertexList[tri.b];
      var p3 = vertexList[tri.c];
      Planets3d._ringsTriangleLists[0].push(RenderTriangle.createWithMiter(p1, p2, p3, Planets3d._ringImage, level, miter));
    }
  }
  if (renderContext.gl == null) {
    var cam = renderContext.cameraPosition;
    var test = new Vector3d();
    var worldLocal = Matrix3d.multiplyMatrix(Matrix3d._rotationY(Math.atan2(renderContext.get_sunPosition().x, renderContext.get_sunPosition().z)), renderContext.get_worldBaseNonRotating());
    var wv = Matrix3d.multiplyMatrix(worldLocal, renderContext.get_view());
    var wvp = Matrix3d.multiplyMatrix(wv, renderContext.get_projection());
    var Width = renderContext.width;
    var Height = renderContext.height;
    wvp.scale(Vector3d.create(Width / 2, -Height / 2, 1));
    wvp.translate(Vector3d.create(Width / 2, Height / 2, 0));
    var td = 0;
    for (var i = 0; i < 2; i++) {
      var $enum3 = ss.enumerate(Planets3d._ringsTriangleLists[0]);
      while ($enum3.moveNext()) {
        var tri = $enum3.current;
        test = wv.transform(tri.a.position);
        td = test.length();
        var draw = td > distance;
        if (front) {
          draw = !draw;
        }
        if (draw) {
          tri.opacity = 1;
          tri.draw(renderContext.device, wvp);
        }
      }
      RenderTriangle.cullInside = !RenderTriangle.cullInside;
    }
  }
  else { }
};

Planets3d._drawRings = function (renderContext) {
  Planets3d._initRings();
  TileShader.use(renderContext, Planets3d._ringsVertexBuffer.vertexBuffer, null, Planets._ringsTexture.texture2d, 1, false, Vector3d.zero);
  renderContext.gl.drawArrays(WEBGL.TRIANGLE_STRIP, 0, Planets3d._triangleCountRings);
};

Planets3d._initRings = function () {
  if (Planets3d._ringsVertexBuffer != null) {
    return;
  }
  Planets._ringsTexture = Texture.fromUrl(URLHelpers.singleton.engineAssetUrl('saturnringsstrip.png'));
  var inner = 1.113;
  var outer = 2.25;
  Planets3d._ringsVertexBuffer = new PositionTextureVertexBuffer(((192 + 1) * 2));
  Planets3d._triangleCountRings = (192 + 1) * 2;
  var verts = Planets3d._ringsVertexBuffer.lock();
  var radStep = Math.PI * 2 / 192;
  var index = 0;
  for (var x = 0; x <= 192; x += 2) {
    var rads1 = x * radStep;
    var rads2 = (x + 1) * radStep;
    verts[index] = new PositionTexture();
    verts[index].position = Vector3d.create((Math.cos(rads1) * inner), 0, (Math.sin(rads1) * inner));
    verts[index].tu = 1;
    verts[index].tv = 0;
    index++;
    verts[index] = new PositionTexture();
    verts[index].position = Vector3d.create((Math.cos(rads1) * outer), 0, (Math.sin(rads1) * outer));
    verts[index].tu = 0;
    verts[index].tv = 0;
    index++;
    verts[index] = new PositionTexture();
    verts[index].position = Vector3d.create((Math.cos(rads2) * inner), 0, (Math.sin(rads2) * inner));
    verts[index].tu = 1;
    verts[index].tv = 1;
    index++;
    verts[index] = new PositionTexture();
    verts[index].position = Vector3d.create((Math.cos(rads2) * outer), 0, (Math.sin(rads2) * outer));
    verts[index].tu = 0;
    verts[index].tv = 1;
    index++;
  }
  Planets3d._ringsVertexBuffer.unlock();
};

Planets3d._drawSphere = function (renderContext, planetID) {
  var planetName = Planets3d.getImageSetNameNameFrom3dId(planetID);
  var planet = globalWWTControl.getImagesetByName(planetName);
  if (planet == null) {
    planet = globalWWTControl.getImagesetByName('Bing Maps Aerial');
  }
  if (planet != null) {
    renderContext.drawImageSet(planet, 100);
    if (planetID === 19) {
    }
    return;
  }
};

registerType("Planets3d", [Planets3d, {}, null]);

// wwtlib.InViewReturnMessage

export function InViewReturnMessage() {
  this.aborted = false;
}

var InViewReturnMessage$ = {};

registerType("InViewReturnMessage", [InViewReturnMessage, InViewReturnMessage$, null]);

// wwtlib.RenderContext

export function RenderContext() {
  this.height = 0;
  this.width = 0;
  this.lighting = false;
  this._viewPoint = new Vector3d();
  this.space = false;
  this._fovAngle = 0;
  this._fovScale = 0;
  this._nominalRadius = 6378137;
  this._mainTexture = null;
  this.viewMover = null;
  this.viewCamera = new CameraParameters();
  this.targetCamera = new CameraParameters();
  this.alt = 0;
  this.az = 0;
  this.targetAlt = 0;
  this.targetAz = 0;
  this._backgroundImageset = null;
  this._foregroundImageset = null;
  this._activeCatalogHipsImagesets = [];
  this._targetHeight = 1;
  this.targetAltitude = 0;
  this._galactic = true;
  this._galacticMatrix = Matrix3d.create(-0.4838350155, -0.0548755604, -0.8734370902, 0, 0.7469822445, 0.4941094279, -0.44482963, 0, 0.4559837762, -0.867666149, -0.1980763734, 0, 0, 0, 0, 1);
  this._firstTimeInit = false;
  this._useSolarSystemTilt = true;
  this.customTrackingParams = new CameraParameters();
  this._cameraOffset = new Vector3d();
  this._fovLocal = (Math.PI / 4);
  this.perspectiveFov = Math.PI / 4;
  this.nearPlane = 0;
  this._frustumDirty = true;
  this._frustum = new Array(6);
  this._ambientLightColor = Colors.get_black();
  this._hemiLightColor = Colors.get_black();
  this._hemiLightUp = new Vector3d();
  this._sunlightColor = Colors.get_white();
  this._sunPosition = new Vector3d();
  this._reflectedLightColor = Colors.get_black();
  this._reflectedLightPosition = new Vector3d();
  this._occludingPlanetRadius = 0;
  this._occludingPlanetPosition = new Vector3d();
  this._lightingStateDirty = true;
  this._twoSidedLighting = false;
  this.cameraPosition = new Vector3d();
  this._skyColor = 'Blue';
  for (var i = 0; i < 6; i++) {
    this._frustum[i] = new PlaneD(0, 0, 0, 0);
  }
}

RenderContext.back = 0;

RenderContext.create = function (device) {
  var temp = new RenderContext();
  temp.device = device;
  temp.viewCamera.zoom = 700;
  temp.viewCamera.target = 65536;
  return temp;
};

RenderContext.getTilesYForLevel = function (layer, level) {
  var maxY = 1;
  switch (layer.get_projection()) {
    case ProjectionType.mercator:
      maxY = Math.pow(2, level);
      break;
    case ProjectionType.equirectangular:
      maxY = (Math.pow(2, level) * (180 / layer.get_baseTileDegrees()));
      break;
    case ProjectionType.tangent:
      maxY = Math.pow(2, level);
      break;
    case ProjectionType.spherical:
      maxY = 1;
      break;
    case ProjectionType.healpix:
      maxY = 4 * Math.pow(2, level);
      break;
    default:
      maxY = Math.pow(2, level);
      break;
  }
  if (maxY === Number.POSITIVE_INFINITY) {
    maxY = 1;
  }
  return maxY;
};

RenderContext.getTilesXForLevel = function (layer, level) {
  var maxX = 1;
  switch (layer.get_projection()) {
    case ProjectionType.plotted:
    case ProjectionType.toast:
      maxX = Math.pow(2, level);
      break;
    case ProjectionType.mercator:
      maxX = Math.pow(2, level) * ss.truncate((layer.get_baseTileDegrees() / 360));
      break;
    case ProjectionType.equirectangular:
      maxX = Math.pow(2, level) * ss.truncate((360 / layer.get_baseTileDegrees()));
      break;
    case ProjectionType.tangent:
      if (layer.get_widthFactor() === 1) {
        maxX = Math.pow(2, level) * 2;
      }
      else {
        maxX = Math.pow(2, level);
      }
      break;
    case ProjectionType.skyImage:
      maxX = 1;
      break;
    case ProjectionType.spherical:
      maxX = 1;
      break;
    case ProjectionType.healpix:
      maxX = Math.pow(2, level) * 3;
      break;
    default:
      maxX = Math.pow(2, level) * 2;
      break;
  }
  return maxX;
};

var RenderContext$ = {
  save: function () {
    if (this.gl != null) {
    } else {
      this.device.save();
    }
  },

  restore: function () {
    if (this.gl != null) {
    } else {
      this.device.restore();
    }
  },

  clear: function () {
    if (this.gl != null) {
      this.gl.viewport(0, 0, ss.truncate(this.width), ss.truncate(this.height));
      this.gl.clear(WEBGL.COLOR_BUFFER_BIT | WEBGL.DEPTH_BUFFER_BIT);
    } else {
      this.device.save();
      this.device.fillStyle = 'black';
      this.device.fillRect(0, 0, this.width, this.height);
      this.device.restore();
    }
  },

  get_viewPoint: function () {
    return this._viewPoint;
  },

  get_RA: function () {
    return ((((180 - (this.viewCamera.lng - 180)) / 15) % 24) + 48) % 24;
  },

  rAtoViewLng: function (ra) {
    return 180 - (ra / 24 * 360) - 180;
  },

  get_dec: function () {
    return this.viewCamera.lat;
  },

  get_fovAngle: function () {
    return this._fovAngle;
  },

  get_fovScale: function () {
    return this._fovScale;
  },

  set_fovScale: function (value) {
    this._fovScale = value;
    return value;
  },

  get_view: function () {
    return this._view;
  },

  set_view: function (value) {
    this._view = value;
    this._frustumDirty = true;
    return value;
  },

  get_viewBase: function () {
    return this._viewBase;
  },

  set_viewBase: function (value) {
    this._viewBase = value;
    return value;
  },

  get_projection: function () {
    return this._projection;
  },

  set_projection: function (value) {
    this._projection = value;
    this._frustumDirty = true;
    return value;
  },

  get_world: function () {
    return this._world;
  },

  set_world: function (value) {
    this._world = value;
    this._frustumDirty = true;
    return value;
  },

  _getScreenTexture: function () {
    var tex = null;
    return tex;
  },

  get_worldBase: function () {
    return this._worldBase;
  },

  set_worldBase: function (value) {
    this._worldBase = value;
    return value;
  },

  get_worldBaseNonRotating: function () {
    return this._worldBaseNonRotating;
  },

  set_worldBaseNonRotating: function (value) {
    this._worldBaseNonRotating = value;
    return value;
  },

  get_nominalRadius: function () {
    return this._nominalRadius;
  },

  set_nominalRadius: function (value) {
    this._nominalRadius = value;
    return value;
  },

  get_mainTexture: function () {
    return this._mainTexture;
  },

  set_mainTexture: function (value) {
    if (value != null) {
      this._mainTexture = value;
      this.gl.bindTexture(WEBGL.TEXTURE_2D, this._mainTexture.texture2d);
    }
    return value;
  },

  onTarget: function (place) {
    return ((Math.abs(this.viewCamera.lat - this.targetCamera.lat) < 1E-12 && Math.abs(this.viewCamera.lng - this.targetCamera.lng) < 1E-12 && Math.abs(this.viewCamera.zoom - this.targetCamera.zoom) < 1E-12) && this.viewMover == null);
  },

  setTexture: function (texture) { },

  get_backgroundImageset: function () {
    return this._backgroundImageset;
  },

  set_backgroundImageset: function (value) {
    var viewModeChanged = this._backgroundImageset != null && value != null && (this._backgroundImageset.get_dataSetType() !== value.get_dataSetType());
    this._backgroundImageset = value;
    if (viewModeChanged) {
      globalWWTControl._freezeView();
      globalWWTControl.clampZooms(this);
    }
    return value;
  },

  get_foregroundImageset: function () {
    return this._foregroundImageset;
  },

  set_foregroundImageset: function (value) {
    this._foregroundImageset = value;
    return value;
  },

  get_catalogHipsImagesets: function () {
    return this._activeCatalogHipsImagesets;
  },

  getCatalogHipsDataInView: function (imageset, limit, onComplete) {
    var $this = this;

    var layer = new CatalogSpreadSheetLayer();
    var onHeaderInfoLoad = function () {
      layer.useHeadersFromVoTable(imageset.get_hipsProperties().get_catalogColumnInfo());
      $this._tryGetAllDataInView(imageset, limit, layer, onComplete, 0);
    };
    if (imageset.get_hipsProperties() == null) {
      imageset.set_hipsProperties(makeNewHipsProperties(imageset));
      imageset.get_hipsProperties().setDownloadCompleteListener(onHeaderInfoLoad);
    } else if (imageset.get_hipsProperties() != null && imageset.get_hipsProperties().get_downloadComplete()) {
      onHeaderInfoLoad();
    } else {
      imageset.get_hipsProperties().setDownloadCompleteListener(onHeaderInfoLoad);
    }
  },

  _tryGetAllDataInView: function (imageset, limit, catalogSpreadSheetLayer, onComplete, i) {
    var $this = this;

    var maxX = RenderContext.getTilesXForLevel(imageset, imageset.get_baseLevel());
    var maxY = RenderContext.getTilesYForLevel(imageset, imageset.get_baseLevel());
    var anyTileStillDownloading = false;
    for (var x = 0; x < maxX; x++) {
      for (var y = 0; y < maxY; y++) {
        var tile = tileCacheGetTile(imageset.get_baseLevel(), x, y, imageset, null);
        if (tile != null) {
          var tileAndChildrenReady = (tile).getDataInView(this, limit, catalogSpreadSheetLayer);
          anyTileStillDownloading = anyTileStillDownloading || !tileAndChildrenReady;
        }
        else {
          anyTileStillDownloading = true;
        }
      }
    }
    if (anyTileStillDownloading) {
      var count = catalogSpreadSheetLayer.get__table().rows.length;
      if ((count > 10000 || i > 100 * 60 * 5) && limit) {
        console.log('Too Many results - Aborting');
        console.log(count);
        var returnMessage = new InViewReturnMessage();
        returnMessage.aborted = true;
        returnMessage.table = catalogSpreadSheetLayer.getTableDataInView();
        onComplete(returnMessage);
        catalogSpreadSheetLayer.cleanUp();
      }
      else {
        setTimeout(function () {
          $this._tryGetAllDataInView(imageset, limit, catalogSpreadSheetLayer, onComplete, i);
        }, 10);
        if (!(i % 200)) {
          console.log('Waiting for more tiles to load');
          console.log(count);
        }
        i++;
      }
    } else {
      var count = catalogSpreadSheetLayer.get__table().rows.length;
      console.log('Done!');
      console.log(count);
      var returnMessage = new InViewReturnMessage();
      returnMessage.aborted = false;
      returnMessage.table = catalogSpreadSheetLayer.getTableDataInView();
      onComplete(returnMessage);
      catalogSpreadSheetLayer.cleanUp();
    }
  },

  addCatalogHips: function (imageset, onLoad) {
    if (!(this._activeCatalogHipsImagesets.indexOf(imageset) >= 0)) {
      this._activeCatalogHipsImagesets.push(imageset);
    }
    if (imageset.get_hipsProperties() == null) {
      imageset.set_hipsProperties(makeNewHipsProperties(imageset));
      imageset.get_hipsProperties().setDownloadCompleteListener(onLoad);
    } else if (imageset.get_hipsProperties() != null && imageset.get_hipsProperties().get_downloadComplete()) {
      LayerManager.addSpreadsheetLayer(imageset.get_hipsProperties().get_catalogSpreadSheetLayer(), 'Sky');
      if (onLoad != null) {
        onLoad();
      }
    }
  },

  removeCatalogHips: function (imageset) {
    ss.remove(this._activeCatalogHipsImagesets, imageset);
    if (imageset.get_hipsProperties() != null) {
      LayerManager.deleteLayerByID(imageset.get_hipsProperties().get_catalogSpreadSheetLayer().id, true, true);
    }
  },

  getCatalogHipsByName: function (name) {
    var $enum1 = ss.enumerate(this._activeCatalogHipsImagesets);
    while ($enum1.moveNext()) {
      var imageset = $enum1.current;
      if (imageset.get_name() === name) {
        return imageset;
      }
    }
    return null;
  },

  getAltitudeForLatLongForPlanet: function (planetID, viewLat, viewLong) {
    var layer = globalWWTControl.getImagesetByName(Planets.getNameFrom3dId(planetID));
    if (layer == null) {
      return 0;
    }
    var maxX = RenderContext.getTilesXForLevel(layer, layer.get_baseLevel());
    var maxY = RenderContext.getTilesYForLevel(layer, layer.get_baseLevel());
    for (var x = 0; x < maxX; x++) {
      for (var y = 0; y < maxY; y++) {
        var tile = tileCacheGetTile(layer.get_baseLevel(), x, y, layer, null);
        if (tile != null) {
          if (tile.isPointInTile(viewLat, viewLong)) {
            return tile.getSurfacePointAltitude(viewLat, viewLong, true);
          }
        }
      }
    }
    return 0;
  },

  getEarthAltitude: function (ViewLat, ViewLong, meters) {
    if (globalWWTControl.get_solarSystemMode()) {
      var pnt = Coordinates.geoTo3dDouble(ViewLat, ViewLong + 90);
      var EarthMat = Planets.earthMatrixInv;
      pnt = Vector3d._transformCoordinate(pnt, EarthMat);
      pnt.normalize();
      var point = Coordinates.cartesianToLatLng(pnt);
      return this.getAltitudeForLatLongForPlanet(this.viewCamera.target, point.y, point.x);
    } else if (this.get_backgroundImageset().get_dataSetType() != ImageSetType.earth) {
      return (meters) ? this.getMetersAltitudeForLatLong(ViewLat, ViewLong) : this.getScaledAltitudeForLatLong(ViewLat, ViewLong);
    } else {
      return 0;
    }
  },

  drawImageSet: function (imageset, opacity) {
    var maxX = RenderContext.getTilesXForLevel(imageset, imageset.get_baseLevel());
    var maxY = RenderContext.getTilesYForLevel(imageset, imageset.get_baseLevel());
    for (var x = 0; x < maxX; x++) {
      for (var y = 0; y < maxY; y++) {
        var tile = tileCacheGetTile(imageset.get_baseLevel(), x, y, imageset, null);
        if (tile != null) {
          tile.draw3D(this, opacity);
        }
      }
    }
  },

  _getTileAtLatLong: function (viewLat, viewLong) {
    var layer = this.get_backgroundImageset();
    if (layer == null) {
      return null;
    }
    var maxX = RenderContext.getTilesXForLevel(layer, layer.get_baseLevel());
    var maxY = RenderContext.getTilesYForLevel(layer, layer.get_baseLevel());
    for (var x = 0; x < maxX; x++) {
      for (var y = 0; y < maxY; y++) {
        var tile = tileCacheGetTile(layer.get_baseLevel(), x, y, layer, null);
        if (tile != null) {
          if (tile.isPointInTile(viewLat, viewLong)) {
            return tile;
          }
        }
      }
    }
    return null;
  },

  getScaledAltitudeForLatLong: function (viewLat, viewLong) {
    var tile = this._getTileAtLatLong(viewLat, viewLong);
    if (tile != null) {
      return tile.getSurfacePointAltitude(viewLat, viewLong, false);
    }
    return 0;
  },

  getMetersAltitudeForLatLong: function (viewLat, viewLong) {
    var tile = this._getTileAtLatLong(viewLat, viewLong);
    if (tile != null) {
      return tile.getSurfacePointAltitude(viewLat, viewLong, true);
    }
    return 0;
  },

  _setupMatricesLand3d: function () {
    this.lighting = false;
    this.space = false;
    RenderTriangle.cullInside = false;
    var WorldMatrix = Matrix3d._rotationY(((this.viewCamera.lng - 90) / 180 * Math.PI));
    WorldMatrix._multiply(Matrix3d._rotationX(((-this.viewCamera.lat) / 180 * Math.PI)));
    this.set_world(WorldMatrix);
    this.set_worldBase(WorldMatrix.clone());
    this._viewPoint = Coordinates.geoTo3d(this.viewCamera.lat, this.viewCamera.lng);
    var distance = 0;
    if (this._backgroundImageset.get_isMandelbrot()) {
      distance = (4 * (this.viewCamera.zoom / 180)) + 1E-41;
    } else {
      distance = (4 * (this.viewCamera.zoom / 180)) + 1E-06;
    }
    this._fovAngle = (this.viewCamera.zoom / 343.774) / Math.PI * 180;
    this._fovScale = (this._fovAngle / this.height) * 3600;
    if (this.gl != null) {
      this.targetAltitude = this.getScaledAltitudeForLatLong(this.viewCamera.lat, this.viewCamera.lng);
      var heightNow = 1 + this.targetAltitude;
      this.targetAltitude *= this.get_nominalRadius();
      if (this._targetHeight < heightNow) {
        this._targetHeight = (((this._targetHeight * 2) + heightNow) / 3);
      }
      else {
        this._targetHeight = (((this._targetHeight * 9) + heightNow) / 10);
      }
    } else {
      this.targetAltitude = 0;
      this._targetHeight = 1;
    }
    var rotLocal = this.viewCamera.rotation;
    this.cameraPosition = Vector3d.create((Math.sin(rotLocal) * Math.sin(this.viewCamera.angle) * distance), (Math.cos(rotLocal) * Math.sin(this.viewCamera.angle) * distance), (-this._targetHeight - (Math.cos(this.viewCamera.angle) * distance)));
    var cameraTarget = Vector3d.create(0, 0, -this._targetHeight);
    var camHeight = this.cameraPosition.length();
    var lookUp = Vector3d.create(Math.sin(rotLocal) * Math.cos(this.viewCamera.angle), Math.cos(rotLocal) * Math.cos(this.viewCamera.angle), Math.sin(this.viewCamera.angle));
    this.set_view(Matrix3d.lookAtLH(this.cameraPosition, cameraTarget, lookUp));
    this.set_viewBase(this.get_view());
    var back = Math.sqrt((distance + 1) * (distance + 1) - 1);
    back = Math.max(0.5, back);
    var m_nearPlane = distance * 0.05;
    m_nearPlane = distance * 0.05;
    this.set_projection(Matrix3d.perspectiveFovLH((Math.PI / 4), this.width / this.height, m_nearPlane, back));
    this._setMatrixes();
    this.makeFrustum();
  },

  setupMatricesSpace3d: function (canvasWidth, canvasHeight) {
    this.lighting = false;
    if (!this._firstTimeInit) {
      this._galacticMatrix = Matrix3d.get_identity();
      this._galacticMatrix._multiply(Matrix3d._rotationY(-(270 - (17.7603329867975 * 15)) / 180 * Math.PI));
      this._galacticMatrix._multiply(Matrix3d._rotationX(-(-28.9361739586894) / 180 * Math.PI));
      this._galacticMatrix._multiply(Matrix3d._rotationZ(((31.422052860102) - 90) / 180 * Math.PI));
      this._firstTimeInit = true;
    }
    this.space = true;
    RenderTriangle.cullInside = true;
    var WorldMatrix = Matrix3d.get_identity();
    if (Settings.get_active().get_galacticMode()) {
      WorldMatrix._multiply(this._galacticMatrix);
      WorldMatrix._multiply(Matrix3d._rotationY(this.az / 180 * Math.PI));
      WorldMatrix._multiply(Matrix3d._rotationX(-this.alt / 180 * Math.PI));
      var gPoint = Coordinates.galactictoJ2000(this.az, this.alt);
      this._viewPoint = Coordinates.raDecTo3dAu(gPoint[0] / 15, gPoint[1], 1);
      this.targetCamera.lng = this.rAtoViewLng(gPoint[0] / 15);
      this.targetCamera.lat = gPoint[1];
      this.viewCamera.lat = this.targetCamera.lat;
      this.viewCamera.lng = this.targetCamera.lng;
    } else {
      WorldMatrix._multiply(Matrix3d._rotationY(-(this.viewCamera.lng - 90) / 180 * Math.PI));
      WorldMatrix._multiply(Matrix3d._rotationX(-this.viewCamera.lat / 180 * Math.PI));
      this._viewPoint = Coordinates.raDecTo3dAu(this.get_RA(), this.get_dec(), 1);
    }
    var camLocal = this.viewCamera.rotation;
    this._fovAngle = (this.viewCamera.zoom / 343.774) / Math.PI * 180;
    this._fovScale = (this._fovAngle / canvasHeight) * 3600;
    if (Settings.get_active().get_localHorizonMode() && this._backgroundImageset.get_dataSetType() == ImageSetType.sky) {
      var zenithAltAz = new Coordinates(0, 0);
      zenithAltAz.set_az(0);
      zenithAltAz.set_alt(0);
      var zenith = Coordinates.horizonToEquitorial(zenithAltAz, SpaceTimeController.get_location(), SpaceTimeController.get_now());
      var raPart = -((zenith.get_RA() - 6) / 24 * (Math.PI * 2));
      var decPart = -(zenith.get_dec() / 360 * (Math.PI * 2));
      var raText = Coordinates.formatDMS(zenith.get_RA());
      WorldMatrix = Matrix3d._rotationY(-raPart - Math.PI);
      WorldMatrix._multiply(Matrix3d._rotationX(decPart));
      if (SpaceTimeController.get_location().get_lat() < 0) {
        WorldMatrix._multiply(Matrix3d._rotationY((this.az / 180 * Math.PI)));
        WorldMatrix._multiply(Matrix3d._rotationX((this.alt / 180 * Math.PI)));
        camLocal += Math.PI;
      }
      else {
        WorldMatrix._multiply(Matrix3d._rotationY(((-this.az) / 180 * Math.PI)));
        WorldMatrix._multiply(Matrix3d._rotationX(((-this.alt) / 180 * Math.PI)));
      }
      var currentRaDec = Coordinates.horizonToEquitorial(Coordinates.fromLatLng(this.alt, this.az), SpaceTimeController.get_location(), SpaceTimeController.get_now());
      this.viewCamera.lat = this.targetCamera.lat = currentRaDec.get_dec();
      this.viewCamera.lng = this.targetCamera.lng = this.rAtoViewLng(currentRaDec.get_RA());
    }
    this.set_world(WorldMatrix);
    this.set_worldBase(WorldMatrix.clone());
    var localZoomFactor = this.viewCamera.zoom;
    var FovAngle = (localZoomFactor / 343.774) / Math.PI * 180;
    this.cameraPosition = Vector3d.create(0, 0, 0);
    this.set_view(Matrix3d.lookAtLH(this.cameraPosition, Vector3d.create(0, 0, -1), Vector3d.create(Math.sin(camLocal), Math.cos(camLocal), 0)));
    this.set_viewBase(this.get_view().clone());
    var m_nearPlane = 0.1;
    this.nearPlane = 0.1;
    this.set_projection(Matrix3d.perspectiveFovLH(localZoomFactor / 343.774, canvasWidth / canvasHeight, 0.1, -2));
    this._setMatrixes();
    this.makeFrustum();
  },

  get_solarSystemTrack: function () {
    return this.viewCamera.target;
  },

  set_solarSystemTrack: function (value) {
    this.viewCamera.target = value;
    return value;
  },

  get_solarSystemCameraDistance: function () {
    return (4 * (this.viewCamera.zoom / 9)) + 1E-06;
  },

  get_sandboxMode: function () {
    if (this._backgroundImageset == null) {
      return false;
    }
    return this._backgroundImageset.get_dataSetType() === ImageSetType.sandbox;
  },

  get_trackingFrame: function () {
    return this.viewCamera.targetReferenceFrame;
  },

  set_trackingFrame: function (value) {
    this.viewCamera.targetReferenceFrame = value;
    return value;
  },

  get_fovLocal: function () {
    return this._fovLocal;
  },

  set_fovLocal: function (value) {
    this._fovLocal = value;
    return value;
  },

  setupMatricesOverlays: function () {
    this.set_world(Matrix3d.get_identity());
    var lookAtAdjust = Matrix3d.get_identity();
    var lookFrom = Vector3d.create(0, 0, 0);
    var lookAt = Vector3d.create(0, 0, 1);
    var lookUp = Vector3d.create(0, 1, 0);
    var view;
    view = Matrix3d.lookAtLH(lookFrom, lookAt, lookUp);
    view._multiply(Matrix3d._scaling(1, -1, 1));
    this.set_view(view);
    var back = 10000;
    this.nearPlane = 0.1;
    this.set_projection(Matrix3d.perspectiveFovLH(this._fovLocal, this.width / this.height, this.nearPlane, back));
  },

  setupMatricesSolarSystem: function (forStars) {
    this.lighting = Settings.get_active().get_solarSystemLighting();
    this.space = false;
    if (this.get_solarSystemTrack() !== 20 && this.get_solarSystemTrack() !== 65536) {
      this.viewCamera.viewTarget = Planets.getPlanetTargetPoint(this.get_solarSystemTrack(), this.viewCamera.lat, this.viewCamera.lng, 0);
    }
    RenderTriangle.cullInside = false;
    var cameraDistance = this.get_solarSystemCameraDistance();
    var trackingMatrix = Matrix3d.get_identity();
    cameraDistance -= 1E-06;
    var activeTrackingFrame = false;
    if (this.get_solarSystemTrack() === 20 && !ss.emptyString(this.get_trackingFrame())) {
      activeTrackingFrame = true;
      var target = LayerManager._getFrameTarget(this, this.get_trackingFrame());
      this.viewCamera.viewTarget = target.target;
      trackingMatrix = target.matrix;
    } else if (!ss.emptyString(this.get_trackingFrame())) {
      this.set_trackingFrame('');
    }
    var center = this.viewCamera.viewTarget;
    var localZoom = this.viewCamera.zoom * 20;
    var lookAt = new Vector3d();
    var viewAdjust = Matrix3d.get_identity();
    viewAdjust._multiply(Matrix3d._rotationX(((-this.viewCamera.lat) / 180 * Math.PI)));
    viewAdjust._multiply(Matrix3d._rotationY(((-this.viewCamera.lng) / 180 * Math.PI)));
    var lookAtAdjust = Matrix3d.get_identity();
    var dome = false;
    var lookUp;
    if (this._useSolarSystemTilt && !this.get_sandboxMode()) {
      var angle = this.viewCamera.angle;
      if (cameraDistance > 0.0008) {
        angle = 0;
      }
      else if (cameraDistance > 1E-05) {
        var val = Math.min(1.903089987, Util.log10(cameraDistance) + 5) / 1.903089987;
        angle = angle * Math.max(0, 1 - val);
      }
      this.cameraPosition = Vector3d.create((Math.sin(-this.viewCamera.rotation) * Math.sin(angle) * cameraDistance), (Math.cos(-this.viewCamera.rotation) * Math.sin(angle) * cameraDistance), (Math.cos(angle) * cameraDistance));
      lookUp = Vector3d.create(Math.sin(-this.viewCamera.rotation), Math.cos(-this.viewCamera.rotation), 1E-05);
    } else {
      this.cameraPosition = Vector3d.create(0, 0, cameraDistance);
      lookUp = Vector3d.create(Math.sin(-this.viewCamera.rotation), Math.cos(-this.viewCamera.rotation), 0.0001);
    }
    this.cameraPosition = viewAdjust.transform(this.cameraPosition);
    this._cameraOffset = this.cameraPosition.copy();
    var tmp = trackingMatrix.clone();
    tmp.invert();
    this._cameraOffset = Vector3d._transformCoordinate(this._cameraOffset, tmp);
    lookUp = viewAdjust.transform(lookUp);
    this.set_world(Matrix3d.get_identity());
    this.set_worldBase(Matrix3d.get_identity());
    this.set_worldBaseNonRotating(Matrix3d.get_identity());
    this.set_view(Matrix3d.multiplyMatrix(Matrix3d.multiplyMatrix(trackingMatrix, Matrix3d.lookAtLH(this.cameraPosition, lookAt, lookUp)), lookAtAdjust));
    this.set_viewBase(this.get_view().clone());
    var temp = Vector3d.subtractVectors(lookAt, this.cameraPosition);
    temp.normalize();
    temp = Vector3d._transformCoordinate(temp, trackingMatrix);
    temp.normalize();
    this._viewPoint = temp;
    var radius = Planets.getAdjustedPlanetRadius(this.get_solarSystemTrack());
    if (cameraDistance < radius * 2 && !forStars) {
      this.nearPlane = cameraDistance * 0.03;
      this.nearPlane = Math.max(this.nearPlane, 1E-11);
      RenderContext.back = 1900;
    } else {
      if (forStars) {
        RenderContext.back = 900056;
        RenderContext.back = (cameraDistance > 900056) ? cameraDistance * 3 : 900056;
        this.nearPlane = 3E-05;
      }
      else {
        RenderContext.back = (cameraDistance > 1900) ? cameraDistance + 200 : 1900;
        if (Settings.get_active().get_solarSystemScale() < 13) {
          this.nearPlane = Math.min(cameraDistance * 0.03, 0.01);
        }
        else {
          this.nearPlane = 0.001;
        }
      }
    }
    this.set_projection(Matrix3d.perspectiveFovLH(this._fovLocal, this.width / this.height, this.nearPlane, RenderContext.back));
    this.perspectiveFov = this._fovLocal;
    this._fovAngle = (this.viewCamera.zoom / 343.774) / Math.PI * 180;
    this._fovScale = (this._fovAngle / this.height) * 3600;
    this._setMatrixes();
    this.makeFrustum();
  },

  _setMatrixes: function () { },

  get_frustum: function () {
    return this._frustum;
  },

  get_ambientLightColor: function () {
    return this._ambientLightColor;
  },

  set_ambientLightColor: function (value) {
    this._ambientLightColor = value;
    this._lightingStateDirty = true;
    return value;
  },

  get_hemisphereLightColor: function () {
    return this._hemiLightColor;
  },

  set_hemisphereLightColor: function (value) {
    this._hemiLightColor = value;
    this._lightingStateDirty = true;
    return value;
  },

  get_hemisphereLightUp: function () {
    return this._hemiLightUp;
  },

  set_hemisphereLightUp: function (value) {
    this._hemiLightUp = value;
    this._lightingStateDirty = true;
    return value;
  },

  get_sunlightColor: function () {
    return this._sunlightColor;
  },

  set_sunlightColor: function (value) {
    this._sunlightColor = value;
    this._lightingStateDirty = true;
    return value;
  },

  get_sunPosition: function () {
    return this._sunPosition;
  },

  set_sunPosition: function (value) {
    this._sunPosition = value;
    this._lightingStateDirty = true;
    return value;
  },

  get_reflectedLightColor: function () {
    return this._reflectedLightColor;
  },

  set_reflectedLightColor: function (value) {
    if (this._reflectedLightColor !== value) {
      this._reflectedLightColor = value;
      this._lightingStateDirty = true;
    }
    return value;
  },

  get_reflectedLightPosition: function () {
    return this._reflectedLightPosition;
  },

  set_reflectedLightPosition: function (value) {
    this._reflectedLightPosition = value;
    this._lightingStateDirty = true;
    return value;
  },

  get_occludingPlanetRadius: function () {
    return this._occludingPlanetRadius;
  },

  set_occludingPlanetRadius: function (value) {
    this._occludingPlanetRadius = value;
    return value;
  },

  get_occludingPlanetPosition: function () {
    return this._occludingPlanetPosition;
  },

  set_occludingPlanetPosition: function (value) {
    this._occludingPlanetPosition = value;
    return value;
  },

  get_twoSidedLighting: function () {
    return this._twoSidedLighting;
  },

  set_twoSidedLighting: function (value) {
    if (value !== this._twoSidedLighting) {
      this._twoSidedLighting = value;
      this._lightingStateDirty = true;
    }
    return value;
  },

  makeFrustum: function () {
    this.WV = Matrix3d.multiplyMatrix(this.get_world(), this.get_view());
    var viewProjection = Matrix3d.multiplyMatrix(this.WV, this.get_projection());
    this.WVP = viewProjection.clone();
    var inverseWorld = this.get_world().clone();
    inverseWorld.invert();
    this._frustum[0].a = viewProjection.get_m14() + viewProjection.get_m11();
    this._frustum[0].b = viewProjection.get_m24() + viewProjection.get_m21();
    this._frustum[0].c = viewProjection.get_m34() + viewProjection.get_m31();
    this._frustum[0].d = viewProjection.get_m44() + viewProjection.get_m41();
    this._frustum[1].a = viewProjection.get_m14() - viewProjection.get_m11();
    this._frustum[1].b = viewProjection.get_m24() - viewProjection.get_m21();
    this._frustum[1].c = viewProjection.get_m34() - viewProjection.get_m31();
    this._frustum[1].d = viewProjection.get_m44() - viewProjection.get_m41();
    this._frustum[2].a = viewProjection.get_m14() - viewProjection.get_m12();
    this._frustum[2].b = viewProjection.get_m24() - viewProjection.get_m22();
    this._frustum[2].c = viewProjection.get_m34() - viewProjection.get_m32();
    this._frustum[2].d = viewProjection.get_m44() - viewProjection.get_m42();
    this._frustum[3].a = viewProjection.get_m14() + viewProjection.get_m12();
    this._frustum[3].b = viewProjection.get_m24() + viewProjection.get_m22();
    this._frustum[3].c = viewProjection.get_m34() + viewProjection.get_m32();
    this._frustum[3].d = viewProjection.get_m44() + viewProjection.get_m42();
    this._frustum[4].a = viewProjection.get_m13();
    this._frustum[4].b = viewProjection.get_m23();
    this._frustum[4].c = viewProjection.get_m33();
    this._frustum[4].d = viewProjection.get_m43();
    this._frustum[5].a = viewProjection.get_m14() - viewProjection.get_m13();
    this._frustum[5].b = viewProjection.get_m24() - viewProjection.get_m23();
    this._frustum[5].c = viewProjection.get_m34() - viewProjection.get_m33();
    this._frustum[5].d = viewProjection.get_m44() - viewProjection.get_m43();
    for (var i = 0; i < 6; i++) {
      this._frustum[i].normalize();
    }
    this._frustumDirty = false;
    this.WVP.scale(Vector3d.create(this.width / 2, -this.height / 2, 1));
    this.WVP.translate(Vector3d.create(this.width / 2, this.height / 2, 0));
    this._setMatrixes();
  },

  _initGL: function () {
    if (this.gl == null) {
      return;
    }
    var uints_for_indices = this.gl.getExtension('OES_element_index_uint');
    set_tileUvMultiple(1);
    set_tileDemEnabled(true);
    TileShader.init(this);
  },

  freezeView: function () {
    this.targetAlt = this.alt;
    this.targetAz = this.az;
    this.targetCamera = this.viewCamera.copy();
  },

  _setVertexBuffer: function (vertexBuffer) { },

  _setIndexBuffer: function (indexBuffer) { },

  setMaterial: function (material, diffuseTex, specularTex, normalMap, opacity) {
    this.set_mainTexture(diffuseTex);
  },

  preDraw: function () { }
};

registerType("RenderContext", [RenderContext, RenderContext$, null]);

// wwtlib.ScriptInterface

export function ScriptInterface() {
  this._missedReady = false;
  this.hideTourFeedback = false;
  this._smoothAnimation = false;
  this._showCaptions = true;
}

ScriptInterface._containsFitsLikeExtentsion = function (url) {
  var lowerCaseUrl = url.toLowerCase();
  return (ss.endsWith(lowerCaseUrl, 'fits') || ss.endsWith(lowerCaseUrl, 'ftz') || ss.endsWith(lowerCaseUrl, 'fit') || ss.endsWith(lowerCaseUrl, 'fts'));
};

ScriptInterface._addImageSet = function (name, gotoTarget, loaded, imageset) {
  if (ss.whitespace(name)) {
    name = LayerManager.getNextImageSetName();
  }
  var imagesetLayer = LayerManager.addImageSetLayerCallback(imageset, name, loaded);
  if (gotoTarget) {
    var zoom = imageset._guessZoomSetting(globalRenderContext.viewCamera.zoom);
    globalWWTControl.gotoRADecZoom(imageset.get_viewCenterX() / 15, imageset.get_viewCenterY(), zoom, false, null);
  }
  return imagesetLayer;
};

ScriptInterface._addFitsLayer = function (url, name, gotoTarget, loaded) {
  if (ss.whitespace(name)) {
    name = LayerManager.getNextFitsName();
  }
  var imagesetLayer = new ImageSetLayer();
  var imageset = new Imageset();
  var wcsLoaded = function (wcsImage) {
    if ((wcsImage).errored) {
      return;
    }
    var width = ss.truncate(wcsImage.get_sizeX());
    var height = ss.truncate(wcsImage.get_sizeY());
    imageset.setInitialParameters(wcsImage.get_description(), wcsImage.get_filename(), 2, 3, 5, Util.getHashCode(wcsImage.get_filename()), 0, 0, wcsImage.get_scaleY(), '.fits', wcsImage.get_scaleX() > 0, '', wcsImage.get_centerX(), wcsImage.get_centerY(), wcsImage.get_rotation(), false, '', false, false, 1, wcsImage.get_referenceX(), wcsImage.get_referenceY(), wcsImage.get_copyright(), wcsImage.get_creditsUrl(), '', '', 0, '');
    imageset.set_wcsImage(wcsImage);
    imagesetLayer.set_imageSet(imageset);
    LayerManager.addFitsImageSetLayer(imagesetLayer, name);
    if (gotoTarget) {
      var zoom = imageset._guessZoomSetting(globalRenderContext.viewCamera.zoom);
      globalWWTControl.gotoRADecZoom(wcsImage.get_viewCenterX() / 15, wcsImage.get_viewCenterY(), zoom, false, null);
    }
    if (loaded != null) {
      loaded(imagesetLayer);
    }
  };
  if (ss.whitespace(name)) {
    name = LayerManager.getNextFitsName();
  }
  if (useGlVersion2) {
    new FitsImage(imageset, url, null, wcsLoaded);
  }
  else {
    new FitsImageJs(imageset, url, null, wcsLoaded);
  }
  return imagesetLayer;
};

var ScriptInterface$ = {
  add_ready: function (value) {
    this.__ready = ss.bindAdd(this.__ready, value);
  },

  remove_ready: function (value) {
    this.__ready = ss.bindSub(this.__ready, value);
  },

  _fireReady: function () {
    if (this.__ready != null) {
      this.__ready(this, new ss.EventArgs());
    } else {
      this._missedReady = true;
    }
  },

  add_collectionLoaded: function (value) {
    this.__collectionLoaded = ss.bindAdd(this.__collectionLoaded, value);
  },

  remove_collectionLoaded: function (value) {
    this.__collectionLoaded = ss.bindSub(this.__collectionLoaded, value);
  },

  _fireCollectionLoaded: function (url) {
    if (this.__collectionLoaded != null) {
      this.__collectionLoaded(this, new CollectionLoadedEventArgs(url));
    }
  },

  add_colorPickerDisplay: function (value) {
    this.__colorPickerDisplay = ss.bindAdd(this.__colorPickerDisplay, value);
  },

  remove_colorPickerDisplay: function (value) {
    this.__colorPickerDisplay = ss.bindSub(this.__colorPickerDisplay, value);
  },

  add_voTableDisplay: function (value) {
    this.__voTableDisplay = ss.bindAdd(this.__voTableDisplay, value);
  },

  remove_voTableDisplay: function (value) {
    this.__voTableDisplay = ss.bindSub(this.__voTableDisplay, value);
  },

  add_refreshLayerManager: function (value) {
    this.__refreshLayerManager = ss.bindAdd(this.__refreshLayerManager, value);
  },

  remove_refreshLayerManager: function (value) {
    this.__refreshLayerManager = ss.bindSub(this.__refreshLayerManager, value);
  },

  add_arrived: function (value) {
    this.__arrived = ss.bindAdd(this.__arrived, value);
  },

  remove_arrived: function (value) {
    this.__arrived = ss.bindSub(this.__arrived, value);
  },

  add_clicked: function (value) {
    this.__clicked = ss.bindAdd(this.__clicked, value);
  },

  remove_clicked: function (value) {
    this.__clicked = ss.bindSub(this.__clicked, value);
  },

  add_annotationClicked: function (value) {
    this.__annotationClicked = ss.bindAdd(this.__annotationClicked, value);
  },

  remove_annotationClicked: function (value) {
    this.__annotationClicked = ss.bindSub(this.__annotationClicked, value);
  },

  add_imageryLoaded: function (value) {
    this.__imageryLoaded = ss.bindAdd(this.__imageryLoaded, value);
  },

  remove_imageryLoaded: function (value) {
    this.__imageryLoaded = ss.bindSub(this.__imageryLoaded, value);
  },

  add_tourReady: function (value) {
    this.__tourReady = ss.bindAdd(this.__tourReady, value);
  },

  remove_tourReady: function (value) {
    this.__tourReady = ss.bindSub(this.__tourReady, value);
  },

  add_tourError: function (value) {
    this.__tourError = ss.bindAdd(this.__tourError, value);
  },

  remove_tourError: function (value) {
    this.__tourError = ss.bindSub(this.__tourError, value);
  },

  add_tourPaused: function (value) {
    this.__tourPaused = ss.bindAdd(this.__tourPaused, value);
  },

  remove_tourPaused: function (value) {
    this.__tourPaused = ss.bindSub(this.__tourPaused, value);
  },

  add_tourResumed: function (value) {
    this.__tourResumed = ss.bindAdd(this.__tourResumed, value);
  },

  remove_tourResumed: function (value) {
    this.__tourResumed = ss.bindSub(this.__tourResumed, value);
  },

  add_tourEnded: function (value) {
    this.__tourEnded = ss.bindAdd(this.__tourEnded, value);
  },

  remove_tourEnded: function (value) {
    this.__tourEnded = ss.bindSub(this.__tourEnded, value);
  },

  add_slideChanged: function (value) {
    this.__slideChanged = ss.bindAdd(this.__slideChanged, value);
  },

  remove_slideChanged: function (value) {
    this.__slideChanged = ss.bindSub(this.__slideChanged, value);
  },

  add_timeScrubberHook: function (value) {
    this.__timeScrubberHook = ss.bindAdd(this.__timeScrubberHook, value);
  },

  remove_timeScrubberHook: function (value) {
    this.__timeScrubberHook = ss.bindSub(this.__timeScrubberHook, value);
  },

  setTimeScrubberPosition: function (posLeft) {
    LayerManager.setTimeSliderValue(posLeft);
  },

  setTimeSlider: function (name, value) {
    this.__timeScrubberHook(name, value);
  },

  showColorPicker: function (pickerInstance, e) {
    if (this.__colorPickerDisplay != null) {
      this.__colorPickerDisplay(pickerInstance, e);
    }
  },

  displayVoTableLayer: function (layer) {
    if (this.__voTableDisplay != null) {
      this.__voTableDisplay(layer, new ss.EventArgs());
    }
  },

  refreshLayerManagerNow: function () {
    if (this.__refreshLayerManager != null) {
      this.__refreshLayerManager(null, new ss.EventArgs());
    }
  },

  _fireTourReady: function () {
    if (this.__tourReady != null) {
      this.__tourReady(this, new ss.EventArgs());
    }
  },

  _fireTourError: function (ex) {
    if (this.__tourError != null) {
      this.__tourError(ex, new ss.EventArgs());
    }
  },

  _fireTourPaused: function () {
    if (this.__tourPaused != null) {
      this.__tourPaused(this, new ss.EventArgs());
    }
  },

  _fireTourResume: function () {
    if (this.__tourResumed != null) {
      this.__tourResumed(this, new ss.EventArgs());
    }
  },

  _fireTourEnded: function () {
    if (this.__tourEnded != null) {
      this.__tourEnded(this, new ss.EventArgs());
    }
  },

  _fireImageryLoaded: function () {
    if (this.__imageryLoaded != null) {
      this.__imageryLoaded(this, new ss.EventArgs());
    }
  },

  _fireClick: function (ra, dec) {
    if (this.__clicked != null) {
      this.__clicked(this, new ArrivedEventArgs(ra, dec, globalRenderContext.viewCamera.zoom));
    }
  },

  _fireArrived: function (ra, dec, zoom) {
    if (this.__arrived != null) {
      this.__arrived(this, new ArrivedEventArgs(ra, dec, zoom));
    }
  },

  _fireAnnotationclicked: function (RA, Dec, id) {
    try {
      if (this.__annotationClicked != null) {
        this.__annotationClicked(this, new AnnotationClickEventArgs(RA, Dec, id));
      }
    }
    catch ($e1) {
    }
  },

  _fireSlideChanged: function (caption) {
    try {
      if (this.__slideChanged != null) {
        this.__slideChanged(this, new SlideChangedEventArgs(caption));
      }
    }
    catch ($e1) {
    }
  },

  endInit: function () {
    if (this._missedReady) {
      this._fireReady();
    }
  },

  gotoRaDecZoom: function (ra, dec, zoom, instant, roll) {
    if (globalWWTControl != null) {
      globalWWTControl.gotoRADecZoom(ra / 15, dec, zoom * 6, instant, roll);
    }
  },

  setBackgroundImageByName: function (name) {
    if (globalWWTControl != null) {
      globalWWTControl.setBackgroundImageByName(name);
    }
  },

  addVoTableLayer: function (table) {
    return LayerManager.addVoTableLayer(table, 'Vo Table');
  },

  getLayers: function () {
    return LayerManager.get_layerList();
  },

  setForegroundImageByName: function (name) {
    if (globalWWTControl != null) {
      globalWWTControl.setForegroundImageByName(name);
      globalRenderContext.viewCamera.opacity = 100;
    }
  },

  setForegroundOpacity: function (opacity) {
    if (globalWWTControl != null) {
      globalRenderContext.viewCamera.opacity = opacity;
    }
  },

  addCatalogHipsByName: function (name) {
    if (globalWWTControl != null) {
      globalWWTControl.addCatalogHipsByName(name);
    }
  },

  addCatalogHipsByNameWithCallback: function (name, onLoad) {
    if (globalWWTControl != null) {
      globalWWTControl.addCatalogHipsByNameWithCallback(name, onLoad);
    }
  },

  removeCatalogHipsByName: function (name) {
    if (globalWWTControl != null) {
      globalWWTControl.removeCatalogHipsByName(name);
    }
  },

  getCatalogHipsDataInView: function (name, limit, onComplete) {
    if (globalWWTControl != null) {
      globalWWTControl.getCatalogHipsDataInView(name, limit, onComplete);
    }
  },

  setCutsForFits: function (imagesetName, min, max) {
    if (globalWWTControl != null) {
      globalWWTControl.setCutsForFits(imagesetName, min, max);
    }
  },

  setColorMapForFits: function (imagesetName, colorMapName) {
    if (globalWWTControl != null) {
      globalWWTControl.setColorMapForFits(imagesetName, colorMapName);
    }
  },

  setScaleTypeForFits: function (imagesetName, scaleType) {
    if (globalWWTControl != null) {
      globalWWTControl.setScaleTypeForFits(imagesetName, scaleType);
    }
  },

  hideUI: function (hide) { },

  loadTour: function (url) {
    if (globalWWTControl != null) {
      globalWWTControl.playTour(url);
    }
  },

  loadFits: function (url) {
    return this.loadFitsLayer(url, '', true, null);
  },

  loadFitsLayer: function (url, name, gotoTarget, loaded) {
    return this.addImageSetLayer(url, 'fits', name, gotoTarget, loaded);
  },

  addImageSetLayer: function (url, mode, name, gotoTarget, loaded) {
    if (mode != null && mode.toLowerCase() === 'fits') {
      return ScriptInterface._addFitsLayer(url, name, gotoTarget, loaded);
    } else if (mode != null && mode.toLowerCase() === 'preloaded') {
      var imageset = globalWWTControl.getImageSetByUrl(url);
      if (imageset != null) {
        return ScriptInterface._addImageSet(name, gotoTarget, loaded, imageset);
      }
    } else {
      var imageset = globalWWTControl.getImageSetByUrl(url);
      if (imageset != null) {
        return ScriptInterface._addImageSet(name, gotoTarget, loaded, imageset);
      }
      else if (ScriptInterface._containsFitsLikeExtentsion(url)) {
        return ScriptInterface._addFitsLayer(url, name, gotoTarget, loaded);
      }
    }
    return null;
  },

  setImageSetLayerOrder: function (id, order) {
    var layer = LayerManager.get_layerList()[id];
    if (ss.canCast(layer, ImageSetLayer) && order >= 0) {
      ss.remove(layerManagerGetAllMaps()[layer.get_referenceFrame()].layers, layer);
      layerManagerGetAllMaps()[layer.get_referenceFrame()].layers.splice(order, 0, layer);
    }
  },

  isUsingWebGl2: function () {
    return useGlVersion2;
  },

  get_hideTourFeedback: function () {
    return this.hideTourFeedback;
  },

  set_hideTourFeedback: function (value) {
    this.hideTourFeedback = value;
    return value;
  },

  playTour: function () {
    if (globalWWTControl != null) {
      globalWWTControl.playCurrentTour();
    }
  },

  stopTour: function () {
    if (globalWWTControl != null) {
      globalWWTControl.stopCurrentTour();
    }
  },

  loadImageCollection: function (url, loadChildFolders) {
    var $this = this;

    this._imageUrl = url;
    Wtml.getWtmlFile(url, function () {
      $this._fireCollectionLoaded(url);
    }, loadChildFolders);
  },

  _imageFileLoaded: function () {
    this._fireCollectionLoaded(this._imageUrl);
  },

  zoom: function (factor) {
    if (globalWWTControl != null) {
      globalWWTControl.zoom(factor);
    }
    return;
  },

  getRA: function () {
    if (globalWWTControl != null) {
      return globalRenderContext.get_RA();
    }
    return 0;
  },

  getDec: function () {
    if (globalWWTControl != null) {
      return globalRenderContext.get_dec();
    }
    return 0;
  },

  createFolder: function () {
    var folder = new Folder();
    return folder;
  },

  createPolygon: function (fill) {
    var p = new Poly();
    p.set_fill(fill);
    return p;
  },

  createPolyLine: function (fill) {
    return new PolyLine();
  },

  createCircle: function (fill) {
    var c = new Circle();
    c.set_fill(fill);
    return c;
  },

  addAnnotation: function (annotation) {
    if (annotation != null && ss.canCast(annotation, Annotation)) {
      if (globalWWTControl != null) {
        globalWWTControl._addAnnotation(annotation);
      }
    }
  },

  removeAnnotation: function (annotation) {
    if (annotation != null) {
      if (globalWWTControl != null) {
        globalWWTControl._removeAnnotation(annotation);
      }
    }
  },

  clearAnnotations: function () {
    if (globalWWTControl != null) {
      globalWWTControl._clearAnnotations();
    }
  },

  get_smoothAnimation: function () {
    return this._smoothAnimation;
  },

  set_smoothAnimation: function (value) {
    this._smoothAnimation = value;
    return value;
  },

  get_showCaptions: function () {
    return this._showCaptions;
  },

  set_showCaptions: function (value) {
    this._showCaptions = value;
    return value;
  },

  loadVOTable: function (url, useCurrentView) { },

  get_fov: function () {
    if (globalWWTControl != null) {
      return globalRenderContext.viewCamera.zoom / 6;
    }
    return 60;
  }
};

registerType("ScriptInterface", [ScriptInterface, ScriptInterface$, null]);

// wwtlib.FolderDownloadAction

export function FolderDownloadAction(action, loadChildFolders) {
  this.loadChildFolders = false;
  this._numLoadingFolders = 0;
  this._onComplete = action;
  this.loadChildFolders = loadChildFolders;
}

var FolderDownloadAction$ = {
  _folderLoaded: function () {
    this._numLoadingFolders--;
    if (!this._numLoadingFolders) {
      this._onComplete();
    }
  },

  startingNewFolderLoad: function (folder) {
    var $this = this;

    this._numLoadingFolders++;
    folder.childLoadCallback(function () {
      Wtml.loadImagesets(folder, $this);
      $this._folderLoaded();
    });
  }
};

registerType("FolderDownloadAction", [FolderDownloadAction, FolderDownloadAction$, null]);

// wwtlib.Wtml

export function Wtml() { }

Wtml.getWtmlFile = function (url, complete, loadChildFolders) {
  if (loadChildFolders == null) {
    loadChildFolders = false;
  }
  var folder = new Folder();
  folder.set_url(url);
  var folderDownloadAction = new FolderDownloadAction(complete, loadChildFolders);
  folderDownloadAction.startingNewFolderLoad(folder);
  return folder;
};

Wtml.loadImagesets = function (folder, folderDownloadAction) {
  var children = folder.get_children();
  var $enum1 = ss.enumerate(children);
  while ($enum1.moveNext()) {
    var child = $enum1.current;
    if (ss.canCast(child, Imageset)) {
      var imageSet = child;
      WWTControl.addImageSetToRepository(imageSet);
    }
    if (ss.canCast(child, Place)) {
      var place = child;
      if (place.get_studyImageset() != null) {
        WWTControl.addImageSetToRepository(place.get_studyImageset());
      }
      if (place.get_backgroundImageset() != null) {
        WWTControl.addImageSetToRepository(place.get_backgroundImageset());
      }
    }
    if (ss.canCast(child, Folder) && folderDownloadAction.loadChildFolders) {
      folderDownloadAction.startingNewFolderLoad((child));
    }
  }
  if (!ss.emptyString(WWTControl.imageSetName)) {
    var name = WWTControl.imageSetName.toLowerCase();
    var $enum2 = ss.enumerate(WWTControl.getImageSets());
    while ($enum2.moveNext()) {
      var imageset = $enum2.current;
      if (imageset.get_name().toLowerCase() === name) {
        globalRenderContext.set_backgroundImageset(imageset);
      }
    }
  }
};

var Wtml$ = {};

registerType("Wtml", [Wtml, Wtml$, null]);

// wwtlib.WWTControl

export function WWTControl() {
  this.freestandingMode = false;
  this.uiController = null;
  this._annotations = [];
  this._hoverText = '';
  this._hoverTextPoint = new Vector2d();
  this._lastMouseMove = new Date(1900, 1, 0, 0, 0, 0, 0);
  this.layers = [];
  this._frameCount = 0;
  this._zoomMax = 360;
  this._zoomMaxSolarSystem = 10000000000000000;
  this._zoomMin = 0.001373291015625;
  this._zoomMinSolarSystem = 1E-08;
  this.constellation = 'UMA';
  this._fadePoints = null;
  this.fader = BlendState.create(true, 2000);
  this._crossFadeFrame = false;
  this._crossFadeTexture = null;
  this._sprite = new Sprite2d();
  this.renderType = 2;
  this._milkyWayBackground = null;
  this.capturingVideo = false;
  this._videoBlobReady = null;
  this.dumpFrameParams = null;
  this._videoBlobQueue = {};
  this._videoQueueIndex = 0;
  this._emptyFrames = [];
  this._beginZoom = 1;
  this._dragging = false;
  this._mouseDown = false;
  this._hasTwoTouches = false;
  this._lastX = 0;
  this._lastY = 0;
  this._pointerIds = new Array(2);
  this._pinchingZoomRect = new Array(2);
  this._moved = false;
  this._foregroundCanvas = null;
  this._fgDevice = null;
  this._tracking = false;
  this._trackingObject = null;
  this.sandboxMode = false;
  this._solarSystemTrack = 65536;
  this._moving = false;
  this._targetStudyImageset = null;
  this._targetBackgroundImageset = null;
  this.tour = null;
  this.tourEdit = null;
  this._crossHairs = null;
}

WWTControl.imageSets = [];
WWTControl.imageSetName = '';
WWTControl.showDataLayers = false;
WWTControl._renderNeeded = false;
WWTControl.constellationsFigures = null;
WWTControl.constellationsBoundries = null;
WWTControl.solarSystemObjectsNames = ['Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Moon', 'Io', 'Europa', 'Ganymede', 'Callisto', 'IoShadow', 'EuropaShadow', 'GanymedeShadow', 'CallistoShadow', 'SunEclipsed', 'Earth', 'Custom', 'Undefined'];

WWTControl.addImageSetToRepository = function (imagesetToAdd) {
  var $enum1 = ss.enumerate(WWTControl.imageSets);
  while ($enum1.moveNext()) {
    var imageset = $enum1.current;
    if (imageset.get_imageSetID() === imagesetToAdd.get_imageSetID()) {
      return imageset;
    }
  }
  WWTControl.imageSets.push(imagesetToAdd);
  return imagesetToAdd;
};

WWTControl.getImageSets = function () {
  return WWTControl.imageSets;
};

// This parameter does nothing. We keep it to maintain API compatibility.
WWTControl.get_renderNeeded = function () {
  return WWTControl._renderNeeded;
};

// This parameter does nothing. We keep it to maintain API compatibility.
WWTControl.set_renderNeeded = function (value) {
  WWTControl._renderNeeded = true;
  return value;
};

WWTControl.initControl = function (DivId) {
  return WWTControl.initControl2(DivId, true);
};

WWTControl.initControlParam = function (DivId, webgl_ignored) {
  return WWTControl.initControl2(DivId, true);
};

WWTControl.initControl2 = function (DivId, startRenderLoop) {
  return WWTControl.initControl6(DivId, startRenderLoop, 0, 0, 360, 'Sky');
};

WWTControl.initControl6 = function (DivId, startRenderLoop, startLat, startLng, startZoom, startMode) {
  if (globalRenderContext.device == null) {
    WWTControl.scriptInterface = new ScriptInterface();
    WWTControl.scriptInterface.settings = Settings.get_current();
    set_globalScriptInterface(WWTControl.scriptInterface);
    var canvas = WWTControl._createCanvasElement(DivId);
    var gl = canvas.getContext('webgl2');
    if (gl != null) {
      set_useGlVersion2(true);
    } else {
      console.warn('This browser does not support WebGL 2.0. Some features will work suboptimally. To get the full AAS WWT experience, consider using the latest version of Chrome, Firefox or Edge. In case you would like to use Safari, we recommend that you enable WebGL 2.0');
      gl = canvas.getContext('webgl');
    }
    if (gl == null) {
      gl = canvas.getContext('experimental-webgl');
    }
    if (gl == null) {
      var ctx = canvas.getContext('2d');
      globalRenderContext.device = ctx;
    } else {
      set_tilePrepDevice(gl);
      globalRenderContext.gl = gl;
      set_useGl(true);
    }
    globalWWTControl.canvas = canvas;
    globalRenderContext.width = canvas.width;
    globalRenderContext.height = canvas.height;
    globalWWTControl.setup(canvas, startLat, startLng, startZoom);
    Constellations.initializeConstellations();
    LayerManager.oneTimeInitialization();
    if (startMode === 'earth') {
      globalRenderContext.set_backgroundImageset(Imageset.create('Blue Marble', URLHelpers.singleton.coreStaticUrl('wwtweb/tiles.aspx?q={1},{2},{3},bm200407'), 0, 3, 3, 101, 0, 7, 256, 180, '.png', false, '', 0, 0, 0, false, URLHelpers.singleton.coreStaticUrl('wwtweb/thumbnail.aspx?name=bm200407'), true, false, 0, 0, 0, '', '', '', '', 6371000, 'Earth'));
    } else if (startMode === 'black') {
      globalRenderContext.set_backgroundImageset(Imageset.create('Black Sky Background', '', 2, 3, 3, 102, 0, 0, 256, 180, '.png', false, '0123', 0, 0, 0, false, '', false, false, 2, 0, 0, '', '', '', '', 1, 'Sky'));
    } else {
      globalRenderContext.set_backgroundImageset(Imageset.create('DSS', URLHelpers.singleton.coreStaticUrl('wwtweb/dss.aspx?q={1},{2},{3}'), 2, 3, 3, 100, 0, 12, 256, 180, '.png', false, '', 0, 0, 0, false, URLHelpers.singleton.coreStaticUrl('thumbnails/DSS.png'), true, false, 0, 0, 0, '', '', '', '', 1, 'Sky'));
    }
  }
  globalRenderContext.viewCamera.lng += 0;
  globalRenderContext._initGL();
  if (startRenderLoop) {
    globalWWTControl.render();
  }
  return globalScriptInterface;
};

WWTControl._createCanvasElement = function (DivId) {
  var div = document.getElementById(DivId);
  var canvas = document.createElement('canvas');
  canvas.height = div.clientHeight;
  canvas.width = div.clientWidth;
  div.appendChild(canvas);
  return canvas;
};

WWTControl.useUserLocation = function () {
  navigator.geolocation.getCurrentPosition(WWTControl._getLocation, WWTControl._getLocationError);
};

WWTControl._getLocation = function (pos) {
  if (!!pos.coords.latitude) {
    Settings.get_globalSettings().set_locationLat(pos.coords.latitude);
  }
  if (!!pos.coords.longitude) {
    Settings.get_globalSettings().set_locationLng(pos.coords.longitude);
  }
  if (!!pos.coords.altitude) {
    Settings.get_globalSettings().set_locationAltitude(pos.coords.altitude);
  }
};

WWTControl._getLocationError = function (pos) {
  if (pos != null && pos.coords != null) {
    var lat = pos.coords.latitude;
    var lng = pos.coords.longitude;
  }
};

WWTControl.setBackgroundImageName = function (name) {
  WWTControl.imageSetName = name;
};

WWTControl.setForegroundImageName = function (name) {
  WWTControl.imageSetName = name;
};

WWTControl.showLayers = function (show) {
  WWTControl.showDataLayers = show;
};

var WWTControl$ = {
  _addAnnotation: function (annotation) {
    this._annotations.push(annotation);
    Annotation.batchDirty = true;
  },

  _removeAnnotation: function (annotation) {
    ss.remove(this._annotations, annotation);
    Annotation.batchDirty = true;
  },

  _clearAnnotations: function () {
    this._annotations.length = 0;
    Annotation.batchDirty = true;
  },

  _annotationclicked: function (ra, dec, x, y) {
    if (this._annotations != null && this._annotations.length > 0) {
      var index = 0;
      var $enum1 = ss.enumerate(this._annotations);
      while ($enum1.moveNext()) {
        var note = $enum1.current;
        if (note.hitTest(this.renderContext, ra, dec, x, y)) {
          globalScriptInterface._fireAnnotationclicked(ra, dec, note.get_id());
          return true;
        }
        index++;
      }
    }
    return false;
  },

  _annotationHover: function (ra, dec, x, y) {
    if (this._annotations != null && this._annotations.length > 0) {
      var index = 0;
      var $enum1 = ss.enumerate(this._annotations);
      while ($enum1.moveNext()) {
        var note = $enum1.current;
        if (note.hitTest(this.renderContext, ra, dec, x, y)) {
          this._hoverText = note.get_label();
          this._hoverTextPoint = Vector2d.create(x, y);
          return true;
        }
        index++;
      }
    }
    return false;
  },

  get_zoomMax: function () {
    if (this.renderContext.get_backgroundImageset() != null && this.renderContext.get_backgroundImageset().get_dataSetType() == ImageSetType.solarSystem) {
      return this._zoomMaxSolarSystem;
    } else {
      return this._zoomMax;
    }
  },

  set_zoomMax: function (value) {
    this._zoomMax = value;
    return value;
  },

  setSolarSystemMaxZoom: function (value) {
    this._zoomMaxSolarSystem = value;
  },

  get_zoomMin: function () {
    if (this.renderContext.get_backgroundImageset() != null && this.renderContext.get_backgroundImageset().get_dataSetType() == ImageSetType.solarSystem) {
      return this._zoomMinSolarSystem;
    } else {
      return this._zoomMin;
    }
  },

  set_zoomMin: function (value) {
    this._zoomMin = value;
    return value;
  },

  setSolarSystemMinZoom: function (value) {
    this._zoomMinSolarSystem = value;
  },

  _notifyMoveComplete: function () { },

  get_crossFadeFrame: function () {
    return this._crossFadeFrame;
  },

  set_crossFadeFrame: function (value) {
    if (value && this._crossFadeFrame !== value) {
      if (this._crossFadeTexture != null) {
      }
      this._crossFadeTexture = this.renderContext._getScreenTexture();
    }
    this._crossFadeFrame = value;
    if (!value) {
      if (this._crossFadeTexture != null) {
        this._crossFadeTexture = null;
      }
    }
    return value;
  },

  _fadeFrame: function () {
    if (this.renderContext.gl != null) {
      var sp = Settings.get_active().getSetting(17);
      if ((sp.opacity > 0)) {
        var color = Color._fromArgbColor(255 - UiTools.gamma(255 - ss.truncate((sp.opacity * 255)), 1 / 2.2), Colors.get_black());
        if (!(sp.opacity > 0)) {
          color = Color._fromArgbColor(255 - UiTools.gamma(255 - ss.truncate((sp.opacity * 255)), 1 / 2.2), Colors.get_black());
        }
        if (this._crossFadeFrame) {
          color = Color._fromArgbColor(UiTools.gamma(ss.truncate((sp.opacity * 255)), 1 / 2.2), Colors.get_white());
        }
        else {
          if (this._crossFadeTexture != null) {
            this._crossFadeTexture = null;
          }
        }
        if (this._fadePoints == null) {
          this._fadePoints = new Array(4);
          for (var i = 0; i < 4; i++) {
            this._fadePoints[i] = new PositionColoredTextured();
          }
        }
        this._fadePoints[0].position.x = -this.renderContext.width / 2;
        this._fadePoints[0].position.y = this.renderContext.height / 2;
        this._fadePoints[0].position.z = 1347;
        this._fadePoints[0].tu = 0;
        this._fadePoints[0].tv = 1;
        this._fadePoints[0].color = color;
        this._fadePoints[1].position.x = -this.renderContext.width / 2;
        this._fadePoints[1].position.y = -this.renderContext.height / 2;
        this._fadePoints[1].position.z = 1347;
        this._fadePoints[1].tu = 0;
        this._fadePoints[1].tv = 0;
        this._fadePoints[1].color = color;
        this._fadePoints[2].position.x = this.renderContext.width / 2;
        this._fadePoints[2].position.y = this.renderContext.height / 2;
        this._fadePoints[2].position.z = 1347;
        this._fadePoints[2].tu = 1;
        this._fadePoints[2].tv = 1;
        this._fadePoints[2].color = color;
        this._fadePoints[3].position.x = this.renderContext.width / 2;
        this._fadePoints[3].position.y = -this.renderContext.height / 2;
        this._fadePoints[3].position.z = 1347;
        this._fadePoints[3].tu = 1;
        this._fadePoints[3].tv = 0;
        this._fadePoints[3].color = color;
        this._sprite.draw(this.renderContext, this._fadePoints, 4, this._crossFadeTexture, true, 1);
      }
    }
  },

  captureVideo: function (VideoBlobReady, Width, Height, FramesPerSecond, TotalFrames, Format) {
    this.capturingVideo = true;
    this._videoBlobReady = VideoBlobReady;
    ss.clearKeys(this._videoBlobQueue);
    this._videoQueueIndex = 0;
    this._emptyFrames.length = 0;
    this.dumpFrameParams = new VideoOutputType(Width, Height, FramesPerSecond, Format, true);
    SpaceTimeController.frameDumping = true;
    SpaceTimeController.framesPerSecond = FramesPerSecond;
    SpaceTimeController.totalFrames = TotalFrames;
    SpaceTimeController.currentFrameNumber = 0;
  },

  render: function () {
    var $this = this;

    this.renderOneFrame();
    setTimeout(function () {
      $this.render();
    }, 10);
  },

  renderOneFrame: function () {
    if (this.renderContext.get_backgroundImageset() != null) {
      this.renderType = this.renderContext.get_backgroundImageset().get_dataSetType();
    } else {
      this.renderType = 2;
    }
    var sizeChange = false;
    if (this.canvas.width !== this.canvas.parentNode.clientWidth) {
      this.canvas.width = this.canvas.parentNode.clientWidth;
      sizeChange = true;
    }
    if (this.canvas.height !== this.canvas.parentNode.clientHeight) {
      this.canvas.height = this.canvas.parentNode.clientHeight;
      sizeChange = true;
    }
    if (sizeChange && this.explorer != null) {
      this.explorer.refresh();
    }
    if (this.canvas.width < 1 || this.canvas.height < 1) {
      return;
    }
    if (sizeChange) {
      this._crossHairs = null;
    }
    Tile.lastDeepestLevel = Tile.deepestLevel;
    RenderTriangle.width = this.renderContext.width = this.canvas.width;
    RenderTriangle.height = this.renderContext.height = this.canvas.height;
    Tile.tilesInView = 0;
    Tile.tilesTouched = 0;
    Tile.deepestLevel = 0;
    SpaceTimeController.set_metaNow(ss.now());
    if (this.get__mover() != null) {
      SpaceTimeController.set_now(this.get__mover().get_currentDateTime());
      Planets.updatePlanetLocations(this.get_solarSystemMode());
      if (this.get__mover() != null) {
        var newCam = this.get__mover().get_currentPosition();
        this.renderContext.targetCamera = newCam.copy();
        this.renderContext.viewCamera = newCam.copy();
        if (this.renderContext.space && Settings.get_active().get_galacticMode()) {
          var gPoint = Coordinates.j2000toGalactic(newCam.get_RA() * 15, newCam.get_dec());
          this.renderContext.targetAlt = this.renderContext.alt = gPoint[1];
          this.renderContext.targetAz = this.renderContext.az = gPoint[0];
        }
        else if (this.renderContext.space && Settings.get_active().get_localHorizonMode()) {
          var currentAltAz = Coordinates.equitorialToHorizon(Coordinates.fromRaDec(newCam.get_RA(), newCam.get_dec()), SpaceTimeController.get_location(), SpaceTimeController.get_now());
          this.renderContext.targetAlt = this.renderContext.alt = currentAltAz.get_alt();
          this.renderContext.targetAz = this.renderContext.az = currentAltAz.get_az();
        }
        if (this.get__mover().get_complete()) {
          globalScriptInterface._fireArrived(this.get__mover().get_currentPosition().get_RA(), this.get__mover().get_currentPosition().get_dec(), globalRenderContext.viewCamera.zoom);
          this.set__mover(null);
          this._notifyMoveComplete();
        }
      }
    } else {
      SpaceTimeController.updateClock();
      Planets.updatePlanetLocations(this.get_solarSystemMode());
      this._updateViewParameters();
    }
    this.renderContext.clear();
    if (this.renderType === 4) {
      if (this._solarSystemTrack < 20) {
        var radius = Planets.getAdjustedPlanetRadius(this._solarSystemTrack);
        var distance = this.renderContext.get_solarSystemCameraDistance();
        var camAngle = this.renderContext.get_fovLocal();
      }
      if (this._trackingObject == null) {
      }
      this.renderContext.setupMatricesSolarSystem(true);
      var zoom = this.renderContext.viewCamera.zoom;
      var milkyWayBlend = Math.min(1, Math.max(0, (Math.log(zoom) - 8.4)) / 4.2);
      var milkyWayBlendIn = Math.min(1, Math.max(0, (Math.log(zoom) - 17.9)) / 2.3);
      var matOldMW = this.renderContext.get_world();
      var matLocalMW = this.renderContext.get_world().clone();
      matLocalMW._multiply(Matrix3d._scaling(100000, 100000, 100000));
      matLocalMW._multiply(Matrix3d._rotationX(23.5 / 180 * Math.PI));
      matLocalMW._multiply(Matrix3d.translation(this.renderContext.cameraPosition));
      this.renderContext.set_world(matLocalMW);
      this.renderContext.set_worldBase(matLocalMW);
      this.renderContext.space = true;
      this.renderContext.makeFrustum();
      var lighting = this.renderContext.lighting;
      this.renderContext.lighting = false;
      if (Settings.get_active().get_solarSystemMilkyWay()) {
        if (milkyWayBlend < 1) {
          if (this._milkyWayBackground == null) {
            this._milkyWayBackground = this.getImagesetByName('Digitized Sky Survey (Color)');
          }
          if (this._milkyWayBackground != null) {
            RenderTriangle.cullInside = true;
            var c = (1 - milkyWayBlend) / 2;
            this.renderContext.drawImageSet(this._milkyWayBackground, c * 100);
            RenderTriangle.cullInside = false;
          }
        }
      }
      this._drawSkyOverlays();
      this.renderContext.lighting = lighting;
      this.renderContext.space = false;
      this.renderContext.set_world(matOldMW);
      this.renderContext.set_worldBase(matOldMW);
      this.renderContext.makeFrustum();
      var oldCamera = this.renderContext.cameraPosition;
      var matOld = this.renderContext.get_world();
      var matLocal = this.renderContext.get_world();
      matLocal._multiply(Matrix3d.translation(this.renderContext.viewCamera.viewTarget));
      this.renderContext.cameraPosition = Vector3d.subtractVectors(this.renderContext.cameraPosition, this.renderContext.viewCamera.viewTarget);
      this.renderContext.set_world(matLocal);
      this.renderContext.makeFrustum();
      if (Settings.get_active().get_solarSystemCosmos()) {
        Grids.drawCosmos3D(this.renderContext, 1);
      }
      if (Settings.get_active().get_solarSystemMilkyWay() && milkyWayBlendIn > 0) {
        Grids.drawGalaxyImage(this.renderContext, milkyWayBlendIn);
      }
      if (Settings.get_active().get_solarSystemStars()) {
        Grids.drawStars3D(this.renderContext, 1);
      }
      matLocal = matOld;
      var pnt = this.renderContext.viewCamera.viewTarget;
      var vt = Vector3d.create(-pnt.x, -pnt.y, -pnt.z);
      this.renderContext.cameraPosition = oldCamera;
      matLocal._multiply(Matrix3d.translation(vt));
      this.renderContext.set_world(matLocal);
      this.renderContext.makeFrustum();
      LayerManager._draw(this.renderContext, 1, true, 'Sky', true, false);
      this.renderContext.set_world(matOld);
      this.renderContext.makeFrustum();
      if (this.renderContext.get_solarSystemCameraDistance() < 15000) {
        this.renderContext.setupMatricesSolarSystem(false);
        if (Settings.get_active().get_solarSystemMinorPlanets()) {
          MinorPlanets.drawMPC3D(this.renderContext, 1, this.renderContext.viewCamera.viewTarget);
        }
        if (Settings.get_active().get_solarSystemPlanets()) {
          Planets3d.drawPlanets3D(this.renderContext, 1, this.renderContext.viewCamera.viewTarget);
        }
      }
    } else {
      if (!this.renderType || this.renderType === 1) {
        this.renderContext._setupMatricesLand3d();
      }
      else {
        this.renderContext.setupMatricesSpace3d(this.renderContext.width, this.renderContext.height);
      }
      this.renderContext.drawImageSet(this.renderContext.get_backgroundImageset(), 100);
      if (this.renderContext.get_foregroundImageset() != null) {
        if (this.renderContext.get_foregroundImageset().get_dataSetType() !== this.renderContext.get_backgroundImageset().get_dataSetType()) {
          this.renderContext.set_foregroundImageset(null);
        }
        else {
          if (this.renderContext.viewCamera.opacity !== 100 && this.renderContext.gl == null) {
            if (this._foregroundCanvas.width !== this.renderContext.width || this._foregroundCanvas.height !== this.renderContext.height) {
              this._foregroundCanvas.width = ss.truncate(this.renderContext.width);
              this._foregroundCanvas.height = ss.truncate(this.renderContext.height);
            }
            var saveDevice = this.renderContext.device;
            this._fgDevice.clearRect(0, 0, this.renderContext.width, this.renderContext.height);
            this.renderContext.device = this._fgDevice;
            this.renderContext.drawImageSet(this.renderContext.get_foregroundImageset(), 100);
            this.renderContext.device = saveDevice;
            this.renderContext.device.save();
            this.renderContext.device.globalAlpha = this.renderContext.viewCamera.opacity / 100;
            this.renderContext.device.drawImage(this._foregroundCanvas, 0, 0);
            this.renderContext.device.restore();
          }
          else {
            this.renderContext.drawImageSet(this.renderContext.get_foregroundImageset(), this.renderContext.viewCamera.opacity);
          }
        }
      }
      if (this.renderType === 2) {
        var $enum1 = ss.enumerate(this.renderContext.get_catalogHipsImagesets());
        while ($enum1.moveNext()) {
          var imageset = $enum1.current;
          if (imageset.get_hipsProperties().get_catalogSpreadSheetLayer().enabled && imageset.get_hipsProperties().get_catalogSpreadSheetLayer().lastVersion === imageset.get_hipsProperties().get_catalogSpreadSheetLayer().get_version()) {
            this.renderContext.drawImageSet(imageset, 100);
          }
        }
      }
      if (this.renderType === 2 && Settings.get_active().get_showSolarSystem()) {
        Planets.drawPlanets(this.renderContext, 1);
        this.constellation = Constellations.containment.findConstellationForPoint(this.renderContext.viewCamera.get_RA(), this.renderContext.viewCamera.get_dec());
        this._drawSkyOverlays();
      }
      if (this.get_planetLike() || this.get_space()) {
        if (!this.get_space()) {
          var angle = Coordinates.mstFromUTC2(SpaceTimeController.get_now(), 0) / 180 * Math.PI;
          this.renderContext.set_worldBaseNonRotating(Matrix3d.multiplyMatrix(Matrix3d._rotationY(angle), this.renderContext.get_worldBase()));
          if (this._targetBackgroundImageset != null) {
            this.renderContext.set_nominalRadius(this._targetBackgroundImageset.get_meanRadius());
          }
        }
        else {
          this.renderContext.set_worldBaseNonRotating(this.renderContext.get_world());
          if (this._targetBackgroundImageset != null) {
            this.renderContext.set_nominalRadius(this._targetBackgroundImageset.get_meanRadius());
          }
        }
        var referenceFrame = this.getCurrentReferenceFrame();
        LayerManager._draw(this.renderContext, 1, this.get_space(), referenceFrame, true, this.get_space());
      }
    }
    var worldSave = this.renderContext.get_world();
    var viewSave = this.renderContext.get_view();
    var projSave = this.renderContext.get_projection();
    if (Settings.get_current().get_showCrosshairs()) {
      this._drawCrosshairs(this.renderContext);
    }
    if (this.uiController != null) {
      this.uiController.render(this.renderContext);
    } else {
      var index = 0;
      Annotation.prepBatch(this.renderContext);
      var $enum2 = ss.enumerate(this._annotations);
      while ($enum2.moveNext()) {
        var item = $enum2.current;
        item.draw(this.renderContext);
        index++;
      }
      Annotation.drawBatch(this.renderContext);
      if ((ss.now() - this._lastMouseMove) > 400) {
        var raDecDown = this.getCoordinatesForScreenPoint(this._hoverTextPoint.x, this._hoverTextPoint.y);
        this._annotationHover(raDecDown.x, raDecDown.y, this._hoverTextPoint.x, this._hoverTextPoint.y);
        this._lastMouseMove = new Date(2100, 1, 1);
      }
      if (!ss.emptyString(this._hoverText)) {
        this._drawHoverText(this.renderContext);
      }
    }
    var tilesAllLoaded = !TileCache.get_queueCount();
    this.renderContext.setupMatricesOverlays();
    this._fadeFrame();
    this._frameCount++;
    TileCache.decimateQueue();
    TileCache.processQueue(this.renderContext);
    Tile.currentRenderGeneration++;
    if (!TourPlayer.get_playing()) {
      this.set_crossFadeFrame(false);
    }
    this.renderContext.set_world(worldSave);
    this.renderContext.set_view(viewSave);
    this.renderContext.set_projection(projSave);
    var now = ss.now();
    var ms = now - this._lastUpdate;
    if (ms > 1000) {
      this._lastUpdate = now;
      this._frameCount = 0;
      RenderTriangle.trianglesRendered = 0;
      RenderTriangle.trianglesCulled = 0;
    }
    if (this.capturingVideo) {
      if ((this.dumpFrameParams != null) && (!this.dumpFrameParams.waitDownload || tilesAllLoaded)) {
        this.captureFrameForVideo(this._videoBlobReady, this.dumpFrameParams.width, this.dumpFrameParams.height, this.dumpFrameParams.format);
        SpaceTimeController.nextFrame();
      }
      if (SpaceTimeController.get_doneDumping()) {
        SpaceTimeController.frameDumping = false;
        SpaceTimeController.cancelFrameDump = false;
        this.capturingVideo = false;
      }
    }
  },

  getCurrentReferenceFrame: function () {
    if (this.renderContext.get_backgroundImageset() == null) {
      return 'Sun';
    }
    if (!ss.emptyString(this.renderContext.get_backgroundImageset().get_referenceFrame())) {
      return this.renderContext.get_backgroundImageset().get_referenceFrame();
    }
    if (!this.renderContext.get_backgroundImageset().get_dataSetType()) {
      return 'Earth';
    }
    if (this.renderContext.get_backgroundImageset().get_name() === 'Visible Imagery' && this.renderContext.get_backgroundImageset().get_url().toLowerCase().indexOf('mars') > -1) {
      this.renderContext.get_backgroundImageset().set_referenceFrame('Mars');
      return this.renderContext.get_backgroundImageset().get_referenceFrame();
    }
    if (this.renderContext.get_backgroundImageset().get_dataSetType() === 1) {
      var $enum1 = ss.enumerate(WWTControl.solarSystemObjectsNames);
      while ($enum1.moveNext()) {
        var name = $enum1.current;
        if (this.renderContext.get_backgroundImageset().get_name().toLowerCase().indexOf(name.toLowerCase()) > -1) {
          this.renderContext.get_backgroundImageset().set_referenceFrame(name);
          return name;
        }
      }
    }
    if (this.renderContext.get_backgroundImageset().get_dataSetType() === 2) {
      return 'Sky';
    }
    return '';
  },

  get_planetLike: function () {
    if (this.renderContext.get_backgroundImageset() != null) {
      return !this.renderContext.get_backgroundImageset().get_dataSetType() || this.renderContext.get_backgroundImageset().get_dataSetType() === 1;
    } else {
      return true;
    }
  },

  get_space: function () {
    if (this.renderContext.get_backgroundImageset() != null) {
      return this.renderContext.get_backgroundImageset().get_dataSetType() === 2;
    } else {
      return true;
    }
  },

  _drawSkyOverlays: function () {
    if (Settings.get_active().get_showConstellationPictures() && !this.freestandingMode) {
      Constellations.drawArtwork(this.renderContext);
    }
    if (Settings.get_active().get_showConstellationFigures()) {
      if (WWTControl.constellationsFigures == null) {
        WWTControl.constellationsFigures = Constellations.create('Constellations', URLHelpers.singleton.engineAssetUrl('figures.txt'), false, false, false);
      }
      WWTControl.constellationsFigures.draw(this.renderContext, false, 'UMA', false);
    }
    if (Settings.get_active().get_showEclipticGrid()) {
      Grids.drawEclipticGrid(this.renderContext, 1, Settings.get_active().get_eclipticGridColor());
      if (Settings.get_active().get_showEclipticGridText()) {
        Grids.drawEclipticGridText(this.renderContext, 1, Settings.get_active().get_eclipticGridColor());
      }
    }
    if (Settings.get_active().get_showGalacticGrid()) {
      Grids.drawGalacticGrid(this.renderContext, 1, Settings.get_active().get_galacticGridColor());
      if (Settings.get_active().get_showGalacticGridText()) {
        Grids.drawGalacticGridText(this.renderContext, 1, Settings.get_active().get_galacticGridColor());
      }
    }
    if (Settings.get_active().get_showAltAzGrid()) {
      Grids.drawAltAzGrid(this.renderContext, 1, Settings.get_active().get_altAzGridColor());
      if (Settings.get_active().get_showAltAzGridText()) {
        Grids.drawAltAzGridText(this.renderContext, 1, Settings.get_active().get_altAzGridColor());
      }
    }
    if (Settings.get_active().get_showPrecessionChart()) {
      Grids.drawPrecessionChart(this.renderContext, 1, Settings.get_active().get_precessionChartColor());
    }
    if (Settings.get_active().get_showEcliptic()) {
      Grids.drawEcliptic(this.renderContext, 1, Settings.get_active().get_eclipticColor());
      if (Settings.get_active().get_showEclipticOverviewText()) {
        Grids.drawEclipticText(this.renderContext, 1, Settings.get_active().get_eclipticColor());
      }
    }
    if (Settings.get_active().get_showGrid()) {
      Grids.drawEquitorialGrid(this.renderContext, 1, Settings.get_active().get_equatorialGridColor());
      if (Settings.get_active().get_showEquatorialGridText()) {
        Grids.drawEquitorialGridText(this.renderContext, 1, Settings.get_active().get_equatorialGridColor());
      }
    }
    if (Settings.get_active().get_showConstellationBoundries()) {
      if (WWTControl.constellationsBoundries == null) {
        WWTControl.constellationsBoundries = Constellations.create('Constellations', URLHelpers.singleton.engineAssetUrl('constellations.txt'), true, false, false);
      }
      WWTControl.constellationsBoundries.draw(this.renderContext, Settings.get_active().get_showConstellationSelection(), this.constellation, false);
    }
    if (Settings.get_active().get_showConstellationLabels()) {
      Constellations.drawConstellationNames(this.renderContext, 1, Colors.get_yellow());
    }
  },

  _drawHoverText: function (RenderContext) {
    if (RenderContext.gl == null) {
      var ctx = RenderContext.device;
      ctx.save();
      ctx.fillStyle = 'White';
      ctx.font = '15px Arial';
      ctx.fillText(this._hoverText, this._hoverTextPoint.x, this._hoverTextPoint.y);
      ctx.restore();
    }
  },

  rAtoViewLng: function (ra) {
    return (((180 - (ra / 24 * 360) - 180) + 540) % 360) - 180;
  },

  _updateViewParameters: function () {
    if (this.renderContext.space && this._tracking && this._trackingObject != null) {
      if (Settings.get_active().get_galacticMode() && this.renderContext.space) {
        var gPoint = Coordinates.j2000toGalactic(this._trackingObject.get_RA() * 15, this._trackingObject.get_dec());
        this.renderContext.targetAlt = this.renderContext.alt = gPoint[1];
        this.renderContext.targetAz = this.renderContext.az = gPoint[0];
      }
      else if (this.renderContext.space && Settings.get_active().get_localHorizonMode()) {
        var currentAltAz = Coordinates.equitorialToHorizon(Coordinates.fromRaDec(this._trackingObject.get_RA(), this._trackingObject.get_dec()), SpaceTimeController.get_location(), SpaceTimeController.get_now());
        this.renderContext.targetAlt = currentAltAz.get_alt();
        this.renderContext.targetAz = currentAltAz.get_az();
      }
      else {
        this.renderContext.viewCamera.lng = this.renderContext.targetCamera.lng = this.rAtoViewLng(this._trackingObject.get_RA());
        this.renderContext.viewCamera.lat = this.renderContext.targetCamera.lat = this._trackingObject.get_dec();
      }
    } else if (!this.get_solarSystemMode()) {
      this._tracking = false;
      this._trackingObject = null;
    }
    var oneMinusDragCoefficient = 1 - 0.8;
    var dc = 0.8;
    if (!this._tracking) {
      var minDelta = (this.renderContext.viewCamera.zoom / 4000);
      if (this.renderContext.viewCamera.zoom > 360) {
        minDelta = (360 / 40000);
      }
      if (this.renderContext.space && (Settings.get_active().get_localHorizonMode() || Settings.get_active().get_galacticMode())) {
        if ((((Math.abs(this.renderContext.targetAlt - this.renderContext.alt) >= minDelta) | (Math.abs(this.renderContext.targetAz - this.renderContext.az) >= minDelta)) === 1)) {
          this.renderContext.alt += (this.renderContext.targetAlt - this.renderContext.alt) / 10;
          if (Math.abs(this.renderContext.targetAz - this.renderContext.az) > 170) {
            if (this.renderContext.targetAz > this.renderContext.az) {
              this.renderContext.az += (this.renderContext.targetAz - (360 + this.renderContext.az)) / 10;
            }
            else {
              this.renderContext.az += ((360 + this.renderContext.targetAz) - this.renderContext.az) / 10;
            }
          }
          else {
            this.renderContext.az += (this.renderContext.targetAz - this.renderContext.az) / 10;
          }
          this.renderContext.az = ((this.renderContext.az + 720) % 360);
        }
      }
      else {
        if ((((Math.abs(this.renderContext.targetCamera.lat - this.renderContext.viewCamera.lat) >= minDelta) | (Math.abs(this.renderContext.targetCamera.lng - this.renderContext.viewCamera.lng) >= minDelta)) === 1)) {
          this.renderContext.viewCamera.lat += (this.renderContext.targetCamera.lat - this.renderContext.viewCamera.lat) / 10;
          if (Math.abs(this.renderContext.targetCamera.lng - this.renderContext.viewCamera.lng) > 170) {
            if (this.renderContext.targetCamera.lng > this.renderContext.viewCamera.lng) {
              this.renderContext.viewCamera.lng += (this.renderContext.targetCamera.lng - (360 + this.renderContext.viewCamera.lng)) / 10;
            }
            else {
              this.renderContext.viewCamera.lng += ((360 + this.renderContext.targetCamera.lng) - this.renderContext.viewCamera.lng) / 10;
            }
          }
          else {
            this.renderContext.viewCamera.lng += (this.renderContext.targetCamera.lng - this.renderContext.viewCamera.lng) / 10;
          }
          this.renderContext.viewCamera.lng = ((this.renderContext.viewCamera.lng + 720) % 360);
        }
        else {
          if (this.renderContext.viewCamera.lat !== this.renderContext.targetCamera.lat || this.renderContext.viewCamera.lng !== this.renderContext.targetCamera.lng) {
            this.renderContext.viewCamera.lat = this.renderContext.targetCamera.lat;
            this.renderContext.viewCamera.lng = this.renderContext.targetCamera.lng;
          }
        }
      }
    }
    this.renderContext.viewCamera.zoom = dc * this.renderContext.viewCamera.zoom + oneMinusDragCoefficient * this.renderContext.targetCamera.zoom;
    this.renderContext.viewCamera.rotation = dc * this.renderContext.viewCamera.rotation + oneMinusDragCoefficient * this.renderContext.targetCamera.rotation;
    this.renderContext.viewCamera.angle = dc * this.renderContext.viewCamera.angle + oneMinusDragCoefficient * this.renderContext.targetCamera.angle;
  },

  move: function (x, y) {
    var angle = Math.atan2(y, x);
    var distance = Math.sqrt(x * x + y * y);
    if (this.get_solarSystemMode() || this.get_planetLike()) {
      x = Math.cos(angle + this.renderContext.viewCamera.rotation) * distance;
      y = Math.sin(angle + this.renderContext.viewCamera.rotation) * distance;
    } else {
      x = Math.cos(angle - this.renderContext.viewCamera.rotation) * distance;
      y = Math.sin(angle - this.renderContext.viewCamera.rotation) * distance;
    }
    var scaleY = this.renderContext.get_fovScale() / 3600;
    if (this.renderContext.get_backgroundImageset().get_dataSetType() == ImageSetType.solarSystem) {
      scaleY = 0.06;
    }
    var scaleX = scaleY / Math.max(0.2, Math.cos(this.renderContext.viewCamera.lat / 180 * Math.PI));
    if (!this.renderContext.get_backgroundImageset().get_dataSetType() || this.renderContext.get_backgroundImageset().get_dataSetType() === 1 || this.renderContext.get_backgroundImageset().get_dataSetType() == ImageSetType.solarSystem) {
      scaleX *= 6.3;
      scaleY *= 6.3;
    }
    if (this.renderContext.space && (Settings.get_active().get_galacticMode() || Settings.get_active().get_localHorizonMode())) {
      x = (Settings.get_active().get_localHorizonMode()) ? -x : x;
      this.renderContext.targetAz += x * scaleX;
      this.renderContext.targetAz = ((this.renderContext.targetAz + 720) % 360);
      this.renderContext.targetAlt += y * scaleY;
      if (this.renderContext.targetAlt > 90) {
        this.renderContext.targetAlt = 90;
      }
      if (this.renderContext.targetAlt < -90) {
        this.renderContext.targetAlt = -90;
      }
    } else {
      this.renderContext.targetCamera.lng -= x * scaleX;
      this.renderContext.targetCamera.lng = ((this.renderContext.targetCamera.lng + 720) % 360);
      this.renderContext.targetCamera.lat += y * scaleY;
      if (this.renderContext.targetCamera.lat > 90) {
        this.renderContext.targetCamera.lat = 90;
      }
      if (this.renderContext.targetCamera.lat < -90) {
        this.renderContext.targetCamera.lat = -90;
      }
    }
    if (!Settings.get_globalSettings().get_smoothPan()) {
      this.renderContext.viewCamera = this.renderContext.targetCamera.copy();
    }
    if (!!x && !!y) {
      this._tracking = false;
      this._trackingObject = null;
    }
  },

  zoom: function (factor) {
    this.renderContext.targetCamera.zoom *= factor;
    if (this.renderContext.targetCamera.zoom > this.get_zoomMax()) {
      this.renderContext.targetCamera.zoom = this.get_zoomMax();
    }
    if (!Settings.get_globalSettings().get_smoothPan()) {
      this.renderContext.viewCamera = this.renderContext.targetCamera.copy();
    }
  },

  roll: function (angle) {
    this.renderContext.targetCamera.rotation += angle;
  },

  onGestureStart: function (e) {
    this._mouseDown = false;
    this._beginZoom = this.renderContext.viewCamera.zoom;
  },

  onGestureChange: function (e) {
    var g = e;
    this._mouseDown = false;
    this.renderContext.targetCamera.zoom = this.renderContext.viewCamera.zoom = Math.min(360, this._beginZoom * (1 / g.scale));
  },

  onGestureEnd: function (e) {
    var g = e;
    this._mouseDown = false;
  },

  onTouchStart: function (e) {
    var ev = e;
    ev.preventDefault();
    ev.stopPropagation();
    this._lastX = ev.targetTouches[0].pageX;
    this._lastY = ev.targetTouches[0].pageY;
    if (ev.targetTouches.length === 2) {
      this._hasTwoTouches = true;
      return;
    }
    if (this.uiController != null) {
      var ee = new WWTElementEvent(this._lastX, this._lastY);
      if (this.uiController.mouseDown(this, ee)) {
        this._mouseDown = false;
        this._dragging = false;
        return;
      }
    }
    this._mouseDown = true;
  },

  onTouchMove: function (e) {
    var ev = e;
    if (this._hasTwoTouches) {
      var t0 = ev.touches[0];
      var t1 = ev.touches[1];
      var newRect = new Array(2);
      newRect[0] = Vector2d.create(t0.pageX, t0.pageY);
      newRect[1] = Vector2d.create(t1.pageX, t1.pageY);
      if (this._pinchingZoomRect[0] != null && this._pinchingZoomRect[1] != null) {
        var centerPoint = Vector2d.create(this.renderContext.width / 2, this.renderContext.height / 2);
        var delta1 = Vector2d.subtract(newRect[0], this._pinchingZoomRect[0]);
        var delta2 = Vector2d.subtract(newRect[1], this._pinchingZoomRect[1]);
        var radialDirection1 = Vector2d.subtract(this._pinchingZoomRect[0], centerPoint);
        var radialDirection2 = Vector2d.subtract(this._pinchingZoomRect[1], centerPoint);
        radialDirection1.normalize();
        radialDirection2.normalize();
        var radialDot1 = delta1.x * radialDirection1.x + delta1.y * radialDirection1.y;
        var radialDot2 = delta2.x * radialDirection2.x + delta2.y * radialDirection2.y;
        var radialComponent1 = Vector2d.create(radialDot1 * radialDirection1.x, radialDot1 * radialDirection1.y);
        var radialComponent2 = Vector2d.create(radialDot2 * radialDirection2.x, radialDot2 * radialDirection2.y);
        var angularComponent1 = Vector2d.subtract(delta1, radialComponent1);
        var angularComponent2 = Vector2d.subtract(delta2, radialComponent2);
        var radialMagnitude = radialComponent1.get_length() + radialComponent2.get_length();
        var angularMagnitude = angularComponent1.get_length() + angularComponent2.get_length();
        if (radialMagnitude >= angularMagnitude) {
          var oldDist = this.getDistance(this._pinchingZoomRect[0], this._pinchingZoomRect[1]);
          var newDist = this.getDistance(newRect[0], newRect[1]);
          var ratio = oldDist / newDist;
          this.zoom(ratio);
        }
        else {
          var oldCenterDelta1 = Vector2d.subtract(this._pinchingZoomRect[0], centerPoint);
          var oldCenterDelta2 = Vector2d.subtract(this._pinchingZoomRect[1], centerPoint);
          var newCenterDelta1 = Vector2d.subtract(newRect[0], centerPoint);
          var newCenterDelta2 = Vector2d.subtract(newRect[1], centerPoint);
          var cross1 = this.crossProductZ(oldCenterDelta1, newCenterDelta1);
          var cross2 = this.crossProductZ(oldCenterDelta2, newCenterDelta2);
          var angle1 = Math.asin(cross1 / (oldCenterDelta1.get_length() * newCenterDelta1.get_length()));
          var angle2 = Math.asin(cross2 / (oldCenterDelta2.get_length() * newCenterDelta2.get_length()));
          if (angle1 * angle2 >= 0) {
            var angle = angle1 + angle2;
            if (this.get_planetLike() || this.get_solarSystemMode()) {
              angle *= -1;
            }
            this.roll(angle);
          }
        }
      }
      this._pinchingZoomRect = newRect;
      ev.stopPropagation();
      ev.preventDefault();
      return;
    }
    ev.preventDefault();
    ev.stopPropagation();
    if (this._mouseDown) {
      this._dragging = true;
      var curX = ev.targetTouches[0].pageX - this._lastX;
      var curY = ev.targetTouches[0].pageY - this._lastY;
      this.move(curX, curY);
      this._lastX = ev.targetTouches[0].pageX;
      this._lastY = ev.targetTouches[0].pageY;
    } else {
      if (this.uiController != null) {
        if (this.uiController.mouseMove(this, e)) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
      }
    }
  },

  onTouchEnd: function (e) {
    var ev = e;
    ev.preventDefault();
    ev.stopPropagation();
    this._pinchingZoomRect[0] = null;
    this._pinchingZoomRect[1] = null;
    if (this._hasTwoTouches) {
      if (ev.touches.length < 2) {
        this._hasTwoTouches = false;
      }
      return;
    }
    if (this.uiController != null) {
      var ee = new WWTElementEvent(this._lastX, this._lastY);
      if (this.uiController.mouseUp(this, ee)) {
        this._mouseDown = false;
        this._dragging = false;
        return;
      }
    }
    this._mouseDown = false;
    this._dragging = false;
  },

  onPointerDown: function (e) {
    var pe = e;
    var index = 0;
    var evt = arguments[0], cnv = arguments[0].target; if (cnv.setPointerCapture) { cnv.setPointerCapture(evt.pointerId); } else if (cnv.msSetPointerCapture) { cnv.msSetPointerCapture(evt.pointerId); }
    if (this._pointerIds[0] === pe.pointerId) {
      index = 0;
    } else if (this._pointerIds[1] === pe.pointerId) {
      index = 1;
    } else if (!this._pointerIds[0]) {
      index = 0;
    } else if (!this._pointerIds[1]) {
      index = 1;
    } else {
      return;
    }
    this._pointerIds[index] = pe.pointerId;
    this._pinchingZoomRect[index] = Vector2d.create(e.offsetX, e.offsetY);
  },

  onPointerMove: function (e) {
    var pe = e;
    var index = 0;
    if (this._pointerIds[0] === pe.pointerId) {
      index = 0;
    } else if (this._pointerIds[1] === pe.pointerId) {
      index = 1;
    } else {
      return;
    }
    if (this._pinchingZoomRect[0] != null && this._pinchingZoomRect[1] != null) {
      var oldDist = this.getDistance(this._pinchingZoomRect[0], this._pinchingZoomRect[1]);
      var newRect = Vector2d.create(e.offsetX, e.offsetY);
      var newDist0 = this.getDistance(newRect, this._pinchingZoomRect[0]);
      var ratio0 = oldDist / newDist0;
      var abslog0 = Math.abs(Math.log(ratio0));
      if (!isFinite(abslog0)) {
        abslog0 = 1000;
      }
      var newDist1 = this.getDistance(newRect, this._pinchingZoomRect[1]);
      var ratio1 = oldDist / newDist1;
      var abslog1 = Math.abs(Math.log(ratio1));
      if (!isFinite(abslog1)) {
        abslog1 = 1000;
      }
      if (abslog1 < abslog0) {
        this._pinchingZoomRect[0] = newRect;
        this.zoom(ratio1);
      }
      else {
        this._pinchingZoomRect[1] = newRect;
        this.zoom(ratio0);
      }
    } else {
      this._pinchingZoomRect[index] = Vector2d.create(e.offsetX, e.offsetY);
    }
    e.stopPropagation();
    e.preventDefault();
  },

  onPointerUp: function (e) {
    var pe = e;
    if (this._pointerIds[0] === pe.pointerId) {
      this._pointerIds[0] = -2;
      this._pinchingZoomRect[0] = null;
    }
    if (this._pointerIds[1] === pe.pointerId) {
      this._pointerIds[1] = -2;
      this._pinchingZoomRect[1] = null;
    }
  },

  onMouseDown: function (e) {
    document.addEventListener('mousemove', ss.bind('onMouseMove', this), false);
    document.addEventListener('mouseup', ss.bind('onMouseUp', this), false);
    if (this.uiController != null) {
      if (this.uiController.mouseDown(this, e)) {
        return;
      }
    }
    this._mouseDown = true;
    this._lastX = Mouse.offsetX(this.canvas, e);
    this._lastY = Mouse.offsetY(this.canvas, e);
  },

  onMouseMove: function (e) {
    this._lastMouseMove = ss.now();
    this._hoverTextPoint = Vector2d.create(Mouse.offsetX(this.canvas, e), Mouse.offsetY(this.canvas, e));
    this._hoverText = '';
    if (this._mouseDown) {
      e.preventDefault();
      e.stopPropagation();
      this._moved = true;
      if (e.ctrlKey) {
        this._tilt(Mouse.offsetX(this.canvas, e) - this._lastX, Mouse.offsetY(this.canvas, e) - this._lastY);
      }
      else {
        this.move(Mouse.offsetX(this.canvas, e) - this._lastX, Mouse.offsetY(this.canvas, e) - this._lastY);
      }
      this._lastX = Mouse.offsetX(this.canvas, e);
      this._lastY = Mouse.offsetY(this.canvas, e);
    } else {
      if (this.uiController != null) {
        if (this.uiController.mouseMove(this, e)) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
      }
    }
  },

  onMouseUp: function (e) {
    document.removeEventListener('mousemove', ss.bind('onMouseMove', this), false);
    document.removeEventListener('mouseup', ss.bind('onMouseUp', this), false);
    if (this.uiController != null) {
      if (this.uiController.mouseUp(this, e)) {
        this._mouseDown = false;
        e.preventDefault();
        return;
      }
    }
    if (this._mouseDown && !this._moved) {
      var raDecDown = this.getCoordinatesForScreenPoint(Mouse.offsetX(this.canvas, e), Mouse.offsetY(this.canvas, e));
      if (!this._annotationclicked(raDecDown.x, raDecDown.y, Mouse.offsetX(this.canvas, e), Mouse.offsetY(this.canvas, e))) {
        globalScriptInterface._fireClick(raDecDown.x, raDecDown.y);
      }
    }
    this._mouseDown = false;
    this._moved = false;
  },

  onMouseWheel: function (e) {
    var ev = e;
    var delta;
    if (!!ev.deltaY) {
      delta = -ev.deltaY;
    } else if (!!ev.detail) {
      delta = ev.detail * -1;
    } else {
      delta = ev.wheelDelta;
    }
    if (delta > 0) {
      this.zoom(0.9);
    } else {
      this.zoom(1.1);
    }
    e.stopPropagation();
    e.preventDefault();
  },

  onDoubleClick: function (e) {
    WWTControl.showDataLayers = true;
  },

  onKeyDown: function (e) {
    if (this.uiController != null) {
      this.uiController.keyDown(this, e);
    }
  },

  getDistance: function (a, b) {
    var x;
    var y;
    x = a.x - b.x;
    y = a.y - b.y;
    return Math.sqrt(x * x + y * y);
  },

  crossProductZ: function (a, b) {
    return a.x * b.y - a.y * b.x;
  },

  onContextMenu: function (e) {
    e.preventDefault();
    e.stopPropagation();
  },

  _tilt: function (x, y) {
    this.renderContext.targetCamera.rotation += x * 0.001;
    this.renderContext.targetCamera.angle += y * 0.001;
    if (this.renderContext.targetCamera.angle < -1.52) {
      this.renderContext.targetCamera.angle = -1.52;
    }
    if (this.renderContext.targetCamera.angle > 0) {
      this.renderContext.targetCamera.angle = 0;
    }
  },

  getCoordinatesForScreenPoint: function (x, y) {
    var pt = Vector2d.create(x, y);
    var PickRayDir = this.transformPickPointToWorldSpace(pt, this.renderContext.width, this.renderContext.height);
    return Coordinates.cartesianToSphericalSky(PickRayDir);
  },

  transformPickPointToWorldSpace: function (ptCursor, backBufferWidth, backBufferHeight) {
    var vPickRayDir = new Vector3d();
    if (this.renderContext.get_projection() != null) {
      var v = new Vector3d();
      v.x = (((2 * ptCursor.x) / backBufferWidth) - 1) / this.renderContext.get_projection().get_m11();
      v.y = (((2 * ptCursor.y) / backBufferHeight) - 1) / this.renderContext.get_projection().get_m22();
      v.z = 1;
      var m = Matrix3d.multiplyMatrix(this.renderContext.get_view(), this.renderContext.get_world());
      m.invert();
      vPickRayDir.x = v.x * m.get_m11() + v.y * m.get_m21() + v.z * m.get_m31();
      vPickRayDir.y = v.x * m.get_m12() + v.y * m.get_m22() + v.z * m.get_m32();
      vPickRayDir.z = v.x * m.get_m13() + v.y * m.get_m23() + v.z * m.get_m33();
      vPickRayDir.normalize();
    }
    return vPickRayDir;
  },

  transformWorldPointToPickSpace: function (worldPoint, backBufferWidth, backBufferHeight) {
    var m = Matrix3d.multiplyMatrix(this.renderContext.get_view(), this.renderContext.get_world());
    m.invert();
    var p = new Vector2d();
    var vz = worldPoint.x * m.get_m31() + worldPoint.y * m.get_m32() + worldPoint.z * m.get_m33();
    var vx = (worldPoint.x * m.get_m11() + worldPoint.y * m.get_m12() + worldPoint.z * m.get_m13()) / vz;
    var vy = (worldPoint.x * m.get_m21() + worldPoint.y * m.get_m22() + worldPoint.z * m.get_m23()) / vz;
    p.x = Math.round((1 + this.renderContext.get_projection().get_m11() * vx) * (backBufferWidth / 2));
    p.y = Math.round((1 + this.renderContext.get_projection().get_m22() * vy) * (backBufferHeight / 2));
    return p;
  },

  getScreenPointForCoordinates: function (ra, dec) {
    var pt = Vector2d.create(ra, dec);
    var cartesian = Coordinates.sphericalSkyToCartesian(pt);
    var result = this.transformWorldPointToPickSpace(cartesian, this.renderContext.width, this.renderContext.height);
    return result;
  },

  setup: function (canvas, startLat, startLng, startZoom) {
    var $this = this;

    window.addEventListener('contextmenu', ss.bind('onContextMenu', this), false);
    document.body.addEventListener('keydown', ss.bind('onKeyDown', this), false);
    canvas.addEventListener('dblclick', ss.bind('onDoubleClick', this), false);
    canvas.addEventListener('mousedown', ss.bind('onMouseDown', this), false);
    canvas.addEventListener('wheel', ss.bind('onMouseWheel', this), false);
    canvas.addEventListener('mousewheel', ss.bind('onMouseWheel', this), false);
    canvas.addEventListener('DOMMouseScroll', ss.bind('onMouseWheel', this), false);
    canvas.addEventListener('touchstart', ss.bind('onTouchStart', this), false);
    canvas.addEventListener('touchmove', ss.bind('onTouchMove', this), false);
    canvas.addEventListener('touchend', ss.bind('onTouchEnd', this), false);
    canvas.addEventListener('gesturechange', ss.bind('onGestureChange', this), false);
    canvas.addEventListener('gesturestart', ss.bind('onGestureStart', this), false);
    canvas.addEventListener('gestureend', ss.bind('onGestureEnd', this), false);
    canvas.addEventListener('pointerdown', ss.bind('onPointerDown', this), false);
    canvas.addEventListener('pointermove', ss.bind('onPointerMove', this), false);
    canvas.addEventListener('pointerup', ss.bind('onPointerUp', this), false);
    this.renderContext.viewCamera.lat = startLat;
    this.renderContext.viewCamera.lng = startLng;
    this.renderContext.viewCamera.zoom = startZoom;
    this.renderContext.targetCamera = this.renderContext.viewCamera.copy();
    if (this.renderContext.gl == null) {
      this._foregroundCanvas = document.createElement('canvas');
      this._foregroundCanvas.width = canvas.width;
      this._foregroundCanvas.height = canvas.height;
      this._fgDevice = this._foregroundCanvas.getContext('2d');
    }
    if (this.freestandingMode) {
      setTimeout(function () {
        $this._setupComplete();
      }, 0);
    } else {
      Wtml.getWtmlFile(URLHelpers.singleton.coreDynamicUrl('wwtweb/catalog.aspx?X=ImageSets6'), ss.bind('_setupComplete', this), true);
    }
  },

  _setupComplete: function () {
    globalScriptInterface._fireReady();
  },

  gotoRADecZoom: function (ra, dec, zoom, instant, roll) {
    this._tracking = false;
    this._trackingObject = null;
    this.gotoTargetFull(false, instant, this._cameraParametersFromRADecZoom(ra, dec, zoom, roll), globalRenderContext.get_foregroundImageset(), globalRenderContext.get_backgroundImageset());
  },

  _cameraParametersFromRADecZoom: function (ra, dec, zoom, roll) {
    while (ra > 24) {
      ra -= 24;
    }
    while (ra < 0) {
      ra += 24;
    }
    dec = DoubleUtilities.clamp(dec, -90, 90);
    zoom = DoubleUtilities.clamp(zoom, this.get_zoomMin(), this.get_zoomMax());
    var rotation = (roll == null) ? globalRenderContext.viewCamera.rotation : roll;
    var cameraParams = CameraParameters.create(dec, globalRenderContext.rAtoViewLng(ra), zoom, rotation, globalRenderContext.viewCamera.angle, globalRenderContext.viewCamera.opacity);
    return cameraParams;
  },

  timeToRADecZoom: function (ra, dec, zoom, roll) {
    var cameraParams = this._cameraParametersFromRADecZoom(ra, dec, zoom, roll);
    return this.timeToTargetFull(cameraParams, false);
  },

  get_solarSystemMode: function () {
    if (this.renderContext.get_backgroundImageset() == null) {
      return false;
    }
    return this.renderContext.get_backgroundImageset().get_dataSetType() == ImageSetType.solarSystem;
  },

  gotoTarget: function (place, noZoom, instant, trackObject) {
    if (place == null) {
      return;
    }
    if ((trackObject && this.get_solarSystemMode())) {
      if ((place.get_classification() === 536870912 && place.get_type() !== 4) || (place.get_classification() === 1) || (place.get_classification() === 1048576) && place.get_distance() > 0) {
        var target = 65536;
        if (place.get_classification() === 1 || place.get_classification() === 1048576) {
          target = 20;
        }
        else {
          try {
            if (place.get_target() !== 65536) {
              target = place.get_target();
            }
            else {
              target = Planets.getPlanetIDFromName(place.get_name());
            }
          }
          catch ($e1) {
          }
        }
        if (target !== 65536) {
          this._trackingObject = place;
          if (target === this._solarSystemTrack && !(place.get_classification() === 1 || place.get_classification() === 1048576)) {
            this.gotoTarget3(place.get_camParams(), noZoom, instant);
            return;
          }
          var jumpTime = 4;
          if (target === 20) {
            jumpTime = 17;
          }
          else {
            jumpTime += 13 * (101 - Settings.get_active().get_solarSystemScale()) / 100;
          }
          if (instant) {
            jumpTime = 1;
          }
          var camTo = this.renderContext.viewCamera.copy();
          camTo.targetReferenceFrame = '';
          camTo.target = target;
          var zoom = 10;
          if (target === 20) {
            if (place.get_classification() === 1048576) {
              zoom = 1404946007758;
            }
            else {
              zoom = 63239.6717 * 100;
            }
            var vect = Coordinates.raDecTo3dAu(place.get_RA(), place.get_dec(), place.get_distance());
            var ecliptic = Coordinates.meanObliquityOfEcliptic(SpaceTimeController.get_jNow()) / 180 * Math.PI;
            vect.rotateX(ecliptic);
            camTo.viewTarget = Vector3d.negate(camTo.viewTarget);
          }
          else {
            camTo.viewTarget = Planets.getPlanet3dLocationJD(target, SpaceTimeController.getJNowForFutureTime(jumpTime));
            switch (target) {
              case 0:
                zoom = 0.6;
                break;
              case 1:
                zoom = 0.0004;
                break;
              case 2:
                zoom = 0.0004;
                break;
              case 3:
                zoom = 0.0004;
                break;
              case 4:
                zoom = 0.007;
                break;
              case 5:
                zoom = 0.007;
                break;
              case 6:
                zoom = 0.004;
                break;
              case 7:
                zoom = 0.004;
                break;
              case 8:
                zoom = 0.0004;
                break;
              case 9:
                zoom = 0.0004;
                break;
              case 10:
                zoom = 0.0004;
                break;
              case 11:
                zoom = 0.0004;
                break;
              case 12:
                zoom = 0.0004;
                break;
              case 13:
                zoom = 0.0004;
                break;
              case 19:
                zoom = 0.0004;
                break;
              case 20:
                zoom = 10;
                break;
              default:
                break;
            }
            zoom = zoom * Settings.get_active().get_solarSystemScale();
          }
          var fromParams = this.renderContext.viewCamera.copy();
          if (this._solarSystemTrack === 20 && !ss.emptyString(this.renderContext.get_trackingFrame())) {
            fromParams = this.renderContext.customTrackingParams;
            this.renderContext.set_trackingFrame('');
          }
          camTo.zoom = zoom;
          var toVector = camTo.viewTarget;
          toVector.subtract(fromParams.viewTarget);
          if (place.get_classification() === 1) {
            toVector = Vector3d.negate(toVector);
          }
          if (!!toVector.length()) {
            var raDec = toVector.toRaDec();
            if (target === 20) {
              camTo.lat = -raDec.y;
            }
            else {
              camTo.lat = raDec.y;
            }
            camTo.lng = raDec.x * 15 - 90;
          }
          else {
            camTo.lat = this.renderContext.viewCamera.lat;
            camTo.lng = this.renderContext.viewCamera.lng;
          }
          if (target !== 20) {
            camTo.viewTarget = Planets.getPlanetTargetPoint(target, camTo.lat, camTo.lng, SpaceTimeController.getJNowForFutureTime(jumpTime));
          }
          var solarMover = new ViewMoverKenBurnsStyle(fromParams, camTo, jumpTime, SpaceTimeController.get_now(), SpaceTimeController.getTimeForFutureTime(jumpTime), 3);
          solarMover.fastDirectionMove = true;
          this.set__mover(solarMover);
          return;
        }
      }
    }
    this._tracking = false;
    this._trackingObject = null;
    var camParams = place.get_camParams().copy();
    if (this.renderContext.get_backgroundImageset() != null && place.get_type() !== this.renderContext.get_backgroundImageset().get_dataSetType()) {
      this.renderContext.targetCamera = place.get_camParams().copy();
      this.renderContext.viewCamera = this.renderContext.targetCamera.copy();
      this.renderContext.set_backgroundImageset(this.getDefaultImageset(place.get_type(), 3));
      instant = true;
    } else if (this.get_solarSystemMode() && place.get_target() !== this._solarSystemTrack) {
      this.renderContext.targetCamera = place.get_camParams().copy();
      this.renderContext.viewCamera = this.renderContext.targetCamera.copy();
      this._solarSystemTrack = place.get_target();
      instant = true;
    }
    if (place.get_classification() === 128) {
      camParams.zoom = this.get_zoomMax();
      this.gotoTargetFull(false, instant, camParams, null, null);
    } else {
      this._solarSystemTrack = place.get_target();
      this.gotoTargetFull(noZoom, instant, camParams, place.get_studyImageset(), place.get_backgroundImageset());
      if (trackObject) {
        this._tracking = true;
        this._trackingObject = place;
      }
    }
  },

  gotoTarget3: function (camParams, noZoom, instant) {
    this._tracking = false;
    this._trackingObject = null;
    this.gotoTargetFull(noZoom, instant, camParams, this.renderContext.get_foregroundImageset(), this.renderContext.get_backgroundImageset());
  },

  _tooCloseForSlewMove: function (cameraParams) {
    return Math.abs(this.renderContext.viewCamera.lat - cameraParams.lat) < 1E-12 && Math.abs(this.renderContext.viewCamera.lng - cameraParams.lng) < 1E-12 && Math.abs(this.renderContext.viewCamera.zoom - cameraParams.zoom) < 1E-12 && Math.abs(this.renderContext.viewCamera.rotation - cameraParams.rotation) < 1E-12;
  },

  gotoTargetFull: function (noZoom, instant, cameraParams, studyImageSet, backgroundImageSet) {
    this._tracking = false;
    this._trackingObject = null;
    this._targetStudyImageset = studyImageSet;
    this._targetBackgroundImageset = backgroundImageSet;
    if (noZoom) {
      cameraParams.zoom = this.renderContext.viewCamera.zoom;
      cameraParams.angle = this.renderContext.viewCamera.angle;
      cameraParams.rotation = this.renderContext.viewCamera.rotation;
    } else {
      if (cameraParams.zoom === -1 || !cameraParams.zoom) {
        if (this.renderContext.space) {
          cameraParams.zoom = 1.40625;
        }
        else {
          cameraParams.zoom = 0.09;
        }
      }
    }
    if (instant || this._tooCloseForSlewMove(cameraParams)) {
      this.set__mover(null);
      this.renderContext.targetCamera = cameraParams.copy();
      this.renderContext.viewCamera = this.renderContext.targetCamera.copy();
      if (this.renderContext.space && Settings.get_active().get_galacticMode()) {
        var gPoint = Coordinates.j2000toGalactic(this.renderContext.viewCamera.get_RA() * 15, this.renderContext.viewCamera.get_dec());
        this.renderContext.targetAlt = this.renderContext.alt = gPoint[1];
        this.renderContext.targetAz = this.renderContext.az = gPoint[0];
      }
      else if (this.renderContext.space && Settings.get_active().get_localHorizonMode()) {
        var currentAltAz = Coordinates.equitorialToHorizon(Coordinates.fromRaDec(this.renderContext.viewCamera.get_RA(), this.renderContext.viewCamera.get_dec()), SpaceTimeController.get_location(), SpaceTimeController.get_now());
        this.renderContext.targetAlt = this.renderContext.alt = currentAltAz.get_alt();
        this.renderContext.targetAz = this.renderContext.az = currentAltAz.get_az();
      }
      this._mover_Midpoint();
    } else {
      this.set__mover(ViewMoverSlew.create(this.renderContext.viewCamera, cameraParams));
      this.get__mover().set_midpoint(ss.bind('_mover_Midpoint', this));
    }
  },

  _slewTimeBetweenTargets: function (from, to) {
    var mover = ViewMoverSlew.create(from, to);
    return mover.get_moveTime();
  },

  timeToTargetFull: function (cameraParams, noZoom) {
    if (noZoom) {
      cameraParams.zoom = this.renderContext.viewCamera.zoom;
      cameraParams.angle = this.renderContext.viewCamera.angle;
      cameraParams.rotation = this.renderContext.viewCamera.rotation;
    }
    if (this._tooCloseForSlewMove(cameraParams)) {
      return 0;
    }
    return this._slewTimeBetweenTargets(globalRenderContext.viewCamera, cameraParams);
  },

  _freezeView: function () {
    this.renderContext.viewCamera = this.renderContext.targetCamera.copy();
    this.set__mover(null);
  },

  get__mover: function () {
    return this.renderContext.viewMover;
  },

  set__mover: function (value) {
    this.renderContext.viewMover = value;
    return value;
  },

  fadeInImageSet: function (newImageSet) {
    if (this.renderContext.get_backgroundImageset() != null && newImageSet.get_dataSetType() !== this.renderContext.get_backgroundImageset().get_dataSetType()) {
      TileCache.purgeQueue();
      TileCache.clearCache();
    }
    this.renderContext.set_backgroundImageset(newImageSet);
  },

  _mover_Midpoint: function () {
    if ((this._targetStudyImageset != null && this.renderContext.get_foregroundImageset() == null) || (this.renderContext.get_foregroundImageset() != null && !this.renderContext.get_foregroundImageset().equals(this._targetStudyImageset))) {
      this.renderContext.set_foregroundImageset(this._targetStudyImageset);
    }
    if (this.renderContext.get_backgroundImageset() != null && (this._targetBackgroundImageset != null && !this.renderContext.get_backgroundImageset().equals(this._targetBackgroundImageset))) {
      if (this._targetBackgroundImageset != null && this._targetBackgroundImageset.get_generic()) {
        this.fadeInImageSet(this._getRealImagesetFromGeneric(this._targetBackgroundImageset));
      }
      else {
        this.fadeInImageSet(this._targetBackgroundImageset);
      }
    }
  },

  getDefaultImageset: function (imageSetType, bandPass) {
    var $enum1 = ss.enumerate(WWTControl.imageSets);
    while ($enum1.moveNext()) {
      var imageset = $enum1.current;
      if (imageset.get_defaultSet() && imageset.get_bandPass() === bandPass && imageset.get_dataSetType() === imageSetType) {
        return imageset;
      }
    }
    var $enum2 = ss.enumerate(WWTControl.imageSets);
    while ($enum2.moveNext()) {
      var imageset = $enum2.current;
      if (imageset.get_bandPass() === bandPass && imageset.get_dataSetType() === imageSetType) {
        return imageset;
      }
    }
    var $enum3 = ss.enumerate(WWTControl.imageSets);
    while ($enum3.moveNext()) {
      var imageset = $enum3.current;
      if (imageset.get_dataSetType() === imageSetType) {
        return imageset;
      }
    }
    return WWTControl.imageSets[0];
  },

  _getRealImagesetFromGeneric: function (generic) {
    var $enum1 = ss.enumerate(WWTControl.imageSets);
    while ($enum1.moveNext()) {
      var imageset = $enum1.current;
      if (imageset.get_defaultSet() && imageset.get_bandPass() === generic.get_bandPass() && imageset.get_dataSetType() === generic.get_dataSetType()) {
        return imageset;
      }
    }
    var $enum2 = ss.enumerate(WWTControl.imageSets);
    while ($enum2.moveNext()) {
      var imageset = $enum2.current;
      if (imageset.get_bandPass() === generic.get_bandPass() && imageset.get_dataSetType() === generic.get_dataSetType()) {
        return imageset;
      }
    }
    return WWTControl.imageSets[0];
  },

  _hideUI: function (p) { },

  createTour: function (name) {
    if (ss.canCast(this.uiController, TourPlayer)) {
      var player = this.uiController;
      player.stop(false);
    }
    this.tour = new TourDocument();
    this.tour.set_title(name);
    this.setupTour();
    this.tour.set_editMode(true);
    return this.tour;
  },

  setupTour: function () {
    this.tourEdit = new TourEditTab();
    this.tourEdit.set_tour(this.tour);
    this.tour.set_currentTourstopIndex(0);
    this.tour.set_editMode(false);
    this.uiController = this.tourEdit.tourEditorUI;
  },

  loadTour: function (url) {
    var $this = this;

    if (ss.canCast(this.uiController, TourPlayer)) {
      var player = this.uiController;
      player.stop(false);
    }
    this.tour = TourDocument.fromUrl(url, function () {
      $this.setupTour();
      var player = new TourPlayer();
      player.set_tour($this.tour);
      globalWWTControl.uiController = player;
      globalScriptInterface._fireTourReady();
    });
  },

  playTour: function (url) {
    var $this = this;

    if (ss.canCast(this.uiController, TourPlayer)) {
      var player = this.uiController;
      player.stop(false);
    }
    this.tour = TourDocument.fromUrl(url, function () {
      $this.setupTour();
      $this.tourEdit.playNow(true);
      globalScriptInterface._fireTourReady();
    });
  },

  playCurrentTour: function () {
    if (ss.canCast(this.uiController, TourPlayer)) {
      var player = this.uiController;
      player.play();
    }
  },

  pauseCurrentTour: function () {
    if (ss.canCast(this.uiController, TourPlayer)) {
      var player = this.uiController;
      player.pauseTour();
    }
  },

  stopCurrentTour: function () {
    if (ss.canCast(this.uiController, TourPlayer)) {
      var player = this.uiController;
      player.stop(false);
    }
  },

  _closeTour: function () { },

  getImagesetByName: function (name) {
    var $enum1 = ss.enumerate(WWTControl.imageSets);
    while ($enum1.moveNext()) {
      var imageset = $enum1.current;
      if (imageset.get_name().toLowerCase().indexOf(name.toLowerCase()) > -1) {
        return imageset;
      }
    }
    return null;
  },

  getImageSetByUrl: function (url) {
    var $enum1 = ss.enumerate(WWTControl.imageSets);
    while ($enum1.moveNext()) {
      var imageset = $enum1.current;
      if (imageset.get_url() === url) {
        return imageset;
      }
    }
    return null;
  },

  setBackgroundImageByName: function (name) {
    var newBackground = this.getImagesetByName(name);
    if (newBackground != null) {
      this.renderContext.set_backgroundImageset(newBackground);
    }
  },

  setForegroundImageByName: function (name) {
    var newForeground = this.getImagesetByName(name);
    if (newForeground != null) {
      this.renderContext.set_foregroundImageset(newForeground);
    }
  },

  addCatalogHips: function (catalogHips) {
    this.renderContext.addCatalogHips(catalogHips, null);
  },

  addCatalogHipsByName: function (name) {
    this.addCatalogHipsByNameWithCallback(name, null);
  },

  addCatalogHipsByNameWithCallback: function (name, onLoad) {
    var catalogHips = this.getImagesetByName(name);
    if (catalogHips != null) {
      this.renderContext.addCatalogHips(catalogHips, onLoad);
    }
  },

  removeCatalogHipsByName: function (name) {
    var catalogHips = this.getImagesetByName(name);
    if (catalogHips != null) {
      this.renderContext.removeCatalogHips(catalogHips);
    }
  },

  getCatalogHipsByName: function (name) {
    return this.renderContext.getCatalogHipsByName(name);
  },

  getCatalogHipsDataInView: function (name, limit, onComplete) {
    var catalogHips = this.getImagesetByName(name);
    if (catalogHips != null) {
      this.renderContext.getCatalogHipsDataInView(catalogHips, limit, onComplete);
    }
  },

  setCutsForFits: function (imagesetName, min, max) {
    var imageset = this.getImagesetByName(imagesetName);
    if (imageset != null && imageset.get_fitsProperties() != null) {
      imageset.get_fitsProperties().lowerCut = min;
      imageset.get_fitsProperties().upperCut = max;
    } else {
      console.log(imagesetName + ' not found');
    }
  },

  setColorMapForFits: function (imagesetName, colorMapName) {
    var imageset = this.getImagesetByName(imagesetName);
    if (imageset != null && imageset.get_fitsProperties() != null) {
      imageset.get_fitsProperties().colorMapName = colorMapName;
    } else {
      console.log(imagesetName + ' not found');
    }
  },

  setScaleTypeForFits: function (imagesetName, scaleType) {
    var imageset = this.getImagesetByName(imagesetName);
    if (imageset != null && imageset.get_fitsProperties() != null) {
      imageset.get_fitsProperties().scaleType = scaleType;
    } else {
      console.log(imagesetName + ' not found');
    }
  },

  _drawCrosshairs: function (context) {
    if (context.gl == null) {
      var ctx = context.device;
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = Settings.get_current().get_crosshairsColor();
      ctx.lineWidth = 2;
      var x = context.width / 2, y = context.height / 2;
      var halfLength = 5;
      ctx.moveTo(x, y + halfLength);
      ctx.lineTo(x, y - halfLength);
      ctx.moveTo(x + halfLength, y);
      ctx.lineTo(x - halfLength, y);
      ctx.stroke();
      ctx.restore();
    } else {
      if (this._crossHairs == null) {
        var halfHeight = 0.03;
        var halfWidth = halfHeight * context.height / context.width;
        this._crossHairs = new SimpleLineList();
        this._crossHairs.set_depthBuffered(false);
        this._crossHairs.pure2D = true;
        this._crossHairs.addLine(Vector3d.create(-halfWidth, 0, 0), Vector3d.create(halfWidth, 0, 0));
        this._crossHairs.addLine(Vector3d.create(0, -halfHeight, 0), Vector3d.create(0, halfHeight, 0));
      }
      this._crossHairs.drawLines(context, 1, Color.load(Settings.get_current().get_crosshairsColor()));
    }
  },

  captureThumbnail: function (blobReady) {
    this.captureFrame(blobReady, 96, 45, 'image/jpeg', true);
  },

  captureCurrentFrame: function (blobReady, width, height, format) {
    this.captureFrame(blobReady, width, height, format, false);
  },

  captureFrameForVideo: function (blobReady, width, height, format) {
    var $this = this;

    var frameNumber = SpaceTimeController.currentFrameNumber;
    var forVideo = function (blob) {
      var containsIndex;
      if (frameNumber === $this._videoQueueIndex) {
        blobReady(blob);
        $this._videoQueueIndex += 1;
        while ((containsIndex = ss.keyExists($this._videoBlobQueue, $this._videoQueueIndex)) || ($this._emptyFrames.indexOf($this._videoQueueIndex) >= 0)) {
          if (containsIndex) {
            blobReady($this._videoBlobQueue[$this._videoQueueIndex]);
            $this._videoBlobQueue[$this._videoQueueIndex] = null;
          }
          else {
            ss.remove($this._emptyFrames, $this._videoQueueIndex);
          }
          $this._videoQueueIndex += 1;
        }
      }
      else {
        if (blob != null) {
          $this._videoBlobQueue[frameNumber] = blob;
        }
        else {
          $this._emptyFrames.push(frameNumber);
        }
      }
      if ($this._videoQueueIndex >= SpaceTimeController.totalFrames) {
        $this._videoBlobReady = null;
        $this._videoBlobQueue = null;
        $this._videoQueueIndex = 0;
        $this._emptyFrames.length = 0;
      }
    };
    this.captureCurrentFrame(forVideo, width, height, format);
  },

  captureFrame: function (blobReady, width, height, format, needRender) {
    if (needRender) {
      this.renderOneFrame();
    }
    var image = document.createElement('img');
    image.addEventListener('load', function (e) {
      var imageAspect = (image.width) / image.height;
      var clientAspect = width / height;
      var cw = width;
      var ch = height;
      if (imageAspect < clientAspect) {
        ch = ss.truncate((cw / imageAspect));
      }
      else {
        cw = ss.truncate((ch * imageAspect));
      }
      var cx = (width - cw) / 2;
      var cy = (height - ch) / 2;
      var temp = document.createElement('canvas');
      temp.height = height;
      temp.width = width;
      var ctx = temp.getContext('2d');
      ctx.drawImage(image, cx, cy, cw, ch);
      if (typeof temp.msToBlob == 'function') { var blob = temp.msToBlob(); blobReady(blob); } else { temp.toBlob(blobReady, format); }
    }, false);
    image.src = globalWWTControl.canvas.toDataURL();
  },

  clampZooms: function (rc) {
    rc.viewCamera.zoom = DoubleUtilities.clamp(rc.viewCamera.zoom, this.get_zoomMin(), this.get_zoomMax());
    rc.targetCamera.zoom = DoubleUtilities.clamp(rc.targetCamera.zoom, this.get_zoomMin(), this.get_zoomMax());
  }
};

registerType("WWTControl", [WWTControl, WWTControl$, null]);

// wwtlib.WWTControlBuilder

export function WWTControlBuilder(divId) {
  this._divId = null;
  this._startRenderLoop = false;
  this._startLat = 0;
  this._startLng = 0;
  this._startZoom = 360;
  this._freestandingAssetBaseurl = '';
  this._startMode = '';
  this._divId = divId;
}

var WWTControlBuilder$ = {
  startRenderLoop: function (value) {
    this._startRenderLoop = value;
  },

  initialView: function (lat, lng, zoom) {
    this._startLat = lat;
    this._startLng = lng;
    this._startZoom = zoom;
  },

  freestandingMode: function (asset_baseurl) {
    this._freestandingAssetBaseurl = asset_baseurl;
  },

  initialMode: function (value) {
    this._startMode = value;
  },

  create: function () {
    var freestandingMode = !!this._freestandingAssetBaseurl;
    var trueStartMode;
    if (!!this._startMode) {
      trueStartMode = this._startMode;
    } else if (freestandingMode) {
      trueStartMode = 'black';
    } else {
      trueStartMode = 'sky';
    }
    set_freestandingMode(freestandingMode);
    if (freestandingMode) {
      URLHelpers.singleton.overrideAssetBaseurl(this._freestandingAssetBaseurl);
    }
    return WWTControl.initControl6(this._divId, this._startRenderLoop, this._startLat, this._startLng, this._startZoom, trueStartMode);
  }
};

registerType("WWTControlBuilder", [WWTControlBuilder, WWTControlBuilder$, null]);

// wwtlib.WWTElementEvent

export function WWTElementEvent(x, y) {
  this.offsetX = 0;
  this.offsetY = 0;
  this.offsetX = x;
  this.offsetY = y;
}

var WWTElementEvent$ = {};

registerType("WWTElementEvent", [WWTElementEvent, WWTElementEvent$, null]);

// wwtlib.FrameWizard

export function FrameWizard() {
  Dialog.call(this);
}

var FrameWizard$ = {
  OK: function (frame) {
    LayerManager.referenceFrameWizardFinished(frame);
  }
};

registerType("FrameWizard", [FrameWizard, FrameWizard$, Dialog]);

// wwtlib.ReferenceFrameProps

export function ReferenceFrameProps() {
  Dialog.call(this);
}

var ReferenceFrameProps$ = {
  OK: function (frame) {
    LayerManager.loadTree();
  }
};

registerType("ReferenceFrameProps", [ReferenceFrameProps, ReferenceFrameProps$, Dialog]);

// wwtlib.GreatCircleDialog

export function GreatCircleDialog() {
  Dialog.call(this);
}

var GreatCircleDialog$ = {
  OK: function (frame) { }
};

registerType("GreatCircleDialog", [GreatCircleDialog, GreatCircleDialog$, Dialog]);

// wwtlib.DataVizWizard

export function DataVizWizard() {
  Dialog.call(this);
}

var DataVizWizard$ = {
  OK: function () { }
};

registerType("DataVizWizard", [DataVizWizard, DataVizWizard$, Dialog]);

// wwtlib.SlideChangedEventArgs

export function SlideChangedEventArgs(caption) {
  ss.EventArgs.call(this);
  this.set_caption(caption);
}

var SlideChangedEventArgs$ = {
  get_caption: function () {
    return this._caption$2;
  },

  set_caption: function (value) {
    this._caption$2 = value;
    return value;
  }
};

registerType("SlideChangedEventArgs", [SlideChangedEventArgs, SlideChangedEventArgs$, ss.EventArgs]);

// wwtlib.ArrivedEventArgs

export function ArrivedEventArgs(ra, dec, zoom) {
  this._ra$2 = 0;
  this._dec$2 = 0;
  this._zoom$2 = 0;
  ss.EventArgs.call(this);
  this.set_RA(ra * 15);
  this.set_dec(dec);
  this.set_zoom(zoom / 6);
}

var ArrivedEventArgs$ = {
  get_RA: function () {
    return this._ra$2;
  },

  set_RA: function (value) {
    this._ra$2 = value;
    return value;
  },

  get_dec: function () {
    return this._dec$2;
  },

  set_dec: function (value) {
    this._dec$2 = value;
    return value;
  },

  get_zoom: function () {
    return this._zoom$2;
  },

  set_zoom: function (value) {
    this._zoom$2 = value;
    return value;
  }
};

registerType("ArrivedEventArgs", [ArrivedEventArgs, ArrivedEventArgs$, ss.EventArgs]);

// wwtlib.AnnotationClickEventArgs

export function AnnotationClickEventArgs(ra, dec, id) {
  this._ra$2 = 0;
  this._dec$2 = 0;
  ss.EventArgs.call(this);
  this.set_RA(ra * 15);
  this.set_dec(dec);
  this.set_id(id);
}

var AnnotationClickEventArgs$ = {
  get_RA: function () {
    return this._ra$2;
  },

  set_RA: function (value) {
    this._ra$2 = value;
    return value;
  },

  get_dec: function () {
    return this._dec$2;
  },

  set_dec: function (value) {
    this._dec$2 = value;
    return value;
  },

  get_id: function () {
    return this._id$2;
  },

  set_id: function (value) {
    this._id$2 = value;
    return value;
  }
};

registerType("AnnotationClickEventArgs", [AnnotationClickEventArgs, AnnotationClickEventArgs$, ss.EventArgs]);

// wwtlib.CollectionLoadedEventArgs

export function CollectionLoadedEventArgs(url) {
  ss.EventArgs.call(this);
  this._url$2 = url;
}

var CollectionLoadedEventArgs$ = {
  get_url: function () {
    return this._url$2;
  },

  set_url: function (value) {
    this._url$2 = value;
    return value;
  }
};

registerType("CollectionLoadedEventArgs", [CollectionLoadedEventArgs, CollectionLoadedEventArgs$, ss.EventArgs]);

// Statics with nontrivial initialization:

LayerManager._frameWizardDialog = new FrameWizard();
LayerManager._dataVizWizardDialog = new DataVizWizard();
LayerManager._referenceFramePropsDialog = new ReferenceFrameProps();
LayerManager._greatCircleDialog = new GreatCircleDialog();

WWTControl.exploreRoot = new Folder();
WWTControl.singleton = new WWTControl();
WWTControl.singleton.renderContext = new RenderContext();
set_globalWWTControl(WWTControl.singleton);
set_globalRenderContext(WWTControl.singleton.renderContext);

SpaceTimeController._metaNow = ss.now();
SpaceTimeController._now = ss.now();
SpaceTimeController.last = SpaceTimeController.get_metaNow();
SpaceTimeController.updateClock();

KeplerVertex.baseDate = ss.truncate(SpaceTimeController.utcToJulian(ss.now()));
