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
    ScaleTypes,
    SolarSystemObjects,
    InterpolationType,
    PointType,
    FolderGroup,
    FolderRefreshType,
    FolderType,
    ThumbnailSize,
    CullMode,
    PointScaleTypes,
    ProjectionType,
    ImageSetType,
    BandPass,
    Classification,
    DataTypes,
    AltUnits,
    FadeType,
    ReferenceFrames,
    ReferenceFrameTypes,
    CoordinatesTypes,
    AltTypes,
    MarkerMixes,
    ColorMaps,
    PlotTypes,
    MarkerScales,
    RAUnits,
    Primitives,
    Alignment,
    StockSkyOverlayTypes,
    OverlayAnchor,
    AudioType,
    ShapeType,
    LoopTypes,
    SelectionAnchor,
    TextBorderStyle,
    UserLevel,
    TransitionType,
    DialogResult,
    Formatting,
    StateType,
    IThumbnail,
    IPlace,
    IUiController,
    IViewMover,
    IUIServicesCallbacks,
    ISettings,
    IUndoStep,
    GFX,
    VideoOutputType,
    FitsProperties,
    HipsProperties,
    FastMath,
    HealpixTables,
    Xyf,
    HealpixUtils,
    Hploc,
    Pointing,
    Annotation,
    CameraParameters,
    Constellations,
    Lineset,
    Linepoint,
    ConstellationFilter,
    Folder,
    FolderBrowser,
    FolderUp,
    Dates,
    SimpleLineList,
    OrbitLineList,
    LineList,
    TriangleList,
    TriangleFanList,
    PointList,
    TimeSeriesLineVertex,
    TimeSeriesPointVertex,
    Tessellator,
    Grids,
    Imageset,
    ViewMoverKenBurnsStyle,
    KeplerVertex,
    ScaleMap,
    ColorMapContainer,
    Layer,
    DomainValue,
    LayerManager,
    LayerMap,
    SkyOverlays,
    GroundOverlayLayer,
    FrameTarget,
    LayerUI,
    LayerUIMenuItem,
    LayerUITreeNode,
    Group,
    Mesh,
    Object3d,
    ObjectNode,
    Orbit,
    EllipseRenderer,
    ReferenceFrame,
    KmlCoordinate,
    KmlLineList,
    PushPin,
    Table,
    VoTable,
    VoRow,
    VoColumn,
    WcsImage,
    Place,
    KeplerianElements,
    BodyAngles,
    Planets,
    Material,
    InViewReturnMessage,
    RenderContext,
    RenderTriangle,
    ScriptInterface,
    Settings,
    Text3dBatch,
    GlyphItem,
    GlyphCache,
    Text3d,
    SpaceTimeController,
    Star,
    Galaxy,
    LatLngEdges,
    Tile,
    Tour,
    FileEntry,
    FileCabinet,
    SettingParameter,
    Overlay,
    Selection,
    TextObject,
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
    UiTools,
    BinaryReader,
    Bitmap,
    ColorPicker,
    ContextMenuStrip,
    ToolStripMenuItem,
    TagMe,
    Dialog,
    Histogram,
    SimpleInput,
    XmlTextWriter,
    VizLayer,
    DataItem,
    WebFile,
    FolderDownloadAction,
    Wtml,
    WWTControl,
    WWTControlBuilder,
    WWTElementEvent,
    Coordinates,
    Fxyf,
    HealpixTile,
    FitsImage,
    Circle,
    Poly,
    PolyLine,
    EquirectangularTile,
    ScaleLinear,
    ScaleLog,
    ScalePow,
    ScaleSqrt,
    HistogramEqualization,
    GreatCirlceRouteLayer,
    GridLayer,
    ImageSetLayer,
    Object3dLayer,
    Object3dLayerUI,
    OrbitLayer,
    OrbitLayerUI,
    SpreadSheetLayer,
    TimeSeriesLayer,
    VoTableLayer,
    MercatorTile,
    PlotTile,
    TangentTile,
    ToastTile,
    BitmapOverlay,
    TextOverlay,
    ShapeOverlay,
    AudioOverlay,
    FlipbookOverlay,
    ToolStripSeparator,
    FrameWizard,
    ReferenceFrameProps,
    GreatCircleDialog,
    DataVizWizard,
    FitsImageTile,
    FitsImageJs,
    ISSLayer,
    CatalogSpreadSheetLayer,
    SlideChangedEventArgs,
    ArrivedEventArgs,
    AnnotationClickEventArgs,
    CollectionLoadedEventArgs,
    SkyImageTile,
} from "./transpiled.js";
