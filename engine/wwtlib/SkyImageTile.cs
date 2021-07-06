



namespace wwtlib
{
    public class SkyImageTile : TangentTile
    {
        public double PixelCenterX = 0.0;
        public double PixelCenterY = 0.0;
        public double ScaleX = .01;
        public double ScaleY = .01;
        public double Height = 0;
        public double Width = 0;
        public SkyImageTile(int level, int x, int y, Imageset dataset, Tile parent) : base(level, x, y, dataset, parent)
        {
            PixelCenterX = dataset.OffsetX;
            PixelCenterY = dataset.OffsetY;
            ScaleX = -(ScaleY = dataset.BaseTileDegrees);
            if (dataset.BottomsUp)
            {
                ScaleX = -ScaleX;
            }
            this.sphereCenter = this.GeoTo3dTan(0, 0);
            this.radius = 1.25f;
            this.ComputeBoundingSphere();
        }

        protected override LatLngEdges GetLatLngEdges()
        {
            LatLngEdges edges = new LatLngEdges();

            WcsImage wcsImage = dataset.WcsImage as WcsImage;

            if (wcsImage != null && RenderContext.UseGl)
            {
                if (RenderContext.UseGlVersion2)
                {
                    Width = wcsImage.SizeX;
                    Height = wcsImage.SizeY;
                } else
                {
                    Height = bmp.Height;
                    Width = bmp.Width;
                    if (wcsImage.SizeX != wcsImage.SizeY)
                    {
                        PixelCenterY += bmp.Height - wcsImage.SizeY;
                    }
                }
            }
            else
            {
                Height = texture.NaturalHeight;
                Width = texture.NaturalWidth;
            }

            edges.latMin = 0 + (ScaleY * (Height - PixelCenterY));
            edges.latMax = 0 - (ScaleY * PixelCenterY);
            edges.lngMin = 0 + (ScaleX * PixelCenterX);
            edges.lngMax = 0 - (ScaleX * (Width - PixelCenterX));
            return edges;
        }

    }
}
