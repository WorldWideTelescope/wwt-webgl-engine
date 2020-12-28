using System;
using System.Collections.Generic;
using System.Linq;
using System.Html;
using System.Html.Media.Graphics;

namespace wwtlib
{
    public class TourPlayer : IUiController
    {
        public TourPlayer()
        {
        }

        BlendState overlayBlend = BlendState.Create(false, 1000);

        public void Render(RenderContext renderContext)
        {
            //window.SetupMatricesOverlays();
            if (tour == null || tour.CurrentTourStop == null || !playing)
            {
                return;
            }

            renderContext.Save();

            UpdateSlideStates();

            if (!onTarget)
            {
                slideStartTime = Date.Now;
                if (renderContext.OnTarget(Tour.CurrentTourStop.Target))
                {

                    onTarget = true;
                    overlayBlend.State = !Tour.CurrentTourStop.FadeInOverlays;
                    overlayBlend.TargetState = true;
                    if (tour.CurrentTourStop.MusicTrack != null)
                    {
                        tour.CurrentTourStop.MusicTrack.Play();
                    }

                    if (tour.CurrentTourStop.VoiceTrack != null)
                    {
                        tour.CurrentTourStop.VoiceTrack.Play();
                    }
                    string caption = "";
                    foreach (Overlay overlay in tour.CurrentTourStop.Overlays)
                    {

                        if (overlay.Name.ToLowerCase() == "caption")
                        {
                            TextOverlay text = overlay as TextOverlay;
                            if (text != null)
                            {
                                caption = text.TextObject.Text;
                            }
                        }
                        overlay.Play();
                    }

                    LayerManager.SetVisibleLayerList(tour.CurrentTourStop.Layers);

                    if (tour.CurrentTourStop.EndTarget != null && tour.CurrentTourStop.EndTarget.ZoomLevel != -1)
                    {
                        if (tour.CurrentTourStop.Target.Type == ImageSetType.SolarSystem)
                        {
                            // TODO fix this when Planets are implenented
                            //tour.CurrentTourStop.Target.UpdatePlanetLocation(SpaceTimeController.UtcToJulian(tour.CurrentTourStop.StartTime));
                            //tour.CurrentTourStop.EndTarget.UpdatePlanetLocation(SpaceTimeController.UtcToJulian(tour.CurrentTourStop.EndTime));
                        }
                        renderContext.ViewMover = new ViewMoverKenBurnsStyle(tour.CurrentTourStop.Target.CamParams, tour.CurrentTourStop.EndTarget.CamParams, tour.CurrentTourStop.Duration / 1000.0, tour.CurrentTourStop.StartTime, tour.CurrentTourStop.EndTime, tour.CurrentTourStop.InterpolationType);

                    }
                    Settings.TourSettings = tour.CurrentTourStop;
                    SpaceTimeController.Now = tour.CurrentTourStop.StartTime;
                    SpaceTimeController.SyncToClock = false;

                    WWTControl.scriptInterface.FireSlideChanged(caption);
                }
            }

            if (renderContext.gl != null)
            {
                renderContext.SetupMatricesOverlays();

                //todo Factor opacity in somehow ??
                //view.overlays.Opacity = overlayBlend.Opacity;

                if (currentMasterSlide != null)
                {
                    foreach (Overlay overlay in currentMasterSlide.Overlays)
                    {
                        overlay.TweenFactor = 1f;
                        overlay.Draw3D(renderContext, false);
                    }
                }

                if (onTarget)
                {
                    foreach (Overlay overlay in tour.CurrentTourStop.Overlays)
                    {
                        if (overlay.Name.ToLowerCase() != "caption" || WWTControl.scriptInterface.ShowCaptions)
                        {
                            overlay.TweenFactor = (float)CameraParameters.EaseCurve(tour.CurrentTourStop.TweenPosition, overlay.InterpolationType == InterpolationType.DefaultV ? tour.CurrentTourStop.InterpolationType : overlay.InterpolationType);
                            overlay.Draw3D(renderContext, false);
                        }
                    }
                }

                renderContext.Restore();

                // There used to be code to draw on-screen tour player controls here.
                // In the web engine, that kind of work is now taken care of at higher levels.
                //DrawPlayerControls(renderContext);
            }
            else
            {
                renderContext.Device.Scale(renderContext.Height / 1116, renderContext.Height / 1116);

                double aspectOrig = 1920 / 1116;

                double aspectNow = renderContext.Width / renderContext.Height;

                renderContext.Device.Translate(-((1920 - (aspectNow * 1116)) / 2), 0);

                //todo Factor opacity in somehow ??
                //view.overlays.Opacity = overlayBlend.Opacity;


                if (currentMasterSlide != null)
                {
                    foreach (Overlay overlay in currentMasterSlide.Overlays)
                    {
                        overlay.TweenFactor = 1f;
                        overlay.Draw3D(renderContext, false);
                    }
                }

                if (onTarget)
                {
                    foreach (Overlay overlay in tour.CurrentTourStop.Overlays)
                    {
                        if (overlay.Name.ToLowerCase() != "caption" || WWTControl.scriptInterface.ShowCaptions)
                        {
                            overlay.TweenFactor = (float)CameraParameters.EaseCurve(tour.CurrentTourStop.TweenPosition, overlay.InterpolationType == InterpolationType.DefaultV ? tour.CurrentTourStop.InterpolationType : overlay.InterpolationType);
                            overlay.Draw3D(renderContext, false);
                        }
                    }
                }
                else
                {
                    int i = 0;
                }
                renderContext.Restore();
            }
        }

        BlendState PlayerState = BlendState.Create(false, 2000);

        Date lastHit = Date.Now;

        TourDocument tour = null;

        public TourDocument Tour
        {
            get { return tour; }
            set { tour = value; }
        }

        static bool playing = false;

        static public bool Playing
        {
            get { return playing; }
            set { playing = value; }
        }

        bool onTarget = false;
        Date slideStartTime;
        TourStop currentMasterSlide = null;

        public void NextSlide()
        {
            if (tour.CurrentTourStop != null)
            {
                if (!tour.CurrentTourStop.MasterSlide)
                {
                    if (tour.CurrentTourStop.MusicTrack != null)
                    {
                        tour.CurrentTourStop.MusicTrack.Stop();
                    }

                    if (tour.CurrentTourStop.VoiceTrack != null)
                    {
                        tour.CurrentTourStop.VoiceTrack.Stop();
                    }

                    foreach (Overlay overlay in tour.CurrentTourStop.Overlays)
                    {
                        overlay.Stop();
                    }
                }
                else
                {
                    currentMasterSlide = tour.CurrentTourStop;
                }
            }

            if (tour.CurrentTourstopIndex < (tour.TourStops.Count - 1) || tour.CurrentTourStop.IsLinked)
            {
                if (tour.CurrentTourStop.EndTarget != null)
                {
                    WWTControl.Singleton.GotoTargetFull(false, true, tour.CurrentTourStop.EndTarget.CamParams, tour.CurrentTourStop.Target.StudyImageset, tour.CurrentTourStop.Target.BackgroundImageset);
                    WWTControl.Singleton.Mover = null;
                }
                onTarget = false;
                if (tour.CurrentTourStop.IsLinked)
                {
                    try
                    {
                        switch (tour.CurrentTourStop.NextSlide)
                        {
                            case "Return":
                                if (callStack.Count > 0)
                                {
                                    PlayFromTourstop(tour.TourStops[callStack.Pop()]);
                                }
                                else
                                {
                                    tour.CurrentTourstopIndex = tour.TourStops.Count - 1;
                                }
                                break;
                            default:
                                PlayFromTourstop(tour.TourStops[tour.GetTourStopIndexByID(tour.CurrentTourStop.NextSlide)]);
                                break;
                        }
                    }
                    catch
                    {
                        if ((tour.CurrentTourstopIndex < (tour.TourStops.Count - 1)))
                        {
                            tour.CurrentTourstopIndex++;
                        }
                    }
                }
                else
                {
                    tour.CurrentTourstopIndex++;
                }

                if (currentMasterSlide != null && tour.CurrentTourStop.MasterSlide)
                {
                    StopCurrentMaster();
                }

                bool instant = false;
                switch (tour.CurrentTourStop.Transition)
                {
                    case TransitionType.Slew:
                        break;
                    case TransitionType.CrossFade:
                        instant = true;
                        break;
                    case TransitionType.CrossCut:
                        instant = true;
                        break;
                    case TransitionType.FadeOutIn:
                        instant = true;
                        break;
                    case TransitionType.FadeOut:
                        instant = true;
                        break;
                    case TransitionType.FadeIn:
                        instant = true;
                        break;
                    default:
                        break;
                }

                WWTControl.Singleton.GotoTarget(tour.CurrentTourStop.Target, false, instant, false);

                slideStartTime = Date.Now;
                // Move to new settings
                Settings.TourSettings = tour.CurrentTourStop;
                SpaceTimeController.Now = tour.CurrentTourStop.StartTime;
                SpaceTimeController.SyncToClock = false;
            }
            else
            {
                StopCurrentMaster();
                playing = false;
                if (Settings.Current.AutoRepeatTour)
                {
                    tour.CurrentTourstopIndex = -1;
                    Play();
                }
                else
                {
                    WWTControl.Singleton.FreezeView();
                    if (TourEnded != null)
                    {
                        TourEnded.Invoke(this, new EventArgs());
                    }

                    //ShowEndTourPopup();
                    WWTControl.Singleton.HideUI(false);
                    WWTControl.scriptInterface.FireTourEnded();
                }
            }

        }

        private void StopCurrentMaster()
        {
            if (currentMasterSlide != null)
            {
                if (currentMasterSlide.MusicTrack != null)
                {
                    currentMasterSlide.MusicTrack.Stop();
                }

                if (currentMasterSlide.VoiceTrack != null)
                {
                    currentMasterSlide.VoiceTrack.Stop();
                }

                foreach (Overlay overlay in currentMasterSlide.Overlays)
                {
                    overlay.Stop();
                }
                currentMasterSlide = null;
            }
        }

        static public event EventHandler TourEnded;
        static bool switchedToFullScreen = false;
        Stack<int> callStack = new Stack<int>();

        bool leaveSettingsWhenStopped = false;

        public bool LeaveSettingsWhenStopped {
            get { return leaveSettingsWhenStopped; }
            set { leaveSettingsWhenStopped = value; }
        }

        public void Play()
        {
            if (tour == null)
            {
                return;
            }

            if (playing)
            {
                Stop(true);
            }
            else
            {
                playing = true;
                //switchedToFullScreen = !Viewer.MasterView.FullScreen;
                //if (switchedToFullScreen)
                //{
                //    Viewer.MasterView.ShowFullScreen(true);

                //}
            }
            WWTControl.Singleton.HideUI(true);

            playing = true;

            if (tour.TourStops.Count > 0)
            {
                onTarget = false;

                if (tour.CurrentTourstopIndex == -1)
                {
                    tour.CurrentTourStop = tour.TourStops[0];
                }

                // Ensure that all multimedia elements are prepared. When
                // playing back a tour in a browser, restrictions on autoplay
                // mean that we have to ensure that all of our multimedia
                // elements are prepared for playback inside code that is
                // triggered by a user-initiated event. The PrepMultimedia
                // callback should do whatever's needed to make sure that media
                // files are all ready to go.

                foreach (TourStop stop in tour.TourStops)
                {
                    if (stop.MusicTrack != null)
                        stop.MusicTrack.PrepMultimedia();

                    if (stop.VoiceTrack != null)
                        stop.VoiceTrack.PrepMultimedia();

                    foreach (Overlay overlay in stop.Overlays)
                    {
                        overlay.PrepMultimedia();
                    }
                }

                if (tour.CurrentTourstopIndex > 0)
                {
                    PlayMasterForCurrent();
                }

                WWTControl.Singleton.GotoTarget(tour.CurrentTourStop.Target, false, true, false);
            }

            slideStartTime = Date.Now;
            playing = true;
        }

        private void PlayMasterForCurrent()
        {
            if (!tour.CurrentTourStop.MasterSlide)
            {
                MasterTime currentMaster = tour.ElapsedTimeSinceLastMaster(tour.CurrentTourstopIndex);

                if (currentMaster != null && currentMasterSlide != null)
                {
                    double elapsed = currentMaster.Duration;
                    currentMasterSlide = currentMaster.Master;

                    if (currentMasterSlide.MusicTrack != null)
                    {
                        currentMasterSlide.MusicTrack.Play();
                        currentMasterSlide.MusicTrack.Seek(elapsed);
                    }

                    if (currentMasterSlide.VoiceTrack != null)
                    {
                        currentMasterSlide.VoiceTrack.Play();
                        currentMasterSlide.VoiceTrack.Seek(elapsed);
                    }

                    foreach (Overlay overlay in currentMasterSlide.Overlays)
                    {
                        overlay.Play();
                        overlay.Seek(elapsed);
                    }
                }
            }
        }

        public static bool NoRestoreUIOnStop;

        public void Stop(bool noSwitchBackFullScreen)
        {
            if (switchedToFullScreen && !noSwitchBackFullScreen)
            {
               // Viewer.MasterView.ShowFullScreen(false);
            }

            // By default, when you stop (or pause) a tour, the main WWT
            // settings become active again. However, this can cause a jarring
            // jump if, say, the tour has localHorizonMode active and the main
            // settings don't. If you activate this option, we'll leave the tour
            // settings lingering, preventing any dramatic changes.
            if (!leaveSettingsWhenStopped) {
                Settings.TourSettings = null;
            }

            playing = false;
            if (tour.CurrentTourStop != null)
            {
                if (tour.CurrentTourStop.MusicTrack != null)
                {
                    tour.CurrentTourStop.MusicTrack.Stop();
                }

                if (tour.CurrentTourStop.VoiceTrack != null)
                {
                    tour.CurrentTourStop.VoiceTrack.Stop();
                }

                foreach (Overlay overlay in tour.CurrentTourStop.Overlays)
                {
                    overlay.Stop();
                }
            }
            if (currentMasterSlide != null)
            {
                if (currentMasterSlide.MusicTrack != null)
                {
                    currentMasterSlide.MusicTrack.Stop();
                }

                if (currentMasterSlide.VoiceTrack != null)
                {
                    currentMasterSlide.VoiceTrack.Stop();
                }

                foreach (Overlay overlay in currentMasterSlide.Overlays)
                {
                    overlay.Stop();
                }
            }

            WWTControl.Singleton.HideUI(NoRestoreUIOnStop);
			WWTControl.scriptInterface.FireTourEnded();
        }

        public void UpdateSlideStates()
        {
            bool slideChanging = false;

            int slideElapsedTime = Date.Now - slideStartTime;

            if (slideElapsedTime > tour.CurrentTourStop.Duration && playing)
            {
                NextSlide();
                slideChanging = true;
            }

            slideElapsedTime = Date.Now - slideStartTime;

            if (tour.CurrentTourStop != null)
            {
                tour.CurrentTourStop.TweenPosition = Math.Min(1, (float)(slideElapsedTime / tour.CurrentTourStop.Duration));
            }

            if (tour.CurrentTourStop != null)
            {
                tour.CurrentTourStop.FaderOpacity = 0;
                //Tile.fastLoad = false;
                double elapsedSeconds = tour.CurrentTourStop.TweenPosition * tour.CurrentTourStop.Duration / 1000;

                //Document.Title = elapsedSeconds.ToString();
                if (slideChanging)
                {
                    WWTControl.Singleton.CrossFadeFrame = false;
                }

                switch (tour.CurrentTourStop.Transition)
                {
                    case TransitionType.Slew:
                        tour.CurrentTourStop.FaderOpacity = 0;
                        WWTControl.Singleton.CrossFadeFrame = false;
                        break;
                    case TransitionType.CrossCut:
                        {
                            if (slideChanging)
                            {
                                //Tile.fastLoad = true;
                                //Tile.fastLoadAutoReset = false;
                            }
                            if (elapsedSeconds < (elapsedSeconds - tour.CurrentTourStop.TransitionHoldTime))
                            {
                                WWTControl.Singleton.CrossFadeFrame = true;
                                tour.CurrentTourStop.FaderOpacity = 1;

                            }
                            else
                            {
                                tour.CurrentTourStop.FaderOpacity = 0;
                                WWTControl.Singleton.CrossFadeFrame = false;
                            }
                        }
                        break;
                    case TransitionType.CrossFade:
                        {
                            WWTControl.Singleton.CrossFadeFrame = true;
                            double opacity = Math.Max(0, 1 - Math.Min(1, (elapsedSeconds - tour.CurrentTourStop.TransitionHoldTime) / tour.CurrentTourStop.TransitionTime));
                            tour.CurrentTourStop.FaderOpacity = (float)opacity;
                            if (slideChanging)
                            {
                                //Tile.fastLoad = true;
                                //Tile.fastLoadAutoReset = false;
                            }
                        }
                        break;
                    case TransitionType.FadeOutIn:
                    case TransitionType.FadeIn:
                        {
                            WWTControl.Singleton.CrossFadeFrame = false;
                            double opacity = Math.Max(0, 1 -  Math.Max(0, elapsedSeconds - tour.CurrentTourStop.TransitionHoldTime) / tour.CurrentTourStop.TransitionTime);
                            tour.CurrentTourStop.FaderOpacity = (float)opacity;
                        }
                        break;
                    case TransitionType.FadeOut:
                        WWTControl.Singleton.CrossFadeFrame = false;
                        break;

                    default:
                        break;
                }

                if (!tour.CurrentTourStop.IsLinked && tour.CurrentTourstopIndex < (tour.TourStops.Count - 1))
                {
                    TransitionType nextTrans = tour.TourStops[tour.CurrentTourstopIndex + 1].Transition;
                    double nextTransTime = tour.TourStops[tour.CurrentTourstopIndex + 1].TransitionOutTime;


                    switch (nextTrans)
                    {

                        case TransitionType.FadeOut:
                        case TransitionType.FadeOutIn:
                            {
                                if (tour.CurrentTourStop.FaderOpacity == 0)
                                {
                                    WWTControl.Singleton.CrossFadeFrame = false;
                                    double opacity = Math.Max(0, 1 - Math.Min(1, ((tour.CurrentTourStop.Duration/1000) - elapsedSeconds) / nextTransTime));
                                    tour.CurrentTourStop.FaderOpacity = (float)opacity;
                                }
                            }
                            break;

                        default:
                            break;
                    }
                }
            }
        }

        public float UpdateTweenPosition(float tween)
        {
            float slideElapsedTime = Date.Now - slideStartTime;

            if (tween > -1)
            {
                return tour.CurrentTourStop.TweenPosition = Math.Min(1, tween);
            }
            else
            {
                return tour.CurrentTourStop.TweenPosition = Math.Min(1, (float)(slideElapsedTime / tour.CurrentTourStop.Duration));
            }
        }

        public void Close()
        {
            if (tour != null)
            {
                if (Playing)
                {
                    Stop(switchedToFullScreen);
                }
                // todo check for changes
                tour = null;
            }
        }

        public bool MouseDown(object sender, ElementEvent e)
        {
            // todo enable links
            Vector2d location;

            location = PointToView(Vector2d.Create(e.OffsetX, e.OffsetY));

            if (tour == null || tour.CurrentTourStop == null)
            {
                return false;
            }

            for (int i = tour.CurrentTourStop.Overlays.Count - 1; i >= 0; i--)
            {
                if (tour.CurrentTourStop.Overlays[i].HitTest(location))
                {
                    if (!string.IsNullOrEmpty(tour.CurrentTourStop.Overlays[i].Url))
                    {
                        Overlay linkItem = tour.CurrentTourStop.Overlays[i];
                        Util.OpenUrl(linkItem.Url);
                        return true;
                    }

                    if (!string.IsNullOrEmpty(tour.CurrentTourStop.Overlays[i].LinkID))
                    {
                        callStack.Push(tour.CurrentTourstopIndex);
                        PlayFromTourstop(tour.TourStops[tour.GetTourStopIndexByID(tour.CurrentTourStop.Overlays[i].LinkID)]);
                        return true;
                    }
                }
            }

            // This toggle relates to the built-in tour navigation UI, which
            // is now taken care of at a higher level.
            if (!PlayerState.State)
            {
                PlayerState.TargetState = true;
            }

            return false;
        }

        public bool MouseUp(object sender, ElementEvent e)
        {
            return false;
        }

        public bool MouseMove(object sender, ElementEvent e)
        {
            // todo enable links
            Vector2d location;

            try
            {
                location = PointToView(Vector2d.Create(e.OffsetX, e.OffsetY));
            }
            catch
            {
                return false;
            }

            if (tour == null || tour.CurrentTourStop == null)
            {
                return false;
            }

            for (int i = tour.CurrentTourStop.Overlays.Count - 1; i >= 0; i--)
            {
                if (tour.CurrentTourStop.Overlays[i].HitTest(location) && (!string.IsNullOrEmpty(tour.CurrentTourStop.Overlays[i].Url) || !string.IsNullOrEmpty(tour.CurrentTourStop.Overlays[i].LinkID)))
                {
                    //todo change cursor to hand
                    return true;
                }
            }

            //todo set cursor to default
            //Viewer.MasterView.Cursor = null;
            return false;
        }

        public bool MouseClick(object sender, ElementEvent e)
        {
            return false;
        }

        public bool Click(object sender, ElementEvent e)
        {
            return false;
        }

        public bool MouseDoubleClick(object sender, ElementEvent e)
        {
            return false;
        }

        public bool KeyDown(object sender, ElementEvent e)
        {
            switch (e.KeyCode)
            {
                case 27: // escape
                    Stop(switchedToFullScreen);
                    WWTControl.Singleton.CloseTour();
                    return true;

                case 32: // spacebar
                    PauseTour();
                    return true;

                case 39: // right arrow
                    PlayNextSlide();
                    return true;

                case 37: // left arrow
                    PlayPreviousSlide();
                    return true;

                case 35: // end key
                    if (tour.TourStops.Count > 0)
                    {
                        PlayFromTourstop(tour.TourStops[tour.TourStops.Count - 1]);
                    }
                    return true;

                case 36: // home key
                    if (tour.TourStops.Count > 0)
                    {
                        PlayFromTourstop(tour.TourStops[0]);
                    }
                    return true;
            }

            return false;
        }

        private void PlayNextSlide()
        {
            if ((tour.CurrentTourstopIndex < tour.TourStops.Count - 1) && tour.TourStops.Count > 0)
            {
                PlayFromTourstop(tour.TourStops[tour.CurrentTourstopIndex + 1]);
            }
        }

        private void PlayPreviousSlide()
        {
            if (tour.CurrentTourstopIndex > 0)
            {
                PlayFromTourstop(tour.TourStops[tour.CurrentTourstopIndex - 1]);
            }
        }

        public void PlayFromTourstop(TourStop tourStop)
        {
            Stop(true);
            tour.CurrentTourStop = tourStop;
            WWTControl.Singleton.GotoTarget(tour.CurrentTourStop.Target, false, true, false);
            SpaceTimeController.Now = tour.CurrentTourStop.StartTime;
            SpaceTimeController.SyncToClock = false;
            Play();
        }

        public void PauseTour()
        {
            if (playing)
            {
                Stop(switchedToFullScreen);
                WWTControl.Singleton.FreezeView();
				WWTControl.scriptInterface.FireTourPaused();
            }
            else
            {
                Play();
				WWTControl.scriptInterface.FireTourResume();
            }
        }

        public bool KeyUp(object sender, ElementEvent e)
        {
            return false;
        }

        public bool Hover(Vector2d pnt)
        {
            if (playing)
            {
                return true;
            }
            return false;
        }

        public Vector2d PointToView(Vector2d pnt)
        {
            double clientHeight = WWTControl.Singleton.Canvas.Height;
            double clientWidth = WWTControl.Singleton.Canvas.Width;
            double viewWidth = (clientWidth / clientHeight) * 1116f;
            double x = (((double)pnt.X) / ((double)clientWidth) * viewWidth) - ((viewWidth - 1920) / 2);
            double y = ((double)pnt.Y) / clientHeight * 1116;
            return Vector2d.Create(x, y);
        }
    }

    public class MasterTime
    {
        public TourStop Master;
        public double Duration;

        public MasterTime(TourStop master, double duration)
        {
            Master = master;
            Duration = duration;
        }
    }
}
