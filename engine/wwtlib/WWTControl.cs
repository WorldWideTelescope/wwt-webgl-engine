using System;
using System.Collections.Generic;
using System.Linq;
using System.Html;
using System.Html.Media.Graphics;


namespace wwtlib
{
    public class WWTControl
    {
        public static WWTControl Singleton;

        public RenderContext RenderContext;
        public CanvasElement Canvas;

        public WWTControl()
        {
        }

        public FolderBrowser Explorer;

        static WWTControl()
        {
            Singleton = new WWTControl();
            Singleton.RenderContext = new RenderContext();
            SpaceTimeController.last = Date.Now;
            SpaceTimeController.UpdateClock();
        }

        public static List<Imageset> ImageSets = new List<Imageset>();
        public static Folder ExploreRoot = new Folder();
        public static string ImageSetName = "";

        public IUiController uiController = null;

        List<Annotation> annotations = new List<Annotation>();
        internal void AddAnnotation(Annotation annotation)
        {
            annotations.Add(annotation);
            Annotation.BatchDirty = true;
        }

        internal void RemoveAnnotation(Annotation annotation)
        {
            annotations.Remove(annotation);
            Annotation.BatchDirty = true;
        }

        internal void ClearAnnotations()
        {
            annotations.Clear();
            Annotation.BatchDirty = true;
        }

        private bool Annotationclicked(double ra, double dec, double x, double y)
        {
            if (annotations != null && annotations.Count > 0)
            {
                int index = 0;
                foreach (Annotation note in annotations)
                {
                    if (note.HitTest(RenderContext, ra, dec, x, y))
                    {
                        scriptInterface.FireAnnotationclicked(ra, dec, note.ID);
                        return true;
                    }
                    index++;
                }
            }
            return false;
        }

        string hoverText = "";
        Vector2d hoverTextPoint = new Vector2d();
        Date lastMouseMove = new Date(1900, 1, 0, 0, 0, 0, 0);

        private bool AnnotationHover(double ra, double dec, double x, double y)
        {
            if (annotations != null && annotations.Count > 0)
            {
                int index = 0;
                foreach (Annotation note in annotations)
                {
                    if (note.HitTest(RenderContext, ra, dec, x, y))
                    {
                        hoverText = note.Label;
                        hoverTextPoint = Vector2d.Create(x, y);
                        return true;
                    }
                    index++;
                }
            }
            return false;
        }

        public List<VizLayer> Layers = new List<VizLayer>();
        Date lastUpdate;
        int frameCount = 0;

        double zoomMax = 360;
        double zoomMaxSolarSystem = 10000000000000000;
        public double ZoomMax
        {
            get
            {
                if (RenderContext.BackgroundImageset != null && RenderContext.BackgroundImageset.DataSetType == ImageSetType.SolarSystem)
                {
                    return zoomMaxSolarSystem;
                }
                else
                {
                    return zoomMax;
                }
            }
            set { zoomMax = value; }
        }

        public void SetSolarSystemMaxZoom(double value)
        {
            zoomMaxSolarSystem = value;
        }

        double zoomMin = 0.001373291015625;
        double zoomMinSolarSystem = 0.00000001;

        public double ZoomMin
        {
            get
            {
                if (RenderContext.BackgroundImageset != null && RenderContext.BackgroundImageset.DataSetType == ImageSetType.SolarSystem)
                {
                    return zoomMinSolarSystem;
                }
                else
                {
                    return zoomMin;
                }
            }
            set { zoomMin = value; }
        }

        public void SetSolarSystemMinZoom(double value)
        {
            zoomMinSolarSystem = value;
        }

        public static bool showDataLayers = false;

        static bool renderNeeded = false;
        public static bool RenderNeeded
        {
            get
            {
                return renderNeeded;
            }
            set
            {
                renderNeeded = true;
            }
        }

        public static Constellations constellationsFigures = null;
        public static Constellations constellationsBoundries = null;


        public string Constellation = "UMA";
        private void NotifyMoveComplete()
        {
            //if (!App.NoUI)
            //{
            //    ContextPanel.ContextPanelMaster.RunSearch();
            //}

            //Page.Master.OnArrived();
        }

        PositionColoredTextured[] fadePoints = null;
        public BlendState Fader = BlendState.Create(true, 2000);

        private bool crossFadeFrame = false;

        private Texture crossFadeTexture = null;
        public bool CrossFadeFrame
        {
            set
            {
                if (value && crossFadeFrame != value)
                {
                    if (crossFadeTexture != null)
                    {
                       // crossFadeTexture.Dispose();
                    }
                    crossFadeTexture = RenderContext.GetScreenTexture();

                }
                crossFadeFrame = value;

                if (!value)
                {
                    if (crossFadeTexture != null)
                    {
                       // crossFadeTexture.Dispose();
                        crossFadeTexture = null;
                    }
                }
            }
            get
            {
                return crossFadeFrame;
            }
        }

        private Sprite2d sprite = new Sprite2d();

        private void FadeFrame()
        {
            if (RenderContext.gl != null)
            {
                SettingParameter sp = Settings.Active.GetSetting(StockSkyOverlayTypes.FadeToBlack);
                if ((sp.Opacity > 0))
                {
                    Color color = Color.FromArgbColor(255 - (int)UiTools.Gamma(255 - (int)(sp.Opacity * 255), 1 / 2.2f), Colors.Black);

                    if (!(sp.Opacity > 0))
                    {
                        color = Color.FromArgbColor(255 - (int)UiTools.Gamma(255 - (int)(sp.Opacity * 255), 1 / 2.2f), Colors.Black);
                    }


                    if (crossFadeFrame)
                    {
                        color = Color.FromArgbColor((int)UiTools.Gamma((int)((sp.Opacity) * 255), 1 / 2.2f), Colors.White);
                    }
                    else
                    {
                        if (crossFadeTexture != null)
                        {
                            // crossFadeTexture.Dispose();
                            crossFadeTexture = null;
                        }
                    }
                    if (fadePoints == null)
                    {
                        fadePoints = new PositionColoredTextured[4];
                        for(int i=0; i < 4; i++)
                        {
                            fadePoints[i] = new PositionColoredTextured();
                        }
                    }


                    fadePoints[0].Position.X = -RenderContext.Width/2;
                    fadePoints[0].Position.Y = RenderContext.Height/2;
                    fadePoints[0].Position.Z = 1347;
                    fadePoints[0].Tu = 0;
                    fadePoints[0].Tv = 1;
                    fadePoints[0].Color = color;

                    fadePoints[1].Position.X = -RenderContext.Width/2;
                    fadePoints[1].Position.Y = -RenderContext.Height / 2;
                    fadePoints[1].Position.Z = 1347;
                    fadePoints[1].Tu = 0;
                    fadePoints[1].Tv = 0;
                    fadePoints[1].Color = color;

                    fadePoints[2].Position.X = RenderContext.Width/2;
                    fadePoints[2].Position.Y = RenderContext.Height/2;
                    fadePoints[2].Position.Z = 1347;
                    fadePoints[2].Tu = 1;
                    fadePoints[2].Tv = 1;
                    fadePoints[2].Color = color;

                    fadePoints[3].Position.X = RenderContext.Width / 2;
                    fadePoints[3].Position.Y = -RenderContext.Height / 2;
                    fadePoints[3].Position.Z = 1347;
                    fadePoints[3].Tu = 1;
                    fadePoints[3].Tv = 0;
                    fadePoints[3].Color = color;

                    sprite.Draw(RenderContext, fadePoints, 4, crossFadeTexture, true, 1);
                }
            }
        }

        public ImageSetType RenderType = ImageSetType.Sky;

        private Imageset milkyWayBackground = null;

        // To preserve semantic backwards compatibility, this function must requeue itself
        // to be called again in a timeout.
        public void Render()
        {
            RenderOneFrame();
            Script.SetTimeout(delegate () { Render(); }, 10);
        }

        public void RenderOneFrame()
        {
            if (RenderContext.BackgroundImageset != null)
            {
                RenderType = RenderContext.BackgroundImageset.DataSetType;
            }
            else
            {
                RenderType = ImageSetType.Sky;
            }

            bool sizeChange = false;

            if (Canvas.Width != Canvas.ParentNode.ClientWidth)
            {
                Canvas.Width = Canvas.ParentNode.ClientWidth;
                sizeChange = true;
            }

            if (Canvas.Height != Canvas.ParentNode.ClientHeight)
            {
                Canvas.Height = Canvas.ParentNode.ClientHeight;
                sizeChange = true;
            }

            if (sizeChange && Explorer != null)
                Explorer.Refresh();

            if (Canvas.Width < 1 || Canvas.Height < 1) {
                // This can happen during initialization if perhaps some
                // HTML/JavaScript interaction hasn't happened to set the canvas
                // size correctly. If we don't exit this function early, we get
                // NaNs in our transformation matrices that lead IsTileBigEnough
                // to say "no" for everything so that we spin out of control
                // downloading maximum-resolution DSS tiles for an enormous
                // viewport. That's bad!
                return;
            }

            if (sizeChange) {
                // In GL, the crosshairs are in viewport coordinates
                // ([0,1]x[0,1]), so a size change alters their perceived aspect
                // ratio.
                crossHairs = null;
            }

            Tile.lastDeepestLevel = Tile.deepestLevel;

            RenderTriangle.Width = RenderContext.Width = Canvas.Width;
            RenderTriangle.Height = RenderContext.Height = Canvas.Height;
            Tile.TilesInView = 0;
            Tile.TilesTouched = 0;
            Tile.deepestLevel = 0;

            if (Mover != null)
            {
                SpaceTimeController.Now = Mover.CurrentDateTime;

                Planets.UpdatePlanetLocations(SolarSystemMode);

                if (Mover != null)
                {
                    CameraParameters newCam = Mover.CurrentPosition;

                    RenderContext.TargetCamera = newCam.Copy();
                    RenderContext.ViewCamera = newCam.Copy();
                    if (RenderContext.Space && Settings.Active.GalacticMode)
                    {
                        double[] gPoint = Coordinates.J2000toGalactic(newCam.RA * 15, newCam.Dec);

                        RenderContext.targetAlt = RenderContext.alt = gPoint[1];
                        RenderContext.targetAz = RenderContext.az = gPoint[0];
                    }
                    else if (RenderContext.Space && Settings.Active.LocalHorizonMode)
                    {
                        Coordinates currentAltAz = Coordinates.EquitorialToHorizon(Coordinates.FromRaDec(newCam.RA, newCam.Dec), SpaceTimeController.Location, SpaceTimeController.Now);

                        RenderContext.targetAlt = RenderContext.alt = currentAltAz.Alt;
                        RenderContext.targetAz = RenderContext.az = currentAltAz.Az;
                    }

                    if (Mover.Complete)
                    {
                        //Todo Notify interested parties that move is complete
                        scriptInterface.FireArrived(Mover.CurrentPosition.RA, Mover.CurrentPosition.Dec, WWTControl.Singleton.RenderContext.ViewCamera.Zoom);
                        Mover = null;

                        NotifyMoveComplete();
                    }
                }
            }
            else
            {
                SpaceTimeController.UpdateClock();

                Planets.UpdatePlanetLocations(SolarSystemMode);

                UpdateViewParameters();
            }

            RenderContext.Clear();

            if (RenderType == ImageSetType.SolarSystem)
            {
                {
                    if ((int)SolarSystemTrack < (int)SolarSystemObjects.Custom)
                    {
                        double radius = Planets.GetAdjustedPlanetRadius((int)SolarSystemTrack);
                        double distance = RenderContext.SolarSystemCameraDistance;
                        double camAngle = RenderContext.FovLocal;
                        //double distrad = distance / (radius * Math.Tan(.5 * camAngle));
                    }

                    if (trackingObject == null)
                    {
                        //todo fix this       trackingObject = Search.FindCatalogObject("Sun");
                    }

                    RenderContext.SetupMatricesSolarSystem(true);

                    //float skyOpacity = 1.0f - Planets.CalculateSkyBrightnessFactor(RenderContext11.View, viewCamera.ViewTarget);
                    //if (float.IsNaN(skyOpacity))
                    //{
                    //    skyOpacity = 0f;
                    //}

                    double zoom = RenderContext.ViewCamera.Zoom;
                    float milkyWayBlend = (float)Math.Min(1.0, Math.Max(0, (Math.Log(zoom) - 8.4)) / 4.2);
                    float milkyWayBlendIn = (float)Math.Min(1.0, Math.Max(0, (Math.Log(zoom) - 17.9)) / 2.3);

                    Matrix3d matOldMW = RenderContext.World;
                    Matrix3d matLocalMW = RenderContext.World.Clone();
                    matLocalMW.Multiply(Matrix3d.Scaling(100000, 100000, 100000));
                    matLocalMW.Multiply(Matrix3d.RotationX(23.5 / 180 * Math.PI));
                    //                              matLocalMW.Multiply(Matrix3d.RotationY(Math.PI));
                    matLocalMW.Multiply(Matrix3d.Translation(RenderContext.CameraPosition)); //todo change this when tracking is added back
                    RenderContext.World = matLocalMW;
                    RenderContext.WorldBase = matLocalMW;
                    RenderContext.Space = true;
                    RenderContext.MakeFrustum();
                    bool lighting = RenderContext.Lighting;
                    RenderContext.Lighting = false;
                    if (Settings.Active.SolarSystemMilkyWay)
                    {
                        if (milkyWayBlend < 1) // Solar System mode Milky Way background
                        {
                            if (milkyWayBackground == null)
                            {
                                milkyWayBackground = GetImagesetByName("Digitized Sky Survey (Color)");
                            }

                            if (milkyWayBackground != null)
                            {
                                RenderTriangle.CullInside = true;
                                float c = ((1 - milkyWayBlend)) / 2;


                                RenderContext.DrawImageSet(milkyWayBackground, c * 100);

                                RenderTriangle.CullInside = false;
                            }
                        }
                    }

                    DrawSkyOverlays();
                    RenderContext.Lighting = lighting;

                    RenderContext.Space = false;
                    RenderContext.World = matOldMW;
                    RenderContext.WorldBase = matOldMW;
                    RenderContext.MakeFrustum();
                    //// CMB

                    //float cmbBlend = (float)Math.Min(1, Math.Max(0, (Math.Log(zoom) - 33)) / 2.3);


                    //double cmbLog = Math.Log(zoom);

                    //if (Properties.Settings.Default.SolarSystemCMB.State)
                    //{
                    //    if (cmbBlend > 0) // Solar System mode Milky Way background
                    //    {
                    //        if (cmbBackground == null)
                    //        {
                    //            cmbBackground = GetImagesetByName("Planck CMB");
                    //        }

                    //        if (cmbBackground != null)
                    //        {
                    //            float c = ((cmbBlend)) / 16;
                    //            Matrix3d matOldMW = RenderContext11.World;
                    //            Matrix3d matLocalMW = RenderContext11.World;
                    //            //double dist = UiTools.AuPerLightYear*46000000000;
                    //            matLocalMW.Multiply(Matrix3d.Scaling(2.9090248982E+15, 2.9090248982E+15, 2.9090248982E+15));
                    //            matLocalMW.Multiply(Matrix3d.RotationX(-23.5 / 180 * Math.PI));
                    //            matLocalMW.Multiply(Matrix3d.RotationY(Math.PI));
                    //            //  matLocalMW.Multiply(Matrix3d.Translation(cameraOffset));
                    //            RenderContext11.World = matLocalMW;
                    //            RenderContext11.WorldBase = matLocalMW;
                    //            Earth3d.MainWindow.MakeFrustum();

                    //            RenderContext11.SetupBasicEffect(BasicEffect.TextureColorOpacity, 1, Color.White);
                    //            //SetupMatricesSpace11(60, renderType);
                    //            RenderContext11.DepthStencilMode = DepthStencilMode.Off;
                    //            DrawTiledSphere(cmbBackground, c * Properties.Settings.Default.SolarSystemCMB.Opacity, Color.FromArgb(255, 255, 255, 255));
                    //            RenderContext11.World = matOldMW;
                    //            RenderContext11.WorldBase = matOldMW;
                    //            RenderContext11.DepthStencilMode = DepthStencilMode.ZReadWrite;
                    //        }
                    //    }
                    //}

                    {
                        Vector3d oldCamera = RenderContext.CameraPosition;
                        Matrix3d matOld = RenderContext.World;

                        Matrix3d matLocal = RenderContext.World;
                        matLocal.Multiply(Matrix3d.Translation(RenderContext.ViewCamera.ViewTarget));
                        RenderContext.CameraPosition = Vector3d.SubtractVectors(RenderContext.CameraPosition, RenderContext.ViewCamera.ViewTarget);
                        RenderContext.World = matLocal;
                        RenderContext.MakeFrustum();

                        if (Settings.Active.SolarSystemCosmos)
                        {
                            // RenderContext11.DepthStencilMode = DepthStencilMode.Off;
                            // Grids.DrawCosmos3D(RenderContext, Properties.Settings.Default.SolarSystemCosmos.Opacity * skyOpacity);
                            Grids.DrawCosmos3D(RenderContext, 1.0f);
                            //  RenderContext11.DepthStencilMode = DepthStencilMode.ZReadWrite;
                        }

                        //    if (true)
                        //    {
                        //        RenderContext11.DepthStencilMode = DepthStencilMode.Off;

                        //        Grids.DrawCustomCosmos3D(RenderContext11, skyOpacity);

                        //        RenderContext11.DepthStencilMode = DepthStencilMode.ZReadWrite;
                        //    }


                        if (Settings.Active.SolarSystemMilkyWay && milkyWayBlendIn > 0)
                        {
                            //Grids.DrawGalaxy3D(RenderContext11, Properties.Settings.Default.SolarSystemMilkyWay.Opacity * skyOpacity * milkyWayBlendIn);

                            Grids.DrawGalaxyImage(RenderContext, milkyWayBlendIn);
                        }

                        if (Settings.Active.SolarSystemStars)
                        {
                            Grids.DrawStars3D(RenderContext, 1);
                        }

                        matLocal = matOld;
                        Vector3d pnt = RenderContext.ViewCamera.ViewTarget;
                        Vector3d vt = Vector3d.Create(-pnt.X, -pnt.Y, -pnt.Z);
                        RenderContext.CameraPosition = oldCamera;
                        matLocal.Multiply(Matrix3d.Translation(vt));
                        RenderContext.World = matLocal;
                        RenderContext.MakeFrustum();

                        LayerManager.Draw(RenderContext, 1.0f, true, "Sky", true, false);

                        RenderContext.World = matOld;
                        RenderContext.MakeFrustum();
                    }

                    if (RenderContext.SolarSystemCameraDistance < 15000)
                    {
                        RenderContext.SetupMatricesSolarSystem(false);

                        if (Settings.Active.SolarSystemMinorPlanets)
                        {
                            MinorPlanets.DrawMPC3D(RenderContext, 1, RenderContext.ViewCamera.ViewTarget);
                        }

                        if (Settings.Active.SolarSystemPlanets)
                        {
                            Planets.DrawPlanets3D(RenderContext, 1, RenderContext.ViewCamera.ViewTarget);
                        }
                    }

                    //double p = Math.Log(zoom);
                    //double d = (180 / SolarSystemCameraDistance) * 100; // (SolarSystemCameraDistance * SolarSystemCameraDistance) * 10000000;

                    //float sunAtDistance = (float)Math.Min(1, Math.Max(0, (Math.Log(zoom) - 7.5)) / 3);

                    //if (sunAtDistance > 0)
                    //{
                    //    Planets.DrawPointPlanet(RenderContext11, new Vector3d(0, 0, 0), (float)d * sunAtDistance, Color.FromArgb(192, 191, 128), false, 1);
                    //}

                    //if ((SolarSystemMode) && label != null && !TourPlayer.Playing)
                    //{
                    //    label.Draw(RenderContext11, true);
                    //}
                }
            }
            else  // RenderType is not SolarSystem
            {
                if (RenderType == ImageSetType.Earth || RenderType == ImageSetType.Planet)
                {
                    RenderContext.SetupMatricesLand3d();
                }
                else
                {
                    RenderContext.SetupMatricesSpace3d(RenderContext.Width, RenderContext.Height);
                }

                RenderContext.DrawImageSet(RenderContext.BackgroundImageset, 100);

                if (RenderContext.ForegroundImageset != null)
                {
                    if (RenderContext.ForegroundImageset.DataSetType != RenderContext.BackgroundImageset.DataSetType)
                    {
                        RenderContext.ForegroundImageset = null;
                    }
                    else
                    {
                        if (RenderContext.ViewCamera.Opacity != 100 && RenderContext.gl == null)
                        {
                            if (foregroundCanvas.Width != RenderContext.Width || foregroundCanvas.Height != RenderContext.Height)
                            {
                                foregroundCanvas.Width = (int)RenderContext.Width;
                                foregroundCanvas.Height = (int)RenderContext.Height;
                            }

                            CanvasContext2D saveDevice = RenderContext.Device;
                            fgDevice.ClearRect(0, 0, RenderContext.Width, RenderContext.Height);
                            RenderContext.Device = fgDevice;
                            RenderContext.DrawImageSet(RenderContext.ForegroundImageset, 100);
                            RenderContext.Device = saveDevice;
                            RenderContext.Device.Save();
                            RenderContext.Device.Alpha = RenderContext.ViewCamera.Opacity / 100;
                            RenderContext.Device.DrawImage(foregroundCanvas, 0, 0);
                            RenderContext.Device.Restore();
                        }
                        else
                        {
                            RenderContext.DrawImageSet(RenderContext.ForegroundImageset, RenderContext.ViewCamera.Opacity);
                        }
                    }
                }

                if (RenderType == ImageSetType.Sky && Settings.Active.ShowSolarSystem)
                {
                    Planets.DrawPlanets(RenderContext, 1);

                    Constellation = Constellations.Containment.FindConstellationForPoint(RenderContext.ViewCamera.RA, RenderContext.ViewCamera.Dec);

                    DrawSkyOverlays();

                    //LayerManager.Draw(RenderContext, 1.0f, true, "Sky", true, true);
                }

                //  if (RenderType == ImageSetType.Earth)
                //{

                //    LayerManager.Draw(RenderContext, 1.0f, false, "Earth", false, false);
                //}

                if (PlanetLike || Space)
                {
                    if (!Space)
                    {
                        //todo fix this for other planets..
                        double angle = Coordinates.MstFromUTC2(SpaceTimeController.Now, 0) / 180.0 * Math.PI;
                        RenderContext.WorldBaseNonRotating = Matrix3d.MultiplyMatrix(Matrix3d.RotationY(angle), RenderContext.WorldBase);
                        if (targetBackgroundImageset != null)
                        {
                            RenderContext.NominalRadius = targetBackgroundImageset.MeanRadius;
                        }
                    }
                    else
                    {
                        RenderContext.WorldBaseNonRotating = RenderContext.World;
                        if (targetBackgroundImageset != null)
                        {
                            RenderContext.NominalRadius = targetBackgroundImageset.MeanRadius;
                        }
                    }

                    string referenceFrame = GetCurrentReferenceFrame();
                    LayerManager.Draw(RenderContext, 1.0f, Space, referenceFrame, true, Space);
                }


            }

            Matrix3d worldSave = RenderContext.World;
            Matrix3d viewSave = RenderContext.View;
            Matrix3d projSave = RenderContext.Projection;

            Vector2d raDecDownDown = GetCoordinatesForScreenPoint(RenderContext.Width / 2, RenderContext.Height / 2);

            if (Settings.Current.ShowCrosshairs)
            {
                DrawCrosshairs(RenderContext);
            }

            if (uiController != null)
            {
                uiController.Render(RenderContext);
            }
            else
            {
                int index = 0;
                Annotation.PrepBatch(RenderContext);
                foreach (Annotation item in annotations)
                {
                    item.Draw(RenderContext);
                    index++;
                }

                Annotation.DrawBatch(RenderContext);

                if ((Date.Now - lastMouseMove) > 400)
                {
                    Vector2d raDecDown = GetCoordinatesForScreenPoint(hoverTextPoint.X, hoverTextPoint.Y);
                    this.AnnotationHover(raDecDown.X, raDecDown.Y, hoverTextPoint.X, hoverTextPoint.Y);
                    lastMouseMove = new Date(2100, 1, 1);
                }

                if (!string.IsNullOrEmpty(hoverText))
                {
                    DrawHoverText(RenderContext);
                }
            }

            RenderContext.SetupMatricesOverlays();
            FadeFrame();
            //RenderContext.Clear();
            //int tilesInView = Tile.TilesInView;
            //int itlesTouched = Tile.TilesTouched;

            frameCount++;

            //TileCache.PurgeLRU();
            TileCache.DecimateQueue();
            TileCache.ProcessQueue(RenderContext);
            Tile.CurrentRenderGeneration++;

            if (!TourPlayer.Playing)
            {
                CrossFadeFrame = false;
            }
            // Restore Matrixies for Finder Scope and such to map points

            RenderContext.World = worldSave;
            RenderContext.View = viewSave;
            RenderContext.Projection = projSave;

            Date now = Date.Now;

            int ms = now - lastUpdate;
            if (ms > 1000)
            {
                lastUpdate = now;
                frameCount = 0;
                RenderTriangle.TrianglesRendered = 0;
                RenderTriangle.TrianglesCulled = 0;
            }
        }

        private string GetCurrentReferenceFrame()
        {
            if (RenderContext.BackgroundImageset == null)
            {
                return "Sun";
            }

            if (!string.IsNullOrEmpty(RenderContext.BackgroundImageset.ReferenceFrame))
            {
                return RenderContext.BackgroundImageset.ReferenceFrame;
            }
            if (RenderContext.BackgroundImageset.DataSetType == ImageSetType.Earth)
            {
                return "Earth";
            }
            if (RenderContext.BackgroundImageset.Name == "Visible Imagery" && RenderContext.BackgroundImageset.Url.ToLowerCase().IndexOf("mars") > -1 )
            {

                RenderContext.BackgroundImageset.ReferenceFrame = "Mars";
                return RenderContext.BackgroundImageset.ReferenceFrame;
            }

            if (RenderContext.BackgroundImageset.DataSetType == ImageSetType.Planet)
            {
                foreach (string name in SolarSystemObjectsNames)
                {
                    if (RenderContext.BackgroundImageset.Name.ToLowerCase().IndexOf(name.ToLowerCase()) > -1 )
                    {
                        RenderContext.BackgroundImageset.ReferenceFrame = name;
                        return name;
                    }
                }
            }
            if (RenderContext.BackgroundImageset.DataSetType == ImageSetType.Sky)
            {
                return "Sky";
            }
            return "";
        }

        public static string[] SolarSystemObjectsNames =
                {
                    "Sun",
                    "Mercury",
                    "Venus",
                    "Mars",
                    "Jupiter",
                    "Saturn",
                    "Uranus",
                    "Neptune",
                    "Pluto",
                    "Moon",
                    "Io",
                    "Europa",
                    "Ganymede",
                    "Callisto",
                    "IoShadow",
                    "EuropaShadow",
                    "GanymedeShadow",
                    "CallistoShadow",
                    "SunEclipsed",
                    "Earth",
                    "Custom",
                    "Undefined"
                };

        public bool PlanetLike
        {
            get
            {
                if (RenderContext.BackgroundImageset != null)
                {
                    return RenderContext.BackgroundImageset.DataSetType == ImageSetType.Earth || RenderContext.BackgroundImageset.DataSetType == ImageSetType.Planet;
                }
                else
                {
                    return true;
                }
            }
        }

        public bool Space
        {
            get
            {
                if (RenderContext.BackgroundImageset != null)
                {
                    return RenderContext.BackgroundImageset.DataSetType == ImageSetType.Sky;
                }
                else
                {
                    return true;
                }
            }
        }

        private void DrawSkyOverlays()
        {
            if (Settings.Active.ShowConstellationPictures)
            {
                Constellations.DrawArtwork(RenderContext);
            }

            if (Settings.Active.ShowConstellationFigures)
            {
                if (constellationsFigures == null)
                {
                    constellationsFigures = Constellations.Create(
                        "Constellations",
                        URLHelpers.singleton.engineAssetUrl("figures.txt"),
                        false,  // "boundry"
                        false,  // "noInterpollation"
                        false  // "resource"
                    );
                }

                constellationsFigures.Draw(RenderContext, false, "UMA", false);
            }

            if (Settings.Active.ShowEclipticGrid)
            {
                Grids.DrawEclipticGrid(RenderContext, 1, Colors.Green);
                if (Settings.Active.ShowEclipticGridText)
                {
                    Grids.DrawEclipticGridText(RenderContext, 1, Colors.Green);
                }
            }

            if (Settings.Active.ShowGalacticGrid)
            {
                Grids.DrawGalacticGrid(RenderContext, 1, Colors.Cyan);
                if (Settings.Active.ShowGalacticGridText)
                {
                    Grids.DrawGalacticGridText(RenderContext, 1, Colors.Cyan);
                }
            }

            if (Settings.Active.ShowAltAzGrid)
            {
                Grids.DrawAltAzGrid(RenderContext, 1, Colors.Magenta);
                if (Settings.Active.ShowAltAzGridText)
                {
                    Grids.DrawAltAzGridText(RenderContext, 1, Colors.Magenta);
                }
            }

            if (Settings.Active.ShowPrecessionChart)
            {
                Grids.DrawPrecessionChart(RenderContext, 1, Colors.Orange);

            }

            if (Settings.Active.ShowEcliptic)
            {
                Grids.DrawEcliptic(RenderContext, 1, Colors.Blue);
                if (Settings.Active.ShowEclipticOverviewText)
                {
                    Grids.DrawEclipticText(RenderContext, 1, Colors.Blue);
                }
            }

            if (Settings.Active.ShowGrid)
            {
                Grids.DrawEquitorialGrid(RenderContext, 1, Colors.White);
                if (Settings.Active.ShowEquatorialGridText)
                {
                    Grids.DrawEquitorialGridText(RenderContext, 1, Colors.White);
                }
            }

            if (Settings.Active.ShowConstellationBoundries)
            {
                if (constellationsBoundries == null)
                {
                    constellationsBoundries = Constellations.Create(
                        "Constellations",
                        URLHelpers.singleton.engineAssetUrl("constellations.txt"),
                        true,  // "boundry"
                        false,  // "noInterpollation"
                        false  // "resource"
                    );
                }
                constellationsBoundries.Draw(RenderContext, Settings.Active.ShowConstellationSelection, Constellation, false);
            }



            if (Settings.Active.ShowConstellationLabels)
            {
                Constellations.DrawConstellationNames(RenderContext, 1, Colors.Yellow);
            }
        }

        private void DrawHoverText(RenderContext RenderContext)
        {
            if (RenderContext.gl == null)
            {
                CanvasContext2D ctx = RenderContext.Device;
                ctx.Save();

                ctx.FillStyle = "White";
                ctx.Font = "15px Arial";
                ctx.FillText(hoverText, hoverTextPoint.X, hoverTextPoint.Y);
                ctx.Restore();
            }
        }


        public double RAtoViewLng(double ra)
        {
            return (((180 - ((ra) / 24.0 * 360) - 180) + 540) % 360) - 180;
        }

        private const double DragCoefficient = 0.8;


        private void UpdateViewParameters()
        {
            if (RenderContext.Space && tracking && trackingObject != null)
            {
                if (Settings.Active.GalacticMode && RenderContext.Space)
                {
                    double[] gPoint = Coordinates.J2000toGalactic(trackingObject.RA * 15, trackingObject.Dec);

                    RenderContext.targetAlt = RenderContext.alt = gPoint[1];
                    RenderContext.targetAz = RenderContext.az = gPoint[0];
                }
                else if (RenderContext.Space && Settings.Active.LocalHorizonMode)
                {
                    Coordinates currentAltAz = Coordinates.EquitorialToHorizon(Coordinates.FromRaDec(trackingObject.RA, trackingObject.Dec), SpaceTimeController.Location, SpaceTimeController.Now);

                    RenderContext.targetAlt = currentAltAz.Alt;
                    RenderContext.targetAz = currentAltAz.Az;
                }
                else
                {
                    RenderContext.ViewCamera.Lng = RenderContext.TargetCamera.Lng = this.RAtoViewLng(trackingObject.RA);
                    RenderContext.ViewCamera.Lat = RenderContext.TargetCamera.Lat = trackingObject.Dec;
                }
            }
            else if (!SolarSystemMode)
            {
                tracking = false;
                trackingObject = null;
            }

            double oneMinusDragCoefficient = 1 - DragCoefficient;
            double dc = DragCoefficient;

            //if (!Settings.Current.SmoothPan)
            //{
            //    oneMinusDragCoefficient = 1;
            //    dc = 0;
            //}
            if (!tracking)
            {
                double minDelta = (RenderContext.ViewCamera.Zoom / 4000.0);
                if (RenderContext.ViewCamera.Zoom > 360)
                {
                    minDelta = (360.0 / 40000.0);
                }
                //if (RenderContext.Space && Settings.Active.LocalHorizonMode)
                //{
                //    //if (!Settings.Current.SmoothPan)
                //    //{
                //    //    this.alt = targetAlt;
                //    //    this.az = targetAz;
                //    //}

                //    if (((Math.Abs(this.TargetAlt - this.alt) >= (minDelta)) |
                //        ((Math.Abs(this.targetAz - this.az) >= (minDelta)))))
                //    {
                //        this.alt += (targetAlt - alt) / 10;

                //        if (Math.Abs(targetAz - az) > 170)
                //        {
                //            if (targetAz > az)
                //            {
                //                this.az += (targetAz - (360 + az)) / 10;
                //            }
                //            else
                //            {
                //                this.az += ((360 + targetAz) - az) / 10;
                //            }
                //        }
                //        else
                //        {
                //            this.az += (targetAz - az) / 10;
                //        }

                //        //this.az = ((az + 540) % 360) - 180;
                //        this.az = ((az + 720) % 360);

                //    }
                //}
                //else


                    //if (!Settings.Current.SmoothPan)
                    //{
                    //    this.viewCamera.Lat = this.targetCamera.Lat;
                    //    this.viewCamera.Lng = this.targetCamera.Lng;
                    //}
                if (RenderContext.Space && (Settings.Active.LocalHorizonMode || Settings.Active.GalacticMode))
                {
                    if (((Math.Abs(RenderContext.targetAlt - RenderContext.alt) >= (minDelta)) |
                        ((Math.Abs(RenderContext.targetAz - RenderContext.az) >= (minDelta)))))
                    {
                        RenderContext.alt += (RenderContext.targetAlt - RenderContext.alt) / 10;

                        if (Math.Abs(RenderContext.targetAz - RenderContext.az) > 170)
                        {
                            if (RenderContext.targetAz > RenderContext.az)
                            {
                                RenderContext.az += (RenderContext.targetAz - (360 + RenderContext.az)) / 10;
                            }
                            else
                            {
                                RenderContext.az += ((360 + RenderContext.targetAz) - RenderContext.az) / 10;
                            }
                        }
                        else
                        {
                            RenderContext.az += (RenderContext.targetAz - RenderContext.az) / 10;
                        }
                        RenderContext.az = ((RenderContext.az + 720) % 360);
                    }
                }
                else
                {
                    if (((Math.Abs(RenderContext.TargetCamera.Lat - RenderContext.ViewCamera.Lat) >= (minDelta)) |
                        ((Math.Abs(RenderContext.TargetCamera.Lng - RenderContext.ViewCamera.Lng) >= (minDelta)))))
                    {
                        RenderContext.ViewCamera.Lat += (RenderContext.TargetCamera.Lat - RenderContext.ViewCamera.Lat) / 10;

                        if (Math.Abs(RenderContext.TargetCamera.Lng - RenderContext.ViewCamera.Lng) > 170)
                        {
                            if (RenderContext.TargetCamera.Lng > RenderContext.ViewCamera.Lng)
                            {
                                RenderContext.ViewCamera.Lng += (RenderContext.TargetCamera.Lng - (360 + RenderContext.ViewCamera.Lng)) / 10;
                            }
                            else
                            {
                                RenderContext.ViewCamera.Lng += ((360 + RenderContext.TargetCamera.Lng) - RenderContext.ViewCamera.Lng) / 10;
                            }
                        }
                        else
                        {
                            RenderContext.ViewCamera.Lng += (RenderContext.TargetCamera.Lng - RenderContext.ViewCamera.Lng) / 10;
                        }

                        RenderContext.ViewCamera.Lng = ((RenderContext.ViewCamera.Lng + 720) % 360);
                    }
                    else
                    {
                        if (RenderContext.ViewCamera.Lat != RenderContext.TargetCamera.Lat || RenderContext.ViewCamera.Lng != RenderContext.TargetCamera.Lng)
                        {
                            RenderContext.ViewCamera.Lat = RenderContext.TargetCamera.Lat;
                            RenderContext.ViewCamera.Lng = RenderContext.TargetCamera.Lng;
                        }
                    }
                }
            }



            //if (!tracking)
            //{
            //    this.viewCamera.Lng = dc * this.viewCamera.Lng + oneMinusDragCoefficient * this.targetCamera.Lng;
            //    this.viewCamera.Lat = dc * this.viewCamera.Lat + oneMinusDragCoefficient * this.targetCamera.Lat;
            //}
            RenderContext.ViewCamera.Zoom = dc * RenderContext.ViewCamera.Zoom + oneMinusDragCoefficient * RenderContext.TargetCamera.Zoom;
            RenderContext.ViewCamera.Rotation = dc * RenderContext.ViewCamera.Rotation + oneMinusDragCoefficient * RenderContext.TargetCamera.Rotation;
            RenderContext.ViewCamera.Angle = dc * RenderContext.ViewCamera.Angle + oneMinusDragCoefficient * RenderContext.TargetCamera.Angle;


        }

        public void Move(double x, double y)
        {
            // Emulate MoveView() in the Windows client -- rotate the x and y
            // offsets if the view is rotated. Our signs are the opposite of
            // the Windows client.

            double angle = Math.Atan2(y, x);
            double distance = Math.Sqrt(x * x + y * y);

            if (SolarSystemMode || PlanetLike) {
                x = Math.Cos(angle + RenderContext.ViewCamera.Rotation) * distance;
                y = Math.Sin(angle + RenderContext.ViewCamera.Rotation) * distance;
            } else {
                x = Math.Cos(angle - RenderContext.ViewCamera.Rotation) * distance;
                y = Math.Sin(angle - RenderContext.ViewCamera.Rotation) * distance;
            }

            // Apply the rotated offsets. The following merges up GetPixelScale{X,Y}()
            // and MoveViewNative() of the Windows client.

            double scaleY = RenderContext.FovScale / 3600.0;

            if (RenderContext.BackgroundImageset.DataSetType == ImageSetType.SolarSystem)
            {
                scaleY = .06;
            }

            double scaleX = scaleY / Math.Max(.2, Math.Cos(RenderContext.ViewCamera.Lat / 180.0 * Math.PI));

            if (RenderContext.BackgroundImageset.DataSetType == ImageSetType.Earth ||
                RenderContext.BackgroundImageset.DataSetType == ImageSetType.Planet ||
                RenderContext.BackgroundImageset.DataSetType == ImageSetType.SolarSystem)
            {
                scaleX *= 6.3; // XXX don't know where this magic number comes from
                scaleY *= 6.3;
            }

            if (RenderContext.Space && (Settings.Active.GalacticMode || Settings.Active.LocalHorizonMode))
            {
                x = Settings.Active.LocalHorizonMode ? -x : x;
                RenderContext.targetAz += x * scaleX;
                RenderContext.targetAz = ((RenderContext.targetAz + 720) % 360);
                RenderContext.targetAlt += y * scaleY;

                if (RenderContext.targetAlt > 90)
                {
                    RenderContext.targetAlt = 90;
                }

                if (RenderContext.targetAlt < -90)
                {
                    RenderContext.targetAlt = -90;
                }
            } else {
                RenderContext.TargetCamera.Lng -= x * scaleX;
                RenderContext.TargetCamera.Lng = ((RenderContext.TargetCamera.Lng + 720) % 360);
                RenderContext.TargetCamera.Lat += y * scaleY;

                if (RenderContext.TargetCamera.Lat > 90)
                {
                    RenderContext.TargetCamera.Lat = 90;
                }

                if (RenderContext.TargetCamera.Lat < -90)
                {
                    RenderContext.TargetCamera.Lat = -90;
                }
            }

            if (!Settings.GlobalSettings.SmoothPan)
            {
                RenderContext.ViewCamera = RenderContext.TargetCamera.Copy();
            }

            if (x != 0 && y != 0)
            {
                tracking = false;
                trackingObject = null;
            }
        }

        public void Zoom(double factor)
        {
            RenderContext.TargetCamera.Zoom *= factor;

            if (RenderContext.TargetCamera.Zoom > ZoomMax)
            {
                RenderContext.TargetCamera.Zoom = ZoomMax;
            }

            if (!Settings.GlobalSettings.SmoothPan)
            {
                RenderContext.ViewCamera = RenderContext.TargetCamera.Copy();
            }
        }

        // Mouse, touch, gesture controls -- lots of different event listeners for different
        // devices and browser support.

        double beginZoom = 1;
        bool dragging = false;
        bool mouseDown = false;
        bool isPinching = false;
        double lastX;
        double lastY;
        int[] pointerIds = new int[2];
        Vector2d[] pinchingZoomRect = new Vector2d[2];
        bool moved = false;

        // Gesture events

        public void OnGestureStart(ElementEvent e)
        {
            mouseDown = false;
            beginZoom = RenderContext.ViewCamera.Zoom;
        }

        public void OnGestureChange(ElementEvent e)
        {
            GestureEvent g = (GestureEvent)e;
            mouseDown = false;
            RenderContext.TargetCamera.Zoom = RenderContext.ViewCamera.Zoom = Math.Min(360, beginZoom * (1.0 / g.Scale));
        }

        public void OnGestureEnd(ElementEvent e)
        {
            GestureEvent g = (GestureEvent)e;
            mouseDown = false;
        }

        // Touch events

        public void OnTouchStart(ElementEvent e)
        {
            TouchEvent ev = (TouchEvent)(object)e;
            ev.PreventDefault();
            ev.StopPropagation();

            lastX = ev.TargetTouches[0].PageX;
            lastY = ev.TargetTouches[0].PageY;

            if (ev.TargetTouches.Length == 2)
            {
                isPinching = true;
                return;
            }

            if (uiController != null)
            {
                WWTElementEvent ee = new WWTElementEvent(lastX, lastY);

                if (uiController.MouseDown(this, (ElementEvent)(object)ee))
                {
                    mouseDown = false;
                    dragging = false;
                    return;
                }
            }

            mouseDown = true;
        }

        public void OnTouchMove(ElementEvent e)
        {
            TouchEvent ev = (TouchEvent)e;

            if (isPinching)
            {
                TouchInfo t0 = ev.Touches[0];
                TouchInfo t1 = ev.Touches[1];
                Vector2d[] newRect = new Vector2d[2];
                newRect[0] = Vector2d.Create(t0.PageX, t0.PageY);
                newRect[1] = Vector2d.Create(t1.PageX, t1.PageY);

                if (pinchingZoomRect[0] != null && pinchingZoomRect[1] != null)
                {
                    double oldDist = GetDistance(pinchingZoomRect[0], pinchingZoomRect[1]);
                    double newDist = GetDistance(newRect[0], newRect[1]);
                    double ratio = oldDist / newDist;
                    Zoom(ratio);
                }

                pinchingZoomRect = newRect;
                ev.StopPropagation();
                ev.PreventDefault();
                return;
            }

            ev.PreventDefault();
            ev.StopPropagation();

            if (mouseDown)
            {
                dragging = true;

                double curX = ev.TargetTouches[0].PageX - lastX;
                double curY = ev.TargetTouches[0].PageY - lastY;
                Move(curX, curY);

                lastX = ev.TargetTouches[0].PageX;
                lastY = ev.TargetTouches[0].PageY;
            }
            else
            {
                //todo fix this to use syntheszed touch events.
                if (uiController != null)
                {
                    if (uiController.MouseMove(this, e))
                    {
                        e.PreventDefault();
                        e.StopPropagation();
                        return;
                    }
                }
            }
        }

        public void OnTouchEnd(ElementEvent e)
        {
            TouchEvent ev = (TouchEvent)e;
            ev.PreventDefault();
            ev.StopPropagation();

            pinchingZoomRect[0] = null;
            pinchingZoomRect[1] = null;

            if (isPinching)
            {
                if (ev.Touches.Length < 2)
                {
                    isPinching = false;
                }
                return;
            }

            if (uiController != null)
            {
                WWTElementEvent ee = new WWTElementEvent(lastX, lastY);

                if (uiController.MouseUp(this, (ElementEvent)(object)ee))
                {
                    mouseDown = false;
                    dragging = false;
                    return;
                }
            }

            mouseDown = false;
            dragging = false;
        }

        // Pointer events

        public void OnPointerDown(ElementEvent e)
        {
            PointerEvent pe = (PointerEvent)(object)e;
            int index = 0;

            Script.Literal("var evt = arguments[0], cnv = arguments[0].target; if (cnv.setPointerCapture) {cnv.setPointerCapture(evt.pointerId);} else if (cnv.msSetPointerCapture) { cnv.msSetPointerCapture(evt.pointerId); }");

            // Check for this pointer already being in the list because as of
            // July 2020, Chrome/Mac sometimes fails to deliver the pointerUp
            // event.

            if (pointerIds[0] == pe.PointerId) {
                index = 0;
            } else if (pointerIds[1] == pe.PointerId) {
                index = 1;
            } else if (pointerIds[0] == 0) {
                index = 0;
            } else if (pointerIds[1] == 0) {
                index = 1;
            } else {
                return; // only attempt to track two pointers at once
            }

            pointerIds[index] = pe.PointerId;
            pinchingZoomRect[index] = Vector2d.Create(e.OffsetX, e.OffsetY);
        }

        public void OnPointerMove(ElementEvent e)
        {
            PointerEvent pe = (PointerEvent)(object)e;
            int index = 0;

            // Our pointerIds infrastructure is meant to track adjustments
            // during a pinch motion. However, as seen in Firefox circa v81 on
            // Linux and Android, in some cases the browser can just *lie* and
            // swap pointerIds for the two fingers during a pinch gesture,
            // leading to catastrophic failures. Therefore, ignore the pointerId
            // information and infer which location is being updated from
            // whichever change is smaller.

            if (pointerIds[0] == pe.PointerId)
            {
                index = 0;
            }
            else if (pointerIds[1] == pe.PointerId)
            {
                index = 1;
            }
            else
            {
                return;
            }

            if (pinchingZoomRect[0] != null && pinchingZoomRect[1] != null)
            {
                double oldDist = GetDistance(pinchingZoomRect[0], pinchingZoomRect[1]);

                Vector2d newRect = Vector2d.Create(e.OffsetX, e.OffsetY);

                double newDist0 = GetDistance(newRect, pinchingZoomRect[0]);
                double ratio0 = oldDist / newDist0;
                double abslog0 = Math.Abs(Math.Log(ratio0));
                if (!(bool)Script.Literal("isFinite({0})", abslog0)) {
                    abslog0 = 1000;
                }

                double newDist1 = GetDistance(newRect, pinchingZoomRect[1]);
                double ratio1 = oldDist / newDist1;
                double abslog1 = Math.Abs(Math.Log(ratio1));
                if (!(bool)Script.Literal("isFinite({0})", abslog1)) {
                    abslog1 = 1000;
                }

                if (abslog1 < abslog0) {
                    pinchingZoomRect[0] = newRect;
                    Zoom(ratio1);
                } else {
                    pinchingZoomRect[1] = newRect;
                    Zoom(ratio0);
                }
            } else {
                // Before two fingers are available, just trust.
                pinchingZoomRect[index] = Vector2d.Create(e.OffsetX, e.OffsetY);
            }

            e.StopPropagation();
            e.PreventDefault();
        }

        // NOTE! As of July 2020, Chrome on Macs seems to sometimes fail to
        // deliver this event. So our pinch-detection code needs to be robust to
        // that.
        public void OnPointerUp(ElementEvent e)
        {
            PointerEvent pe = (PointerEvent)(object)e;

            if (pointerIds[0] == pe.PointerId)
            {
                pointerIds[0] = 0;
                pinchingZoomRect[0] = null;
            }

            if (pointerIds[1] == pe.PointerId)
            {
                pointerIds[1] = 0;
                pinchingZoomRect[1] = null;
            }
        }

        // Mouse events

        public void OnMouseDown(ElementEvent e)
        {
            Document.AddEventListener("mousemove", OnMouseMove, false);
            Document.AddEventListener("mouseup", OnMouseUp, false);

            if (uiController != null)
            {
                if (uiController.MouseDown(this, e))
                {
                    return;
                }
            }

            mouseDown = true;
            lastX = Mouse.OffsetX(Canvas, e);
            lastY = Mouse.OffsetY(Canvas, e);
        }

        public void OnMouseMove(ElementEvent e)
        {
            lastMouseMove = Date.Now;
            hoverTextPoint = Vector2d.Create(Mouse.OffsetX(Canvas, e), Mouse.OffsetY(Canvas, e));
            hoverText = "";

            if (mouseDown)
            {
                e.PreventDefault();
                e.StopPropagation();

                moved = true;
                if (e.CtrlKey)
                {
                    Tilt(Mouse.OffsetX(Canvas, e) - lastX, Mouse.OffsetY(Canvas, e) - lastY);
                }
                else
                {
                    Move(Mouse.OffsetX(Canvas, e) - lastX, Mouse.OffsetY(Canvas, e) - lastY);
                }

                lastX = Mouse.OffsetX(Canvas, e);
                lastY = Mouse.OffsetY(Canvas, e);
            }
            else
            {
                if (uiController != null)
                {
                    if (uiController.MouseMove(this, e))
                    {
                        e.PreventDefault();
                        e.StopPropagation();
                        return;
                    }
                }
            }
        }

        public void OnMouseUp(ElementEvent e)
        {
            Document.RemoveEventListener("mousemove", OnMouseMove, false);
            Document.RemoveEventListener("mouseup", OnMouseUp, false);

            if (uiController != null)
            {
                if (uiController.MouseUp(this, e))
                {
                    mouseDown = false;
                    e.PreventDefault();
                    return;
                }
            }

            if (mouseDown && !moved)
            {
                Vector2d raDecDown = GetCoordinatesForScreenPoint(Mouse.OffsetX(Canvas, e), Mouse.OffsetY(Canvas, e));
                if (!Annotationclicked(raDecDown.X, raDecDown.Y, Mouse.OffsetX(Canvas, e), Mouse.OffsetY(Canvas, e)))
                {
                    scriptInterface.FireClick(raDecDown.X, raDecDown.Y);
                }
            }

            mouseDown = false;
            moved = false;
        }

        public void OnMouseWheel(ElementEvent e)
        {
            // WheelEvent is a WWT-specific binding (see WheelEvent.cs) that we
            // use to abstract across the different wheel-motion events that
            // browsers provide: "wheel", "mousewheel", "DOMMouseScroll".

            WheelEvent ev = (WheelEvent)(object)e;
            double delta;

            if (ev.deltaY != 0)
                delta = -ev.deltaY;
            else if (ev.detail != 0)
                delta = ev.detail * -1;
            else
                delta = ev.WheelDelta;

            if (delta > 0)
                Zoom(0.9);
            else
                Zoom(1.1);

            e.StopPropagation();
            e.PreventDefault();
        }

        public void OnDoubleClick(ElementEvent e)
        {
            showDataLayers = true;
        }

        public void OnKeyDown(ElementEvent e)
        {
            if (uiController != null)
            {
                uiController.KeyDown(this, e);
            }
        }

        public double GetDistance(Vector2d a, Vector2d b)
        {
            double x;
            double y;
            x = a.X - b.X;
            y = a.Y - b.Y;
            return Math.Sqrt(x * x + y * y);
        }

        public void OnContextMenu(ElementEvent e)
        {
            e.PreventDefault();
            e.StopPropagation();
        }

        private void Tilt(double x, double y)
        {
            RenderContext.TargetCamera.Rotation += x * .001;
            RenderContext.TargetCamera.Angle += y * .001;

            if (RenderContext.TargetCamera.Angle < -1.52)
            {
                RenderContext.TargetCamera.Angle = -1.52;
            }

            if (RenderContext.TargetCamera.Angle > 0)
            {
                RenderContext.TargetCamera.Angle = 0;
            }
        }

        public Vector2d GetCoordinatesForScreenPoint(double x, double y)
        {
            Vector2d result;
            Vector3d PickRayDir;
            Vector2d pt = Vector2d.Create(x, y);
            PickRayDir = TransformPickPointToWorldSpace(pt, RenderContext.Width, RenderContext.Height);
            result = Coordinates.CartesianToSphericalSky(PickRayDir);

            return result;
        }

        public Vector3d TransformPickPointToWorldSpace(Vector2d ptCursor, double backBufferWidth, double backBufferHeight)
        {
            Vector3d vPickRayOrig;
            Vector3d vPickRayDir;

            Vector3d v = new Vector3d();
            v.X = (((2.0f * ptCursor.X) / backBufferWidth) - 1) / (RenderContext.Projection.M11);// / (backBufferWidth / 2));
            v.Y = (((2.0f * ptCursor.Y) / backBufferHeight) - 1) / (RenderContext.Projection.M22);// / (backBufferHeight / 2));
            v.Z = 1.0f;

            Matrix3d m = Matrix3d.MultiplyMatrix(RenderContext.View, RenderContext.World);

            m.Invert();

            vPickRayDir = new Vector3d();
            vPickRayOrig = new Vector3d();
            // Transform the screen space pick ray into 3D space
            vPickRayDir.X = v.X * m.M11 + v.Y * m.M21 + v.Z * m.M31;
            vPickRayDir.Y = v.X * m.M12 + v.Y * m.M22 + v.Z * m.M32;
            vPickRayDir.Z = v.X * m.M13 + v.Y * m.M23 + v.Z * m.M33;

            vPickRayDir.Normalize();

            return vPickRayDir;
        }

        // Initialization

        public static ScriptInterface scriptInterface;
        CanvasElement foregroundCanvas = null;
        CanvasContext2D fgDevice = null;
        Folder webFolder;

        // For backwards compatibility, we preserve the semantics that calling
        // this function kicks off the rendering loop.
        public static ScriptInterface InitControl(string DivId)
        {
            return InitControl2(DivId, true);
        }

        // This function had a parameter to choose whether to use WebGL or HTML5
        // canvas, but at some point the argument was defused. We preserve it
        // for backwards compatibility.
        public static ScriptInterface InitControlParam(string DivId, bool webgl_ignored)
        {
            return InitControl2(DivId, true);
        }

        public static ScriptInterface InitControl2(string DivId, bool startRenderLoop)
        {
            return InitControl6(
                DivId,
                startRenderLoop,
                0,
                0,
                360,
                "Sky"
            );
        }

        public static ScriptInterface InitControl6(
            string DivId,
            bool startRenderLoop,
            double startLat,
            double startLng,
            double startZoom,
            string startMode
        )
        {
            if (Singleton.RenderContext.Device == null)
            {
                scriptInterface = new ScriptInterface();
                scriptInterface.Settings = Settings.Current;

                CanvasElement canvas = CreateCanvasElement(DivId);

                String webgltext = "webgl";
                GL gl = (GL)(Object)canvas.GetContext((Rendering)(object)webgltext);

                if (gl == null) {
                    webgltext = "experimental-webgl";
                    gl = (GL)(Object)canvas.GetContext((Rendering)(object)webgltext);
                }

                if (gl == null) {
                    CanvasContext2D ctx = (CanvasContext2D)canvas.GetContext(Rendering.Render2D);
                    Singleton.RenderContext.Device = ctx;
                } else {
                    Tile.PrepDevice = gl;
                    Singleton.RenderContext.gl = gl;
                    RenderContext.UseGl = true;
                }

                Singleton.Canvas = canvas;
                Singleton.RenderContext.Width = canvas.Width;
                Singleton.RenderContext.Height = canvas.Height;
                Singleton.Setup(canvas, startLat, startLng, startZoom);

                if (startMode == "earth") {
                    Singleton.RenderContext.BackgroundImageset = Imageset.Create(
                        "Blue Marble",  // name
                        URLHelpers.singleton.coreStaticUrl("wwtweb/tiles.aspx?q={1},{2},{3},bm200407"),  // url
                        ImageSetType.Earth,  // dataSetType
                        BandPass.Visible,  // bandPass
                        ProjectionType.Toast,  // projectionType
                        101,  // imageSetID
                        0,  // baseLevel
                        7,  // levels
                        256,  // tileSize (unused)
                        180,  // baseTileDegrees
                        ".png",  // extension
                        false,  // bottomsUp
                        "",  // quadTreeMap
                        0,  // centerX
                        0,  // centerY
                        0,  // rotation
                        false,  // sparse
                        URLHelpers.singleton.coreStaticUrl("wwtweb/thumbnail.aspx?name=bm200407"),  // thumbnailUrl
                        true,  // defaultSet
                        false,  // elevationModel
                        0,  // widthFactor
                        0,  // offsetX
                        0,  // offsetY
                        "",  // creditsText
                        "",  // creditsUrl
                        "",  // demUrl
                        "",  // altUrl
                        6371000,  // meanRadius
                        "Earth"  // referenceFrame
                    );
                } else {
                    Singleton.RenderContext.BackgroundImageset = Imageset.Create(
                        "DSS",  // name
                        URLHelpers.singleton.coreStaticUrl("wwtweb/dss.aspx?q={1},{2},{3}"), // url
                        ImageSetType.Sky,  // dataSetType
                        BandPass.Visible,  // bandPass
                        ProjectionType.Toast,  // projectionType
                        100,  // imageSetId
                        0,   // baseLevel
                        12,  // levels
                        256,  // tileSize (unused)
                        180,  // baseTileDegrees
                        ".png",  // extension
                        false,  // bottomsUp
                        "",  // quadTreeMap
                        0,  // centerX
                        0,  // centerY
                        0,  // rotation
                        false,  // sparse
                        URLHelpers.singleton.coreStaticUrl("thumbnails/DSS.png"),  // thumbnailUrl
                        true,  // defaultSet
                        false,  // elevationModel
                        0,  // widthFactor
                        0,  // offsetX
                        0,  // offsetY
                        "",  // creditsText
                        "",  // creditsUrl
                        "",  // demUrl
                        "",  // altUrl
                        1,  // meanRadius
                        "Sky"  // referenceFrame
                    );
                }
            }

            Singleton.RenderContext.ViewCamera.Lng += 0;
            Singleton.RenderContext.InitGL();

            if (startRenderLoop) {
              Singleton.Render();
            }

            return scriptInterface;
        }

        private static CanvasElement CreateCanvasElement(string DivId)
        {
            DivElement div = (DivElement) Document.GetElementById(DivId);

            CanvasElement canvas = (CanvasElement) Document.CreateElement("canvas");
            canvas.Height = div.ClientHeight;
            canvas.Width = div.ClientWidth;
            div.AppendChild(canvas);
            return canvas;
        }

        // Note that due to limitations of ScriptSharp, this method must be
        // public even though it should really be private.
        public void Setup(
            CanvasElement canvas,
            double startLat,
            double startLng,
            double startZoom
        ) {
            Window.AddEventListener("contextmenu", OnContextMenu, false);
            Document.Body.AddEventListener("keydown", OnKeyDown, false);
            canvas.AddEventListener("dblclick", OnDoubleClick, false);
            canvas.AddEventListener("mousedown", OnMouseDown, false);
            canvas.AddEventListener("wheel", OnMouseWheel, false);
            canvas.AddEventListener("mousewheel", OnMouseWheel, false);
            canvas.AddEventListener("DOMMouseScroll", OnMouseWheel, false);  // old Firefox
            canvas.AddEventListener("touchstart", OnTouchStart, false);
            canvas.AddEventListener("touchmove", OnTouchMove, false);
            canvas.AddEventListener("touchend", OnTouchEnd, false);
            canvas.AddEventListener("gesturechange", OnGestureChange, false);
            canvas.AddEventListener("gesturestart", OnGestureStart, false);
            canvas.AddEventListener("gestureend", OnGestureEnd, false);
            canvas.AddEventListener("pointerdown", OnPointerDown, false);
            canvas.AddEventListener("pointermove", OnPointerMove, false);
            canvas.AddEventListener("pointerup", OnPointerUp, false);

            RenderContext.ViewCamera.Lat = startLat;
            RenderContext.ViewCamera.Lng = startLng;
            RenderContext.ViewCamera.Zoom = startZoom;

            RenderContext.TargetCamera = RenderContext.ViewCamera.Copy();

            if (RenderContext.gl == null)
            {
                foregroundCanvas = (CanvasElement)Document.CreateElement("canvas");
                foregroundCanvas.Width = canvas.Width;
                foregroundCanvas.Height = canvas.Height;
                fgDevice = (CanvasContext2D)foregroundCanvas.GetContext(Rendering.Render2D);
            }

            webFolder = new Folder();
            webFolder.LoadFromUrl(
                URLHelpers.singleton.engineAssetUrl("builtin-image-sets.wtml"),
                SetupComplete
            );
        }

        void SetupComplete()
        {
            Wtml.LoadImagesets(webFolder);
            scriptInterface.FireReady();
        }

        public static void UseUserLocation()
        {
            Navigator.Geolocation.GetCurrentPosition(GetLocation, GetLocationError);
        }

        private static void GetLocation(Position pos)
        {
            if (pos.Coords.Latitude != 0)
            {
                Settings.GlobalSettings.LocationLat = pos.Coords.Latitude;
            }
            if (pos.Coords.Longitude != 0)
            {
                Settings.GlobalSettings.LocationLng = pos.Coords.Longitude;
            }
            if (pos.Coords.Altitude != 0)
            {
                Settings.GlobalSettings.LocationAltitude = pos.Coords.Altitude;
            }
        }
        private static void GetLocationError (Position pos)
        {
            if (pos != null && pos.Coords != null)
            {
                double lat = pos.Coords.Latitude;
                double lng = pos.Coords.Longitude;

            }
        }

        public void GotoRADecZoom(double ra, double dec, double zoom, bool instant)
        {
            ra = DoubleUtilities.Clamp(ra, 0, 24);
            dec = DoubleUtilities.Clamp(dec, -90, 90);
            zoom = DoubleUtilities.Clamp(zoom, ZoomMin, ZoomMax);

            tracking = false;
            trackingObject = null;

            GotoTargetFull(
                false,  // noZoom
                instant,
                CameraParameters.Create(
                    dec,
                    WWTControl.Singleton.RenderContext.RAtoViewLng(ra),
                    zoom,
                    WWTControl.Singleton.RenderContext.ViewCamera.Rotation,
                    WWTControl.Singleton.RenderContext.ViewCamera.Angle,
                    (float)WWTControl.Singleton.RenderContext.ViewCamera.Opacity
                ),
                WWTControl.Singleton.RenderContext.ForegroundImageset,
                WWTControl.Singleton.RenderContext.BackgroundImageset
            );
        }


        bool tracking = false;
        Place trackingObject = null;

        public bool SandboxMode = false;

        public bool SolarSystemMode
        {
            get
            {
                if (RenderContext.BackgroundImageset == null)
                {
                    return false;
                }

                return RenderContext.BackgroundImageset.DataSetType == ImageSetType.SolarSystem;
            }
        }

        SolarSystemObjects SolarSystemTrack = SolarSystemObjects.Undefined;
        public void GotoTarget(Place place, bool noZoom, bool instant, bool trackObject)
        {
            if (place == null)
            {
                return;
            }
            if ((trackObject && SolarSystemMode))
            {
                if ((place.Classification == Classification.SolarSystem && place.Type != ImageSetType.SolarSystem) || (place.Classification == Classification.Star) || (place.Classification == Classification.Galaxy) && place.Distance > 0)
                {
                    SolarSystemObjects target = SolarSystemObjects.Undefined;

                    if (place.Classification == Classification.Star || place.Classification == Classification.Galaxy)
                    {
                        target = SolarSystemObjects.Custom;
                    }
                    else
                    {
                        try
                        {
                            if (place.Target != SolarSystemObjects.Undefined)
                            {
                                target = place.Target;
                            }
                            else
                            {
                                target = (SolarSystemObjects)Planets.GetPlanetIDFromName(place.Name);
                            }
                        }
                        catch
                        {
                        }
                    }
                    if (target != SolarSystemObjects.Undefined)
                    {
                        trackingObject = place;
                        if (target == SolarSystemTrack && !(place.Classification == Classification.Star || place.Classification == Classification.Galaxy))
                        {
                            GotoTarget3(place.CamParams, noZoom, instant);
                            return;
                        }
                        double jumpTime = 4;

                        if (target == SolarSystemObjects.Custom)
                        {
                            jumpTime = 17;
                        }
                        else
                        {
                            jumpTime += 13 * (101 - Settings.Active.SolarSystemScale) / 100;
                        }

                        if (instant)
                        {
                            jumpTime = 1;
                        }

                        //SolarSystemTrack = target;
                        CameraParameters camTo = RenderContext.ViewCamera.Copy();
                        camTo.TargetReferenceFrame = "";
                        camTo.Target = target;
                        double zoom = 10;
                        if (target == SolarSystemObjects.Custom)
                        {
                            if (place.Classification == Classification.Galaxy)
                            {
                                zoom = 1404946007758;
                            }
                            else
                            {
                                zoom = 63239.6717 * 100;
                            }
                            // Star or something outside of SS
                            Vector3d vect = Coordinates.RADecTo3dAu(place.RA, place.Dec, place.Distance);
                            double ecliptic = Coordinates.MeanObliquityOfEcliptic(SpaceTimeController.JNow) / 180.0 * Math.PI;

                            vect.RotateX(ecliptic);
                            camTo.ViewTarget = Vector3d.Negate(camTo.ViewTarget);
                        }
                        else
                        {
                            camTo.ViewTarget = Planets.GetPlanet3dLocationJD(target, SpaceTimeController.GetJNowForFutureTime(jumpTime));
                            switch (target)
                            {
                                case SolarSystemObjects.Sun:
                                    zoom = .6;
                                    break;
                                case SolarSystemObjects.Mercury:
                                    zoom = .0004;
                                    break;
                                case SolarSystemObjects.Venus:
                                    zoom = .0004;
                                    break;
                                case SolarSystemObjects.Mars:
                                    zoom = .0004;
                                    break;
                                case SolarSystemObjects.Jupiter:
                                    zoom = .007;
                                    break;
                                case SolarSystemObjects.Saturn:
                                    zoom = .007;
                                    break;
                                case SolarSystemObjects.Uranus:
                                    zoom = .004;
                                    break;
                                case SolarSystemObjects.Neptune:
                                    zoom = .004;
                                    break;
                                case SolarSystemObjects.Pluto:
                                    zoom = .0004;
                                    break;
                                case SolarSystemObjects.Moon:
                                    zoom = .0004;
                                    break;
                                case SolarSystemObjects.Io:
                                    zoom = .0004;
                                    break;
                                case SolarSystemObjects.Europa:
                                    zoom = .0004;
                                    break;
                                case SolarSystemObjects.Ganymede:
                                    zoom = .0004;
                                    break;
                                case SolarSystemObjects.Callisto:
                                    zoom = .0004;
                                    break;
                                case SolarSystemObjects.Earth:
                                    zoom = .0004;
                                    break;
                                case SolarSystemObjects.Custom:
                                    zoom = 10;
                                    break;

                                default:
                                    break;
                            }

                            zoom = zoom * Settings.Active.SolarSystemScale;

                        }

                        CameraParameters fromParams = RenderContext.ViewCamera.Copy();
                        if (SolarSystemTrack == SolarSystemObjects.Custom && !string.IsNullOrEmpty(RenderContext.TrackingFrame))
                        {
                            fromParams =  RenderContext.CustomTrackingParams;
                            RenderContext.TrackingFrame = "";
                        }
                        camTo.Zoom = zoom;
                        Vector3d toVector = camTo.ViewTarget;
                        toVector.Subtract(fromParams.ViewTarget);

                        //Vector3d toVector = camTo.ViewTarget;
                        //toVector.Subtract(new Vector3d(cameraPosition));

                        if (place.Classification == Classification.Star)
                        {
                            toVector = Vector3d.Negate(toVector);
                        }

                        if (toVector.Length() != 0)
                        {

                            Vector2d raDec = toVector.ToRaDec();

                            if (target == SolarSystemObjects.Custom)
                            {
                                camTo.Lat = -raDec.Y;
                            }
                            else
                            {
                                camTo.Lat = raDec.Y;
                            }
                            camTo.Lng = raDec.X * 15 - 90;
                        }
                        else
                        {
                            camTo.Lat = RenderContext.ViewCamera.Lat;
                            camTo.Lng = RenderContext.ViewCamera.Lng;
                        }

                        if (target != SolarSystemObjects.Custom)
                        {
                            // replace with planet surface
                            camTo.ViewTarget = Planets.GetPlanetTargetPoint(target, camTo.Lat, camTo.Lng, SpaceTimeController.GetJNowForFutureTime(jumpTime));

                        }



                        ViewMoverKenBurnsStyle solarMover = new ViewMoverKenBurnsStyle(fromParams, camTo, jumpTime, SpaceTimeController.Now, SpaceTimeController.GetTimeForFutureTime(jumpTime), InterpolationType.EaseInOut);
                        solarMover.FastDirectionMove = true;
                        Mover = solarMover;

                        return;
                    }
                }
            }




            tracking = false;
            trackingObject = null;
            CameraParameters camParams = place.CamParams.Copy();


            // (gonzalo) backgroundimageset could be null... protect onself!
            if (RenderContext.BackgroundImageset != null && place.Type != RenderContext.BackgroundImageset.DataSetType)
            {
                RenderContext.TargetCamera = place.CamParams.Copy();
                RenderContext.ViewCamera = RenderContext.TargetCamera.Copy();
                RenderContext.BackgroundImageset = GetDefaultImageset(place.Type, BandPass.Visible);
                instant = true;
            }
            else if (SolarSystemMode && place.Target != SolarSystemTrack)
            {
                RenderContext.TargetCamera = place.CamParams.Copy();
                RenderContext.ViewCamera = RenderContext.TargetCamera.Copy();
                SolarSystemTrack = place.Target;
                instant = true;
            }


            if (place.Classification == Classification.Constellation)
            {
                camParams.Zoom = ZoomMax;
                GotoTargetFull(false, instant, camParams, null, null);
            }
            else
            {
                SolarSystemTrack = place.Target;
                GotoTargetFull(noZoom, instant, camParams, place.StudyImageset, place.BackgroundImageset);
                //if (place.Classification == Classification.SolarSystem)
                if (trackObject)
                {
                    tracking = true;
                    trackingObject = place;
                }
            }
        }

        public void GotoTarget3(CameraParameters camParams, bool noZoom, bool instant)
        {
            tracking = false;
            trackingObject = null;
            GotoTargetFull(noZoom, instant, camParams, RenderContext.ForegroundImageset, RenderContext.BackgroundImageset);
        }

        public void GotoTargetFull(bool noZoom, bool instant, CameraParameters cameraParams, Imageset studyImageSet, Imageset backgroundImageSet)
        {
            RenderNeeded = true;
            //if (cameraParams == this.viewCamera)
            //{
            //    instant = true;
            //}
            tracking = false;
            trackingObject = null;
            targetStudyImageset = studyImageSet;
            targetBackgroundImageset = backgroundImageSet;

            if (noZoom)
            {
                cameraParams.Zoom = RenderContext.ViewCamera.Zoom;
                cameraParams.Angle = RenderContext.ViewCamera.Angle;
                cameraParams.Rotation = RenderContext.ViewCamera.Rotation;
            }
            else
            {
                if (cameraParams.Zoom == -1 || cameraParams.Zoom == 0)
                {
                    if (RenderContext.Space)
                    {
                        cameraParams.Zoom = 1.40625;
                    }
                    else
                    {
                        cameraParams.Zoom = 0.09F;
                    }
                }
            }

            if (instant ||
                (Math.Abs(RenderContext.ViewCamera.Lat - cameraParams.Lat) < .000000000001 &&
                 Math.Abs(RenderContext.ViewCamera.Lng - cameraParams.Lng) < .000000000001 &&
                 Math.Abs(RenderContext.ViewCamera.Zoom - cameraParams.Zoom) < .000000000001))
            {
                Mover = null;
                RenderContext.TargetCamera = cameraParams.Copy();
                RenderContext.ViewCamera = RenderContext.TargetCamera.Copy();

                if (RenderContext.Space && Settings.Active.GalacticMode)
                {
                    double[] gPoint = Coordinates.J2000toGalactic(RenderContext.ViewCamera.RA * 15, RenderContext.ViewCamera.Dec);
                    RenderContext.targetAlt = RenderContext.alt = gPoint[1];
                    RenderContext.targetAz = RenderContext.az = gPoint[0];
                }
                else if (RenderContext.Space && Settings.Active.LocalHorizonMode)
                {
                    Coordinates currentAltAz = Coordinates.EquitorialToHorizon(Coordinates.FromRaDec(RenderContext.ViewCamera.RA, RenderContext.ViewCamera.Dec), SpaceTimeController.Location, SpaceTimeController.Now);
                    RenderContext.targetAlt = RenderContext.alt = currentAltAz.Alt;
                    RenderContext.targetAz = RenderContext.az = currentAltAz.Az;
                }

                mover_Midpoint();
            }
            else
            {
                Mover = ViewMoverSlew.Create(RenderContext.ViewCamera, cameraParams);
                RenderNeeded = true;
                Mover.Midpoint = mover_Midpoint;
            }
        }

        internal void FreezeView()
        {
            RenderContext.ViewCamera = RenderContext.TargetCamera.Copy();
            Mover = null;
        }


        internal IViewMover Mover
        {
            get { return RenderContext.ViewMover; }
            set
            {
                RenderContext.ViewMover = value;
                RenderNeeded = true;
            }
        }

        bool moving = false;

        public void FadeInImageSet(Imageset newImageSet)
        {
            if (RenderContext.BackgroundImageset != null &&
                newImageSet.DataSetType != RenderContext.BackgroundImageset.DataSetType)
            {
                TileCache.PurgeQueue();
                TileCache.ClearCache();
            }

            RenderContext.BackgroundImageset = newImageSet;
        }

        Imageset targetStudyImageset = null;
        Imageset targetBackgroundImageset = null;

        void mover_Midpoint()
        {
            if ((targetStudyImageset != null &&
                 RenderContext.ForegroundImageset == null) ||
                (RenderContext.ForegroundImageset != null &&
                !RenderContext.ForegroundImageset.Equals(targetStudyImageset)))
            {
                RenderContext.ForegroundImageset = targetStudyImageset;
            }

            //(gonzalo) protect from backgroundImageset being null ...
            if (RenderContext.BackgroundImageset != null &&
                (targetBackgroundImageset != null &&
                 !RenderContext.BackgroundImageset.Equals(targetBackgroundImageset)))
            {
                if (targetBackgroundImageset != null && targetBackgroundImageset.Generic)
                {
                    FadeInImageSet(GetRealImagesetFromGeneric(targetBackgroundImageset));
                }
                else
                {
                    FadeInImageSet(targetBackgroundImageset);
                }
            }
        }

        public Imageset GetDefaultImageset(ImageSetType imageSetType, BandPass bandPass)
        {
            foreach (Imageset imageset in ImageSets)
            {
                if (imageset.DefaultSet && imageset.BandPass == bandPass && imageset.DataSetType == imageSetType)
                {
                    return imageset;
                }

            }
            foreach (Imageset imageset in ImageSets)
            {
                if (imageset.BandPass == bandPass && imageset.DataSetType == imageSetType)
                {
                    return imageset;
                }

            }
            foreach (Imageset imageset in ImageSets)
            {
                if (imageset.DataSetType == imageSetType)
                {
                    return imageset;
                }

            }
            return ImageSets[0];
        }

        private Imageset GetRealImagesetFromGeneric(Imageset generic)
        {
            foreach (Imageset imageset in ImageSets)
            {
                if (imageset.DefaultSet && imageset.BandPass == generic.BandPass && imageset.DataSetType == generic.DataSetType)
                {
                    return imageset;
                }

            }

            foreach (Imageset imageset in ImageSets)
            {
                if (imageset.BandPass == generic.BandPass && imageset.DataSetType == generic.DataSetType)
                {
                    return imageset;
                }

            }
            return ImageSets[0];
        }

        public static void SetBackgroundImageName(string name)
        {
            WWTControl.ImageSetName = name;
        }

        public static void SetForegroundImageName(string name)
        {
            WWTControl.ImageSetName = name;
        }

        public static void ShowLayers(bool show)
        {
            WWTControl.showDataLayers = show;
        }

        internal void HideUI(bool p)
        {
            //todo implement this
        }

        internal void CloseTour()
        {
            //todo implement tour close
        }
        public TourDocument tour = null;

        //public TourEditor TourEditor = null;
        public TourEditTab TourEdit = null;



        public TourDocument CreateTour(string name)
        {
            if (uiController is TourPlayer)
            {
                TourPlayer player = (TourPlayer)uiController;
                player.Stop(false);

            }

            tour = new TourDocument();
            tour.Title = name;

            SetupTour();
            tour.EditMode = true;

            return tour;
        }

        public void SetupTour()
        {
           TourEdit = new TourEditTab();
           TourEdit.Tour = tour;
           tour.CurrentTourstopIndex = 0;
           tour.EditMode = false;
           uiController = TourEdit.TourEditorUI;
        }

        public void PlayTour(string url)
        {
            if (uiController is TourPlayer)
            {
                TourPlayer player = (TourPlayer)uiController;
                player.Stop(false);
            }

            //LayerManager.TourLayers = true;

            tour = TourDocument.FromUrl(url, delegate
                    {
                        //TourPlayer player = new TourPlayer();
                        //player.Tour = tour;
                        //tour.CurrentTourstopIndex = -1;
                        //uiController = player;
                        //WWTControl.scriptInterface.FireTourReady();
                        //player.Play();

                        SetupTour();
                        TourEdit.PlayNow(true);
                        WWTControl.scriptInterface.FireTourReady();
                    });

        }

        public void PlayCurrentTour()
        {
            if (uiController is TourPlayer)
            {
                TourPlayer player = (TourPlayer)uiController;
                player.Play();
            }

        }

        public void PauseCurrentTour()
        {
            if (uiController is TourPlayer)
            {
                TourPlayer player = (TourPlayer)uiController;
                player.PauseTour();
            }

        }

        public void StopCurrentTour()
        {
            if (uiController is TourPlayer)
            {
                TourPlayer player = (TourPlayer)uiController;
                player.Stop(false);
            }
        }

        public Imageset GetImagesetByName(string name)
        {
            foreach (Imageset imageset in ImageSets)
            {
                if (imageset.Name.ToLowerCase().IndexOf(name.ToLowerCase()) > -1)
                {
                    return imageset;
                }
            }
            return null;
        }

        public void SetBackgroundImageByName(string name)
        {
            Imageset newBackground = GetImagesetByName(name);

            if (newBackground != null)
            {
                RenderContext.BackgroundImageset = newBackground;
            }
        }

        public void SetForegroundImageByName(string name)
        {
            Imageset newForeground = GetImagesetByName(name);

            if (newForeground != null)
            {
                RenderContext.ForegroundImageset = newForeground;
            }
        }

        private SimpleLineList crossHairs = null;

        private void DrawCrosshairs(RenderContext context)
        {
            if (context.gl == null)
            {
                CanvasContext2D ctx = context.Device;
                ctx.Save();
                ctx.BeginPath();
                ctx.StrokeStyle = Settings.Current.CrosshairsColor;
                ctx.LineWidth = 2;

                double x = context.Width / 2, y = context.Height / 2;
                double halfLength = 5;

                ctx.MoveTo(x, y + halfLength);
                ctx.LineTo(x, y - halfLength);
                ctx.MoveTo(x + halfLength, y);
                ctx.LineTo(x - halfLength, y);

                ctx.Stroke();
                ctx.Restore();
            }
            else
            {
                if (crossHairs == null)
                {
                    // These coordinates are in clip space where the shape of
                    // the viewport is 1x1, so to get the crosshairs to appear
                    // square on the screen we have to apply the aspect ratio.
                    double halfHeight = 0.03;
                    double halfWidth = halfHeight * context.Height / context.Width;

                    crossHairs = new SimpleLineList();
                    crossHairs.DepthBuffered = false;
                    crossHairs.Pure2D = true;
                    crossHairs.AddLine(Vector3d.Create(-halfWidth, .0, 0), Vector3d.Create(halfWidth, 0, 0));
                    crossHairs.AddLine(Vector3d.Create(0, -halfHeight, 0), Vector3d.Create(0, halfHeight, 0));
                }

                crossHairs.DrawLines(context, 1.0f, Colors.White);
            }
        }

        public void CaptureThumbnail(BlobReady blobReady)
        {
            RenderOneFrame(); // NB: this used to be Render() but that was almost surely not what we want

            ImageElement image = (ImageElement)Document.CreateElement("img");
            image.AddEventListener("load", delegate (ElementEvent e)
            {
                double imageAspect = ((double)image.Width) / (image.Height);

                double clientAspect = 96 / 45;

                int cw = 96;
                int ch = 45;

                if (imageAspect < clientAspect)
                {
                    ch = (int)((double)cw / imageAspect);
                }
                else
                {
                 cw = (int)((double)ch * imageAspect);
                }

                int cx = (96 - cw) / 2;
                int cy = (45 - ch) / 2;

                CanvasElement temp = (CanvasElement)Document.CreateElement("canvas");
                temp.Height = 45;
                temp.Width = 96;
                CanvasContext2D ctx = (CanvasContext2D)temp.GetContext(Rendering.Render2D);
                ctx.DrawImage(image, cx, cy, cw, ch);
                //Script.Literal("{0}.toBlob({1}, 'image/jpeg')", temp, blobReady);

                Script.Literal("if ( typeof {0}.msToBlob == 'function') {{ var blob = {0}.msToBlob(); {1}(blob); }} else {{ {0}.toBlob({1}, 'image/jpeg'); }}", temp, blobReady);


              //  thumb.Src = temp.GetDataUrl();
            }, false);

            image.Src = Singleton.Canvas.GetDataUrl();

        }

        public void ClampZooms(RenderContext rc)
        {
            rc.ViewCamera.Zoom = DoubleUtilities.Clamp(rc.ViewCamera.Zoom, ZoomMin, ZoomMax);
            rc.TargetCamera.Zoom = DoubleUtilities.Clamp(rc.TargetCamera.Zoom, ZoomMin, ZoomMax);
        }

    }
    public delegate void BlobReady(System.Html.Data.Files.Blob blob);


    public class WWTElementEvent
    {
        public double OffsetX;
        public double OffsetY;
        public WWTElementEvent(double x, double y)
        {
            OffsetX = x;
            OffsetY = y;
        }
    }
}
