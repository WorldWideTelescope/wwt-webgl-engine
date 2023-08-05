import { ss } from "./ss.js";
import { registerType, registerEnum, Enums } from "./typesystem.js";

import {
  Util,
  Rectangle,
  Guid,
  Mouse,
  Language,
  Cursor,
  Cursors,
  SelectLink,
  PopupVolume,
  OverlayProperties,
} from "./util.js";

import { ELL } from "./astrocalc/elliptical.js";

import {
  globalRenderContext,
  tileCacheGetTile,
  tilePrepDevice,
  useGlVersion2,
  set_globalRenderContext,
  set_tileDemEnabled,
  set_tilePrepDevice,
  set_tileUvMultiple,
  set_useGl,
  set_useGlVersion2,
} from "./render_globals.js";

import {
  freestandingMode,
  globalScriptInterface,
  globalWWTControl,
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

import {
  PositionTextureVertexBuffer,
} from "./graphics/gl_buffers.js"

import { Texture } from "./graphics/texture.js";
import { Tessellator } from "./graphics/tessellator.js";

import {
  TileShader,
} from "./graphics/shaders.js";

import {
  Dates,
  SimpleLineList,
  OrbitLineList,
  LineList,
  TriangleList,
  PointList,
  TimeSeriesPointVertex,
} from "./graphics/primitives3d.js";

import { Sprite2d } from "./graphics/sprite2d.js";

import {
  ContextMenuStrip,
  ToolStripMenuItem,
  ToolStripSeparator,
} from "./utilities/context_menu_strip.js";

import { SimpleInput } from "./utilities/simple_input.js";
import { XmlTextWriter } from "./utilities/xml_text_writer.js";

import { Coordinates } from "./coordinates.js";
import {
  IThumbnail,
  IUiController,
  IViewMover,
  ISettings,
  IUndoStep,
} from "./interfaces.js";

import { Annotation, Circle, Poly, PolyLine } from "./annotation.js";
import { BasePlanets } from "./baseplanets.js";
import { CameraParameters } from "./camera_parameters.js";
import { ConstellationFilter } from "./constellation_filter.js";
import { WebFile } from "./web_file.js";
import { UiTools } from "./ui_tools.js";

import { ColorMapContainer } from "./layers/color_map_container.js";
import { FitsImage } from "./layers/fits_image.js";
import { FitsImageJs } from "./layers/fits_image_js.js";

import { RenderTriangle } from "./render_triangle.js";
import { Triangle } from "./triangle.js";
import { Tile } from "./tile.js";
import { ProjectionType, ImageSetType, Imageset } from "./imageset.js";
import { Settings, SettingParameter } from "./settings.js";
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
import { Histogram } from "./utilities/histogram.js";

import { Layer } from "./layers/layer.js";
import { GreatCirlceRouteLayer } from "./layers/great_circle_route_layer.js";
import { GridLayer } from "./layers/grid_layer.js";
import { ImageSetLayer } from "./layers/imageset_layer.js";
import { ReferenceFrame } from "./layers/reference_frame.js";
import { Object3dLayer, Object3d } from "./layers/object3d.js";
import { Orbit, EllipseRenderer } from "./layers/orbit.js";
import { OrbitLayer } from "./layers/orbit_layer.js";
import { Table } from "./layers/table.js";
import { VoTable } from "./layers/vo_table.js";

import { FileCabinet } from "./tours/file_cabinet.js";
import {
  Overlay,
  AudioOverlay,
  BitmapOverlay,
  FlipbookOverlay,
  ShapeOverlay,
  TextOverlay,
} from "./tours/overlay.js";
import { Selection } from "./tours/selection.js";


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


// wwtlib.ReferenceFrames

export var ReferenceFrames = {
  sky: 0,
  ecliptic: 1,
  galactic: 2,
  sun: 3,
  mercury: 4,
  venus: 5,
  earth: 6,
  mars: 7,
  jupiter: 8,
  saturn: 9,
  uranus: 10,
  neptune: 11,
  pluto: 12,
  moon: 13,
  io: 14,
  europa: 15,
  ganymede: 16,
  callisto: 17,
  custom: 18,
  identity: 19,
  sandbox: 20
};

registerType("ReferenceFrames", ReferenceFrames);
registerEnum("ReferenceFrames", ReferenceFrames);

// wwtlib.CoordinatesTypes

export var CoordinatesTypes = {
  spherical: 0,
  rectangular: 1,
  orbital: 2
};

registerType("CoordinatesTypes", CoordinatesTypes);
registerEnum("CoordinatesTypes", CoordinatesTypes);

// wwtlib.AltTypes

export var AltTypes = {
  depth: 0,
  altitude: 1,
  distance: 2,
  seaLevel: 3,
  terrain: 4
};

registerType("AltTypes", AltTypes);
registerEnum("AltTypes", AltTypes);

// wwtlib.MarkerMixes

export var MarkerMixes = {
  same_For_All: 0
};

registerType("MarkerMixes", MarkerMixes);
registerEnum("MarkerMixes", MarkerMixes);

// wwtlib.ColorMaps

export var ColorMaps = {
  same_For_All: 0,
  group_by_Values: 2,
  per_Column_Literal: 3
};

registerType("ColorMaps", ColorMaps);
registerEnum("ColorMaps", ColorMaps);

// wwtlib.PlotTypes

export var PlotTypes = {
  gaussian: 0,
  point: 1,
  circle: 2,
  square: 3,
  pushPin: 4,
  custom: 5
};

registerType("PlotTypes", PlotTypes);
registerEnum("PlotTypes", PlotTypes);

// wwtlib.MarkerScales

export var MarkerScales = {
  screen: 0,
  world: 1
};

registerType("MarkerScales", MarkerScales);
registerEnum("MarkerScales", MarkerScales);

// wwtlib.RAUnits

export var RAUnits = {
  hours: 0,
  degrees: 1
};

registerType("RAUnits", RAUnits);
registerEnum("RAUnits", RAUnits);

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

// wwtlib.UserLevel

export var UserLevel = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
  educator: 3,
  professional: 4
};

registerType("UserLevel", UserLevel);
registerEnum("UserLevel", UserLevel);

// wwtlib.TransitionType

export var TransitionType = {
  slew: 0,
  crossFade: 1,
  crossCut: 2,
  fadeOutIn: 3,
  fadeIn: 4,
  fadeOut: 5
};

registerType("TransitionType", TransitionType);
registerEnum("TransitionType", TransitionType);

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

// wwtlib.ViewMoverKenBurnsStyle
//
// This was defined in `IViewMover.cs`, which we've folded into `interfaces.js`.

export function ViewMoverKenBurnsStyle(from, to, time, fromDateTime, toDateTime, type) {
  this.interpolationType = 0;
  this.fastDirectionMove = false;
  this._toTargetTime = 0;
  this._dateTimeSpan = 0;
  this._complete = false;
  this._midpointFired = false;
  this.interpolationType = type;
  if (Math.abs(from.lng - to.lng) > 180) {
    if (from.lng > to.lng) {
      from.lng -= 360;
    } else {
      from.lng += 360;
    }
  }
  this._fromDateTime = fromDateTime;
  this._toDateTime = toDateTime;
  this._dateTimeSpan = toDateTime - fromDateTime;
  this._from = from.copy();
  this._to = to.copy();
  this._fromTime = SpaceTimeController.get_metaNow();
  this._toTargetTime = time;
}

var ViewMoverKenBurnsStyle$ = {
  get_complete: function () {
    return this._complete;
  },

  get_currentPosition: function () {
    var elapsed = SpaceTimeController.get_metaNow() - this._fromTime;
    var elapsedSeconds = (elapsed) / 1000;
    var alpha = elapsedSeconds / this._toTargetTime;
    if (!this._midpointFired && alpha >= 0.5) {
      this._midpointFired = true;
      if (this._midpoint != null) {
        this._midpoint();
      }
    }
    if (alpha >= 1) {
      alpha = 1;
      this._complete = true;
      return this._to.copy();
    }
    if (Settings.get_active().get_galacticMode() && globalRenderContext.space) {
      return CameraParameters.interpolateGreatCircle(this._from, this._to, alpha, this.interpolationType, this.fastDirectionMove);
    }
    return CameraParameters.interpolate(this._from, this._to, alpha, this.interpolationType, this.fastDirectionMove);
  },

  get_currentDateTime: function () {
    var elapsed = SpaceTimeController.get_metaNow() - this._fromTime;
    var elapsedSeconds = (elapsed) / 1000;
    var alpha = elapsedSeconds / this._toTargetTime;
    var delta = this._dateTimeSpan * alpha;
    var retDate = new Date(this._fromDateTime.getTime() + ss.truncate(delta));
    return retDate;
  },

  get_midpoint: function () {
    return this._midpoint;
  },

  set_midpoint: function (value) {
    this._midpoint = value;
    return value;
  },

  get_moveTime: function () {
    return this._toTargetTime;
  }
};

registerType("ViewMoverKenBurnsStyle", [ViewMoverKenBurnsStyle, ViewMoverKenBurnsStyle$, null, IViewMover]);

// wwtlib.ViewMoverSlew
//
// This was defined in `IViewMover.cs`, which we've folded into `interfaces.js`.

export function ViewMoverSlew() {
  this._upTargetTime = 0;
  this._downTargetTime = 0;
  this._toTargetTime = 0;
  this._upTimeFactor = 0.6;
  this._downTimeFactor = 0.6;
  this._travelTimeFactor = 7;
  this._midpointFired = false;
  this._complete = false;
}

ViewMoverSlew.create = function (from, to) {
  var temp = new ViewMoverSlew();
  temp.init(from, to);
  return temp;
};

ViewMoverSlew.createUpDown = function (from, to, upDowFactor) {
  var temp = new ViewMoverSlew();
  temp._upTimeFactor = temp._downTimeFactor = upDowFactor;
  temp.init(from.copy(), to.copy());
  return temp;
};

var ViewMoverSlew$ = {
  init: function (from, to) {
    if (Math.abs(from.lng - to.lng) > 180) {
      if (from.lng > to.lng) {
        from.lng -= 360;
      }
      else {
        from.lng += 360;
      }
    }
    if (to.zoom <= 0) {
      to.zoom = 360;
    }
    if (from.zoom <= 0) {
      from.zoom = 360;
    }
    this._from = from;
    this._to = to;
    this._fromTime = SpaceTimeController.get_metaNow();
    var zoomUpTarget = 360;
    var travelTime;
    var lngDist = Math.abs(from.lng - to.lng);
    var latDist = Math.abs(from.lat - to.lat);
    var distance = Math.sqrt(latDist * latDist + lngDist * lngDist);
    zoomUpTarget = (distance / 3) * 20;
    if (zoomUpTarget > 360) {
      zoomUpTarget = 360;
    }
    if (zoomUpTarget < from.zoom) {
      zoomUpTarget = from.zoom;
    }
    travelTime = (distance / 180) * (360 / zoomUpTarget) * this._travelTimeFactor;
    var rotateTime = Math.max(Math.abs(from.angle - to.angle), Math.abs(from.rotation - to.rotation));
    var logDistUp = Math.max(Math.abs(Util.logN(zoomUpTarget, 2) - Util.logN(from.zoom, 2)), rotateTime);
    this._upTargetTime = this._upTimeFactor * logDistUp;
    this._downTargetTime = this._upTargetTime + travelTime;
    var logDistDown = Math.abs(Util.logN(zoomUpTarget, 2) - Util.logN(to.zoom, 2));
    this._toTargetTime = this._downTargetTime + Math.max((this._downTimeFactor * logDistDown), rotateTime);
    this._fromTop = from.copy();
    this._fromTop.zoom = zoomUpTarget;
    this._fromTop.angle = (from.angle + to.angle) / 2;
    this._fromTop.rotation = (from.rotation + to.rotation) / 2;
    this._toTop = to.copy();
    this._toTop.zoom = this._fromTop.zoom;
    this._toTop.angle = this._fromTop.angle;
    this._toTop.rotation = this._fromTop.rotation;
  },

  get_complete: function () {
    return this._complete;
  },

  get_currentPosition: function () {
    var elapsed = SpaceTimeController.get_metaNow() - this._fromTime;
    var elapsedSeconds = (elapsed) / 1000;
    if (elapsedSeconds < this._upTargetTime) {
      return CameraParameters.interpolate(this._from, this._fromTop, elapsedSeconds / this._upTargetTime, 3, false);
    } else if (elapsedSeconds < this._downTargetTime) {
      elapsedSeconds -= this._upTargetTime;
      if (Settings.get_active().get_galacticMode() && globalRenderContext.space) {
        return CameraParameters.interpolateGreatCircle(this._fromTop, this._toTop, elapsedSeconds / (this._downTargetTime - this._upTargetTime), 3, false);
      }
      return CameraParameters.interpolate(this._fromTop, this._toTop, elapsedSeconds / (this._downTargetTime - this._upTargetTime), 3, false);
    } else {
      if (!this._midpointFired) {
        this._midpointFired = true;
        if (this._midpoint != null) {
          this._midpoint();
        }
      }
      elapsedSeconds -= this._downTargetTime;
      var alpha = elapsedSeconds / (this._toTargetTime - this._downTargetTime);
      if (alpha > 1) {
        alpha = 1;
        this._complete = true;
        return this._to.copy();
      }
      return CameraParameters.interpolate(this._toTop, this._to, alpha, 3, false);
    }
  },

  get_currentDateTime: function () {
    SpaceTimeController.updateClock();
    return SpaceTimeController.get_now();
  },

  get_midpoint: function () {
    return this._midpoint;
  },

  set_midpoint: function (value) {
    this._midpoint = value;
    return value;
  },

  get_moveTime: function () {
    return this._toTargetTime;
  }
};

registerType("ViewMoverSlew", [ViewMoverSlew, ViewMoverSlew$, null, IViewMover]);


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

// wwtlib.LayerManager

export function LayerManager() { }

LayerManager._version = 0;
LayerManager._tourLayers = false;
LayerManager._layerMaps = {};
LayerManager._layerMapsTours = {};
LayerManager._allMaps = {};
LayerManager._allMapsTours = {};
LayerManager._currentMap = 'Earth';
LayerManager._layerList = {};
LayerManager._layerListTours = {};
LayerManager._moonfile = '';
LayerManager._selectedLayer = null;
LayerManager._lastMenuClick = new Vector2d();

LayerManager.get_version = function () {
  return LayerManager._version;
};

LayerManager.set_version = function (value) {
  LayerManager._version = value;
  return value;
};

LayerManager.get_frameWizardDialog = function () {
  return LayerManager._frameWizardDialog;
};

LayerManager.get_dataVizWizardDialog = function () {
  return LayerManager._dataVizWizardDialog;
};

LayerManager.get_referenceFramePropsDialog = function () {
  return LayerManager._referenceFramePropsDialog;
};

LayerManager.get_greatCircleDlg = function () {
  return LayerManager._greatCircleDialog;
};

LayerManager.get_tourLayers = function () {
  return LayerManager._tourLayers;
};

LayerManager.set_tourLayers = function (value) {
  if (LayerManager._tourLayers !== value && !value) {
    LayerManager._clearLayers();
    LayerManager._tourLayers = value;
    LayerManager.loadTree();
  }
  else if (LayerManager._tourLayers !== value && !!value) {
    LayerManager._tourLayers = value;
    LayerManager.initLayers();
  }
  return value;
};

LayerManager.loadTree = function () {
  if (globalScriptInterface != null) {
    globalScriptInterface.refreshLayerManagerNow();
  }
};

LayerManager.get_layerMaps = function () {
  if (LayerManager.get_tourLayers()) {
    return LayerManager._layerMapsTours;
  }
  else {
    return LayerManager._layerMaps;
  }
};

LayerManager.set_layerMaps = function (value) {
  if (LayerManager.get_tourLayers()) {
    LayerManager._layerMapsTours = value;
  }
  else {
    LayerManager._layerMaps = value;
  }
  return value;
};

LayerManager.get_allMaps = function () {
  if (LayerManager.get_tourLayers()) {
    return LayerManager._allMapsTours;
  }
  else {
    return LayerManager._allMaps;
  }
};

LayerManager.set_allMaps = function (value) {
  if (LayerManager.get_tourLayers()) {
    LayerManager._allMapsTours = value;
  }
  else {
    LayerManager._allMaps = value;
  }
  return value;
};

LayerManager.get_currentMap = function () {
  return LayerManager._currentMap;
};

LayerManager.set_currentMap = function (value) {
  LayerManager._currentMap = value;
  return value;
};

LayerManager.get_layerList = function () {
  if (LayerManager.get_tourLayers()) {
    return LayerManager._layerListTours;
  }
  else {
    return LayerManager._layerList;
  }
};

LayerManager.set_layerList = function (value) {
  if (LayerManager.get_tourLayers()) {
    LayerManager._layerListTours = value;
  }
  else {
    LayerManager._layerList = value;
  }
  return value;
};

LayerManager.oneTimeInitialization = function () {
  if (LayerManager._webFileMoons == null) {
    LayerManager.getMoonFile(URLHelpers.singleton.engineAssetUrl('moons.txt'));
  }
  PushPin.triggerLoadSprite();
};

LayerManager.initLayers = function () {
  LayerManager._clearLayers();
  var iss = null;
  var doISS = !LayerManager.get_tourLayers() && !freestandingMode;
  if (doISS) {
    iss = new LayerMap('ISS', 18);
    iss.frame.epoch = SpaceTimeController._twoLineDateToJulian('10184.51609218');
    iss.frame.semiMajorAxis = 6728829.41;
    iss.frame.referenceFrameType = 1;
    iss.frame.inclination = 51.6442;
    iss.frame.longitudeOfAscendingNode = 147.0262;
    iss.frame.eccentricity = 0.0009909;
    iss.frame.meanAnomolyAtEpoch = 325.5563;
    iss.frame.meanDailyMotion = 360 * 15.72172655;
    iss.frame.argumentOfPeriapsis = 286.4623;
    iss.frame.scale = 1;
    iss.frame.semiMajorAxisUnits = 1;
    iss.frame.meanRadius = 130;
    iss.frame.oblateness = 0;
    iss.frame.showOrbitPath = true;
    var isstle = new Array(0);
    var url = URLHelpers.singleton.coreDynamicUrl('wwtweb/isstle.aspx');
    var webFile;
    webFile = new WebFile(url);
    webFile.onStateChange = function () {
      if (webFile.get_state() === 1) {
        var data = webFile.getText();
        isstle = data.split('\n');
        if (isstle.length > 1) {
          iss.frame.fromTLE(isstle[0], isstle[1], 398600441800000);
        }
      }
    };
    webFile.send();
    iss.enabled = true;
  }
  LayerManager.get_layerMaps()['Sun'] = new LayerMap('Sun', 3);
  LayerManager.get_layerMaps()['Sun'].addChild(new LayerMap('Mercury', 4));
  LayerManager.get_layerMaps()['Sun'].addChild(new LayerMap('Venus', 5));
  LayerManager.get_layerMaps()['Sun'].addChild(new LayerMap('Earth', 6));
  LayerManager.get_layerMaps()['Sun'].childMaps['Earth'].addChild(new LayerMap('Moon', 13));
  if (doISS) {
    LayerManager.get_layerMaps()['Sun'].childMaps['Earth'].addChild(iss);
  }
  LayerManager.get_layerMaps()['Sun'].addChild(new LayerMap('Mars', 7));
  LayerManager.get_layerMaps()['Sun'].addChild(new LayerMap('Jupiter', 8));
  LayerManager.get_layerMaps()['Sun'].childMaps['Jupiter'].addChild(new LayerMap('Io', 14));
  LayerManager.get_layerMaps()['Sun'].childMaps['Jupiter'].addChild(new LayerMap('Europa', 15));
  LayerManager.get_layerMaps()['Sun'].childMaps['Jupiter'].addChild(new LayerMap('Ganymede', 16));
  LayerManager.get_layerMaps()['Sun'].childMaps['Jupiter'].addChild(new LayerMap('Callisto', 17));
  LayerManager.get_layerMaps()['Sun'].addChild(new LayerMap('Saturn', 9));
  LayerManager.get_layerMaps()['Sun'].addChild(new LayerMap('Uranus', 10));
  LayerManager.get_layerMaps()['Sun'].addChild(new LayerMap('Neptune', 11));
  LayerManager.get_layerMaps()['Sun'].addChild(new LayerMap('Pluto', 12));
  LayerManager._addMoons(LayerManager._moonfile);
  LayerManager.get_layerMaps()['Sky'] = new LayerMap('Sky', 0);
  LayerManager.get_layerMaps()['Sun'].open = true;
  LayerManager._allMaps = {};
  LayerManager._addAllMaps(LayerManager.get_layerMaps(), null);
  if (doISS) {
    LayerManager._addIss();
  }
  LayerManager._version++;
  LayerManager.loadTree();
};

LayerManager._addIss = function () {
  var layer = new ISSLayer();
  layer.set_name(Language.getLocalizedText(1314, 'ISS Model  (Toshiyuki Takahei)'));
  layer.enabled = Settings.get_active().get_showISSModel();
  LayerManager.get_layerList()[layer.id] = layer;
  layer.set_referenceFrame('ISS');
  LayerManager.get_allMaps()['ISS'].layers.push(layer);
  LayerManager.get_allMaps()['ISS'].open = true;
};

LayerManager._addAllMaps = function (maps, parent) {
  var $enum1 = ss.enumerate(ss.keys(maps));
  while ($enum1.moveNext()) {
    var key = $enum1.current;
    var map = maps[key];
    map.frame.parent = parent;
    LayerManager.get_allMaps()[map.get_name()] = map;
    LayerManager._addAllMaps(map.childMaps, map.get_name());
  }
};

LayerManager._clearLayers = function () {
  var $enum1 = ss.enumerate(ss.keys(LayerManager.get_layerList()));
  while ($enum1.moveNext()) {
    var key = $enum1.current;
    var layer = LayerManager.get_layerList()[key];
    layer.cleanUp();
  }
  ss.clearKeys(LayerManager.get_layerList());
  ss.clearKeys(LayerManager.get_layerMaps());
};

LayerManager.getMoonFile = function (url) {
  LayerManager._webFileMoons = new WebFile(url);
  LayerManager._webFileMoons.onStateChange = LayerManager.moonFileStateChange;
  LayerManager._webFileMoons.send();
};

LayerManager.moonFileStateChange = function () {
  if (LayerManager._webFileMoons.get_state() === 2) {
    alert(LayerManager._webFileMoons.get_message());
  }
  else if (LayerManager._webFileMoons.get_state() === 1) {
    LayerManager._moonfile = LayerManager._webFileMoons.getText();
    LayerManager.initLayers();
  }
};

LayerManager._addMoons = function (file) {
  var data = file.split('\r\n');
  var first = true;
  var $enum1 = ss.enumerate(data);
  while ($enum1.moveNext()) {
    var line = $enum1.current;
    if (first) {
      first = false;
      continue;
    }
    var parts = line.split('\t');
    if (parts.length > 16) {
      var planet = parts[0];
      var frame = new LayerMap(parts[2], 18);
      frame.frame._systemGenerated = true;
      frame.frame.epoch = parseFloat(parts[1]);
      frame.frame.semiMajorAxis = parseFloat(parts[3]) * 1000;
      frame.frame.referenceFrameType = 1;
      frame.frame.inclination = parseFloat(parts[7]);
      frame.frame.longitudeOfAscendingNode = parseFloat(parts[8]);
      frame.frame.eccentricity = parseFloat(parts[4]);
      frame.frame.meanAnomolyAtEpoch = parseFloat(parts[6]);
      frame.frame.meanDailyMotion = parseFloat(parts[9]);
      frame.frame.argumentOfPeriapsis = parseFloat(parts[5]);
      frame.frame.scale = 1;
      frame.frame.semiMajorAxisUnits = 1;
      frame.frame.meanRadius = parseFloat(parts[16]) * 1000;
      frame.frame.rotationalPeriod = parseFloat(parts[17]);
      frame.frame.showAsPoint = false;
      frame.frame.showOrbitPath = true;
      frame.frame.set_representativeColor(Color.fromArgb(255, 175, 216, 230));
      frame.frame.oblateness = 0;
      LayerManager.get_layerMaps()['Sun'].childMaps[planet].addChild(frame);
    }
  }
};

LayerManager.addVoTableLayer = function (table, title) {
  return LayerManager.addVoTableLayerWithPlotType(table, title, 2);
};

LayerManager.addVoTableLayerWithPlotType = function (table, title, plotType) {
  var layer = VoTableLayer.create(table, plotType);
  layer.set_name(title);
  layer.set_astronomical(true);
  layer.set_referenceFrame('Sky');
  LayerManager.get_layerList()[layer.id] = layer;
  LayerManager.get_allMaps()['Sky'].layers.push(layer);
  LayerManager.get_allMaps()['Sky'].open = true;
  layer.enabled = true;
  LayerManager._version++;
  LayerManager.loadTree();
  return layer;
};

LayerManager.addImageSetLayer = function (imageset, title) {
  var layer = ImageSetLayer.create(imageset);
  return LayerManager.addFitsImageSetLayer(layer, title);
};

LayerManager.addImageSetLayerCallback = function (imageset, title, callback) {
  var layer = ImageSetLayer.create(imageset);
  var isNonHipsTiledFits = imageset.get_extension() === '.fits' && layer.getFitsImage() == null && imageset.get_projection() !== ProjectionType.healpix;
  if (isNonHipsTiledFits) {
    imageset.get_fitsProperties().onMainImageLoaded = function (image) {
      image.applyDisplaySettings();
      if (callback != null) {
        callback(layer);
      }
    };
  }
  LayerManager.addFitsImageSetLayer(layer, title);
  if (callback != null && (!isNonHipsTiledFits || imageset.get_fitsProperties().mainImageLoadedEventHasFired)) {
    callback(layer);
  }
  return layer;
};

LayerManager.addFitsImageSetLayer = function (layer, title) {
  layer.doneLoading(null);
  layer.set_name(title);
  layer.set_astronomical(true);
  layer.set_referenceFrame('Sky');
  LayerManager.get_layerList()[layer.id] = layer;
  LayerManager.get_allMaps()['Sky'].layers.push(layer);
  LayerManager.get_allMaps()['Sky'].open = true;
  layer.enabled = true;
  LayerManager._version++;
  LayerManager.loadTree();
  return layer;
};

LayerManager.getNextFitsName = function () {
  return LayerManager._getNextName('Fits Image');
};

LayerManager.getNextImageSetName = function () {
  return LayerManager._getNextName('Image Set');
};

LayerManager._getNextName = function (type) {
  var currentNumber = 0;
  var $enum1 = ss.enumerate(ss.keys(LayerManager.get_allMaps()));
  while ($enum1.moveNext()) {
    var key = $enum1.current;
    var $enum2 = ss.enumerate(LayerManager.get_allMaps()[key].layers);
    while ($enum2.moveNext()) {
      var layer = $enum2.current;
      if (ss.startsWith(layer.get_name(), type + ' ')) {
        var number = ss.replaceString(layer.get_name(), type + ' ', '');
        try {
          var num = parseInt(number);
          if (num > currentNumber) {
            currentNumber = num;
          }
        }
        catch ($e3) {
        }
      }
    }
  }
  return ss.format('{0} {1}', type, currentNumber + 1);
};

LayerManager._closeAllTourLoadedLayers = function () {
  var purgeTargets = [];
  var $enum1 = ss.enumerate(ss.keys(LayerManager.get_layerList()));
  while ($enum1.moveNext()) {
    var key = $enum1.current;
    var layer = LayerManager.get_layerList()[key];
    if (layer.loadedFromTour) {
      purgeTargets.push(layer.id);
    }
  }
  var $enum2 = ss.enumerate(purgeTargets);
  while ($enum2.moveNext()) {
    var guid = $enum2.current;
    LayerManager.deleteLayerByID(guid, true, false);
  }
  var purgeMapsNames = [];
  var $enum3 = ss.enumerate(ss.keys(LayerManager.get_allMaps()));
  while ($enum3.moveNext()) {
    var key = $enum3.current;
    var map = LayerManager.get_allMaps()[key];
    if (map.loadedFromTour && !map.layers.length) {
      purgeMapsNames.push(map.get_name());
    }
  }
  var $enum4 = ss.enumerate(purgeMapsNames);
  while ($enum4.moveNext()) {
    var name = $enum4.current;
    LayerManager.purgeLayerMapDeep(LayerManager.get_allMaps()[name], true);
  }
  LayerManager.set_version(LayerManager.get_version() + 1) - 1;
  LayerManager.loadTree();
};

LayerManager.purgeLayerMapDeep = function (target, topLevel) {
  var $enum1 = ss.enumerate(target.layers);
  while ($enum1.moveNext()) {
    var layer = $enum1.current;
    LayerManager.deleteLayerByID(layer.id, false, false);
  }
  target.layers.length = 0;
  var $enum2 = ss.enumerate(ss.keys(target.childMaps));
  while ($enum2.moveNext()) {
    var key = $enum2.current;
    var map = target.childMaps[key];
    LayerManager.purgeLayerMapDeep(map, false);
  }
  ss.clearKeys(target.childMaps);
  if (topLevel) {
    if (!ss.emptyString(target.frame.parent)) {
      if (ss.keyExists(LayerManager.get_allMaps(), target.frame.parent)) {
        delete LayerManager.get_allMaps()[target.frame.parent].childMaps[target.get_name()];
      }
    } else {
      if (ss.keyExists(LayerManager.get_layerMaps(), target.get_name())) {
        delete LayerManager.get_layerMaps()[target.get_name()];
      }
    }
  }
  delete LayerManager.get_allMaps()[target.get_name()];
  LayerManager._version++;
};

LayerManager._cleanAllTourLoadedLayers = function () {
  var $enum1 = ss.enumerate(ss.keys(LayerManager.get_layerList()));
  while ($enum1.moveNext()) {
    var key = $enum1.current;
    var layer = LayerManager.get_layerList()[key];
    if (layer.loadedFromTour) {
      layer.loadedFromTour = false;
    }
  }
};

LayerManager.mergeToursLayers = function () {
  LayerManager._tourLayers = false;
  var OverWrite = false;
  var CollisionChecked = false;
  var $enum1 = ss.enumerate(ss.keys(LayerManager._allMapsTours));
  while ($enum1.moveNext()) {
    var key = $enum1.current;
    var map = LayerManager._allMapsTours[key];
    if (!ss.keyExists(LayerManager._allMaps, map.get_name())) {
      var newMap = new LayerMap(map.get_name(), 18);
      newMap.frame = map.frame;
      newMap.loadedFromTour = true;
      LayerManager.get_allMaps()[newMap.get_name()] = newMap;
    }
  }
  LayerManager.connectAllChildren();
  var $enum2 = ss.enumerate(ss.keys(LayerManager._layerListTours));
  while ($enum2.moveNext()) {
    var key = $enum2.current;
    var layer = LayerManager._layerListTours[key];
    if (ss.keyExists(LayerManager.get_layerList(), layer.id)) {
      if (!CollisionChecked) {
        OverWrite = true;
        CollisionChecked = true;
      }
      if (OverWrite) {
        LayerManager.deleteLayerByID(layer.id, true, false);
      }
    }
    if (!ss.keyExists(LayerManager.get_layerList(), layer.id)) {
      if (ss.keyExists(LayerManager.get_allMaps(), layer.get_referenceFrame())) {
        LayerManager.get_layerList()[layer.id] = layer;
        LayerManager.get_allMaps()[layer.get_referenceFrame()].layers.push(layer);
      }
    } else {
      layer.cleanUp();
    }
  }
  ss.clearKeys(LayerManager._layerListTours);
  ss.clearKeys(LayerManager._allMapsTours);
  ss.clearKeys(LayerManager._layerMapsTours);
  LayerManager.loadTree();
};

LayerManager.connectAllChildren = function () {
  var $enum1 = ss.enumerate(ss.keys(LayerManager.get_allMaps()));
  while ($enum1.moveNext()) {
    var key = $enum1.current;
    var map = LayerManager.get_allMaps()[key];
    if (ss.emptyString(map.frame.parent) && !ss.keyExists(LayerManager.get_layerMaps(), map.frame.name)) {
      LayerManager.get_layerMaps()[map.get_name()] = map;
    } else if (!ss.emptyString(map.frame.parent) && ss.keyExists(LayerManager.get_allMaps(), map.frame.parent)) {
      if (!ss.keyExists(LayerManager.get_allMaps()[map.frame.parent].childMaps, map.frame.name)) {
        LayerManager.get_allMaps()[map.frame.parent].childMaps[map.frame.name] = map;
        map.parent = LayerManager.get_allMaps()[map.frame.parent];
      }
    }
  }
};

LayerManager.deleteLayerByID = function (ID, removeFromParent, updateTree) {
  if (ss.keyExists(LayerManager.get_layerList(), ID)) {
    var layer = LayerManager.get_layerList()[ID];
    layer.cleanUp();
    if (removeFromParent) {
      ss.remove(LayerManager.get_allMaps()[layer.get_referenceFrame()].layers, layer);
    }
    delete LayerManager.get_layerList()[ID];
    LayerManager._version++;
    if (updateTree) {
      LayerManager.loadTree();
    }
    return true;
  }
  else {
    return false;
  }
};

LayerManager._getFrameTarget = function (renderContext, TrackingFrame) {
  var target = new FrameTarget();
  var targetPoint = Vector3d.get_empty();
  target.target = Vector3d.get_empty();
  target.matrix = Matrix3d.get_identity();
  if (!ss.keyExists(LayerManager.get_allMaps(), TrackingFrame)) {
    return target;
  }
  var mapList = [];
  var current = LayerManager.get_allMaps()[TrackingFrame];
  mapList.push(current);
  while (current.frame.reference === 18) {
    current = current.parent;
    mapList.splice(0, 0, current);
  }
  var matOld = renderContext.get_world().clone();
  var matOldNonRotating = renderContext.get_worldBaseNonRotating();
  var matOldBase = renderContext.get_worldBase();
  var oldNominalRadius = renderContext.get_nominalRadius();
  var $enum1 = ss.enumerate(mapList);
  while ($enum1.moveNext()) {
    var map = $enum1.current;
    if (map.frame.reference !== 18 && map.frame.reference !== 20) {
      Planets.setupPlanetMatrix(renderContext, Enums.parse('SolarSystemObjects', map.frame.name), Vector3d.get_empty(), false);
    } else {
      map.computeFrame(renderContext);
      if (map.frame.useRotatingParentFrame()) {
        renderContext.set_world(Matrix3d.multiplyMatrix(map.frame.worldMatrix, renderContext.get_world()));
      }
      else {
        renderContext.set_world(Matrix3d.multiplyMatrix(map.frame.worldMatrix, renderContext.get_worldBaseNonRotating()));
      }
      if (map.frame.referenceFrameType === 3) {
        renderContext.set_worldBaseNonRotating(renderContext.get_world().clone());
      }
      renderContext.set_nominalRadius(map.frame.meanRadius);
    }
  }
  targetPoint = renderContext.get_world().transform(targetPoint);
  var lookAt = renderContext.get_world().transform(Vector3d.create(0, 0, 1));
  var lookUp = Vector3d.subtractVectors(renderContext.get_world().transform(Vector3d.create(0, 1, 0)), targetPoint);
  lookUp.normalize();
  target.matrix = Matrix3d.lookAtLH(new Vector3d(), Vector3d.subtractVectors(lookAt, targetPoint), lookUp);
  renderContext.set_nominalRadius(oldNominalRadius);
  renderContext.set_world(matOld);
  renderContext.set_worldBaseNonRotating(matOldNonRotating);
  renderContext.set_worldBase(matOldBase);
  target.target = targetPoint;
  return target;
};

LayerManager._prepTourLayers = function () {
  if (TourPlayer.get_playing()) {
    var player = globalWWTControl.uiController;
    if (player != null) {
      var tour = player.get_tour();
      if (tour.get_currentTourStop() != null) {
        player.updateTweenPosition(-1);
        if (!tour.get_currentTourStop().get_keyFramed()) {
          tour.get_currentTourStop()._updateLayerOpacity();
          var $enum1 = ss.enumerate(ss.keys(tour.get_currentTourStop().layers));
          while ($enum1.moveNext()) {
            var key = $enum1.current;
            var info = tour.get_currentTourStop().layers[key];
            if (ss.keyExists(LayerManager.get_layerList(), info.id)) {
              LayerManager.get_layerList()[info.id].set_opacity(info.frameOpacity);
              LayerManager.get_layerList()[info.id].setParams(info.frameParams);
            }
          }
        }
      }
    }
  }
};

LayerManager._draw = function (renderContext, opacity, astronomical, referenceFrame, nested, cosmos) {
  if (!ss.keyExists(LayerManager.get_allMaps(), referenceFrame)) {
    return;
  }
  var thisMap = LayerManager.get_allMaps()[referenceFrame];
  if (!thisMap.enabled || (!ss.keyCount(thisMap.childMaps) && !thisMap.layers.length && !(thisMap.frame.showAsPoint || thisMap.frame.showOrbitPath))) {
    return;
  }
  if (TourPlayer.get_playing()) {
    var player = globalWWTControl.uiController;
    if (player != null) {
      var tour = player.get_tour();
      if (tour.get_currentTourStop() != null) {
        player.updateTweenPosition(-1);
        tour.get_currentTourStop()._updateLayerOpacity();
        var $enum1 = ss.enumerate(ss.keys(tour.get_currentTourStop().layers));
        while ($enum1.moveNext()) {
          var key = $enum1.current;
          var info = tour.get_currentTourStop().layers[key];
          if (ss.keyExists(LayerManager.get_layerList(), info.id)) {
            LayerManager.get_layerList()[info.id].set_opacity(info.frameOpacity);
            LayerManager.get_layerList()[info.id].setParams(info.frameParams);
          }
        }
      }
    }
  }
  var matOld = renderContext.get_world();
  var matOldNonRotating = renderContext.get_worldBaseNonRotating();
  var oldNominalRadius = renderContext.get_nominalRadius();
  if ((thisMap.frame.reference === 18 | thisMap.frame.reference === 18) === 1) {
    thisMap.computeFrame(renderContext);
    if (thisMap.frame.referenceFrameType !== 1 && thisMap.frame.referenceFrameType !== 2) {
      renderContext.set_world(Matrix3d.multiplyMatrix(thisMap.frame.worldMatrix, renderContext.get_world()));
    } else {
      renderContext.set_world(Matrix3d.multiplyMatrix(thisMap.frame.worldMatrix, renderContext.get_worldBaseNonRotating()));
    }
    renderContext.set_nominalRadius(thisMap.frame.meanRadius);
  }
  if (thisMap.frame.showAsPoint) { }
  for (var pass = 0; pass < 2; pass++) {
    var $enum2 = ss.enumerate(LayerManager.get_allMaps()[referenceFrame].layers);
    while ($enum2.moveNext()) {
      var layer = $enum2.current;
      if ((!pass && ss.canCast(layer, ImageSetLayer)) || (pass === 1 && !(ss.canCast(layer, ImageSetLayer)))) {
        var skipLayer = false;
        if (!pass) {
          skipLayer = !astronomical && (layer).get_overrideDefaultLayer();
        }
        if (layer.enabled && !skipLayer) {
          var layerStart = SpaceTimeController.utcToJulian(layer.get_startTime());
          var layerEnd = SpaceTimeController.utcToJulian(layer.get_endTime());
          var fadeIn = SpaceTimeController.utcToJulian(layer.get_startTime()) - ((layer.get_fadeType() === 1 || layer.get_fadeType() === 3) ? (layer.get_fadeSpan() / 864000000) : 0);
          var fadeOut = SpaceTimeController.utcToJulian(layer.get_endTime()) + ((layer.get_fadeType() === 2 || layer.get_fadeType() === 3) ? (layer.get_fadeSpan() / 864000000) : 0);
          if (SpaceTimeController.get_jNow() > fadeIn && SpaceTimeController.get_jNow() < fadeOut) {
            var fadeOpacity = 1;
            if (SpaceTimeController.get_jNow() < layerStart) {
              fadeOpacity = ((SpaceTimeController.get_jNow() - fadeIn) / (layer.get_fadeSpan() / 864000000));
            }
            if (SpaceTimeController.get_jNow() > layerEnd) {
              fadeOpacity = ((fadeOut - SpaceTimeController.get_jNow()) / (layer.get_fadeSpan() / 864000000));
            }
            layer.set_astronomical(astronomical);
            if (ss.canCast(layer, SpreadSheetLayer)) {
              var tsl = ss.safeCast(layer, SpreadSheetLayer);
              tsl.draw(renderContext, opacity * fadeOpacity, cosmos);
            }
            else {
              layer.draw(renderContext, opacity * fadeOpacity, cosmos);
            }
          }
        }
      }
    }
  }
  if (nested) {
    var $enum3 = ss.enumerate(ss.keys(LayerManager.get_allMaps()[referenceFrame].childMaps));
    while ($enum3.moveNext()) {
      var key = $enum3.current;
      var map = LayerManager.get_allMaps()[referenceFrame].childMaps[key];
      if (!(ss.canCast(map, LayerMap))) {
        continue;
      }
      if (map.enabled && map.frame.showOrbitPath && Settings.get_active().get_solarSystemOrbits() && Settings.get_active().get_solarSystemMinorOrbits()) {
        if (map.frame.referenceFrameType === 1) {
          if (map.frame.get_orbit() == null) {
            map.frame.set_orbit(new Orbit(map.frame.get_elements(), 360, map.frame.get_representativeColor(), 1, map.parent.frame.meanRadius));
          }
          var matSaved = renderContext.get_world();
          renderContext.set_world(Matrix3d.multiplyMatrix(thisMap.frame.worldMatrix, renderContext.get_worldBaseNonRotating()));
          map.frame.get_orbit().draw3D(renderContext, 1 * 0.5, Vector3d.create(0, 0, 0));
          renderContext.set_world(matSaved);
        }
        else if (map.frame.referenceFrameType === 2) {
        }
      }
      if ((map.frame.reference === 18 || map.frame.reference === 19)) {
        LayerManager._draw(renderContext, opacity, astronomical, map.get_name(), nested, cosmos);
      }
    }
  }
  renderContext.set_nominalRadius(oldNominalRadius);
  renderContext.set_world(matOld);
  renderContext.set_worldBaseNonRotating(matOldNonRotating);
};

LayerManager._getVisibleLayerList = function (previous) {
  var list = {};
  var $enum1 = ss.enumerate(ss.keys(LayerManager.get_layerList()));
  while ($enum1.moveNext()) {
    var key = $enum1.current;
    var layer = LayerManager.get_layerList()[key];
    if (layer.enabled) {
      var info = new LayerInfo();
      info.startOpacity = info.endOpacity = layer.get_opacity();
      info.id = layer.id;
      info.startParams = layer.getParams();
      if (ss.keyExists(previous, info.id)) {
        info.endOpacity = previous[info.id].endOpacity;
        info.endParams = previous[info.id].endParams;
      }
      else {
        info.endParams = layer.getParams();
      }
      list[layer.id] = info;
    }
  }
  return list;
};

LayerManager.setVisibleLayerList = function (list) {
  var $enum1 = ss.enumerate(ss.keys(LayerManager.get_layerList()));
  while ($enum1.moveNext()) {
    var key = $enum1.current;
    var layer = LayerManager.get_layerList()[key];
    layer.enabled = ss.keyExists(list, layer.id);
    try {
      if (layer.enabled) {
        layer.set_opacity(list[layer.id].frameOpacity);
        layer.setParams(list[layer.id].frameParams);
      }
    }
    catch ($e2) {
    }
  }
};

LayerManager._preDraw = function (renderContext, opacity, astronomical, referenceFrame, nested) {
  if (!ss.keyExists(LayerManager.get_allMaps(), referenceFrame)) {
    return;
  }
  var thisMap = LayerManager.get_allMaps()[referenceFrame];
  if (!ss.keyCount(thisMap.childMaps) && !thisMap.layers.length) {
    return;
  }
  if (TourPlayer.get_playing()) {
    var player = ss.safeCast(globalWWTControl.uiController, TourPlayer);
    if (player != null) {
      var tour = player.get_tour();
      if (tour.get_currentTourStop() != null) {
        player.updateTweenPosition(-1);
        tour.get_currentTourStop()._updateLayerOpacity();
        var $enum1 = ss.enumerate(ss.keys(tour.get_currentTourStop().layers));
        while ($enum1.moveNext()) {
          var key = $enum1.current;
          var info = tour.get_currentTourStop().layers[key];
          if (ss.keyExists(LayerManager.get_layerList(), info.id)) {
            LayerManager.get_layerList()[info.id].set_opacity(info.frameOpacity);
            LayerManager.get_layerList()[info.id].setParams(info.frameParams);
          }
        }
      }
    }
  }
  var matOld = renderContext.get_world();
  var matOldNonRotating = renderContext.get_worldBaseNonRotating();
  var oldNominalRadius = renderContext.get_nominalRadius();
  if (thisMap.frame.reference === 18) {
    thisMap.computeFrame(renderContext);
    if (thisMap.frame.referenceFrameType !== 1) {
      renderContext.set_world(Matrix3d.multiplyMatrix(thisMap.frame.worldMatrix, renderContext.get_world()));
    } else {
      renderContext.set_world(Matrix3d.multiplyMatrix(thisMap.frame.worldMatrix, renderContext.get_worldBaseNonRotating()));
    }
    renderContext.set_nominalRadius(thisMap.frame.meanRadius);
  }
  for (var pass = 0; pass < 2; pass++) {
    var $enum2 = ss.enumerate(LayerManager.get_allMaps()[referenceFrame].layers);
    while ($enum2.moveNext()) {
      var layer = $enum2.current;
      if ((!pass && ss.canCast(layer, ImageSetLayer)) || (pass === 1 && !(ss.canCast(layer, ImageSetLayer)))) {
        if (layer.enabled) {
          var layerStart = SpaceTimeController.utcToJulian(layer.get_startTime());
          var layerEnd = SpaceTimeController.utcToJulian(layer.get_endTime());
          var fadeIn = SpaceTimeController.utcToJulian(layer.get_startTime()) - ((layer.get_fadeType() === 1 || layer.get_fadeType() === 3) ? (layer.get_fadeSpan() / 864000000) : 0);
          var fadeOut = SpaceTimeController.utcToJulian(layer.get_endTime()) + ((layer.get_fadeType() === 2 || layer.get_fadeType() === 3) ? (layer.get_fadeSpan() / 864000000) : 0);
          if (SpaceTimeController.get_jNow() > fadeIn && SpaceTimeController.get_jNow() < fadeOut) {
            var fadeOpacity = 1;
            if (SpaceTimeController.get_jNow() < layerStart) {
              fadeOpacity = ((SpaceTimeController.get_jNow() - fadeIn) / (layer.get_fadeSpan() / 864000000));
            }
            if (SpaceTimeController.get_jNow() > layerEnd) {
              fadeOpacity = ((fadeOut - SpaceTimeController.get_jNow()) / (layer.get_fadeSpan() / 864000000));
            }
            if (!thisMap.frame.reference) {
              layer.set_astronomical(true);
            }
            layer.preDraw(renderContext, opacity * fadeOpacity);
          }
        }
      }
    }
  }
  if (nested) {
    var $enum3 = ss.enumerate(ss.keys(LayerManager.get_allMaps()[referenceFrame].childMaps));
    while ($enum3.moveNext()) {
      var key = $enum3.current;
      var map = LayerManager.get_allMaps()[referenceFrame].childMaps[key];
      if ((map.frame.reference === 18 || map.frame.reference === 19)) {
        LayerManager._preDraw(renderContext, opacity, astronomical, map.get_name(), nested);
      }
    }
  }
  renderContext.set_nominalRadius(oldNominalRadius);
  renderContext.set_world(matOld);
  renderContext.set_worldBaseNonRotating(matOldNonRotating);
};

LayerManager.add = function (layer, updateTree) {
  if (!ss.keyExists(LayerManager.get_layerList(), layer.id)) {
    if (ss.keyExists(LayerManager.get_allMaps(), layer.get_referenceFrame())) {
      LayerManager.get_layerList()[layer.id] = layer;
      LayerManager.get_allMaps()[layer.get_referenceFrame()].layers.push(layer);
      LayerManager._version++;
      if (updateTree) {
        LayerManager.loadTree();
      }
    }
  }
};

LayerManager.layerSelectionChanged = function (selected) {
  LayerManager._selectedLayer = selected;
  if (LayerManager._selectedLayer != null) {
    if (ss.canCast(LayerManager._selectedLayer, LayerMap)) {
      var map = ss.safeCast(LayerManager._selectedLayer, LayerMap);
      if (map != null) {
        LayerManager.set_currentMap(map.get_name());
      }
    } else {
      var layer = ss.safeCast(LayerManager._selectedLayer, ImageSetLayer);
      if (layer != null && ss.canCast(layer.get_imageSet().get_wcsImage(), FitsImage)) {
        return;
      }
    }
  }
  globalScriptInterface.setTimeSlider('left', '');
  globalScriptInterface.setTimeSlider('right', '');
  globalScriptInterface.setTimeSlider('title', Language.getLocalizedText(667, 'Time Scrubber'));
};

LayerManager.setTimeSliderValue = function (pos) {
  var layer = ss.safeCast(LayerManager._selectedLayer, ImageSetLayer);
  if (layer != null && ss.canCast(layer.get_imageSet().get_wcsImage(), FitsImage)) { }
};

LayerManager.showLayerMenu = function (selected, x, y) {
  LayerManager._lastMenuClick = Vector2d.create(x, y);
  LayerManager._selectedLayer = selected;
  if (ss.canCast(selected, LayerMap)) {
    LayerManager.set_currentMap((selected).get_name());
  }
  else if (ss.canCast(selected, Layer)) {
    LayerManager.set_currentMap((selected).get_referenceFrame());
  }
  if (((ss.canCast(selected, Layer)) && !(ss.canCast(selected, SkyOverlays)))) {
    var selectedLayer = selected;
    LayerManager._contextMenu = new ContextMenuStrip();
    var renameMenu = ToolStripMenuItem.create(Language.getLocalizedText(225, 'Rename'));
    var Expand = ToolStripMenuItem.create(Language.getLocalizedText(981, 'Expand'));
    var Collapse = ToolStripMenuItem.create(Language.getLocalizedText(982, 'Collapse'));
    var copyMenu = ToolStripMenuItem.create(Language.getLocalizedText(428, 'Copy'));
    var deleteMenu = ToolStripMenuItem.create(Language.getLocalizedText(167, 'Delete'));
    var saveMenu = ToolStripMenuItem.create(Language.getLocalizedText(960, 'Save...'));
    var publishMenu = ToolStripMenuItem.create(Language.getLocalizedText(983, 'Publish to Community...'));
    var colorMenu = ToolStripMenuItem.create(Language.getLocalizedText(458, 'Color/Opacity'));
    var opacityMenu = ToolStripMenuItem.create(Language.getLocalizedText(305, 'Opacity'));
    var propertiesMenu = ToolStripMenuItem.create(Language.getLocalizedText(20, 'Properties'));
    var scaleMenu = ToolStripMenuItem.create(Language.getLocalizedText(1291, 'Scale/Histogram'));
    var lifeTimeMenu = ToolStripMenuItem.create(Language.getLocalizedText(683, 'Lifetime'));
    var spacer1 = new ToolStripSeparator();
    var top = ToolStripMenuItem.create(Language.getLocalizedText(684, 'Move to Top'));
    var up = ToolStripMenuItem.create(Language.getLocalizedText(685, 'Move Up'));
    var down = ToolStripMenuItem.create(Language.getLocalizedText(686, 'Move Down'));
    var bottom = ToolStripMenuItem.create(Language.getLocalizedText(687, 'Move to Bottom'));
    var showViewer = ToolStripMenuItem.create(Language.getLocalizedText(957, 'VO Table Viewer'));
    var spacer2 = new ToolStripSeparator();
    var defaultImageset = ToolStripMenuItem.create(Language.getLocalizedText(1294, 'Background Image Set'));
    top.click = LayerManager._top_Click;
    up.click = LayerManager._up_Click;
    down.click = LayerManager._down_Click;
    bottom.click = LayerManager._bottom_Click;
    saveMenu.click = LayerManager._saveMenu_Click;
    publishMenu.click = LayerManager._publishMenu_Click;
    Expand.click = LayerManager._expand_Click;
    Collapse.click = LayerManager._collapse_Click;
    copyMenu.click = LayerManager._copyMenu_Click;
    colorMenu.click = LayerManager._colorMenu_Click;
    deleteMenu.click = LayerManager._deleteMenu_Click;
    renameMenu.click = LayerManager._renameMenu_Click;
    propertiesMenu.click = LayerManager._propertiesMenu_Click;
    scaleMenu.click = LayerManager.scaleMenu_click;
    defaultImageset.click = LayerManager._defaultImageset_Click;
    opacityMenu.click = LayerManager._opacityMenu_Click;
    lifeTimeMenu.click = LayerManager._lifeTimeMenu_Click;
    showViewer.click = LayerManager._showViewer_Click;
    LayerManager._contextMenu.items.push(renameMenu);
    if (!selectedLayer.get_opened() && selectedLayer.getPrimaryUI() != null && selectedLayer.getPrimaryUI().get_hasTreeViewNodes()) {
      LayerManager._contextMenu.items.push(Expand);
    }
    if (selectedLayer.get_opened()) {
      LayerManager._contextMenu.items.push(Collapse);
    }
    if (selectedLayer.canCopyToClipboard()) {
    }
    LayerManager._contextMenu.items.push(deleteMenu);
    LayerManager._contextMenu.items.push(spacer2);
    LayerManager._contextMenu.items.push(colorMenu);
    if (ss.canCast(selected, ImageSetLayer)) {
      LayerManager._contextMenu.items.push(defaultImageset);
      var isl = ss.safeCast(selected, ImageSetLayer);
      defaultImageset.checked = isl.get_overrideDefaultLayer();
    }
    if (ss.canCast(selected, SpreadSheetLayer) || ss.canCast(selected, GreatCirlceRouteLayer)) {
      LayerManager._contextMenu.items.push(propertiesMenu);
    }
    if (ss.canCast(selected, VoTableLayer)) {
      LayerManager._contextMenu.items.push(showViewer);
    }
    if (ss.canCast(selected, ImageSetLayer)) {
      var isl = ss.safeCast(selected, ImageSetLayer);
      LayerManager._contextMenu.items.push(scaleMenu);
    }
    if (LayerManager.get_allMaps()[selectedLayer.get_referenceFrame()].layers.length > 1) {
      LayerManager._contextMenu.items.push(spacer1);
      LayerManager._contextMenu.items.push(top);
      LayerManager._contextMenu.items.push(up);
      LayerManager._contextMenu.items.push(down);
      LayerManager._contextMenu.items.push(bottom);
    }
    LayerManager._contextMenu._show(Vector2d.create(x, y));
  }
  else if (ss.canCast(selected, LayerMap)) {
    var map = ss.safeCast(selected, LayerMap);
    var sandbox = map.frame.reference.toString() === 'Sandbox';
    var Dome = map.frame.name === 'Dome';
    var Sky = map.frame.name === 'Sky';
    if (Dome) {
      return;
    }
    LayerManager._contextMenu = new ContextMenuStrip();
    var trackFrame = ToolStripMenuItem.create(Language.getLocalizedText(1298, 'Track this frame'));
    var goTo = ToolStripMenuItem.create(Language.getLocalizedText(1299, 'Fly Here'));
    var showOrbit = ToolStripMenuItem.create('Show Orbit');
    var newMenu = ToolStripMenuItem.create(Language.getLocalizedText(674, 'New Reference Frame'));
    var newLayerGroupMenu = ToolStripMenuItem.create(Language.getLocalizedText(675, 'New Layer Group'));
    var addMenu = ToolStripMenuItem.create(Language.getLocalizedText(166, 'Add'));
    var newLight = ToolStripMenuItem.create('Add Light');
    var addFeedMenu = ToolStripMenuItem.create(Language.getLocalizedText(956, 'Add OData/table feed as Layer'));
    var addWmsLayer = ToolStripMenuItem.create(Language.getLocalizedText(987, 'New WMS Layer'));
    var addGridLayer = ToolStripMenuItem.create(Language.getLocalizedText(1300, 'New Lat/Lng Grid'));
    var addGreatCircle = ToolStripMenuItem.create(Language.getLocalizedText(988, 'New Great Circle'));
    var importTLE = ToolStripMenuItem.create(Language.getLocalizedText(989, 'Import Orbital Elements'));
    var addMpc = ToolStripMenuItem.create(Language.getLocalizedText(1301, 'Add Minor Planet'));
    var deleteFrameMenu = ToolStripMenuItem.create(Language.getLocalizedText(167, 'Delete'));
    var pasteMenu = ToolStripMenuItem.create(Language.getLocalizedText(425, 'Paste'));
    var addToTimeline = ToolStripMenuItem.create(Language.getLocalizedText(1290, 'Add to Timeline'));
    var addKeyframe = ToolStripMenuItem.create(Language.getLocalizedText(1280, 'Add Keyframe'));
    var popertiesMenu = ToolStripMenuItem.create(Language.getLocalizedText(20, 'Properties'));
    var saveMenu = ToolStripMenuItem.create(Language.getLocalizedText(990, 'Save Layers'));
    var publishLayers = ToolStripMenuItem.create(Language.getLocalizedText(991, 'Publish Layers to Community'));
    var spacer1 = new ToolStripSeparator();
    var spacer0 = new ToolStripSeparator();
    var spacer2 = new ToolStripSeparator();
    var asReferenceFrame = ToolStripMenuItem.create('As Reference Frame');
    var asOrbitalLines = ToolStripMenuItem.create('As Orbital Line');
    trackFrame.click = LayerManager._trackFrame_Click;
    goTo.click = LayerManager._goTo_Click;
    asReferenceFrame.click = LayerManager._addMpc_Click;
    asOrbitalLines.click = LayerManager._asOrbitalLines_Click;
    addMpc.dropDownItems.push(asReferenceFrame);
    addMpc.dropDownItems.push(asOrbitalLines);
    addMenu.click = LayerManager._addMenu_Click;
    newLayerGroupMenu.click = LayerManager._newLayerGroupMenu_Click;
    pasteMenu.click = LayerManager._pasteLayer_Click;
    newMenu.click = LayerManager._newMenu_Click;
    deleteFrameMenu.click = LayerManager._deleteFrameMenu_Click;
    popertiesMenu.click = LayerManager._framePropertiesMenu_Click;
    addGreatCircle.click = LayerManager._addGreatCircle_Click;
    addGridLayer.click = LayerManager._addGirdLayer_Click;
    var convertToOrbit = ToolStripMenuItem.create('Extract Orbit Layer');
    if (map.frame.reference !== 19) {
      if ((globalWWTControl.get_solarSystemMode() | globalWWTControl.sandboxMode) === 1) {
        var spacerNeeded = false;
        if (map.frame.reference !== 18 && !globalWWTControl.sandboxMode) {
          if (!Sky) {
          }
          try {
            var name = map.frame.reference.toString();
            if (name !== 'Sandbox') {
              var ssObj = Enums.parse('SolarSystemObjects', name);
              var id = ssObj;
              var bit = Math.pow(2, id);
              showOrbit.checked = !!(Settings.get_active().get_planetOrbitsFilter() & bit);
              showOrbit.click = LayerManager._showOrbitPlanet_Click;
              showOrbit.tag = bit.toString();
            }
          }
          catch ($e1) {
          }
        }
        else {
          if (!sandbox && !Sky) {
            LayerManager._contextMenu.items.push(trackFrame);
            spacerNeeded = true;
          }
          showOrbit.checked = map.frame.showOrbitPath;
          showOrbit.click = LayerManager._showOrbit_Click;
        }
        if (spacerNeeded) {
          LayerManager._contextMenu.items.push(spacer2);
        }
        if (!Sky && !sandbox) {
          LayerManager._contextMenu.items.push(showOrbit);
          LayerManager._contextMenu.items.push(spacer0);
        }
        if (map.frame.reference.toString() === 'Sandbox') {
          LayerManager._contextMenu.items.push(newLight);
        }
      }
      if (!Sky) {
        LayerManager._contextMenu.items.push(newMenu);
      }
    }
    if (!Sky) {
      LayerManager._contextMenu.items.push(addGreatCircle);
      LayerManager._contextMenu.items.push(addGridLayer);
    }
    if ((map.frame.reference !== 19 && map.frame.name === 'Sun') || (map.frame.reference === 19 && map.parent != null && map.parent.frame.name === 'Sun')) {
      LayerManager._contextMenu.items.push(addMpc);
    }
    if (map.frame.reference === 18 && map.frame.referenceFrameType === 1 && map.parent != null && map.parent.frame.name === 'Sun') {
    }
    if (!Sky) {
    }
    LayerManager._contextMenu.items.push(pasteMenu);
    if (map.frame.reference === 19) {
      LayerManager._contextMenu.items.push(deleteFrameMenu);
    }
    if (map.frame.reference === 18) {
      LayerManager._contextMenu.items.push(deleteFrameMenu);
      LayerManager._contextMenu.items.push(popertiesMenu);
    }
    LayerManager._contextMenu.items.push(spacer1);
    LayerManager._contextMenu._show(Vector2d.create(x, y));
  }
};

LayerManager._publishMenu_Click = function (sender, e) { };

LayerManager._addGirdLayer_Click = function (sender, e) {
  var layer = new GridLayer();
  layer.enabled = true;
  layer.set_name('Lat-Lng Grid');
  LayerManager.get_layerList()[layer.id] = layer;
  layer.set_referenceFrame(LayerManager._currentMap);
  LayerManager.get_allMaps()[LayerManager._currentMap].layers.push(layer);
  LayerManager.get_allMaps()[LayerManager._currentMap].open = true;
  LayerManager._version++;
  LayerManager.loadTree();
};

LayerManager._trackFrame_Click = function (sender, e) {
  var target = LayerManager._selectedLayer;
  globalRenderContext.set_solarSystemTrack(20);
  globalRenderContext.set_trackingFrame(target.get_name());
  globalRenderContext.viewCamera.zoom = globalRenderContext.targetCamera.zoom = 1E-09;
};

LayerManager._goTo_Click = function (sender, e) { };

LayerManager._saveMenu_Click = function (sender, e) { };

LayerManager._expand_Click = function (sender, e) { };

LayerManager._collapse_Click = function (sender, e) { };

LayerManager._copyMenu_Click = function (sender, e) {
  if (LayerManager._selectedLayer != null && ss.canCast(LayerManager._selectedLayer, Layer)) {
    var node = LayerManager._selectedLayer;
    node.copyToClipboard();
  }
};

LayerManager._newLayerGroupMenu_Click = function (sender, e) { };

LayerManager._importTLEFile = function (filename) { };

LayerManager._makeLayerGroupNow = function (name) {
  var target = LayerManager._selectedLayer;
  LayerManager._makeLayerGroup(name, target);
};

LayerManager._makeLayerGroup = function (name, target) {
  var frame = new ReferenceFrame();
  frame.name = name;
  frame.reference = 19;
  var newMap = new LayerMap(frame.name, 19);
  newMap.frame = frame;
  newMap.frame._systemGenerated = false;
  target.addChild(newMap);
  newMap.frame.parent = target.get_name();
  LayerManager.get_allMaps()[frame.name] = newMap;
  LayerManager._version++;
};

LayerManager._lifeTimeMenu_Click = function (sender, e) { };

LayerManager._deleteFrameMenu_Click = function (sender, e) { };

LayerManager._framePropertiesMenu_Click = function (sender, e) {
  var target = LayerManager._selectedLayer;
  LayerManager.get_referenceFramePropsDialog().show(target.frame, e);
};

LayerManager._newMenu_Click = function (sender, e) {
  var frame = new ReferenceFrame();
  LayerManager.get_frameWizardDialog().show(frame, e);
};

LayerManager.referenceFrameWizardFinished = function (frame) {
  var target = LayerManager._selectedLayer;
  var newMap = new LayerMap(frame.name, 18);
  if (!ss.keyExists(LayerManager.get_allMaps(), frame.name)) {
    newMap.frame = frame;
    target.addChild(newMap);
    newMap.frame.parent = target.get_name();
    LayerManager.get_allMaps()[frame.name] = newMap;
    LayerManager._version++;
    LayerManager.loadTree();
  }
};

LayerManager.pasteFromTle = function (lines, frame) {
  var line1 = '';
  var line2 = '';
  for (var i = 0; i < lines.length; i++) {
    lines[i] = ss.trim(lines[i]);
    if (lines[i].length === 69 && ReferenceFrame.isTLECheckSumGood(lines[i])) {
      if (!line1.length && lines[i].substring(0, 1) === '1') {
        line1 = lines[i];
      }
      if (!line2.length && lines[i].substring(0, 1) === '2') {
        line2 = lines[i];
      }
    }
  }
  if (line1.length === 69 && line2.length === 69) {
    frame.fromTLE(line1, line2, 398600441800000);
    return true;
  }
  return false;
};

LayerManager._opacityMenu_Click = function (sender, e) { };

LayerManager._defaultImageset_Click = function (sender, e) {
  var isl = ss.safeCast(LayerManager._selectedLayer, ImageSetLayer);
  isl.set_overrideDefaultLayer(!isl.get_overrideDefaultLayer());
};

LayerManager._propertiesMenu_Click = function (sender, e) {
  if (ss.canCast(LayerManager._selectedLayer, SpreadSheetLayer)) {
    var target = LayerManager._selectedLayer;
    LayerManager.get_dataVizWizardDialog().show(target, e);
  }
  if (ss.canCast(LayerManager._selectedLayer, GreatCirlceRouteLayer)) {
    LayerManager.get_greatCircleDlg().show(LayerManager._selectedLayer, new ss.EventArgs());
  }
};

LayerManager._renameMenu_Click = function (sender, e) {
  var layer = LayerManager._selectedLayer;
  var input = new SimpleInput(Language.getLocalizedText(225, 'Rename'), Language.getLocalizedText(228, 'New Name'), layer.get_name(), 32);
  input.show(LayerManager._lastMenuClick, function () {
    if (!ss.emptyString(input.text)) {
      layer.set_name(input.text);
      LayerManager._version++;
      LayerManager.loadTree();
    }
  });
};

LayerManager._colorMenu_Click = function (sender, e) {
  var layer = LayerManager._selectedLayer;
  var picker = new ColorPicker();
  if (layer.get_color() != null) {
    picker.color = layer.get_color();
  }
  picker.callBack = function () {
    layer.set_color(picker.color);
  };
  picker.show(e);
};

LayerManager._addMenu_Click = function (sender, e) { };

LayerManager._deleteMenu_Click = function (sender, e) {
  LayerManager._deleteSelectedLayer();
};

LayerManager._deleteSelectedLayer = function () {
  if (LayerManager._selectedLayer != null && ss.canCast(LayerManager._selectedLayer, Layer)) {
    var node = LayerManager._selectedLayer;
    delete LayerManager.get_layerList()[node.id];
    ss.remove(LayerManager.get_allMaps()[LayerManager.get_currentMap()].layers, node);
    node.cleanUp();
    node.set_version(node.get_version() + 1) - 1;
    LayerManager.loadTree();
    LayerManager._version++;
  }
};

LayerManager.scaleMenu_click = function (sender, e) {
  var isl = ss.safeCast(LayerManager._selectedLayer, ImageSetLayer);
  if (isl != null) {
    var hist = new Histogram();
    hist.image = isl.getFitsImage();
    hist.layer = isl;
    hist.show(Vector2d.create(200, 200));
  }
};

LayerManager._showViewer_Click = function (sender, e) {
  if (ss.canCast(LayerManager._selectedLayer, VoTableLayer)) {
    var layer = ss.safeCast(LayerManager._selectedLayer, VoTableLayer);
    globalScriptInterface.displayVoTableLayer(layer);
  }
};

LayerManager._bottom_Click = function (sender, e) {
  var layer = ss.safeCast(LayerManager._selectedLayer, Layer);
  if (layer != null) {
    ss.remove(LayerManager.get_allMaps()[layer.get_referenceFrame()].layers, layer);
    LayerManager.get_allMaps()[layer.get_referenceFrame()].layers.push(layer);
  }
  LayerManager._version++;
  LayerManager.loadTree();
};

LayerManager._down_Click = function (sender, e) {
  var layer = ss.safeCast(LayerManager._selectedLayer, Layer);
  if (layer != null) {
    var index = LayerManager.get_allMaps()[layer.get_referenceFrame()].layers.lastIndexOf(layer);
    if (index < (LayerManager.get_allMaps()[layer.get_referenceFrame()].layers.length - 1)) {
      ss.remove(LayerManager.get_allMaps()[layer.get_referenceFrame()].layers, layer);
      LayerManager.get_allMaps()[layer.get_referenceFrame()].layers.splice(index + 1, 0, layer);
    }
  }
  LayerManager._version++;
  LayerManager.loadTree();
};

LayerManager._up_Click = function (sender, e) {
  var layer = ss.safeCast(LayerManager._selectedLayer, Layer);
  if (layer != null) {
    var index = LayerManager.get_allMaps()[layer.get_referenceFrame()].layers.lastIndexOf(layer);
    if (index > 0) {
      ss.remove(LayerManager.get_allMaps()[layer.get_referenceFrame()].layers, layer);
      LayerManager.get_allMaps()[layer.get_referenceFrame()].layers.splice(index - 1, 0, layer);
    }
  }
  LayerManager._version++;
  LayerManager.loadTree();
};

LayerManager._top_Click = function (sender, e) {
  var layer = ss.safeCast(LayerManager._selectedLayer, Layer);
  if (layer != null) {
    ss.remove(LayerManager.get_allMaps()[layer.get_referenceFrame()].layers, layer);
    LayerManager.get_allMaps()[layer.get_referenceFrame()].layers.splice(0, 0, layer);
  }
  LayerManager._version++;
  LayerManager.loadTree();
};

LayerManager._pasteLayer_Click = function (sender, e) {
  LayerManager.get_dataVizWizardDialog().show(LayerManager.get_currentMap(), e);
};

LayerManager.createSpreadsheetLayer = function (frame, name, data) {
  var layer = new SpreadSheetLayer();
  layer.loadFromString(data, false, false, false, true);
  layer.set_name(name);
  LayerManager.addSpreadsheetLayer(layer, frame);
  return layer;
};

LayerManager.addSpreadsheetLayer = function (layer, frame) {
  layer.enabled = true;
  layer.set_referenceFrame(frame);
  LayerManager.add(layer, true);
};

LayerManager._showOrbitPlanet_Click = function (sender, e) {
  try {
    var bit = parseInt((sender).tag.toString());
    if (!(Settings.get_globalSettings().get_planetOrbitsFilter() & bit)) {
      Settings.get_globalSettings().set_planetOrbitsFilter(Settings.get_globalSettings().get_planetOrbitsFilter() | bit);
    } else {
      Settings.get_globalSettings().set_planetOrbitsFilter(Settings.get_globalSettings().get_planetOrbitsFilter() & ~bit);
    }
  }
  catch ($e1) { }
};

LayerManager._showOrbit_Click = function (sender, e) {
  var map = ss.safeCast(LayerManager._selectedLayer, LayerMap);
  map.frame.showOrbitPath = !map.frame.showOrbitPath;
};

LayerManager._addGreatCircle_Click = function (sender, e) {
  LayerManager._addGreatCircleLayer();
};

LayerManager._addMpc_Click = function (sender, e) {
  var target = LayerManager._selectedLayer;
  var input = new SimpleInput(Language.getLocalizedText(1302, 'Minor planet name or designation'), Language.getLocalizedText(238, 'Name'), '', 32);
  var retry = false;
  do {
    if (input.showDialog() === 1) {
      if (ss.keyExists(target.childMaps, input.text)) {
        retry = true;
      }
      else {
        try {
          LayerManager._getMpc(input.text, target);
          retry = false;
        }
        catch ($e1) {
          retry = true;
        }
      }
    } else {
      retry = false;
    }
  } while (retry);
  return;
};

LayerManager._asOrbitalLines_Click = function (sender, e) {
  var target = LayerManager._selectedLayer;
  var input = new SimpleInput(Language.getLocalizedText(1302, 'Minor planet name or designation'), Language.getLocalizedText(238, 'Name'), '', 32);
  input.show(Cursor.get_position(), function () {
    if (ss.keyExists(target.childMaps, input.text)) {
    } else {
      LayerManager._getMpcAsTLE(input.text, target);
    }
  });
};

LayerManager._getMpcAsTLE = function (id, target) {
  var file = new WebFile('https://www.minorplanetcenter.net/db_search/show_object?object_id=' + id);
  file.onStateChange = function () {
    if (file.get_state() !== 1) {
      return;
    }
    var data = file.getText();
    var startform = data.indexOf('show-orbit-button');
    var lastForm = data.indexOf('/form', startform);
    var formpart = data.substring(startform, lastForm);
    var name = id;
    var frame = new ReferenceFrame();
    frame.oblateness = 0;
    frame.showOrbitPath = true;
    frame.showAsPoint = true;
    frame.epoch = SpaceTimeController.utcToJulian(ss.date(LayerManager._getValueByID(formpart, 'epoch').substring(0, 10)));
    frame.semiMajorAxis = parseFloat(LayerManager._getValueByID(formpart, 'a')) * 149598000 * 1000;
    frame.referenceFrameType = 1;
    frame.inclination = parseFloat(LayerManager._getValueByID(formpart, 'incl'));
    frame.longitudeOfAscendingNode = parseFloat(LayerManager._getValueByID(formpart, 'node'));
    frame.eccentricity = parseFloat(LayerManager._getValueByID(formpart, 'e'));
    frame.meanAnomolyAtEpoch = parseFloat(LayerManager._getValueByID(formpart, 'm'));
    frame.meanDailyMotion = ELL.meanMotionFromSemiMajorAxis(parseFloat(LayerManager._getValueByID(formpart, 'a')));
    frame.argumentOfPeriapsis = parseFloat(LayerManager._getValueByID(formpart, 'peri'));
    frame.scale = 1;
    frame.semiMajorAxisUnits = 1;
    frame.meanRadius = 10;
    frame.oblateness = 0;
    var TLE = name + '\n' + frame.toTLE();
    LayerManager._loadOrbitsFile(id, TLE, target.get_name());
    LayerManager.loadTree();
  };
  file.send();
};

LayerManager._getMpc = function (id, target) {
  var file = new WebFile('https://www.minorplanetcenter.net/db_search/show_object?object_id=' + id);
  file.onStateChange = function () {
    var data = file.getText();
    var startform = data.indexOf('show-orbit-button');
    var lastForm = data.indexOf('/form', startform);
    var formpart = data.substring(startform, lastForm);
    var name = id;
    var orbit = new LayerMap(ss.trim(name), 18);
    orbit.frame.oblateness = 0;
    orbit.frame.showOrbitPath = true;
    orbit.frame.showAsPoint = true;
    orbit.frame.epoch = SpaceTimeController.utcToJulian(ss.date(LayerManager._getValueByID(formpart, 'epoch').substring(0, 10)));
    orbit.frame.semiMajorAxis = parseFloat(LayerManager._getValueByID(formpart, 'a')) * 149598000 * 1000;
    orbit.frame.referenceFrameType = 1;
    orbit.frame.inclination = parseFloat(LayerManager._getValueByID(formpart, 'incl'));
    orbit.frame.longitudeOfAscendingNode = parseFloat(LayerManager._getValueByID(formpart, 'node'));
    orbit.frame.eccentricity = parseFloat(LayerManager._getValueByID(formpart, 'e'));
    orbit.frame.meanAnomolyAtEpoch = parseFloat(LayerManager._getValueByID(formpart, 'm'));
    orbit.frame.meanDailyMotion = ELL.meanMotionFromSemiMajorAxis(parseFloat(LayerManager._getValueByID(formpart, 'a')));
    orbit.frame.argumentOfPeriapsis = parseFloat(LayerManager._getValueByID(formpart, 'peri'));
    orbit.frame.scale = 1;
    orbit.frame.semiMajorAxisUnits = 1;
    orbit.frame.meanRadius = 10;
    orbit.frame.oblateness = 0;
    if (!ss.keyExists(LayerManager.get_allMaps()[target.get_name()].childMaps, ss.trim(name))) {
      LayerManager.get_allMaps()[target.get_name()].addChild(orbit);
    }
    LayerManager.get_allMaps()[orbit.get_name()] = orbit;
    orbit.frame.parent = target.get_name();
    LayerManager._makeLayerGroup('Minor Planet', orbit);
    LayerManager.loadTree();
  };
};

LayerManager._getValueByID = function (data, id) {
  var valStart = data.indexOf('id="' + id + '"');
  valStart = data.indexOf('value=', valStart) + 7;
  var valEnd = data.indexOf('"', valStart);
  return data.substr(valStart, valEnd - valStart);
};

LayerManager._addGreatCircleLayer = function () {
  var layer = new GreatCirlceRouteLayer();
  var camera = globalRenderContext.viewCamera;
  layer.set_latStart(camera.lat);
  layer.set_latEnd(camera.lat - 5);
  layer.set_lngStart(camera.lng);
  layer.set_lngEnd(camera.lng + 5);
  layer.set_width(4);
  layer.enabled = true;
  layer.set_name(Language.getLocalizedText(1144, 'Great Circle Route'));
  LayerManager.get_layerList()[layer.id] = layer;
  layer.set_referenceFrame(LayerManager._currentMap);
  LayerManager.get_allMaps()[LayerManager._currentMap].layers.push(layer);
  LayerManager.get_allMaps()[LayerManager._currentMap].open = true;
  LayerManager._version++;
  LayerManager.loadTree();
  LayerManager.get_greatCircleDlg().show(layer, new ss.EventArgs());
};

LayerManager._loadOrbitsFile = function (name, data, currentMap) {
  var layer = new OrbitLayer();
  layer.loadString(data);
  layer.enabled = true;
  layer.set_name(name);
  LayerManager.get_layerList()[layer.id] = layer;
  layer.set_referenceFrame(currentMap);
  LayerManager.get_allMaps()[currentMap].layers.push(layer);
  LayerManager.get_allMaps()[currentMap].open = true;
  LayerManager._version++;
  LayerManager.loadTree();
  return layer;
};

var LayerManager$ = {};

registerType("LayerManager", [LayerManager, LayerManager$, null]);

// wwtlib.LayerMap

export function LayerMap(name, reference) {
  this.childMaps = {};
  this.parent = null;
  this.layers = [];
  this.open = false;
  this.enabled = true;
  this.loadedFromTour = false;
  this.frame = new ReferenceFrame();
  this.set_name(name);
  this.frame.reference = reference;
  var radius = 6371000;
  switch (reference) {
    case 0:
      break;
    case 1:
      break;
    case 2:
      break;
    case 3:
      radius = 696000000;
      break;
    case 4:
      radius = 2439700;
      break;
    case 5:
      radius = 6051800;
      break;
    case 6:
      radius = 6371000;
      break;
    case 7:
      radius = 3390000;
      break;
    case 8:
      radius = 69911000;
      break;
    case 9:
      radius = 58232000;
      break;
    case 10:
      radius = 25362000;
      break;
    case 11:
      radius = 24622000;
      break;
    case 12:
      radius = 1161000;
      break;
    case 13:
      radius = 1737100;
      break;
    case 14:
      radius = 1821500;
      break;
    case 15:
      radius = 1561000;
      break;
    case 16:
      radius = 2631200;
      break;
    case 17:
      radius = 2410300;
      break;
    case 18:
      break;
    case 19:
      break;
    default:
      break;
  }
  this.frame.meanRadius = radius;
}

var LayerMap$ = {
  addChild: function (child) {
    child.parent = this;
    this.childMaps[child.get_name()] = child;
  },

  get_name: function () {
    return this.frame.name;
  },

  set_name: function (value) {
    this.frame.name = value;
    return value;
  },

  computeFrame: function (renderContext) {
    if (this.frame.reference === 18) {
      this.frame.computeFrame(renderContext);
    }
  },

  toString: function () {
    return this.get_name();
  }
};

registerType("LayerMap", [LayerMap, LayerMap$, null]);

// wwtlib.SkyOverlays

export function SkyOverlays() { }

var SkyOverlays$ = {};

registerType("SkyOverlays", [SkyOverlays, SkyOverlays$, null]);

// wwtlib.GroundOverlayLayer

export function GroundOverlayLayer() { }

var GroundOverlayLayer$ = {};

registerType("GroundOverlayLayer", [GroundOverlayLayer, GroundOverlayLayer$, null]);

// wwtlib.FrameTarget

export function FrameTarget() { }

var FrameTarget$ = {};

registerType("FrameTarget", [FrameTarget, FrameTarget$, null]);

// wwtlib.KmlCoordinate

export function KmlCoordinate() {
  this.lat = 0;
  this.lng = 0;
  this.alt = 0;
}

var KmlCoordinate$ = {};

registerType("KmlCoordinate", [KmlCoordinate, KmlCoordinate$, null]);

// wwtlib.KmlLineList

export function KmlLineList() {
  this.extrude = false;
  this.astronomical = false;
  this.meanRadius = 6371000;
  this.pointList = [];
}

var KmlLineList$ = {
  parseWkt: function (geoText, option, alt, date) {
    var parts = UiTools.split(geoText, '(,)');
    var $enum1 = ss.enumerate(parts);
    while ($enum1.moveNext()) {
      var part = $enum1.current;
      var coordinates = ss.trim(part).split(' ');
      if (coordinates.length > 1) {
        var pnt = new KmlCoordinate();
        pnt.lng = parseFloat(coordinates[0]);
        if (this.astronomical) {
          pnt.lng -= 180;
        }
        pnt.lat = parseFloat(coordinates[1]);
        if (coordinates.length > 2 && !alt) {
          pnt.alt = parseFloat(coordinates[2]);
        }
        else {
          pnt.alt = alt;
        }
        pnt.date = date;
        this.pointList.push(pnt);
      }
    }
  },

  getCenterPoint: function () {
    var point = new KmlCoordinate();
    point.lat = 0;
    point.lng = 0;
    point.alt = 0;
    var $enum1 = ss.enumerate(this.pointList);
    while ($enum1.moveNext()) {
      var pnt = $enum1.current;
      point.lat += pnt.lat;
      point.lng += pnt.lng;
      point.alt += pnt.alt;
    }
    point.lat /= this.pointList.length;
    point.lng /= this.pointList.length;
    point.alt /= this.pointList.length;
    return point;
  }
};

registerType("KmlLineList", [KmlLineList, KmlLineList$, null]);

// wwtlib.PushPin

export function PushPin() { }

PushPin._pinTextureCache = {};
PushPin._pins = null;

PushPin.triggerLoadSprite = function () {
  if (PushPin._pins == null) {
    PushPin._pins = Texture.fromUrl(URLHelpers.singleton.engineAssetUrl('pins.png'));
  }
};

PushPin.getPushPinTexture = function (pinId) {
  var texture = null;
  if (ss.keyExists(PushPin._pinTextureCache, pinId)) {
    return PushPin._pinTextureCache[pinId];
  }
  try {
    texture = tilePrepDevice.createTexture();
    tilePrepDevice.bindTexture(WEBGL.TEXTURE_2D, texture);
    var row = Math.floor(pinId / 16);
    var col = pinId % 16;
    var temp = document.createElement('canvas');
    temp.height = 32;
    temp.width = 32;
    var ctx = temp.getContext('2d');
    ctx.drawImage(PushPin._pins.imageElement, (col * 32), (row * 32), 32, 32, 0, 0, 32, 32);
    var image = temp;
    tilePrepDevice.texParameteri(WEBGL.TEXTURE_2D, WEBGL.TEXTURE_WRAP_S, WEBGL.CLAMP_TO_EDGE);
    tilePrepDevice.texParameteri(WEBGL.TEXTURE_2D, WEBGL.TEXTURE_WRAP_T, WEBGL.CLAMP_TO_EDGE);
    tilePrepDevice.texImage2D(WEBGL.TEXTURE_2D, 0, WEBGL.RGBA, WEBGL.RGBA, WEBGL.UNSIGNED_BYTE, image);
    tilePrepDevice.texParameteri(WEBGL.TEXTURE_2D, WEBGL.TEXTURE_MIN_FILTER, WEBGL.LINEAR_MIPMAP_NEAREST);
    tilePrepDevice.generateMipmap(WEBGL.TEXTURE_2D);
    tilePrepDevice.bindTexture(WEBGL.TEXTURE_2D, null);
    PushPin._pinTextureCache[pinId] = texture;
  }
  catch ($e1) { }
  return texture;
};

var PushPin$ = {};

registerType("PushPin", [PushPin, PushPin$, null]);


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
      ss.remove(LayerManager.get_allMaps()[layer.get_referenceFrame()].layers, layer);
      LayerManager.get_allMaps()[layer.get_referenceFrame()].layers.splice(order, 0, layer);
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

// wwtlib.TourDocument

export function TourDocument() {
  this._tourDirty = 0;
  this._workingDirectory = '';
  this.url = '';
  this._tagId = '';
  this._representativeThumbnailTourstop = 0;
  this._id = '';
  this._title = '';
  this._runTime = 0;
  this._lastDirtyCheck = 0;
  this._description = '';
  this._attributesAndCredits = '';
  this._authorEmailOther = '';
  this._authorEmail = '';
  this._authorUrl = '';
  this._authorPhone = '';
  this._authorContactText = '';
  this._orgName = 'None';
  this._orgUrl = '';
  this._author = '';
  this._authorImageUrl = '';
  this._authorImage = null;
  this._organizationUrl = '';
  this._filename = '';
  this._level = 0;
  this._type = 268435456;
  this._taxonomy = '';
  this._keywords = '';
  this._objects = '';
  this._editMode = false;
  this.explicitTourLinks = [];
  this.implicitTourLinks = [];
  this._tourStops = [];
  this._currentTourstopIndex = -1;
  this._textureList = {};
  this._textureList2d = {};
  this._fileCache = {};
  this.dontCleanUpTempFiles = false;
  this._id = Guid.newGuid().toString();
}

TourDocument.get_baseWorkingDirectory = function () {
  return '';
};

TourDocument.fromUrl = function (url, callMe) {
  var temp = new TourDocument();
  temp.url = url;
  temp._callMe = callMe;
  temp._cabinet = FileCabinet.fromUrl(url, ss.bind('_loadXmlDocument', temp));
  return temp;
};

TourDocument.fromUrlRaw = function (url, callMe) {
  var temp = new TourDocument();
  temp.url = url;
  temp._callMe = callMe;
  temp._cabinet = FileCabinet.fromUrl(url, callMe);
  return temp;
};

var TourDocument$ = {
  get_tourDirty: function () {
    return this._tourDirty > 0;
  },

  set_tourDirty: function (value) {
    if (value) {
      this._tourDirty++;
    } else {
      this._tourDirty = 0;
    }
    return value;
  },

  get_workingDirectory: function () {
    if (ss.emptyString(this._workingDirectory)) {
      this._workingDirectory = TourDocument.get_baseWorkingDirectory() + this._id + '\\';
    }
    return this._workingDirectory;
  },

  set_workingDirectory: function (value) {
    this._workingDirectory = value;
    return value;
  },

  _loadXmlDocument: function () {
    var $this = this;

    try {
      var master = this._cabinet.get_masterFile();
      var doc = new FileReader();
      doc.onloadend = function (ee) {
        var data = ss.safeCast(doc.result, String);
        var xParser = new DOMParser();
        $this.fromXml(xParser.parseFromString(data, 'text/xml'));
        $this._callMe();
      };
      doc.readAsText(this._cabinet.getFileBlob(master));
    }
    catch (ex) {
      globalScriptInterface._fireTourError(ex);
    }
  },

  fromXml: function (doc) {
    var root = Util.selectSingleNode(doc, 'Tour');
    this._id = root.attributes.getNamedItem('ID').nodeValue;
    this.set_title(root.attributes.getNamedItem('Title').nodeValue);
    this.set_author(root.attributes.getNamedItem('Author').nodeValue);
    if (root.attributes.getNamedItem('Descirption') != null) {
      this.set_description(root.attributes.getNamedItem('Descirption').nodeValue);
    }
    if (root.attributes.getNamedItem('AuthorEmail') != null) {
      this._authorEmail = root.attributes.getNamedItem('AuthorEmail').nodeValue;
    }
    if (root.attributes.getNamedItem('Keywords') != null) {
      this.set_keywords(root.attributes.getNamedItem('Keywords').nodeValue);
    }
    if (root.attributes.getNamedItem('OrganizationName') != null) {
      this.set_orgName(root.attributes.getNamedItem('OrganizationName').nodeValue);
    }
    this._organizationUrl = root.attributes.getNamedItem('OrganizationUrl').nodeValue;
    this._level = Enums.parse('UserLevel', root.attributes.getNamedItem('UserLevel').nodeValue);
    this._type = Enums.parse('Classification', root.attributes.getNamedItem('Classification').nodeValue);
    this._taxonomy = root.attributes.getNamedItem('Taxonomy').nodeValue;
    var TourStops = Util.selectSingleNode(root, 'TourStops');
    var $enum1 = ss.enumerate(TourStops.childNodes);
    while ($enum1.moveNext()) {
      var tourStop = $enum1.current;
      if (tourStop.nodeName === 'TourStop') {
        this.addTourStop(TourStop._fromXml(this, tourStop));
      }
    }
    var Frames = Util.selectSingleNode(root, 'ReferenceFrames');
    if (Frames != null) {
      var $enum2 = ss.enumerate(Frames.childNodes);
      while ($enum2.moveNext()) {
        var frame = $enum2.current;
        if (frame.nodeName === 'ReferenceFrame') {
          var newFrame = new ReferenceFrame();
          newFrame.initializeFromXml(frame);
          if (!ss.keyExists(LayerManager.get_allMaps(), newFrame.name)) {
            var map = new LayerMap(newFrame.name, 18);
            map.frame = newFrame;
            map.loadedFromTour = true;
            LayerManager.get_allMaps()[newFrame.name] = map;
          }
        }
      }
      LayerManager.connectAllChildren();
      LayerManager.loadTree();
    }
    var Layers = Util.selectSingleNode(root, 'Layers');
    if (Layers != null) {
      var $enum3 = ss.enumerate(Layers.childNodes);
      while ($enum3.moveNext()) {
        var layer = $enum3.current;
        if (layer.nodeName === 'Layer') {
          var newLayer = Layer.fromXml(layer, true);
          if (newLayer != null) {
            if (ss.canCast(newLayer, ImageSetLayer)) {
              var imageSetLayer = newLayer;
              var imageset = imageSetLayer.get_imageSet();
              if (imageset.get_projection() === ProjectionType.healpix && imageset.get_extension() === '.tsv') {
                globalWWTControl.addCatalogHips(imageset);
                continue;
              }
            }
            var fileName = ss.format('{0}.txt', newLayer.id.toString());
            if (ss.keyExists(LayerManager.get_layerList(), newLayer.id)) {
              LayerManager.deleteLayerByID(newLayer.id, true, false);
            }
            try {
              newLayer.loadedFromTour = true;
              newLayer.loadData(this, fileName);
              LayerManager.add(newLayer, false);
            }
            catch ($e4) {
            }
          }
        }
      }
      LayerManager.loadTree();
    }
    this._tourDirty = 0;
  },

  saveToDataUrl: function () {
    return URL.createObjectURL(this.saveToBlob());
  },

  saveToBlob: function () {
    var excludeAudio = false;
    this.cleanUp();
    var tourXml = this.getTourXML();
    var fc = new FileCabinet();
    fc.set_packageID(this.get_id());
    fc.addFile('Tour.wwtxml', new Blob([tourXml]));
    if (this._authorImage != null) {
    }
    var $enum1 = ss.enumerate(this.get_tourStops());
    while ($enum1.moveNext()) {
      var stop = $enum1.current;
      stop._addFilesToCabinet(fc, excludeAudio);
    }
    var masterList = this._createLayerMasterList();
    var $enum2 = ss.enumerate(masterList);
    while ($enum2.moveNext()) {
      var id = $enum2.current;
      if (ss.keyExists(LayerManager.get_layerList(), id)) {
        LayerManager.get_layerList()[id].addFilesToCabinet(fc);
      }
    }
    this.set_tourDirty(false);
    return fc.packageFiles();
  },

  getTourXML: function () {
    var xmlWriter = new XmlTextWriter();
    xmlWriter.formatting = 1;
    xmlWriter._writeProcessingInstruction('xml', "version='1.0' encoding='UTF-8'");
    xmlWriter._writeStartElement('Tour');
    xmlWriter._writeAttributeString('ID', this._id);
    xmlWriter._writeAttributeString('Title', this._title);
    xmlWriter._writeAttributeString('Descirption', this.get_description());
    xmlWriter._writeAttributeString('Description', this.get_description());
    xmlWriter._writeAttributeString('RunTime', (this.get_runTime() / 1000).toString());
    xmlWriter._writeAttributeString('Author', this._author);
    xmlWriter._writeAttributeString('AuthorEmail', this._authorEmail);
    xmlWriter._writeAttributeString('OrganizationUrl', this._organizationUrl);
    xmlWriter._writeAttributeString('OrganizationName', this.get_orgName());
    xmlWriter._writeAttributeString('Keywords', this.get_keywords());
    xmlWriter._writeAttributeString('UserLevel', Enums.toXml('UserLevel', this._level));
    xmlWriter._writeAttributeString('Classification', Enums.toXml('Classification', this._type));
    xmlWriter._writeAttributeString('Taxonomy', this._taxonomy);
    var timeLineTour = this._isTimelineTour();
    xmlWriter._writeAttributeString('TimeLineTour', timeLineTour.toString());
    xmlWriter._writeStartElement('TourStops');
    var $enum1 = ss.enumerate(this.get_tourStops());
    while ($enum1.moveNext()) {
      var stop = $enum1.current;
      stop._saveToXml(xmlWriter, true);
    }
    xmlWriter._writeEndElement();
    var masterList = this._createLayerMasterList();
    var referencedFrames = this._getReferenceFrameList();
    xmlWriter._writeStartElement('ReferenceFrames');
    var $enum2 = ss.enumerate(referencedFrames);
    while ($enum2.moveNext()) {
      var item = $enum2.current;
      item.saveToXml(xmlWriter);
    }
    xmlWriter._writeEndElement();
    xmlWriter._writeStartElement('Layers');
    var $enum3 = ss.enumerate(masterList);
    while ($enum3.moveNext()) {
      var id = $enum3.current;
      if (ss.keyExists(LayerManager.get_layerList(), id)) {
        var layer = LayerManager.get_layerList()[id];
        var name = layer.get_name();
        var imageset = globalRenderContext.getCatalogHipsByName(name);
        if (imageset != null) {
          var imageSetLayer = ImageSetLayer.create(imageset);
          imageSetLayer.id = id;
          imageSetLayer.set_name(name);
          imageSetLayer.set_referenceFrame('Sky');
          imageSetLayer.saveToXml(xmlWriter);
        }
        else {
          LayerManager.get_layerList()[id].saveToXml(xmlWriter);
        }
      }
    }
    xmlWriter._writeEndElement();
    xmlWriter._writeFullEndElement();
    xmlWriter._close();
    return xmlWriter.body;
  },

  _getReferenceFrameList: function () {
    var list = [];
    var $enum1 = ss.enumerate(ss.keys(LayerManager.get_allMaps()));
    while ($enum1.moveNext()) {
      var key = $enum1.current;
      var lm = LayerManager.get_allMaps()[key];
      if ((lm.frame.reference === 18 || lm.frame.reference === 19) && !(list.indexOf(lm.frame) >= 0) && !lm.frame._systemGenerated) {
        list.push(lm.frame);
      }
    }
    return list;
  },

  _createLayerMasterList: function () {
    var masterList = [];
    var $enum1 = ss.enumerate(this.get_tourStops());
    while ($enum1.moveNext()) {
      var stop = $enum1.current;
      var $enum2 = ss.enumerate(ss.keys(stop.layers));
      while ($enum2.moveNext()) {
        var id = $enum2.current;
        if (!(masterList.indexOf(id) >= 0)) {
          if (ss.keyExists(LayerManager.get_layerList(), id)) {
            masterList.push(id);
          }
        }
      }
    }
    return masterList;
  },

  _isTimelineTour: function () {
    return false;
  },

  get_tagId: function () {
    return this._tagId;
  },

  set_tagId: function (value) {
    this._tagId = value;
    return value;
  },

  get_authorThumbnailFilename: function () {
    return 'Author.Png';
  },

  get_tourThumbnailFilename: function () {
    if (this._representativeThumbnailTourstop < this._tourStops.length) {
      return this._tourStops[this._representativeThumbnailTourstop].get_tourStopThumbnailFilename();
    } else {
      return null;
    }
  },

  get_id: function () {
    return this._id;
  },

  set_id: function (value) {
    this._id = value;
    return value;
  },

  get_title: function () {
    return this._title;
  },

  set_title: function (value) {
    this._title = value;
    this.set_tourDirty(true);
    return value;
  },

  get_runTime: function () {
    if (!this._runTime || this._lastDirtyCheck !== this._tourDirty) {
      this._runTime = this._calculateRunTime();
      this._lastDirtyCheck = this._tourDirty;
    }
    return this._runTime;
  },

  get_description: function () {
    return this._description;
  },

  set_description: function (value) {
    this._description = value;
    this.set_tourDirty(true);
    return value;
  },

  get_attributesAndCredits: function () {
    return this._attributesAndCredits;
  },

  set_attributesAndCredits: function (value) {
    this._attributesAndCredits = value;
    this.set_tourDirty(true);
    return value;
  },

  get_authorEmailOther: function () {
    return this._authorEmailOther;
  },

  set_authorEmailOther: function (value) {
    this._authorEmailOther = value;
    this.set_tourDirty(true);
    return value;
  },

  get_authorEmail: function () {
    return this._authorEmail;
  },

  set_authorEmail: function (value) {
    this._authorEmail = value;
    this.set_tourDirty(true);
    return value;
  },

  get_authorUrl: function () {
    return this._authorUrl;
  },

  set_authorUrl: function (value) {
    this._authorUrl = value;
    this.set_tourDirty(true);
    return value;
  },

  get_authorPhone: function () {
    return this._authorPhone;
  },

  set_authorPhone: function (value) {
    this._authorPhone = value;
    this.set_tourDirty(true);
    return value;
  },

  get_authorContactText: function () {
    return this._authorContactText;
  },

  set_authorContactText: function (value) {
    this._authorContactText = value;
    this.set_tourDirty(true);
    return value;
  },

  get_orgName: function () {
    return this._orgName;
  },

  set_orgName: function (value) {
    this._orgName = value;
    this.set_tourDirty(true);
    return value;
  },

  get_orgUrl: function () {
    return this._orgUrl;
  },

  set_orgUrl: function (value) {
    this._orgUrl = value;
    this.set_tourDirty(true);
    return value;
  },

  get_author: function () {
    return this._author;
  },

  set_author: function (value) {
    this._author = value;
    this.set_tourDirty(true);
    return value;
  },

  get_authorImageUrl: function () {
    return this._authorImageUrl;
  },

  set_authorImageUrl: function (value) {
    this._authorImageUrl = value;
    this.set_tourDirty(true);
    return value;
  },

  get_authorImage: function () {
    return this._authorImage;
  },

  set_authorImage: function (value) {
    this._authorImage = value;
    this.set_tourDirty(true);
    return value;
  },

  get_organizationUrl: function () {
    return this._organizationUrl;
  },

  set_organizationUrl: function (value) {
    this._organizationUrl = value;
    this.set_tourDirty(true);
    return value;
  },

  get_fileName: function () {
    return this._filename;
  },

  set_fileName: function (value) {
    this._filename = value;
    return value;
  },

  get_level: function () {
    return this._level;
  },

  set_level: function (value) {
    this._level = value;
    this.set_tourDirty(true);
    return value;
  },

  get_type: function () {
    return this._type;
  },

  set_type: function (value) {
    this._type = value;
    this.set_tourDirty(true);
    return value;
  },

  get_taxonomy: function () {
    return this._taxonomy;
  },

  set_taxonomy: function (value) {
    this._taxonomy = value;
    this.set_tourDirty(true);
    return value;
  },

  get_keywords: function () {
    return this._keywords;
  },

  set_keywords: function (value) {
    this._keywords = value;
    this.set_tourDirty(true);
    return value;
  },

  get_objects: function () {
    return this._objects;
  },

  set_objects: function (value) {
    this._objects = value;
    this.set_tourDirty(true);
    return value;
  },

  get_editMode: function () {
    return this._editMode;
  },

  set_editMode: function (value) {
    this._editMode = value;
    return value;
  },

  get_tourStops: function () {
    return this._tourStops;
  },

  set_tourStops: function (value) {
    this._tourStops = value;
    return value;
  },

  get_currentTourstopIndex: function () {
    return this._currentTourstopIndex;
  },

  set_currentTourstopIndex: function (value) {
    this._currentTourstopIndex = value;
    return value;
  },

  addTourStop: function (ts) {
    ts.set_owner(this);
    this.get_tourStops().push(ts);
    this._currentTourstopIndex = this._tourStops.length - 1;
    this.set_tourDirty(true);
  },

  insertTourStop: function (ts) {
    ts.set_owner(this);
    if (this._currentTourstopIndex > -1) {
      this.get_tourStops().splice(this._currentTourstopIndex, 0, ts);
    } else {
      this.get_tourStops().push(ts);
      this._currentTourstopIndex = this._tourStops.length - 1;
    }
    this.set_tourDirty(true);
  },

  insertAfterTourStop: function (ts) {
    ts.set_owner(this);
    if (this._currentTourstopIndex > -1 || this._currentTourstopIndex < this.get_tourStops().length) {
      this.get_tourStops().splice(this._currentTourstopIndex + 1, 0, ts);
    } else {
      this.get_tourStops().push(ts);
      this._currentTourstopIndex = this._tourStops.length - 1;
    }
    this.set_tourDirty(true);
  },

  removeTourStop: function (ts) {
    ss.remove(this._tourStops, ts);
    if (this._currentTourstopIndex > this._tourStops.length - 1) {
      this._currentTourstopIndex--;
    }
    this.set_tourDirty(true);
  },

  _calculateRunTime: function () {
    var totalTime = 0;
    for (var i = 0; i < this._tourStops.length; i++) {
      totalTime += this._tourStops[i].get_duration();
      if (i > 0) {
        switch (this._tourStops[i].get__transition()) {
          case 0:
            if (this._tourStops[i].get_target().get_backgroundImageset() == null || (this._tourStops[i - 1].get_target().get_backgroundImageset().get_dataSetType() === this._tourStops[i].get_target().get_backgroundImageset().get_dataSetType() && ((this._tourStops[i - 1].get_target().get_backgroundImageset().get_dataSetType() != ImageSetType.solarSystem) || (this._tourStops[i - 1].get_target().get_target() === this._tourStops[i].get_target().get_target())))) {
              var start = (this._tourStops[i - 1].get_endTarget() == null) ? this._tourStops[i - 1].get_target().get_camParams() : this._tourStops[i - 1].get_endTarget().get_camParams();
              var slew = ViewMoverSlew.create(start, this._tourStops[i].get_target().get_camParams());
              totalTime += slew.get_moveTime() * 1000;
            }
            break;
          case 2:
            break;
          case 1:
            break;
          case 5:
            break;
          default:
            break;
        }
      }
    }
    return ss.truncate(totalTime);
  },

  elapsedTimeTillTourstop: function (index) {
    if (!index && index >= this._tourStops.length) {
      return 0;
    }
    var totalTime = 0;
    for (var i = 0; i < index; i++) {
      totalTime += this._tourStops[i].get_duration();
      if (i > 0) {
        switch (this._tourStops[i].get__transition()) {
          case 0:
            var start = (this._tourStops[i - 1].get_endTarget() == null) ? this._tourStops[i - 1].get_target().get_camParams() : this._tourStops[i - 1].get_endTarget().get_camParams();
            if (this._tourStops[i - 1].get_target().get_backgroundImageset().get_dataSetType() === this._tourStops[i].get_target().get_backgroundImageset().get_dataSetType() && ((this._tourStops[i - 1].get_target().get_backgroundImageset().get_dataSetType() != ImageSetType.solarSystem) || (this._tourStops[i - 1].get_target().get_target() === this._tourStops[i].get_target().get_target()))) {
              var slew = ViewMoverSlew.create(start, this._tourStops[i].get_target().get_camParams());
              totalTime += slew.get_moveTime() * 1000;
            }
            break;
          case 2:
            break;
          case 1:
            break;
          case 5:
            break;
          default:
            break;
        }
      }
    }
    return totalTime / 1000;
  },

  elapsedTimeSinceLastMaster: function (index) {
    var masterOut = null;
    if (!index && index >= this._tourStops.length) {
      return null;
    }
    var totalTime = 0;
    for (var i = 0; i < index; i++) {
      if (this._tourStops[i].get_masterSlide()) {
        totalTime = 0;
        masterOut = this._tourStops[i];
      }
      totalTime += this._tourStops[i].get_duration();
      if (i > 0) {
        switch (this._tourStops[i].get__transition()) {
          case 0:
            var start = (this._tourStops[i - 1].get_endTarget() == null) ? this._tourStops[i - 1].get_target().get_camParams() : this._tourStops[i - 1].get_endTarget().get_camParams();
            if (this._tourStops[i - 1].get_target().get_backgroundImageset().get_dataSetType() === this._tourStops[i].get_target().get_backgroundImageset().get_dataSetType() && ((this._tourStops[i - 1].get_target().get_backgroundImageset().get_dataSetType() != ImageSetType.solarSystem) || (this._tourStops[i - 1].get_target().get_target() === this._tourStops[i].get_target().get_target()))) {
              var slew = ViewMoverSlew.create(start, this._tourStops[i].get_target().get_camParams());
              totalTime += slew.get_moveTime() * 1000;
            }
            break;
          case 2:
            break;
          case 1:
            break;
          case 5:
            break;
          default:
            break;
        }
      }
    }
    return new MasterTime(masterOut, totalTime / 1000);
  },

  getMasterSlideForIndex: function (index) {
    var master = -1;
    for (var i = 0; i < index; i++) {
      if (this._tourStops[i].get_masterSlide()) {
        master = i;
      }
    }
    if (master === -1) {
      return null;
    }
    return this._tourStops[master];
  },

  getTourStopIndexByID: function (id) {
    if (!id || id === 'Next') {
      return this._currentTourstopIndex++;
    }
    var index = 0;
    var $enum1 = ss.enumerate(this._tourStops);
    while ($enum1.moveNext()) {
      var stop = $enum1.current;
      if (stop.get_id() === id) {
        return index;
      }
      index++;
    }
    return -1;
  },

  cleanUp: function () { },

  getCachedTexture: function (filename, callMe) {
    if (this._textureList == null) {
      this._textureList = {};
    }
    if (ss.keyExists(this._textureList, filename)) {
      callMe();
      return this._textureList[filename];
    }
    var url = this.getFileStream(filename);
    if (!ss.whitespace(url)) {
      var texture = document.createElement('img');
      texture.src = this.getFileStream(filename);
      texture.addEventListener('load', function () {
        callMe();
      }, false);
      this._textureList[filename] = texture;
      return texture;
    } else {
      return null;
    }
  },

  getCachedTexture2d: function (filename) {
    if (this._textureList2d == null) {
      this._textureList2d = {};
    }
    if (ss.keyExists(this._textureList2d, filename)) {
      return this._textureList2d[filename];
    }
    var texture = new Texture();
    texture.load(this.getFileStream(filename));
    this._textureList2d[filename] = texture;
    return texture;
  },

  addCachedFile: function (filename, file) {
    this._fileCache[filename] = file;
    if (ss.keyExists(this._textureList2d, filename)) {
      delete this._textureList2d[filename];
    }
    if (ss.keyExists(this._textureList, filename)) {
      delete this._textureList[filename];
    }
  },

  getFileStream: function (filename) {
    var blob = this.getFileBlob(filename);
    if (blob == null) {
      return null;
    }
    return URL.createObjectURL(blob);
  },

  getFileBlob: function (filename) {
    if (ss.keyExists(this._fileCache, filename)) {
      return this._fileCache[filename];
    } else if (this._cabinet != null) {
      return this._cabinet.getFileBlob(this.get_workingDirectory() + filename);
    } else {
      return null;
    }
  },

  get_currentTourStop: function () {
    if (this._currentTourstopIndex > -1) {
      return this.get_tourStops()[this._currentTourstopIndex];
    } else {
      return null;
    }
  },

  set_currentTourStop: function (value) {
    var i = 0;
    var $enum1 = ss.enumerate(this.get_tourStops());
    while ($enum1.moveNext()) {
      var stop = $enum1.current;
      if (stop === value) {
        if (this._currentTourstopIndex > -1) {
        }
        this._currentTourstopIndex = i;
        break;
      }
      i++;
    }
    return value;
  },

  clearTempFiles: function () { }
};

registerType("TourDocument", [TourDocument, TourDocument$, null]);

// wwtlib.TourEditTab

export function TourEditTab() {
  this.musicTrack = new SoundEditor();
  this.voiceTrack = new SoundEditor();
  this._tour = null;
  this.tourStopList = new TourStopList();
  this.tourEditorUI = new TourEditor();
  this._contextMenu = new ContextMenuStrip();
  this.nextSlideCallback = null;
  this.playing = false;
  this._player = null;
  this._defultColor = Colors.get_white();
}

var TourEditTab$ = {
  setUiStrings: function () { },

  get_tour: function () {
    return this._tour;
  },

  set_tour: function (value) {
    this._tour = value;
    this.tourEditorUI.set_tour(this._tour);
    this.tourStopList.tour = this._tour;
    Overlay.defaultAnchor = 1;
    if (this._tour.get_tourStops().length > 0) {
      globalWWTControl.gotoTarget(this._tour.get_tourStops()[0].get_target(), false, true, false);
      this._tour.set_currentTourstopIndex(0);
      this.tourStopList.selectedItem = this._tour.get_currentTourstopIndex();
      this.musicTrack.target = this._tour.get_currentTourStop();
      this.voiceTrack.target = this._tour.get_currentTourStop();
      LayerManager.setVisibleLayerList(this._tour.get_currentTourStop().layers);
    }
    this.setEditMode(this._tour.get_editMode());
    return value;
  },

  tour_CurrentTourstopChanged: function () {
    OverlayList._updateOverlayList(this._tour.get_currentTourStop(), this.tourEditorUI.selection);
    if (this.tourEditorUI != null) {
      this.tourEditorUI.clearSelection();
    }
    this.tourStopList.refresh();
  },

  setFocusedChild: function () { },

  selectCurrent: function () {
    this.tourStopList.selectedItem = this._tour.get_currentTourstopIndex();
    this.tourStopList.refresh();
  },

  tourEdit_Load: function (sender, e) { },

  playNow: function (fromStart) {
    this.playing = true;
    if (this.get_tour().get_editMode() || fromStart) {
      this.get_tour().set_currentTourstopIndex(-1);
    }
    this.setPlayPauseMode();
  },

  _tourPlayer_TourEnded: function (sender, e) { },

  _endTour_CloseTour: function (sender, e) { },

  _endTour_LaunchTour: function (sender, e) {
    this.playNow(true);
  },

  setEditMode: function (visible) { },

  tourStopList_ItemClicked: function (sender, e) {
    if (this._tour.get_currentTourStop() !== e) {
      this._tour.set_currentTourStop(e);
      if (e != null) {
        this.musicTrack.target = this._tour.get_currentTourStop();
        this.voiceTrack.target = this._tour.get_currentTourStop();
      }
      else {
        this.musicTrack.target = null;
        this.voiceTrack.target = null;
      }
      this.tourEditorUI.clearSelection();
    }
    if (this.playing) {
      this._playFromHere_Click(sender, new ss.EventArgs());
    }
  },

  tourStopList_ItemDoubleClicked: function (sender, e) {
    this.showSlideStartPosition(e);
  },

  showSlideStartPosition: function (ts) {
    this._tour.set_currentTourStop(ts);
    if (ts != null) {
      this.musicTrack.target = this._tour.get_currentTourStop();
      this.voiceTrack.target = this._tour.get_currentTourStop();
    } else {
      this.musicTrack.target = null;
      this.voiceTrack.target = null;
    }
    this.tourEditorUI.clearSelection();
    if (this._tour.get_currentTourStop() != null) {
      this._tour.get_currentTourStop().syncSettings();
      SpaceTimeController.set_now(this._tour.get_currentTourStop().get_startTime());
      SpaceTimeController.set_syncToClock(false);
      globalWWTControl.gotoTarget(ts.get_target(), false, true, false);
      this._tour.get_currentTourStop().set_tweenPosition(0);
      this._tour.get_currentTourStop()._updateLayerOpacity();
      LayerManager.setVisibleLayerList(this._tour.get_currentTourStop().layers);
    }
  },

  tourStopList_MouseClick: function (sender, e) {
    if (!this._tour.get_editMode()) {
    }
    if (this.tourStopList.multipleSelection) {
      if (this._contextMenu != null) {
        this._contextMenu._dispose();
      }
      this._contextMenu = new ContextMenuStrip();
      var selectAllMenu = ToolStripMenuItem.create(Language.getLocalizedText(1345, 'Select All'));
      var cutMenu = ToolStripMenuItem.create(Language.getLocalizedText(427, 'Cut'));
      var copyMenu = ToolStripMenuItem.create(Language.getLocalizedText(428, 'Copy'));
      var pasteMenu = ToolStripMenuItem.create(Language.getLocalizedText(429, 'Paste'));
      var deleteMenu = ToolStripMenuItem.create(Language.getLocalizedText(167, 'Delete'));
      cutMenu.click = ss.bind('_cutMenu_Click', this);
      copyMenu.click = ss.bind('_copyMenu_Click', this);
      pasteMenu.click = ss.bind('_pasteMenu_Click', this);
      deleteMenu.click = ss.bind('_deleteMenu_Click', this);
      selectAllMenu.click = ss.bind('_selectAllMenu_Click', this);
      var sep1 = new ToolStripSeparator();
      this._contextMenu.items.push(selectAllMenu);
      this._contextMenu.items.push(sep1);
      this._contextMenu.items.push(cutMenu);
      this._contextMenu.items.push(copyMenu);
      pasteMenu.enabled = this.tourEditorUI.clipboardType === 'WorldWideTelescope.Slide';
      this._contextMenu.items.push(pasteMenu);
      this._contextMenu.items.push(deleteMenu);
      this._contextMenu._show(Cursor.get_position());
    } else if (this._tour.get_currentTourStop() == null) {
      if (this._contextMenu != null) {
        this._contextMenu._dispose();
      }
      this._contextMenu = new ContextMenuStrip();
      var selectAllMenu = ToolStripMenuItem.create(Language.getLocalizedText(1345, 'Select All'));
      var pasteMenu = ToolStripMenuItem.create(Language.getLocalizedText(425, 'Paste'));
      var sep1 = new ToolStripSeparator();
      var sep2 = new ToolStripSeparator();
      var insertSlide = ToolStripMenuItem.create(Language.getLocalizedText(426, 'Add New Slide'));
      pasteMenu.click = ss.bind('_pasteMenu_Click', this);
      selectAllMenu.click = ss.bind('_selectAllMenu_Click', this);
      insertSlide.click = ss.bind('_addNewSlide_Click', this);
      pasteMenu.enabled = this.tourEditorUI.clipboardType === 'WorldWideTelescope.Slide';
      this._contextMenu.items.push(selectAllMenu);
      this._contextMenu.items.push(sep1);
      this._contextMenu.items.push(pasteMenu);
      this._contextMenu.items.push(sep2);
      this._contextMenu.items.push(insertSlide);
      this._contextMenu._show(Cursor.get_position());
    } else {
      if (this._contextMenu != null) {
        this._contextMenu._dispose();
      }
      this._contextMenu = new ContextMenuStrip();
      var selectAllMenu = ToolStripMenuItem.create(Language.getLocalizedText(1345, 'Select All'));
      var cutMenu = ToolStripMenuItem.create(Language.getLocalizedText(427, 'Cut'));
      var copyMenu = ToolStripMenuItem.create(Language.getLocalizedText(428, 'Copy'));
      var pasteMenu = ToolStripMenuItem.create(Language.getLocalizedText(429, 'Paste'));
      var deleteMenu = ToolStripMenuItem.create(Language.getLocalizedText(167, 'Delete'));
      var sep1 = new ToolStripSeparator();
      var sep3 = new ToolStripSeparator();
      var sep4 = new ToolStripSeparator();
      var sep5 = new ToolStripSeparator();
      var sep6 = new ToolStripSeparator();
      var sep7 = new ToolStripSeparator();
      var insertSlide = ToolStripMenuItem.create(Language.getLocalizedText(431, 'Insert New Slide'));
      var insertDuplicate = ToolStripMenuItem.create(Language.getLocalizedText(627, 'Duplicate Slide at End Position'));
      var insertSlideshow = ToolStripMenuItem.create(Language.getLocalizedText(628, 'Merge Tour after slide...'));
      var playFromHere = ToolStripMenuItem.create(Language.getLocalizedText(432, 'Preview Tour From Here'));
      var sep2 = new ToolStripSeparator();
      var captureThumbnail = ToolStripMenuItem.create(Language.getLocalizedText(433, 'Capture New Thumbnail'));
      var setSkyPosition = ToolStripMenuItem.create(Language.getLocalizedText(434, 'Set Start Camera Position'));
      var setEndSkyPosition = ToolStripMenuItem.create(Language.getLocalizedText(435, 'Set End Camera Position'));
      var showSkyPosition = ToolStripMenuItem.create(Language.getLocalizedText(436, 'Show Start Camera Position'));
      var showEndSkyPosition = ToolStripMenuItem.create(Language.getLocalizedText(437, 'Show End Camera Position'));
      var masterSlide = ToolStripMenuItem.create(Language.getLocalizedText(438, 'Master Slide'));
      var makeTimeline = ToolStripMenuItem.create(Language.getLocalizedText(1346, 'Create Timeline'));
      var showTimeline = ToolStripMenuItem.create(Language.getLocalizedText(1347, 'Show Timeline'));
      var linkString = this._tour.get_currentTourStop().get_nextSlide();
      switch (linkString) {
        case '':
        case null:
        case 'Next':
          linkString = ' (' + Language.getLocalizedText(610, 'Next Slide') + ')';
          break;
        case 'Return':
          linkString = ' (' + Language.getLocalizedText(602, 'Return to Caller') + ')';
          break;
        default:
          var index = this.get_tour().getTourStopIndexByID(linkString);
          if (index > -1) {
            if (ss.emptyString(this._tour.get_tourStops()[index].get_description())) {
              linkString = ss.format(' (Slide {0})', index);
            }
            else {
              linkString = ' (' + this._tour.get_tourStops()[index].get_description() + ')';
            }
          }
          break;
      }
      var setNextSlide = ToolStripMenuItem.create(Language.getLocalizedText(590, 'Set Next Slide') + linkString);
      var trackSpaceTime = ToolStripMenuItem.create(Language.getLocalizedText(439, 'Track Date/Time/Location'));
      var fadeInOverlays = ToolStripMenuItem.create(Language.getLocalizedText(629, 'Fade In Slide Elements'));
      var properties = ToolStripMenuItem.create(Language.getLocalizedText(20, 'Properties'));
      var interpolation = ToolStripMenuItem.create(Language.getLocalizedText(1029, 'Animation Tween Type'));
      var Linear = ToolStripMenuItem.create(Language.getLocalizedText(1030, 'Linear'));
      var Ease = ToolStripMenuItem.create(Language.getLocalizedText(1031, 'Ease In/Out'));
      var EaseIn = ToolStripMenuItem.create(Language.getLocalizedText(1032, 'Ease In'));
      var EaseOut = ToolStripMenuItem.create(Language.getLocalizedText(1033, 'Ease Out'));
      var Exponential = ToolStripMenuItem.create(Language.getLocalizedText(1034, 'Exponential'));
      Linear.tag = 0;
      Ease.tag = 3;
      EaseIn.tag = 1;
      EaseOut.tag = 2;
      Exponential.tag = 4;
      Linear.click = ss.bind('_interpolation_Click', this);
      Ease.click = ss.bind('_interpolation_Click', this);
      EaseIn.click = ss.bind('_interpolation_Click', this);
      EaseOut.click = ss.bind('_interpolation_Click', this);
      Exponential.click = ss.bind('_interpolation_Click', this);
      switch (this._tour.get_currentTourStop().get_interpolationType()) {
        case 0:
          Linear.checked = true;
          break;
        case 1:
          EaseIn.checked = true;
          break;
        case 2:
          EaseOut.checked = true;
          break;
        case 3:
          Ease.checked = true;
          break;
        case 4:
          Exponential.checked = true;
          break;
        default:
          break;
      }
      interpolation.dropDownItems.push(Linear);
      interpolation.dropDownItems.push(Ease);
      interpolation.dropDownItems.push(EaseIn);
      interpolation.dropDownItems.push(EaseOut);
      interpolation.dropDownItems.push(Exponential);
      selectAllMenu.click = ss.bind('_selectAllMenu_Click', this);
      insertDuplicate.click = ss.bind('_insertDuplicate_Click', this);
      cutMenu.click = ss.bind('_cutMenu_Click', this);
      copyMenu.click = ss.bind('_copyMenu_Click', this);
      pasteMenu.click = ss.bind('_pasteMenu_Click', this);
      deleteMenu.click = ss.bind('_deleteMenu_Click', this);
      insertSlide.click = ss.bind('_insertNewSlide_Click', this);
      properties.click = ss.bind('_properties_Click', this);
      captureThumbnail.click = ss.bind('_captureThumbnail_Click', this);
      setSkyPosition.click = ss.bind('_setSkyPosition_Click', this);
      setEndSkyPosition.click = ss.bind('_setEndSkyPosition_Click', this);
      showEndSkyPosition.click = ss.bind('_showEndSkyPosition_Click', this);
      showSkyPosition.click = ss.bind('_showSkyPosition_Click', this);
      playFromHere.click = ss.bind('_playFromHere_Click', this);
      masterSlide.click = ss.bind('_masterSlide_Click', this);
      setNextSlide.click = ss.bind('_setNextSlide_Click', this);
      trackSpaceTime.click = ss.bind('_trackSpaceTime_Click', this);
      insertSlideshow.click = ss.bind('_insertSlideshow_Click', this);
      fadeInOverlays.click = ss.bind('_fadeInOverlays_Click', this);
      if (this._tour.get_currentTourStop().get_masterSlide()) {
        masterSlide.checked = true;
      }
      if (this._tour.get_currentTourStop().get_hasTime()) {
        trackSpaceTime.checked = true;
      }
      fadeInOverlays.checked = this._tour.get_currentTourStop().get_fadeInOverlays();
      this._contextMenu.items.push(selectAllMenu);
      this._contextMenu.items.push(sep7);
      this._contextMenu.items.push(cutMenu);
      this._contextMenu.items.push(copyMenu);
      pasteMenu.enabled = this.tourEditorUI.clipboardType === 'WorldWideTelescope.Slide';
      this._contextMenu.items.push(pasteMenu);
      this._contextMenu.items.push(deleteMenu);
      this._contextMenu.items.push(sep1);
      this._contextMenu.items.push(insertSlide);
      this._contextMenu.items.push(insertDuplicate);
      this._contextMenu.items.push(insertSlideshow);
      this._contextMenu.items.push(sep2);
      this._contextMenu.items.push(playFromHere);
      this._contextMenu.items.push(sep3);
      this._contextMenu.items.push(setSkyPosition);
      this._contextMenu.items.push(setEndSkyPosition);
      this._contextMenu.items.push(sep4);
      this._contextMenu.items.push(showSkyPosition);
      this._contextMenu.items.push(showEndSkyPosition);
      this._contextMenu.items.push(sep5);
      this._contextMenu.items.push(captureThumbnail);
      this._contextMenu.items.push(sep6);
      this._contextMenu.items.push(masterSlide);
      this._contextMenu.items.push(setNextSlide);
      this._contextMenu.items.push(fadeInOverlays);
      this._contextMenu.items.push(trackSpaceTime);
      this._contextMenu.items.push(interpolation);
      this._contextMenu._show(Vector2d.create(e.clientX, e.clientY));
    }
  },

  _selectAllMenu_Click: function (sender, e) {
    this.tourStopList.selectAll();
  },

  _interpolation_Click: function (sender, e) {
    var item = sender;
    this._tour.get_currentTourStop().set_interpolationType(item.tag);
  },

  _nextSlideChosen: function () {
    if (this._selectDialog.get_OK()) {
      this._tour.get_currentTourStop().set_nextSlide(this._selectDialog.get_id());
    }
  },

  _setNextSlide_Click: function (sender, e) {
    this._selectDialog = new SelectLink(null);
    this.nextSlideCallback(this._selectDialog, ss.bind('_nextSlideChosen', this));
  },

  _insertDuplicate_Click: function (sender, e) {
    Undo.push(new UndoTourSlidelistChange(Language.getLocalizedText(530, 'Duplicate Slide at End Position'), this._tour));
    var ts = this._tour.get_currentTourStop().copy();
    if (ts == null) {
      return;
    }
    if (ts.get_endTarget() != null) {
      ts.get_endTarget().set_backgroundImageset(ts.get_target().get_backgroundImageset());
      ts.get_endTarget().set_studyImageset(ts.get_target().get_studyImageset());
      ts.set_target(ts.get_endTarget());
      ts.set_startTime(ts.get_endTime());
      ts.set_endTarget(null);
    }
    var $enum1 = ss.enumerate(ts.get_overlays());
    while ($enum1.moveNext()) {
      var overlay = $enum1.current;
      overlay.set_tweenFactor(1);
      overlay.set_animate(!overlay.get_animate());
      overlay.set_animate(!overlay.get_animate());
    }
    ts.set_tweenPosition(0);
    ts.set_fadeInOverlays(false);
    this._tour.insertAfterTourStop(ts);
    this.tourStopList.refresh();
  },

  _fadeInOverlays_Click: function (sender, e) {
    this._tour.get_currentTourStop().set_fadeInOverlays(!this._tour.get_currentTourStop().get_fadeInOverlays());
  },

  _insertSlideshow_Click: function (sender, e) { },

  _trackSpaceTime_Click: function (sender, e) {
    Undo.push(new UndoTourStopChange(Language.getLocalizedText(532, 'Track Time Edit'), this._tour));
    this._tour.get_currentTourStop().set_hasTime(!this._tour.get_currentTourStop().get_hasTime());
  },

  _masterSlide_Click: function (sender, e) {
    Undo.push(new UndoTourStopChange(Language.getLocalizedText(533, 'Master Slide State Edit'), this._tour));
    this._tour.get_currentTourStop().set_masterSlide(!this._tour.get_currentTourStop().get_masterSlide());
    this.tourStopList.refresh();
  },

  _playFromHere_Click: function (sender, e) {
    this.playFromCurrentTourstop();
  },

  playFromCurrentTourstop: function () {
    this.playing = true;
    globalWWTControl.gotoTarget(this._tour.get_currentTourStop().get_target(), false, true, false);
    SpaceTimeController.set_now(this._tour.get_currentTourStop().get_startTime());
    SpaceTimeController.set_syncToClock(false);
    this.setPlayPauseMode();
  },

  playFromTourstop: function (ts) {
    this._tour.set_currentTourStop(ts);
    this.playFromCurrentTourstop();
  },

  _showSkyPosition_Click: function (sender, e) {
    if (this._tour.get_currentTourStop() != null) {
      globalWWTControl.gotoTarget(this._tour.get_currentTourStop().get_target(), false, true, false);
      this._tour.get_currentTourStop().syncSettings();
      SpaceTimeController.set_now(this._tour.get_currentTourStop().get_startTime());
      SpaceTimeController.set_syncToClock(false);
      this._tour.get_currentTourStop().set_tweenPosition(0);
      LayerManager.setVisibleLayerList(this._tour.get_currentTourStop().layers);
      this.tourStopList.refresh();
    }
  },

  _showEndSkyPosition_Click: function (sender, e) {
    this._tour.get_currentTourStop().set_tweenPosition(1);
    this._tour.get_currentTourStop()._updateLayerOpacity();
    if (this._tour.get_currentTourStop() != null && this._tour.get_currentTourStop().get_endTarget() != null) {
      globalWWTControl.gotoTargetFull(false, true, this._tour.get_currentTourStop().get_endTarget().get_camParams(), this._tour.get_currentTourStop().get_target().get_studyImageset(), this._tour.get_currentTourStop().get_target().get_backgroundImageset());
      globalRenderContext.set_solarSystemTrack(this._tour.get_currentTourStop().get_endTarget().get_target());
      SpaceTimeController.set_now(this._tour.get_currentTourStop().get_endTime());
      this._tour.get_currentTourStop().syncSettings();
      LayerManager.setVisibleLayerList(this._tour.get_currentTourStop().layers);
      SpaceTimeController.set_syncToClock(false);
      this.tourStopList.refresh();
      this.tourEditorUI.clearSelection();
    }
  },

  _setEndSkyPosition_Click: function (sender, e) {
    if (this._tour.get_currentTourStop() != null) {
      Undo.push(new UndoTourStopChange(Language.getLocalizedText(435, 'Set End Camera Position'), this._tour));
      var newPlace = Place.createCameraParams('End Place', globalRenderContext.viewCamera.copy(), 268435456, globalWWTControl.constellation, globalRenderContext.get_backgroundImageset().get_dataSetType(), globalRenderContext.get_solarSystemTrack());
      this._tour.get_currentTourStop().set_endTarget(newPlace);
      this._tour.get_currentTourStop().get_endTarget().set_constellation(globalWWTControl.constellation);
      this._tour.get_currentTourStop().set_endTime(SpaceTimeController.get_now());
      this._tour.get_currentTourStop().set_tweenPosition(1);
      var $enum1 = ss.enumerate(ss.keys(this._tour.get_currentTourStop().layers));
      while ($enum1.moveNext()) {
        var key = $enum1.current;
        var info = this._tour.get_currentTourStop().layers[key];
        if (ss.keyExists(LayerManager.get_layerList(), info.id)) {
          info.endOpacity = LayerManager.get_layerList()[info.id].get_opacity();
          info.endParams = LayerManager.get_layerList()[info.id].getParams();
        }
      }
      this._tour.get_currentTourStop()._updateLayerOpacity();
      this.tourStopList.refresh();
      TimeLine.refreshUi();
      this.tourEditorUI.clearSelection();
    }
  },

  _setSkyPosition_Click: function (sender, e) {
    if (this._tour.get_currentTourStop() != null) {
      Undo.push(new UndoTourStopChange(Language.getLocalizedText(434, 'Set Start Camera Position'), this._tour));
      this._tour.get_currentTourStop().get_target().set_target(globalRenderContext.get_solarSystemTrack());
      this._tour.get_currentTourStop().get_target().set_type(globalRenderContext.get_backgroundImageset().get_dataSetType());
      this._tour.get_currentTourStop().get_target().set_camParams(globalRenderContext.viewCamera.copy());
      this._tour.get_currentTourStop().get_target().set_constellation(globalWWTControl.constellation);
      this._tour.get_currentTourStop().get_target().set_studyImageset(globalRenderContext.get_foregroundImageset());
      this._tour.get_currentTourStop().get_target().set_type(globalRenderContext.get_backgroundImageset().get_dataSetType());
      this._tour.get_currentTourStop().get_target().set_backgroundImageset(globalRenderContext.get_backgroundImageset().get_stockImageSet());
      this._tour.get_currentTourStop().captureSettings();
      this._tour.get_currentTourStop().layers = LayerManager._getVisibleLayerList(this._tour.get_currentTourStop().layers);
      this._tour.get_currentTourStop().set_tweenPosition(0);
      this.tourStopList.refresh();
      TimeLine.refreshUi();
      this.tourEditorUI.clearSelection();
    }
  },

  _captureThumbnail_Click: function (sender, e) {
    if (this._tour.get_currentTourStop() != null) {
      this._captureThumbnail(this._tour.get_currentTourStop());
    }
  },

  _captureThumbnail: function (tourStop) {
    var $this = this;

    globalWWTControl.captureThumbnail(function (blob) {
      var filename = ss.format('{0}.thumb.png', tourStop.get_id());
      $this._tour.addCachedFile(filename, blob);
      tourStop.set_thumbnail($this._tour.getCachedTexture(filename, function () {
        $this.tourStopList.refresh();
      }));
    });
  },

  _properties_Click: function (sender, e) {
    throw new Error('The method or operation is not implemented.');
  },

  tourStopList_AddNewSlide: function (sender, e) {
    this.addSlide(false);
    this.tourStopList.ensureAddVisible();
  },

  _addNewSlide_Click: function (sender, e) {
    this.addSlide(false);
    this.tourStopList.ensureAddVisible();
  },

  _insertNewSlide_Click: function (sender, e) {
    this.addSlide(true);
  },

  addSlide: function (insert) {
    Undo.push(new UndoTourSlidelistChange(Language.getLocalizedText(426, 'Add New Slide'), this._tour));
    Cursor.set_current(Cursors.get_waitCursor());
    var placeName = 'Current Screen';
    var newPlace = Place.createCameraParams(placeName, globalRenderContext.viewCamera.copy(), 268435456, globalWWTControl.constellation, globalRenderContext.get_backgroundImageset().get_dataSetType(), globalRenderContext.get_solarSystemTrack());
    newPlace.set_studyImageset(globalRenderContext.get_foregroundImageset());
    newPlace.set_backgroundImageset(globalRenderContext.get_backgroundImageset().get_stockImageSet());
    var newTourStop = TourStop.create(newPlace);
    if (insert) {
      this._tour.insertTourStop(newTourStop);
    } else {
      this._tour.addTourStop(newTourStop);
    }
    if (this._tour.get_currentTourStop() != null) {
      this.musicTrack.target = this._tour.get_currentTourStop();
      this.voiceTrack.target = this._tour.get_currentTourStop();
    } else {
      this.musicTrack.target = null;
      this.voiceTrack.target = null;
    }
    this._tour.get_currentTourStop().layers = LayerManager._getVisibleLayerList(this._tour.get_currentTourStop().layers);
    this._captureThumbnail(newTourStop);
    this.tourStopList.selectedItem = this.tourStopList.findItem(newTourStop);
    this.tourStopList.refresh();
    this.tourEditorUI.clearSelection();
    Cursor.set_current(Cursors.get_defaultV());
    TimeLine.refreshUi();
  },

  _deleteMenu_Click: function (sender, e) {
    Undo.push(new UndoTourSlidelistChange(Language.getLocalizedText(534, 'Delete Slide'), this._tour));
    var $enum1 = ss.enumerate(ss.keys(this.tourStopList.selectedItems));
    while ($enum1.moveNext()) {
      var key = $enum1.current;
      var item = this.tourStopList.selectedItems[key];
      this._tour.removeTourStop(item);
    }
    ss.clearKeys(this.tourStopList.selectedItems);
    this.tourStopList.selectedItem = -1;
    this._tour.set_currentTourStop(null);
    this.musicTrack.target = null;
    this.voiceTrack.target = null;
    this.tourStopList.refresh();
    this.tourEditorUI.clearSelection();
  },

  _pasteMenu_Click: function (sender, e) {
    if (this.tourEditorUI.clipboardType === 'WorldWideTelescope.Slide') {
      Undo.push(new UndoTourSlidelistChange(Language.getLocalizedText(535, 'Paste Slide'), this._tour));
      var xParser = new DOMParser();
      var doc = xParser.parseFromString(this.tourEditorUI.clipboardData, 'text/xml');
      var node = Util.selectSingleNode(doc, 'TourStops');
      var pasteStack = new ss.Stack();
      var $enum1 = ss.enumerate(node.childNodes);
      while ($enum1.moveNext()) {
        var child = $enum1.current;
        if (child.nodeName === 'TourStop') {
          var ts = TourStop._fromXml(this._tour, child);
          ts.set_id(Guid.newGuid().toString());
          pasteStack.push(ts);
        }
      }
      ss.clearKeys(this.tourStopList.selectedItems);
      var curIndex = this.tourStopList.selectedItem + pasteStack.count - 1;
      while (pasteStack.count > 0) {
        var ts = pasteStack.pop();
        this._tour.insertTourStop(ts);
        this.tourStopList.selectedItems[curIndex--] = ts;
      }
      this.tourStopList.refresh();
      this.tourEditorUI.clearSelection();
    }
  },

  _copyMenu_Click: function (sender, e) {
    var writer = new XmlTextWriter();
    writer._writeProcessingInstruction('xml', "version='1.0' encoding='UTF-8'");
    writer._writeStartElement('TourStops');
    var $enum1 = ss.enumerate(ss.keys(this.tourStopList.selectedItems));
    while ($enum1.moveNext()) {
      var key = $enum1.current;
      var item = this.tourStopList.selectedItems[key];
      item._saveToXml(writer, true);
    }
    writer._writeEndElement();
    this.tourEditorUI.clipboardType = 'WorldWideTelescope.Slide';
    this.tourEditorUI.clipboardData = writer.body;
  },

  _cutMenu_Click: function (sender, e) {
    Undo.push(new UndoTourSlidelistChange(Language.getLocalizedText(536, 'Cut Slide'), this._tour));
    this._copyMenu_Click(sender, e);
    var $enum1 = ss.enumerate(ss.keys(this.tourStopList.selectedItems));
    while ($enum1.moveNext()) {
      var key = $enum1.current;
      var item = this.tourStopList.selectedItems[key];
      this._tour.removeTourStop(item);
    }
    ss.clearKeys(this.tourStopList.selectedItems);
    this.tourStopList.refresh();
    this.tourEditorUI.clearSelection();
  },

  pauseTour: function () {
    if (this.playing) {
      this.playing = false;
    }
    this.setPlayPauseMode();
  },

  preview_Click: function (sender, e) {
    this.playing = !this.playing;
    if (this.playing && this._tour.get_editMode()) {
      this.get_tour().set_currentTourstopIndex(-1);
    }
    this.setPlayPauseMode();
  },

  setPlayPauseMode: function () {
    if (this._tour.get_editMode()) {
      if (this.playing) {
        if (this._player == null) {
          this._player = new TourPlayer();
        }
        this._player.set_tour(this._tour);
        globalWWTControl.uiController = this._player;
        this._player.play();
        this.tourStopList.showAddButton = false;
      }
      else {
        globalWWTControl.uiController = this.tourEditorUI;
        if (this._player != null) {
          this._player.stop(false);
        }
        this._player = null;
        globalWWTControl.set__mover(null);
        this.tourStopList.showAddButton = this._tour.get_editMode();
      }
    } else {
      if (this.playing) {
        if (this._player == null) {
          this._player = new TourPlayer();
        }
        this._player.set_tour(this._tour);
        globalWWTControl.uiController = this._player;
        this._player.play();
        this.tourStopList.showAddButton = false;
      }
      else {
        globalWWTControl.uiController = null;
        globalRenderContext.freezeView();
        if (this._player != null) {
          this._player.stop(false);
        }
        this._player = null;
        globalWWTControl.uiController = null;
        globalWWTControl.set__mover(null);
        this.tourStopList.showAddButton = this._tour.get_editMode();
      }
    }
    this.tourStopList.refresh();
  },

  playerTimer_Tick: function (sender, e) {
    if (this.playing) {
      if (this._player != null) {
        if (!TourPlayer.get_playing()) {
          this.playing = false;
          this.setPlayPauseMode();
        }
        else {
          if (this.tourStopList.selectedItem !== this._tour.get_currentTourstopIndex()) {
            this.tourStopList.selectedItem = this._tour.get_currentTourstopIndex();
          }
        }
      }
    }
  },

  insertShapeCircle_Click: function (sender, e) {
    this.tourEditorUI.addShape('', 0);
  },

  insertShapeRectangle_Click: function (sender, e) {
    this.tourEditorUI.addShape('', 1);
  },

  insertShapeLine_Click: function (sender, e) {
    this.tourEditorUI.addShape('', 5);
  },

  insertDonut_Click: function (sender, e) {
    this.tourEditorUI.addShape('', 3);
  },

  _addArrow_Click: function (sender, e) {
    this.tourEditorUI.addShape('', 4);
  },

  insertVideo_Click: function (sender, e) { },

  insertAudio_Click: function (sender, e) { },

  insertHyperlink_Click: function (sender, e) { },

  colorPicker_Click: function (sender, e) { },

  tourEditTab_Leave: function (sender, e) { },

  editTourProperties_Click: function (sender, e) { },

  saveTour_Click: function (sender, e) {
    this.save(false);
  },

  save: function (saveAs) {
    return true;
  },

  addVideo_Click: function (sender, e) { },

  addPicture_Click: function (sender, e) { },

  addShape_Click: function (sender, e) { },

  _addOpenRectangle_Click: function (sender, e) {
    this.tourEditorUI.addShape('', 6);
  },

  _addStar_Click: function (sender, e) {
    this.tourEditorUI.addShape('', 2);
  },

  addText_Click: function (sender, e) { },

  preview_EnabledChanged: function (sender, e) {
    if (this.playing) {
    } else {
    }
  },

  preview_MouseEnter: function (sender, e) { },

  preview_MouseLeave: function (sender, e) { },

  preview_MouseUp: function (sender, e) { },

  preview_MouseDown: function (sender, e) { },

  tourStopList_ItemHover: function (sender, e) { },

  refresh: function () { },

  undoStep: function () {
    if (Undo.peekAction()) {
      Undo.stepBack();
      this.tourStopList.refresh();
      this.tourStopList.selectedItem = this._tour.get_currentTourstopIndex();
      this.showSlideStartPosition(this._tour.get_currentTourStop());
      this.refresh();
      OverlayList._updateOverlayList(this._tour.get_currentTourStop(), this.tourEditorUI.selection);
    }
  },

  redoStep: function () {
    if (Undo.peekRedoAction()) {
      Undo.stepForward();
      this.tourStopList.refresh();
      this.tourStopList.selectedItem = this._tour.get_currentTourstopIndex();
      this.showSlideStartPosition(this._tour.get_currentTourStop());
      this.refresh();
      OverlayList._updateOverlayList(this._tour.get_currentTourStop(), this.tourEditorUI.selection);
    }
  },

  tourStopList_ShowEndPosition: function (sender, e) {
    this._showEndSkyPosition_Click(this, new ss.EventArgs());
  },

  tourStopList_ShowStartPosition: function (sender, e) {
    this.showSlideStartPosition(this.get_tour().get_currentTourStop());
    this.tourEditorUI.clearSelection();
  },

  tourStopList_KeyDown: function (sender, e) {
    if (e.ctrlKey) {
      switch (e.keyCode) {
        case 67:
          this._copyMenu_Click(null, new ss.EventArgs());
          break;
        case 86:
          this._pasteMenu_Click(null, new ss.EventArgs());
          break;
        case 88:
          this._cutMenu_Click(null, new ss.EventArgs());
          break;
        case 90:
          if (Undo.peekAction()) {
            TourEdit._undoStep();
          }
          else {
            UiTools._beep();
          }
          break;
        case 89:
          if (Undo.peekRedoAction()) {
            TourEdit._redoStep();
          }
          else {
            UiTools._beep();
          }
          break;
      }
    }
    if (e.keyCode === 46) {
      this._deleteMenu_Click(null, new ss.EventArgs());
    }
  },

  _ensureSelectedVisible: function () {
    this.tourStopList.ensureSelectedVisible();
  }
};

registerType("TourEditTab", [TourEditTab, TourEditTab$, null]);

// wwtlib.TourEditor

export function TourEditor() {
  this.selection = new Selection();
  this._contextMenu = new ContextMenuStrip();
  this._tour = null;
  this._mouseDown = false;
  this._selectionAction = 11;
  this._needUndoFrame = false;
  this._contextPoint = new Vector2d();
  this._dragCopying = false;
  this._brokeThreshold = false;
  this.nextSlideCallback = null;
  this.clipboardData = '';
  this.clipboardType = '';
  this.editTextCallback = null;
  this._defaultColor = Colors.get_white();
}

TourEditor.capturing = false;
TourEditor.currentEditor = null;

var TourEditor$ = {
  render: function (renderContext) {
    renderContext.setupMatricesOverlays();
    if (this._tour == null || this._tour.get_currentTourStop() == null) {
      return;
    }
    var $enum1 = ss.enumerate(this._tour.get_currentTourStop().get_overlays());
    while ($enum1.moveNext()) {
      var overlay = $enum1.current;
      if (overlay.get_animate() && this.get_tour().get_currentTourStop().get_keyFramed()) {
        overlay.set_tweenFactor(this._tour.get_currentTourStop().get_tweenPosition());
      }
      else if (!this.get_tour().get_currentTourStop().get_keyFramed()) {
        overlay.set_tweenFactor((this._tour.get_currentTourStop().get_tweenPosition() < 0.5) ? 0 : 1);
      }
      overlay.draw3D(renderContext, true);
    }
    this.selection.draw3D(renderContext, 1);
    if (TourEditor.currentEditor != null) {
      TourEditor.currentEditor.render(renderContext);
    }
    Settings.tourSettings = null;
  },

  get_tour: function () {
    return this._tour;
  },

  set_tour: function (value) {
    this._tour = value;
    return value;
  },

  close: function () {
    if (this._tour != null) {
      this._tour = null;
      this.set_focus(null);
    }
  },

  clearSelection: function () {
    this.selection.clearSelection();
    OverlayList._updateOverlayListSelection(this.selection);
    this.set_focus(null);
  },

  get_focus: function () {
    return this.selection.get_focus();
  },

  set_focus: function (value) {
    this.selection.set_focus(value);
    return value;
  },

  pointToView: function (pnt) {
    var clientHeight = globalRenderContext.height;
    var clientWidth = globalRenderContext.width;
    var viewWidth = (globalRenderContext.width / globalRenderContext.height) * 1116;
    var x = ((pnt.x) / (clientWidth) * viewWidth) - ((viewWidth - 1920) / 2);
    var y = (pnt.y) / clientHeight * 1116;
    return Vector2d.create(x, y);
  },

  mouseDown: function (sender, e) {
    this._brokeThreshold = false;
    this._needUndoFrame = true;
    var location = this.pointToView(Vector2d.create(e.offsetX, e.offsetY));
    if (this._tour == null || this._tour.get_currentTourStop() == null) {
      this._needUndoFrame = false;
      return false;
    }
    if (TourEditor.currentEditor != null) {
      if (TourEditor.currentEditor.mouseDown(sender, e)) {
        return true;
      }
    }
    if (this.get_focus() != null) {
      if (this.selection.get_multiSelect()) {
        var $enum1 = ss.enumerate(this.selection.selectionSet);
        while ($enum1.moveNext()) {
          var overlay = $enum1.current;
          if (overlay.hitTest(location)) {
            this._selectionAction = 9;
            this._mouseDown = true;
            this._pointDown = location;
            this.set_focus(overlay);
            if (e.ctrlKey) {
              this._dragCopying = true;
            }
            return true;
          }
        }
      }
      else {
        if (this.get_focus().hitTest(location)) {
          this._selectionAction = 9;
          this._mouseDown = true;
          this._pointDown = location;
          if (e.ctrlKey) {
            this._dragCopying = true;
          }
          return true;
        }
      }
      var hit = this.selection.hitTest(location);
      if (hit !== 11) {
        this._selectionAction = hit;
        this._mouseDown = true;
        if (hit === 8) {
          this._pointDown = location;
        }
        else {
          this._pointDown = this.selection.pointToSelectionSpace(location);
        }
        return true;
      }
    }
    for (var i = this._tour.get_currentTourStop().get_overlays().length - 1; i >= 0; i--) {
      if (this._tour.get_currentTourStop().get_overlays()[i].hitTest(location)) {
        this._selectionAction = 9;
        this.set_focus(this._tour.get_currentTourStop().get_overlays()[i]);
        if (e.ctrlKey || e.shiftKey) {
          this.selection.addSelection(this.get_focus());
        }
        else {
          this.selection.setSelection(this.get_focus());
        }
        OverlayList._updateOverlayListSelection(this.selection);
        this._mouseDown = true;
        this._pointDown = location;
        return true;
      }
    }
    this.set_focus(null);
    this.clearSelection();
    this._needUndoFrame = false;
    return false;
  },

  mouseUp: function (sender, e) {
    this._brokeThreshold = false;
    if (TourEditor.currentEditor != null) {
      if (TourEditor.currentEditor.mouseUp(sender, e)) {
        return true;
      }
    }
    this._contextPoint = Vector2d.create(e.offsetX, e.offsetY);
    if (this._mouseDown) {
      this._mouseDown = false;
      if (e.button === 2) {
        if (this.get_focus() != null) {
          this.showSelectionContextMenu(Vector2d.create(e.offsetX, e.offsetY));
        }
      }
      return true;
    }
    if (e.button === 2) {
      if (this.get_focus() == null) {
        this._showNoSelectionContextMenu(Vector2d.create(e.offsetX, e.offsetY));
      }
      return true;
    }
    return false;
  },

  mouseMove: function (sender, e) {
    if (TourEditor.currentEditor != null) {
      if (TourEditor.currentEditor.mouseMove(sender, e)) {
        return true;
      }
    }
    var location = this.pointToView(Vector2d.create(e.offsetX, e.offsetY));
    if (this._mouseDown && this.get_focus() != null) {
      var undoFrame = null;
      var actionText = Language.getLocalizedText(502, 'Edit');
      if (this._needUndoFrame) {
        undoFrame = new UndoTourStopChange(Language.getLocalizedText(502, 'Edit'), this._tour);
      }
      var moveX;
      var moveY;
      if (this._selectionAction !== 9 && this._selectionAction !== 8) {
        var newPoint = this.selection.pointToSelectionSpace(location);
        moveX = newPoint.x - this._pointDown.x;
        moveY = newPoint.y - this._pointDown.y;
        this._pointDown = newPoint;
      }
      else {
        moveX = location.x - this._pointDown.x;
        moveY = location.y - this._pointDown.y;
        if (this._selectionAction === 9 && !this._brokeThreshold) {
          if (Math.abs(moveX) > 3 || Math.abs(moveY) > 3) {
            this._brokeThreshold = true;
          }
          else {
            return true;
          }
        }
        this._pointDown = location;
      }
      if (this._dragCopying) {
        if (this.selection.get_multiSelect()) {
          var set = this.selection.selectionSet;
          this.clearSelection();
          var $enum1 = ss.enumerate(set);
          while ($enum1.moveNext()) {
            var overlay = $enum1.current;
            var newOverlay = this.addOverlay(overlay);
            newOverlay.set_x(overlay.get_x());
            newOverlay.set_y(overlay.get_y());
            this.set_focus(newOverlay);
            this.selection.addSelection(this.get_focus());
          }
          OverlayList._updateOverlayList(this._tour.get_currentTourStop(), this.selection);
          this._dragCopying = false;
        }
        else {
          var newOverlay = this.addOverlay(this.get_focus());
          newOverlay.set_x(this.get_focus().get_x());
          newOverlay.set_y(this.get_focus().get_y());
          this.set_focus(newOverlay);
          this.selection.setSelection(this.get_focus());
          OverlayList._updateOverlayList(this._tour.get_currentTourStop(), this.selection);
          this._dragCopying = false;
        }
      }
      var aspect = this.get_focus().get_width() / this.get_focus().get_height();
      var center = Vector2d.create(this.get_focus().get_x(), this.get_focus().get_y());
      if (e.ctrlKey) {
        actionText = Language.getLocalizedText(537, 'Resize');
        switch (this._selectionAction) {
          case 0:
            this.get_focus().set_width(Math.max(2, this.get_focus().get_width() - moveX * 2));
            this.get_focus().set_height(Math.max(2, this.get_focus().get_height() - (moveX / aspect) * 2));
            break;
          case 1:
            this.get_focus().set_height(Math.max(2, this.get_focus().get_height() - moveY * 2));
            break;
          case 2:
            this.get_focus().set_width(Math.max(2, this.get_focus().get_width() + moveX * 2));
            this.get_focus().set_height(Math.max(2, this.get_focus().get_height() + (moveX / aspect) * 2));
            break;
          case 3:
            this.get_focus().set_width(Math.max(2, this.get_focus().get_width() + moveX * 2));
            break;
          case 4:
            this.get_focus().set_width(Math.max(2, this.get_focus().get_width() + moveX * 2));
            this.get_focus().set_height(Math.max(2, this.get_focus().get_height() + (moveX / aspect) * 2));
            break;
          case 5:
            this.get_focus().set_height(Math.max(2, this.get_focus().get_height() + moveY * 2));
            break;
          case 6:
            this.get_focus().set_width(Math.max(2, this.get_focus().get_width() - moveX * 2));
            this.get_focus().set_height(Math.max(2, this.get_focus().get_height() - (moveX / aspect) * 2));
            break;
          case 7:
            this.get_focus().set_width(Math.max(2, this.get_focus().get_width() - moveX * 2));
            break;
          case 8:
            actionText = Language.getLocalizedText(538, 'Rotate');
            this.get_focus().set_rotationAngle(this.get_focus().get_rotationAngle() + moveX / 10);
            break;
          case 9:
            actionText = Language.getLocalizedText(539, 'Drag Copy');
            center.x += moveX;
            center.y += moveY;
            break;
          case 10:
            break;
          case 11:
            break;
          default:
            break;
        }
      }
      else {
        if (this._selectionAction !== 8 && this._selectionAction !== 9) {
          if (moveX > (this.get_focus().get_width() - 2)) {
            moveX = 0;
          }
          if (moveY > (this.get_focus().get_height() - 2)) {
            moveY = 0;
          }
        }
        actionText = Language.getLocalizedText(537, 'Resize');
        switch (this._selectionAction) {
          case 0:
            this.get_focus().set_width(this.get_focus().get_width() - moveX);
            this.get_focus().set_height(this.get_focus().get_height() - (moveX / aspect));
            center.x += (moveX / 2);
            center.y += ((moveX / aspect) / 2);
            break;
          case 1:
            this.get_focus().set_height(this.get_focus().get_height() - moveY);
            center.y += (moveY / 2);
            break;
          case 2:
            this.get_focus().set_width(this.get_focus().get_width() + moveX);
            this.get_focus().set_height(this.get_focus().get_height() + (moveX / aspect));
            center.x += (moveX / 2);
            center.y -= ((moveX / aspect) / 2);
            break;
          case 3:
            this.get_focus().set_width(this.get_focus().get_width() + moveX);
            center.x += (moveX / 2);
            break;
          case 4:
            this.get_focus().set_width(this.get_focus().get_width() + moveX);
            this.get_focus().set_height(this.get_focus().get_height() + (moveX / aspect));
            center.x += (moveX / 2);
            center.y += ((moveX / aspect) / 2);
            break;
          case 5:
            this.get_focus().set_height(this.get_focus().get_height() + moveY);
            center.y += (moveY / 2);
            break;
          case 6:
            this.get_focus().set_width(this.get_focus().get_width() - moveX);
            this.get_focus().set_height(this.get_focus().get_height() - (moveX / aspect));
            center.x += (moveX / 2);
            center.y -= ((moveX / aspect) / 2);
            break;
          case 7:
            this.get_focus().set_width(this.get_focus().get_width() - moveX);
            center.x += (moveX / 2);
            break;
          case 8:
            actionText = Language.getLocalizedText(538, 'Rotate');
            this.get_focus().set_rotationAngle(this.get_focus().get_rotationAngle() + moveX);
            break;
          case 9:
            actionText = Language.getLocalizedText(540, 'Move');
            center.x += moveX;
            center.y += moveY;
            break;
          case 10:
            break;
          case 11:
            break;
          default:
            break;
        }
      }
      if (this._selectionAction !== 9 && this._selectionAction !== 8) {
        center = this.selection.pointToScreenSpace(center);
      }
      if (this.selection.get_multiSelect()) {
        var $enum2 = ss.enumerate(this.selection.selectionSet);
        while ($enum2.moveNext()) {
          var overlay = $enum2.current;
          overlay.set_x(overlay.get_x() + moveX);
          overlay.set_y(overlay.get_y() + moveY);
        }
      }
      else {
        this.get_focus().set_x(center.x);
        this.get_focus().set_y(center.y);
      }
      if (this._needUndoFrame) {
        this._needUndoFrame = false;
        undoFrame.set_actionText(actionText);
        Undo.push(undoFrame);
      }
    } else {
      if (this.get_focus() != null) {
        if (this.get_focus().hitTest(location)) {
          Cursor.set_current(Cursors.get_sizeAll());
          return false;
        }
        var hit = this.selection.hitTest(location);
        if (hit === 11) {
          return false;
        }
        switch (hit) {
          case 0:
            Cursor.set_current(Cursors.get_sizeNWSE());
            break;
          case 1:
            Cursor.set_current(Cursors.get_sizeNS());
            break;
          case 2:
            Cursor.set_current(Cursors.get_sizeNESW());
            break;
          case 3:
            Cursor.set_current(Cursors.get_sizeWE());
            break;
          case 4:
            Cursor.set_current(Cursors.get_sizeNWSE());
            break;
          case 5:
            Cursor.set_current(Cursors.get_sizeNS());
            break;
          case 6:
            Cursor.set_current(Cursors.get_sizeNESW());
            break;
          case 7:
            Cursor.set_current(Cursors.get_sizeWE());
            break;
          case 8:
            Cursor.set_current(Cursors.get_sizeWE());
            break;
          case 10:
            break;
          case 11:
            break;
          default:
            break;
        }
      }
    }
    return false;
  },

  _showNoSelectionContextMenu: function (position) {
    if (this._contextMenu != null) {
      this._contextMenu._dispose();
    }
    if (this._tour.get_currentTourStop() == null) {
      return;
    }
    this._contextMenu = new ContextMenuStrip();
    var pasteMenu = ToolStripMenuItem.create(Language.getLocalizedText(425, 'Paste'));
    pasteMenu.enabled = this.clipboardType === 'WorldWideTelescope.Overlay';
    pasteMenu.click = ss.bind('_pasteMenu_Click', this);
    this._contextMenu.items.push(pasteMenu);
    this._contextMenu._show(position);
  },

  _addOpenRectangle_Click: function (sender, e) {
    this.addShape('', 6);
  },

  _addStar_Click: function (sender, e) {
    this.addShape('', 2);
  },

  _insertShapeCircle_Click: function (sender, e) {
    this.addShape('', 0);
  },

  _insertShapeRectangle_Click: function (sender, e) {
    this.addShape('', 1);
  },

  _insertShapeLine_Click: function (sender, e) {
    this.addShape('', 5);
  },

  _insertDonut_Click: function (sender, e) {
    this.addShape('', 3);
  },

  _addArrow_Click: function (sender, e) {
    this.addShape('', 4);
  },

  showSelectionContextMenu: function (position) {
    if (this.get_focus() == null) {
      return;
    }
    var multiSelect = this.selection.get_multiSelect();
    if (this._contextMenu != null) {
      this._contextMenu._dispose();
    }
    this._contextMenu = new ContextMenuStrip();
    var cutMenu = ToolStripMenuItem.create(Language.getLocalizedText(427, 'Cut'));
    var copyMenu = ToolStripMenuItem.create(Language.getLocalizedText(428, 'Copy'));
    var pasteMenu = ToolStripMenuItem.create(Language.getLocalizedText(425, 'Paste'));
    var deleteMenu = ToolStripMenuItem.create(Language.getLocalizedText(167, 'Delete'));
    var sep1 = new ToolStripSeparator();
    var sep2 = new ToolStripSeparator();
    var sep3 = new ToolStripSeparator();
    var bringToFront = ToolStripMenuItem.create(Language.getLocalizedText(452, 'Bring to Front'));
    var sendToBack = ToolStripMenuItem.create(Language.getLocalizedText(453, 'Send to Back'));
    var bringForward = ToolStripMenuItem.create(Language.getLocalizedText(454, 'Bring Forward'));
    var sendBackward = ToolStripMenuItem.create(Language.getLocalizedText(455, 'Send Backward'));
    var properties = ToolStripMenuItem.create(Language.getLocalizedText(20, 'Properties'));
    var editText = ToolStripMenuItem.create(Language.getLocalizedText(502, 'Edit'));
    var url = ToolStripMenuItem.create(Language.getLocalizedText(587, 'Hyperlink'));
    var linkString = this.get_focus().get_linkID();
    switch (this.get_focus().get_linkID()) {
      case '':
      case null:
        linkString = ' (' + Language.getLocalizedText(609, 'No Link') + ')';
        break;
      case 'Next':
        linkString = ' (' + Language.getLocalizedText(610, 'Next Slide') + ')';
        break;
      case 'Return':
        linkString = ' (' + Language.getLocalizedText(602, 'Return to Caller') + ')';
        break;
      default:
        var index = this.get_tour().getTourStopIndexByID(this.get_focus().get_linkID());
        if (index > -1) {
          if (ss.emptyString(this._tour.get_tourStops()[index].get_description())) {
            linkString = ss.format(' (' + Language.getLocalizedText(1340, 'Slide') + ' {0})', index);
          }
          else {
            linkString = ' (' + this._tour.get_tourStops()[index].get_description() + ')';
          }
        }
        break;
    }
    var animateMenu = ToolStripMenuItem.create(Language.getLocalizedText(588, 'Animate'));
    var linkID = ToolStripMenuItem.create(Language.getLocalizedText(589, 'Link to Slide') + linkString);
    var pickColor = ToolStripMenuItem.create(Language.getLocalizedText(458, 'Color/Opacity'));
    var flipbookProperties = ToolStripMenuItem.create(Language.getLocalizedText(630, 'Flipbook Properties'));
    var interpolateMenu = ToolStripMenuItem.create(Language.getLocalizedText(1029, 'Animation Tween Type'));
    var Linear = ToolStripMenuItem.create(Language.getLocalizedText(1030, 'Linear'));
    var Ease = ToolStripMenuItem.create(Language.getLocalizedText(1031, 'Ease In/Out'));
    var EaseIn = ToolStripMenuItem.create(Language.getLocalizedText(1032, 'Ease In'));
    var EaseOut = ToolStripMenuItem.create(Language.getLocalizedText(1033, 'Ease Out'));
    var Exponential = ToolStripMenuItem.create(Language.getLocalizedText(1034, 'Exponential'));
    var Default = ToolStripMenuItem.create(Language.getLocalizedText(1035, 'Slide Default'));
    var Align = ToolStripMenuItem.create(Language.getLocalizedText(790, 'Align'));
    var AlignTop = ToolStripMenuItem.create(Language.getLocalizedText(1333, 'Top'));
    var AlignBottom = ToolStripMenuItem.create(Language.getLocalizedText(1334, 'Bottom'));
    var AlignLeft = ToolStripMenuItem.create(Language.getLocalizedText(1335, 'Left'));
    var AlignRight = ToolStripMenuItem.create(Language.getLocalizedText(1336, 'Right'));
    var AlignHorizon = ToolStripMenuItem.create(Language.getLocalizedText(1337, 'Horizontal'));
    var AlignVertical = ToolStripMenuItem.create(Language.getLocalizedText(1338, 'Vertical'));
    var AlignCenter = ToolStripMenuItem.create(Language.getLocalizedText(1339, 'Centered'));
    Align.dropDownItems.push(AlignTop);
    Align.dropDownItems.push(AlignBottom);
    Align.dropDownItems.push(AlignLeft);
    Align.dropDownItems.push(AlignRight);
    Align.dropDownItems.push(AlignHorizon);
    Align.dropDownItems.push(AlignVertical);
    Align.dropDownItems.push(AlignCenter);
    Linear.tag = 0;
    Ease.tag = 3;
    EaseIn.tag = 1;
    EaseOut.tag = 2;
    Exponential.tag = 4;
    Default.tag = 5;
    Linear.click = ss.bind('_interpolation_Click', this);
    Ease.click = ss.bind('_interpolation_Click', this);
    EaseIn.click = ss.bind('_interpolation_Click', this);
    EaseOut.click = ss.bind('_interpolation_Click', this);
    Exponential.click = ss.bind('_interpolation_Click', this);
    Default.click = ss.bind('_interpolation_Click', this);
    switch (this.get_focus().get_interpolationType()) {
      case 0:
        Linear.checked = true;
        break;
      case 1:
        EaseIn.checked = true;
        break;
      case 2:
        EaseOut.checked = true;
        break;
      case 3:
        Ease.checked = true;
        break;
      case 4:
        Exponential.checked = true;
        break;
      case 5:
        Default.checked = true;
        break;
      default:
        break;
    }
    interpolateMenu.dropDownItems.push(Default);
    interpolateMenu.dropDownItems.push(Linear);
    interpolateMenu.dropDownItems.push(Ease);
    interpolateMenu.dropDownItems.push(EaseIn);
    interpolateMenu.dropDownItems.push(EaseOut);
    interpolateMenu.dropDownItems.push(Exponential);
    cutMenu.click = ss.bind('_cutMenu_Click', this);
    copyMenu.click = ss.bind('_copyMenu_Click', this);
    deleteMenu.click = ss.bind('_deleteMenu_Click', this);
    bringToFront.click = ss.bind('_bringToFront_Click', this);
    sendToBack.click = ss.bind('_sendToBack_Click', this);
    sendBackward.click = ss.bind('_sendBackward_Click', this);
    bringForward.click = ss.bind('_bringForward_Click', this);
    properties.click = ss.bind('_properties_Click', this);
    editText.click = ss.bind('_editText_Click', this);
    url.click = ss.bind('_url_Click', this);
    pickColor.click = ss.bind('_pickColor_Click', this);
    pasteMenu.click = ss.bind('_pasteMenu_Click', this);
    animateMenu.click = ss.bind('_animateMenu_Click', this);
    flipbookProperties.click = ss.bind('_flipbookProperties_Click', this);
    linkID.click = ss.bind('_linkID_Click', this);
    AlignTop.click = ss.bind('_alignTop_Click', this);
    AlignBottom.click = ss.bind('_alignBottom_Click', this);
    AlignLeft.click = ss.bind('_alignLeft_Click', this);
    AlignRight.click = ss.bind('_alignRight_Click', this);
    AlignHorizon.click = ss.bind('_alignHorizon_Click', this);
    AlignVertical.click = ss.bind('_alignVertical_Click', this);
    AlignCenter.click = ss.bind('_alignCenter_Click', this);
    this._contextMenu.items.push(cutMenu);
    this._contextMenu.items.push(copyMenu);
    this._contextMenu.items.push(pasteMenu);
    this._contextMenu.items.push(deleteMenu);
    this._contextMenu.items.push(sep1);
    this._contextMenu.items.push(bringToFront);
    this._contextMenu.items.push(sendToBack);
    this._contextMenu.items.push(bringForward);
    this._contextMenu.items.push(sendBackward);
    this._contextMenu.items.push(Align);
    this._contextMenu.items.push(sep2);
    pasteMenu.enabled = false;
    this._contextMenu.items.push(pickColor);
    this._contextMenu.items.push(url);
    this._contextMenu.items.push(linkID);
    this._contextMenu.items.push(animateMenu);
    this._contextMenu.items.push(sep3);
    this._contextMenu.items.push(flipbookProperties);
    animateMenu.checked = this.get_focus().get_animate();
    this._contextMenu.items.push(interpolateMenu);
    interpolateMenu.enabled = this.get_focus().get_animate();
    flipbookProperties.visible = (ss.canCast(this.get_focus(), FlipbookOverlay));
    sep3.visible = (ss.canCast(this.get_focus(), FlipbookOverlay));
    if (multiSelect) {
      url.visible = false;
      linkID.visible = false;
      properties.visible = false;
      flipbookProperties.visible = false;
      bringForward.visible = false;
      sendBackward.visible = false;
    } else {
      Align.visible = false;
    }
    this._contextMenu.items.push(properties);
    if (this.get_focus() != null) {
      if (ss.typeOf(this.get_focus()) === TextOverlay) {
        this._contextMenu.items.push(editText);
      }
    }
    this._contextMenu._show(position);
  },

  _editText_Click: function (sender, e) {
    if (this.get_focus() != null) {
      if (ss.typeOf(this.get_focus()) === TextOverlay) {
        this._editText();
      }
    }
  },

  _alignVertical_Click: function (sender, e) {
    if (this.get_focus() == null) {
      return;
    }
    Undo.push(new UndoTourStopChange(Language.getLocalizedText(1036, 'Vertical Align'), this._tour));
    var xCenter = this.get_focus().get_x();
    var $enum1 = ss.enumerate(this.selection.selectionSet);
    while ($enum1.moveNext()) {
      var overlay = $enum1.current;
      overlay.set_x(xCenter);
    }
  },

  _alignHorizon_Click: function (sender, e) {
    if (this.get_focus() == null) {
      return;
    }
    Undo.push(new UndoTourStopChange(Language.getLocalizedText(1037, 'Horizontal Align'), this._tour));
    var yCenter = this.get_focus().get_y();
    var $enum1 = ss.enumerate(this.selection.selectionSet);
    while ($enum1.moveNext()) {
      var overlay = $enum1.current;
      overlay.set_y(yCenter);
    }
  },

  _alignCenter_Click: function (sender, e) {
    if (this.get_focus() == null) {
      return;
    }
    Undo.push(new UndoTourStopChange(Language.getLocalizedText(1038, 'Align Centers'), this._tour));
    var yCenter = this.get_focus().get_y();
    var xCenter = this.get_focus().get_x();
    var $enum1 = ss.enumerate(this.selection.selectionSet);
    while ($enum1.moveNext()) {
      var overlay = $enum1.current;
      overlay.set_y(yCenter);
      overlay.set_x(xCenter);
    }
  },

  _alignRight_Click: function (sender, e) {
    if (this.get_focus() == null) {
      return;
    }
    Undo.push(new UndoTourStopChange(Language.getLocalizedText(1040, 'Align Right'), this._tour));
    var left = this.get_focus().get_x() + this.get_focus().get_width() / 2;
    var $enum1 = ss.enumerate(this.selection.selectionSet);
    while ($enum1.moveNext()) {
      var overlay = $enum1.current;
      overlay.set_x(left - overlay.get_width() / 2);
    }
  },

  _alignLeft_Click: function (sender, e) {
    if (this.get_focus() == null) {
      return;
    }
    Undo.push(new UndoTourStopChange(Language.getLocalizedText(1041, 'Align Left'), this._tour));
    var right = this.get_focus().get_x() - this.get_focus().get_width() / 2;
    var $enum1 = ss.enumerate(this.selection.selectionSet);
    while ($enum1.moveNext()) {
      var overlay = $enum1.current;
      overlay.set_x(right + overlay.get_width() / 2);
    }
  },

  _alignBottom_Click: function (sender, e) {
    if (this.get_focus() == null) {
      return;
    }
    Undo.push(new UndoTourStopChange(Language.getLocalizedText(1042, 'Align Bottoms'), this._tour));
    var top = this.get_focus().get_y() + this.get_focus().get_height() / 2;
    var $enum1 = ss.enumerate(this.selection.selectionSet);
    while ($enum1.moveNext()) {
      var overlay = $enum1.current;
      overlay.set_y(top - overlay.get_height() / 2);
    }
  },

  _alignTop_Click: function (sender, e) {
    if (this.get_focus() == null) {
      return;
    }
    Undo.push(new UndoTourStopChange(Language.getLocalizedText(1039, 'Align Tops'), this._tour));
    var top = this.get_focus().get_y() - this.get_focus().get_height() / 2;
    var $enum1 = ss.enumerate(this.selection.selectionSet);
    while ($enum1.moveNext()) {
      var overlay = $enum1.current;
      overlay.set_y(top + overlay.get_height() / 2);
    }
  },

  _interpolation_Click: function (sender, e) {
    var item = sender;
    if (this.get_focus() != null) {
      var $enum1 = ss.enumerate(this.selection.selectionSet);
      while ($enum1.moveNext()) {
        var overlay = $enum1.current;
        overlay.set_interpolationType(item.tag);
      }
    }
  },

  _linkSlideChosen: function () {
    if (this.selectDialog.get_OK()) {
      this.get_focus().set_linkID(this.selectDialog.get_id());
    }
  },

  _linkID_Click: function (sender, e) {
    this.selectDialog = new SelectLink(this.get_focus().get_linkID());
    this.nextSlideCallback(this.selectDialog, ss.bind('_linkSlideChosen', this));
  },

  _flipbookProperties_Click: function (sender, e) { },

  _animateMenu_Click: function (sender, e) {
    if (this.get_focus() != null) {
      Undo.push(new UndoTourStopChange(Language.getLocalizedText(588, 'Animate'), this._tour));
      var animate = !this.get_focus().get_animate();
      var $enum1 = ss.enumerate(this.selection.selectionSet);
      while ($enum1.moveNext()) {
        var overlay = $enum1.current;
        overlay.set_animate(animate);
      }
    }
  },

  _url_Click: function (sender, e) {
    var $this = this;

    if (this.get_focus() != null) {
      var input = new SimpleInput(Language.getLocalizedText(541, 'Edit Hyperlink'), Language.getLocalizedText(542, 'Url'), this.get_focus().get_url(), 2048);
      input.show(Cursor.get_position(), function () {
        Undo.push(new UndoTourStopChange(Language.getLocalizedText(541, 'Edit Hyperlink'), $this._tour));
        $this.get_focus().set_url(input.text);
      });
    }
  },

  _pickColor_Click: function (sender, e) {
    var $this = this;

    var picker = new ColorPicker();
    picker.color = this.get_focus().get_color();
    picker.callBack = function () {
      Undo.push(new UndoTourStopChange(Language.getLocalizedText(543, 'Edit Color'), $this._tour));
      var $enum1 = ss.enumerate($this.selection.selectionSet);
      while ($enum1.moveNext()) {
        var overlay = $enum1.current;
        overlay.set_color(picker.color);
      }
    };
    picker.show(e);
  },

  _volume_Click: function (sender, e) {
    var vol = new PopupVolume();
    vol.volume = (this.get_focus()).get_volume();
    vol.showDialog();
    (this.get_focus()).set_volume(vol.volume);
  },

  _deleteMenu_Click: function (sender, e) {
    if (this._tour == null || this._tour.get_currentTourStop() == null) {
      return;
    }
    Undo.push(new UndoTourStopChange(Language.getLocalizedText(167, 'Delete'), this._tour));
    var $enum1 = ss.enumerate(this.selection.selectionSet);
    while ($enum1.moveNext()) {
      var overlay = $enum1.current;
      this._tour.get_currentTourStop().removeOverlay(overlay);
    }
    this.set_focus(null);
    this.clearSelection();
    OverlayList._updateOverlayList(this._tour.get_currentTourStop(), this.selection);
  },

  _properties_Click: function (sender, e) {
    if (this._tour == null || this._tour.get_currentTourStop() == null) {
    }
    Undo.push(new UndoTourStopChange(Language.getLocalizedText(549, 'Properties Edit'), this._tour));
    var props = new OverlayProperties();
    props.overlay = this.get_focus();
    props.showDialog();
    OverlayList._updateOverlayList(this._tour.get_currentTourStop(), this.selection);
  },

  _bringForward_Click: function (sender, e) {
    if (this._tour == null || this._tour.get_currentTourStop() == null) {
      return;
    }
    Undo.push(new UndoTourStopChange(Language.getLocalizedText(454, 'Bring Forward'), this._tour));
    var $enum1 = ss.enumerate(this._getSortedSelection(false));
    while ($enum1.moveNext()) {
      var overlay = $enum1.current;
      this._tour.get_currentTourStop().bringForward(overlay);
    }
    OverlayList._updateOverlayList(this._tour.get_currentTourStop(), this.selection);
  },

  _sendBackward_Click: function (sender, e) {
    if (this._tour == null || this._tour.get_currentTourStop() == null) {
      return;
    }
    Undo.push(new UndoTourStopChange(Language.getLocalizedText(455, 'Send Backward'), this._tour));
    var $enum1 = ss.enumerate(this._getSortedSelection(true));
    while ($enum1.moveNext()) {
      var overlay = $enum1.current;
      this._tour.get_currentTourStop().sendBackward(overlay);
    }
    OverlayList._updateOverlayList(this._tour.get_currentTourStop(), this.selection);
  },

  _sendToBack_Click: function (sender, e) {
    if (this._tour == null || this._tour.get_currentTourStop() == null) {
      return;
    }
    Undo.push(new UndoTourStopChange(Language.getLocalizedText(453, 'Send to Back'), this._tour));
    var $enum1 = ss.enumerate(this._getSortedSelection(true));
    while ($enum1.moveNext()) {
      var overlay = $enum1.current;
      this._tour.get_currentTourStop().sendToBack(overlay);
    }
    OverlayList._updateOverlayList(this._tour.get_currentTourStop(), this.selection);
  },

  _bringToFront_Click: function (sender, e) {
    if (this._tour == null || this._tour.get_currentTourStop() == null) {
      return;
    }
    Undo.push(new UndoTourStopChange(Language.getLocalizedText(452, 'Bring to Front'), this._tour));
    var $enum1 = ss.enumerate(this._getSortedSelection(false));
    while ($enum1.moveNext()) {
      var overlay = $enum1.current;
      this._tour.get_currentTourStop().bringToFront(overlay);
    }
    OverlayList._updateOverlayList(this._tour.get_currentTourStop(), this.selection);
  },

  _getSortedSelection: function (reverse) {
    var sorted = [];
    var $enum1 = ss.enumerate(this.selection.selectionSet);
    while ($enum1.moveNext()) {
      var ov = $enum1.current;
      sorted.push(ov);
    }
    if (reverse) {
      sorted.sort(function (p1, p2) {
        return -Util.compare(p1.get_zOrder(), p2.get_zOrder());
      });
    } else {
      sorted.sort(function (p1, p2) {
        return Util.compare(p1.get_zOrder(), p2.get_zOrder());
      });
    }
    return sorted;
  },

  _copyMenu_Click: function (sender, e) {
    if (this._tour == null || this._tour.get_currentTourStop() == null) {
      return;
    }
    var writer = new XmlTextWriter();
    writer._writeProcessingInstruction('xml', "version='1.0' encoding='UTF-8'");
    writer._writeStartElement('Overlays');
    var $enum1 = ss.enumerate(this.selection.selectionSet);
    while ($enum1.moveNext()) {
      var overlay = $enum1.current;
      overlay.saveToXml(writer, true);
    }
    writer._writeEndElement();
    this.clipboardData = writer.body;
    this.clipboardType = 'WorldWideTelescope.Overlay';
  },

  _cutMenu_Click: function (sender, e) {
    if (this._tour == null || this._tour.get_currentTourStop() == null) {
      return;
    }
    Undo.push(new UndoTourStopChange(Language.getLocalizedText(427, 'Cut'), this._tour));
    this._copyMenu_Click(sender, e);
    var $enum1 = ss.enumerate(this.selection.selectionSet);
    while ($enum1.moveNext()) {
      var overlay = $enum1.current;
      this._tour.get_currentTourStop().removeOverlay(overlay);
    }
    this.set_focus(null);
    this.clearSelection();
    OverlayList._updateOverlayList(this._tour.get_currentTourStop(), this.selection);
  },

  _pasteMenu_Click: function (sender, e) {
    Undo.push(new UndoTourSlidelistChange(Language.getLocalizedText(544, 'Paste Object'), this._tour));
    if (this.clipboardType === 'WorldWideTelescope.Overlay') {
      var xParser = new DOMParser();
      var doc = xParser.parseFromString(this.clipboardData, 'text/xml');
      this.clearSelection();
      var parent = Util.selectSingleNode(doc, 'Overlays');
      var $enum1 = ss.enumerate(parent.childNodes);
      while ($enum1.moveNext()) {
        var child = $enum1.current;
        if (child.nodeName === 'Overlay') {
          var copy = Overlay._fromXml(this._tour.get_currentTourStop(), child);
          var found = false;
          var maxX = 0;
          var maxY = 0;
          var $enum2 = ss.enumerate(this._tour.get_currentTourStop().get_overlays());
          while ($enum2.moveNext()) {
            var item = $enum2.current;
            if (item.id === copy.id && ss.typeOf(item) === ss.typeOf(copy)) {
              found = true;
              if (maxY < item.get_y() || maxX < item.get_x()) {
                maxX = item.get_x();
                maxY = item.get_y();
              }
            }
          }
          if (found) {
            copy.set_x(maxX + 20);
            copy.set_y(maxY + 20);
          }
          this._tour.get_currentTourStop().addOverlay(copy);
          this.set_focus(copy);
          this.selection.addSelection(this.get_focus());
          OverlayList._updateOverlayList(this._tour.get_currentTourStop(), this.selection);
        }
      }
    }
  },

  mouseClick: function (sender, e) {
    if (TourEditor.currentEditor != null) {
      if (TourEditor.currentEditor.mouseClick(sender, e)) {
        return true;
      }
    }
    return false;
  },

  click: function (sender, e) {
    if (TourEditor.currentEditor != null) {
      if (TourEditor.currentEditor.click(sender, e)) {
        return true;
      }
    }
    return false;
  },

  mouseDoubleClick: function (sender, e) {
    if (TourEditor.currentEditor != null) {
      if (TourEditor.currentEditor.mouseDoubleClick(sender, e)) {
        return true;
      }
    }
    if (this.get_focus() != null) {
      if (ss.typeOf(this.get_focus()) === TextOverlay) {
        this._editText();
        return true;
      }
    }
    return true;
  },

  _doneEditing: function () {
    Undo.push(new UndoTourStopChange(Language.getLocalizedText(545, 'Text Edit'), this._tour));
    (this.get_focus()).set_width(0);
    (this.get_focus()).set_height(0);
    this.get_focus().set_color((this.get_focus()).textObject.foregroundColor);
    this.get_focus().cleanUp();
  },

  _editText: function () {
    var textObj = (this.get_focus()).textObject;
    this.editTextCallback(textObj, ss.bind('_doneEditing', this));
  },

  keyDown: function (sender, e) {
    if (TourEditor.currentEditor != null) {
      if (TourEditor.currentEditor.keyDown(sender, e)) {
        return true;
      }
    }
    var increment = 1;
    if (e.ctrlKey) {
      increment = 10;
    }
    switch (e.keyCode) {
      case 65:
        if (e.ctrlKey) {
          this.clearSelection();
          this.selection.addSelectionRange(this._tour.get_currentTourStop().get_overlays());
          OverlayList._updateOverlayListSelection(this.selection);
          if (this._tour.get_currentTourStop().get_overlays().length > 0) {
            this.set_focus(this._tour.get_currentTourStop().get_overlays()[0]);
          }
        }
        break;
      case 90:
        if (e.ctrlKey) {
          if (Undo.peekAction()) {
            TourEdit._undoStep();
          }
          else {
            UiTools._beep();
          }
        }
        break;
      case 89:
        if (e.ctrlKey) {
          if (Undo.peekRedoAction()) {
            TourEdit._redoStep();
          }
          else {
            UiTools._beep();
          }
        }
        break;
      case 67:
        if (e.ctrlKey) {
          this._copyMenu_Click(this, new ss.EventArgs());
        }
        break;
      case 86:
        if (e.ctrlKey) {
          this._pasteMenu_Click(this, new ss.EventArgs());
        }
        break;
      case 88:
        if (e.ctrlKey) {
          this._cutMenu_Click(this, new ss.EventArgs());
        }
        break;
      case 46:
        this._deleteMenu_Click(null, null);
        return true;
      case 9:
        if (e.shiftKey) {
          this._selectLast();
        }
        else {
          this._selectNext();
        }
        return true;
      case 37:
        if (this.get_focus() != null) {
          var $enum1 = ss.enumerate(this.selection.selectionSet);
          while ($enum1.moveNext()) {
            var overlay = $enum1.current;
            if (e.shiftKey) {
              if (e.altKey) {
                if (overlay.get_width() > increment) {
                  Undo.push(new UndoTourStopChange(Language.getLocalizedText(537, 'Resize'), this._tour));
                  overlay.set_width(overlay.get_width() - increment);
                }
              }
              else {
                var aspect = overlay.get_width() / overlay.get_height();
                if (overlay.get_width() > increment && overlay.get_height() > (increment * aspect)) {
                  Undo.push(new UndoTourStopChange(Language.getLocalizedText(537, 'Resize'), this._tour));
                  overlay.set_width(overlay.get_width() - increment);
                  overlay.set_height(overlay.get_height() - increment * aspect);
                }
              }
            }
            else if (e.altKey) {
              Undo.push(new UndoTourStopChange(Language.getLocalizedText(538, 'Rotate'), this._tour));
              overlay.set_rotationAngle(overlay.get_rotationAngle() - increment);
            }
            else {
              Undo.push(new UndoTourStopChange(Language.getLocalizedText(540, 'Move'), this._tour));
              overlay.set_x(overlay.get_x() - increment);
            }
          }
          return true;
        }
        break;
      case 39:
        if (this.get_focus() != null) {
          var $enum2 = ss.enumerate(this.selection.selectionSet);
          while ($enum2.moveNext()) {
            var overlay = $enum2.current;
            if (e.shiftKey) {
              Undo.push(new UndoTourStopChange(Language.getLocalizedText(537, 'Resize'), this._tour));
              if (e.altKey) {
                overlay.set_width(overlay.get_width() + increment);
              }
              else {
                var aspect = overlay.get_width() / overlay.get_height();
                overlay.set_width(overlay.get_width() + increment);
                overlay.set_height(overlay.get_height() + increment * aspect);
              }
            }
            else if (e.altKey) {
              Undo.push(new UndoTourStopChange(Language.getLocalizedText(538, 'Rotate'), this._tour));
              overlay.set_rotationAngle(overlay.get_rotationAngle() + increment);
            }
            else {
              Undo.push(new UndoTourStopChange(Language.getLocalizedText(540, 'Move'), this._tour));
              overlay.set_x(overlay.get_x() + increment);
            }
          }
          return true;
        }
        break;
      case 38:
        if (this.get_focus() != null) {
          var $enum3 = ss.enumerate(this.selection.selectionSet);
          while ($enum3.moveNext()) {
            var overlay = $enum3.current;
            if (e.shiftKey) {
              Undo.push(new UndoTourStopChange(Language.getLocalizedText(537, 'Resize'), this._tour));
              if (e.altKey) {
                overlay.set_height(overlay.get_height() + increment);
              }
              else {
                var aspect = overlay.get_width() / overlay.get_height();
                overlay.set_width(overlay.get_width() + increment);
                overlay.set_height(overlay.get_height() + increment * aspect);
              }
            }
            else if (!e.altKey) {
              Undo.push(new UndoTourStopChange(Language.getLocalizedText(540, 'Move'), this._tour));
              overlay.set_y(overlay.get_y() - increment);
            }
          }
          return true;
        }
        break;
      case 40:
        if (this.get_focus() != null) {
          var $enum4 = ss.enumerate(this.selection.selectionSet);
          while ($enum4.moveNext()) {
            var overlay = $enum4.current;
            if (e.shiftKey) {
              if (e.altKey) {
                if (overlay.get_height() > increment) {
                  Undo.push(new UndoTourStopChange(Language.getLocalizedText(537, 'Resize'), this._tour));
                  overlay.set_height(overlay.get_height() - increment);
                }
              }
              else {
                var aspect = overlay.get_width() / overlay.get_height();
                if (overlay.get_width() > increment && overlay.get_height() > (increment * aspect)) {
                  Undo.push(new UndoTourStopChange(Language.getLocalizedText(537, 'Resize'), this._tour));
                  overlay.set_width(overlay.get_width() - increment);
                  overlay.set_height(overlay.get_height() - increment * aspect);
                }
              }
            }
            else if (!e.altKey) {
              Undo.push(new UndoTourStopChange(Language.getLocalizedText(540, 'Move'), this._tour));
              overlay.set_y(overlay.get_y() + increment);
            }
          }
          return true;
        }
        break;
      case 34:
        if (e.altKey) {
          if (this._tour.get_currentTourstopIndex() < (this._tour.get_tourStops().length - 1)) {
            this._tour.set_currentTourstopIndex(this._tour.get_currentTourstopIndex() + 1) - 1;
            TourEdit._selectCurrent();
            TourEdit._ensureSelectedVisible();
          }
          return true;
        }
        break;
      case 33:
        if (e.altKey) {
          if (this._tour.get_currentTourstopIndex() > 0) {
            this._tour.set_currentTourstopIndex(this._tour.get_currentTourstopIndex() - 1) + 1;
            TourEdit._selectCurrent();
            TourEdit._ensureSelectedVisible();
          }
          return true;
        }
        break;
    }
    return false;
  },

  _selectNext: function () {
    if (this._tour == null || this._tour.get_currentTourStop() == null) {
      return;
    }
    this.set_focus(this._tour.get_currentTourStop().getNextOverlay(this.get_focus()));
    this.selection.setSelection(this.get_focus());
    OverlayList._updateOverlayList(this._tour.get_currentTourStop(), this.selection);
  },

  _selectLast: function () {
    if (this._tour == null || this._tour.get_currentTourStop() == null) {
      return;
    }
    this.set_focus(this._tour.get_currentTourStop().getPerviousOverlay(this.get_focus()));
    this.selection.setSelection(this.get_focus());
    OverlayList._updateOverlayList(this._tour.get_currentTourStop(), this.selection);
  },

  keyUp: function (sender, e) {
    if (TourEditor.currentEditor != null) {
      if (TourEditor.currentEditor.keyUp(sender, e)) {
        return true;
      }
    }
    return false;
  },

  addPicture: function (file) {
    if (this._tour == null || this._tour.get_currentTourStop() == null) {
      return false;
    }
    Undo.push(new UndoTourStopChange(Language.getLocalizedText(546, 'Insert Picture'), this._tour));
    var bmp = BitmapOverlay.create(this._tour.get_currentTourStop(), file);
    bmp.set_x(960);
    bmp.set_y(600);
    this._tour.get_currentTourStop().addOverlay(bmp);
    OverlayList._updateOverlayList(this._tour.get_currentTourStop(), this.selection);
    return true;
  },

  addFlipbook: function (filename) {
    return false;
  },

  addAudio: function (file, music) {
    if (this._tour == null || this._tour.get_currentTourStop() == null) {
      return false;
    }
    var audio = AudioOverlay.create(this._tour.get_currentTourStop(), file);
    audio.set_x(900);
    audio.set_y(600);
    if (music) {
      this._tour.get_currentTourStop().set_musicTrack(audio);
    } else {
      this._tour.get_currentTourStop().set_voiceTrack(audio);
    }
    return true;
  },

  addVideo: function (filename) {
    return true;
  },

  addText: function (p, textObject) {
    if (this._tour == null || this._tour.get_currentTourStop() == null) {
      return false;
    }
    var text = TextOverlay.create(textObject);
    text.set_color(textObject.foregroundColor);
    text.set_x(960);
    text.set_y(600);
    Undo.push(new UndoTourStopChange(Language.getLocalizedText(547, 'Insert Text'), this._tour));
    this._tour.get_currentTourStop().addOverlay(text);
    OverlayList._updateOverlayList(this._tour.get_currentTourStop(), this.selection);
    return true;
  },

  addOverlay: function (ol) {
    if (this._tour == null || this._tour.get_currentTourStop() == null) {
      return null;
    }
    if (ss.typeOf(ol) === ShapeOverlay) {
      var srcShapeOverlay = ol;
      if (srcShapeOverlay != null) {
        var shape = ShapeOverlay._create(this._tour.get_currentTourStop(), srcShapeOverlay.get_shapeType());
        shape.set_width(srcShapeOverlay.get_width());
        shape.set_height(srcShapeOverlay.get_height());
        shape.set_x(this._contextPoint.x);
        shape.set_y(this._contextPoint.y);
        shape.set_color(srcShapeOverlay.get_color());
        shape.set_rotationAngle(srcShapeOverlay.get_rotationAngle());
        this._tour.get_currentTourStop().addOverlay(shape);
        return shape;
      }
    } else if (ss.typeOf(ol) === TextOverlay) {
      var srcTxtOverlay = ol;
      if (srcTxtOverlay != null) {
        var text = TextOverlay.create(srcTxtOverlay.textObject);
        text.set_x(this._contextPoint.x);
        text.set_y(this._contextPoint.y);
        text.set_color(srcTxtOverlay.get_color());
        this._tour.get_currentTourStop().addOverlay(text);
        return text;
      }
    } else if (ss.typeOf(ol) === BitmapOverlay) {
      var srcBmpOverlay = ol;
      if (srcBmpOverlay != null) {
        var bitmap = srcBmpOverlay.copy(this._tour.get_currentTourStop());
        bitmap.set_x(this._contextPoint.x);
        bitmap.set_y(this._contextPoint.y);
        this._tour.get_currentTourStop().addOverlay(bitmap);
        return bitmap;
      }
    } else if (ss.typeOf(ol) === FlipbookOverlay) {
      var srcFlipbookOverlay = ol;
      if (srcFlipbookOverlay != null) {
        var bitmap = srcFlipbookOverlay.copy(this._tour.get_currentTourStop());
        bitmap.set_x(this._contextPoint.x);
        bitmap.set_y(this._contextPoint.y);
        this._tour.get_currentTourStop().addOverlay(bitmap);
        return bitmap;
      }
    }
    return null;
  },

  addShape: function (p, shapeType) {
    if (this._tour == null || this._tour.get_currentTourStop() == null) {
      return false;
    }
    Undo.push(new UndoTourStopChange(Language.getLocalizedText(548, 'Insert Shape'), this._tour));
    var shape = ShapeOverlay._create(this._tour.get_currentTourStop(), shapeType);
    shape.set_width(200);
    shape.set_height(200);
    if (shapeType === 4) {
      shape.set_height(shape.get_height() / 2);
    }
    if (shapeType === 5) {
      shape.set_height(12);
    }
    shape.set_x(960);
    shape.set_y(600);
    this._tour.get_currentTourStop().addOverlay(shape);
    this.set_focus(shape);
    this.selection.setSelection(this.get_focus());
    OverlayList._updateOverlayList(this._tour.get_currentTourStop(), this.selection);
    return true;
  },

  getCurrentColor: function () {
    if (this._tour == null || this._tour.get_currentTourStop() == null) {
      return this._defaultColor;
    }
    if (this.get_focus() != null) {
      return this.get_focus().get_color();
    } else {
      return this._defaultColor;
    }
  },

  setCurrentColor: function (color) {
    this._defaultColor = color;
    if (this._tour == null || this._tour.get_currentTourStop() == null) {
      return;
    }
    if (this.get_focus() != null) {
      this.get_focus().set_color(color);
    }
  },

  dispose: function () {
    if (this._contextMenu != null) {
      this._contextMenu._dispose();
      this._contextMenu = null;
    }
  },

  hover: function (pnt) {
    if (TourEditor.currentEditor != null) {
      if (TourEditor.currentEditor.hover(pnt)) {
        return true;
      }
    }
    return true;
  }
};

registerType("TourEditor", [TourEditor, TourEditor$, null, IUiController]);

// wwtlib.OverlayList

export function OverlayList() { }

OverlayList._updateOverlayList = function (currentTourStop, selection) { };

OverlayList._updateOverlayListSelection = function (selection) { };

var OverlayList$ = {};

registerType("OverlayList", [OverlayList, OverlayList$, null]);

// wwtlib.TourEdit

export function TourEdit() { }

TourEdit._ensureSelectedVisible = function () { };

TourEdit._selectCurrent = function () { };

TourEdit._undoStep = function () {
  if (Undo.peekAction()) {
    Undo.stepBack();
  }
};

TourEdit._redoStep = function () {
  if (Undo.peekRedoAction()) {
    Undo.stepForward();
  }
};

var TourEdit$ = {};

registerType("TourEdit", [TourEdit, TourEdit$, null]);

// wwtlib.SoundEditor

export function SoundEditor() {
  this.target = null;
}

var SoundEditor$ = {};

registerType("SoundEditor", [SoundEditor, SoundEditor$, null]);

// wwtlib.TourStopList

export function TourStopList() {
  this.tour = null;
  this.showAddButton = false;
  this.selectedItems = null;
  this.selectedItem = -1;
  this.refreshCallback = null;
  this.multipleSelection = false;
  this.hitType = false;
}

var TourStopList$ = {
  selectAll: function () {
    this.selectedItems = {};
    for (var i = 0; i < this.tour.get_tourStops().length; i++) {
      this.selectedItems[i] = this.tour.get_tourStops()[i];
    }
  },

  refresh: function () {
    if (this.refreshCallback != null) {
      this.refreshCallback();
    }
  },

  findItem: function (ts) {
    return -1;
  },

  ensureSelectedVisible: function () { },

  ensureAddVisible: function () { }
};

registerType("TourStopList", [TourStopList, TourStopList$, null]);

// wwtlib.TimeLine

export function TimeLine() { }

TimeLine.refreshUi = function () { };

var TimeLine$ = {};

registerType("TimeLine", [TimeLine, TimeLine$, null]);

// wwtlib.TourPlayer

export function TourPlayer() {
  this._overlayBlend = BlendState.create(false, 1000);
  this._tour = null;
  this._onTarget = false;
  this._currentMasterSlide = null;
  this._callStack = new ss.Stack();
  this._leaveSettingsWhenStopped = false;
}

TourPlayer._playing = false;
TourPlayer._switchedToFullScreen = false;
TourPlayer.noRestoreUIOnStop = false;

TourPlayer.get_playing = function () {
  return TourPlayer._playing;
};

TourPlayer.set_playing = function (value) {
  TourPlayer._playing = value;
  return value;
};

TourPlayer.add_tourEnded = function (value) {
  TourPlayer.__tourEnded = ss.bindAdd(TourPlayer.__tourEnded, value);
};

TourPlayer.remove_tourEnded = function (value) {
  TourPlayer.__tourEnded = ss.bindSub(TourPlayer.__tourEnded, value);
};

var TourPlayer$ = {
  render: function (renderContext) {
    if (this._tour == null || this._tour.get_currentTourStop() == null || !TourPlayer._playing) {
      return;
    }
    renderContext.save();
    this.updateSlideStates();
    if (!this._onTarget) {
      this._slideStartTime = ss.now();
      if (renderContext.onTarget(this.get_tour().get_currentTourStop().get_target())) {
        this._onTarget = true;
        this._overlayBlend.set_state(!this.get_tour().get_currentTourStop().get_fadeInOverlays());
        this._overlayBlend.set_targetState(true);
        if (this._tour.get_currentTourStop().get_musicTrack() != null) {
          this._tour.get_currentTourStop().get_musicTrack().seek(0);
          this._tour.get_currentTourStop().get_musicTrack().play();
        }
        if (this._tour.get_currentTourStop().get_voiceTrack() != null) {
          this._tour.get_currentTourStop().get_voiceTrack().seek(0);
          this._tour.get_currentTourStop().get_voiceTrack().play();
        }
        var caption = '';
        var $enum1 = ss.enumerate(this._tour.get_currentTourStop().get_overlays());
        while ($enum1.moveNext()) {
          var overlay = $enum1.current;
          if (overlay.get_name().toLowerCase() === 'caption') {
            var text = ss.safeCast(overlay, TextOverlay);
            if (text != null) {
              caption = text.textObject.text;
            }
          }
          overlay.play();
        }
        LayerManager.setVisibleLayerList(this._tour.get_currentTourStop().layers);
        if (this._tour.get_currentTourStop().get_endTarget() != null && this._tour.get_currentTourStop().get_endTarget().get_zoomLevel() !== -1) {
          if (this._tour.get_currentTourStop().get_target().get_type() === 4) {
          }
          renderContext.viewMover = new ViewMoverKenBurnsStyle(this._tour.get_currentTourStop().get_target().get_camParams(), this._tour.get_currentTourStop().get_endTarget().get_camParams(), this._tour.get_currentTourStop().get_duration() / 1000, this._tour.get_currentTourStop().get_startTime(), this._tour.get_currentTourStop().get_endTime(), this._tour.get_currentTourStop().get_interpolationType());
        }
        Settings.tourSettings = this._tour.get_currentTourStop();
        SpaceTimeController.set_now(this._tour.get_currentTourStop().get_startTime());
        SpaceTimeController.set_syncToClock(false);
        globalScriptInterface._fireSlideChanged(caption);
      }
    }
    if (renderContext.gl != null) {
      renderContext.setupMatricesOverlays();
      if (this._currentMasterSlide != null) {
        var $enum2 = ss.enumerate(this._currentMasterSlide.get_overlays());
        while ($enum2.moveNext()) {
          var overlay = $enum2.current;
          overlay.set_tweenFactor(1);
          overlay.draw3D(renderContext, false);
        }
      }
      if (this._onTarget) {
        var $enum3 = ss.enumerate(this._tour.get_currentTourStop().get_overlays());
        while ($enum3.moveNext()) {
          var overlay = $enum3.current;
          if (overlay.get_name().toLowerCase() !== 'caption' || globalScriptInterface.get_showCaptions()) {
            overlay.set_tweenFactor(CameraParameters.easeCurve(this._tour.get_currentTourStop().get_tweenPosition(), (overlay.get_interpolationType() === 5) ? this._tour.get_currentTourStop().get_interpolationType() : overlay.get_interpolationType()));
            overlay.draw3D(renderContext, false);
          }
        }
      }
      renderContext.restore();
    } else {
      renderContext.device.scale(renderContext.height / 1116, renderContext.height / 1116);
      var aspectOrig = 1920 / 1116;
      var aspectNow = renderContext.width / renderContext.height;
      renderContext.device.translate(-((1920 - (aspectNow * 1116)) / 2), 0);
      if (this._currentMasterSlide != null) {
        var $enum4 = ss.enumerate(this._currentMasterSlide.get_overlays());
        while ($enum4.moveNext()) {
          var overlay = $enum4.current;
          overlay.set_tweenFactor(1);
          overlay.draw3D(renderContext, false);
        }
      }
      if (this._onTarget) {
        var $enum5 = ss.enumerate(this._tour.get_currentTourStop().get_overlays());
        while ($enum5.moveNext()) {
          var overlay = $enum5.current;
          if (overlay.get_name().toLowerCase() !== 'caption' || globalScriptInterface.get_showCaptions()) {
            overlay.set_tweenFactor(CameraParameters.easeCurve(this._tour.get_currentTourStop().get_tweenPosition(), (overlay.get_interpolationType() === 5) ? this._tour.get_currentTourStop().get_interpolationType() : overlay.get_interpolationType()));
            overlay.draw3D(renderContext, false);
          }
        }
      }
      else {
        var i = 0;
      }
      renderContext.restore();
    }
  },

  get_tour: function () {
    return this._tour;
  },

  set_tour: function (value) {
    this._tour = value;
    return value;
  },

  nextSlide: function () {
    if (this._tour.get_currentTourStop() != null) {
      if (!this._tour.get_currentTourStop().get_masterSlide()) {
        if (this._tour.get_currentTourStop().get_musicTrack() != null) {
          this._tour.get_currentTourStop().get_musicTrack().stop();
        }
        if (this._tour.get_currentTourStop().get_voiceTrack() != null) {
          this._tour.get_currentTourStop().get_voiceTrack().stop();
        }
        var $enum1 = ss.enumerate(this._tour.get_currentTourStop().get_overlays());
        while ($enum1.moveNext()) {
          var overlay = $enum1.current;
          overlay.stop();
        }
      }
      else {
        this._currentMasterSlide = this._tour.get_currentTourStop();
      }
    }
    if (this._tour.get_currentTourstopIndex() < (this._tour.get_tourStops().length - 1) || this._tour.get_currentTourStop().get_isLinked()) {
      if (this._tour.get_currentTourStop().get_endTarget() != null) {
        globalWWTControl.gotoTargetFull(false, true, this._tour.get_currentTourStop().get_endTarget().get_camParams(), this._tour.get_currentTourStop().get_target().get_studyImageset(), this._tour.get_currentTourStop().get_target().get_backgroundImageset());
        globalWWTControl.set__mover(null);
      }
      this._onTarget = false;
      if (this._tour.get_currentTourStop().get_isLinked()) {
        try {
          switch (this._tour.get_currentTourStop().get_nextSlide()) {
            case 'Return':
              if (this._callStack.count > 0) {
                this.playFromTourstop(this._tour.get_tourStops()[this._callStack.pop()]);
              }
              else {
                this._tour.set_currentTourstopIndex(this._tour.get_tourStops().length - 1);
              }
              break;
            default:
              this.playFromTourstop(this._tour.get_tourStops()[this._tour.getTourStopIndexByID(this._tour.get_currentTourStop().get_nextSlide())]);
              break;
          }
        }
        catch ($e2) {
          if (this._tour.get_currentTourstopIndex() < (this._tour.get_tourStops().length - 1)) {
            this._tour.set_currentTourstopIndex(this._tour.get_currentTourstopIndex() + 1) - 1;
          }
        }
      }
      else {
        this._tour.set_currentTourstopIndex(this._tour.get_currentTourstopIndex() + 1) - 1;
      }
      if (this._currentMasterSlide != null && this._tour.get_currentTourStop().get_masterSlide()) {
        this._stopCurrentMaster();
      }
      var instant = false;
      switch (this._tour.get_currentTourStop().get__transition()) {
        case 0:
          break;
        case 1:
          instant = true;
          break;
        case 2:
          instant = true;
          break;
        case 3:
          instant = true;
          break;
        case 5:
          instant = true;
          break;
        case 4:
          instant = true;
          break;
        default:
          break;
      }
      globalWWTControl.gotoTarget(this._tour.get_currentTourStop().get_target(), false, instant, false);
      this._slideStartTime = ss.now();
      Settings.tourSettings = this._tour.get_currentTourStop();
      SpaceTimeController.set_now(this._tour.get_currentTourStop().get_startTime());
      SpaceTimeController.set_syncToClock(false);
    } else {
      this._stopCurrentMaster();
      TourPlayer._playing = false;
      if (Settings.get_current().autoRepeatTour) {
        this._tour.set_currentTourstopIndex(-1);
        this.play();
      }
      else {
        globalWWTControl._freezeView();
        if (TourPlayer.__tourEnded != null) {
          TourPlayer.__tourEnded(this, new ss.EventArgs());
        }
        globalWWTControl._hideUI(false);
        globalScriptInterface._fireTourEnded();
      }
    }
  },

  _stopCurrentMaster: function () {
    if (this._currentMasterSlide != null) {
      if (this._currentMasterSlide.get_musicTrack() != null) {
        this._currentMasterSlide.get_musicTrack().stop();
      }
      if (this._currentMasterSlide.get_voiceTrack() != null) {
        this._currentMasterSlide.get_voiceTrack().stop();
      }
      var $enum1 = ss.enumerate(this._currentMasterSlide.get_overlays());
      while ($enum1.moveNext()) {
        var overlay = $enum1.current;
        overlay.stop();
      }
      this._currentMasterSlide = null;
    }
  },

  get_leaveSettingsWhenStopped: function () {
    return this._leaveSettingsWhenStopped;
  },

  set_leaveSettingsWhenStopped: function (value) {
    this._leaveSettingsWhenStopped = value;
    return value;
  },

  play: function () {
    if (this._tour == null) {
      return;
    }
    if (TourPlayer._playing) {
      this.stop(true);
    } else {
      TourPlayer._playing = true;
    }
    globalWWTControl._hideUI(true);
    TourPlayer._playing = true;
    if (this._tour.get_tourStops().length > 0) {
      this._onTarget = false;
      if (this._tour.get_currentTourstopIndex() === -1) {
        this._tour.set_currentTourStop(this._tour.get_tourStops()[0]);
      }
      var $enum1 = ss.enumerate(this._tour.get_tourStops());
      while ($enum1.moveNext()) {
        var stop = $enum1.current;
        if (stop.get_musicTrack() != null) {
          stop.get_musicTrack().prepMultimedia();
        }
        if (stop.get_voiceTrack() != null) {
          stop.get_voiceTrack().prepMultimedia();
        }
        var $enum2 = ss.enumerate(stop.get_overlays());
        while ($enum2.moveNext()) {
          var overlay = $enum2.current;
          overlay.prepMultimedia();
        }
      }
      if (this._tour.get_currentTourstopIndex() > 0) {
        this._playMasterForCurrent();
      }
      globalWWTControl.gotoTarget(this._tour.get_currentTourStop().get_target(), false, true, false);
    }
    this._slideStartTime = ss.now();
    TourPlayer._playing = true;
  },

  _playMasterForCurrent: function () {
    if (!this._tour.get_currentTourStop().get_masterSlide()) {
      var currentMaster = this._tour.elapsedTimeSinceLastMaster(this._tour.get_currentTourstopIndex());
      if (currentMaster != null) {
        var elapsed = currentMaster.duration;
        this._currentMasterSlide = currentMaster.master;
        if (this._currentMasterSlide.get_musicTrack() != null) {
          this._currentMasterSlide.get_musicTrack().seek(elapsed);
          this._currentMasterSlide.get_musicTrack().play();
        }
        if (this._currentMasterSlide.get_voiceTrack() != null) {
          this._currentMasterSlide.get_voiceTrack().seek(elapsed);
          this._currentMasterSlide.get_voiceTrack().play();
        }
        var $enum1 = ss.enumerate(this._currentMasterSlide.get_overlays());
        while ($enum1.moveNext()) {
          var overlay = $enum1.current;
          overlay.seek(elapsed);
          overlay.play();
        }
      }
    }
  },

  stop: function (noSwitchBackFullScreen) {
    if (TourPlayer._switchedToFullScreen && !noSwitchBackFullScreen) {
    }
    if (!this._leaveSettingsWhenStopped) {
      Settings.tourSettings = null;
    }
    TourPlayer._playing = false;
    if (this._tour.get_currentTourStop() != null) {
      if (this._tour.get_currentTourStop().get_musicTrack() != null) {
        this._tour.get_currentTourStop().get_musicTrack().stop();
      }
      if (this._tour.get_currentTourStop().get_voiceTrack() != null) {
        this._tour.get_currentTourStop().get_voiceTrack().stop();
      }
      var $enum1 = ss.enumerate(this._tour.get_currentTourStop().get_overlays());
      while ($enum1.moveNext()) {
        var overlay = $enum1.current;
        overlay.stop();
      }
    }
    if (this._currentMasterSlide != null) {
      if (this._currentMasterSlide.get_musicTrack() != null) {
        this._currentMasterSlide.get_musicTrack().stop();
      }
      if (this._currentMasterSlide.get_voiceTrack() != null) {
        this._currentMasterSlide.get_voiceTrack().stop();
      }
      var $enum2 = ss.enumerate(this._currentMasterSlide.get_overlays());
      while ($enum2.moveNext()) {
        var overlay = $enum2.current;
        overlay.stop();
      }
    }
    globalWWTControl._hideUI(TourPlayer.noRestoreUIOnStop);
    globalScriptInterface._fireTourEnded();
  },

  updateSlideStates: function () {
    var slideChanging = false;
    var slideElapsedTime = ss.now() - this._slideStartTime;
    if (slideElapsedTime > this._tour.get_currentTourStop().get_duration() && TourPlayer._playing) {
      this.nextSlide();
      slideChanging = true;
    }
    slideElapsedTime = ss.now() - this._slideStartTime;
    if (this._tour.get_currentTourStop() != null) {
      this._tour.get_currentTourStop().set_tweenPosition(Math.min(1, (slideElapsedTime / this._tour.get_currentTourStop().get_duration())));
      this._tour.get_currentTourStop().faderOpacity = 0;
      var elapsedSeconds = this._tour.get_currentTourStop().get_tweenPosition() * this._tour.get_currentTourStop().get_duration() / 1000;
      if (slideChanging) {
        globalWWTControl.set_crossFadeFrame(false);
      }
      switch (this._tour.get_currentTourStop().get__transition()) {
        case 0:
          this._tour.get_currentTourStop().faderOpacity = 0;
          globalWWTControl.set_crossFadeFrame(false);
          break;
        case 2:
          if (slideChanging) {
          }
          if (elapsedSeconds < (elapsedSeconds - this._tour.get_currentTourStop().get__transitionHoldTime())) {
            globalWWTControl.set_crossFadeFrame(true);
            this._tour.get_currentTourStop().faderOpacity = 1;
          }
          else {
            this._tour.get_currentTourStop().faderOpacity = 0;
            globalWWTControl.set_crossFadeFrame(false);
          }
          break;
        case 1:
          globalWWTControl.set_crossFadeFrame(true);
          var opacity = Math.max(0, 1 - Math.min(1, (elapsedSeconds - this._tour.get_currentTourStop().get__transitionHoldTime()) / this._tour.get_currentTourStop().get__transitionTime()));
          this._tour.get_currentTourStop().faderOpacity = opacity;
          if (slideChanging) {
          }
          break;
        case 3:
        case 4:
          globalWWTControl.set_crossFadeFrame(false);
          var opacity = Math.max(0, 1 - Math.max(0, elapsedSeconds - this._tour.get_currentTourStop().get__transitionHoldTime()) / this._tour.get_currentTourStop().get__transitionTime());
          this._tour.get_currentTourStop().faderOpacity = opacity;
          break;
        case 5:
          globalWWTControl.set_crossFadeFrame(false);
          break;
        default:
          break;
      }
      if (!this._tour.get_currentTourStop().get_isLinked() && this._tour.get_currentTourstopIndex() < (this._tour.get_tourStops().length - 1)) {
        var nextTrans = this._tour.get_tourStops()[this._tour.get_currentTourstopIndex() + 1].get__transition();
        var nextTransTime = this._tour.get_tourStops()[this._tour.get_currentTourstopIndex() + 1].get__transitionOutTime();
        switch (nextTrans) {
          case 5:
          case 3:
            if (!this._tour.get_currentTourStop().faderOpacity) {
              globalWWTControl.set_crossFadeFrame(false);
              var opacity = Math.max(0, 1 - Math.min(1, ((this._tour.get_currentTourStop().get_duration() / 1000) - elapsedSeconds) / nextTransTime));
              this._tour.get_currentTourStop().faderOpacity = opacity;
            }
            break;
          default:
            break;
        }
      }
    }
  },

  updateTweenPosition: function (tween) {
    var slideElapsedTime = ss.now() - this._slideStartTime;
    if (tween > -1) {
      return this._tour.get_currentTourStop().set_tweenPosition(Math.min(1, tween));
    } else {
      return this._tour.get_currentTourStop().set_tweenPosition(Math.min(1, (slideElapsedTime / this._tour.get_currentTourStop().get_duration())));
    }
  },

  close: function () {
    if (this._tour != null) {
      if (TourPlayer.get_playing()) {
        this.stop(TourPlayer._switchedToFullScreen);
      }
      this._tour = null;
    }
  },

  mouseDown: function (sender, e) {
    var location;
    location = this.pointToView(Vector2d.create(e.offsetX, e.offsetY));
    if (this._tour == null || this._tour.get_currentTourStop() == null) {
      return false;
    }
    for (var i = this._tour.get_currentTourStop().get_overlays().length - 1; i >= 0; i--) {
      if (this._tour.get_currentTourStop().get_overlays()[i].hitTest(location)) {
        if (!ss.emptyString(this._tour.get_currentTourStop().get_overlays()[i].get_url())) {
          var linkItem = this._tour.get_currentTourStop().get_overlays()[i];
          Util._openUrl(linkItem.get_url());
          return true;
        }
        if (!ss.emptyString(this._tour.get_currentTourStop().get_overlays()[i].get_linkID())) {
          this._callStack.push(this._tour.get_currentTourstopIndex());
          this.playFromTourstop(this._tour.get_tourStops()[this._tour.getTourStopIndexByID(this._tour.get_currentTourStop().get_overlays()[i].get_linkID())]);
          return true;
        }
      }
    }
    return false;
  },

  mouseUp: function (sender, e) {
    return false;
  },

  mouseMove: function (sender, e) {
    var location;
    try {
      location = this.pointToView(Vector2d.create(e.offsetX, e.offsetY));
    }
    catch ($e1) {
      return false;
    }
    if (this._tour == null || this._tour.get_currentTourStop() == null) {
      return false;
    }
    for (var i = this._tour.get_currentTourStop().get_overlays().length - 1; i >= 0; i--) {
      if (this._tour.get_currentTourStop().get_overlays()[i].hitTest(location) && (!ss.emptyString(this._tour.get_currentTourStop().get_overlays()[i].get_url()) || !ss.emptyString(this._tour.get_currentTourStop().get_overlays()[i].get_linkID()))) {
        return true;
      }
    }
    return false;
  },

  mouseClick: function (sender, e) {
    return false;
  },

  click: function (sender, e) {
    return false;
  },

  mouseDoubleClick: function (sender, e) {
    return false;
  },

  keyDown: function (sender, e) {
    switch (e.keyCode) {
      case 27:
        this.stop(TourPlayer._switchedToFullScreen);
        globalWWTControl._closeTour();
        return true;
      case 32:
        this.pauseTour();
        return true;
      case 39:
        this._playNextSlide();
        return true;
      case 37:
        this._playPreviousSlide();
        return true;
      case 35:
        if (this._tour.get_tourStops().length > 0) {
          this.playFromTourstop(this._tour.get_tourStops()[this._tour.get_tourStops().length - 1]);
        }
        return true;
      case 36:
        if (this._tour.get_tourStops().length > 0) {
          this.playFromTourstop(this._tour.get_tourStops()[0]);
        }
        return true;
    }
    return false;
  },

  _playNextSlide: function () {
    if ((this._tour.get_currentTourstopIndex() < this._tour.get_tourStops().length - 1) && this._tour.get_tourStops().length > 0) {
      this.playFromTourstop(this._tour.get_tourStops()[this._tour.get_currentTourstopIndex() + 1]);
    }
  },

  _playPreviousSlide: function () {
    if (this._tour.get_currentTourstopIndex() > 0) {
      this.playFromTourstop(this._tour.get_tourStops()[this._tour.get_currentTourstopIndex() - 1]);
    }
  },

  playFromTourstop: function (tourStop) {
    this.stop(true);
    this._tour.set_currentTourStop(tourStop);
    globalWWTControl.gotoTarget(this._tour.get_currentTourStop().get_target(), false, true, false);
    SpaceTimeController.set_now(this._tour.get_currentTourStop().get_startTime());
    SpaceTimeController.set_syncToClock(false);
    this.play();
  },

  pauseTour: function () {
    if (TourPlayer._playing) {
      this.stop(TourPlayer._switchedToFullScreen);
      globalWWTControl._freezeView();
      globalScriptInterface._fireTourPaused();
    } else {
      this.play();
      globalScriptInterface._fireTourResume();
    }
  },

  keyUp: function (sender, e) {
    return false;
  },

  hover: function (pnt) {
    if (TourPlayer._playing) {
      return true;
    }
    return false;
  },

  pointToView: function (pnt) {
    var clientHeight = globalWWTControl.canvas.height;
    var clientWidth = globalWWTControl.canvas.width;
    var viewWidth = (clientWidth / clientHeight) * 1116;
    var x = ((pnt.x) / (clientWidth) * viewWidth) - ((viewWidth - 1920) / 2);
    var y = (pnt.y) / clientHeight * 1116;
    return Vector2d.create(x, y);
  }
};

registerType("TourPlayer", [TourPlayer, TourPlayer$, null, IUiController]);

// wwtlib.MasterTime

export function MasterTime(master, duration) {
  this.duration = 0;
  this.master = master;
  this.duration = duration;
}

var MasterTime$ = {};

registerType("MasterTime", [MasterTime, MasterTime$, null]);

// wwtlib.TourStop

export function TourStop() {
  this._tourStopType = 0;
  this._keyFramed = false;
  this._tweenPosition = 0;
  this.faderOpacity = 0;
  this._owner = null;
  this._transition = 0;
  this._transitionTime = 2;
  this._transitionHoldTime = 4;
  this._transitionOutTime = 2;
  this._nextSlide = 'Next';
  this._fadeInOverlays = false;
  this._masterSlide = false;
  this._id = '';
  this._description = '';
  this._name = '';
  this._duration = 10000;
  this._interpolationType = 0;
  this._hasLocation = true;
  this._hasTime = true;
  this._startTime = SpaceTimeController.get_now();
  this._endTime = SpaceTimeController.get_now();
  this._actualPlanetScale = Settings.get_current().get_actualPlanetScale();
  this._locationAltitude = Settings.get_current().get_locationAltitude();
  this._locationLat = Settings.get_current().get_locationLat();
  this._locationLng = Settings.get_current().get_locationLng();
  this._showClouds = Settings.get_current().get_showClouds();
  this._showConstellationBoundries = Settings.get_current().get_showConstellationBoundries();
  this._showConstellationFigures = Settings.get_current().get_showConstellationFigures();
  this._showConstellationSelection = Settings.get_current().get_showConstellationSelection();
  this._showEcliptic = Settings.get_current().get_showEcliptic();
  this._showElevationModel = Settings.get_current().get_showElevationModel();
  this._showFieldOfView = Settings.get_current().get_showFieldOfView();
  this._showGrid = Settings.get_current().get_showGrid();
  this._showHorizon = Settings.get_current().get_showHorizon();
  this._showHorizonPanorama = Settings.get_current().get_showHorizonPanorama();
  this._showMoonsAsPointSource = Settings.get_current().get_showMoonsAsPointSource();
  this._showSolarSystem = Settings.get_current().get_showSolarSystem();
  this._fovTelescope = Settings.get_current().get_fovTelescope();
  this._fovEyepiece = Settings.get_current().get_fovEyepiece();
  this._fovCamera = Settings.get_current().get_fovCamera();
  this._localHorizonMode = Settings.get_current().get_localHorizonMode();
  this._galacticMode = Settings.get_current().get_galacticMode();
  this._solarSystemStars = Settings.get_current().get_solarSystemStars();
  this._solarSystemMilkyWay = Settings.get_current().get_solarSystemMilkyWay();
  this._solarSystemCosmos = Settings.get_current().get_solarSystemCosmos();
  this._solarSystemOrbits = Settings.get_current().get_solarSystemOrbits();
  this._solarSystemOverlays = Settings.get_current().get_solarSystemOverlays();
  this._solarSystemLighting = Settings.get_current().get_solarSystemLighting();
  this._solarSystemScale = Settings.get_current().get_solarSystemScale();
  this._solarSystemMultiRes = Settings.get_current().get_solarSystemMultiRes();
  this._showEquatorialGridText = Settings.get_current().get_showEquatorialGridText();
  this._showGalacticGrid = Settings.get_current().get_showGalacticGrid();
  this._showGalacticGridText = Settings.get_current().get_showGalacticGridText();
  this._showEclipticGrid = Settings.get_current().get_showEclipticGrid();
  this._showEclipticGridText = Settings.get_current().get_showEclipticGridText();
  this._showEclipticOverviewText = Settings.get_current().get_showEclipticOverviewText();
  this._showAltAzGrid = Settings.get_current().get_showAltAzGrid();
  this._showAltAzGridText = Settings.get_current().get_showAltAzGridText();
  this._showPrecessionChart = Settings.get_current().get_showPrecessionChart();
  this._showConstellationPictures = Settings.get_current().get_showConstellationPictures();
  this._showConstellationLabels = Settings.get_current().get_showConstellationLabels();
  this._solarSystemCMB = Settings.get_current().get_solarSystemCMB();
  this._solarSystemMinorPlanets = Settings.get_current().get_solarSystemMinorPlanets();
  this._solarSystemPlanets = Settings.get_current().get_solarSystemPlanets();
  this._showEarthSky = Settings.get_current().get_showEarthSky();
  this._solarSystemMinorOrbits = Settings.get_current().get_solarSystemMinorOrbits();
  this._constellationsEnabled = '';
  this._constellationFiguresFilter = Settings.get_current().get_constellationFiguresFilter().clone();
  this._constellationBoundariesFilter = Settings.get_current().get_constellationBoundariesFilter().clone();
  this._constellationNamesFilter = Settings.get_current().get_constellationNamesFilter().clone();
  this._constellationArtFilter = Settings.get_current().get_constellationArtFilter().clone();
  this._showSkyOverlays = Settings.get_current().get_showSkyOverlays();
  this._showConstellations = Settings.get_current().get_showConstellations();
  this._showSkyNode = Settings.get_current().get_showSkyNode();
  this._showSkyGrids = Settings.get_current().get_showSkyGrids();
  this._showSkyOverlaysIn3d = Settings.get_current().get_showSkyOverlaysIn3d();
  this._earthCutawayView = Settings.get_current().get_earthCutawayView();
  this._showISSModel = Settings.get_current().get_showISSModel();
  this._milkyWayModel = Settings.get_current().get_milkyWayModel();
  this._minorPlanetsFilter = Settings.get_current().get_minorPlanetsFilter();
  this._planetOrbitsFilter = Settings.get_current().get_planetOrbitsFilter();
  this._thumbnailString = '';
  this._thumbnail = null;
  this.layers = {};
  this._overlays = [];
  this._musicTrack = null;
  this._voiceTrack = null;
  this._eclipticGridColor = Colors.get_green();
  this._galacticGridColor = Colors.get_cyan();
  this._altAzGridColor = Colors.get_magenta();
  this._precessionChartColor = Colors.get_orange();
  this._eclipticColor = Colors.get_blue();
  this._equatorialGridColor = Colors.get_white();
  this._constellationLabelsHeight = 80;
  this._id = Guid.newGuid().toString();
}

TourStop.clipboardFormat = 'WorldWideTelescope.Slide';

TourStop.create = function (target) {
  var ts = new TourStop();
  ts._target = target;
  return ts;
};

TourStop.getXmlText = function (ts) {
  var writer = new XmlTextWriter();
  writer._writeProcessingInstruction('xml', "version='1.0' encoding='UTF-8'");
  ts._saveToXml(writer, true);
  writer._close();
  return writer.body;
};

TourStop._fromXml = function (owner, tourStop) {
  try {
    var newTourStop = new TourStop();
    newTourStop._owner = owner;
    newTourStop.set_id(tourStop.attributes.getNamedItem('Id').nodeValue);
    newTourStop.set_name(tourStop.attributes.getNamedItem('Name').nodeValue);
    newTourStop.set_description(tourStop.attributes.getNamedItem('Description').nodeValue);
    newTourStop._thumbnailString = tourStop.attributes.getNamedItem('Thumbnail').nodeValue;
    newTourStop._duration = Util.parseTimeSpan(tourStop.attributes.getNamedItem('Duration').nodeValue);
    if (tourStop.attributes.getNamedItem('Master') != null) {
      newTourStop._masterSlide = ss.boolean(tourStop.attributes.getNamedItem('Master').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('NextSlide') != null) {
      newTourStop._nextSlide = tourStop.attributes.getNamedItem('NextSlide').nodeValue;
    }
    if (tourStop.attributes.getNamedItem('InterpolationType') != null) {
      newTourStop.set_interpolationType(Enums.parse('InterpolationType', tourStop.attributes.getNamedItem('InterpolationType').nodeValue));
    }
    newTourStop._fadeInOverlays = true;
    if (tourStop.attributes.getNamedItem('FadeInOverlays') != null) {
      newTourStop._fadeInOverlays = ss.boolean(tourStop.attributes.getNamedItem('FadeInOverlays').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('Transition') != null) {
      newTourStop._transition = Enums.parse('TransitionType', tourStop.attributes.getNamedItem('Transition').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('HasLocation') != null) {
      newTourStop._hasLocation = ss.boolean(tourStop.attributes.getNamedItem('HasLocation').nodeValue);
    }
    if (newTourStop._hasLocation) {
      if (tourStop.attributes.getNamedItem('LocationAltitude') != null) {
        newTourStop._locationAltitude = parseFloat(tourStop.attributes.getNamedItem('LocationAltitude').nodeValue);
      }
      if (tourStop.attributes.getNamedItem('LocationLat') != null) {
        newTourStop._locationLat = parseFloat(tourStop.attributes.getNamedItem('LocationLat').nodeValue);
      }
      if (tourStop.attributes.getNamedItem('LocationLng') != null) {
        newTourStop._locationLng = parseFloat(tourStop.attributes.getNamedItem('LocationLng').nodeValue);
      }
    }
    if (tourStop.attributes.getNamedItem('HasTime') != null) {
      newTourStop._hasTime = ss.boolean(tourStop.attributes.getNamedItem('HasTime').nodeValue);
      if (newTourStop._hasTime) {
        if (tourStop.attributes.getNamedItem('StartTime') != null) {
          newTourStop._startTime = ss.date(tourStop.attributes.getNamedItem('StartTime').nodeValue + ' UTC');
        }
        if (tourStop.attributes.getNamedItem('EndTime') != null) {
          newTourStop._endTime = ss.date(tourStop.attributes.getNamedItem('EndTime').nodeValue + ' UTC');
        }
      }
    }
    if (tourStop.attributes.getNamedItem('ActualPlanetScale') != null) {
      newTourStop._actualPlanetScale = ss.boolean(tourStop.attributes.getNamedItem('ActualPlanetScale').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('ShowClouds') != null) {
      newTourStop._showClouds = ss.boolean(tourStop.attributes.getNamedItem('ShowClouds').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('ShowConstellationBoundries') != null) {
      newTourStop._showConstellationBoundries = ss.boolean(tourStop.attributes.getNamedItem('ShowConstellationBoundries').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('ShowConstellationFigures') != null) {
      newTourStop._showConstellationFigures = ss.boolean(tourStop.attributes.getNamedItem('ShowConstellationFigures').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('ShowConstellationSelection') != null) {
      newTourStop._showConstellationSelection = ss.boolean(tourStop.attributes.getNamedItem('ShowConstellationSelection').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('ShowEcliptic') != null) {
      newTourStop._showEcliptic = ss.boolean(tourStop.attributes.getNamedItem('ShowEcliptic').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('EclipticColor') != null) {
      newTourStop._eclipticColor = Color.load(tourStop.attributes.getNamedItem('EclipticColor').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('ShowElevationModel') != null) {
      newTourStop._showElevationModel = ss.boolean(tourStop.attributes.getNamedItem('ShowElevationModel').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('ShowFieldOfView') != null) {
      newTourStop._showFieldOfView = ss.boolean(tourStop.attributes.getNamedItem('ShowFieldOfView').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('ShowGrid') != null) {
      newTourStop._showGrid = ss.boolean(tourStop.attributes.getNamedItem('ShowGrid').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('ShowHorizon') != null) {
      newTourStop._showHorizon = ss.boolean(tourStop.attributes.getNamedItem('ShowHorizon').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('ShowHorizonPanorama') != null) {
      newTourStop._showHorizonPanorama = ss.boolean(tourStop.attributes.getNamedItem('ShowHorizonPanorama').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('ShowMoonsAsPointSource') != null) {
      newTourStop._showMoonsAsPointSource = ss.boolean(tourStop.attributes.getNamedItem('ShowMoonsAsPointSource').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('ShowSolarSystem') != null) {
      newTourStop._showSolarSystem = ss.boolean(tourStop.attributes.getNamedItem('ShowSolarSystem').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('FovTelescope') != null) {
      newTourStop._fovTelescope = parseInt(tourStop.attributes.getNamedItem('FovTelescope').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('FovEyepiece') != null) {
      newTourStop._fovEyepiece = parseInt(tourStop.attributes.getNamedItem('FovEyepiece').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('FovCamera') != null) {
      newTourStop._fovCamera = parseInt(tourStop.attributes.getNamedItem('FovCamera').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('LocalHorizonMode') != null) {
      newTourStop._localHorizonMode = ss.boolean(tourStop.attributes.getNamedItem('LocalHorizonMode').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('GalacticMode') != null) {
      newTourStop._galacticMode = ss.boolean(tourStop.attributes.getNamedItem('GalacticMode').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('SolarSystemStars') != null) {
      newTourStop._solarSystemStars = ss.boolean(tourStop.attributes.getNamedItem('SolarSystemStars').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('SolarSystemMilkyWay') != null) {
      newTourStop._solarSystemMilkyWay = ss.boolean(tourStop.attributes.getNamedItem('SolarSystemMilkyWay').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('SolarSystemCosmos') != null) {
      newTourStop._solarSystemCosmos = ss.boolean(tourStop.attributes.getNamedItem('SolarSystemCosmos').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('SolarSystemOrbits') != null) {
      newTourStop._solarSystemOrbits = ss.boolean(tourStop.attributes.getNamedItem('SolarSystemOrbits').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('SolarSystemOverlays') != null) {
      newTourStop._solarSystemOverlays = ss.boolean(tourStop.attributes.getNamedItem('SolarSystemOverlays').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('SolarSystemLighting') != null) {
      newTourStop._solarSystemLighting = ss.boolean(tourStop.attributes.getNamedItem('SolarSystemLighting').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('SolarSystemScale') != null) {
      newTourStop._solarSystemScale = parseInt(tourStop.attributes.getNamedItem('SolarSystemScale').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('SolarSystemMultiRes') != null) {
      newTourStop._solarSystemMultiRes = ss.boolean(tourStop.attributes.getNamedItem('SolarSystemMultiRes').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('ShowEquatorialGridText') != null) {
      newTourStop._showEquatorialGridText = ss.boolean(tourStop.attributes.getNamedItem('ShowEquatorialGridText').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('EquatorialGridColor') != null) {
      newTourStop._equatorialGridColor = Color.load(tourStop.attributes.getNamedItem('EquatorialGridColor').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('ShowGalacticGrid') != null) {
      newTourStop._showGalacticGrid = ss.boolean(tourStop.attributes.getNamedItem('ShowGalacticGrid').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('ShowGalacticGridText') != null) {
      newTourStop._showGalacticGridText = ss.boolean(tourStop.attributes.getNamedItem('ShowGalacticGridText').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('GalacticGridColor') != null) {
      newTourStop._galacticGridColor = Color.load(tourStop.attributes.getNamedItem('GalacticGridColor').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('ShowEclipticGrid') != null) {
      newTourStop._showEclipticGrid = ss.boolean(tourStop.attributes.getNamedItem('ShowEclipticGrid').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('ShowEclipticGridText') != null) {
      newTourStop._showEclipticGridText = ss.boolean(tourStop.attributes.getNamedItem('ShowEclipticGridText').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('EclipticGridColor') != null) {
      newTourStop._eclipticGridColor = Color.load(tourStop.attributes.getNamedItem('EclipticGridColor').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('ShowEclipticOverviewText') != null) {
      newTourStop._showEclipticOverviewText = ss.boolean(tourStop.attributes.getNamedItem('ShowEclipticOverviewText').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('ShowAltAzGrid') != null) {
      newTourStop._showAltAzGrid = ss.boolean(tourStop.attributes.getNamedItem('ShowAltAzGrid').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('ShowAltAzGridText') != null) {
      newTourStop._showAltAzGridText = ss.boolean(tourStop.attributes.getNamedItem('ShowAltAzGridText').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('AltAzGridColor') != null) {
      newTourStop._altAzGridColor = Color.load(tourStop.attributes.getNamedItem('AltAzGridColor').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('ShowPrecessionChart') != null) {
      newTourStop._showPrecessionChart = ss.boolean(tourStop.attributes.getNamedItem('ShowPrecessionChart').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('PrecessionChartColor') != null) {
      newTourStop._precessionChartColor = Color.load(tourStop.attributes.getNamedItem('PrecessionChartColor').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('ShowConstellationPictures') != null) {
      newTourStop._showConstellationPictures = ss.boolean(tourStop.attributes.getNamedItem('ShowConstellationPictures').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('ShowConstellationLabels') != null) {
      newTourStop._showConstellationLabels = ss.boolean(tourStop.attributes.getNamedItem('ShowConstellationLabels').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('SolarSystemCMB') != null) {
      newTourStop._solarSystemCMB = ss.boolean(tourStop.attributes.getNamedItem('SolarSystemCMB').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('SolarSystemMinorPlanets') != null) {
      newTourStop._solarSystemMinorPlanets = ss.boolean(tourStop.attributes.getNamedItem('SolarSystemMinorPlanets').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('SolarSystemPlanets') != null) {
      newTourStop._solarSystemPlanets = ss.boolean(tourStop.attributes.getNamedItem('SolarSystemPlanets').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('ShowEarthSky') != null) {
      newTourStop._showEarthSky = ss.boolean(tourStop.attributes.getNamedItem('ShowEarthSky').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('SolarSystemMinorOrbits') != null) {
      newTourStop._solarSystemMinorOrbits = ss.boolean(tourStop.attributes.getNamedItem('SolarSystemMinorOrbits').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('ShowSkyOverlays') != null) {
      newTourStop._showSkyOverlays = ss.boolean(tourStop.attributes.getNamedItem('ShowSkyOverlays').nodeValue);
    } else {
      newTourStop._showSkyOverlays = true;
    }
    if (tourStop.attributes.getNamedItem('ShowConstellations') != null) {
      newTourStop._showConstellations = ss.boolean(tourStop.attributes.getNamedItem('ShowConstellations').nodeValue);
    } else {
      newTourStop._showConstellations = true;
    }
    if (tourStop.attributes.getNamedItem('ShowSkyNode') != null) {
      newTourStop._showSkyNode = ss.boolean(tourStop.attributes.getNamedItem('ShowSkyNode').nodeValue);
    } else {
      newTourStop._showSkyNode = true;
    }
    if (tourStop.attributes.getNamedItem('ShowSkyGrids') != null) {
      newTourStop._showSkyGrids = ss.boolean(tourStop.attributes.getNamedItem('ShowSkyGrids').nodeValue);
    } else {
      newTourStop._showSkyGrids = true;
    }
    if (tourStop.attributes.getNamedItem('ShowSkyOverlaysIn3d') != null) {
      newTourStop._showSkyOverlaysIn3d = ss.boolean(tourStop.attributes.getNamedItem('ShowSkyOverlaysIn3d').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('EarthCutawayView') != null) {
      newTourStop._earthCutawayView = ss.boolean(tourStop.attributes.getNamedItem('EarthCutawayView').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('ShowISSModel') != null) {
      newTourStop._showISSModel = ss.boolean(tourStop.attributes.getNamedItem('ShowISSModel').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('MilkyWayModel') != null) {
      newTourStop._milkyWayModel = ss.boolean(tourStop.attributes.getNamedItem('MilkyWayModel').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('ConstellationBoundariesFilter') != null) {
      newTourStop._constellationBoundariesFilter = ConstellationFilter.parse(tourStop.attributes.getNamedItem('ConstellationBoundariesFilter').nodeValue);
    } else {
      newTourStop._constellationBoundariesFilter = ConstellationFilter.get_allConstellation();
    }
    if (tourStop.attributes.getNamedItem('ConstellationBoundariesFilter') != null) {
      newTourStop._constellationFiguresFilter = ConstellationFilter.parse(tourStop.attributes.getNamedItem('ConstellationBoundariesFilter').nodeValue);
    } else {
      newTourStop._constellationFiguresFilter = new ConstellationFilter();
    }
    if (tourStop.attributes.getNamedItem('ConstellationNamesFilter') != null) {
      newTourStop._constellationNamesFilter = ConstellationFilter.parse(tourStop.attributes.getNamedItem('ConstellationNamesFilter').nodeValue);
    } else {
      newTourStop._constellationNamesFilter = new ConstellationFilter();
    }
    if (tourStop.attributes.getNamedItem('ConstellationArtFilter') != null) {
      newTourStop._constellationArtFilter = ConstellationFilter.parse(tourStop.attributes.getNamedItem('ConstellationArtFilter').nodeValue);
    } else {
      newTourStop._constellationArtFilter = new ConstellationFilter();
    }
    if (tourStop.attributes.getNamedItem('MinorPlanetsFilter') != null) {
      newTourStop._minorPlanetsFilter = parseInt(tourStop.attributes.getNamedItem('MinorPlanetsFilter').nodeValue);
    }
    if (tourStop.attributes.getNamedItem('PlanetOrbitsFilter') != null) {
      newTourStop._planetOrbitsFilter = parseInt(tourStop.attributes.getNamedItem('PlanetOrbitsFilter').nodeValue);
    }
    var place = Util.selectSingleNode(tourStop, 'Place');
    newTourStop._target = Place._fromXml(place);
    var endTarget = Util.selectSingleNode(tourStop, 'EndTarget');
    if (endTarget != null) {
      newTourStop._endTarget = Place._fromXml(endTarget);
    }
    var overlays = Util.selectSingleNode(tourStop, 'Overlays');
    var $enum1 = ss.enumerate(overlays.childNodes);
    while ($enum1.moveNext()) {
      var overlay = $enum1.current;
      if (overlay.nodeName === 'Overlay') {
        newTourStop.addOverlay(Overlay._fromXml(newTourStop, overlay));
      }
    }
    var musicNode = Util.selectSingleNode(tourStop, 'MusicTrack');
    if (musicNode != null) {
      newTourStop._musicTrack = Overlay._fromXml(newTourStop, Util.selectSingleNode(musicNode, 'Overlay'));
    }
    var voiceNode = Util.selectSingleNode(tourStop, 'VoiceTrack');
    if (voiceNode != null) {
      newTourStop._voiceTrack = Overlay._fromXml(newTourStop, Util.selectSingleNode(voiceNode, 'Overlay'));
    }
    var layerNode = Util.selectSingleNode(tourStop, 'VisibleLayers');
    if (layerNode != null) {
      newTourStop._loadLayerList(layerNode);
    }
    newTourStop._thumbnail = owner.getCachedTexture(ss.format('{0}.thumb.png', newTourStop._id), function () {
      var c = 0;
    });
    return newTourStop;
  }
  catch (ex) {
    globalScriptInterface._fireTourError(ex);
    return null;
  }
};

var TourStop$ = {
  get_keyFramed: function () {
    return this._keyFramed;
  },

  get_tourStopType: function () {
    if (this._target.get_backgroundImageset() != null) {
      return this._target.get_backgroundImageset().get_dataSetType();
    } else {
      return this._tourStopType;
    }
  },

  set_tourStopType: function (value) {
    if (this._target.get_backgroundImageset() != null) {
      if (this._target.get_backgroundImageset().get_dataSetType() !== value) {
        this._target.set_backgroundImageset(null);
      }
    }
    this._tourStopType = value;
    return value;
  },

  get_tweenPosition: function () {
    return this._tweenPosition;
  },

  set_tweenPosition: function (value) {
    if (this._tweenPosition !== value) {
      this._tweenPosition = Math.max(0, Math.min(1, value));
      this.updateTweenPosition();
    }
    return value;
  },

  updateTweenPosition: function () {
    if (this.get_keyFramed()) {
    }
  },

  copy: function () {
    var writer = new XmlTextWriter();
    writer._writeProcessingInstruction('xml', "version='1.0' encoding='UTF-8'");
    this._saveToXml(writer, true);
    try {
      var xParser = new DOMParser();
      var doc = xParser.parseFromString(writer.body, 'text/xml');
      var node = Util.selectSingleNode(doc, 'TourStop');
      var ts = TourStop._fromXml(this.get_owner(), node);
      ts.set_id(Guid.newGuid().toString());
      return ts;
    }
    catch ($e1) {
    }
    return null;
  },

  get_owner: function () {
    return this._owner;
  },

  set_owner: function (value) {
    this._owner = value;
    return value;
  },

  get__transition: function () {
    return this._transition;
  },

  set__transition: function (value) {
    if (this._transition !== value) {
      this._transition = value;
      if (this._owner != null) {
        this._owner.set_tourDirty(true);
      }
    }
    return value;
  },

  get__transitionTime: function () {
    return this._transitionTime;
  },

  set__transitionTime: function (value) {
    if (this._transitionTime !== value) {
      this._transitionTime = value;
      if (this._owner != null) {
        this._owner.set_tourDirty(true);
      }
    }
    return value;
  },

  get__transitionHoldTime: function () {
    return this._transitionHoldTime;
  },

  set__transitionHoldTime: function (value) {
    if (this._transitionHoldTime !== value) {
      this._transitionHoldTime = value;
      if (this._owner != null) {
        this._owner.set_tourDirty(true);
      }
    }
    return value;
  },

  get__transitionOutTime: function () {
    return this._transitionOutTime;
  },

  set__transitionOutTime: function (value) {
    if (this._transitionOutTime !== value) {
      this._transitionOutTime = value;
      if (this._owner != null) {
        this._owner.set_tourDirty(true);
      }
    }
    return value;
  },

  get_nextSlide: function () {
    return this._nextSlide;
  },

  set_nextSlide: function (value) {
    this._nextSlide = value;
    return value;
  },

  get_isLinked: function () {
    if (this._nextSlide == null || this._nextSlide === 'Next' || !this._nextSlide) {
      return false;
    }
    return true;
  },

  get_fadeInOverlays: function () {
    return this._fadeInOverlays;
  },

  set_fadeInOverlays: function (value) {
    this._fadeInOverlays = value;
    return value;
  },

  get_masterSlide: function () {
    return this._masterSlide;
  },

  set_masterSlide: function (value) {
    if (this._masterSlide !== value) {
      this._masterSlide = value;
      if (this._owner != null) {
        this._owner.set_tourDirty(true);
      }
    }
    return value;
  },

  get_id: function () {
    return this._id;
  },

  set_id: function (value) {
    this._id = value;
    if (this._owner != null) {
      this._owner.set_tourDirty(true);
    }
    return value;
  },

  toString: function () {
    if (this._target != null) {
      return this.get_target().get_name();
    } else {
      return this._description;
    }
  },

  get_description: function () {
    return this._description;
  },

  set_description: function (value) {
    if (this._description !== value) {
      this._description = value;
      if (this._owner != null) {
        this._owner.set_tourDirty(true);
      }
    }
    return value;
  },

  get_name: function () {
    if (this._target != null) {
      return this._target.get_name();
    }
    return this._name;
  },

  set_name: function (value) {
    if (this._name !== value) {
      this._name = value;
      if (this._owner != null) {
        this._owner.set_tourDirty(true);
      }
    }
    return value;
  },

  get_duration: function () {
    return this._duration;
  },

  set_duration: function (value) {
    if (this._duration !== value) {
      this._duration = value;
      if (this._owner != null) {
        this._owner.set_tourDirty(true);
      }
    }
    return value;
  },

  get_target: function () {
    return this._target;
  },

  set_target: function (value) {
    if (this._target !== value) {
      this._target = value;
      if (this._owner != null) {
        this._owner.set_tourDirty(true);
      }
    }
    return value;
  },

  get_endTarget: function () {
    return this._endTarget;
  },

  set_endTarget: function (value) {
    if (this._endTarget !== value) {
      this._endTarget = value;
      if (this._owner != null) {
        this._owner.set_tourDirty(true);
      }
    }
    return value;
  },

  get_interpolationType: function () {
    return this._interpolationType;
  },

  set_interpolationType: function (value) {
    this._interpolationType = value;
    return value;
  },

  get_hasLocation: function () {
    return this._hasTime;
  },

  set_hasLocation: function (value) {
    if (this._hasLocation !== value) {
      this._hasLocation = value;
      if (this._owner != null) {
        this._owner.set_tourDirty(true);
      }
    }
    return value;
  },

  get_hasTime: function () {
    return this._hasTime;
  },

  set_hasTime: function (value) {
    if (this._hasTime !== value) {
      this._hasTime = this._hasLocation = value;
      if (this._owner != null) {
        this._owner.set_tourDirty(true);
      }
    }
    return value;
  },

  get_startTime: function () {
    return this._startTime;
  },

  set_startTime: function (value) {
    this._startTime = value;
    if (!ss.compareDates(this._startTime, value)) {
      this._startTime = value;
      if (this._owner != null) {
        this._owner.set_tourDirty(true);
      }
    }
    return value;
  },

  get_endTime: function () {
    return this._endTime;
  },

  set_endTime: function (value) {
    if (!ss.compareDates(this._endTime, value)) {
      this._endTime = value;
      if (this._owner != null) {
        this._owner.set_tourDirty(true);
      }
    }
    return value;
  },

  captureSettings: function () {
    this._startTime = SpaceTimeController.get_now();
    this._actualPlanetScale = Settings.get_current().get_actualPlanetScale();
    this._locationAltitude = Settings.get_current().get_locationAltitude();
    this._locationLat = Settings.get_current().get_locationLat();
    this._locationLng = Settings.get_current().get_locationLng();
    this._showClouds = Settings.get_current().get_showClouds();
    this._showConstellationBoundries = Settings.get_current().get_showConstellationBoundries();
    this._showConstellationFigures = Settings.get_current().get_showConstellationFigures();
    this._showConstellationSelection = Settings.get_current().get_showConstellationSelection();
    this._showEcliptic = Settings.get_current().get_showEcliptic();
    this._showElevationModel = Settings.get_current().get_showElevationModel();
    this._showFieldOfView = Settings.get_current().get_showFieldOfView();
    this._showGrid = Settings.get_current().get_showGrid();
    this._showHorizon = Settings.get_current().get_showHorizon();
    this._showHorizonPanorama = Settings.get_current().get_showHorizonPanorama();
    this._showMoonsAsPointSource = Settings.get_current().get_showMoonsAsPointSource();
    this._showSolarSystem = Settings.get_current().get_showSolarSystem();
    this._fovTelescope = Settings.get_current().get_fovTelescope();
    this._fovEyepiece = Settings.get_current().get_fovEyepiece();
    this._fovCamera = Settings.get_current().get_fovCamera();
    this._localHorizonMode = Settings.get_current().get_localHorizonMode();
    this._galacticMode = Settings.get_current().get_galacticMode();
    this._solarSystemStars = Settings.get_current().get_solarSystemStars();
    this._solarSystemMilkyWay = Settings.get_current().get_solarSystemMilkyWay();
    this._solarSystemCosmos = Settings.get_current().get_solarSystemCosmos();
    this._solarSystemOrbits = Settings.get_current().get_solarSystemOrbits();
    this._solarSystemOverlays = Settings.get_current().get_solarSystemOverlays();
    this._solarSystemLighting = Settings.get_current().get_solarSystemLighting();
    this._solarSystemScale = Settings.get_current().get_solarSystemScale();
    this._solarSystemMultiRes = Settings.get_current().get_solarSystemMultiRes();
    this._showEquatorialGridText = Settings.get_current().get_showEquatorialGridText();
    this._showGalacticGrid = Settings.get_current().get_showGalacticGrid();
    this._showGalacticGridText = Settings.get_current().get_showGalacticGridText();
    this._showEclipticGrid = Settings.get_current().get_showEclipticGrid();
    this._showEclipticGridText = Settings.get_current().get_showEclipticGridText();
    this._showEclipticOverviewText = Settings.get_current().get_showEclipticOverviewText();
    this._showAltAzGrid = Settings.get_current().get_showAltAzGrid();
    this._showAltAzGridText = Settings.get_current().get_showAltAzGridText();
    this._showPrecessionChart = Settings.get_current().get_showPrecessionChart();
    this._showConstellationPictures = Settings.get_current().get_showConstellationPictures();
    this._showConstellationLabels = Settings.get_current().get_showConstellationLabels();
    this._solarSystemCMB = Settings.get_current().get_solarSystemCMB();
    this._solarSystemMinorPlanets = Settings.get_current().get_solarSystemMinorPlanets();
    this._solarSystemPlanets = Settings.get_current().get_solarSystemPlanets();
    this._showEarthSky = Settings.get_current().get_showEarthSky();
    this._solarSystemMinorOrbits = Settings.get_current().get_solarSystemMinorOrbits();
    this._constellationFiguresFilter = Settings.get_current().get_constellationFiguresFilter().clone();
    this._constellationBoundariesFilter = Settings.get_current().get_constellationBoundariesFilter().clone();
    this._constellationNamesFilter = Settings.get_current().get_constellationNamesFilter().clone();
    this._constellationArtFilter = Settings.get_current().get_constellationArtFilter().clone();
    this._showSkyOverlays = Settings.get_current().get_showSkyOverlays();
    this._showConstellations = Settings.get_current().get_showConstellations();
    this._showSkyNode = Settings.get_current().get_showSkyNode();
    this._showSkyGrids = Settings.get_current().get_showSkyGrids();
    this._showSkyOverlaysIn3d = Settings.get_current().get_showSkyOverlaysIn3d();
    this._earthCutawayView = Settings.get_current().get_earthCutawayView();
    this._showISSModel = Settings.get_current().get_showISSModel();
    this._milkyWayModel = Settings.get_current().get_milkyWayModel();
    this._minorPlanetsFilter = Settings.get_current().get_minorPlanetsFilter();
    this._planetOrbitsFilter = Settings.get_current().get_planetOrbitsFilter();
  },

  syncSettings: function () {
    Settings.get_globalSettings().set_actualPlanetScale(this._actualPlanetScale);
    Settings.get_globalSettings().set_locationAltitude(this._locationAltitude);
    Settings.get_globalSettings().set_locationLat(this._locationLat);
    Settings.get_globalSettings().set_locationLng(this._locationLng);
    Settings.get_globalSettings().set_earthCutawayView(this._earthCutawayView);
    Settings.get_globalSettings().set_showConstellationBoundries(this._showConstellationBoundries);
    Settings.get_globalSettings().set_showConstellationFigures(this._showConstellationFigures);
    Settings.get_globalSettings().set_showConstellationSelection(this._showConstellationSelection);
    Settings.get_globalSettings().set_showEcliptic(this._showEcliptic);
    Settings.get_globalSettings().set_showElevationModel(this._showElevationModel);
    Settings.get_globalSettings().set_showGrid(this._showGrid);
    Settings.get_globalSettings().set_showHorizon(this._showHorizon);
    Settings.get_globalSettings().set_showSolarSystem(this._showSolarSystem);
    Settings.get_globalSettings().set_localHorizonMode(this._localHorizonMode);
    Settings.get_globalSettings().set_galacticMode(this._galacticMode);
    Settings.get_globalSettings().set_solarSystemStars(this._solarSystemStars);
    Settings.get_globalSettings().set_solarSystemMilkyWay(this._solarSystemMilkyWay);
    Settings.get_globalSettings().set_solarSystemCosmos(this._solarSystemCosmos);
    Settings.get_globalSettings().set_solarSystemCMB(this._solarSystemCMB);
    Settings.get_globalSettings().set_solarSystemOrbits(this._solarSystemOrbits);
    Settings.get_globalSettings().set_solarSystemMinorOrbits(this._solarSystemMinorOrbits);
    Settings.get_globalSettings().set_solarSystemMinorPlanets(this._solarSystemMinorPlanets);
    Settings.get_globalSettings().set_solarSystemOverlays(this._solarSystemOverlays);
    Settings.get_globalSettings().set_solarSystemLighting(this._solarSystemLighting);
    Settings.get_globalSettings().set_showISSModel(this._showISSModel);
    Settings.get_globalSettings().set_solarSystemScale(this._solarSystemScale);
    Settings.get_globalSettings().set_solarSystemMultiRes(this._solarSystemMultiRes);
    Settings.get_globalSettings().set_showEarthSky(this._showEarthSky);
    Settings.get_globalSettings().set_minorPlanetsFilter(this._minorPlanetsFilter);
    Settings.get_globalSettings().set_planetOrbitsFilter(this._planetOrbitsFilter);
    Settings.get_globalSettings().set_showEquatorialGridText(this._showEquatorialGridText);
    Settings.get_globalSettings().set_showGalacticGrid(this._showGalacticGrid);
    Settings.get_globalSettings().set_showGalacticGridText(this._showGalacticGridText);
    Settings.get_globalSettings().set_showEclipticGrid(this._showEclipticGrid);
    Settings.get_globalSettings().set_showEclipticGridText(this._showEclipticGridText);
    Settings.get_globalSettings().set_showEclipticOverviewText(this._showEclipticOverviewText);
    Settings.get_globalSettings().set_showAltAzGrid(this._showAltAzGrid);
    Settings.get_globalSettings().set_showAltAzGridText(this._showAltAzGridText);
    Settings.get_globalSettings().set_showPrecessionChart(this._showPrecessionChart);
    Settings.get_globalSettings().set_showConstellationPictures(this._showConstellationPictures);
    Settings.get_globalSettings().set_constellationsEnabled(this._constellationsEnabled);
    Settings.get_globalSettings().set_showSkyOverlays(this._showSkyOverlays);
    Settings.get_globalSettings().set_constellations(this._showConstellations);
    Settings.get_globalSettings().set_showSkyNode(this._showSkyNode);
    Settings.get_globalSettings().set_showSkyGrids(this._showSkyGrids);
    Settings.get_globalSettings().set_constellationFiguresFilter(this._constellationFiguresFilter.clone());
    Settings.get_globalSettings().set_constellationBoundariesFilter(this._constellationBoundariesFilter.clone());
    Settings.get_globalSettings().set_constellationNamesFilter(this._constellationNamesFilter.clone());
    Settings.get_globalSettings().set_constellationArtFilter(this._constellationArtFilter.clone());
  },

  get_solarSystemStars: function () {
    return this._solarSystemStars;
  },

  get_solarSystemMultiRes: function () {
    return this._solarSystemMultiRes;
  },

  get_solarSystemMilkyWay: function () {
    return this._solarSystemMilkyWay;
  },

  get_solarSystemCosmos: function () {
    return this._solarSystemCosmos;
  },

  get_solarSystemOrbits: function () {
    return this._solarSystemOrbits;
  },

  get_solarSystemOverlays: function () {
    return this._solarSystemOverlays;
  },

  get_solarSystemLighting: function () {
    return this._solarSystemLighting;
  },

  get_solarSystemScale: function () {
    return this._solarSystemScale;
  },

  get_actualPlanetScale: function () {
    return this._actualPlanetScale;
  },

  get_fovCamera: function () {
    return this._fovCamera;
  },

  get_fovEyepiece: function () {
    return this._fovEyepiece;
  },

  get_fovTelescope: function () {
    return this._fovTelescope;
  },

  get_locationAltitude: function () {
    if (this._hasLocation) {
      return this._locationAltitude;
    } else {
      return Settings.get_current().get_locationAltitude();
    }
  },

  get_locationLat: function () {
    if (this._hasLocation) {
      return this._locationLat;
    } else {
      return Settings.get_current().get_locationLat();
    }
  },

  get_locationLng: function () {
    if (this._hasLocation) {
      return this._locationLng;
    } else {
      return Settings.get_current().get_locationLng();
    }
  },

  get_showClouds: function () {
    return this._showClouds;
  },

  get_showConstellationBoundries: function () {
    return this._showConstellationBoundries;
  },

  get_showConstellationFigures: function () {
    return this._showConstellationFigures;
  },

  get_showConstellationSelection: function () {
    return this._showConstellationSelection;
  },

  get_showEcliptic: function () {
    return this._showEcliptic;
  },

  get_showElevationModel: function () {
    return this._showElevationModel;
  },

  get_showFieldOfView: function () {
    return this._showFieldOfView;
  },

  get_showGrid: function () {
    return this._showGrid;
  },

  get_showHorizon: function () {
    return this._showHorizon;
  },

  get_showHorizonPanorama: function () {
    return this._showHorizonPanorama;
  },

  get_showMoonsAsPointSource: function () {
    return this._showMoonsAsPointSource;
  },

  get_showSolarSystem: function () {
    return this._showSolarSystem;
  },

  get_localHorizonMode: function () {
    return this._localHorizonMode;
  },

  get_galacticMode: function () {
    return this._galacticMode;
  },

  get_thumbnail: function () {
    if (this._target != null && this._thumbnail == null) {
      return null;
    }
    return this._thumbnail;
  },

  set_thumbnail: function (value) {
    this._thumbnail = value;
    if (this._owner != null) {
      this._owner.set_tourDirty(true);
    }
    return value;
  },

  get_overlays: function () {
    return this._overlays;
  },

  get_musicTrack: function () {
    return this._musicTrack;
  },

  set_musicTrack: function (value) {
    if (this._musicTrack !== value) {
      this._musicTrack = value;
      if (this._owner != null) {
        this._owner.set_tourDirty(true);
      }
    }
    return value;
  },

  get_voiceTrack: function () {
    return this._voiceTrack;
  },

  set_voiceTrack: function (value) {
    if (this._voiceTrack !== value) {
      this._voiceTrack = value;
      if (this._owner != null) {
        this._owner.set_tourDirty(true);
      }
    }
    return value;
  },

  addOverlay: function (overlay) {
    if (overlay == null) {
      return;
    }
    overlay.set_owner(this);
    this._overlays.push(overlay);
    if (this._owner != null) {
      this._owner.set_tourDirty(true);
    }
  },

  removeOverlay: function (overlay) {
    ss.remove(this._overlays, overlay);
    if (this._owner != null) {
      this._owner.set_tourDirty(true);
    }
  },

  cleanUp: function () {
    var $enum1 = ss.enumerate(this.get_overlays());
    while ($enum1.moveNext()) {
      var overlay = $enum1.current;
      overlay.cleanUp();
    }
    if (this._voiceTrack != null) {
      this._voiceTrack.cleanUp();
    }
    if (this._musicTrack != null) {
      this._musicTrack.cleanUp();
    }
  },

  sendToBack: function (target) {
    ss.remove(this._overlays, target);
    this._overlays.splice(0, 0, target);
    if (this._owner != null) {
      this._owner.set_tourDirty(true);
    }
  },

  bringToFront: function (target) {
    ss.remove(this._overlays, target);
    this._overlays.push(target);
    if (this._owner != null) {
      this._owner.set_tourDirty(true);
    }
  },

  bringForward: function (target) {
    var index = this._overlays.indexOf(target);
    if (index < this._overlays.length - 1) {
      ss.remove(this._overlays, target);
      this._overlays.splice(index + 1, 0, target);
    }
    if (this._owner != null) {
      this._owner.set_tourDirty(true);
    }
  },

  sendBackward: function (target) {
    var index = this._overlays.indexOf(target);
    if (index > 0) {
      ss.remove(this._overlays, target);
      this._overlays.splice(index - 1, 0, target);
    }
    if (this._owner != null) {
      this._owner.set_tourDirty(true);
    }
  },

  getNextOverlay: function (current) {
    if (current == null) {
      if (this._overlays.length > 0) {
        return this._overlays[0];
      }
      else {
        return null;
      }
    }
    var index = this._overlays.indexOf(current);
    if (index < this._overlays.length - 1) {
      return this._overlays[index + 1];
    } else {
      return this._overlays[0];
    }
  },

  getPerviousOverlay: function (current) {
    if (current == null) {
      if (this._overlays.length > 0) {
        return this._overlays[0];
      }
      else {
        return null;
      }
    }
    var index = this._overlays.indexOf(current);
    if (index > 0) {
      return this._overlays[index - 1];
    } else {
      return this._overlays[this._overlays.length - 1];
    }
  },

  getOverlayById: function (id) {
    var $enum1 = ss.enumerate(this._overlays);
    while ($enum1.moveNext()) {
      var ol = $enum1.current;
      if (ol.id === id) {
        return ol;
      }
    }
    return null;
  },

  get_tourStopThumbnailFilename: function () {
    return ss.format('{0}.thumb.png', this._id);
  },

  _saveToXml: function (xmlWriter, saveContent) {
    if (saveContent) {
      if (this._thumbnail != null) {
      }
    }
    xmlWriter._writeStartElement('TourStop');
    xmlWriter._writeAttributeString('Id', this._id);
    xmlWriter._writeAttributeString('Name', this._name);
    xmlWriter._writeAttributeString('Description', this._description);
    xmlWriter._writeAttributeString('Thumbnail', this._thumbnailString);
    xmlWriter._writeAttributeString('Duration', Util.xmlDuration(this._duration));
    xmlWriter._writeAttributeString('Master', this._masterSlide.toString());
    xmlWriter._writeAttributeString('TransitionType', Enums.toXml('TransitionType', this._transition));
    xmlWriter._writeAttributeString('TransitionTime', this._transitionTime.toString());
    xmlWriter._writeAttributeString('TransitionOutTime', this._transitionOutTime.toString());
    xmlWriter._writeAttributeString('TransitionHoldTime', this._transitionHoldTime.toString());
    xmlWriter._writeAttributeString('NextSlide', this._nextSlide);
    xmlWriter._writeAttributeString('InterpolationType', Enums.toXml('InterpolationType', this._interpolationType));
    xmlWriter._writeAttributeString('HasLocation', this._hasLocation.toString());
    if (this._hasLocation) {
      xmlWriter._writeAttributeString('LocationAltitude', this._locationAltitude.toString());
      xmlWriter._writeAttributeString('LocationLat', this._locationLat.toString());
      xmlWriter._writeAttributeString('LocationLng', this._locationLng.toString());
    }
    xmlWriter._writeAttributeString('HasTime', this._hasTime.toString());
    if (this._hasTime) {
      xmlWriter._writeAttributeString('StartTime', Util.xmlDate(this._startTime));
      xmlWriter._writeAttributeString('EndTime', Util.xmlDate(this._endTime));
    }
    xmlWriter._writeAttributeString('ActualPlanetScale', this._actualPlanetScale.toString());
    xmlWriter._writeAttributeString('ShowClouds', this._showClouds.toString());
    xmlWriter._writeAttributeString('EarthCutawayView', this._earthCutawayView.toString());
    xmlWriter._writeAttributeString('ShowConstellationBoundries', this._showConstellationBoundries.toString());
    xmlWriter._writeAttributeString('ShowConstellationFigures', this._showConstellationFigures.toString());
    xmlWriter._writeAttributeString('ShowConstellationSelection', this._showConstellationSelection.toString());
    xmlWriter._writeAttributeString('ShowEcliptic', this._showEcliptic.toString());
    xmlWriter._writeAttributeString('EclipticColor', this._eclipticColor.save());
    xmlWriter._writeAttributeString('ShowElevationModel', this._showElevationModel.toString());
    this._showFieldOfView = false;
    xmlWriter._writeAttributeString('ShowFieldOfView', this._showFieldOfView.toString());
    xmlWriter._writeAttributeString('ShowGrid', this._showGrid.toString());
    xmlWriter._writeAttributeString('ShowHorizon', this._showHorizon.toString());
    xmlWriter._writeAttributeString('ShowHorizonPanorama', this._showHorizonPanorama.toString());
    xmlWriter._writeAttributeString('ShowMoonsAsPointSource', this._showMoonsAsPointSource.toString());
    xmlWriter._writeAttributeString('ShowSolarSystem', this._showSolarSystem.toString());
    xmlWriter._writeAttributeString('FovTelescope', this._fovTelescope.toString());
    xmlWriter._writeAttributeString('FovEyepiece', this._fovEyepiece.toString());
    xmlWriter._writeAttributeString('FovCamera', this._fovCamera.toString());
    xmlWriter._writeAttributeString('LocalHorizonMode', this._localHorizonMode.toString());
    xmlWriter._writeAttributeString('GalacticMode', this._galacticMode.toString());
    xmlWriter._writeAttributeString('FadeInOverlays', this._fadeInOverlays.toString());
    xmlWriter._writeAttributeString('SolarSystemStars', this._solarSystemStars.toString());
    xmlWriter._writeAttributeString('SolarSystemMilkyWay', this._solarSystemMilkyWay.toString());
    xmlWriter._writeAttributeString('SolarSystemCosmos', this._solarSystemCosmos.toString());
    xmlWriter._writeAttributeString('SolarSystemCMB', this._solarSystemCMB.toString());
    xmlWriter._writeAttributeString('SolarSystemOrbits', this._solarSystemOrbits.toString());
    xmlWriter._writeAttributeString('SolarSystemMinorOrbits', this._solarSystemMinorOrbits.toString());
    xmlWriter._writeAttributeString('SolarSystemOverlays', this._solarSystemOverlays.toString());
    xmlWriter._writeAttributeString('SolarSystemLighting', this._solarSystemLighting.toString());
    xmlWriter._writeAttributeString('ShowISSModel', this._showISSModel.toString());
    xmlWriter._writeAttributeString('SolarSystemScale', this._solarSystemScale.toString());
    xmlWriter._writeAttributeString('MinorPlanetsFilter', this._minorPlanetsFilter.toString());
    xmlWriter._writeAttributeString('PlanetOrbitsFilter', this._planetOrbitsFilter.toString());
    xmlWriter._writeAttributeString('SolarSystemMultiRes', this._solarSystemMultiRes.toString());
    xmlWriter._writeAttributeString('SolarSystemMinorPlanets', this._solarSystemMinorPlanets.toString());
    xmlWriter._writeAttributeString('SolarSystemPlanets', this._solarSystemPlanets.toString());
    xmlWriter._writeAttributeString('ShowEarthSky', this._showEarthSky.toString());
    xmlWriter._writeAttributeString('ShowEquatorialGridText', this.get_showEquatorialGridText().toString());
    xmlWriter._writeAttributeString('EquatorialGridColor', this.get_equatorialGridColor().save());
    xmlWriter._writeAttributeString('ShowGalacticGrid', this.get_showGalacticGrid().toString());
    xmlWriter._writeAttributeString('ShowGalacticGridText', this.get_showGalacticGridText().toString());
    xmlWriter._writeAttributeString('GalacticGridColor', this.get_galacticGridColor().save());
    xmlWriter._writeAttributeString('ShowEclipticGrid', this.get_showEclipticGrid().toString());
    xmlWriter._writeAttributeString('ShowEclipticGridText', this.get_showEclipticGridText().toString());
    xmlWriter._writeAttributeString('EclipticGridColor', this.get_eclipticGridColor().save());
    xmlWriter._writeAttributeString('ShowEclipticOverviewText', this.get_showEclipticOverviewText().toString());
    xmlWriter._writeAttributeString('ShowAltAzGrid', this.get_showAltAzGrid().toString());
    xmlWriter._writeAttributeString('ShowAltAzGridText', this.get_showAltAzGridText().toString());
    xmlWriter._writeAttributeString('AltAzGridColor', this.get_altAzGridColor().save());
    xmlWriter._writeAttributeString('ShowPrecessionChart', this.get_showPrecessionChart().toString());
    xmlWriter._writeAttributeString('PrecessionChartColor', this.get_precessionChartColor().save());
    xmlWriter._writeAttributeString('ConstellationPictures', this.get_showConstellationPictures().toString());
    xmlWriter._writeAttributeString('ConstellationsEnabled', this.get_constellationsEnabled());
    xmlWriter._writeAttributeString('ShowConstellationLabels', this.get_showConstellationLabels().toString());
    xmlWriter._writeAttributeString('ShowSkyOverlays', this.get_showSkyOverlays().toString());
    xmlWriter._writeAttributeString('ShowConstellations', this.get_showConstellations().toString());
    xmlWriter._writeAttributeString('ShowSkyNode', this.get_showSkyNode().toString());
    xmlWriter._writeAttributeString('ShowSkyGrids', this.get_showSkyGrids().toString());
    xmlWriter._writeAttributeString('SkyOverlaysIn3d', this.get_showSkyOverlaysIn3d().toString());
    xmlWriter._writeAttributeString('ConstellationFiguresFilter', this._constellationFiguresFilter.toString());
    xmlWriter._writeAttributeString('ConstellationBoundariesFilter', this._constellationBoundariesFilter.toString());
    xmlWriter._writeAttributeString('ConstellationNamesFilter', this._constellationNamesFilter.toString());
    xmlWriter._writeAttributeString('ConstellationArtFilter', this._constellationArtFilter.toString());
    this._target._saveToXml(xmlWriter, 'Place');
    if (this._endTarget != null) {
      this._endTarget._saveToXml(xmlWriter, 'EndTarget');
    }
    xmlWriter._writeStartElement('Overlays');
    var $enum1 = ss.enumerate(this._overlays);
    while ($enum1.moveNext()) {
      var overlay = $enum1.current;
      overlay.saveToXml(xmlWriter, false);
    }
    xmlWriter._writeEndElement();
    if (this._musicTrack != null) {
      xmlWriter._writeStartElement('MusicTrack');
      this._musicTrack.saveToXml(xmlWriter, false);
      xmlWriter._writeEndElement();
    }
    if (this._voiceTrack != null) {
      xmlWriter._writeStartElement('VoiceTrack');
      this._voiceTrack.saveToXml(xmlWriter, false);
      xmlWriter._writeEndElement();
    }
    this._writeLayerList(xmlWriter);
    xmlWriter._writeEndElement();
  },

  _writeLayerList: function (xmlWriter) {
    if (ss.keyCount(this.layers) > 0) {
      xmlWriter._writeStartElement('VisibleLayers');
      var $enum1 = ss.enumerate(ss.keys(this.layers));
      while ($enum1.moveNext()) {
        var key = $enum1.current;
        var info = this.layers[key];
        xmlWriter._writeStartElement('Layer');
        xmlWriter._writeAttributeString('StartOpacity', info.startOpacity.toString());
        xmlWriter._writeAttributeString('EndOpacity', info.endOpacity.toString());
        var len = info.startParams.length;
        xmlWriter._writeAttributeString('ParamCount', len.toString());
        for (var i = 0; i < len; i++) {
          xmlWriter._writeAttributeString(ss.format('StartParam{0}', i), info.startParams[i].toString());
          xmlWriter._writeAttributeString(ss.format('EndParam{0}', i), info.endParams[i].toString());
        }
        xmlWriter._writeValue(info.id.toString());
        xmlWriter._writeEndElement();
      }
      xmlWriter._writeEndElement();
    }
  },

  _addFilesToCabinet: function (fc, excludeAudio) {
    if (this._thumbnail != null) {
      var filename = ss.format('{0}.thumb.png', this._id);
      var blob = this._owner.getFileBlob(filename);
      fc.addFile(this._owner.get_workingDirectory() + filename, blob);
    }
    if (!excludeAudio) {
      if (this._musicTrack != null) {
        this._musicTrack.addFilesToCabinet(fc);
      }
      if (this._voiceTrack != null) {
        this._voiceTrack.addFilesToCabinet(fc);
      }
    }
    var $enum1 = ss.enumerate(this._overlays);
    while ($enum1.moveNext()) {
      var overlay = $enum1.current;
      overlay.addFilesToCabinet(fc);
    }
  },

  getNextDefaultName: function (baseName) {
    var suffixId = 1;
    var $enum1 = ss.enumerate(this._overlays);
    while ($enum1.moveNext()) {
      var overlay = $enum1.current;
      if (ss.startsWith(overlay.get_name(), baseName)) {
        var id = 0;
        try {
          id = parseInt(overlay.get_name().substr(baseName.length));
        }
        catch ($e2) {
        }
        if (id >= suffixId) {
          suffixId = id + 1;
        }
      }
    }
    return ss.format('{0} {1}', baseName, suffixId);
  },

  _loadLayerList: function (layersNode) {
    var $enum1 = ss.enumerate(layersNode.childNodes);
    while ($enum1.moveNext()) {
      var layer = $enum1.current;
      if (layer.nodeName === 'Layer') {
        var info = new LayerInfo();
        var id = layer.innerHTML;
        info.id = Guid.fromString(id);
        info.startOpacity = parseFloat(layer.attributes.getNamedItem('StartOpacity').nodeValue);
        info.endOpacity = parseFloat(layer.attributes.getNamedItem('EndOpacity').nodeValue);
        var len = 0;
        if (layer.attributes.getNamedItem('ParamCount') != null) {
          len = parseInt(layer.attributes.getNamedItem('ParamCount').nodeValue);
        }
        info.startParams = new Array(len);
        info.endParams = new Array(len);
        info.frameParams = new Array(len);
        for (var i = 0; i < len; i++) {
          info.startParams[i] = parseFloat(layer.attributes.getNamedItem(ss.format('StartParam{0}', i)).nodeValue);
          info.endParams[i] = parseFloat(layer.attributes.getNamedItem(ss.format('EndParam{0}', i)).nodeValue);
          info.frameParams[i] = info.startParams[i];
        }
        this.layers[info.id] = info;
      }
    }
  },

  _updateLayerOpacity: function () {
    if (!this.get_keyFramed()) {
    } else {
      this.updateTweenPosition();
    }
  },

  get_showEquatorialGridText: function () {
    return this._showEquatorialGridText;
  },

  set_showEquatorialGridText: function (value) {
    this._showEquatorialGridText = value;
    return value;
  },

  get_showGalacticGrid: function () {
    return this._showGalacticGrid;
  },

  set_showGalacticGrid: function (value) {
    this._showGalacticGrid = value;
    return value;
  },

  get_showGalacticGridText: function () {
    return this._showGalacticGridText;
  },

  set_showGalacticGridText: function (value) {
    this._showGalacticGridText = value;
    return value;
  },

  get_showEclipticGrid: function () {
    return this._showEclipticGrid;
  },

  set_showEclipticGrid: function (value) {
    this._showEclipticGrid = value;
    return value;
  },

  get_showEclipticGridText: function () {
    return this._showEclipticGridText;
  },

  set_showEclipticGridText: function (value) {
    this._showEclipticGridText = value;
    return value;
  },

  get_showEclipticOverviewText: function () {
    return this._showEclipticOverviewText;
  },

  set_showEclipticOverviewText: function (value) {
    this._showEclipticOverviewText = value;
    return value;
  },

  get_showAltAzGrid: function () {
    return this._showAltAzGrid;
  },

  set_showAltAzGrid: function (value) {
    this._showAltAzGrid = value;
    return value;
  },

  get_showAltAzGridText: function () {
    return this._showAltAzGridText;
  },

  set_showAltAzGridText: function (value) {
    this._showAltAzGridText = value;
    return value;
  },

  get_showPrecessionChart: function () {
    return this._showPrecessionChart;
  },

  set_showPrecessionChart: function (value) {
    this._showPrecessionChart = value;
    return value;
  },

  get_showConstellationPictures: function () {
    return this._showConstellationPictures;
  },

  set_showConstellationPictures: function (value) {
    this._showConstellationPictures = value;
    return value;
  },

  get_showConstellationLabels: function () {
    return this._showConstellationLabels;
  },

  set_showConstellationLabels: function (value) {
    this._showConstellationLabels = value;
    return value;
  },

  get_solarSystemCMB: function () {
    return this._solarSystemCMB;
  },

  set_solarSystemCMB: function (value) {
    this._solarSystemCMB = value;
    return value;
  },

  get_solarSystemMinorPlanets: function () {
    return this._solarSystemMinorPlanets;
  },

  set_solarSystemMinorPlanets: function (value) {
    this._solarSystemMinorPlanets = value;
    return value;
  },

  get_solarSystemPlanets: function () {
    return this._solarSystemPlanets;
  },

  set_solarSystemPlanets: function (value) {
    this._solarSystemPlanets = value;
    return value;
  },

  get_showEarthSky: function () {
    return this._showEarthSky;
  },

  set_showEarthSky: function (value) {
    this._showEarthSky = value;
    return value;
  },

  get_solarSystemMinorOrbits: function () {
    return this._solarSystemMinorOrbits;
  },

  set_solarSystemMinorOrbits: function (value) {
    this._solarSystemMinorOrbits = value;
    return value;
  },

  get_constellationsEnabled: function () {
    return this._constellationsEnabled;
  },

  set_constellationsEnabled: function (value) {
    this._constellationsEnabled = value;
    return value;
  },

  get_constellationFiguresFilter: function () {
    return this._constellationFiguresFilter;
  },

  set_constellationFiguresFilter: function (value) {
    this._constellationFiguresFilter = value;
    return value;
  },

  get_constellationBoundariesFilter: function () {
    return this._constellationBoundariesFilter;
  },

  set_constellationBoundariesFilter: function (value) {
    this._constellationBoundariesFilter = value;
    return value;
  },

  get_constellationNamesFilter: function () {
    return this._constellationNamesFilter;
  },

  set_constellationNamesFilter: function (value) {
    this._constellationNamesFilter = value;
    return value;
  },

  get_constellationArtFilter: function () {
    return this._constellationArtFilter;
  },

  set_constellationArtFilter: function (value) {
    this._constellationArtFilter = value;
    return value;
  },

  get_showSkyOverlays: function () {
    return this._showSkyOverlays;
  },

  set_showSkyOverlays: function (value) {
    this._showSkyOverlays = value;
    return value;
  },

  get_showConstellations: function () {
    return this._showConstellations;
  },

  set_showConstellations: function (value) {
    this._showConstellations = value;
    return value;
  },

  get_showSkyNode: function () {
    return this._showSkyNode;
  },

  set_showSkyNode: function (value) {
    this._showSkyNode = value;
    return value;
  },

  get_showSkyGrids: function () {
    return this._showSkyGrids;
  },

  set_showSkyGrids: function (value) {
    this._showSkyGrids = value;
    return value;
  },

  get_showSkyOverlaysIn3d: function () {
    return this._showSkyOverlaysIn3d;
  },

  set_showSkyOverlaysIn3d: function (value) {
    this._showSkyOverlaysIn3d = value;
    return value;
  },

  get_earthCutawayView: function () {
    return this._earthCutawayView;
  },

  set_earthCutawayView: function (value) {
    this._earthCutawayView = value;
    return value;
  },

  get_showISSModel: function () {
    return this._showISSModel;
  },

  set_showISSModel: function (value) {
    this._showISSModel = value;
    return value;
  },

  get_milkyWayModel: function () {
    return this._milkyWayModel;
  },

  set_milkyWayModel: function (value) {
    this._milkyWayModel = value;
    return value;
  },

  get_minorPlanetsFilter: function () {
    return this._minorPlanetsFilter;
  },

  set_minorPlanetsFilter: function (value) {
    this._minorPlanetsFilter = value;
    return value;
  },

  get_planetOrbitsFilter: function () {
    return this._planetOrbitsFilter;
  },

  set_planetOrbitsFilter: function (value) {
    this._planetOrbitsFilter = value;
    return value;
  },

  getSetting: function (type) {
    if (type === 17) {
      return new SettingParameter(true, this.faderOpacity, !!this.faderOpacity, null);
    }
    return new SettingParameter(false, 1, false, null);
  },

  get_eclipticGridColor: function () {
    return this._eclipticGridColor;
  },

  set_eclipticGridColor: function (value) {
    this._eclipticGridColor = value;
    return value;
  },

  get_galacticGridColor: function () {
    return this._galacticGridColor;
  },

  set_galacticGridColor: function (value) {
    this._galacticGridColor = value;
    return value;
  },

  get_altAzGridColor: function () {
    return this._altAzGridColor;
  },

  set_altAzGridColor: function (value) {
    this._altAzGridColor = value;
    return value;
  },

  get_precessionChartColor: function () {
    return this._precessionChartColor;
  },

  set_precessionChartColor: function (value) {
    this._precessionChartColor = value;
    return value;
  },

  get_eclipticColor: function () {
    return this._eclipticColor;
  },

  set_eclipticColor: function (value) {
    this._eclipticColor = value;
    return value;
  },

  get_equatorialGridColor: function () {
    return this._equatorialGridColor;
  },

  set_equatorialGridColor: function (value) {
    this._equatorialGridColor = value;
    return value;
  },

  get_constellationLabelsHeight: function () {
    return this._constellationLabelsHeight;
  },

  set_constellationLabelsHeight: function (value) {
    this._constellationLabelsHeight = value;
    return value;
  }
};

registerType("TourStop", [TourStop, TourStop$, null, ISettings]);

// wwtlib.LayerInfo

export function LayerInfo() {
  this.id = Guid.newGuid();
  this.startOpacity = 1;
  this.endOpacity = 1;
  this.frameOpacity = 1;
  this.startParams = new Array(0);
  this.endParams = new Array(0);
  this.frameParams = new Array(0);
}

var LayerInfo$ = {};

registerType("LayerInfo", [LayerInfo, LayerInfo$, null]);

// wwtlib.UndoTourStopChange

export function UndoTourStopChange(text, tour) {
  this._undoXml = '';
  this._redoXml = '';
  this._currentIndex = 0;
  this._actionText = '';
  this._targetTour = null;
  this._currentIndex = tour.get_currentTourstopIndex();
  this._actionText = text;
  this._targetTour = tour;
  this._undoXml = TourStop.getXmlText(tour.get_currentTourStop());
  this._targetTour.set_tourDirty(true);
}

var UndoTourStopChange$ = {
  get_actionText: function () {
    return this._actionText;
  },

  set_actionText: function (value) {
    this._actionText = value;
    return value;
  },

  undo: function () {
    var tsRedo = this._targetTour.get_tourStops()[this._currentIndex];
    var parser = new DOMParser();
    var doc = parser.parseFromString(this._undoXml, 'text/xml');
    var node = Util.selectSingleNode(doc, 'TourStop');
    this._targetTour.get_tourStops()[this._currentIndex] = TourStop._fromXml(this._targetTour, node);
    this._targetTour.set_currentTourstopIndex(this._currentIndex);
    if (ss.emptyString(this._redoXml)) {
      this._redoXml = TourStop.getXmlText(tsRedo);
    }
    this._targetTour.set_tourDirty(true);
  },

  redo: function () {
    var parser = new DOMParser();
    var doc = parser.parseFromString(this._redoXml, 'text/xml');
    var node = Util.selectSingleNode(doc, 'TourStop');
    this._targetTour.get_tourStops()[this._currentIndex] = TourStop._fromXml(this._targetTour, node);
    this._targetTour.set_currentTourstopIndex(this._currentIndex);
    this._targetTour.set_tourDirty(true);
  },

  toString: function () {
    return this._actionText;
  }
};

registerType("UndoTourStopChange", [UndoTourStopChange, UndoTourStopChange$, null, IUndoStep]);

// wwtlib.Undo

export function Undo() { }

Undo._undoStack = new ss.Stack();
Undo._redoStack = new ss.Stack();

Undo.clear = function () {
  Undo._undoStack = new ss.Stack();
  Undo._redoStack = new ss.Stack();
};

Undo.push = function (step) {
  Undo._undoStack.push(step);
  Undo._redoStack = new ss.Stack();
};

Undo.peekActionString = function () {
  if (Undo._undoStack.count > 0) {
    return Undo._undoStack.peek().toString();
  }
  else {
    return Language.getLocalizedText(551, 'Nothing to Undo');
  }
};

Undo.peekRedoActionString = function () {
  if (Undo._redoStack.count > 0) {
    return Undo._redoStack.peek().toString();
  }
  else {
    return '';
  }
};

Undo.peekAction = function () {
  return (Undo._undoStack.count > 0);
};

Undo.peekRedoAction = function () {
  return (Undo._redoStack.count > 0);
};

Undo.stepBack = function () {
  var step = Undo._undoStack.pop();
  step.undo();
  Undo._redoStack.push(step);
};

Undo.stepForward = function () {
  var step = Undo._redoStack.pop();
  step.redo();
  Undo._undoStack.push(step);
};

var Undo$ = {};

registerType("Undo", [Undo, Undo$, null]);

// wwtlib.UndoStep

export function UndoStep() { }

var UndoStep$ = {
  undo: function () { },

  redo: function () { },

  toString: function () {
    return Language.getLocalizedText(551, 'Nothing to Undo');
  }
};

registerType("UndoStep", [UndoStep, UndoStep$, null, IUndoStep]);

// wwtlib.UndoTourSlidelistChange

export function UndoTourSlidelistChange(text, tour) {
  this._currentIndex = 0;
  this._actionText = '';
  this._targetTour = null;
  this._undoList = [];
  for (var i = 0; i < tour.get_tourStops().length; i++) {
    this._undoList.push(tour.get_tourStops()[i]);
  }
  this._currentIndex = tour.get_currentTourstopIndex();
  this._actionText = text;
  this._targetTour = tour;
  this._targetTour.set_tourDirty(true);
}

var UndoTourSlidelistChange$ = {
  get_actionText: function () {
    return this._actionText;
  },

  set_actionText: function (value) {
    this._actionText = value;
    return value;
  },

  undo: function () {
    this._redoList = this._targetTour.get_tourStops();
    this._targetTour.set_tourStops(this._undoList);
    this._targetTour.set_currentTourstopIndex(this._currentIndex);
    this._targetTour.set_tourDirty(true);
  },

  redo: function () {
    this._undoList = this._targetTour.get_tourStops();
    this._targetTour.set_tourStops(this._redoList);
    this._targetTour.set_currentTourstopIndex(this._currentIndex);
    this._targetTour.set_tourDirty(true);
  },

  toString: function () {
    return this._actionText;
  }
};

registerType("UndoTourSlidelistChange", [UndoTourSlidelistChange, UndoTourSlidelistChange$, null, IUndoStep]);

// wwtlib.UndoTourPropertiesChange

export function UndoTourPropertiesChange(text, tour) {
  this._actionText = '';
  this._targetTour = null;
  this._undoDomeMode = false;
  this._undoLevel = 0;
  this._redoDomeMode = false;
  this._redoLevel = 0;
  this._undoTitle = tour.get_title();
  this._undoAuthor = tour.get_author();
  this._undoAuthorEmail = tour.get_authorEmail();
  this._undoDescription = tour.get_description();
  this._undoAuthorImage = tour.get_authorImage();
  this._undoOrganizationUrl = tour.get_organizationUrl();
  this._undoOrgName = tour.get_orgName();
  this._undoKeywords = tour.get_keywords();
  this._undoTaxonomy = tour.get_taxonomy();
  this._undoLevel = tour.get_level();
  this._actionText = text;
  this._targetTour = tour;
  this._targetTour.set_tourDirty(true);
}

var UndoTourPropertiesChange$ = {
  get_actionText: function () {
    return this._actionText;
  },

  set_actionText: function (value) {
    this._actionText = value;
    return value;
  },

  undo: function () {
    this._redoTitle = this._targetTour.get_title();
    this._redoAuthor = this._targetTour.get_author();
    this._redoAuthorEmail = this._targetTour.get_authorEmail();
    this._redoDescription = this._targetTour.get_description();
    this._redoAuthorImage = this._targetTour.get_authorImage();
    this._redoOrganizationUrl = this._targetTour.get_organizationUrl();
    this._redoOrgName = this._targetTour.get_orgName();
    this._redoKeywords = this._targetTour.get_keywords();
    this._redoTaxonomy = this._targetTour.get_taxonomy();
    this._redoLevel = this._targetTour.get_level();
    this._targetTour.set_title(this._undoTitle);
    this._targetTour.set_author(this._undoAuthor);
    this._targetTour.set_authorEmail(this._undoAuthorEmail);
    this._targetTour.set_description(this._undoDescription);
    this._targetTour.set_authorImage(this._undoAuthorImage);
    this._targetTour.set_organizationUrl(this._undoOrganizationUrl);
    this._targetTour.set_orgName(this._undoOrgName);
    this._targetTour.set_keywords(this._undoKeywords);
    this._targetTour.set_taxonomy(this._undoTaxonomy);
    this._targetTour.set_level(this._undoLevel);
    this._targetTour.set_tourDirty(true);
  },

  redo: function () {
    this._targetTour.set_title(this._redoTitle);
    this._targetTour.set_author(this._redoAuthor);
    this._targetTour.set_authorEmail(this._redoAuthorEmail);
    this._targetTour.set_description(this._redoDescription);
    this._targetTour.set_authorImage(this._redoAuthorImage);
    this._targetTour.set_organizationUrl(this._redoOrganizationUrl);
    this._targetTour.set_orgName(this._redoOrgName);
    this._targetTour.set_keywords(this._redoKeywords);
    this._targetTour.set_taxonomy(this._redoTaxonomy);
    this._targetTour.set_level(this._redoLevel);
    this._targetTour.set_tourDirty(true);
  },

  toString: function () {
    return this._actionText;
  }
};

registerType("UndoTourPropertiesChange", [UndoTourPropertiesChange, UndoTourPropertiesChange$, null, IUndoStep]);

// wwtlib.ColorPicker
// requires : ScriptInterface

export function ColorPicker() {
  this.callBack = null;
  this.color = Colors.get_white();
}

var ColorPicker$ = {
  nonMenuClick: function (e) { },

  show: function (e) {
    globalScriptInterface.showColorPicker(this, e);
  },

  getColorFromClick: function (e) {
    var image = document.getElementById('colorhex');
    var canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    var pixels = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data;
    this.color = Color.fromArgb(pixels[3], pixels[0], pixels[1], pixels[2]);
    return this.color;
  },

  pickColor: function (e) {
    this.callBack(this.color);
  }
};

registerType("ColorPicker", [ColorPicker, ColorPicker$, null]);

// wwtlib.Dialog

export function Dialog() { }

var Dialog$ = {
  add_showDialogHook: function (value) {
    this.__showDialogHook = ss.bindAdd(this.__showDialogHook, value);
  },

  remove_showDialogHook: function (value) {
    this.__showDialogHook = ss.bindSub(this.__showDialogHook, value);
  },

  show: function (dialogArgs, e) {
    if (this.__showDialogHook != null) {
      this.__showDialogHook(dialogArgs, e);
    }
  }
};

registerType("Dialog", [Dialog, Dialog$, null]);

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

// wwtlib.SpreadSheetLayer

export function SpreadSheetLayer() {
  this._dataDirty$1 = false;
  this._lastNormalizeSizeColumnIndex$1 = -1;
  this._lastDynamicColorColumnIndex$1 = -1;
  this._table_backcompat$1 = null;
  this._barChartBitmask$1 = 0;
  this._barScaleFactor$1 = 20;
  this._meanRadius$1 = 6371000;
  this._table$1 = new Table();
  this.isLongIndex = false;
  this.shapeVertexCount = 0;
  this.lines = false;
  this.latColumn = -1;
  this.fixedSize = 1;
  this.decay = 16;
  this.timeSeries = false;
  this._dynamicData$1 = false;
  this._autoUpdate$1 = false;
  this._dataSourceUrl$1 = '';
  this._beginRange$1 = new Date('1/1/2100');
  this._endRange$1 = new Date('01/01/1800');
  this.markerDomainValues = {};
  this.colorDomainValues = {};
  this._coordinatesType$1 = 0;
  this.lngColumn = -1;
  this.geometryColumn = -1;
  this._xAxisColumn$1 = -1;
  this._yAxisColumn$1 = -1;
  this._zAxisColumn$1 = -1;
  this._xAxisReverse$1 = false;
  this._yAxisReverse$1 = false;
  this._zAxisReverse$1 = false;
  this._altType$1 = 3;
  this._markerMix$1 = 0;
  this._raUnits$1 = 0;
  this.colorMap = 3;
  this.colorMapperName = 'Greys';
  this._dynamicColorColumnName$1 = '2efc32e3-b9d9-47ff-8036-8cc344c585bd';
  this.dynamicColor = false;
  this.normalizeColorMap = false;
  this.normalizeColorMapMin = 0;
  this.normalizeColorMapMax = 1;
  this._markerColumn$1 = -1;
  this.colorMapColumn = -1;
  this._plotType$1 = 0;
  this._markerIndex$1 = 0;
  this._showFarSide$1 = false;
  this._markerScale$1 = 1;
  this._altUnit$1 = 1;
  this._cartesianScale$1 = 1;
  this._cartesianCustomScale$1 = 1;
  this.altColumn = -1;
  this.startDateColumn = -1;
  this.endDateColumn = -1;
  this.sizeColumn = -1;
  this._normalizeSizeColumnName$1 = 'dfe78b4c-f972-4796-b04f-68c5efd4ecb0';
  this.normalizeSize = false;
  this.normalizeSizeClip = false;
  this.normalizeSizeMin = 0;
  this.normalizeSizeMax = 1;
  this.nameColumn = 0;
  this._hyperlinkFormat$1 = '';
  this._hyperlinkColumn$1 = -1;
  this.scaleFactor = 1;
  this.pointScaleType = 1;
  this.positions = [];
  this.bufferIsFlat = false;
  this.baseDate = new Date(2010, 0, 1, 12, 0, 0);
  this.dirty = true;
  this.lastVersion = 0;
  Layer.call(this);
}

SpreadSheetLayer._circleTexture$1 = null;

SpreadSheetLayer._getDatafromFeed$1 = function (url) {
  return '';
};

SpreadSheetLayer._executeQuery$1 = function (url) {
  return '';
};

SpreadSheetLayer.parseDate = function (date) {
  var dt = ss.now();
  try {
    dt = new Date(date);
  }
  catch ($e1) {
    try {
      return SpreadSheetLayer.execlToDateTime(parseFloat(date));
    }
    catch ($e2) {
    }
  }
  return dt;
};

SpreadSheetLayer.execlToDateTime = function (excelDate) {
  if (excelDate > 59) {
    excelDate -= 1;
  }
  if (excelDate > 730000) {
    excelDate = 730000;
  }
  var es = new Date(1899, 12, 31);
  return new Date(es.getDate() + ss.truncate((excelDate * 24 * 60 * 60 * 1000)));
};

SpreadSheetLayer.get__circleTexture$1 = function () {
  if (SpreadSheetLayer._circleTexture$1 == null) {
    var url = URLHelpers.singleton.engineAssetUrl('circle.png');
    SpreadSheetLayer._circleTexture$1 = Texture.fromUrl(url);
  }
  return SpreadSheetLayer._circleTexture$1;
};

var SpreadSheetLayer$ = {
  getTypeName: function () {
    return 'TerraViewer.SpreadSheetLayer';
  },

  get_header: function () {
    return this._table$1.header;
  },

  canCopyToClipboard: function () {
    return true;
  },

  copyToClipboard: function () { },

  dynamicUpdate: function () {
    var data = SpreadSheetLayer._getDatafromFeed$1(this.get_dataSourceUrl());
    if (data != null) {
      this.updateData(data, false, true, true);
      this.guessHeaderAssignments();
      return true;
    }
    return false;
  },

  updateData: function (data, purgeOld, purgeAll, hasHeader) {
    this.loadFromString(ss.safeCast(data, String), true, purgeOld, purgeAll, hasHeader);
    this.computeDateDomainRange(-1, -1);
    this._dataDirty$1 = true;
    this.dirty = true;
    return true;
  },

  loadData: function (tourDoc, filename) {
    var $this = this;

    this._table$1 = new Table();
    var blob = tourDoc.getFileBlob(filename);
    this.getStringFromGzipBlob(blob, function (data) {
      $this._table$1.loadFromString(data, false, true, true);
      if ($this._table$1.header.indexOf($this._normalizeSizeColumnName$1) > -1) {
        $this._table$1.removeColumn($this._normalizeSizeColumnName$1);
      }
      $this.computeDateDomainRange(-1, -1);
      if ($this.get_dynamicData() && $this.get_autoUpdate()) {
        $this.dynamicUpdate();
      }
      $this._dataDirty$1 = true;
      $this.dirty = true;
    });
  },

  addFilesToCabinet: function (fc) {
    this._fileName$1 = fc.tempDirectory + ss.format('{0}\\{1}.txt', fc.get_packageID(), this.id.toString());
    var dir = this._fileName$1.substring(0, this._fileName$1.lastIndexOf('\\'));
    var data = '';
    if (this._table_backcompat$1 == null) {
      data = this._table$1.save();
    } else {
      data = this._table_backcompat$1.save();
    }
    var blob = new Blob([data]);
    fc.addFile(this._fileName$1, blob);
    Layer.prototype.addFilesToCabinet.call(this, fc);
  },
  _prepareBackCompatTable$1: function () {
    if ((this.sizeColumn === -1 || !this.get_normalizeSize()) && (this.colorMapColumn === -1 || !this.get_dynamicColor())) {
      this._lastNormalizeSizeColumnIndex$1 = -1;
      this._lastDynamicColorColumnIndex$1 = -1;
      return;
    }
    this._table_backcompat$1 = this._table$1.clone();
    if (this.sizeColumn > -1 && this.get_normalizeSize()) {
      var normalizedPointSize = [];
      var $enum1 = ss.enumerate(this._table_backcompat$1.rows);
      while ($enum1.moveNext()) {
        var row = $enum1.current;
        normalizedPointSize.push(this.normalizePointSize(parseFloat(row[this.sizeColumn])).toString());
      }
      this._table_backcompat$1.addColumn(this._normalizeSizeColumnName$1, normalizedPointSize);
      this._lastNormalizeSizeColumnIndex$1 = this._table_backcompat$1.header.length - 1;
    } else {
      this._lastNormalizeSizeColumnIndex$1 = -1;
    }
    if (this.colorMapColumn > -1 && this.get_dynamicColor()) {
      var pointColors = [];
      var $enum2 = ss.enumerate(this._table_backcompat$1.rows);
      while ($enum2.moveNext()) {
        var row = $enum2.current;
        pointColors.push(this.get_colorMapper().findClosestColor(this.normalizeColorMapValue(parseFloat(row[this.get_colorMapColumn()]))).toSimpleHex());
      }
      this._table_backcompat$1.addColumn(this._dynamicColorColumnName$1, pointColors);
      this._lastDynamicColorColumnIndex$1 = this._table_backcompat$1.header.length - 1;
    } else {
      this._lastDynamicColorColumnIndex$1 = -1;
    }
  },

  guessHeaderAssignments: function () {
    var index = 0;
    var $enum1 = ss.enumerate(this._table$1.header);
    while ($enum1.moveNext()) {
      var headerName = $enum1.current;
      this._guessHeaderAssignment$1(headerName, index++);
    }
    if (this._table$1.header.length > 0) {
      this.nameColumn = 0;
    }
  },

  guessHeaderAssignmentsFromVoTable: function (votable) {
    var decColumn = votable.getDecColumn();
    if (decColumn != null) {
      this.latColumn = decColumn.index;
      this.astronomical = true;
    }
    var raColumn = votable.getRAColumn();
    if (raColumn != null) {
      this.lngColumn = raColumn.index;
      this.astronomical = true;
      this.pointScaleType = 4;
    }
    var magColumn = votable.getMagColumn();
    if (magColumn != null) {
      this.sizeColumn = magColumn.index;
    }
    var index = 0;
    var $enum1 = ss.enumerate(votable.column);
    while ($enum1.moveNext()) {
      var column = $enum1.current;
      this._guessHeaderAssignment$1(column.name, index++);
    }
    if (this._table$1.header.length > 0) {
      this.nameColumn = 0;
    }
  },
  _guessHeaderAssignment$1: function (name, index) {
    name = name.toLowerCase();
    if (name.indexOf('lat') > -1 && this.latColumn === -1) {
      this.latColumn = index;
    }
    if ((name.indexOf('lon') > -1 || name.indexOf('lng') > -1) && this.lngColumn === -1) {
      this.lngColumn = index;
    }
    if (name.indexOf('dec') > -1 && this.latColumn === -1) {
      this.latColumn = index;
      this.astronomical = true;
    }
    if ((name.indexOf('ra') > -1 || name.indexOf('ascen') > -1) && this.lngColumn === -1) {
      this.lngColumn = index;
      this.astronomical = true;
      this.pointScaleType = 4;
    }
    if ((name.indexOf('mag') > -1 || name.indexOf('size') > -1) && this.sizeColumn === -1) {
      this.sizeColumn = index;
    }
    if ((name.indexOf('date') > -1 || name.indexOf('time') > -1 || name.indexOf('dt') > -1 || name.indexOf('tm') > -1)) {
      if (name.indexOf('end') > -1 && this.endDateColumn === -1) {
        this.endDateColumn = index;
      }
      else if (this.startDateColumn === -1) {
        this.startDateColumn = index;
      }
    }
    if ((name.indexOf('altitude') > -1 || name.indexOf('alt') > -1) && this.altColumn === -1) {
      this.altColumn = index;
      this.set_altType(1);
      this.set_altUnit(1);
    }
    if (name.indexOf('depth') > -1 && this.altColumn === -1) {
      this.altColumn = index;
      this.set_altType(0);
      this.set_altUnit(5);
    }
    if (ss.startsWith(name, 'x') && this.get_xAxisColumn() === -1) {
      this.set_xAxisColumn(index);
    }
    if (ss.startsWith(name, 'y') && this.get_yAxisColumn() === -1) {
      this.set_yAxisColumn(index);
    }
    if (ss.startsWith(name, 'z') && this.get_zAxisColumn() === -1) {
      this.set_zAxisColumn(index);
    }
    if (name.indexOf('color') > -1 && this.get_colorMapColumn() === -1) {
      this.set_colorMapColumn(index);
    }
    if ((name.indexOf('geometry') > -1 || name.indexOf('geography') > -1) && this.geometryColumn === -1) {
      this.geometryColumn = index;
    }
  },

  computeDateDomainRange: function (columnStart, columnEnd) {
    if (columnStart === -1) {
      columnStart = this.startDateColumn;
    }
    if (columnEnd === -1) {
      columnEnd = this.endDateColumn;
    }
    if (columnEnd === -1) {
      columnEnd = columnStart;
    }
    this.set_beginRange(new Date('12/31/2100'));
    this.set_endRange(new Date('12/31/1890'));
    var $enum1 = ss.enumerate(this._table$1.rows);
    while ($enum1.moveNext()) {
      var row = $enum1.current;
      try {
        if (columnStart > -1) {
          var sucsess = true;
          var dateTimeStart = new Date('12/31/2100');
          try {
            dateTimeStart = new Date(row[columnStart]);
            if (dateTimeStart < this.get_beginRange()) {
              this.set_beginRange(dateTimeStart);
            }
          }
          catch ($e2) {
          }
          try {
            var dateTimeEnd = new Date('12/31/1890');
            if (columnEnd > -1) {
              dateTimeEnd = new Date(row[columnEnd]);
              if (sucsess && dateTimeEnd > this.get_endRange()) {
                this.set_endRange(dateTimeEnd);
              }
            }
          }
          catch ($e3) {
          }
        }
      }
      catch ($e4) {
      }
    }
  },

  checkState: function () { },

  getMaxValue: function (column) {
    var max = 0;
    this._table$1.lock();
    var $enum1 = ss.enumerate(this._table$1.rows);
    while ($enum1.moveNext()) {
      var row = $enum1.current;
      try {
        if (column > -1) {
          var sucsess = true;
          try {
            var val = parseFloat(row[column]);
            if (sucsess && val > max) {
              max = val;
            }
          }
          catch ($e2) {
          }
        }
      }
      catch ($e3) {
      }
    }
    this._table$1.unlock();
    return max;
  },

  getDomainValues: function (column) {
    var domainValues = [];
    this._table$1.lock();
    var $enum1 = ss.enumerate(this._table$1.rows);
    while ($enum1.moveNext()) {
      var row = $enum1.current;
      try {
        if (column > -1) {
          if (!(domainValues.indexOf(row[column]) >= 0)) {
            domainValues.push(row[column]);
          }
        }
      }
      catch ($e2) {
      }
    }
    domainValues.sort();
    this._table$1.unlock();
    return domainValues;
  },

  get_barChartBitmask: function () {
    return this._barChartBitmask$1;
  },

  set_barChartBitmask: function (value) {
    this._barChartBitmask$1 = value;
    return value;
  },
  _isPointInFrustum$1: function (position, frustum) {
    var centerV4 = new Vector4d(position.x, position.y, position.z, 1);
    for (var i = 0; i < 6; i++) {
      if (frustum[i].dot(centerV4) < 0) {
        return false;
      }
    }
    return true;
  },

  getTableDataInView: function () {
    var data = '';
    var first = true;
    var $enum1 = ss.enumerate(this.get_header());
    while ($enum1.moveNext()) {
      var col = $enum1.current;
      if (!first) {
        data += '\t';
      }
      else {
        first = false;
      }
      data += col;
    }
    data += '\r\n';
    var $enum2 = ss.enumerate(this.get__table().rows);
    while ($enum2.moveNext()) {
      var row = $enum2.current;
      var ra = parseFloat(row[this.get_lngColumn()]);
      var dec = parseFloat(row[this.get_latColumn()]);
      var position = Coordinates.geoTo3dDouble(dec, ra);
      if (!this._isPointInFrustum$1(position, globalRenderContext.get_frustum())) {
        continue;
      }
      first = true;
      var $enum3 = ss.enumerate(row);
      while ($enum3.moveNext()) {
        var col = $enum3.current;
        if (!first) {
          data += '\t';
        }
        else {
          first = false;
        }
        data += col;
      }
      data += '\r\n';
    }
    return data;
  },

  prepVertexBuffer: function (renderContext, opacity) {
    this._table$1.lock();
    if (this.lineList != null) {
      this.lineList.clear();
    }
    if (this.lineList2d != null) {
      this.lineList2d.clear();
    }
    if (this.triangleList != null) {
      this.triangleList.clear();
    }
    if (this.pointList != null) {
      this.pointList.clear();
    }
    if (this.triangleList2d != null) {
      this.triangleList2d.clear();
    }
    if (this.lineList == null) {
      this.lineList = new LineList();
    }
    if (this.pointList == null) {
      this.pointList = new PointList(renderContext);
    }
    this.lineList.timeSeries = this.timeSeries;
    if (this.lineList2d == null) {
      this.lineList2d = new LineList();
      this.lineList2d.set_depthBuffered(false);
    }
    this.lineList.timeSeries = this.timeSeries;
    if (this.triangleList == null) {
      this.triangleList = new TriangleList();
    }
    if (this.triangleList2d == null) {
      this.triangleList2d = new TriangleList();
      this.triangleList2d.depthBuffered = false;
    }
    this.positions.length = 0;
    var currentIndex = 0;
    var colorLocal = this.get_color();
    var ecliptic = Coordinates.meanObliquityOfEcliptic(SpaceTimeController.get_jNow()) / 180 * Math.PI;
    var selectDomain = {};
    var mr = LayerManager.get_allMaps()[this.get_referenceFrame()].frame.meanRadius;
    if (!!mr) {
      this._meanRadius$1 = mr;
    }
    var position = new Vector3d();
    var pointSize = 0.0002;
    var pointColor = Colors.get_white();
    var pointStartTime = 0;
    var pointEndTime = 0;
    var $enum1 = ss.enumerate(this._table$1.rows);
    while ($enum1.moveNext()) {
      var row = $enum1.current;
      try {
        if (this.geometryColumn > -1 || (!this.get_coordinatesType() && (this.lngColumn > -1 && this.latColumn > -1)) || ((this.get_coordinatesType() === 1) && (this.get_xAxisColumn() > -1 && this.get_yAxisColumn() > -1))) {
          var Xcoord = 0;
          var Ycoord = 0;
          var Zcoord = 0;
          var alt = 1;
          var altitude = 0;
          var distParces = 0;
          var factor = this.getScaleFactor(this.get_altUnit(), 1);
          if (this.altColumn === -1 || this.get_altType() === 3 || this.bufferIsFlat) {
            alt = 1;
            if ((this.astronomical & !this.bufferIsFlat) === 1) {
              alt = 63239.6717 * 100;
            }
          }
          else {
            if (!this.get_altType()) {
              factor = -factor;
            }
            alt = 0;
            try {
              alt = parseFloat(row[this.altColumn]);
            }
            catch ($e2) {
            }
            if (this.astronomical) {
              factor = factor / (1000 * 149598000);
              distParces = (alt * factor) / 206264.806;
              altitude = (factor * alt);
              alt = (factor * alt);
            }
            else if (this.get_altType() === 2) {
              altitude = (factor * alt);
              alt = (factor * alt / this._meanRadius$1);
            }
            else {
              altitude = (factor * alt);
              alt = 1 + (factor * alt / this._meanRadius$1);
            }
          }
          if (!this.get_coordinatesType() && this.lngColumn > -1 && this.latColumn > -1) {
            Xcoord = parseFloat(row[this.lngColumn]);
            Ycoord = parseFloat(row[this.latColumn]);
            if (this.astronomical) {
              if (!this.get_raUnits()) {
                Xcoord *= 15;
              }
              if (this.bufferIsFlat) {
              }
            }
            else {
              Xcoord += 180;
            }
            var pos = Coordinates.geoTo3dRad(Ycoord, Xcoord, alt);
            if (this.astronomical && !this.bufferIsFlat) {
              pos.rotateX(ecliptic);
            }
            position = pos;
            this.positions.push(position);
          }
          else if (this.get_coordinatesType() === 1) {
            var xyzScale = this.getScaleFactor(this.get_cartesianScale(), this.get_cartesianCustomScale());
            if (this.astronomical) {
              xyzScale /= (1000 * 149598000);
            }
            else {
              xyzScale /= this._meanRadius$1;
            }
            if (this.get_zAxisColumn() > -1) {
              Zcoord = parseFloat(row[this.get_zAxisColumn()]);
            }
            Xcoord = parseFloat(row[this.get_xAxisColumn()]);
            Ycoord = parseFloat(row[this.get_yAxisColumn()]);
            if (this.get_xAxisReverse()) {
              Xcoord = -Xcoord;
            }
            if (this.get_yAxisReverse()) {
              Ycoord = -Ycoord;
            }
            if (this.get_zAxisReverse()) {
              Zcoord = -Zcoord;
            }
            position = Vector3d.create((Xcoord * xyzScale), (Zcoord * xyzScale), (Ycoord * xyzScale));
            this.positions.push(position);
          }
          switch (this.get_colorMap()) {
            case 0:
              pointColor = colorLocal;
              break;
            case 3:
              if (this.get_colorMapColumn() > -1) {
                if (this.get_dynamicColor()) {
                  pointColor = this.get_colorMapper().findClosestColor(this.normalizeColorMapValue(parseFloat(row[this.get_colorMapColumn()])));
                }
                else {
                  pointColor = this._parseColor$1(row[this.get_colorMapColumn()], colorLocal);
                }
              }
              else {
                pointColor = colorLocal;
              }
              break;
            default:
              break;
          }
          if (pointColor == null) {
            pointColor = Colors.get_transparent();
          }
          if (this.sizeColumn > -1) {
            switch (this.pointScaleType) {
              case 0:
                pointSize = parseFloat(row[this.sizeColumn]);
                pointSize = this.normalizePointSize(pointSize);
                break;
              case 2:
                pointSize = parseFloat(row[this.sizeColumn]);
                pointSize = Math.log(pointSize);
                break;
              case 1:
                try {
                  pointSize = parseFloat(row[this.sizeColumn]);
                  pointSize = this.normalizePointSize(pointSize);
                  pointSize = Math.pow(2, pointSize);
                }
                catch ($e3) {
                  pointSize = 0;
                }
                break;
              case 4:
                var size = 0;
                try {
                  size = parseFloat(row[this.sizeColumn]);
                  if (!this.bufferIsFlat) {
                    size = size - 5 * (Util.logN(distParces, 10) - 1);
                    pointSize = (120000000 / Math.pow(1.6, size));
                  }
                  else {
                    pointSize = (40 / Math.pow(1.6, size));
                  }
                }
                catch ($e4) {
                  pointSize = 0;
                }
                break;
              case 3:
                pointSize = 1;
                break;
              default:
                break;
            }
          }
          else {
            pointSize = 0.2;
          }
          if (this.get_plotType() === 1) {
            pointSize = 1;
          }
          if ((this.astronomical & !this.bufferIsFlat) === 1) {
          }
          if (this.startDateColumn > -1) {
            var dateTime = new Date(row[this.startDateColumn]);
            pointStartTime = (SpaceTimeController.utcToJulian(dateTime) - SpaceTimeController.utcToJulian(this.baseDate));
            if (this.endDateColumn > -1) {
              dateTime = new Date(row[this.endDateColumn]);
              pointEndTime = (SpaceTimeController.utcToJulian(dateTime) - SpaceTimeController.utcToJulian(this.baseDate));
            }
            else {
              pointEndTime = pointStartTime;
            }
          }
          this.pointList.addPoint(position, pointColor, new Dates(pointStartTime, pointEndTime), pointSize);
          if (this.geometryColumn > -1) {
            this._parseGeometry$1(row[this.geometryColumn], pointColor, pointColor, altitude, new Dates(pointStartTime, pointEndTime));
          }
          currentIndex++;
        }
      }
      catch ($e5) {
      }
      this.lines = false;
    }
    this._table$1.unlock();
    this._dataDirty$1 = false;
    this.dirty = false;
    return false;
  },
  _parseGeometry$1: function (gs, lineColor, polyColor, alt, date) {
    gs = ss.trim(gs).toLowerCase();
    var index = gs.indexOf('(');
    if (index < 0) {
      return;
    }
    if (!ss.endsWith(gs, ')')) {
      return;
    }
    var commandPart = ss.trim(gs.substring(0, index));
    var parens = gs.substr(index);
    var parts = commandPart.split(' ');
    var command = null;
    var mods = null;
    if (parts.length > 0) {
      var $enum1 = ss.enumerate(parts);
      while ($enum1.moveNext()) {
        var item = $enum1.current;
        if (ss.emptyString(command)) {
          command = item;
        }
        else if (ss.emptyString(mods)) {
          mods = item;
        }
      }
    }
    switch (command) {
      case 'multipolygon':
      case 'polygon':
        this._parsePolygon$1(parens, mods, lineColor, polyColor, alt, date);
        break;
      case 'multilinestring':
        this._parseLineString$1(parens, mods, lineColor, alt, false, date);
        break;
      case 'linestring':
        this._parseLineString$1(parens, mods, lineColor, alt, true, date);
        break;
      case 'geometrycollection':
        parens = parens.substring(1, parens.length - 2);
        var shapes = UiTools.splitString(parens, ',');
        var $enum2 = ss.enumerate(shapes);
        while ($enum2.moveNext()) {
          var shape = $enum2.current;
          this._parseGeometry$1(shape, lineColor, polyColor, alt, date);
        }
        break;
      default:
        break;
    }
  },
  _parsePolygon$1: function (parens, mods, lineColor, polyColor, alt, date) {
    if (!ss.startsWith(parens, '(') && ss.endsWith(parens, ')')) {
      return;
    }
    parens = parens.substring(1, parens.length - 2);
    var shapes = UiTools.splitString(parens, ',');
    var $enum1 = ss.enumerate(shapes);
    while ($enum1.moveNext()) {
      var shape = $enum1.current;
      var lineList = new KmlLineList();
      lineList.astronomical = this.astronomical;
      lineList.meanRadius = this._meanRadius$1;
      lineList.parseWkt(shape, mods, alt, date);
      if (!alt) {
        this._addPolygonFlat$1(false, lineList, 1, polyColor, lineColor, true, true, date);
      }
      else {
        this._addPolygon$1(false, lineList, 1, polyColor, lineColor, true, true, date);
      }
    }
  },
  _parseLineString$1: function (parens, mods, lineColor, alt, single, date) {
    if (!ss.startsWith(parens, '(') && ss.endsWith(parens, ')')) {
      return;
    }
    if (!single) {
      parens = parens.substring(1, parens.length - 2);
    }
    var shapes = UiTools.splitString(parens, ',');
    var $enum1 = ss.enumerate(shapes);
    while ($enum1.moveNext()) {
      var shape = $enum1.current;
      var lineList = new KmlLineList();
      lineList.astronomical = this.astronomical;
      lineList.meanRadius = this._meanRadius$1;
      lineList.parseWkt(shape, mods, alt, date);
      this._addPolygon$1(false, lineList, 1, Colors.get_white(), lineColor, false, false, date);
    }
  },
  _splitShapes$1: function (shapes) {
    var shapeList = [];
    var nesting = 0;
    var current = 0;
    while (current < shapes.length) {
      if (shapes.substr(current, 1) === '(') {
        nesting++;
      }
    }
    return shapeList;
  },
  _addPolygon$1: function (sky, geo, lineWidth, polyColor, lineColor, extrude, fill, date) {
    var vertexList = [];
    var vertexListGround = [];
    for (var i = 0; i < geo.pointList.length; i++) {
      vertexList.push(Coordinates.geoTo3dRad(geo.pointList[i].lat, geo.pointList[i].lng, 1 + (geo.pointList[i].alt / this._meanRadius$1)));
      vertexListGround.push(Coordinates.geoTo3dRad(geo.pointList[i].lat, geo.pointList[i].lng, 1));
    }
    for (var i = 0; i < (geo.pointList.length - 1); i++) {
      if (sky) {
      }
      else {
        if (extrude) {
          this.triangleList.addQuad(vertexList[i], vertexList[i + 1], vertexListGround[i], vertexListGround[i + 1], polyColor, date);
        }
        if (lineWidth > 0) {
          if (extrude) {
            this.lineList.addLine(vertexList[i], vertexList[i + 1], lineColor, date);
          }
          else {
            this.lineList2d.addLine(vertexList[i], vertexList[i + 1], lineColor, date);
          }
          if (extrude) {
            this.lineList.addLine(vertexListGround[i], vertexListGround[i + 1], lineColor, date);
            this.lineList.addLine(vertexList[i], vertexListGround[i], lineColor, date);
            this.lineList.addLine(vertexList[i + 1], vertexListGround[i + 1], lineColor, date);
          }
        }
      }
    }
    if (fill) {
      var indexes = Tessellator.tesselateSimplePoly(vertexList);
      for (var i = 0; i < indexes.length; i += 3) {
        this.triangleList.addTriangle(vertexList[indexes[i]], vertexList[indexes[i + 1]], vertexList[indexes[i + 2]], polyColor, date);
      }
    }
  },
  _addPolygonFlat$1: function (sky, geo, lineWidth, polyColor, lineColor, extrude, fill, date) {
    var vertexList = [];
    for (var i = 0; i < geo.pointList.length; i++) {
      vertexList.push(Coordinates.geoTo3dRad(geo.pointList[i].lat, geo.pointList[i].lng, 1 + (geo.pointList[i].alt / this._meanRadius$1)));
    }
    for (var i = 0; i < (geo.pointList.length - 1); i++) {
      if (sky) {
      }
      else {
        if (lineWidth > 0) {
          this.lineList2d.addLine(vertexList[i], vertexList[i + 1], lineColor, date);
        }
      }
    }
    if (fill) {
      var indexes = Tessellator.tesselateSimplePoly(vertexList);
      for (var i = 0; i < indexes.length; i += 3) {
        this.triangleList2d.addSubdividedTriangles(vertexList[indexes[i]], vertexList[indexes[i + 1]], vertexList[indexes[i + 2]], polyColor, date, 2);
      }
    }
  },
  _parseColor$1: function (colorText, defaultColor) {
    return Color.load(colorText);
  },

  getScaleFactor: function (AltUnit, custom) {
    var factor = 1;
    switch (AltUnit) {
      case 1:
        factor = 1;
        break;
      case 2:
        factor = 1 * 0.3048;
        break;
      case 3:
        factor = (1 / 12) * 0.3048;
        break;
      case 4:
        factor = 5280 * 0.3048;
        break;
      case 5:
        factor = 1000;
        break;
      case 6:
        factor = 1000 * 149598000;
        break;
      case 7:
        factor = 1000 * 149598000 * 63239.6717;
        break;
      case 8:
        factor = 1000 * 149598000 * 206264.806;
        break;
      case 9:
        factor = 1000 * 149598000 * 206264.806 * 1000000;
        break;
      case 10:
        factor = custom;
        break;
      default:
        break;
    }
    return factor;
  },

  get__table: function () {
    return this._table$1;
  },

  set__table: function (value) {
    this._table$1 = value;
    return value;
  },

  useHeadersFromVoTable: function (voTable) {
    var $enum1 = ss.enumerate(voTable.column);
    while ($enum1.moveNext()) {
      var column = $enum1.current;
      this.get_header().push(column.name);
    }
    this.guessHeaderAssignmentsFromVoTable(voTable);
    if (voTable.getRAColumn() != null && voTable.getRAColumn().unit.toLowerCase() === 'deg') {
      this.set_raUnits(1);
    }
  },

  loadFromString: function (data, isUpdate, purgeOld, purgeAll, hasHeader) {
    if (!isUpdate) {
      this._table$1 = new Table();
    }
    this._table$1.lock();
    this._table$1.loadFromString(data, isUpdate, purgeAll, hasHeader);
    if (!isUpdate) {
      this.guessHeaderAssignments();
      if (this.astronomical && this.lngColumn > -1) {
        var max = this.getMaxValue(this.lngColumn);
        if (max > 24) {
          this.set_raUnits(1);
        }
      }
    }
    if (purgeOld) {
      this.purgeByTime();
    }
    this._table$1.unlock();
  },

  purgeByTime: function () {
    if (this.startDateColumn < 0) {
      return;
    }
    var columnToUse = this.startDateColumn;
    if (this.endDateColumn > -1) {
      columnToUse = this.endDateColumn;
    }
    var threasholdTime = SpaceTimeController.get_now();
    var ts = ss.truncate(this.decay) * 24 * 60 * 60 * 1000;
    threasholdTime = new Date(threasholdTime.getDate() - ts);
    var count = this._table$1.rows.length;
    for (var i = 0; i < count; i++) {
      try {
        var row = this._table$1.rows[i];
        var colDate = new Date(row[columnToUse]);
        if (colDate < threasholdTime) {
          this._table$1.rows.splice(i, 1);
          count--;
          i--;
        }
      }
      catch ($e1) {
      }
    }
  },

  cleanUp: function () {
    this.cleanUpBase();
    this._table$1.lock();
    Layer.prototype.cleanUp.call(this);
    this._table$1.unlock();
    this.dirty = true;
  },

  writeLayerProperties: function (xmlWriter) {
    xmlWriter._writeAttributeString('TimeSeries', this.get_timeSeries().toString());
    xmlWriter._writeAttributeString('BeginRange', Util.xmlDate(this.get_beginRange()));
    xmlWriter._writeAttributeString('EndRange', Util.xmlDate(this.get_endRange()));
    xmlWriter._writeAttributeString('Decay', this.get_decay().toString());
    xmlWriter._writeAttributeString('CoordinatesType', Enums.toXml('CoordinatesTypes', this.get_coordinatesType()));
    xmlWriter._writeAttributeString('LatColumn', this.get_latColumn().toString());
    xmlWriter._writeAttributeString('LngColumn', this.get_lngColumn().toString());
    xmlWriter._writeAttributeString('GeometryColumn', this.get_geometryColumn().toString());
    xmlWriter._writeAttributeString('AltType', Enums.toXml('AltTypes', this.get_altType()));
    xmlWriter._writeAttributeString('MarkerMix', Enums.toXml('MarkerMixes', this.get_markerMix()));
    xmlWriter._writeAttributeString('ColorMap', Enums.toXml('ColorMaps', this.get_colorMap()));
    xmlWriter._writeAttributeString('MarkerColumn', this.get_markerColumn().toString());
    xmlWriter._writeAttributeString('PlotType', Enums.toXml('PlotTypes', this.get_plotType()));
    xmlWriter._writeAttributeString('MarkerIndex', this.get_markerIndex().toString());
    xmlWriter._writeAttributeString('MarkerScale', Enums.toXml('MarkerScales', this.get_markerScale()));
    xmlWriter._writeAttributeString('AltUnit', Enums.toXml('AltUnits', this.get_altUnit()));
    xmlWriter._writeAttributeString('AltColumn', this.get_altColumn().toString());
    xmlWriter._writeAttributeString('StartDateColumn', this.get_startDateColumn().toString());
    xmlWriter._writeAttributeString('EndDateColumn', this.get_endDateColumn().toString());
    this._prepareBackCompatTable$1();
    if (this._lastNormalizeSizeColumnIndex$1 > -1) {
      xmlWriter._writeAttributeString('SizeColumn', this._lastNormalizeSizeColumnIndex$1);
      xmlWriter._writeAttributeString('NormalizeSizeColumn', this.sizeColumn.toString());
    } else {
      xmlWriter._writeAttributeString('SizeColumn', this.get_sizeColumn().toString());
    }
    xmlWriter._writeAttributeString('NormalizeSize', this.get_normalizeSize().toString());
    xmlWriter._writeAttributeString('NormalizeSizeClip', this.get_normalizeSizeClip().toString());
    xmlWriter._writeAttributeString('NormalizeSizeMin', this.get_normalizeSizeMin().toString());
    xmlWriter._writeAttributeString('NormalizeSizeMax', this.get_normalizeSizeMax().toString());
    if (this._lastDynamicColorColumnIndex$1 > -1) {
      xmlWriter._writeAttributeString('ColorMapColumn', this._lastDynamicColorColumnIndex$1);
      xmlWriter._writeAttributeString('DynamicColorColumn', this.get_colorMapColumn().toString());
    } else {
      xmlWriter._writeAttributeString('ColorMapColumn', this.get_colorMapColumn().toString());
    }
    xmlWriter._writeAttributeString('DynamicColor', this.get_dynamicColor().toString());
    xmlWriter._writeAttributeString('ColorMapperName', this.get_colorMapperName());
    xmlWriter._writeAttributeString('NormalizeColorMap', this.get_normalizeColorMap().toString());
    xmlWriter._writeAttributeString('NormalizeColorMapMin', this.get_normalizeColorMapMin().toString());
    xmlWriter._writeAttributeString('NormalizeColorMapMax', this.get_normalizeColorMapMax().toString());
    xmlWriter._writeAttributeString('HyperlinkFormat', this.get_hyperlinkFormat());
    xmlWriter._writeAttributeString('HyperlinkColumn', this.get_hyperlinkColumn().toString());
    xmlWriter._writeAttributeString('ScaleFactor', this.get_scaleFactor().toString());
    xmlWriter._writeAttributeString('PointScaleType', Enums.toXml('PointScaleTypes', this.get_pointScaleType()));
    xmlWriter._writeAttributeString('ShowFarSide', this.get_showFarSide().toString());
    xmlWriter._writeAttributeString('RaUnits', Enums.toXml('RAUnits', this.get_raUnits()));
    xmlWriter._writeAttributeString('HoverTextColumn', this.get_nameColumn().toString());
    xmlWriter._writeAttributeString('XAxisColumn', this.get_xAxisColumn().toString());
    xmlWriter._writeAttributeString('XAxisReverse', this.get_xAxisReverse().toString());
    xmlWriter._writeAttributeString('YAxisColumn', this.get_yAxisColumn().toString());
    xmlWriter._writeAttributeString('YAxisReverse', this.get_yAxisReverse().toString());
    xmlWriter._writeAttributeString('ZAxisColumn', this.get_zAxisColumn().toString());
    xmlWriter._writeAttributeString('ZAxisReverse', this.get_zAxisReverse().toString());
    xmlWriter._writeAttributeString('CartesianScale', Enums.toXml('AltUnits', this.get_cartesianScale()));
    xmlWriter._writeAttributeString('CartesianCustomScale', this.get_cartesianCustomScale().toString());
    xmlWriter._writeAttributeString('DynamicData', this.get_dynamicData().toString());
    xmlWriter._writeAttributeString('AutoUpdate', this.get_autoUpdate().toString());
    xmlWriter._writeAttributeString('DataSourceUrl', this.get_dataSourceUrl());
  },

  get_dynamicData: function () {
    return this._dynamicData$1;
  },

  set_dynamicData: function (value) {
    this._dynamicData$1 = value;
    return value;
  },

  get_autoUpdate: function () {
    return this._autoUpdate$1;
  },

  set_autoUpdate: function (value) {
    this._autoUpdate$1 = value;
    return value;
  },

  get_dataSourceUrl: function () {
    return this._dataSourceUrl$1;
  },

  set_dataSourceUrl: function (value) {
    this._dataSourceUrl$1 = value;
    return value;
  },

  get_timeSeries: function () {
    return this.timeSeries;
  },

  set_timeSeries: function (value) {
    if (this.timeSeries !== value) {
      this.version++;
      this.timeSeries = value;
    }
    return value;
  },

  get_beginRange: function () {
    return this._beginRange$1;
  },

  set_beginRange: function (value) {
    if (!ss.compareDates(this._beginRange$1, value)) {
      this.version++;
      this._beginRange$1 = value;
    }
    return value;
  },

  get_endRange: function () {
    return this._endRange$1;
  },

  set_endRange: function (value) {
    if (!ss.compareDates(this._endRange$1, value)) {
      this.version++;
      this._endRange$1 = value;
    }
    return value;
  },

  initializeFromXml: function (node) {
    this.set_timeSeries(ss.boolean(node.attributes.getNamedItem('TimeSeries').nodeValue));
    this.set_beginRange(new Date(node.attributes.getNamedItem('BeginRange').nodeValue));
    this.set_endRange(new Date(node.attributes.getNamedItem('EndRange').nodeValue));
    this.set_decay(parseFloat(node.attributes.getNamedItem('Decay').nodeValue));
    this.set_coordinatesType(Enums.parse('CoordinatesTypes', node.attributes.getNamedItem('CoordinatesType').nodeValue));
    if (this.get_coordinatesType() < 0) {
      this.set_coordinatesType(0);
    }
    this.set_latColumn(parseInt(node.attributes.getNamedItem('LatColumn').nodeValue));
    this.set_lngColumn(parseInt(node.attributes.getNamedItem('LngColumn').nodeValue));
    if (node.attributes.getNamedItem('GeometryColumn') != null) {
      this.set_geometryColumn(parseInt(node.attributes.getNamedItem('GeometryColumn').nodeValue));
    }
    this.set_altType(Enums.parse('AltTypes', node.attributes.getNamedItem('AltType').nodeValue));
    this.set_markerMix(0);
    this.set_colorMap(Enums.parse('ColorMaps', node.attributes.getNamedItem('ColorMap').nodeValue));
    this.set_markerColumn(parseInt(node.attributes.getNamedItem('MarkerColumn').nodeValue));
    this.set_colorMapColumn(parseInt(node.attributes.getNamedItem('ColorMapColumn').nodeValue));
    this.set_plotType(Enums.parse('PlotTypes', node.attributes.getNamedItem('PlotType').nodeValue));
    this.set_markerIndex(parseInt(node.attributes.getNamedItem('MarkerIndex').nodeValue));
    this.set_markerScale(Enums.parse('MarkerScales', node.attributes.getNamedItem('MarkerScale').nodeValue));
    this.set_altUnit(Enums.parse('AltUnits', node.attributes.getNamedItem('AltUnit').nodeValue));
    this.set_altColumn(parseInt(node.attributes.getNamedItem('AltColumn').nodeValue));
    this.set_startDateColumn(parseInt(node.attributes.getNamedItem('StartDateColumn').nodeValue));
    this.set_endDateColumn(parseInt(node.attributes.getNamedItem('EndDateColumn').nodeValue));
    if (node.attributes.getNamedItem('NormalizeSizeColumn') != null) {
      this.set_sizeColumn(parseInt(node.attributes.getNamedItem('NormalizeSizeColumn').nodeValue));
    } else {
      this.set_sizeColumn(parseInt(node.attributes.getNamedItem('SizeColumn').nodeValue));
    }
    if (node.attributes.getNamedItem('NormalizeSize') != null) {
      this.set_normalizeSize(ss.boolean(node.attributes.getNamedItem('NormalizeSize').nodeValue));
      this.set_normalizeSizeClip(ss.boolean(node.attributes.getNamedItem('NormalizeSizeClip').nodeValue));
      this.set_normalizeSizeMin(parseFloat(node.attributes.getNamedItem('NormalizeSizeMin').nodeValue));
      this.set_normalizeSizeMax(parseFloat(node.attributes.getNamedItem('NormalizeSizeMax').nodeValue));
    }
    if (node.attributes.getNamedItem('DynamicColorColumn') != null) {
      this.set_colorMapColumn(parseInt(node.attributes.getNamedItem('DynamicColorColumn').nodeValue));
    } else {
      this.set_colorMapColumn(parseInt(node.attributes.getNamedItem('ColorMapColumn').nodeValue));
    }
    if (node.attributes.getNamedItem('DynamicColor') != null) {
      this.set_dynamicColor(ss.boolean(node.attributes.getNamedItem('DynamicColor').nodeValue));
      this.set_colorMapperName(node.attributes.getNamedItem('ColorMapperName').nodeValue);
      this.set_normalizeColorMap(ss.boolean(node.attributes.getNamedItem('NormalizeColorMap').nodeValue));
      this.set_normalizeColorMapMin(parseFloat(node.attributes.getNamedItem('NormalizeColorMapMin').nodeValue));
      this.set_normalizeColorMapMax(parseFloat(node.attributes.getNamedItem('NormalizeColorMapMax').nodeValue));
    }
    this.set_hyperlinkFormat(node.attributes.getNamedItem('HyperlinkFormat').nodeValue);
    this.set_hyperlinkColumn(parseInt(node.attributes.getNamedItem('HyperlinkColumn').nodeValue));
    this.set_scaleFactor(parseFloat(node.attributes.getNamedItem('ScaleFactor').nodeValue));
    this.set_pointScaleType(Enums.parse('PointScaleTypes', node.attributes.getNamedItem('PointScaleType').nodeValue));
    if (node.attributes.getNamedItem('ShowFarSide') != null) {
      this.set_showFarSide(ss.boolean(node.attributes.getNamedItem('ShowFarSide').nodeValue));
    }
    if (node.attributes.getNamedItem('RaUnits') != null) {
      this.set_raUnits(Enums.parse('RAUnits', node.attributes.getNamedItem('RaUnits').nodeValue));
    }
    if (node.attributes.getNamedItem('HoverTextColumn') != null) {
      this.set_nameColumn(parseInt(node.attributes.getNamedItem('HoverTextColumn').nodeValue));
    }
    if (node.attributes.getNamedItem('XAxisColumn') != null) {
      this.set_xAxisColumn(parseInt(node.attributes.getNamedItem('XAxisColumn').nodeValue));
      this.set_xAxisReverse(ss.boolean(node.attributes.getNamedItem('XAxisReverse').nodeValue));
      this.set_yAxisColumn(parseInt(node.attributes.getNamedItem('YAxisColumn').nodeValue));
      this.set_yAxisReverse(ss.boolean(node.attributes.getNamedItem('YAxisReverse').nodeValue));
      this.set_zAxisColumn(parseInt(node.attributes.getNamedItem('ZAxisColumn').nodeValue));
      this.set_zAxisReverse(ss.boolean(node.attributes.getNamedItem('ZAxisReverse').nodeValue));
      this.set_cartesianScale(Enums.parse('AltUnits', node.attributes.getNamedItem('CartesianScale').nodeValue));
      this.set_cartesianCustomScale(parseFloat(node.attributes.getNamedItem('CartesianCustomScale').nodeValue));
    }
    if (node.attributes.getNamedItem('DynamicData') != null) {
      this.set_dynamicData(ss.boolean(node.attributes.getNamedItem('DynamicData').nodeValue));
      this.set_autoUpdate(ss.boolean(node.attributes.getNamedItem('AutoUpdate').nodeValue));
      this.set_dataSourceUrl(node.attributes.getNamedItem('DataSourceUrl').nodeValue);
    }
  },

  get_decay: function () {
    return this.decay;
  },

  set_decay: function (value) {
    if (this.decay !== value) {
      this.version++;
      this.decay = value;
    }
    return value;
  },

  get_coordinatesType: function () {
    return this._coordinatesType$1;
  },

  set_coordinatesType: function (value) {
    if (this._coordinatesType$1 !== value) {
      this.version++;
      this._coordinatesType$1 = value;
    }
    return value;
  },

  get_latColumn: function () {
    return this.latColumn;
  },

  set_latColumn: function (value) {
    if (this.latColumn !== value) {
      this.version++;
      this.latColumn = value;
    }
    return value;
  },

  get_lngColumn: function () {
    return this.lngColumn;
  },

  set_lngColumn: function (value) {
    if (this.lngColumn !== value) {
      this.version++;
      this.lngColumn = value;
    }
    return value;
  },

  get_geometryColumn: function () {
    return this.geometryColumn;
  },

  set_geometryColumn: function (value) {
    if (this.geometryColumn !== value) {
      this.version++;
      this.geometryColumn = value;
    }
    return value;
  },

  get_xAxisColumn: function () {
    return this._xAxisColumn$1;
  },

  set_xAxisColumn: function (value) {
    if (this._xAxisColumn$1 !== value) {
      this.version++;
      this._xAxisColumn$1 = value;
    }
    return value;
  },

  get_yAxisColumn: function () {
    return this._yAxisColumn$1;
  },

  set_yAxisColumn: function (value) {
    if (this._yAxisColumn$1 !== value) {
      this.version++;
      this._yAxisColumn$1 = value;
    }
    return value;
  },

  get_zAxisColumn: function () {
    return this._zAxisColumn$1;
  },

  set_zAxisColumn: function (value) {
    if (this._zAxisColumn$1 !== value) {
      this.version++;
      this._zAxisColumn$1 = value;
    }
    return value;
  },

  get_xAxisReverse: function () {
    return this._xAxisReverse$1;
  },

  set_xAxisReverse: function (value) {
    if (this._xAxisReverse$1 !== value) {
      this.version++;
      this._xAxisReverse$1 = value;
    }
    return value;
  },

  get_yAxisReverse: function () {
    return this._yAxisReverse$1;
  },

  set_yAxisReverse: function (value) {
    if (this._yAxisReverse$1 !== value) {
      this.version++;
      this._yAxisReverse$1 = value;
    }
    return value;
  },

  get_zAxisReverse: function () {
    return this._zAxisReverse$1;
  },

  set_zAxisReverse: function (value) {
    if (this._zAxisReverse$1 !== value) {
      this.version++;
      this._zAxisReverse$1 = value;
    }
    return value;
  },

  get_altType: function () {
    return this._altType$1;
  },

  set_altType: function (value) {
    if (this._altType$1 !== value) {
      this.version++;
      this._altType$1 = value;
    }
    return value;
  },

  get_markerMix: function () {
    return this._markerMix$1;
  },

  set_markerMix: function (value) {
    if (this._markerMix$1 !== value) {
      this.version++;
      this._markerMix$1 = value;
    }
    return value;
  },

  get_raUnits: function () {
    return this._raUnits$1;
  },

  set_raUnits: function (value) {
    if (this._raUnits$1 !== value) {
      this.version++;
      this._raUnits$1 = value;
    }
    return value;
  },

  get_colorMap: function () {
    return this.colorMap;
  },

  set_colorMap: function (value) {
    if (this.colorMap !== value) {
      this.version++;
      this.colorMap = value;
    }
    return value;
  },

  get_colorMapperName: function () {
    return this.colorMapperName;
  },

  set_colorMapperName: function (value) {
    if (ColorMapContainer.fromNamedColormap(value) == null) {
      throw new Error('Invalid colormap name');
    }
    this.version++;
    this.colorMapperName = value;
    return value;
  },

  get_colorMapper: function () {
    return ColorMapContainer.fromNamedColormap(this.colorMapperName);
  },

  get_dynamicColor: function () {
    return this.dynamicColor;
  },

  set_dynamicColor: function (value) {
    this.version++;
    this.dynamicColor = value;
    return value;
  },

  get_normalizeColorMap: function () {
    return this.normalizeColorMap;
  },

  set_normalizeColorMap: function (value) {
    this.version++;
    this.normalizeColorMap = value;
    return value;
  },

  get_normalizeColorMapMin: function () {
    return this.normalizeColorMapMin;
  },

  set_normalizeColorMapMin: function (value) {
    this.version++;
    this.normalizeColorMapMin = value;
    return value;
  },

  get_normalizeColorMapMax: function () {
    return this.normalizeColorMapMax;
  },

  set_normalizeColorMapMax: function (value) {
    this.version++;
    this.normalizeColorMapMax = value;
    return value;
  },

  normalizeColorMapValue: function (value) {
    if (!this.get_normalizeColorMap()) {
      return value;
    }
    var new_value = (value - this.get_normalizeColorMapMin()) / (this.get_normalizeColorMapMax() - this.get_normalizeColorMapMin());
    if (new_value < 0) {
      new_value = 0;
    } else if (new_value > 1) {
      new_value = 1;
    }
    return new_value;
  },

  get_markerColumn: function () {
    return this._markerColumn$1;
  },

  set_markerColumn: function (value) {
    if (this._markerColumn$1 !== value) {
      this.version++;
      this._markerColumn$1 = value;
    }
    return value;
  },

  get_colorMapColumn: function () {
    return this.colorMapColumn;
  },

  set_colorMapColumn: function (value) {
    if (this.colorMapColumn !== value) {
      this.version++;
      this.colorMapColumn = value;
    }
    return value;
  },

  get_plotType: function () {
    return this._plotType$1;
  },

  set_plotType: function (value) {
    if (this._plotType$1 !== value) {
      this.version++;
      this._plotType$1 = value;
    }
    return value;
  },

  get_markerIndex: function () {
    return this._markerIndex$1;
  },

  set_markerIndex: function (value) {
    if (this._markerIndex$1 !== value) {
      this.version++;
      this._markerIndex$1 = value;
    }
    return value;
  },

  get_showFarSide: function () {
    return this._showFarSide$1;
  },

  set_showFarSide: function (value) {
    if (this._showFarSide$1 !== value) {
      this.version++;
      this._showFarSide$1 = value;
    }
    return value;
  },

  get_markerScale: function () {
    return this._markerScale$1;
  },

  set_markerScale: function (value) {
    if (this._markerScale$1 !== value) {
      this.version++;
      this._markerScale$1 = value;
    }
    return value;
  },

  get_altUnit: function () {
    return this._altUnit$1;
  },

  set_altUnit: function (value) {
    if (this._altUnit$1 !== value) {
      this.version++;
      this._altUnit$1 = value;
    }
    return value;
  },

  get_cartesianScale: function () {
    return this._cartesianScale$1;
  },

  set_cartesianScale: function (value) {
    if (this._cartesianScale$1 !== value) {
      this.version++;
      this._cartesianScale$1 = value;
    }
    return value;
  },

  get_cartesianCustomScale: function () {
    return this._cartesianCustomScale$1;
  },

  set_cartesianCustomScale: function (value) {
    if (this._cartesianCustomScale$1 !== value) {
      this.version++;
      this._cartesianCustomScale$1 = value;
    }
    return value;
  },

  get_altColumn: function () {
    return this.altColumn;
  },

  set_altColumn: function (value) {
    if (this.altColumn !== value) {
      this.version++;
      this.altColumn = value;
    }
    return value;
  },

  get_startDateColumn: function () {
    return this.startDateColumn;
  },

  set_startDateColumn: function (value) {
    if (this.startDateColumn !== value) {
      this.version++;
      this.startDateColumn = value;
    }
    return value;
  },

  get_endDateColumn: function () {
    return this.endDateColumn;
  },

  set_endDateColumn: function (value) {
    if (this.endDateColumn !== value) {
      this.version++;
      this.endDateColumn = value;
    }
    return value;
  },

  get_sizeColumn: function () {
    return this.sizeColumn;
  },

  set_sizeColumn: function (value) {
    if (this.sizeColumn !== value) {
      this.version++;
      this.sizeColumn = value;
    }
    return value;
  },

  get_normalizeSize: function () {
    return this.normalizeSize;
  },

  set_normalizeSize: function (value) {
    if (this.normalizeSize !== value) {
      this.version++;
      this.normalizeSize = value;
    }
    return value;
  },

  get_normalizeSizeClip: function () {
    return this.normalizeSizeClip;
  },

  set_normalizeSizeClip: function (value) {
    if (this.normalizeSizeClip !== value) {
      this.version++;
      this.normalizeSizeClip = value;
    }
    return value;
  },

  get_normalizeSizeMin: function () {
    return this.normalizeSizeMin;
  },

  set_normalizeSizeMin: function (value) {
    if (this.normalizeSizeMin !== value) {
      this.version++;
      this.normalizeSizeMin = value;
    }
    return value;
  },

  get_normalizeSizeMax: function () {
    return this.normalizeSizeMax;
  },

  set_normalizeSizeMax: function (value) {
    if (this.normalizeSizeMax !== value) {
      this.version++;
      this.normalizeSizeMax = value;
    }
    return value;
  },

  normalizePointSize: function (value) {
    if (!this.get_normalizeSize()) {
      return value;
    }
    var new_value = (value - this.get_normalizeSizeMin()) / (this.get_normalizeSizeMax() - this.get_normalizeSizeMin());
    if (this.get_normalizeSizeClip()) {
      if (new_value < 0) {
        new_value = 0;
      }
      else if (new_value > 1) {
        new_value = 1;
      }
    }
    return new_value;
  },

  get_nameColumn: function () {
    return this.nameColumn;
  },

  set_nameColumn: function (value) {
    if (this.nameColumn !== value) {
      this.version++;
      this.nameColumn = value;
    }
    return value;
  },

  get_hyperlinkFormat: function () {
    return this._hyperlinkFormat$1;
  },

  set_hyperlinkFormat: function (value) {
    if (this._hyperlinkFormat$1 !== value) {
      this.version++;
      this._hyperlinkFormat$1 = value;
    }
    return value;
  },

  get_hyperlinkColumn: function () {
    return this._hyperlinkColumn$1;
  },

  set_hyperlinkColumn: function (value) {
    if (this._hyperlinkColumn$1 !== value) {
      this.version++;
      this._hyperlinkColumn$1 = value;
    }
    return value;
  },

  get_scaleFactor: function () {
    return this.scaleFactor;
  },

  set_scaleFactor: function (value) {
    if (this.scaleFactor !== value) {
      this.version++;
      this.scaleFactor = value;
    }
    return value;
  },

  get_pointScaleType: function () {
    return this.pointScaleType;
  },

  set_pointScaleType: function (value) {
    if (this.pointScaleType !== value) {
      this.version++;
      this.pointScaleType = value;
    }
    return value;
  },

  draw: function (renderContext, opacity, flat) {
    var device = renderContext;
    if (this.version !== this.lastVersion) {
      this.cleanUp();
    }
    this.lastVersion = this.version;
    if (this.bufferIsFlat !== flat) {
      this.cleanUp();
      this.bufferIsFlat = flat;
    }
    if (this.dirty) {
      this.prepVertexBuffer(device, opacity);
    }
    var jNow = SpaceTimeController.get_jNow() - SpaceTimeController.utcToJulian(this.baseDate);
    var adjustedScale = this.scaleFactor * 3;
    if (flat && this.astronomical && (this._markerScale$1 === 1)) {
      adjustedScale = (this.scaleFactor / (renderContext.viewCamera.zoom / 360));
    }
    if (this.triangleList2d != null) {
      this.triangleList2d.decay = this.decay;
      this.triangleList2d.sky = this.get_astronomical();
      this.triangleList2d.timeSeries = this.timeSeries;
      this.triangleList2d.jNow = jNow;
      this.triangleList2d.draw(renderContext, opacity * this.get_opacity(), 1);
    }
    if (this.triangleList != null) {
      this.triangleList.decay = this.decay;
      this.triangleList.sky = this.get_astronomical();
      this.triangleList.timeSeries = this.timeSeries;
      this.triangleList.jNow = jNow;
      this.triangleList.draw(renderContext, opacity * this.get_opacity(), 1);
    }
    if (this.pointList != null) {
      this.pointList.depthBuffered = false;
      this.pointList.showFarSide = this.get_showFarSide();
      this.pointList.decay = (this.timeSeries) ? this.decay : 0;
      this.pointList.sky = this.get_astronomical();
      this.pointList.timeSeries = this.timeSeries;
      this.pointList.jNow = jNow;
      this.pointList.scale = (this._markerScale$1 === 1) ? adjustedScale : -adjustedScale;
      switch (this._plotType$1) {
        case 0:
          this.pointList.draw(renderContext, opacity * this.get_opacity(), false);
          break;
        case 2:
          this.pointList.drawTextured(renderContext, SpreadSheetLayer.get__circleTexture$1().texture2d, opacity * this.get_opacity());
          break;
        case 1:
          this.pointList.drawTextured(renderContext, PushPin.getPushPinTexture(19), opacity * this.get_opacity());
          break;
        case 3:
          this.pointList.drawTextured(renderContext, PushPin.getPushPinTexture(35), opacity * this.get_opacity());
          break;
        case 5:
        case 4:
          this.pointList.drawTextured(renderContext, PushPin.getPushPinTexture(this._markerIndex$1), opacity * this.get_opacity());
          break;
        default:
          break;
      }
    }
    if (this.lineList != null) {
      this.lineList.sky = this.get_astronomical();
      this.lineList.decay = this.decay;
      this.lineList.timeSeries = this.timeSeries;
      this.lineList.jNow = jNow;
      this.lineList.drawLines(renderContext, opacity * this.get_opacity());
    }
    if (this.lineList2d != null) {
      this.lineList2d.sky = this.get_astronomical();
      this.lineList2d.decay = this.decay;
      this.lineList2d.timeSeries = this.timeSeries;
      this.lineList2d.showFarSide = this.get_showFarSide();
      this.lineList2d.jNow = jNow;
      this.lineList2d.drawLines(renderContext, opacity * this.get_opacity());
    }
    return true;
  },

  cleanUpBase: function () {
    if (this.lineList != null) {
      this.lineList.clear();
    }
    if (this.lineList2d != null) {
      this.lineList2d.clear();
    }
    if (this.triangleList2d != null) {
      this.triangleList2d.clear();
    }
    if (this.pointList != null) {
      this.pointList.clear();
    }
    if (this.triangleList != null) {
      this.triangleList.clear();
    }
  }
};

registerType("SpreadSheetLayer", [SpreadSheetLayer, SpreadSheetLayer$, Layer]);

// wwtlib.TimeSeriesLayer

export function TimeSeriesLayer() {
  this.isLongIndex = false;
  this.shapeVertexCount = 0;
  this.lines = false;
  this.latColumn = -1;
  this.fixedSize = 1;
  this.decay = 16;
  this.timeSeries = false;
  this._dynamicData$1 = false;
  this._autoUpdate$1 = false;
  this._dataSourceUrl$1 = '';
  this._beginRange$1 = new Date('1/1/2100');
  this._endRange$1 = new Date('01/01/1800');
  this.markerDomainValues = {};
  this.colorDomainValues = {};
  this._coordinatesType$1 = 0;
  this.lngColumn = -1;
  this.geometryColumn = -1;
  this._xAxisColumn$1 = -1;
  this._yAxisColumn$1 = -1;
  this._zAxisColumn$1 = -1;
  this._xAxisReverse$1 = false;
  this._yAxisReverse$1 = false;
  this._zAxisReverse$1 = false;
  this._altType$1 = 3;
  this._markerMix$1 = 0;
  this._raUnits$1 = 0;
  this._colorMap$1 = 3;
  this._markerColumn$1 = -1;
  this._colorMapColumn$1 = -1;
  this._plotType$1 = 0;
  this._markerIndex$1 = 0;
  this._showFarSide$1 = false;
  this._markerScale$1 = 1;
  this._altUnit$1 = 1;
  this._cartesianScale$1 = 1;
  this._cartesianCustomScale$1 = 1;
  this.altColumn = -1;
  this.startDateColumn = -1;
  this.endDateColumn = -1;
  this.sizeColumn = -1;
  this.nameColumn = 0;
  this._hyperlinkFormat$1 = '';
  this._hyperlinkColumn$1 = -1;
  this.scaleFactor = 1;
  this.pointScaleType = 1;
  this.positions = [];
  this.bufferIsFlat = false;
  this.baseDate = new Date(2010, 0, 1, 12, 0, 0);
  this.dirty = true;
  this.lastVersion = 0;
  Layer.call(this);
}

TimeSeriesLayer._circleTexture$1 = null;

TimeSeriesLayer.get__circleTexture$1 = function () {
  return TimeSeriesLayer._circleTexture$1;
};

var TimeSeriesLayer$ = {
  get_dynamicData: function () {
    return this._dynamicData$1;
  },

  set_dynamicData: function (value) {
    this._dynamicData$1 = value;
    return value;
  },

  get_autoUpdate: function () {
    return this._autoUpdate$1;
  },

  set_autoUpdate: function (value) {
    this._autoUpdate$1 = value;
    return value;
  },

  get_dataSourceUrl: function () {
    return this._dataSourceUrl$1;
  },

  set_dataSourceUrl: function (value) {
    this._dataSourceUrl$1 = value;
    return value;
  },

  get_timeSeries: function () {
    return this.timeSeries;
  },

  set_timeSeries: function (value) {
    if (this.timeSeries !== value) {
      this.version++;
      this.timeSeries = value;
    }
    return value;
  },

  get_header: function () {
    return null;
  },

  get_beginRange: function () {
    return this._beginRange$1;
  },

  set_beginRange: function (value) {
    if (!ss.compareDates(this._beginRange$1, value)) {
      this.version++;
      this._beginRange$1 = value;
    }
    return value;
  },

  get_endRange: function () {
    return this._endRange$1;
  },

  set_endRange: function (value) {
    if (!ss.compareDates(this._endRange$1, value)) {
      this.version++;
      this._endRange$1 = value;
    }
    return value;
  },

  initializeFromXml: function (node) {
    this.set_timeSeries(ss.boolean(node.attributes.getNamedItem('TimeSeries').nodeValue));
    this.set_beginRange(new Date(node.attributes.getNamedItem('BeginRange').nodeValue));
    this.set_endRange(new Date(node.attributes.getNamedItem('EndRange').nodeValue));
    this.set_decay(parseFloat(node.attributes.getNamedItem('Decay').nodeValue));
    this.set_coordinatesType(Enums.parse('CoordinatesTypes', node.attributes.getNamedItem('CoordinatesType').nodeValue));
    if (this.get_coordinatesType() < 0) {
      this.set_coordinatesType(0);
    }
    this.set_latColumn(parseInt(node.attributes.getNamedItem('LatColumn').nodeValue));
    this.set_lngColumn(parseInt(node.attributes.getNamedItem('LngColumn').nodeValue));
    if (node.attributes.getNamedItem('GeometryColumn') != null) {
      this.set_geometryColumn(parseInt(node.attributes.getNamedItem('GeometryColumn').nodeValue));
    }
    switch (node.attributes.getNamedItem('AltType').nodeValue) {
      case 'Depth':
        this.set_altType(0);
        break;
      case 'Altitude':
        this.set_altType(1);
        break;
      case 'Distance':
        this.set_altType(2);
        break;
      case 'SeaLevel':
        this.set_altType(3);
        break;
      case 'Terrain':
        this.set_altType(4);
        break;
      default:
        break;
    }
    this.set_markerMix(0);
    switch (node.attributes.getNamedItem('ColorMap').nodeValue) {
      case 'Same_For_All':
        this.set__colorMap(0);
        break;
      case 'Group_by_Values':
        this.set__colorMap(2);
        break;
      case 'Per_Column_Literal':
        this.set__colorMap(3);
        break;
      default:
        break;
    }
    this.set_markerColumn(parseInt(node.attributes.getNamedItem('MarkerColumn').nodeValue));
    this.set_colorMapColumn(parseInt(node.attributes.getNamedItem('ColorMapColumn').nodeValue));
    switch (node.attributes.getNamedItem('PlotType').nodeValue) {
      case 'Gaussian':
        this.set_plotType(0);
        break;
      case 'Point':
        this.set_plotType(1);
        break;
      case 'Circle':
        this.set_plotType(2);
        break;
      case 'PushPin':
        this.set_plotType(4);
        break;
      default:
        break;
    }
    this.set_markerIndex(parseInt(node.attributes.getNamedItem('MarkerIndex').nodeValue));
    switch (node.attributes.getNamedItem('MarkerScale').nodeValue) {
      case 'Screen':
        this.set_markerScale(0);
        break;
      case 'World':
        this.set_markerScale(1);
        break;
      default:
        break;
    }
    switch (node.attributes.getNamedItem('AltUnit').nodeValue) {
      case 'Meters':
        this.set_altUnit(1);
        break;
      case 'Feet':
        this.set_altUnit(2);
        break;
      case 'Inches':
        this.set_altUnit(3);
        break;
      case 'Miles':
        this.set_altUnit(4);
        break;
      case 'Kilometers':
        this.set_altUnit(5);
        break;
      case 'AstronomicalUnits':
        this.set_altUnit(6);
        break;
      case 'LightYears':
        this.set_altUnit(7);
        break;
      case 'Parsecs':
        this.set_altUnit(8);
        break;
      case 'MegaParsecs':
        this.set_altUnit(9);
        break;
      case 'Custom':
        this.set_altUnit(10);
        break;
      default:
        break;
    }
    this.set_altColumn(parseInt(node.attributes.getNamedItem('AltColumn').nodeValue));
    this.set_startDateColumn(parseInt(node.attributes.getNamedItem('StartDateColumn').nodeValue));
    this.set_endDateColumn(parseInt(node.attributes.getNamedItem('EndDateColumn').nodeValue));
    this.set_sizeColumn(parseInt(node.attributes.getNamedItem('SizeColumn').nodeValue));
    this.set_hyperlinkFormat(node.attributes.getNamedItem('HyperlinkFormat').nodeValue);
    this.set_hyperlinkColumn(parseInt(node.attributes.getNamedItem('HyperlinkColumn').nodeValue));
    this.set_scaleFactor(parseFloat(node.attributes.getNamedItem('ScaleFactor').nodeValue));
    switch (node.attributes.getNamedItem('PointScaleType').nodeValue) {
      case 'Linear':
        this.set_pointScaleType(0);
        break;
      case 'Power':
        this.set_pointScaleType(1);
        break;
      case 'Log':
        this.set_pointScaleType(2);
        break;
      case 'Constant':
        this.set_pointScaleType(3);
        break;
      case 'StellarMagnitude':
        this.set_pointScaleType(4);
        break;
      default:
        break;
    }
    if (node.attributes.getNamedItem('ShowFarSide') != null) {
      this.set_showFarSide(ss.boolean(node.attributes.getNamedItem('ShowFarSide').nodeValue));
    }
    if (node.attributes.getNamedItem('RaUnits') != null) {
      switch (node.attributes.getNamedItem('RaUnits').nodeValue) {
        case 'Hours':
          this.set_raUnits(0);
          break;
        case 'Degrees':
          this.set_raUnits(1);
          break;
      }
    }
    if (node.attributes.getNamedItem('HoverTextColumn') != null) {
      this.set_nameColumn(parseInt(node.attributes.getNamedItem('HoverTextColumn').nodeValue));
    }
    if (node.attributes.getNamedItem('XAxisColumn') != null) {
      this.set_xAxisColumn(parseInt(node.attributes.getNamedItem('XAxisColumn').nodeValue));
      this.set_xAxisReverse(ss.boolean(node.attributes.getNamedItem('XAxisReverse').nodeValue));
      this.set_yAxisColumn(parseInt(node.attributes.getNamedItem('YAxisColumn').nodeValue));
      this.set_yAxisReverse(ss.boolean(node.attributes.getNamedItem('YAxisReverse').nodeValue));
      this.set_zAxisColumn(parseInt(node.attributes.getNamedItem('ZAxisColumn').nodeValue));
      this.set_zAxisReverse(ss.boolean(node.attributes.getNamedItem('ZAxisReverse').nodeValue));
      switch (node.attributes.getNamedItem('CartesianScale').nodeValue) {
        case 'Meters':
          this.set_cartesianScale(1);
          break;
        case 'Feet':
          this.set_cartesianScale(2);
          break;
        case 'Inches':
          this.set_cartesianScale(3);
          break;
        case 'Miles':
          this.set_cartesianScale(4);
          break;
        case 'Kilometers':
          this.set_cartesianScale(5);
          break;
        case 'AstronomicalUnits':
          this.set_cartesianScale(6);
          break;
        case 'LightYears':
          this.set_cartesianScale(7);
          break;
        case 'Parsecs':
          this.set_cartesianScale(8);
          break;
        case 'MegaParsecs':
          this.set_cartesianScale(9);
          break;
        case 'Custom':
          this.set_cartesianScale(10);
          break;
        default:
          break;
      }
      this.set_cartesianCustomScale(parseFloat(node.attributes.getNamedItem('CartesianCustomScale').nodeValue));
    }
    if (node.attributes.getNamedItem('DynamicData') != null) {
      this.set_dynamicData(ss.boolean(node.attributes.getNamedItem('DynamicData').nodeValue));
      this.set_autoUpdate(ss.boolean(node.attributes.getNamedItem('AutoUpdate').nodeValue));
      this.set_dataSourceUrl(node.attributes.getNamedItem('DataSourceUrl').nodeValue);
    }
  },

  computeDateDomainRange: function (columnStart, columnEnd) { },

  getDomainValues: function (column) {
    return [];
  },

  get_decay: function () {
    return this.decay;
  },

  set_decay: function (value) {
    if (this.decay !== value) {
      this.version++;
      this.decay = value;
    }
    return value;
  },

  get_coordinatesType: function () {
    return this._coordinatesType$1;
  },

  set_coordinatesType: function (value) {
    if (this._coordinatesType$1 !== value) {
      this.version++;
      this._coordinatesType$1 = value;
    }
    return value;
  },

  get_latColumn: function () {
    return this.latColumn;
  },

  set_latColumn: function (value) {
    if (this.latColumn !== value) {
      this.version++;
      this.latColumn = value;
    }
    return value;
  },

  get_lngColumn: function () {
    return this.lngColumn;
  },

  set_lngColumn: function (value) {
    if (this.lngColumn !== value) {
      this.version++;
      this.lngColumn = value;
    }
    return value;
  },

  get_geometryColumn: function () {
    return this.geometryColumn;
  },

  set_geometryColumn: function (value) {
    if (this.geometryColumn !== value) {
      this.version++;
      this.geometryColumn = value;
    }
    return value;
  },

  get_xAxisColumn: function () {
    return this._xAxisColumn$1;
  },

  set_xAxisColumn: function (value) {
    if (this._xAxisColumn$1 !== value) {
      this.version++;
      this._xAxisColumn$1 = value;
    }
    return value;
  },

  get_yAxisColumn: function () {
    return this._yAxisColumn$1;
  },

  set_yAxisColumn: function (value) {
    if (this._yAxisColumn$1 !== value) {
      this.version++;
      this._yAxisColumn$1 = value;
    }
    return value;
  },

  get_zAxisColumn: function () {
    return this._zAxisColumn$1;
  },

  set_zAxisColumn: function (value) {
    if (this._zAxisColumn$1 !== value) {
      this.version++;
      this._zAxisColumn$1 = value;
    }
    return value;
  },

  get_xAxisReverse: function () {
    return this._xAxisReverse$1;
  },

  set_xAxisReverse: function (value) {
    if (this._xAxisReverse$1 !== value) {
      this.version++;
      this._xAxisReverse$1 = value;
    }
    return value;
  },

  get_yAxisReverse: function () {
    return this._yAxisReverse$1;
  },

  set_yAxisReverse: function (value) {
    if (this._yAxisReverse$1 !== value) {
      this.version++;
      this._yAxisReverse$1 = value;
    }
    return value;
  },

  get_zAxisReverse: function () {
    return this._zAxisReverse$1;
  },

  set_zAxisReverse: function (value) {
    if (this._zAxisReverse$1 !== value) {
      this.version++;
      this._zAxisReverse$1 = value;
    }
    return value;
  },

  get_altType: function () {
    return this._altType$1;
  },

  set_altType: function (value) {
    if (this._altType$1 !== value) {
      this.version++;
      this._altType$1 = value;
    }
    return value;
  },

  get_markerMix: function () {
    return this._markerMix$1;
  },

  set_markerMix: function (value) {
    if (this._markerMix$1 !== value) {
      this.version++;
      this._markerMix$1 = value;
    }
    return value;
  },

  get_raUnits: function () {
    return this._raUnits$1;
  },

  set_raUnits: function (value) {
    if (this._raUnits$1 !== value) {
      this.version++;
      this._raUnits$1 = value;
    }
    return value;
  },

  get__colorMap: function () {
    return this._colorMap$1;
  },

  set__colorMap: function (value) {
    if (this._colorMap$1 !== value) {
      this.version++;
      this._colorMap$1 = value;
    }
    return value;
  },

  get_markerColumn: function () {
    return this._markerColumn$1;
  },

  set_markerColumn: function (value) {
    if (this._markerColumn$1 !== value) {
      this.version++;
      this._markerColumn$1 = value;
    }
    return value;
  },

  get_colorMapColumn: function () {
    return this._colorMapColumn$1;
  },

  set_colorMapColumn: function (value) {
    if (this._colorMapColumn$1 !== value) {
      this.version++;
      this._colorMapColumn$1 = value;
    }
    return value;
  },

  get_plotType: function () {
    return this._plotType$1;
  },

  set_plotType: function (value) {
    if (this._plotType$1 !== value) {
      this.version++;
      this._plotType$1 = value;
    }
    return value;
  },

  get_markerIndex: function () {
    return this._markerIndex$1;
  },

  set_markerIndex: function (value) {
    if (this._markerIndex$1 !== value) {
      this.version++;
      this._markerIndex$1 = value;
    }
    return value;
  },

  get_showFarSide: function () {
    return this._showFarSide$1;
  },

  set_showFarSide: function (value) {
    if (this._showFarSide$1 !== value) {
      this.version++;
      this._showFarSide$1 = value;
    }
    return value;
  },

  get_markerScale: function () {
    return this._markerScale$1;
  },

  set_markerScale: function (value) {
    if (this._markerScale$1 !== value) {
      this.version++;
      this._markerScale$1 = value;
    }
    return value;
  },

  get_altUnit: function () {
    return this._altUnit$1;
  },

  set_altUnit: function (value) {
    if (this._altUnit$1 !== value) {
      this.version++;
      this._altUnit$1 = value;
    }
    return value;
  },

  get_cartesianScale: function () {
    return this._cartesianScale$1;
  },

  set_cartesianScale: function (value) {
    if (this._cartesianScale$1 !== value) {
      this.version++;
      this._cartesianScale$1 = value;
    }
    return value;
  },

  get_cartesianCustomScale: function () {
    return this._cartesianCustomScale$1;
  },

  set_cartesianCustomScale: function (value) {
    if (this._cartesianCustomScale$1 !== value) {
      this.version++;
      this._cartesianCustomScale$1 = value;
    }
    return value;
  },

  get_altColumn: function () {
    return this.altColumn;
  },

  set_altColumn: function (value) {
    if (this.altColumn !== value) {
      this.version++;
      this.altColumn = value;
    }
    return value;
  },

  get_startDateColumn: function () {
    return this.startDateColumn;
  },

  set_startDateColumn: function (value) {
    if (this.startDateColumn !== value) {
      this.version++;
      this.startDateColumn = value;
    }
    return value;
  },

  get_endDateColumn: function () {
    return this.endDateColumn;
  },

  set_endDateColumn: function (value) {
    if (this.endDateColumn !== value) {
      this.version++;
      this.endDateColumn = value;
    }
    return value;
  },

  get_sizeColumn: function () {
    return this.sizeColumn;
  },

  set_sizeColumn: function (value) {
    if (this.sizeColumn !== value) {
      this.version++;
      this.sizeColumn = value;
    }
    return value;
  },

  get_nameColumn: function () {
    return this.nameColumn;
  },

  set_nameColumn: function (value) {
    if (this.nameColumn !== value) {
      this.version++;
      this.nameColumn = value;
    }
    return value;
  },

  get_hyperlinkFormat: function () {
    return this._hyperlinkFormat$1;
  },

  set_hyperlinkFormat: function (value) {
    if (this._hyperlinkFormat$1 !== value) {
      this.version++;
      this._hyperlinkFormat$1 = value;
    }
    return value;
  },

  get_hyperlinkColumn: function () {
    return this._hyperlinkColumn$1;
  },

  set_hyperlinkColumn: function (value) {
    if (this._hyperlinkColumn$1 !== value) {
      this.version++;
      this._hyperlinkColumn$1 = value;
    }
    return value;
  },

  get_scaleFactor: function () {
    return this.scaleFactor;
  },

  set_scaleFactor: function (value) {
    if (this.scaleFactor !== value) {
      this.version++;
      this.scaleFactor = value;
    }
    return value;
  },

  get_pointScaleType: function () {
    return this.pointScaleType;
  },

  set_pointScaleType: function (value) {
    if (this.pointScaleType !== value) {
      this.version++;
      this.pointScaleType = value;
    }
    return value;
  },

  prepVertexBuffer: function (renderContext, opacity) {
    return true;
  },

  draw: function (renderContext, opacity, flat) {
    var device = renderContext;
    if (this.version !== this.lastVersion) {
      this.cleanUp();
    }
    if (this.bufferIsFlat !== flat) {
      this.cleanUp();
      this.bufferIsFlat = flat;
    }
    if (this.dirty) {
      this.prepVertexBuffer(device, opacity);
    }
    var jNow = SpaceTimeController.get_jNow() - SpaceTimeController.utcToJulian(this.baseDate);
    var adjustedScale = this.scaleFactor;
    if (flat && this.astronomical && (this._markerScale$1 === 1)) {
      adjustedScale = (this.scaleFactor / (renderContext.viewCamera.zoom / 360));
    }
    if (this.triangleList2d != null) {
      this.triangleList2d.decay = this.decay;
      this.triangleList2d.sky = this.get_astronomical();
      this.triangleList2d.timeSeries = this.timeSeries;
      this.triangleList2d.jNow = jNow;
      this.triangleList2d.draw(renderContext, opacity * this.get_opacity(), 1);
    }
    if (this.triangleList != null) {
      this.triangleList.decay = this.decay;
      this.triangleList.sky = this.get_astronomical();
      this.triangleList.timeSeries = this.timeSeries;
      this.triangleList.jNow = jNow;
      this.triangleList.draw(renderContext, opacity * this.get_opacity(), 1);
    }
    if (this.pointList != null) {
      this.pointList.depthBuffered = false;
      this.pointList.decay = this.decay;
      this.pointList.sky = this.get_astronomical();
      this.pointList.timeSeries = this.timeSeries;
      this.pointList.jNow = jNow;
      this.pointList.scale = (this._markerScale$1 === 1) ? adjustedScale : -adjustedScale;
      this.pointList.draw(renderContext, opacity * this.get_opacity(), false);
    }
    if (this.lineList != null) {
      this.lineList.sky = this.get_astronomical();
      this.lineList.decay = this.decay;
      this.lineList.timeSeries = this.timeSeries;
      this.lineList.jNow = jNow;
      this.lineList.drawLines(renderContext, opacity * this.get_opacity());
    }
    if (this.lineList2d != null) {
      this.lineList2d.sky = this.get_astronomical();
      this.lineList2d.decay = this.decay;
      this.lineList2d.timeSeries = this.timeSeries;
      this.lineList2d.showFarSide = this.get_showFarSide();
      this.lineList2d.jNow = jNow;
      this.lineList2d.drawLines(renderContext, opacity * this.get_opacity());
    }
    return true;
  },

  initFromXml: function (node) {
    Layer.prototype.initFromXml.call(this, node);
  },

  cleanUp: function () {
    if (this.lineList != null) {
      this.lineList.clear();
    }
    if (this.lineList2d != null) {
      this.lineList2d.clear();
    }
    if (this.triangleList2d != null) {
      this.triangleList2d.clear();
    }
    if (this.pointList != null) {
      this.pointList.clear();
    }
    if (this.triangleList != null) {
      this.triangleList.clear();
    }
  },

  dynamicUpdate: function () {
    return false;
  }
};

registerType("TimeSeriesLayer", [TimeSeriesLayer, TimeSeriesLayer$, Layer]);

// wwtlib.VoTableLayer

export function VoTableLayer() {
  this.isLongIndex = false;
  this.shapeVertexCount = 0;
  this.lines = false;
  this.latColumn = -1;
  this.fixedSize = 1;
  this.decay = 0;
  this.timeSeries = false;
  this._dynamicData$1 = false;
  this._autoUpdate$1 = false;
  this._dataSourceUrl$1 = '';
  this._beginRange$1 = new Date('1/1/2100');
  this._endRange$1 = new Date('01/01/1800');
  this.markerDomainValues = {};
  this.colorDomainValues = {};
  this._coordinatesType$1 = 0;
  this.lngColumn = -1;
  this.geometryColumn = -1;
  this._xAxisColumn$1 = -1;
  this._yAxisColumn$1 = -1;
  this._zAxisColumn$1 = -1;
  this._xAxisReverse$1 = false;
  this._yAxisReverse$1 = false;
  this._zAxisReverse$1 = false;
  this._altType$1 = 3;
  this._markerMix$1 = 0;
  this._raUnits$1 = 0;
  this._colorMap$1 = 3;
  this._markerColumn$1 = -1;
  this._colorMapColumn$1 = -1;
  this._plotType$1 = 0;
  this._markerIndex$1 = 0;
  this._showFarSide$1 = false;
  this._markerScale$1 = 1;
  this._altUnit$1 = 1;
  this._cartesianScale$1 = 1;
  this._cartesianCustomScale$1 = 1;
  this.altColumn = -1;
  this.startDateColumn = -1;
  this.endDateColumn = -1;
  this.sizeColumn = -1;
  this.nameColumn = 0;
  this._hyperlinkFormat$1 = '';
  this._hyperlinkColumn$1 = -1;
  this.scaleFactor = 1;
  this.pointScaleType = 1;
  this.positions = [];
  this.bufferIsFlat = false;
  this.baseDate = new Date(2010, 0, 1, 12, 0, 0);
  this.dirty = true;
  this._filename$1 = '';
  Layer.call(this);
  this._table$1 = null;
  this._filename$1 = '';
  this.set_plotType(2);
}

VoTableLayer._circleTexture$1 = null;

VoTableLayer.get__circleTexture$1 = function () {
  if (VoTableLayer._circleTexture$1 == null) {
    var url = URLHelpers.singleton.engineAssetUrl('circle.png');
    VoTableLayer._circleTexture$1 = Texture.fromUrl(url);
  }
  return VoTableLayer._circleTexture$1;
};

VoTableLayer.create = function (table, plotType) {
  var layer = new VoTableLayer();
  layer._table$1 = table;
  layer._filename$1 = table.loadFilename;
  layer.set_lngColumn(table.getRAColumn().index);
  layer.set_latColumn(table.getDecColumn().index);
  layer.sizeColumn = table.getColumnByUcd('phot.mag').index;
  layer.set_plotType(plotType);
  return layer;
};

var VoTableLayer$ = {
  get_dynamicData: function () {
    return this._dynamicData$1;
  },

  set_dynamicData: function (value) {
    this._dynamicData$1 = value;
    return value;
  },

  get_autoUpdate: function () {
    return this._autoUpdate$1;
  },

  set_autoUpdate: function (value) {
    this._autoUpdate$1 = value;
    return value;
  },

  get_dataSourceUrl: function () {
    return this._dataSourceUrl$1;
  },

  set_dataSourceUrl: function (value) {
    this._dataSourceUrl$1 = value;
    return value;
  },

  get_timeSeries: function () {
    return this.timeSeries;
  },

  set_timeSeries: function (value) {
    if (this.timeSeries !== value) {
      this.version++;
      this.timeSeries = value;
    }
    return value;
  },

  get_beginRange: function () {
    return this._beginRange$1;
  },

  set_beginRange: function (value) {
    if (!ss.compareDates(this._beginRange$1, value)) {
      this.version++;
      this._beginRange$1 = value;
    }
    return value;
  },

  get_endRange: function () {
    return this._endRange$1;
  },

  set_endRange: function (value) {
    if (!ss.compareDates(this._endRange$1, value)) {
      this.version++;
      this._endRange$1 = value;
    }
    return value;
  },

  initializeFromXml: function (node) {
    this.set_timeSeries(ss.boolean(node.attributes.getNamedItem('TimeSeries').nodeValue));
    this.set_beginRange(new Date(node.attributes.getNamedItem('BeginRange').nodeValue));
    this.set_endRange(new Date(node.attributes.getNamedItem('EndRange').nodeValue));
    this.set_decay(parseFloat(node.attributes.getNamedItem('Decay').nodeValue));
    this.set_coordinatesType(Enums.parse('CoordinatesTypes', node.attributes.getNamedItem('CoordinatesType').nodeValue));
    if (this.get_coordinatesType() < 0) {
      this.set_coordinatesType(0);
    }
    this.set_latColumn(parseInt(node.attributes.getNamedItem('LatColumn').nodeValue));
    this.set_lngColumn(parseInt(node.attributes.getNamedItem('LngColumn').nodeValue));
    if (node.attributes.getNamedItem('GeometryColumn') != null) {
      this.set_geometryColumn(parseInt(node.attributes.getNamedItem('GeometryColumn').nodeValue));
    }
    switch (node.attributes.getNamedItem('AltType').nodeValue) {
      case 'Depth':
        this.set_altType(0);
        break;
      case 'Altitude':
        this.set_altType(1);
        break;
      case 'Distance':
        this.set_altType(2);
        break;
      case 'SeaLevel':
        this.set_altType(3);
        break;
      case 'Terrain':
        this.set_altType(4);
        break;
      default:
        break;
    }
    this.set_markerMix(0);
    switch (node.attributes.getNamedItem('ColorMap').nodeValue) {
      case 'Same_For_All':
        this.set__colorMap(0);
        break;
      case 'Group_by_Values':
        this.set__colorMap(2);
        break;
      case 'Per_Column_Literal':
        this.set__colorMap(3);
        break;
      default:
        break;
    }
    this.set_markerColumn(parseInt(node.attributes.getNamedItem('MarkerColumn').nodeValue));
    this.set_colorMapColumn(parseInt(node.attributes.getNamedItem('ColorMapColumn').nodeValue));
    switch (node.attributes.getNamedItem('PlotType').nodeValue) {
      case 'Gaussian':
        this.set_plotType(0);
        break;
      case 'Point':
        this.set_plotType(1);
        break;
      case 'Circle':
        this.set_plotType(2);
        break;
      case 'PushPin':
        this.set_plotType(4);
        break;
      default:
        break;
    }
    this.set_markerIndex(parseInt(node.attributes.getNamedItem('MarkerIndex').nodeValue));
    switch (node.attributes.getNamedItem('MarkerScale').nodeValue) {
      case 'Screen':
        this.set_markerScale(0);
        break;
      case 'World':
        this.set_markerScale(1);
        break;
      default:
        break;
    }
    switch (node.attributes.getNamedItem('AltUnit').nodeValue) {
      case 'Meters':
        this.set_altUnit(1);
        break;
      case 'Feet':
        this.set_altUnit(2);
        break;
      case 'Inches':
        this.set_altUnit(3);
        break;
      case 'Miles':
        this.set_altUnit(4);
        break;
      case 'Kilometers':
        this.set_altUnit(5);
        break;
      case 'AstronomicalUnits':
        this.set_altUnit(6);
        break;
      case 'LightYears':
        this.set_altUnit(7);
        break;
      case 'Parsecs':
        this.set_altUnit(8);
        break;
      case 'MegaParsecs':
        this.set_altUnit(9);
        break;
      case 'Custom':
        this.set_altUnit(10);
        break;
      default:
        break;
    }
    this.set_altColumn(parseInt(node.attributes.getNamedItem('AltColumn').nodeValue));
    this.set_startDateColumn(parseInt(node.attributes.getNamedItem('StartDateColumn').nodeValue));
    this.set_endDateColumn(parseInt(node.attributes.getNamedItem('EndDateColumn').nodeValue));
    this.set_sizeColumn(parseInt(node.attributes.getNamedItem('SizeColumn').nodeValue));
    this.set_hyperlinkFormat(node.attributes.getNamedItem('HyperlinkFormat').nodeValue);
    this.set_hyperlinkColumn(parseInt(node.attributes.getNamedItem('HyperlinkColumn').nodeValue));
    this.set_scaleFactor(parseFloat(node.attributes.getNamedItem('ScaleFactor').nodeValue));
    switch (node.attributes.getNamedItem('PointScaleType').nodeValue) {
      case 'Linear':
        this.set_pointScaleType(0);
        break;
      case 'Power':
        this.set_pointScaleType(1);
        break;
      case 'Log':
        this.set_pointScaleType(2);
        break;
      case 'Constant':
        this.set_pointScaleType(3);
        break;
      case 'StellarMagnitude':
        this.set_pointScaleType(4);
        break;
      default:
        break;
    }
    if (node.attributes.getNamedItem('ShowFarSide') != null) {
      this.set_showFarSide(ss.boolean(node.attributes.getNamedItem('ShowFarSide').nodeValue));
    }
    if (node.attributes.getNamedItem('RaUnits') != null) {
      switch (node.attributes.getNamedItem('RaUnits').nodeValue) {
        case 'Hours':
          this.set_raUnits(0);
          break;
        case 'Degrees':
          this.set_raUnits(1);
          break;
      }
    }
    if (node.attributes.getNamedItem('HoverTextColumn') != null) {
      this.set_nameColumn(parseInt(node.attributes.getNamedItem('HoverTextColumn').nodeValue));
    }
    if (node.attributes.getNamedItem('XAxisColumn') != null) {
      this.set_xAxisColumn(parseInt(node.attributes.getNamedItem('XAxisColumn').nodeValue));
      this.set_xAxisReverse(ss.boolean(node.attributes.getNamedItem('XAxisReverse').nodeValue));
      this.set_yAxisColumn(parseInt(node.attributes.getNamedItem('YAxisColumn').nodeValue));
      this.set_yAxisReverse(ss.boolean(node.attributes.getNamedItem('YAxisReverse').nodeValue));
      this.set_zAxisColumn(parseInt(node.attributes.getNamedItem('ZAxisColumn').nodeValue));
      this.set_zAxisReverse(ss.boolean(node.attributes.getNamedItem('ZAxisReverse').nodeValue));
      switch (node.attributes.getNamedItem('CartesianScale').nodeValue) {
        case 'Meters':
          this.set_cartesianScale(1);
          break;
        case 'Feet':
          this.set_cartesianScale(2);
          break;
        case 'Inches':
          this.set_cartesianScale(3);
          break;
        case 'Miles':
          this.set_cartesianScale(4);
          break;
        case 'Kilometers':
          this.set_cartesianScale(5);
          break;
        case 'AstronomicalUnits':
          this.set_cartesianScale(6);
          break;
        case 'LightYears':
          this.set_cartesianScale(7);
          break;
        case 'Parsecs':
          this.set_cartesianScale(8);
          break;
        case 'MegaParsecs':
          this.set_cartesianScale(9);
          break;
        case 'Custom':
          this.set_cartesianScale(10);
          break;
        default:
          break;
      }
      this.set_cartesianCustomScale(parseFloat(node.attributes.getNamedItem('CartesianCustomScale').nodeValue));
    }
    if (node.attributes.getNamedItem('DynamicData') != null) {
      this.set_dynamicData(ss.boolean(node.attributes.getNamedItem('DynamicData').nodeValue));
      this.set_autoUpdate(ss.boolean(node.attributes.getNamedItem('AutoUpdate').nodeValue));
      this.set_dataSourceUrl(node.attributes.getNamedItem('DataSourceUrl').nodeValue);
    }
  },

  get_decay: function () {
    return this.decay;
  },

  set_decay: function (value) {
    if (this.decay !== value) {
      this.version++;
      this.decay = value;
    }
    return value;
  },

  get_coordinatesType: function () {
    return this._coordinatesType$1;
  },

  set_coordinatesType: function (value) {
    if (this._coordinatesType$1 !== value) {
      this.version++;
      this._coordinatesType$1 = value;
    }
    return value;
  },

  get_latColumn: function () {
    return this.latColumn;
  },

  set_latColumn: function (value) {
    if (this.latColumn !== value) {
      this.version++;
      this.latColumn = value;
    }
    return value;
  },

  get_lngColumn: function () {
    return this.lngColumn;
  },

  set_lngColumn: function (value) {
    if (this.lngColumn !== value) {
      this.version++;
      this.lngColumn = value;
    }
    return value;
  },

  get_geometryColumn: function () {
    return this.geometryColumn;
  },

  set_geometryColumn: function (value) {
    if (this.geometryColumn !== value) {
      this.version++;
      this.geometryColumn = value;
    }
    return value;
  },

  get_xAxisColumn: function () {
    return this._xAxisColumn$1;
  },

  set_xAxisColumn: function (value) {
    if (this._xAxisColumn$1 !== value) {
      this.version++;
      this._xAxisColumn$1 = value;
    }
    return value;
  },

  get_yAxisColumn: function () {
    return this._yAxisColumn$1;
  },

  set_yAxisColumn: function (value) {
    if (this._yAxisColumn$1 !== value) {
      this.version++;
      this._yAxisColumn$1 = value;
    }
    return value;
  },

  get_zAxisColumn: function () {
    return this._zAxisColumn$1;
  },

  set_zAxisColumn: function (value) {
    if (this._zAxisColumn$1 !== value) {
      this.version++;
      this._zAxisColumn$1 = value;
    }
    return value;
  },

  get_xAxisReverse: function () {
    return this._xAxisReverse$1;
  },

  set_xAxisReverse: function (value) {
    if (this._xAxisReverse$1 !== value) {
      this.version++;
      this._xAxisReverse$1 = value;
    }
    return value;
  },

  get_yAxisReverse: function () {
    return this._yAxisReverse$1;
  },

  set_yAxisReverse: function (value) {
    if (this._yAxisReverse$1 !== value) {
      this.version++;
      this._yAxisReverse$1 = value;
    }
    return value;
  },

  get_zAxisReverse: function () {
    return this._zAxisReverse$1;
  },

  set_zAxisReverse: function (value) {
    if (this._zAxisReverse$1 !== value) {
      this.version++;
      this._zAxisReverse$1 = value;
    }
    return value;
  },

  get_altType: function () {
    return this._altType$1;
  },

  set_altType: function (value) {
    if (this._altType$1 !== value) {
      this.version++;
      this._altType$1 = value;
    }
    return value;
  },

  get_markerMix: function () {
    return this._markerMix$1;
  },

  set_markerMix: function (value) {
    if (this._markerMix$1 !== value) {
      this.version++;
      this._markerMix$1 = value;
    }
    return value;
  },

  get_raUnits: function () {
    return this._raUnits$1;
  },

  set_raUnits: function (value) {
    if (this._raUnits$1 !== value) {
      this.version++;
      this._raUnits$1 = value;
    }
    return value;
  },

  get__colorMap: function () {
    return this._colorMap$1;
  },

  set__colorMap: function (value) {
    if (this._colorMap$1 !== value) {
      this.version++;
      this._colorMap$1 = value;
    }
    return value;
  },

  get_markerColumn: function () {
    return this._markerColumn$1;
  },

  set_markerColumn: function (value) {
    if (this._markerColumn$1 !== value) {
      this.version++;
      this._markerColumn$1 = value;
    }
    return value;
  },

  get_colorMapColumn: function () {
    return this._colorMapColumn$1;
  },

  set_colorMapColumn: function (value) {
    if (this._colorMapColumn$1 !== value) {
      this.version++;
      this._colorMapColumn$1 = value;
    }
    return value;
  },

  get_plotType: function () {
    return this._plotType$1;
  },

  set_plotType: function (value) {
    if (this._plotType$1 !== value) {
      this.version++;
      this._plotType$1 = value;
    }
    return value;
  },

  get_markerIndex: function () {
    return this._markerIndex$1;
  },

  set_markerIndex: function (value) {
    if (this._markerIndex$1 !== value) {
      this.version++;
      this._markerIndex$1 = value;
    }
    return value;
  },

  get_showFarSide: function () {
    return this._showFarSide$1;
  },

  set_showFarSide: function (value) {
    if (this._showFarSide$1 !== value) {
      this.version++;
      this._showFarSide$1 = value;
    }
    return value;
  },

  get_markerScale: function () {
    return this._markerScale$1;
  },

  set_markerScale: function (value) {
    if (this._markerScale$1 !== value) {
      this.version++;
      this._markerScale$1 = value;
    }
    return value;
  },

  get_altUnit: function () {
    return this._altUnit$1;
  },

  set_altUnit: function (value) {
    if (this._altUnit$1 !== value) {
      this.version++;
      this._altUnit$1 = value;
    }
    return value;
  },

  get_cartesianScale: function () {
    return this._cartesianScale$1;
  },

  set_cartesianScale: function (value) {
    if (this._cartesianScale$1 !== value) {
      this.version++;
      this._cartesianScale$1 = value;
    }
    return value;
  },

  get_cartesianCustomScale: function () {
    return this._cartesianCustomScale$1;
  },

  set_cartesianCustomScale: function (value) {
    if (this._cartesianCustomScale$1 !== value) {
      this.version++;
      this._cartesianCustomScale$1 = value;
    }
    return value;
  },

  get_altColumn: function () {
    return this.altColumn;
  },

  set_altColumn: function (value) {
    if (this.altColumn !== value) {
      this.version++;
      this.altColumn = value;
    }
    return value;
  },

  get_startDateColumn: function () {
    return this.startDateColumn;
  },

  set_startDateColumn: function (value) {
    if (this.startDateColumn !== value) {
      this.version++;
      this.startDateColumn = value;
    }
    return value;
  },

  get_endDateColumn: function () {
    return this.endDateColumn;
  },

  set_endDateColumn: function (value) {
    if (this.endDateColumn !== value) {
      this.version++;
      this.endDateColumn = value;
    }
    return value;
  },

  get_sizeColumn: function () {
    return this.sizeColumn;
  },

  set_sizeColumn: function (value) {
    if (this.sizeColumn !== value) {
      this.version++;
      this.sizeColumn = value;
    }
    return value;
  },

  get_nameColumn: function () {
    return this.nameColumn;
  },

  set_nameColumn: function (value) {
    if (this.nameColumn !== value) {
      this.version++;
      this.nameColumn = value;
    }
    return value;
  },

  get_hyperlinkFormat: function () {
    return this._hyperlinkFormat$1;
  },

  set_hyperlinkFormat: function (value) {
    if (this._hyperlinkFormat$1 !== value) {
      this.version++;
      this._hyperlinkFormat$1 = value;
    }
    return value;
  },

  get_hyperlinkColumn: function () {
    return this._hyperlinkColumn$1;
  },

  set_hyperlinkColumn: function (value) {
    if (this._hyperlinkColumn$1 !== value) {
      this.version++;
      this._hyperlinkColumn$1 = value;
    }
    return value;
  },

  get_scaleFactor: function () {
    return this.scaleFactor;
  },

  set_scaleFactor: function (value) {
    if (this.scaleFactor !== value) {
      this.version++;
      this.scaleFactor = value;
    }
    return value;
  },

  get_pointScaleType: function () {
    return this.pointScaleType;
  },

  set_pointScaleType: function (value) {
    if (this.pointScaleType !== value) {
      this.version++;
      this.pointScaleType = value;
    }
    return value;
  },

  draw: function (renderContext, opacity, flat) {
    var device = renderContext;
    if (this.bufferIsFlat !== flat) {
      this.cleanUp();
      this.bufferIsFlat = flat;
    }
    if (this.dirty) {
      this.prepVertexBuffer(renderContext, opacity);
      this.dirty = false;
    }
    var jNow = SpaceTimeController.get_jNow() - SpaceTimeController.utcToJulian(this.baseDate);
    var adjustedScale = this.scaleFactor;
    if (flat && this.astronomical && (this._markerScale$1 === 1)) {
      adjustedScale = (this.scaleFactor / (renderContext.viewCamera.zoom / 360));
    }
    if (this.triangleList2d != null) {
      this.triangleList2d.decay = this.decay;
      this.triangleList2d.sky = this.get_astronomical();
      this.triangleList2d.timeSeries = this.timeSeries;
      this.triangleList2d.jNow = jNow;
      this.triangleList2d.draw(renderContext, opacity * this.get_opacity(), 1);
    }
    if (this.triangleList != null) {
      this.triangleList.decay = this.decay;
      this.triangleList.sky = this.get_astronomical();
      this.triangleList.timeSeries = this.timeSeries;
      this.triangleList.jNow = jNow;
      this.triangleList.draw(renderContext, opacity * this.get_opacity(), 1);
    }
    if (this.pointList != null) {
      this.pointList.depthBuffered = false;
      this.pointList.showFarSide = this.get_showFarSide();
      this.pointList.decay = (this.timeSeries) ? this.decay : 0;
      this.pointList.sky = this.get_astronomical();
      this.pointList.timeSeries = this.timeSeries;
      this.pointList.jNow = jNow;
      this.pointList.scale = (this._markerScale$1 === 1) ? adjustedScale : -adjustedScale;
      switch (this._plotType$1) {
        case 0:
          this.pointList.draw(renderContext, opacity * this.get_opacity(), false);
          break;
        case 2:
          this.pointList.drawTextured(renderContext, VoTableLayer.get__circleTexture$1().texture2d, opacity * this.get_opacity());
          break;
        case 1:
          this.pointList.drawTextured(renderContext, PushPin.getPushPinTexture(19), opacity * this.get_opacity());
          break;
        case 3:
          this.pointList.drawTextured(renderContext, PushPin.getPushPinTexture(35), opacity * this.get_opacity());
          break;
        case 5:
        case 4:
          this.pointList.drawTextured(renderContext, PushPin.getPushPinTexture(this._markerIndex$1), opacity * this.get_opacity());
          break;
        default:
          break;
      }
    }
    if (this.lineList != null) {
      this.lineList.sky = this.get_astronomical();
      this.lineList.decay = this.decay;
      this.lineList.timeSeries = this.timeSeries;
      this.lineList.jNow = jNow;
      this.lineList.drawLines(renderContext, opacity * this.get_opacity());
    }
    if (this.lineList2d != null) {
      this.lineList2d.sky = this.get_astronomical();
      this.lineList2d.decay = this.decay;
      this.lineList2d.timeSeries = this.timeSeries;
      this.lineList2d.showFarSide = this.get_showFarSide();
      this.lineList2d.jNow = jNow;
      this.lineList2d.drawLines(renderContext, opacity * this.get_opacity());
    }
    return true;
  },

  initFromXml: function (node) {
    Layer.prototype.initFromXml.call(this, node);
  },

  cleanUp: function () {
    this.dirty = true;
    if (this.lineList != null) {
      this.lineList.clear();
    }
    if (this.lineList2d != null) {
      this.lineList2d.clear();
    }
    if (this.triangleList2d != null) {
      this.triangleList2d.clear();
    }
    if (this.pointList != null) {
      this.pointList.clear();
    }
    if (this.triangleList != null) {
      this.triangleList.clear();
    }
  },

  dynamicUpdate: function () {
    return false;
  },

  addFilesToCabinet: function (fc) {
    var fName = this._filename$1;
    var fileName = fc.tempDirectory + ss.format('{0}\\{1}.txt', fc.get_packageID(), this.id.toString());
    var path = fName.substring(0, fName.lastIndexOf('\\') + 1);
    var path2 = fileName.substring(0, fileName.lastIndexOf('\\') + 1);
  },

  loadData: function (tourDoc, filename) {
    var $this = this;

    var blob = tourDoc.getFileBlob(filename);
    var doc = new FileReader();
    doc.onloadend = function (ee) {
      var data = ss.safeCast(doc.result, String);
      $this._table$1 = VoTable.loadFromString(data);
      $this.set_lngColumn($this._table$1.getRAColumn().index);
      $this.set_latColumn($this._table$1.getDecColumn().index);
    };
    doc.readAsText(blob);
  },

  canCopyToClipboard: function () {
    return true;
  },

  copyToClipboard: function () { },

  findClosest: function (target, distance, defaultPlace, astronomical) {
    var searchPoint = Coordinates.geoTo3dDouble(target.get_lat(), target.get_lng());
    var dist;
    if (defaultPlace != null) {
      var testPoint = Coordinates.raDecTo3dAu(defaultPlace.get_RA(), -defaultPlace.get_dec(), -1);
      dist = Vector3d.subtractVectors(searchPoint, testPoint);
      distance = dist.length();
    }
    var closestItem = -1;
    var index = 0;
    var $enum1 = ss.enumerate(this.positions);
    while ($enum1.moveNext()) {
      var point = $enum1.current;
      dist = Vector3d.subtractVectors(searchPoint, point);
      if (dist.length() < distance) {
        distance = dist.length();
        closestItem = index;
      }
      index++;
    }
    if (closestItem === -1) {
      return defaultPlace;
    }
    var pnt = Coordinates.cartesianToSpherical2(this.positions[closestItem]);
    var name = this._table$1.rows[closestItem].columnData[this.nameColumn].toString();
    if (this.nameColumn === this.startDateColumn || this.nameColumn === this.endDateColumn) {
      name = SpreadSheetLayer.parseDate(name).toString();
    }
    if (ss.emptyString(name)) {
      name = ss.format('RA={0}, Dec={1}', Coordinates.formatHMS(pnt.get_RA()), Coordinates.formatDMS(pnt.get_dec()));
    }
    var place = Place.create(name, pnt.get_lat(), pnt.get_RA(), 268435456, '', 2, -1);
    var rowData = {};
    for (var i = 0; i < ss.keyCount(this._table$1.columns); i++) {
      var colValue = this._table$1.rows[closestItem].get_item(i).toString();
      if (i === this.startDateColumn || i === this.endDateColumn) {
        colValue = SpreadSheetLayer.parseDate(colValue).toString();
      }
      if (!ss.keyExists(rowData, this._table$1.column[i].name) && !ss.emptyString(this._table$1.column[i].name)) {
        rowData[this._table$1.column[i].name] = colValue;
      }
      else {
        rowData['Column' + i.toString()] = colValue;
      }
    }
    place.set_tag(rowData);
    return place;
  },

  prepVertexBuffer: function (renderContext, opacity) {
    var col = this._table$1.getColumnByUcd('meta.id');
    if (col == null) {
      col = this._table$1.column[0];
    }
    var siapSet = this.isSiapResultSet();
    if (this.pointList == null) {
      this.pointList = new PointList(renderContext);
    }
    if (this.lineList2d == null) {
      this.lineList2d = new LineList();
    }
    this.lineList2d.clear();
    var stcsCol = this._table$1.getColumnByUcd('phys.area;obs.field');
    if (stcsCol == null && ss.keyExists(this._table$1.columns, 'regionSTCS')) {
      stcsCol = this._table$1.columns['regionSTCS'];
    }
    if (!this.get_plotType()) {
      this.set_markerScale(1);
    } else {
      this.set_markerScale(0);
    }
    var vertList = [];
    var indexList = [];
    var lastItem = new TimeSeriesPointVertex();
    this.positions.length = 0;
    var currentIndex = 0;
    var color = Color.fromArgb(ss.truncate((opacity * this.get_color().a)), this.get_color().r, this.get_color().g, this.get_color().b);
    this.pointScaleType = 4;
    var $enum1 = ss.enumerate(this._table$1.rows);
    while ($enum1.moveNext()) {
      var row = $enum1.current;
      try {
        if (this.lngColumn > -1 && this.latColumn > -1) {
          var ra = parseFloat(row.get_item(this.get_lngColumn()).toString());
          var dec = parseFloat(row.get_item(this.get_latColumn()).toString());
          var position = Coordinates.geoTo3dDouble(dec, ra);
          lastItem.position = position;
          this.positions.push(lastItem.position);
          lastItem.set_color(color);
          if (this.sizeColumn > -1) {
            try {
              if (!this.get_markerScale()) {
                lastItem.pointSize = 20;
              }
              else {
                switch (this.pointScaleType) {
                  case 0:
                    lastItem.pointSize = parseFloat(row.get_item(this.sizeColumn).toString());
                    break;
                  case 2:
                    lastItem.pointSize = Math.log(parseFloat(row.get_item(this.sizeColumn).toString()));
                    break;
                  case 1:
                    lastItem.pointSize = Math.pow(2, parseFloat(row.get_item(this.sizeColumn).toString()));
                    break;
                  case 4:
                    var size = parseFloat(row.get_item(this.sizeColumn).toString());
                    lastItem.pointSize = (40 / Math.pow(1.6, size)) * 10;
                    break;
                  case 3:
                    lastItem.pointSize = 1;
                    break;
                  default:
                    break;
                }
              }
            }
            catch ($e2) {
              lastItem.pointSize = 0.01;
            }
          }
          else {
            if (!this.get_markerScale()) {
              lastItem.pointSize = 20;
            }
            else {
              lastItem.pointSize = Math.pow(2, 1) * 100;
            }
          }
          if (this.startDateColumn > -1) {
            var dateTime = ss.date(row.get_item(this.startDateColumn).toString());
            lastItem.tu = SpaceTimeController.utcToJulian(dateTime);
            lastItem.tv = 0;
          }
          vertList.push(lastItem);
          this.pointList.addPoint(lastItem.position, lastItem.color, new Dates(lastItem.tu, lastItem.tv), lastItem.pointSize);
          currentIndex++;
        }
        if (siapSet && stcsCol != null) {
          this._addSiapStcRow$1(stcsCol.name, row, row === this._table$1.selectedRow);
        }
      }
      catch ($e3) {
      }
      this.lines = false;
    }
    if (siapSet && stcsCol != null) {
      this._addSiapStcRow$1(stcsCol.name, this._table$1.selectedRow, true);
    }
    return true;
  },
  _addSiapStcRow$1: function (stcsColName, row, selected) {
    var stcs = ss.replaceString(row.getColumnData(stcsColName).toString(), '  ', ' ');
    var col = Color.fromArgb(120, 255, 255, 255);
    if (selected) {
      col = Colors.get_yellow();
    }
    if (ss.startsWith(stcs, 'Polygon J2000')) {
      var parts = stcs.split(' ');
      var len = parts.length;
      var index = 0;
      while (index < len) {
        if (parts[index] === 'Polygon') {
          index += 2;
          var lastPoint = new Vector3d();
          var firstPoint = new Vector3d();
          var start = true;
          for (var i = index; i < len; i += 2) {
            if (parts[i] === 'Polygon') {
              start = true;
              break;
            }
            else {
              var Xcoord = Coordinates.parseRA(parts[i], true) * 15 + 180;
              var Ycoord = Coordinates.parseDec(parts[i + 1]);
              var pnt = Coordinates.geoTo3dDouble(Ycoord, Xcoord);
              if (!start) {
                this.lineList2d.addLine(lastPoint, pnt, col, new Dates(0, 0));
              }
              else {
                firstPoint = pnt;
                start = false;
              }
              lastPoint = pnt;
            }
            index += 2;
          }
          if (len > 4) {
            this.lineList2d.addLine(firstPoint, lastPoint, col, new Dates(0, 0));
          }
        }
      }
    }
  },

  isSiapResultSet: function () {
    return this._table$1.getColumnByUcd('vox:image.title') != null && this._table$1.getColumnByUcd('VOX:Image.AccessReference') != null;
  },

  get_header: function () {
    var header = new Array(ss.keyCount(this._table$1.columns));
    var index = 0;
    var $enum1 = ss.enumerate(this._table$1.column);
    while ($enum1.moveNext()) {
      var col = $enum1.current;
      header[index++] = col.name;
    }
    return header;
  },

  get_table: function () {
    return this._table$1;
  },

  set_table: function (value) {
    this._table$1 = value;
    return value;
  }
};

registerType("VoTableLayer", [VoTableLayer, VoTableLayer$, Layer]);

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

// wwtlib.ISSLayer

export function ISSLayer() {
  Object3dLayer.call(this);
  this.id = ISSLayer.issGuid;
}

ISSLayer.issGuid = Guid.fromString('00000001-0002-0003-0405-060708090a0b');
ISSLayer._loading$2 = false;
ISSLayer._issmodel$2 = null;
ISSLayer._doc$2 = null;

ISSLayer.loadBackground = function () {
  if (ISSLayer._loading$2 || freestandingMode) {
    return;
  }
  ISSLayer._loading$2 = true;
  var url = URLHelpers.singleton.coreStaticUrl('data/iss.wtt');
  ISSLayer._doc$2 = TourDocument.fromUrlRaw(url, function () {
    ISSLayer.createSpaceStation();
  });
};

ISSLayer.createSpaceStation = function () {
  ISSLayer._doc$2.set_id('28016047-97a9-4b33-a226-cd820262a151');
  var filename = '0c10ae54-b6da-4282-bfda-f34562d403bc.3ds';
  var o3d = new Object3d(ISSLayer._doc$2, filename, true, false, true, Colors.get_white());
  if (o3d != null) {
    o3d.issLayer = true;
    ISSLayer._issmodel$2 = o3d;
  }
};

var ISSLayer$ = {
  draw: function (renderContext, opacity, flat) {
    if (this.object3d == null && ISSLayer._issmodel$2 == null) {
      if (!ISSLayer._loading$2) {
        var worldView = Matrix3d.multiplyMatrix(renderContext.get_world(), renderContext.get_view());
        var v = worldView.transform(Vector3d.get_empty());
        var scaleFactor = Math.sqrt(worldView.get_m11() * worldView.get_m11() + worldView.get_m22() * worldView.get_m22() + worldView.get_m33() * worldView.get_m33());
        var dist = v.length();
        var radius = scaleFactor;
        var viewportHeight = ss.truncate(renderContext.height);
        var p11 = renderContext.get_projection().get_m11();
        var p34 = renderContext.get_projection().get_m34();
        var p44 = renderContext.get_projection().get_m44();
        var w = Math.abs(p34) * dist + p44;
        var pixelsPerUnit = (p11 / w) * viewportHeight;
        var radiusInPixels = (radius * pixelsPerUnit);
        if (radiusInPixels > 0.5) {
          ISSLayer.loadBackground();
        }
      }
    }
    this.object3d = ISSLayer._issmodel$2;
    return Object3dLayer.prototype.draw.call(this, renderContext, opacity, flat);
  },

  getPrimaryUI: function () {
    return null;
  },

  addFilesToCabinet: function (fc) {
    return;
  },

  loadData: function (doc, filename) {
    return;
  },

  cleanUp: function () { }
};

registerType("ISSLayer", [ISSLayer, ISSLayer$, Object3dLayer]);

// wwtlib.CatalogSpreadSheetLayer

export function CatalogSpreadSheetLayer() {
  this._addedTiles$2 = {};
  SpreadSheetLayer.call(this);
}

var CatalogSpreadSheetLayer$ = {
  addTileRows: function (tileKey, catalogRows) {
    if (!ss.keyExists(this._addedTiles$2, tileKey)) {
      var $enum1 = ss.enumerate(catalogRows);
      while ($enum1.moveNext()) {
        var row = $enum1.current;
        this.get__table().rows.push(row);
      }
      this.dirty = true;
      this._addedTiles$2[tileKey] = true;
    }
  },

  removeTileRows: function (tileKey, catalogRows) {
    if (ss.keyExists(this._addedTiles$2, tileKey)) {
      var $enum1 = ss.enumerate(catalogRows);
      while ($enum1.moveNext()) {
        var row = $enum1.current;
        ss.remove(this.get__table().rows, row);
      }
      this.dirty = true;
      delete this._addedTiles$2[tileKey];
    }
  },

  cleanUp: function () {
    SpreadSheetLayer.prototype.cleanUp.call(this);
    ss.clearKeys(this._addedTiles$2);
    this.get__table().rows.length = 0;
  }
};

registerType("CatalogSpreadSheetLayer", [CatalogSpreadSheetLayer, CatalogSpreadSheetLayer$, SpreadSheetLayer]);

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
