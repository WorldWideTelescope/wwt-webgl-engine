using System;
using System.Collections.Generic;
using System.Linq;
using System.Xml;
using System.Html;

namespace wwtlib
{
    public class Imageset :  IThumbnail
    {
        // This is probably an `object` and not `WcsImage` for historical reasons?
        private object wcsImage;

        public object WcsImage
        {
            get { return wcsImage; }
            set { wcsImage = value; }
        }

        public static string GetTileKey(Imageset imageset, int level, int x, int y, Tile parent)
        {
            if (imageset.Projection == ProjectionType.Healpix && parent != null)
            {
                int ipix = ((HealpixTile)parent).ipix * 4 + y * 2 + x;
                return imageset.ImageSetID.ToString() + @"\" + level.ToString() + @"\" + ipix.ToString();
            }
            return imageset.ImageSetID.ToString() + @"\" + level.ToString() + @"\" + y.ToString() + "_" + x.ToString();
        }

        public static Tile GetNewTile(Imageset imageset, int level, int x, int y, Tile parent)
        {

            switch (imageset.Projection)
            {
                case ProjectionType.Mercator:
                    {
                        MercatorTile newTile = MercatorTile.Create(level, x, y, imageset, parent);
                        return newTile;
                    }
                case ProjectionType.Equirectangular:
                    {
                        return EquirectangularTile.Create(level, x, y, imageset, parent);
                    }
                //case ProjectionType.Spherical:
                //    {
                //        return new SphericalTile(level, x, y, imageset, parent);
                //    }
                default:
                case ProjectionType.Toast:
                    {
                        return ToastTile.Create(level, x, y, imageset, parent);
                    }
                case ProjectionType.SkyImage:
                    {
                        return new SkyImageTile(level, x, y, imageset, parent);
                    }
                case ProjectionType.Plotted:
                    {
                        return PlotTile.Create(level, x, y, imageset, parent);
                    }
                case ProjectionType.Healpix:
                    {
                        if (imageset.HipsProperties == null)
                        {
                            imageset.HipsProperties = new HipsProperties(imageset);
                        }
                        if (imageset.HipsProperties.DownloadComplete)
                        {
                            return new HealpixTile(level, x, y, imageset, parent);
                        } else
                        {
                            return null;
                        }
                    }

                case ProjectionType.Tangent:
                    {
                        TangentTile newTile = new TangentTile(level, x, y, imageset, parent);
                        return newTile;
                    }
            }

        }

        ProjectionType projection;

        public ProjectionType Projection
        {
            get { return projection; }
            set { projection = value; }
        }

        private string referenceFrame;

        public string ReferenceFrame
        {
            get
            {
                return referenceFrame;
            }
            set
            {
                referenceFrame = value;
            }
        }

        int imageSetID;
        public int ImageSetID
        {
            get
            {
                return imageSetID;
            }
            set
            {
                imageSetID = value;
            }
        }

        double baseTileDegrees;
        public double BaseTileDegrees
        {
            get
            {
                return baseTileDegrees;
            }
            set
            {
                baseTileDegrees = value;
            }
        }

        double widthFactor = 1;

        public double WidthFactor
        {
            get { return widthFactor; }
            set { widthFactor = value; }
        }

        public int GetHashCode()
        {

            return Util.GetHashCode(Url);
        }

        protected string url;
        public string Url
        {
            get
            {
                return url;
            }
            set
            {
                url = value;
            }
        }

        protected string demUrl = "";
        public string DemUrl
        {
            get
            {
                if (String.IsNullOrEmpty(demUrl) && projection == ProjectionType.Mercator)
                {
                    return URLHelpers.singleton.coreStaticUrl("wwtweb/BingDemTile.aspx?Q={0},{1},{2}");
                }
                return demUrl;
            }
            set
            {
                demUrl = value;
            }
        }

        string extension;
        public string Extension
        {
            get
            {
                return extension;
            }
            set
            {
                extension = value;
            }
        }

        int levels;
        public int Levels
        {
            get
            {
                return levels;
            }
            set
            {
                levels = value;
            }
        }
        bool mercator;
        bool bottomsUp;

        public bool BottomsUp
        {
            get { return bottomsUp; }
            set { bottomsUp = value; }
        }

        public bool Mercator
        {
            get { return mercator; }
            set { mercator = value; }
        }
        //private int tileSize = 256;

        //public int TileSize
        //{
        //    get { return tileSize; }
        //    set { tileSize = value; }
        //}
        int baseLevel = 1;

        public int BaseLevel
        {
            get { return baseLevel; }
            set { baseLevel = value; }
        }

        string quadTreeTileMap = "0123";

        public string QuadTreeTileMap
        {
            get { return quadTreeTileMap; }
            set { quadTreeTileMap = value; }
        }
        double centerX = 0;

        public double CenterX
        {
            get { return centerX; }
            set
            {
                if (centerX != value)
                {
                    centerX = value;
                    ComputeMatrix();
                }
            }
        }
        double centerY = 0;

        public double CenterY
        {
            get { return centerY; }
            set
            {
                if (centerY != value)
                {
                    centerY = value;
                    ComputeMatrix();
                }
            }
        }
        double rotation = 0;

        public double Rotation
        {
            get { return rotation; }
            set
            {
                if (rotation != value)
                {
                    rotation = value;
                    ComputeMatrix();
                }
            }
        }

        private double meanRadius;

        public double MeanRadius
        {
            get { return meanRadius; }
            set { meanRadius = value; }
        }


        ImageSetType dataSetType = ImageSetType.Earth;
        BandPass bandPass = BandPass.Visible;

        public BandPass BandPass
        {
            get { return bandPass; }
            set { bandPass = value; }
        }

        public ImageSetType DataSetType
        {
            get { return dataSetType; }
            set { dataSetType = value; }
        }
        /*
                             node.Attributes.GetNamedItem("").Value,
                            Convert.ToDouble(node.Attributes.GetNamedItem("").Value),
                            Convert.ToInt32(node.Attributes.GetNamedItem("").Value),


         * */
        string altUrl = "";

        public string AltUrl
        {
            get { return altUrl; }
            set { altUrl = value; }
        }
        bool singleImage = false;

        public bool SingleImage
        {
            get { return singleImage; }
            set { singleImage = value; }
        }

        HipsProperties hipsProperties;

        public HipsProperties HipsProperties
        {
            get { return hipsProperties; }
            set { hipsProperties = value; }
        }

        FitsProperties fitsProperties = new FitsProperties();

        public FitsProperties FitsProperties
        {
            get { return fitsProperties; }
            set { fitsProperties = value; }
        }

        public static Imageset FromXMLNode(XmlNode node)
        {
            try
            {
                ImageSetType type = ImageSetType.Sky;

                ProjectionType projection = ProjectionType.Tangent;

                if (node.Attributes.GetNamedItem("DataSetType") != null)
                {
                    type = (ImageSetType)Enums.Parse("ImageSetType", node.Attributes.GetNamedItem("DataSetType").Value);
                }

                BandPass bandPass = BandPass.Visible;

                bandPass = (BandPass)Enums.Parse("BandPass",node.Attributes.GetNamedItem("BandPass").Value);

                int wf = 1;
                if (node.Attributes.GetNamedItem("WidthFactor") != null)
                {
                    wf = int.Parse(node.Attributes.GetNamedItem("WidthFactor").Value);
                }

                if (node.Attributes.GetNamedItem("Generic") == null || !bool.Parse(node.Attributes.GetNamedItem("Generic").Value.ToString()))
                {
                    projection = (ProjectionType)Enums.Parse("ProjectionType", node.Attributes.GetNamedItem("Projection").Value);

                    string fileType = node.Attributes.GetNamedItem("FileType").Value.ToString();
                    if (!fileType.StartsWith("."))
                    {
                        fileType = "." + fileType;
                    }


                    string thumbnailUrl = "";

                    XmlNode thumbUrl = Util.SelectSingleNode(node, "ThumbnailUrl");
                    if (thumbUrl != null)
                    {
                        if (string.IsNullOrEmpty(thumbUrl.InnerText))
                        {
                            ChromeNode cn = (ChromeNode)(object)thumbUrl;
                            thumbnailUrl = cn.TextContent;
                        }
                        else
                        {
                            thumbnailUrl = thumbUrl.InnerText;
                        }
                    }

                    bool stockSet = false;
                    bool elevationModel = false;

                    if (node.Attributes.GetNamedItem("StockSet") != null)
                    {
                        stockSet = bool.Parse(node.Attributes.GetNamedItem("StockSet").Value.ToString());
                    }

                    if (node.Attributes.GetNamedItem("ElevationModel") != null)
                    {
                        elevationModel = bool.Parse(node.Attributes.GetNamedItem("ElevationModel").Value.ToString());
                    }

                    string demUrl = "";
                    if (node.Attributes.GetNamedItem("DemUrl") != null)
                    {
                        demUrl = node.Attributes.GetNamedItem("DemUrl").Value.ToString();
                    }

                    string alturl = "";

                    if (node.Attributes.GetNamedItem("AltUrl") != null)
                    {
                        alturl = node.Attributes.GetNamedItem("AltUrl").Value.ToString();
                    }


                    double offsetX = 0;

                    if (node.Attributes.GetNamedItem("OffsetX") != null)
                    {
                        offsetX = double.Parse(node.Attributes.GetNamedItem("OffsetX").Value.ToString());
                    }

                    double offsetY = 0;

                    if (node.Attributes.GetNamedItem("OffsetY") != null)
                    {
                        offsetY = double.Parse(node.Attributes.GetNamedItem("OffsetY").Value.ToString());
                    }

                    string creditText = "";

                    XmlNode credits = Util.SelectSingleNode(node, "Credits");

                    if (credits != null)
                    {
                        creditText = Util.GetInnerText(credits);
                    }

                    string creditsUrl = "";

                    credits = Util.SelectSingleNode(node, "CreditsUrl");

                    if (credits != null)
                    {
                        creditsUrl = Util.GetInnerText(credits);
                    }

                    double meanRadius = 0;

                    if (node.Attributes.GetNamedItem("MeanRadius") != null)
                    {
                        meanRadius = double.Parse(node.Attributes.GetNamedItem("MeanRadius").Value.ToString());
                    }

                    string referenceFrame = null;
                    if (node.Attributes.GetNamedItem("ReferenceFrame") != null)
                    {
                        referenceFrame = node.Attributes.GetNamedItem("ReferenceFrame").Value;
                    }

                    string name = "";
                    if (node.Attributes.GetNamedItem("Name") != null)
                    {
                        name = node.Attributes.GetNamedItem("Name").Value.ToString();
                    }

                    string url = "";
                    if (node.Attributes.GetNamedItem("Url") != null)
                    {
                        url = node.Attributes.GetNamedItem("Url").Value.ToString();
                    }

                    int baseTileLevel = 0;
                    if (node.Attributes.GetNamedItem("BaseTileLevel") != null)
                    {
                        baseTileLevel = int.Parse(node.Attributes.GetNamedItem("BaseTileLevel").Value.ToString());
                    }

                    int tileLevels = 0;
                    if (node.Attributes.GetNamedItem("TileLevels") != null)
                    {
                        tileLevels = int.Parse(node.Attributes.GetNamedItem("TileLevels").Value.ToString());
                    }

                    double baseDegreesPerTile = 0;

                    if (node.Attributes.GetNamedItem("BaseDegreesPerTile") != null)
                    {
                        baseDegreesPerTile = double.Parse(node.Attributes.GetNamedItem("BaseDegreesPerTile").Value.ToString());
                    }


                    bool bottomsUp = false;


                    if (node.Attributes.GetNamedItem("BottomsUp") != null)
                    {
                        bottomsUp = bool.Parse(node.Attributes.GetNamedItem("BottomsUp").Value.ToString());
                    }

                    string quadTreeMap = "";
                    if (node.Attributes.GetNamedItem("QuadTreeMap") != null)
                    {
                        quadTreeMap = node.Attributes.GetNamedItem("QuadTreeMap").Value.ToString();
                    }

                    double centerX = 0;

                    if (node.Attributes.GetNamedItem("CenterX") != null)
                    {
                        centerX = double.Parse(node.Attributes.GetNamedItem("CenterX").Value.ToString());
                    }

                    double centerY = 0;

                    if (node.Attributes.GetNamedItem("CenterY") != null)
                    {
                        centerY = double.Parse(node.Attributes.GetNamedItem("CenterY").Value.ToString());
                    }

                    double rotation = 0;

                    if (node.Attributes.GetNamedItem("Rotation") != null)
                    {
                        rotation = double.Parse(node.Attributes.GetNamedItem("Rotation").Value.ToString());
                    }

                    bool sparse = false;

                    if (node.Attributes.GetNamedItem("Sparse") != null)
                    {
                        sparse = bool.Parse(node.Attributes.GetNamedItem("Sparse").Value.ToString());
                    }

                    return Imageset.Create(name, url,
                        type, bandPass, projection, Math.Abs(Util.GetHashCode(url)),
                        baseTileLevel, tileLevels,
                        256, baseDegreesPerTile, fileType,
                        bottomsUp, quadTreeMap,
                        centerX, centerY,
                        rotation, sparse,
                        thumbnailUrl, stockSet, elevationModel, wf, offsetX, offsetY, creditText, creditsUrl, demUrl, alturl, meanRadius, referenceFrame);
                }
                else
                {
                    return Imageset.CreateGeneric(type, bandPass);
                }

            }
            catch
            {
                return null;
            }
        }

        public static void SaveToXml(XmlTextWriter xmlWriter, Imageset imageset, string alternateUrl)
        {
            xmlWriter.WriteStartElement("ImageSet");

            xmlWriter.WriteAttributeString("Generic", imageset.Generic.ToString());
            xmlWriter.WriteAttributeString("DataSetType", Enums.ToXml("ImageSetType", (int)imageset.DataSetType));
            xmlWriter.WriteAttributeString("BandPass", Enums.ToXml("BandPass", (int)imageset.BandPass));
            if (!imageset.Generic)
            {
                xmlWriter.WriteAttributeString("Name", imageset.Name);

                if (String.IsNullOrEmpty(alternateUrl))
                {
                    xmlWriter.WriteAttributeString("Url", imageset.Url);
                }
                else
                {
                    xmlWriter.WriteAttributeString("Url", alternateUrl);
                }
                xmlWriter.WriteAttributeString("DemUrl", imageset.DemUrl);
                xmlWriter.WriteAttributeString("BaseTileLevel", imageset.BaseLevel.ToString());
                xmlWriter.WriteAttributeString("TileLevels", imageset.Levels.ToString());
                xmlWriter.WriteAttributeString("BaseDegreesPerTile", imageset.BaseTileDegrees.ToString());
                xmlWriter.WriteAttributeString("FileType", imageset.Extension);
                xmlWriter.WriteAttributeString("BottomsUp", imageset.BottomsUp.ToString());
                xmlWriter.WriteAttributeString("Projection", Enums.ToXml("ProjectionType", (int)imageset.Projection));
                xmlWriter.WriteAttributeString("QuadTreeMap", imageset.QuadTreeTileMap);
                xmlWriter.WriteAttributeString("CenterX", imageset.CenterX.ToString());
                xmlWriter.WriteAttributeString("CenterY", imageset.CenterY.ToString());
                xmlWriter.WriteAttributeString("OffsetX", imageset.OffsetX.ToString());
                xmlWriter.WriteAttributeString("OffsetY", imageset.OffsetY.ToString());
                xmlWriter.WriteAttributeString("Rotation", imageset.Rotation.ToString());
                xmlWriter.WriteAttributeString("Sparse", imageset.Sparse.ToString());
                xmlWriter.WriteAttributeString("ElevationModel", imageset.ElevationModel.ToString());
                xmlWriter.WriteAttributeString("StockSet", imageset.DefaultSet.ToString());
                xmlWriter.WriteAttributeString("WidthFactor", imageset.WidthFactor.ToString());
                xmlWriter.WriteAttributeString("MeanRadius", imageset.MeanRadius.ToString());
                xmlWriter.WriteAttributeString("ReferenceFrame", imageset.ReferenceFrame);
                if (String.IsNullOrEmpty(alternateUrl))
                {
                    xmlWriter.WriteElementString("ThumbnailUrl", imageset.ThumbnailUrl);
                }
                else
                {
                    xmlWriter.WriteElementString("ThumbnailUrl", imageset.Url);
                }
            }
            xmlWriter.WriteEndElement();
        }

        public override string ToString()
        {
            if (DefaultSet)
            {
                return name + " *";
            }
            else
            {
                return name;
            }
        }

        //todo figure out the place for this...
        public Imageset StockImageSet
        {
            get
            {
                if (generic || !defaultSet)
                {
                    return this;
                }
                else
                {
                    return Imageset.CreateGeneric(this.DataSetType, this.BandPass);
                }
            }
        }

        //public static bool operator ==(ImageSet left, ImageSet right)
        //{
        //    if (left == right )
        //    {
        //        return true;
        //    }
        //    if (left == null ^ right == null)
        //    {
        //        return false;
        //    }
        //    return (left.Url.GetHashCode() == right.Url.GetHashCode());
        //}

        //public static bool operator !=(ImageSet left, ImageSet right)
        //{
        //    if (left == right )
        //    {
        //        return false;
        //    }
        //    if ( left == null ^ right == null)
        //    {
        //        return true;
        //    }

        //    return (left.Url.GetHashCode() != right.Url.GetHashCode());
        //}

        //public static bool operator ==(ImageSet o1, ImageSet o2)
        //{
        //    return (Object)o1 == null ? (Object)o2 == null : o1.Equals(o2);
        //}
        //public static bool operator !=(ImageSet o1, ImageSet o2)
        //{
        //    return (Object)o1 != null ? (Object)o2 != null : !o1.Equals(o2);
        //}



        public bool Equals(object obj)
        {
            if (obj == null)
            {
                return false;
            }
            if (!(obj is Imageset))
            {
                return false;
            }
            Imageset b = (Imageset)obj;

            return (Util.GetHashCode(b.Url) == Util.GetHashCode(this.Url) && b.DataSetType == this.DataSetType && b.BandPass == this.BandPass && b.Generic == this.Generic);

        }

        private Matrix3d matrix;

        public Matrix3d Matrix
        {
            get
            {
                if (!matrixComputed)
                {
                    ComputeMatrix();
                }
                return matrix;
            }
            set { matrix = value; }
        }
        bool matrixComputed = false;
        private void ComputeMatrix()
        {
            matrixComputed = true;
            matrix = Matrix3d.Identity;
            matrix.Multiply(Matrix3d.RotationX((((Rotation)) / 180f * Math.PI)));
            matrix.Multiply(Matrix3d.RotationZ(((CenterY) / 180f * Math.PI)));
            matrix.Multiply(Matrix3d.RotationY((((360 - CenterX) ) / 180f * Math.PI)));
        }

        private string name = "";

        public string Name
        {
            get { return name; }
            set { name = value; }
        }
        private bool sparse = false;

        public bool Sparse
        {
            get { return sparse; }
            set { sparse = value; }
        }
        private string thumbnailUrl = "";

        public string ThumbnailUrl
        {
            get { return thumbnailUrl; }
            set { thumbnailUrl = value; }
        }
        private bool generic;

        public bool Generic
        {
            get { return generic; }
            set { generic = value; }
        }

        public Imageset()
        {
        }

        public static Imageset CreateGeneric(ImageSetType dataSetType, BandPass bandPass)
        {
            Imageset temp = new Imageset();
            temp.generic = true;
            temp.name = "Generic";
            temp.sparse = false;
            temp.dataSetType = dataSetType;
            temp.bandPass = bandPass;
            temp.quadTreeTileMap = "";
            temp.url = "";
            temp.levels = 0;
            temp.baseTileDegrees = 0;
            temp.imageSetID = 0;
            temp.extension = "";
            temp.projection = ProjectionType.Equirectangular;
            temp.bottomsUp = false;
            temp.baseLevel = 0;
            temp.mercator = (temp.projection == ProjectionType.Mercator);
            temp.centerX = 0;
            temp.centerY = 0;
            temp.rotation = 0;
            //todo add scale
            temp.thumbnailUrl = "";

            temp.matrix = Matrix3d.Identity;
            temp.matrix.Multiply(Matrix3d.RotationX((((temp.Rotation)) / 180f * Math.PI)));
            temp.matrix.Multiply(Matrix3d.RotationZ(((temp.CenterY) / 180f * Math.PI)));
            temp.matrix.Multiply(Matrix3d.RotationY((((360 - temp.CenterX) + 180) / 180f * Math.PI)));

            return temp;
        }

        bool defaultSet = false;
        bool elevationModel = false;

        public bool ElevationModel
        {
            get { return elevationModel; }
            set { elevationModel = value; }
        }
        public bool DefaultSet
        {
            get { return defaultSet; }
            set { defaultSet = value; }
        }

        double offsetX = 0;

        public double OffsetX
        {
            get { return offsetX; }
            set { offsetX = value; }
        }


        double offsetY = 0;

        public double OffsetY
        {
            get { return offsetY; }
            set { offsetY = value; }
        }


        string creditsText;

        public string CreditsText
        {
            get { return creditsText; }
            set { creditsText = value; }
        }
        string creditsUrl;

        public string CreditsUrl
        {
            get { return creditsUrl; }
            set { creditsUrl = value; }
        }

        public bool IsMandelbrot
        {
            get
            {
                return false;
            }
        }

        // Calculate either the X or Y coordinate of the estimated image center.
        //
        // This estimate has some important limitations. First, because images
        // might contain transparent regions, the "center" of the image that a
        // user will perceive might have nothing to do with the center of the
        // image bitmap. For instance, imagine that the bitmap is 100x100 but
        // that everything is transparent except for 10x10 pixels in the
        // top-left corner. We don't know anything about the "barycenter" of the
        // image here, so we can't account for that.
        //
        // Second, for untiled SkyImage imagesets, to properly compute the
        // bitmap center we need its dimensions, which simply aren't available
        // here. All we can do is guess a "reasonable" image size.
        //
        // For these reasons, this method should be avoided when possible. The
        // preferred way to "know" the location of an image's center is to wrap
        // the image in a Place object, which can just specify the exact
        // coordinates and zoom level too.
        //
        // Even disregarding the above, it's non-trivial to locate the image
        // center because of the OffsetX/Y parameters and potential rotation of
        // the image's coordinate system relative to the sky.
        private double CalcViewCenterCoordinate(bool isX)
        {
            double rot = Coordinates.DegreesToRadians(rotation);
            double crot = Math.Cos(rot);
            double srot = Math.Sin(rot);

            double dx = 0, dy = 0;

            if (Levels > 0) {
                dx = -offsetX;
                dy = offsetY;
            } else {
                // This is the part where we need the image's dimensions to
                // be able to compute the center coordinate correctly. Since
                // we don't have that information, we just guess :-(
                double effWidth = 800;
                double effHeight = 800;

                dx = (offsetX - effWidth / 2) * baseTileDegrees;
                dy = (effHeight / 2 - offsetY) * baseTileDegrees;
            }

            if (bottomsUp) {
                dx = -dx;
            }

            if (isX) {
                return centerX + dx * crot + dy * srot;
            } else {
                return centerY - dx * srot + dy * crot;
            }
        }

        public double ViewCenterX
        {
            get {
                if (WcsImage != null) {
                    return ((WcsImage) WcsImage).ViewCenterX;
                } else {
                    return CalcViewCenterCoordinate(true);
                }
            }
        }

        public double ViewCenterY
        {
            get {
                if (WcsImage != null) {
                    return ((WcsImage) WcsImage).ViewCenterY;
                } else {
                    return CalcViewCenterCoordinate(false);
                }
            }
        }

        public static Imageset Create(string name, string url, ImageSetType dataSetType, BandPass bandPass, ProjectionType projection, int imageSetID, int baseLevel, int levels, int tileSize, double baseTileDegrees, string extension, bool bottomsUp, string quadTreeMap, double centerX, double centerY, double rotation, bool sparse, string thumbnailUrl, bool defaultSet, bool elevationModel, int wf, double offsetX, double offsetY, string credits, string creditsUrl, string demUrlIn, string alturl, double meanRadius, string referenceFrame)
        {
            Imageset temp = new Imageset();

            temp.SetInitialParameters(name, url, dataSetType, bandPass, projection, imageSetID, baseLevel, levels, baseTileDegrees, extension, bottomsUp, quadTreeMap, centerX, centerY, rotation, sparse, thumbnailUrl, defaultSet, elevationModel, wf, offsetX, offsetY, credits, creditsUrl, demUrlIn, alturl, meanRadius, referenceFrame);

            return temp;
        }

        public void SetInitialParameters(string name, string url, ImageSetType dataSetType, BandPass bandPass, ProjectionType projection, int imageSetID, int baseLevel, int levels, double baseTileDegrees, string extension, bool bottomsUp, string quadTreeMap, double centerX, double centerY, double rotation, bool sparse, string thumbnailUrl, bool defaultSet, bool elevationModel, int wf, double offsetX, double offsetY, string credits, string creditsUrl, string demUrlIn, string alturl, double meanRadius, string referenceFrame)
        {
            this.ReferenceFrame = referenceFrame;
            this.MeanRadius = meanRadius;
            this.altUrl = alturl;
            this.demUrl = demUrlIn;
            this.creditsText = credits;
            this.creditsUrl = creditsUrl;
            this.offsetY = offsetY;
            this.offsetX = offsetX;
            this.widthFactor = wf;
            this.elevationModel = elevationModel;
            this.defaultSet = defaultSet;
            this.name = name;
            this.sparse = sparse;
            this.dataSetType = dataSetType;
            this.bandPass = bandPass;
            this.quadTreeTileMap = quadTreeMap;
            this.url = url;
            this.levels = levels;
            this.baseTileDegrees = baseTileDegrees;
            this.imageSetID = imageSetID;
            this.extension = extension;
            this.projection = projection;
            this.bottomsUp = bottomsUp;
            this.baseLevel = baseLevel;
            this.mercator = (projection == ProjectionType.Mercator);
            this.centerX = centerX;
            this.centerY = centerY;
            this.rotation = rotation;
            this.thumbnailUrl = thumbnailUrl;
            this.ComputeMatrix();
        }

        // Ideally, imagesets will be associated with Places that specify
        // exactly how the view should be set up when "going to" them, but
        // sometimes (especially research datasets) we're interested in deriving
        // a reasonable zoom setting without that extra information. The returned value
        // isn't going to be perfect but it should hopefully be OK.

        private const double FOV_FACTOR = 1.7;

        internal double GuessZoomSetting(double currentZoom)
        {
            double zoom = currentZoom;

            // ScriptSharp has an issue here. Maybe because we have a field name
            // matching a class name? Right now the only implementation of
            // WcsImage is FitsImage so we can get away with this:
            WcsImage aswcs = this.wcsImage as FitsImage;

            if (Projection == ProjectionType.SkyImage) {
                // Untiled SkyImage: basetiledegrees is degrees per pixel
                if (aswcs != null) {
                    zoom = BaseTileDegrees * aswcs.SizeY * 6 * FOV_FACTOR;
                }
            } else if (aswcs != null) {
                zoom = aswcs.ScaleY * aswcs.SizeY * 6 * FOV_FACTOR;
            } else {
                // Tiled. basetiledegrees is angular height of whole image after
                // power-of-2 padding.
                zoom = BaseTileDegrees * 6 * FOV_FACTOR;
            }

            // Only zoom in, not out. Usability-wise this tends to make the most
            // sense.

            if (zoom > currentZoom) {
                zoom = currentZoom;
            }

            return zoom;
        }

        // URL parameters
        //{0} ImageSetID
        //{1} level
        //{2} x tile id
        //{3} y tile id
        //{4} quadtree address (VE style)
        //{5} quadtree address (Google maps style)
        //{6} top left corner RA
        //{7} top left corner Dec
        //{8} bottom right corner RA
        //{9} bottom right corner dec
        //{10} bottom left corner RA
        //{11} bottom left corner dec
        //{12} top right corner RA
        //{13} top right corner dec

        #region IThumbnail Members

        ImageElement thumbnail;
        public System.Html.ImageElement Thumbnail
        {
            get
            {
                return thumbnail;
            }
            set
            {
                thumbnail = value;
            }
        }
        Rectangle bounds;
        public Rectangle Bounds
        {
            get
            {
                return bounds;
            }
            set
            {
                bounds = value;
            }
        }

        public bool IsImage
        {
            get { return true; }
        }

        public bool IsTour
        {
            get { return false; }
        }

        public bool IsFolder
        {
            get { return false; }
        }

        public bool IsCloudCommunityItem
        {
            get { return false; }
        }

        public bool ReadOnly
        {
            get { return false; }
        }

        public List<IThumbnail> Children
        {
            get { return new List<IThumbnail>(); }
        }

        #endregion
    }
}
