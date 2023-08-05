// Copyright 2023 the .NET Foundation
// Licensed under the MIT License

// The toplevel WorldWide Telescope WebGL engine API module.
//
// To maintain compatibility with a *lot* of legacy code, we export way more
// types and interfaces than we would if we were starting from scratch, often
// with confusing or misspelled names. So it goes.

export { ss } from "./ss.js";

export { Util } from "./baseutil.js";

export { CalD, DAY_OF_WEEK, DT } from "./astrocalc/date.js";
export { COR, C3D, CT } from "./astrocalc/coordinate_transformation.js";
export { ASEP } from "./astrocalc/angular_separation.js";
export { CAAEarth, VSC, } from "./astrocalc/earth.js";
export { CAAFK5 } from "./astrocalc/fk5.js";
export { NUC, CAANutation } from "./astrocalc/nutation.js";
export { CAASun } from "./astrocalc/sun.js";
export { CAAMercury } from "./astrocalc/mercury.js";
export { CAAVenus } from "./astrocalc/venus.js";
export { CAAMars } from "./astrocalc/mars.js";
export { CAAJupiter } from "./astrocalc/jupiter.js";
export { CAASaturn } from "./astrocalc/saturn.js";
export { CAAUranus } from "./astrocalc/uranus.js";
export { CAANeptune } from "./astrocalc/neptune.js";
export { CAAPluto, PlutoCoefficient1, PlutoCoefficient2 } from "./astrocalc/pluto.js";
export { CAAKepler } from "./astrocalc/kepler.js";
export { ABR, ACFT } from "./astrocalc/aberration.js";
export { DYT } from "./astrocalc/dynamical_time.js";
export { CAAEclipticalElementDetails, CAAEclipticalElements } from "./astrocalc/ecliptical_elements.js";
export { EPO } from "./astrocalc/elements_planetary_orbit.js";
export { EOE, EPD, EOD, EO, ELL } from "./astrocalc/elliptical.js";
export { EOT } from "./astrocalc/equation_of_time.js";
export { GMD, GMDS, GM } from "./astrocalc/galilean_moons.js";
export { CAAGlobe } from "./astrocalc/globe.js";
export { IFR } from "./astrocalc/illuminated_fraction.js";
export { INTP } from "./astrocalc/interpolate.js";
export { CAAMoon, MoonCoefficient1, MoonCoefficient2 } from "./astrocalc/moon.js";
export { MIFR } from "./astrocalc/moon_illuminated_fraction.js";
export { CAAMoonNodes } from "./astrocalc/moon_nodes.js";
export { CAAMoonPerigeeApogee, MPAC } from "./astrocalc/moon_perigee_apogee.js";
export { CAAMoonPhases } from "./astrocalc/moon_phases.js";
export { CAAParallax, CAATopocentricEclipticDetails } from "./astrocalc/parallax.js";
export { CAASidereal } from "./astrocalc/sidereal.js";
export { CAAPhysicalJupiterDetails, CAAPhysicalJupiter } from "./astrocalc/physical_jupiter.js";
export { CAAPhysicalMarsDetails, CAAPhysicalMars } from "./astrocalc/physical_mars.js";
export { CAAPhysicalSunDetails, CAAPhysicalSun } from "./astrocalc/physical_sun.js";
export { CAAPrecession } from "./astrocalc/precession.js";
export { CAARiseTransitSetDetails, CAARiseTransitSet } from "./astrocalc/rise_transit_set.js";
export { CAASaturnRingDetails, CAASaturnRings } from "./astrocalc/saturn_rings.js";
export { CAAStellarMagnitudes } from "./astrocalc/stellar_magnitudes.js";

export { BlendState } from "./blend_state.js";
export { Color, Colors } from "./color.js";
export { URLHelpers, URLRewriteMode } from "./url_helpers.js";

export {
    LocationHint,
    PositionTexture,
    PositionColoredTextured,
    PositionColored,
    PositionNormalTexturedTangent,
    Vector3d,
    Vector2d,
    Matrix3d,
    Matrix2d,
    DoubleUtilities,
    PlaneD,
    Vector4d,
    PositionNormalTexturedX2,
    PositionNormalTextured,
    SphereHull,
    ConvexHull
} from "./double3d.js";

export {
    Rectangle,
    Guid,
    Mouse,
    Language,
    Cursor,
    Cursors,
    Keys,
    SelectLink,
    PopupVolume,
    PopupColorPicker,
    OverlayProperties,
} from "./util.js";

export { AstroRaDec, RiseSetDetails, AstroCalc } from "./astrocalc.js";

export {
    ShortIndexBuffer,
    IndexBuffer,
    VertexBufferBase,
    PositionVertexBuffer,
    PositionNormalTexturedVertexBuffer,
    PositionNormalTexturedTangentVertexBuffer,
} from "./graphics/gl_buffers.js"

export { Texture } from "./graphics/texture.js";
export { Tessellator } from "./graphics/tessellator.js";

export {
    SimpleLineShader,
    SimpleLineShader2D,
    OrbitLineShader,
    LineShaderNormalDates,
    TimeSeriesPointSpriteShader,
    KeplerPointSpriteShader,
    EllipseShader,
    ModelShader,
    ModelShaderTan,
    TileShader,
    FitsShader,
    ImageShader,
    ImageShader2,
    SpriteShader,
    ShapeSpriteShader,
    TextShader,
} from "./graphics/shaders.js";

export {
    CullMode,
    PointScaleTypes,
    DataItem,
    Dates,
    SimpleLineList,
    OrbitLineList,
    LineList,
    TriangleList,
    TriangleFanList,
    PointList,
    TimeSeriesLineVertex,
    TimeSeriesPointVertex,
} from "./graphics/primitives3d.js";

// These are new, post-C# APIs that we wouldn't normally expose, but they
// support the test suite.
export {
    set_tilePrepDevice,
    set_useGlVersion2
} from "./render_globals.js";

export { Bitmap } from "./utilities/bitmap.js";

export {
    ContextMenuStrip,
    ToolStripMenuItem,
    ToolStripSeparator,
    TagMe,
} from "./utilities/context_menu_strip.js";

export { BinaryReader } from "./utilities/binary_reader.js";
export { SimpleInput } from "./utilities/simple_input.js";
export { XmlTextWriter } from "./utilities/xml_text_writer.js";

export { Coordinates } from "./coordinates.js";
export { FastMath } from "./fast_math.js";
export { HealpixTables } from "./healpix_tables.js";
export { HealpixUtils } from "./healpix_utils.js";
export { Hploc } from "./hploc.js";
export { Fxyf } from "./fxyf.js";
export {
    IThumbnail,
    IPlace,
    IUiController,
    IViewMover,
    IUIServicesCallbacks,
    ISettings,
    IUndoStep,
} from "./interfaces.js";
export { Annotation, Circle, Poly, PolyLine } from "./annotation.js";
export { SolarSystemObjects, InterpolationType, CameraParameters } from "./camera_parameters.js";
export { ConstellationFilter } from "./constellation_filter.js";
export { FitsProperties, ScaleTypes } from "./fits_properties.js";
export { Star, Galaxy } from "./star.js";
export { UiTools } from "./ui_tools.js";
export { StateType, WebFile } from "./web_file.js";

export { ColorMapContainer } from "./layers/color_map_container.js";
export { WcsImage } from "./layers/wcs_image.js";
export { FitsImage } from "./layers/fits_image.js";
export {
    DataTypes,
    ScaleMap,
    ScaleLinear,
    ScaleLog,
    ScalePow,
    ScaleSqrt,
    HistogramEqualization,
    FitsImageJs,
} from "./layers/fits_image_js.js";
export { FitsImageTile } from "./layers/fits_image_tile.js";

export { Tile } from "./tile.js";
export { RenderTriangle } from "./render_triangle.js";
export { EquirectangularTile } from "./equirectangular_tile.js";
export { HealpixTile, Xyf } from "./healpix_tile.js";
export { MercatorTile } from "./mercator_tile.js";
export { PlotTile } from "./plot_tile.js";
export { LatLngEdges, TangentTile } from "./tangent_tile.js";
export { SkyImageTile } from "./sky_image_tile.js";
export { ToastTile } from "./toast_tile.js";
export { ProjectionType, ImageSetType, BandPass, Imageset } from "./imageset.js";
export { Settings, SettingParameter } from "./settings.js";
export { TextBorderStyle, TextObject } from "./tours/text_object.js";
export { Alignment, Text3dBatch, Text3d, GlyphItem, GlyphCache } from "./sky_text.js";
export { Lineset, Linepoint, Constellations } from "./constellations.js";
export { SpaceTimeController } from "./space_time_controller.js";
export { KeplerianElements, BodyAngles, Planets } from "./planets.js";
export { Place } from "./place.js";
export { FolderUp } from "./folder_up.js";
export { Grids } from "./grids.js";
export { KeplerVertex } from "./kepler_vertex.js";
export { Pointing } from "./pointing.js";
export { Tour } from "./tour.js";
export { VideoOutputType } from "./video_output_type.js";
export { VizLayer } from "./viz_layer.js";
export { Histogram } from "./utilities/histogram.js";

export { Layer, DomainValue, AltUnits, FadeType } from "./layers/layer.js";
export {
    LayerUI,
    LayerUIMenuItem,
    LayerUITreeNode,
} from "./layers/layer_ui.js";

// To keep API compatibility, we can't fix this typo.
export { GreatCirlceRouteLayer } from "./layers/great_circle_route_layer.js";

export { GridLayer } from "./layers/grid_layer.js";
export { ImageSetLayer } from "./layers/imageset_layer.js";
export {
    Group,
    Material,
    Mesh,
    Object3d,
    ObjectNode,
    Object3dLayer,
    Object3dLayerUI,
} from "./layers/object3d.js";
export { Orbit, EllipseRenderer } from "./layers/orbit.js";
export { ReferenceFrame, ReferenceFrameTypes } from "./layers/reference_frame.js";
export { OrbitLayer, OrbitLayerUI } from "./layers/orbit_layer.js";

export {
    PointType,
    FolderGroup,
    FolderRefreshType,
    FolderType,
    ThumbnailSize,
    Classification,
    ReferenceFrames,
    CoordinatesTypes,
    AltTypes,
    MarkerMixes,
    ColorMaps,
    PlotTypes,
    MarkerScales,
    RAUnits,
    Primitives,
    StockSkyOverlayTypes,
    OverlayAnchor,
    AudioType,
    ShapeType,
    LoopTypes,
    SelectionAnchor,
    UserLevel,
    TransitionType,
    DialogResult,
    Formatting,
    GFX,
    HipsProperties,
    Folder,
    FolderBrowser,
    ViewMoverKenBurnsStyle,
    LayerManager,
    LayerMap,
    SkyOverlays,
    GroundOverlayLayer,
    FrameTarget,
    KmlCoordinate,
    KmlLineList,
    PushPin,
    Table,
    VoTable,
    VoRow,
    VoColumn,
    InViewReturnMessage,
    RenderContext,
    ScriptInterface,
    FileEntry,
    FileCabinet,
    Overlay,
    Selection,
    TourDocument,
    TourEditTab,
    TourEditor,
    OverlayList,
    TourEdit,
    SoundEditor,
    TourStopList,
    TimeLine,
    TourPlayer,
    MasterTime,
    TourStop,
    LayerInfo,
    UndoTourStopChange,
    Undo,
    UndoStep,
    UndoTourSlidelistChange,
    UndoTourPropertiesChange,
    ColorPicker,
    Dialog,
    FolderDownloadAction,
    Wtml,
    WWTControl,
    WWTControlBuilder,
    WWTElementEvent,
    SpreadSheetLayer,
    TimeSeriesLayer,
    VoTableLayer,
    BitmapOverlay,
    TextOverlay,
    ShapeOverlay,
    AudioOverlay,
    FlipbookOverlay,
    FrameWizard,
    ReferenceFrameProps,
    GreatCircleDialog,
    DataVizWizard,
    ISSLayer,
    CatalogSpreadSheetLayer,
    SlideChangedEventArgs,
    ArrivedEventArgs,
    AnnotationClickEventArgs,
    CollectionLoadedEventArgs,
} from "./transpiled.js";
