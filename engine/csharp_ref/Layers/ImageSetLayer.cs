using System;
using System.Collections.Generic;
using System.Linq;
using System.Html;
using System.Xml;
using System.Html.Services;
using System.Html.Media.Graphics;

namespace wwtlib
{
    public class ImageSetLayer : Layer
    {
        Imageset imageSet = null;

        public Imageset ImageSet
        {
            get { return imageSet; }
            set { imageSet = value; }
        }

        string extension = ".txt";

        public ImageSetLayer()
        {
        }

        public static ImageSetLayer Create(Imageset set)
        {
            ImageSetLayer isl = new ImageSetLayer();
            isl.imageSet = set;
            return isl;
        }

        bool overrideDefaultLayer = false;

        public bool OverrideDefaultLayer
        {
            get { return overrideDefaultLayer; }
            set { overrideDefaultLayer = value; }
        }

        public FitsImage GetFitsImage()
        {
            return imageSet.WcsImage as FitsImage;
        }

        // Test whether our underlying imagery is FITS based.
        //
        // This can come in two flavors: a single FITS image, or tiled FITS.
        // Note that even though the FileType/Extension field can currently
        // specify multiple file formats, the rendering code requires that the
        // extension is exactly ".fits" for FITS rendering to kick in.
        bool IsFitsImageset() {
            bool hasFitsExt = imageSet.Extension == ".fits";
            return imageSet.WcsImage is FitsImage || (imageSet.WcsImage == null && hasFitsExt);
        }

        public override void InitializeFromXml(XmlNode node)
        {
            XmlNode imageSetNode = Util.SelectSingleNode(node, "ImageSet");

            imageSet = Imageset.FromXMLNode(imageSetNode);


            if (node.Attributes.GetNamedItem("Extension") != null)
            {
                extension = node.Attributes.GetNamedItem("Extension").Value;
            }

            if (node.Attributes.GetNamedItem("ScaleType") != null)
            {
                ImageSet.FitsProperties.ScaleType = (ScaleTypes)Enums.Parse("ScaleTypes", node.Attributes.GetNamedItem("ScaleType").Value);
            }

            if (node.Attributes.GetNamedItem("MinValue") != null)
            {
                ImageSet.FitsProperties.MinVal = double.Parse(node.Attributes.GetNamedItem("MinValue").Value);
                ImageSet.FitsProperties.LowerCut = node.Attributes.GetNamedItem("LowerCut") != null
                    ? double.Parse(node.Attributes.GetNamedItem("LowerCut").Value) : ImageSet.FitsProperties.MinVal;
            }

            if (node.Attributes.GetNamedItem("MaxValue") != null)
            {
                ImageSet.FitsProperties.MaxVal = double.Parse(node.Attributes.GetNamedItem("MaxValue").Value);
                ImageSet.FitsProperties.UpperCut = node.Attributes.GetNamedItem("UpperCut") != null
                    ? double.Parse(node.Attributes.GetNamedItem("UpperCut").Value) : ImageSet.FitsProperties.MaxVal;
            }

            if (node.Attributes.GetNamedItem("ColorMapperName") != null)
            {
                ImageSet.FitsProperties.ColorMapName = node.Attributes.GetNamedItem("ColorMapperName").Value;
            }

            if (node.Attributes.GetNamedItem("OverrideDefault") != null)
            {
                overrideDefaultLayer = bool.Parse(node.Attributes.GetNamedItem("OverrideDefault").Value);
            }

        }

        bool loaded = false;
        public override bool Draw(RenderContext renderContext, float opacity, bool flat)
        {
            if (!loaded)
            {
                return false;
            }
            //if (!flat)
            //{
            //    renderContext.setRasterizerState(TriangleCullMode.CullClockwise);
            //}
            renderContext.WorldBase = renderContext.World;
            renderContext.ViewBase = renderContext.View;
            renderContext.MakeFrustum();
            renderContext.DrawImageSet(imageSet, this.Opacity * opacity * 100);
            return true;

        }

        public override void WriteLayerProperties(XmlTextWriter xmlWriter)
        {
            if (imageSet.WcsImage != null)
            {
                if (IsFitsImageset())
                {
                    extension = ".fit";
                }
                else
                {
                    extension = ".png";
                }

                xmlWriter.WriteAttributeString("Extension", extension);
            }

            if (IsFitsImageset())
            {
                xmlWriter.WriteAttributeString("ScaleType", Enums.ToXml("ScaleTypes", (int)imageSet.FitsProperties.ScaleType));
                xmlWriter.WriteAttributeString("MinValue", imageSet.FitsProperties.MinVal.ToString());
                xmlWriter.WriteAttributeString("MaxValue", imageSet.FitsProperties.MaxVal.ToString());
                xmlWriter.WriteAttributeString("LowerCut", imageSet.FitsProperties.LowerCut.ToString());
                xmlWriter.WriteAttributeString("UpperCut", imageSet.FitsProperties.UpperCut.ToString());

                if (imageSet.FitsProperties.ColorMapName != null) {
                    xmlWriter.WriteAttributeString("ColorMapperName", imageSet.FitsProperties.ColorMapName);
                }
            }

            xmlWriter.WriteAttributeString("OverrideDefault", overrideDefaultLayer.ToString());

            Imageset.SaveToXml(xmlWriter, imageSet, "");
            base.WriteLayerProperties(xmlWriter);
        }

        public override string GetTypeName()
        {
            return "TerraViewer.ImageSetLayer";
        }

        public override void CleanUp()
        {
            base.CleanUp();
        }

        public override void AddFilesToCabinet(FileCabinet fc)
        {
            if (imageSet.WcsImage is FitsImage)
            {
                string fName = ((WcsImage)imageSet.WcsImage).Filename;
                string fileName = fc.TempDirectory + string.Format("{0}\\{1}{2}", fc.PackageID, this.ID.ToString(), extension);
                fc.AddFile(fileName, ((FitsImage)imageSet.WcsImage).sourceBlob);
            }
        }

        public override string[] GetParamNames()
        {
            return base.GetParamNames();
        }

        public override double[] GetParams()
        {
            return base.GetParams();
        }

        public override void SetParams(double[] paramList)
        {
            base.SetParams(paramList);
        }

        public void SetImageScale(ScaleTypes scaleType, double min, double max)
        {
            Script.Literal("console.warn('SetImageScale is considered deprecated. Use setImageScaleRaw or setImageScalePhysical instead.')");
            SetImageScaleRaw(scaleType, min, max);
        }

        public void SetImageScaleRaw(ScaleTypes scaleType, double min, double max)
        {
            ImageSet.FitsProperties.LowerCut = min;
            ImageSet.FitsProperties.UpperCut = max;
            ImageSet.FitsProperties.ScaleType = scaleType;

            if (imageSet.WcsImage is FitsImageJs)
            {
                Histogram.UpdateScale(this, scaleType, min, max);
            }
        }

        public void SetImageScalePhysical(ScaleTypes scaleType, double min, double max)
        {
            double newMin = min;
            double newMax = max;

            if (IsFitsImageset())
            {
                newMin = (newMin - imageSet.FitsProperties.BZero) / imageSet.FitsProperties.BScale;
                newMax = (newMax - imageSet.FitsProperties.BZero) / imageSet.FitsProperties.BScale;
            }

            SetImageScaleRaw(scaleType, newMin, newMax);
        }

        public void SetImageZ(double z)
        {
            if (IsFitsImageset())
            {
                Histogram.UpdateImage(this, z);
            }
        }

        public string ColorMapperName
        {
            get {
                return ImageSet.FitsProperties.ColorMapName; }
            set
            {
                if (ColorMapContainer.FromNamedColormap(value) == null)
                    throw new Exception("Invalid colormap name");

                version++;

                if (IsFitsImageset())
                {
                    if (RenderContext.UseGlVersion2)
                    {
                        imageSet.FitsProperties.ColorMapName = value;
                    }
                    else
                    {
                        Histogram.UpdateColorMapper(this, value);
                    }
                }
            }
        }

        public ColorMapContainer ColorMapper
        {
            get
            {
                if (ImageSet.FitsProperties.ColorMapName == null) {
                    return null;
                } else {
                    return ColorMapContainer.FromNamedColormap(ImageSet.FitsProperties.ColorMapName);
                }
            }
        }

        public override void LoadData(TourDocument tourDoc, string filename)
        {
            if (extension.ToLowerCase().StartsWith(".fit"))
            {
                System.Html.Data.Files.Blob blob = tourDoc.GetFileBlob(filename.Replace(".txt", extension));
                FitsImage fi;

                if (RenderContext.UseGlVersion2)
                {
                    fi = new FitsImage(imageSet, "image.fit", blob, DoneLoading);
                }
                else
                {
                    fi = new FitsImageJs(imageSet, "image.fit", blob, DoneLoading);
                }

                imageSet.WcsImage = fi;
            }
            else
            {
                loaded = true;
            }

        }

        public void DoneLoading(WcsImage wcsImage)
        {
             loaded = true;
        }
    }
}
