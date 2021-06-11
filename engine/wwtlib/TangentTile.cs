using System;
using System.Collections.Generic;
using System.Html;


namespace wwtlib
{
    public class TangentTile : Tile
    {
        bool topDown = true;
        protected void ComputeBoundingSphere()
        {
            //insideOut = this.Dataset.DataSetType == ImageSetType.Sky || this.Dataset.DataSetType == ImageSetType.Panorama;
            if (!topDown)
            {
                ComputeBoundingSphereBottomsUp();
                return;
            }
            double tileDegrees = this.dataset.BaseTileDegrees / (Math.Pow(2, this.Level));

            double latMin = (((double)this.dataset.BaseTileDegrees / 2 - (((double)this.tileY) * tileDegrees)) + dataset.OffsetY);
            double latMax = (((double)this.dataset.BaseTileDegrees / 2 - (((double)(this.tileY + 1)) * tileDegrees)) + dataset.OffsetY);
            double lngMin = ((((double)this.tileX * tileDegrees) - this.dataset.BaseTileDegrees / dataset.WidthFactor) + dataset.OffsetX);
            double lngMax = (((((double)(this.tileX + 1)) * tileDegrees) - (double)this.dataset.BaseTileDegrees / dataset.WidthFactor) + dataset.OffsetX);

            double latCenter = (latMin + latMax) / 2.0;
            double lngCenter = (lngMin + lngMax) / 2.0;

            this.sphereCenter = GeoTo3dTan(latCenter, lngCenter);

            TopLeft = GeoTo3dTan(latMin, lngMin);
            BottomRight = GeoTo3dTan(latMax, lngMax);
            TopRight = GeoTo3dTan(latMin, lngMax);
            BottomLeft = GeoTo3dTan(latMax, lngMin);

            Vector3d distVect = GeoTo3dTan(latMin, lngMin);
            distVect.Subtract(sphereCenter);
            this.sphereRadius = distVect.Length();
        }

        protected Vector3d GeoTo3dTan(double lat, double lng)
        {
            lng = -lng;
            double fac1 = this.dataset.BaseTileDegrees / 2;
            double factor = Math.Tan(fac1 * RC);

            return (Vector3d)dataset.Matrix.Transform(Vector3d.Create(1, (lat / fac1 * factor), (lng / fac1 * factor)));

        }

        public override void RequestImage()
        {
            fitsImage = dataset.WcsImage as FitsImage;
            if (fitsImage != null)
            {
                texReady = true;
                Downloading = false;
                errored = fitsImage.errored;
                RequestPending = false;
                TileCache.RemoveFromQueue(this.Key, true);
                if (RenderContext.UseGlVersion2)
                {
                    MakeTexture();
                }
                else
                {
                    Bitmap bmp = fitsImage.GetBitmap();
                    texture2d = bmp.GetTexture();
                    ReadyToRender = true;
                }
            }
            else if (dataset.Extension == ".fits" && dataset.WcsImage == null)
            {
                if (!Downloading && !ReadyToRender)
                {

                    Downloading = true;
                    if (RenderContext.UseGlVersion2)
                    {
                        fitsImage = new FitsImageTile(dataset, URL, delegate (WcsImage wcsImage)
                        {
                            Downloading = false;
                            errored = fitsImage.errored;
                            TileCache.RemoveFromQueue(this.Key, true);
                            if (!fitsImage.errored)
                            {
                                texReady = true;
                                ReadyToRender = texReady && (DemReady || !demTile);
                                RequestPending = false;
                                MakeTexture();
                            }
                        });
                    }
                    else
                    {
                        FitsImageJs image = FitsImageJs.CreateTiledFits(dataset, URL, delegate (WcsImage wcsImage)
                        {
                            texReady = true;
                            Downloading = false;
                            errored = false;
                            ReadyToRender = texReady && (DemReady || !demTile);
                            RequestPending = false;
                            TileCache.RemoveFromQueue(this.Key, true);
                            texture2d = wcsImage.GetBitmap().GetTexture();
                        });
                    }

                }
            }
            else
            {
                base.RequestImage();
            }
        }

        public override void MakeTexture()
        {
            if (PrepDevice != null)
            {
                try
                {
                    texture2d = PrepDevice.createTexture();

                    PrepDevice.bindTexture(GL.TEXTURE_2D, texture2d);
                    PrepDevice.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
                    PrepDevice.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);

                    if (dataset.Extension == ".fits" && RenderContext.UseGlVersion2)
                    {
                        PrepDevice.texImage2D(GL.TEXTURE_2D, 0, GL.R32F, (int)fitsImage.SizeX, (int)fitsImage.SizeY, 0, GL.RED, GL.FLOAT, fitsImage.dataUnit);
                        PrepDevice.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
                        PrepDevice.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
                    }
                    else
                    {
                        ImageElement image = texture;
                        PrepDevice.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image);
                        PrepDevice.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_NEAREST);
                        PrepDevice.generateMipmap(GL.TEXTURE_2D);
                    }

                    PrepDevice.bindTexture(GL.TEXTURE_2D, null);
                    ReadyToRender = true;
                }
                catch
                {
                    errored = true;

                }
            }
        }

        protected void ComputeBoundingSphereBottomsUp()
        {
            double tileDegrees = (double)this.dataset.BaseTileDegrees / ((double)Math.Pow(2, this.Level));


            double latMin = ((double)this.dataset.BaseTileDegrees / 2 + (((double)(this.tileY + 1)) * tileDegrees)) + dataset.OffsetY;
            double latMax = ((double)this.dataset.BaseTileDegrees / 2 + (((double)this.tileY) * tileDegrees)) + dataset.OffsetY;
            double lngMin = (((double)this.tileX * tileDegrees) - this.dataset.BaseTileDegrees / dataset.WidthFactor) + dataset.OffsetX;
            double lngMax = ((((double)(this.tileX + 1)) * tileDegrees) - this.dataset.BaseTileDegrees / dataset.WidthFactor) + dataset.OffsetX;

            double latCenter = (latMin + latMax) / 2.0;
            double lngCenter = (lngMin + lngMax) / 2.0;

            TopLeft = GeoTo3dTan(latMin, lngMin);
            BottomRight = GeoTo3dTan(latMax, lngMax);
            TopRight = GeoTo3dTan(latMin, lngMax);
            BottomLeft = GeoTo3dTan(latMax, lngMin);
        }

        public override bool CreateGeometry(RenderContext renderContext)
        {
            if (GeometryCreated)
            {
                return true;
            }
            GeometryCreated = true;

            for (int i = 0; i < 4; i++)
            {
                RenderTriangleLists[i] = new List<RenderTriangle>();
            }

            LatLngEdges edges = GetLatLngEdges();

            TopLeft = GeoTo3dTan(edges.latMin, edges.lngMin);
            BottomRight = GeoTo3dTan(edges.latMax, edges.lngMax);
            TopRight = GeoTo3dTan(edges.latMin, edges.lngMax);
            BottomLeft = GeoTo3dTan(edges.latMax, edges.lngMin);

            Vector3d center = Vector3d.MidPoint(TopLeft, BottomRight);
            Vector3d leftCenter = Vector3d.MidPoint(TopLeft, BottomLeft);
            Vector3d rightCenter = Vector3d.MidPoint(TopRight, BottomRight);
            Vector3d topCenter = Vector3d.MidPoint(TopLeft, TopRight);
            Vector3d bottomCenter = Vector3d.MidPoint(BottomLeft, BottomRight);

            if (renderContext.gl == null)
            {
                RenderTriangleLists[0].Add(RenderTriangle.Create(PositionTexture.CreatePos(TopLeft, 0, 0), PositionTexture.CreatePos(leftCenter, 0, .5), PositionTexture.CreatePos(topCenter, .5, 0), texture, Level));
                RenderTriangleLists[0].Add(RenderTriangle.Create(PositionTexture.CreatePos(leftCenter, 0, 0.5), PositionTexture.CreatePos(center, .5, .5), PositionTexture.CreatePos(topCenter, .5, 0), texture, Level));
                RenderTriangleLists[1].Add(RenderTriangle.Create(PositionTexture.CreatePos(topCenter, .5, 0), PositionTexture.CreatePos(rightCenter, 1, .5), PositionTexture.CreatePos(TopRight, 1, 0), texture, Level));
                RenderTriangleLists[1].Add(RenderTriangle.Create(PositionTexture.CreatePos(topCenter, .5, 0), PositionTexture.CreatePos(center, .5, .5), PositionTexture.CreatePos(rightCenter, 1, .5), texture, Level));
                RenderTriangleLists[2].Add(RenderTriangle.Create(PositionTexture.CreatePos(leftCenter, 0, .5), PositionTexture.CreatePos(bottomCenter, .5, 1), PositionTexture.CreatePos(center, .5, .5), texture, Level));
                RenderTriangleLists[2].Add(RenderTriangle.Create(PositionTexture.CreatePos(leftCenter, 0, .5), PositionTexture.CreatePos(BottomLeft, 0, 1), PositionTexture.CreatePos(bottomCenter, .5, 1), texture, Level));
                RenderTriangleLists[3].Add(RenderTriangle.Create(PositionTexture.CreatePos(center, .5, .5), PositionTexture.CreatePos(BottomRight, 1, 1), PositionTexture.CreatePos(rightCenter, 1, .5), texture, Level));
                RenderTriangleLists[3].Add(RenderTriangle.Create(PositionTexture.CreatePos(center, .5, .5), PositionTexture.CreatePos(bottomCenter, .5, 1), PositionTexture.CreatePos(BottomRight, 1, 1), texture, Level));
                ReadyToRender = true;
            }
            else
            {

                //process vertex list
                VertexBuffer = PrepDevice.createBuffer();
                PrepDevice.bindBuffer(GL.ARRAY_BUFFER, VertexBuffer);
                Float32Array f32array = new Float32Array(9 * 5);
                float[] buffer = (float[])(object)f32array;
                int index = 0;

                index = AddVertex(buffer, index, PositionTexture.CreatePos(bottomCenter, .5, 1)); //0
                index = AddVertex(buffer, index, PositionTexture.CreatePos(BottomLeft, 0, 1));    //1
                index = AddVertex(buffer, index, PositionTexture.CreatePos(BottomRight, 1, 1));   //2
                index = AddVertex(buffer, index, PositionTexture.CreatePos(center, .5, .5));      //3
                index = AddVertex(buffer, index, PositionTexture.CreatePos(leftCenter, 0, .5));   //4
                index = AddVertex(buffer, index, PositionTexture.CreatePos(rightCenter, 1, .5));  //5
                index = AddVertex(buffer, index, PositionTexture.CreatePos(topCenter, .5, 0));    //6
                index = AddVertex(buffer, index, PositionTexture.CreatePos(TopLeft, 0, 0));       //7
                index = AddVertex(buffer, index, PositionTexture.CreatePos(TopRight, 1, 0));      //8
                PrepDevice.bufferData(GL.ARRAY_BUFFER, f32array, GL.STATIC_DRAW);

                // process index buffers

                for (int i = 0; i < 4; i++)
                {
                    index = 0;
                    TriangleCount = 2;
                    Uint16Array ui16array = new Uint16Array(TriangleCount * 3);

                    UInt16[] indexArray = (UInt16[])(object)ui16array;
                    switch (i)
                    {
                        case 0:
                            indexArray[index++] = 7;
                            indexArray[index++] = 4;
                            indexArray[index++] = 6;
                            indexArray[index++] = 4;
                            indexArray[index++] = 3;
                            indexArray[index++] = 6;
                            break;
                        case 1:
                            indexArray[index++] = 6;
                            indexArray[index++] = 5;
                            indexArray[index++] = 8;
                            indexArray[index++] = 6;
                            indexArray[index++] = 3;
                            indexArray[index++] = 5;
                            break;
                        case 2:
                            indexArray[index++] = 4;
                            indexArray[index++] = 0;
                            indexArray[index++] = 3;
                            indexArray[index++] = 4;
                            indexArray[index++] = 1;
                            indexArray[index++] = 0;
                            break;
                        case 3:
                            indexArray[index++] = 3;
                            indexArray[index++] = 2;
                            indexArray[index++] = 5;
                            indexArray[index++] = 3;
                            indexArray[index++] = 0;
                            indexArray[index++] = 2;
                            break;
                    }
                    IndexBuffers[i] = PrepDevice.createBuffer();
                    PrepDevice.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, IndexBuffers[i]);
                    PrepDevice.bufferData(GL.ELEMENT_ARRAY_BUFFER, ui16array, GL.STATIC_DRAW);   

                }
            }
            return true;
        }

        public TangentTile(int level, int x, int y, Imageset dataset, Tile parent)
        {
            this.Parent = parent;
            this.Level = level;
            this.tileX = x;
            this.tileY = y;
            this.dataset = dataset;
            this.topDown = !dataset.BottomsUp;
            this.ComputeBoundingSphere();
        }


        protected virtual LatLngEdges GetLatLngEdges()
        {
            double tileDegrees = this.dataset.BaseTileDegrees / (Math.Pow(2, this.Level));
            LatLngEdges edges = new LatLngEdges();
            edges.latMin = (((double)this.dataset.BaseTileDegrees / 2.0 - (((double)this.tileY) * tileDegrees)) + this.dataset.OffsetY);
            edges.latMax = (((double)this.dataset.BaseTileDegrees / 2.0 - (((double)(this.tileY + 1)) * tileDegrees)) + this.dataset.OffsetY);
            edges.lngMin = ((((double)this.tileX * tileDegrees) - (double)this.dataset.BaseTileDegrees / dataset.WidthFactor) + this.dataset.OffsetX);
            edges.lngMax = (((((double)(this.tileX + 1)) * tileDegrees) - (double)this.dataset.BaseTileDegrees / dataset.WidthFactor) + this.dataset.OffsetX);
            return edges;
        }

    }
    public class LatLngEdges
    {
        public double latMin;
        public double latMax;
        public double lngMin;
        public double lngMax;
    }
}
