using System;
using System.Collections.Generic;
using System.Linq;
using System.Html;
using System.Xml;
using System.Html.Services;
using System.Html.Media.Graphics;


namespace wwtlib
{
    enum DragType { Low=0, High=1, Range=2, Center=3, None=4 };
    public class Histogram
    {
        public Histogram()
        {

        }

        public FitsImage image = null;
        public ImageSetLayer layer = null;
        public SkyImageTile tile = null;
        SelectElement dropDown = null;

        public void Close(ElementEvent e)
        {

            DivElement menu = Document.GetElementById<DivElement>("histogram");
            DivElement closeBtn = Document.GetElementById<DivElement>("histogramClose");
            menu.Style.Display = "none";
            Window.RemoveEventListener("click", Close, true);

            ImageElement image = Document.GetElementById<ImageElement>("graph");
            image.RemoveEventListener("mousedown", OnPointerDown, false);
            image.RemoveEventListener("mousemove", OnPointerMove, false);
            image.RemoveEventListener("mouseup", OnPointerUp, false);
            dropDown.RemoveEventListener("change", CurveStyleSelected, false);
            dropDown.RemoveEventListener("click", IgnoreMe, true);

        }


        public void Show(Vector2d position)
        {
            tile = (SkyImageTile)TileCache.GetTile(0, 0, 0, layer.ImageSet, null);

            DivElement picker = Document.GetElementById<DivElement>("histogram");
            DivElement closeBtn = Document.GetElementById<DivElement>("histogramClose");
            /////////////picker.ClassName = "histogram";
            picker.Style.Display = "block";
            picker.Style.Left = position.X.ToString() + "px";
            picker.Style.Top = position.Y.ToString() + "px";

            SelectedCurveStyle = (int)layer.ImageSet.FitsProperties.ScaleType;

            
            dropDown = Document.GetElementById<SelectElement>("ScaleTypePicker");

            dropDown.AddEventListener("change", CurveStyleSelected, false);
            dropDown.AddEventListener("click", IgnoreMe, true);
            CanvasElement canvas = Document.GetElementById<CanvasElement>("graph");

            canvas.AddEventListener("pointerdown", OnPointerDown, false);
            canvas.AddEventListener("pointermove", OnPointerMove, false);
            canvas.AddEventListener("pointerup", OnPointerUp, false);
            closeBtn.AddEventListener("click", Close, true);

            Draw();
        }

        public static void UpdateImage(ImageSetLayer isl, double z)
        {
            if (!RenderContext.UseGlVersion2)
            {
                FitsImageJs image = isl.ImageSet.WcsImage as FitsImageJs;
                SkyImageTile Tile = (SkyImageTile)TileCache.GetTile(0, 0, 0, isl.ImageSet, null);
                Tile.texture2d = image.GetBitmap().GetTexture();
            }
        }

        public static void UpdateScale(ImageSetLayer isl, ScaleTypes scale, double low, double hi)
        {
            isl.ImageSet.FitsProperties.ScaleType = scale;
            isl.ImageSet.FitsProperties.LowerCut = low;
            isl.ImageSet.FitsProperties.UpperCut = hi;
            if (!RenderContext.UseGlVersion2)
            {
                FitsImageJs image = isl.ImageSet.WcsImage as FitsImageJs;
                SkyImageTile Tile = (SkyImageTile)TileCache.GetTile(0, 0, 0, isl.ImageSet, null);
                Tile.texture2d = image.GetBitmap().GetTexture();
            }
        }

        public static void UpdateColorMapper(ImageSetLayer isl, string colorMapperName)
        {
            isl.ImageSet.FitsProperties.ColorMapName = colorMapperName;
            if (!RenderContext.UseGlVersion2)
            {
                FitsImageJs image = isl.ImageSet.WcsImage as FitsImageJs;
                SkyImageTile Tile = (SkyImageTile)TileCache.GetTile(0, 0, 0, isl.ImageSet, null);
                Tile.texture2d = image.GetBitmap().GetTexture();
            }
        }
        
        public void IgnoreMe(ElementEvent e)
        {
            ignoreNextClick = true;
        }

        public void CurveStyleSelected(ElementEvent e)
        {
            SelectedCurveStyle = dropDown.SelectedIndex;
            SetUpdateTimer();
            layer.ImageSet.FitsProperties.ScaleType = (ScaleTypes)SelectedCurveStyle;
            Draw();
            ignoreNextClick = true;
        }

        int downPosition = 0;
        int lowPosition = 0;
        int highPosition = 255;
        int center = 127;
        bool ignoreNextClick = false;

        DragType dragType = DragType.None;

        public void OnPointerDown(ElementEvent e)
        {
            CanvasElement canvas = Document.GetElementById<CanvasElement>("graph");
            int x = Mouse.OffsetX(canvas, e);
            int y = Mouse.OffsetY(canvas, e);
            Script.Literal("{0}.setPointerCapture({1}.pointerId)", canvas, e);

            if ((Math.Abs(x - center) < 10) && Math.Abs(y - 75) < 10)
            {
                dragType = DragType.Center;
            }
            else if (Math.Abs(x - lowPosition) < 10)
            {
                dragType = DragType.Low;
            }
            else if (Math.Abs(x - highPosition) < 10)
            {
                dragType = DragType.High;
            }
            else
            {
                dragType = DragType.Range;
                downPosition = Math.Min(255, Math.Max(0, x));

                Draw();
            }
            e.CancelBubble = true;
        }

        public void OnPointerMove(ElementEvent e)
        {
            CanvasElement canvas = Document.GetElementById<CanvasElement>("graph");
            int x = Mouse.OffsetX(canvas, e);
            int y = Mouse.OffsetY(canvas, e);
            switch (dragType)
            {
                case DragType.Low:
                    lowPosition = Math.Min(255, Math.Max(0, x));
                    break;
                case DragType.High:
                    highPosition = Math.Min(255, Math.Max(0, x));
                    break;
                case DragType.Range:
                    lowPosition = downPosition;
                    highPosition = Math.Min(255, Math.Max(0, x));
                    break;
                case DragType.Center:
                    int hWidth = Math.Abs(highPosition - lowPosition) / 2;
                    int adCenter = Math.Min(255 - hWidth, Math.Max(hWidth, x));
                    int moved = center - adCenter;
                    lowPosition -= moved;
                    highPosition -= moved;
                    break;
                case DragType.None:
                    return;
                default:
                    break;
            }
            center = (lowPosition + highPosition) / 2;
            Draw();
            double factor = (layer.ImageSet.FitsProperties.MaxVal - layer.ImageSet.FitsProperties.MinVal) / 256.0;
            double low = layer.ImageSet.FitsProperties.MinVal + (lowPosition * factor);
            double hi = layer.ImageSet.FitsProperties.MinVal + (highPosition * factor);

            SetUpdateTimer();

            layer.ImageSet.FitsProperties.UpperCut = hi;
            layer.ImageSet.FitsProperties.LowerCut = low;
            layer.ImageSet.FitsProperties.ScaleType = (ScaleTypes)SelectedCurveStyle;

            e.CancelBubble = true;
        }

        public void OnPointerUp(ElementEvent e)
        {
            Script.Literal("{0}.releasePointerCapture({1}.pointerId)", e.SrcElement, e);
            if (dragType != DragType.None)
            {
                dragType = DragType.None;
                SetUpdateTimer();
                ignoreNextClick = true;
            }
            e.CancelBubble = true;
        }

        bool updated = false;

        public void SetUpdateTimer()
        {
            if (!RenderContext.UseGlVersion2)
            {
                Script.SetTimeout(delegate () { Update(); }, 500);
                updated = false;
            }
        }

        public void Update()
        {
            if (updated)
            {
                return;
            }

            if (image is FitsImageJs)
            {
                double factor = (layer.ImageSet.FitsProperties.MaxVal - layer.ImageSet.FitsProperties.MinVal) / 256.0;
                double low = layer.ImageSet.FitsProperties.MinVal + (lowPosition * factor);
                double hi = layer.ImageSet.FitsProperties.MinVal + (highPosition * factor);
                tile.texture2d = ((FitsImageJs)image).GetScaledBitmap(low, hi, (ScaleTypes)SelectedCurveStyle, 0, null).GetTexture();
            }
            updated = true;
        }

        public int SelectedCurveStyle = 0;

        public void Draw()
        {
            CanvasElement canvas = Document.GetElementById<CanvasElement>("graph");
            CanvasContext2D ctx = (CanvasContext2D)canvas.GetContext(Rendering.Render2D);
            if (image != null)
            {
                image.DrawHistogram(ctx);
            }

            string red = "rgba(255,0,0,255)";
            string green = "rgba(0,255,0,255)";
            string blue = "rgba(0,0,255,255)";

            ctx.StrokeStyle = red;
            ctx.BeginPath();
            ctx.MoveTo(lowPosition, 0);
            ctx.LineTo(lowPosition, 150);
            
            ctx.Stroke();

            ctx.StrokeStyle = green;
            ctx.BeginPath();
            ctx.MoveTo(highPosition, 0);
            ctx.LineTo(highPosition, 150);
            ctx.Stroke();

            ctx.StrokeStyle = blue;
            ctx.BeginPath();
            ctx.Arc(center, 75, 10, 0, Math.PI * 2, false);
            ctx.ClosePath();
            ctx.Stroke();

        
            List<Vector2d> Curve = new List<Vector2d>();
            //todo get from combo box

            switch (SelectedCurveStyle)
            {
                case 0: // Linear
                    {
                        Curve.Clear();
                        Curve.Add(Vector2d.Create(lowPosition, 150));
                        Curve.Add(Vector2d.Create(highPosition, 0));
                        break;
                    }
                case 1: // Log
                    {
                        Curve.Clear();
                        double factor = 150 / Math.Log(255);
                        double diff = (highPosition - lowPosition);
                        int jump = diff < 0 ? -1 : 1;
                        double step = Math.Abs(256.0 / (diff == 0 ? .000001 : diff));
                        double val = .000001;
                        for (int i = lowPosition; i != highPosition; i += jump)
                        {
                            Curve.Add(Vector2d.Create((float)i, (float)(150 - (Math.Log(val) * factor))));
                            val += step;
                        }
                    }
                    break;
                case 2: // Power 2
                    {
                        Curve.Clear();
                        double factor = 150 / Math.Pow(255, 2);
                        double diff = (highPosition - lowPosition);
                        int jump = diff < 0 ? -1 : 1;
                        double step = Math.Abs(256.0 / (diff == 0 ? .000001 : diff));
                        double val = .000001;
                        for (int i = lowPosition; i != highPosition; i += jump)
                        {
                            Curve.Add(Vector2d.Create((float)i, (float)(150 - (Math.Pow(val, 2) * factor))));
                            val += step;
                        }
                    }

                    break;
                case 3: // Square Root
                    {
                        Curve.Clear();
                        double factor = 150 / Math.Sqrt(255);
                        double diff = (highPosition - lowPosition);
                        int jump = diff < 0 ? -1 : 1;
                        double step = Math.Abs(256.0 / (diff == 0 ? .000001 : diff));
                        double val = .000001;
                        for (int i = lowPosition; i != highPosition; i += jump)
                        {
                            Curve.Add(Vector2d.Create((float)i, (float)(150 - (Math.Sqrt(val) * factor))));
                            val += step;
                        }
                    }

                    break;
            }

            if (Curve.Count > 1)
            {
                ctx.BeginPath();
                ctx.StrokeStyle = blue;
                ctx.MoveTo(Curve[0].X, Curve[0].Y);

                for(int i = 1; i < Curve.Count; i++)
                {
                    ctx.LineTo(Curve[i].X, Curve[i].Y);
                }
                ctx.Stroke();
            }
        }
    }
}
