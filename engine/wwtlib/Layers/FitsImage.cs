using System;
using System.Collections.Generic;
using System.Html;
using System.Html.Data.Files;
using System.Html.Media.Graphics;

namespace wwtlib
{
    public delegate void WcsLoaded(WcsImage wcsImage);
    public class FitsImage : WcsImage
    {
        public bool errored = false;
        public int NumAxis = 0;
        public int[] AxisSize;
        public Float32Array dataUnit;
        public int[] Histogram;
        public int HistogramMaxCount;
        public Blob sourceBlob = null;

        protected readonly Dictionary<String, String> header = new Dictionary<string, string>();
        protected const float NaN = 0f / 0f;
        protected int position = 0;
        protected int BufferSize = 1;
        protected Imageset dataset;
        protected FitsProperties fitsProperties;

        private readonly WcsLoaded callBack;
        private WebFile webFile;
        private bool parseSuccessful = false;

        public FitsImage(Imageset dataset, string file, Blob blob, WcsLoaded callMeBack)
        {
            this.dataset = dataset;
            this.fitsProperties = dataset.FitsProperties;
            callBack = callMeBack;
            filename = file;
            if (blob != null)
            {
                ReadFromBlob(blob);
            }
            else
            {
                GetFile(file);
            }
        }

        public void GetFile(string url)
        {
            webFile = new WebFile(url);
            webFile.ResponseType = "blob";
            webFile.OnStateChange = FileStateChange;
            webFile.Send();
        }

        public void FileStateChange()
        {
            if (webFile.State == StateType.Error)
            {
                errored = true;
                if (callBack != null)
                {
                    callBack.Invoke(this);
                }

            }
            else if (webFile.State == StateType.Received)
            {
                Blob mainBlob = webFile.GetBlob();
                ReadFromBlob(mainBlob);
            }
        }

        private void ReadFromBlob(Blob blob)
        {
            sourceBlob = blob;
            FileReader chunck = new FileReader();
            chunck.OnLoadEnd = delegate (System.Html.Data.Files.FileProgressEvent e)
            {
                ReadFromBin(new DataView(chunck.Result));
                errored = !parseSuccessful;
                if (callBack != null)
                {
                    callBack.Invoke(this);
                }
            };
            chunck.ReadAsArrayBuffer(blob);
        }

        private string ReadByteString(DataView dataView, int count)
        {
            string data = "";
            for (int i = 0; i < count; i++)
            {
                data += string.FromCharCode(dataView.getUint8(this.position));
                this.position++;
            }
            return data;
        }

        private bool ValidateFitsSimple(DataView dataView)
        {
            string data = this.ReadByteString(dataView, 8);
            string keyword = data.TrimEnd();
            this.position -= 8;
            return keyword.ToUpperCase() == "SIMPLE";
        }

        public virtual void ReadFromBin(DataView dataView)
        {
            if (!ValidateFitsSimple(dataView))
            {
                Script.Literal("console.log('The requested file is not a valid FITS file.')");
                return;
            }

            bool foundEnd = false;

            while (!foundEnd)
            {
                for (int i = 0; i < 36; i++)
                {
                    string data = this.ReadByteString(dataView, 80);

                    if (!foundEnd)
                    {
                        string keyword = data.Substring(0, 8).TrimEnd();
                        string[] values = data.Substring(10).Split("/");
                        if (keyword.ToUpperCase() == "END")
                        {
                            foundEnd = true;
                            // Check for XTENSION
                            i++;
                            data = this.ReadByteString(dataView, 80);
                            while (String.IsNullOrWhiteSpace(data))
                            {
                                i++;
                                data = this.ReadByteString(dataView, 80);
                            }
                            keyword = data.Substring(0, 8).TrimEnd();
                            if (keyword.ToUpperCase() == "XTENSION")
                            {
                                // We have additional headers
                                foundEnd = false;
                            }
                            else
                            {
                                // Rewind these 80 bytes which could be data
                                this.position -= 80;
                            }
                        }
                        else
                        {
                            AddKeyword(keyword, values);
                        }
                    }

                }
            }

            if (!foundEnd)
            {
                Script.Literal("console.log('Unable to parse requested FITS file.')");
                return;
            }

            NumAxis = Int32.Parse(header["NAXIS"]);

            if (header.ContainsKey("BLANK"))
            {
                fitsProperties.BlankValue = Double.Parse(header["BLANK"]);
            }

            if (header.ContainsKey("BZERO"))
            {
                fitsProperties.BZero = Double.Parse(header["BZERO"]);
            }

            if (header.ContainsKey("BSCALE"))
            {
                fitsProperties.BScale = Double.Parse(header["BSCALE"]);
            }

            AxisSize = new int[NumAxis];

            for (int axis = 0; axis < NumAxis; axis++)
            {
                AxisSize[axis] = Int32.Parse(header[string.Format("NAXIS{0}", axis + 1)]);
                BufferSize *= AxisSize[axis];
            }

            int bitpix = Int32.Parse(header["BITPIX"]);

            this.ReadDataUnit(dataView, bitpix);

            if (NumAxis > 1)
            {
                sizeX = AxisSize[0];
                sizeY = AxisSize[1];
                Histogram = ComputeHistogram(256);
                HistogramMaxCount = Histogram[256];
            }

            ComputeWcs();

            parseSuccessful = true;
        }


        private void AddKeyword(string keyword, string[] values)
        {
            if (keyword != "CONTINUE" && keyword != "COMMENT" && keyword != "HISTORY" && !String.IsNullOrEmpty(keyword))
            {
                try
                {
                    if (header.ContainsKey(keyword))
                    {
                        header[keyword] = values[0].Trim();
                    }
                    else
                    {
                        header[keyword.ToUpperCase()] = values[0].Trim();
                    }
                }
                catch
                {
                }
            }
        }

        protected virtual void ReadDataUnit(DataView dataView, int bitpix)
        {
            dataUnit = new Float32Array(this.BufferSize);
            switch (bitpix)
            {
                case -64:
                    ReadDataUnitFloat64(dataView);
                    break;
                case -32:
                    ReadDataUnitFloat32(dataView);
                    break;
                case 8:
                    ReadDataUnitUint8(dataView);
                    break;
                case 16:
                    ReadDataUnitInt16(dataView);
                    break;
                case 32:
                    ReadDataUnitInt32(dataView);
                    break;
                case 64:
                    // 64 bit integers not supported by Safari
                    Script.Literal("console.log('64 bit integer FITS are not yet supported')");
                    //ReadDataUnitInt64(dataView);
                    break;
            }

        }

        protected virtual void ReadDataUnitFloat64(DataView dataView)
        {
            int i = 0;
            while (this.position < dataView.byteLength)
            {
                dataUnit[i] = dataView.getFloat64(this.position, false);
                double physicalValue = dataUnit[i] * fitsProperties.BScale + fitsProperties.BZero;
                if (fitsProperties.MinVal > physicalValue)
                {
                    fitsProperties.MinVal = physicalValue;
                }
                if (fitsProperties.MaxVal < physicalValue)
                {
                    fitsProperties.MaxVal = physicalValue;
                }
                i++;
                this.position += 8;
            }
            fitsProperties.LowerCut = fitsProperties.MinVal;
            fitsProperties.UpperCut = fitsProperties.MaxVal;

        }

        protected virtual void ReadDataUnitFloat32(DataView dataView)
        {
            int i = 0;
            while (this.position < dataView.byteLength)
            {
                dataUnit[i] = dataView.getFloat32(this.position, false);
                double physicalValue = dataUnit[i] * fitsProperties.BScale + fitsProperties.BZero;
                if (fitsProperties.MinVal > physicalValue)
                {
                    fitsProperties.MinVal = physicalValue;
                }
                if (fitsProperties.MaxVal < physicalValue)
                {
                    fitsProperties.MaxVal = physicalValue;
                }
                i++;
                this.position += 4;
            }
            fitsProperties.LowerCut = fitsProperties.MinVal;
            fitsProperties.UpperCut = fitsProperties.MaxVal;
        }
        protected virtual void ReadDataUnitUint8(DataView dataView)
        {
            int i = 0;
            while (this.position < dataView.byteLength)
            {
                dataUnit[i] = dataView.getUint8(this.position);
                if (fitsProperties.MinVal > dataUnit[i])
                {
                    fitsProperties.MinVal = dataUnit[i];
                }
                if (fitsProperties.MaxVal < dataUnit[i])
                {
                    fitsProperties.MaxVal = dataUnit[i];
                }
                i++;
                this.position += 1;
            }
            fitsProperties.LowerCut = fitsProperties.MinVal;
            fitsProperties.UpperCut = fitsProperties.MaxVal;
        }
        protected virtual void ReadDataUnitInt16(DataView dataView)
        {
            int i = 0;
            while (this.position < dataView.byteLength)
            {
                dataUnit[i] = dataView.getInt16(this.position, false);
                if (fitsProperties.MinVal > dataUnit[i])
                {
                    fitsProperties.MinVal = dataUnit[i];
                }
                if (fitsProperties.MaxVal < dataUnit[i])
                {
                    fitsProperties.MaxVal = dataUnit[i];
                }
                i++;
                this.position += 2;
            }
            fitsProperties.LowerCut = fitsProperties.MinVal;
            fitsProperties.UpperCut = fitsProperties.MaxVal;
        }

        protected virtual void ReadDataUnitInt32(DataView dataView)
        {
            int i = 0;
            while (this.position < dataView.byteLength)
            {
                dataUnit[i] = dataView.getInt32(this.position, false);
                if (fitsProperties.MinVal > dataUnit[i])
                {
                    fitsProperties.MinVal = dataUnit[i];
                }
                if (fitsProperties.MaxVal < dataUnit[i])
                {
                    fitsProperties.MaxVal = dataUnit[i];
                }
                i++;
                this.position += 4;
            }
            fitsProperties.LowerCut = fitsProperties.MinVal;
            fitsProperties.UpperCut = fitsProperties.MaxVal;
        }

        protected virtual void ComputeWcs()
        {
            if (header.ContainsKey("CROTA2"))
            {
                rotation = double.Parse(header["CROTA2"].Trim());
                hasRotation = true;

            }

            if (header.ContainsKey("CDELT1"))
            {
                scaleX = double.Parse(header["CDELT1"].Trim());

                if (header.ContainsKey("CDELT2"))
                {
                    scaleY = double.Parse(header["CDELT2"].Trim());
                    hasScale = true;
                }
            }

            if (header.ContainsKey("CRPIX1"))
            {
                referenceX = double.Parse(header["CRPIX1"].Trim()) - 1;

                if (header.ContainsKey("CRPIX2"))
                {
                    referenceY = double.Parse(header["CRPIX2"].Trim()) - 1;
                    hasPixel = true;
                }
            }
            bool galactic = false;
            bool tan = false;

            if (header.ContainsKey("CTYPE1"))
            {
                if (header["CTYPE1"].IndexOf("GLON-") > -1)
                {
                    galactic = true;
                    tan = true;
                }
                if (header["CTYPE2"].IndexOf("GLAT-") > -1)
                {
                    galactic = true;
                    tan = true;
                }

                if (header["CTYPE1"].IndexOf("-TAN") > -1)
                {
                    tan = true;
                }
                if (header["CTYPE1"].IndexOf("-SIN") > -1)
                {
                    tan = true;
                }
            }

            if (!tan)
            {
                throw new System.Exception("Only TAN projected images are supported: ");
            }

            hasSize = true;

            if (header.ContainsKey("CRVAL1"))
            {
                centerX = Double.Parse(header["CRVAL1"].Trim());

                if (header.ContainsKey("CRVAL2"))
                {
                    centerY = double.Parse(header["CRVAL2"].Trim());
                    hasLocation = true;
                }
            }

            if (galactic)
            {
                double[] result = Coordinates.GalactictoJ2000(centerX, centerY);
                centerX = result[0];
                centerY = result[1];
            }

            if (header.ContainsKey("CD1_1") && header.ContainsKey("CD1_2")
                && header.ContainsKey("CD2_1") && header.ContainsKey("CD2_2"))
            {
                cd1_1 = double.Parse(header["CD1_1"].Trim());
                cd1_2 = double.Parse(header["CD1_2"].Trim());
                cd2_1 = double.Parse(header["CD2_1"].Trim());
                cd2_2 = double.Parse(header["CD2_2"].Trim());
                if (!hasRotation)
                {
                    CalculateRotationFromCD();
                }
                if (!hasScale)
                {
                    CalculateScaleFromCD();
                }
                hasScale = true;
                hasRotation = true;
            }


            ValidWcs = hasScale && hasRotation && hasPixel && hasLocation;
        }

        public int[] ComputeHistogram(int count)
        {
            int[] histogram = new int[count + 1];

            for (int i = 0; i < count + 1; i++)
            {
                histogram[i] = 0;
            }

            PopulateHistogram(histogram);
            int maxCounter = 1;
            foreach (int val in histogram)
            {
                if (val > maxCounter)
                {
                    maxCounter = val;
                }
            }
            histogram[count] = maxCounter;
            return histogram;
        }

        protected virtual void PopulateHistogram(int[] histogram)
        {
            int buckets = histogram.Length;
            
            double factor = (fitsProperties.MaxVal - fitsProperties.MinVal) / buckets;

            for (int i = 0; i < dataUnit.length; i++)
            {
                if (!(dataUnit[i] == NaN))
                {
                    histogram[Math.Min(buckets - 1, (int)((fitsProperties.BZero + fitsProperties.BScale * dataUnit[i] - fitsProperties.MinVal) / factor))]++;
                }
            }
        }

        public void DrawHistogram(CanvasContext2D ctx)
        {
            ctx.ClearRect(0, 0, 255, 150);
            ctx.BeginPath();
            ctx.StrokeStyle = "rgba(255,255,255,255)";
            double logMax = Math.Log(HistogramMaxCount);
            for (int i = 0; i < Histogram.Length; i++)
            {
                double height = Math.Log(Histogram[i]) / logMax;
                if (height < 0)
                {
                    height = 0;
                }

                ctx.MoveTo(i, 150);
                ctx.LineTo(i, 150 - (height * 150));
                ctx.Stroke();
            }

        }
    }
}
