using System;

namespace wwtlib
{
    public interface ISettings
    {
        bool ActualPlanetScale { get; }
        Color AltAzGridColor { get; }
        ConstellationFilter ConstellationArtFilter { get; }
        ConstellationFilter ConstellationBoundariesFilter { get; }
        ConstellationFilter ConstellationFiguresFilter { get; }
        ConstellationFilter ConstellationNamesFilter { get; }
        string ConstellationsEnabled { get; }
        bool EarthCutawayView { get; }
        Color EclipticColor { get; }
        Color EclipticGridColor { get; }
        Color EquatorialGridColor { get; }
        int FovCamera { get; }
        int FovEyepiece { get; }
        int FovTelescope { get; }
        Color GalacticGridColor { get; }
        bool GalacticMode { get; }
        bool LocalHorizonMode { get; }
        double LocationAltitude { get; }
        double LocationLat { get; }
        double LocationLng { get; }
        bool MilkyWayModel { get; }
        int MinorPlanetsFilter { get; }
        int PlanetOrbitsFilter { get; }
        Color PrecessionChartColor { get; }
        bool ShowAltAzGrid { get; }
        bool ShowAltAzGridText { get; }
        bool ShowClouds { get; }
        bool ShowConstellationBoundries { get; }
        bool ShowConstellationFigures { get; }
        bool ShowConstellationLabels { get; }
        bool ShowConstellationPictures { get; }
        bool ShowConstellationSelection { get; }
        bool ShowConstellations { get; }
        bool ShowEarthSky { get; }
        bool ShowEcliptic { get; }
        bool ShowEclipticGrid { get; }
        bool ShowEclipticGridText { get; }
        bool ShowEclipticOverviewText { get; }
        bool ShowElevationModel { get; }
        bool ShowEquatorialGridText { get; }
        bool ShowFieldOfView { get; }
        bool ShowGalacticGrid { get; }
        bool ShowGalacticGridText { get; }
        bool ShowGrid { get; }
        bool ShowHorizon { get; }
        bool ShowHorizonPanorama { get; }
        bool ShowISSModel { get; }
        bool ShowMoonsAsPointSource { get; }
        bool ShowPrecessionChart { get; }
        bool ShowSkyGrids { get; }
        bool ShowSkyNode { get; }
        bool ShowSkyOverlays { get; }
        bool ShowSkyOverlaysIn3d { get; }
        bool ShowSolarSystem { get; }
        bool SolarSystemCMB { get; }
        bool SolarSystemCosmos { get; }
        bool SolarSystemLighting { get; }
        bool SolarSystemMilkyWay { get; }
        bool SolarSystemMinorOrbits { get; }
        bool SolarSystemMinorPlanets { get; }
        bool SolarSystemMultiRes { get; }
        bool SolarSystemOrbits { get; }
        bool SolarSystemOverlays { get; }
        bool SolarSystemPlanets { get; }
        int SolarSystemScale { get; }
        bool SolarSystemStars { get; }

        SettingParameter GetSetting(StockSkyOverlayTypes type);
    }

    public enum StockSkyOverlayTypes {
        Empty = 0,
        EquatorialGrid = 1,
        EquatorialGridText = 2,
        GalacticGrid = 3,
        GalacticGridText = 4,
        EclipticGrid = 5,
        EclipticGridText = 6,
        EclipticOverview = 7,
        EclipticOverviewText = 8,
        PrecessionChart = 9,
        AltAzGrid = 10,
        AltAzGridText = 11,
        ConstellationFigures = 12,
        ConstellationBoundaries = 13,
        ConstellationFocusedOnly = 14,
        ConstellationNames = 15,
        ConstellationPictures = 16,
        FadeToBlack = 17,
        FadeToLogo = 18,
        FadeToGradient = 19,
        ScreenBroadcast = 20,
        FadeRemoteOnly = 21,
        SkyGrids = 22,
        Constellations = 23,
        SolarSystemStars = 24,
        SolarSystemMilkyWay = 25,
        SolarSystemCosmos = 26,
        SolarSystemOrbits = 27,
        SolarSystemPlanets = 28,
        SolarSystemAsteroids = 29,
        SolarSystemLighting = 30,
        SolarSystemMinorOrbits = 31,
        ShowEarthCloudLayer = 32,
        ShowElevationModel = 33,
        ShowAtmosphere = 34,
        MultiResSolarSystemBodies = 35,
        AuroraBorialis = 36,
        EarthCutAway = 37,
        ShowSolarSystem = 38,
        Clouds8k = 39,
        FiledOfView = 40,
        ShowISSModel = 41,
        SolarSystemCMB = 42,
        MPCZone1 = 43,
        MPCZone2 = 44,
        MPCZone3 = 45,
        MPCZone4 = 46,
        MPCZone5 = 47,
        MPCZone6 = 48,
        MPCZone7 = 49,
        OrbitFilters = 50
    };

    public sealed class SettingParameter
    {
        public bool TargetState;
        public bool EdgeTrigger;
        public double Opacity;
        public ConstellationFilter Filter;

        public SettingParameter(bool edgeTrigger, double opacity, bool targetState, ConstellationFilter filter)
        {
            EdgeTrigger = edgeTrigger;
            Opacity = opacity;
            TargetState = targetState;
            Filter = filter;
        }
    }
}
