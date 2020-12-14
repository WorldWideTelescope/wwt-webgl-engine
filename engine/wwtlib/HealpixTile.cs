using System;
using System.Collections.Generic;
using System.Html;

namespace wwtlib
{

    public class HealpixTile : Tile
    {
        public readonly int ipix;

        protected double[] demArray;
        protected WebGLBuffer[] indexBuffer = new WebGLBuffer[4];

        private List<PositionTexture> vertexList = null;
        private readonly int nside;
        private readonly int tileIndex = 0;
        private readonly int face;
        private readonly int faceX = 0;
        private readonly int faceY = 0;
        private int step;
        private string url;
        private bool subDivided = false;
        private static Matrix3d galacticMatrix = Matrix3d.Create(
                    -0.0548755604024359, -0.4838350155267381, -0.873437090247923, 0,
                    -0.8676661489811610, 0.4559837762325372, -0.1980763734646737, 0,
                    0.4941094279435681, 0.7469822444763707, -0.4448296299195045, 0,
                    0, 0, 0, 1);

        public String URL
        {
            get
            {
                if (url == null)
                {
                    url = GetUrl(dataset, Level, tileX, tileY);
                    return url;
                }
                else
                {
                    return url;
                }
            }
        }

        public HealpixTile(int level, int x, int y, Imageset dataset, Tile parent)
        {
            this.Level = level;
            this.tileX = x;
            this.tileY = y;
            this.dataset = dataset;
            DemEnabled = false;
            if (level == 0)
            {
                this.nside = 4;
            }
            else
            {
                this.nside = Math.Pow(2, level + 1);
            }

            if (parent == null)
            {
                this.face = x * 4 + y;
                this.ipix = this.face;
            }
            else
            {
                this.Parent = parent;
                HealpixTile parentTile = (HealpixTile)parent;
                this.face = parentTile.face;
                this.tileIndex = parentTile.tileIndex * 4 + y * 2 + x;
                this.ipix = this.face * nside * nside / 4 + this.tileIndex;
                this.faceX = parentTile.faceX * 2 + x;
                this.faceY = parentTile.faceY * 2 + y;
            }


            // All healpix is inside out
            //insideOut = true;
            ComputeBoundingSphere();
        }

        private void ComputeBoundingSphere()
        {
            SetStep();
            CreateGeometry(null);

            Vector3d[] pointList = new Vector3d[vertexList.Count];
            for (int i = 0; i < vertexList.Count; i++)
            {
                pointList[i] = vertexList[i].Position;
            }
            CalcSphere(pointList);
            SetCorners();
        }

        public override bool CreateGeometry(RenderContext renderContext)
        {
            if(vertexList != null)
            {
                return true;
            }
            vertexList = new List<PositionTexture>();

            PopulateVertexList(vertexList, step);

            if (dataset.HipsProperties.Properties.ContainsKey("hips_frame") 
                && dataset.HipsProperties.Properties["hips_frame"] == "galactic")
            {
                for (int i = 0; i < vertexList.Count; i++)
                {
                    PositionTexture vert = vertexList[i];
                    galacticMatrix.MultiplyVector(vert.Position);
                }
            }


            TriangleCount = step * step / 2;
            Uint16Array ui16array = new Uint16Array(3 * TriangleCount);
            UInt16[] indexArray = (UInt16[])(object)ui16array;

            if (!subDivided)
            {
                //if (vertexList == null)
                //{
                //    createGeometry();
                //}

                try
                {
                    //process vertex list
                    VertexBuffer = PrepDevice.createBuffer();
                    PrepDevice.bindBuffer(GL.ARRAY_BUFFER, VertexBuffer);
                    Float32Array f32array = new Float32Array(vertexList.Count * 5);
                    float[] buffer = (float[])(object)f32array;
                    int index = 0;

                    foreach (PositionTexture vert in vertexList)
                    {
                        index = AddVertex(buffer, index, vert);

                    }
                    PrepDevice.bufferData(GL.ARRAY_BUFFER, f32array, GL.STATIC_DRAW);



                    index = 0;
                    int offset = vertexList.Count / (4 * step);

                    //0 0 = left
                    //1 0 = top
                    //1 1 = right
                    SetIndexBufferForQuadrant(indexArray, 0, 1);
                    if (step > 1)
                    {
                        SetIndexBufferForQuadrant(indexArray, 0, 0);
                        SetIndexBufferForQuadrant(indexArray, 1, 1);
                        SetIndexBufferForQuadrant(indexArray, 1, 0);
                    }

                }
                catch (Exception exception)
                {

                }

                //ReturnBuffers();
            }

            return true;
        }

        private void SetIndexBufferForQuadrant(ushort[] indexArray, int x, int y)
        {
            int index = 0;
            for (int i = x * step / 2; i < (step / 2) * (x + 1); i++)
            {
                for (int j = y * step / 2; j < (step / 2) * (y + 1); j++)
                {
                    indexArray[index++] = (UInt16)(i * (step + 1) + j);
                    indexArray[index++] = (UInt16)(1 + i * (step + 1) + j);
                    indexArray[index++] = (UInt16)(step + 1 + i * (step + 1) + j);
                    indexArray[index++] = (UInt16)(1 + i * (step + 1) + j);
                    indexArray[index++] = (UInt16)(step + 1 + i * (step + 1) + j);
                    indexArray[index++] = (UInt16)(step + 2 + i * (step + 1) + j);

                }
            }
            ProcessIndexBuffer(indexArray, x * 2 + y);
        }

        private static string ReplaceInvalidChars(string filename)
        {
            return filename;
            //return string.Join("_", filename.Split(Path.GetInvalidFileNameChars()));
        }

        private string GetUrl(Imageset dataset, int level, int x, int y)
        {
            string extention = GetHipsFileExtention();

            int tileTextureIndex = -1;
            if (level == 0)
            {
                tileTextureIndex = this.face;
            }
            else
            {
                tileTextureIndex = this.face * nside * nside / 4 + this.tileIndex;
            }
            StringBuilder sb = new StringBuilder();

            int subDirIndex = Math.Floor(tileTextureIndex / 10000) * 10000;

            return String.Format(dataset.Url, level.ToString(), subDirIndex.ToString(), tileTextureIndex.ToString() + extention);
        }

        private string GetHipsFileExtention()
        {
            // The extension will contain either a list of type or a single type
            // The imageset can be set to the perfrered file type if desired IE: FITS will never be chosen if others are avaialbe,
            // unless the FITS only is selected and saved into the extension field of the imageset.
            //prioritize transparent Png over other image formats
            if (dataset.Extension.ToLowerCase().IndexOf("png") > -1)
            {
                IsCatalogTile = false;
                return ".png";
            }

            // Check for either type
            if (dataset.Extension.ToLowerCase().IndexOf("jpeg") > -1 || dataset.Extension.ToLowerCase().IndexOf("jpg") > -1)
            {
                IsCatalogTile = false;
                return ".jpg";
            }

            if (dataset.Extension.ToLowerCase().IndexOf("tsv") > -1)
            {
                IsCatalogTile = true;
                return ".tsv";
            }

            if (dataset.Extension.ToLowerCase().IndexOf("fits") > -1)
            {
                IsCatalogTile = false;
                return ".fits";
            }
            IsCatalogTile = false;

            //default to most common
            return ".jpg";
        }


        public override bool IsTileBigEnough(RenderContext renderContext)
        {
            double arcPixels = (3600 / (Math.Pow(2, Level) * 4));
            return (renderContext.FovScale < arcPixels);
        }

        private Vector3d[] Boundaries(int x, int y, int step)
        {
            int nside = step * Math.Pow(2, Level);
            Vector3d[] points = new Vector3d[4];
            Xyf xyf = Xyf.Create(x + faceX * step, y + faceY * step, face);
            double dc = 0.5 / nside;
            double xc = (xyf.ix + 0.5) / nside;
            double yc = (xyf.iy + 0.5) / nside;

            points[0] = Fxyf.Create(xc + dc, yc + dc, xyf.face).toVec3();
            points[1] = Fxyf.Create(xc - dc, yc + dc, xyf.face).toVec3();
            points[2] = Fxyf.Create(xc - dc, yc - dc, xyf.face).toVec3();
            points[3] = Fxyf.Create(xc + dc, yc - dc, xyf.face).toVec3();

            return points;
        }


        private void SetCorners()
        {
            Xyf xyf = Xyf.Create(tileX, tileY, face);
            double dc = 0.5 / nside;
            double xc = (xyf.ix + 0.5) / nside;
            double yc = (xyf.iy + 0.5) / nside;

            TopLeft = Fxyf.Create(xc + dc, yc + dc, xyf.face).toVec3();
            BottomLeft = Fxyf.Create(xc - dc, yc + dc, xyf.face).toVec3();
            BottomRight = Fxyf.Create(xc - dc, yc - dc, xyf.face).toVec3();
            TopRight = Fxyf.Create(xc + dc, yc - dc, xyf.face).toVec3();
        }

        public override bool Draw3D(RenderContext renderContext, double opacity)
        {
            RenderedGeneration = CurrentRenderGeneration;
            TilesTouched++;

            InViewFrustum = true;
            bool onlyDrawChildren = false;

            if (!ReadyToRender)
            {
                if (!errored)
                {
                    TileCache.AddTileToQueue(this);
                    return false;
                }

                if (errored && Level < 3) //Level 0-2 sometimes deleted in favor of allsky.jpg/tsv
                {
                    onlyDrawChildren = true;
                } else
                {
                    return false;
                }
            }


            //if (!CreateGeometry(renderContext))
            //{
            //    if (Level > 2)
            //    {
            //        return false;
            //    }
            //}

            int partCount = this.TriangleCount;
            TrianglesRendered += partCount;

            bool anythingToRender = false;
            bool childRendered = false;
            int childIndex = 0;
            for (int y1 = 0; y1 < 2; y1++)
            {
                for (int x1 = 0; x1 < 2; x1++)
                {
                    if (Level < dataset.Levels)
                    {
                        // make children 
                        if (children[childIndex] == null)
                        {
                            children[childIndex] = TileCache.GetTile(Level + 1, x1, y1, dataset, this);
                        }

                        if (children[childIndex].IsTileInFrustum(renderContext.Frustum))
                        {
                            InViewFrustum = true;
                            if (children[childIndex].IsTileBigEnough(renderContext) || onlyDrawChildren)
                            {
                                renderChildPart[childIndex].TargetState = !children[childIndex].Draw3D(renderContext, opacity);
                                if (renderChildPart[childIndex].TargetState)
                                {
                                    childRendered = true;
                                }
                            }
                            else
                            {
                                renderChildPart[childIndex].TargetState = true;
                            }
                        }
                        else
                        {
                            renderChildPart[childIndex].TargetState = renderChildPart[childIndex].State = false;
                        }

                        //if (renderChildPart[childIndex].TargetState == true || !blendMode)
                        //{
                        //    renderChildPart[childIndex].State = renderChildPart[childIndex].TargetState;
                        //}
                        //if (renderChildPart[childIndex].TargetState != renderChildPart[childIndex].State)
                        //{
                        //    transitioning = true;
                        //}
                    }
                    else
                    {
                        renderChildPart[childIndex].State = true;
                    }

                    ////if(childIndex != 0)
                    ////{
                    ////    renderChildPart[childIndex].TargetState = true;
                    ////    anythingToRender = true;
                    ////}

                    if (renderChildPart[childIndex].State == true)
                    {
                        anythingToRender = true;
                    }

                    childIndex++;
                }
            }

            if (childRendered || anythingToRender)
            {
                RenderedAtOrBelowGeneration = CurrentRenderGeneration;
                if (Parent != null)
                {
                    Parent.RenderedAtOrBelowGeneration = RenderedAtOrBelowGeneration;
                }
            }

            if (!anythingToRender)
            {
                return true;
            }

            if (!CreateGeometry(renderContext))
            {
                return false;
            }

            if (onlyDrawChildren)
            {
                return true;
            }

            TilesInView++;


            for (int i = 0; i < 4; i++)
            {
                if (renderChildPart[i].TargetState)
                {
                    RenderPart(renderContext, i, opacity / 100, false);
                }
            }

            return true;
        }

        private void SetStep()
        {
            switch (Level)
            {
                case 0:
                case 1:
                case 2:
                    step = 64;
                    break;
                case 3:
                    step = 32;
                    break;
                case 4:
                    step = 16;
                    break;
                case 5:
                    step = 8;
                    break;
                case 6:
                    step = 4;
                    break;
                case 7:
                    step = 2;
                    break;
                default:
                    step = 2;
                    break;
            }
        }

        public override WebGLBuffer GetIndexBuffer(int index, int accomidation)
        {
            return indexBuffer[index];
        }

        private void CalcSphere(Vector3d[] list)
        {
            SphereHull result = ConvexHull.FindEnclosingSphere(list);

            sphereCenter = result.Center;
            sphereRadius = result.Radius;
        }

        public override bool IsPointInTile(double lat, double lng)
        {
            if (Level == 0)
            {
                return true;
            }

            if (Level == 1)
            {
                if ((lng >= 0 && lng <= 90) && (tileX == 0 && tileY == 1))
                {
                    return true;
                }
                if ((lng > 90 && lng <= 180) && (tileX == 1 && tileY == 1))
                {
                    return true;
                }
                if ((lng < 0 && lng >= -90) && (tileX == 0 && tileY == 0))
                {
                    return true;
                }
                if ((lng < -90 && lng >= -180) && (tileX == 1 && tileY == 0))
                {
                    return true;
                }
            }

            Vector3d testPoint = Coordinates.GeoTo3dDouble(lat, lng);
            bool top = IsLeftOfHalfSpace(TopLeft, TopRight, testPoint);
            bool right = IsLeftOfHalfSpace(TopRight, BottomRight, testPoint);
            bool bottom = IsLeftOfHalfSpace(BottomRight, BottomLeft, testPoint);
            bool left = IsLeftOfHalfSpace(BottomLeft, TopLeft, testPoint);

            if (top && right && bottom && left)
            {
                return true;
            }
            return false; ;
        }

        private bool IsLeftOfHalfSpace(Vector3d pntA, Vector3d pntB, Vector3d pntTest)
        {
            pntA.Normalize();
            pntB.Normalize();
            Vector3d cross = Vector3d.Cross(pntA, pntB);

            double dot = Vector3d.Dot(cross, pntTest);

            return dot > 0;
        }

        public override double GetSurfacePointAltitude(double lat, double lng, bool meters)
        {

            if (Level < lastDeepestLevel)
            {
                //interate children

                foreach (Tile child in children)
                {
                    if (child != null)
                    {
                        if (child.IsPointInTile(lat, lng))
                        {
                            double retVal = child.GetSurfacePointAltitude(lat, lng, meters);
                            if (retVal != 0)
                            {
                                return retVal;
                            }
                            else
                            {
                                break;
                            }
                        }
                    }
                }
            }
            return GetAltitudeFromLatLng(lat, lng, meters);
        }

        private double GetAltitudeFromLatLng(double lat, double lng, bool meters)
        {
            Vector3d testPoint = Coordinates.GeoTo3dDouble(lat, lng);
            Vector2d uv = DistanceCalc.GetUVFromInnerPoint(TopLeft, TopRight, BottomLeft, BottomRight, testPoint);

            // Get 4 samples and interpolate
            double uud = Math.Max(0, Math.Min(16, (uv.X * 16)));
            double vvd = Math.Max(0, Math.Min(16, (uv.Y * 16)));

            int uu = Math.Max(0, Math.Min(15, (int)(uv.X * 16)));
            int vv = Math.Max(0, Math.Min(15, (int)(uv.Y * 16)));

            double ha = uud - uu;
            double va = vvd - vv;

            if (demArray != null)
            {
                // 4 nearest neighbors
                double ul = demArray[uu + 17 * vv];
                double ur = demArray[(uu + 1) + 17 * vv];
                double ll = demArray[uu + 17 * (vv + 1)];
                double lr = demArray[(uu + 1) + 17 * (vv + 1)];

                double top = ul * (1 - ha) + ha * ur;
                double bottom = ll * (1 - ha) + ha * lr;
                double val = top * (1 - va) + va * bottom;

                return val / (meters ? 1 : DemScaleFactor);
            }

            return demAverage / (meters ? 1 : DemScaleFactor);
        }

        private void ProcessIndexBuffer(UInt16[] indexArray, int part)
        {
            indexBuffer[part] = PrepDevice.createBuffer();
            PrepDevice.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, indexBuffer[part]);
            PrepDevice.bufferData(GL.ELEMENT_ARRAY_BUFFER, (Uint16Array)(object)indexArray, GL.STATIC_DRAW);
        }

        public override void CleanUp(bool removeFromParent)
        {
            base.CleanUp(removeFromParent);
            ReturnBuffers();
            subDivided = false;
        }

        private void ReturnBuffers()
        {
            if (vertexList != null)
            {
                vertexList = null;
            }
        }


        /*
         * Vertices distributed in a grid pattern like the example below
         * Example for pattern with step set to 4
         *            24
         *          19  23
         *       14   18  22
         *      9   13  17  21
         *    4   8   12  16  20
         *      3   7   11  15
         *        2   6   10
         *          1   5
         *            0
         * 
         */
        private void PopulateVertexList(PositionTexture[] vertexList, int step)
        {

            for (int i = 0; i < step; i += 2)
            {
                for (int j = 0; j < step; j += 2)
                {
                    Vector3d[] points = this.Boundaries(j, i, step);

                    vertexList[i * (step + 1) + j] = PositionTexture.CreatePos(points[2], (1 / step) * i, (1 / step) * j);
                    vertexList[i * (step + 1) + j + 1] = PositionTexture.CreatePos(points[3], (1 / step) * i, (1 / step) + (1 / step) * j);
                    vertexList[(i + 1) * (step + 1) + j] = PositionTexture.CreatePos(points[1], (1 / step) + (1 / step) * i, (1 / step) * j);
                    vertexList[(i + 1) * (step + 1) + j + 1] = PositionTexture.CreatePos(points[0], (1 / step) + (1 / step) * i, (1 / step) + (1 / step) * j);
                    if (j + 2 >= step && step > 1)
                    {
                        j = step - 1;
                        points = this.Boundaries(j, i, step);
                        vertexList[i * (step + 1) + step] = PositionTexture.CreatePos(points[3], (1 / step) * i, (1 / step) + (1 / step) * j);
                        vertexList[(i + 1) * (step + 1) + step] = PositionTexture.CreatePos(points[0], (1 / step) + (1 / step) * i, (1 / step) + (1 / step) * j);
                    }
                }
            }
            if (step > 1)
            {
                VertexOfLastRow(vertexList, step);
            }
        }

        private void VertexOfLastRow(PositionTexture[] vertexList, int step)
        {
            int i = step - 1;

            for (int j = 0; j < step; j += 2)
            {
                Vector3d[] points = this.Boundaries(j, i, step);
                vertexList[(i + 1) * (step + 1) + j] = PositionTexture.CreatePos(points[1], (1 / step) + (1 / step) * i, (1 / step) * j);
                vertexList[(i + 1) * (step + 1) + j + 1] = PositionTexture.CreatePos(points[0], (1 / step) + (1 / step) * i, (1 / step) + (1 / step) * j);
                if (j + 2 >= step)
                {
                    j = step - 1;
                    points = this.Boundaries(j, i, step);
                    vertexList[(i + 1) * (step + 1) + step] = PositionTexture.CreatePos(points[0], (1 / step) + (1 / step) * i, (1 / step) + (1 / step) * j);
                }
            }
        }
    }
 
    public class Xyf
    {
        public int ix;
        public int iy;
        public int face;
        public Xyf() { }
        public static Xyf Create(int x, int y, int f)
        {
            Xyf temp = new Xyf();
            temp.ix = x;
            temp.iy = y;
            temp.face = f;
            return temp;
        }
    }

}