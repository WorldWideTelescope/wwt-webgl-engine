using System;
using System.Collections.Generic;
using System.Linq;
using System.Html;
using System.Xml;
using System.Net;
using System.Html.Data.Files;
using System.Html.Media.Graphics;

namespace wwtlib
{
    public class FitsImageWebGL : WcsImage
    {
        Dictionary<String, String> header = new Dictionary<string, string>();
        public static FitsImageWebGL Last = null;

        private WcsLoaded callBack;

        public bool isHipsTile = false;

        public bool errored = false;
        public static FitsImageWebGL CreateHipsTile(string file, WcsLoaded callMeBack)
        {
            FitsImageWebGL fits = new FitsImageWebGL(file, null, callMeBack);
            fits.isHipsTile = true;
            return fits;
        }

        public FitsImageWebGL(string file, Blob blob, WcsLoaded callMeBack)
        {
            Last = this;
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

        WebFile webFile;

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
                Script.Literal("console.log({0})", webFile.Message);
                errored = true;
                if (callBack != null)
                {
                    callBack.Invoke(this);
                }

            }
            else if (webFile.State == StateType.Received)
            {
                System.Html.Data.Files.Blob mainBlob = (System.Html.Data.Files.Blob)webFile.GetBlob();
                ReadFromBlob(mainBlob);
            }
        }

        public Blob sourceBlob = null;

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

        private void ReadFromBin(DataView dataView)
        {
            ParseHeader(dataView);
        }


        public int Width = 0;
        public int Height = 0;
        public int NumAxis = 0;
        public double BZero = 0;
        public double BScale = 1;
        public int[] AxisSize;
        public object DataBuffer;
        public DataTypes DataType = DataTypes.None;
        public bool ContainsBlanks = false;
        public double BlankValue = double.MinValue;
        public static double MaxVal = double.MinValue;
        public static double MinVal = double.MaxValue;
        public bool TransparentBlack = true;

        public int lastMin = 0;
        public int lastMax = 255;
        bool color = false;
        private bool parseSuccessful = false;
        private int position = 0;

        public static bool IsGzip(BinaryReader br)
        {

            byte[] line = br.ReadBytes(2);
            br.Seek(0);
            if (line[0] == 31 && line[1] == 139)
            {
                return true;
            }
            else
            {
                return false;
            }
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

        private bool ValidateFitsSimple (DataView dataView)
        {
            string data = this.ReadByteString(dataView, 8);
            string keyword = data.TrimEnd();
            this.position -= 8;
            return keyword.ToUpperCase() == "SIMPLE";
        }

        public void ParseHeader(DataView dataView)
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
                            values = data.Substring(10).Split("/");
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

            ContainsBlanks = header.ContainsKey("BLANK");

            if (ContainsBlanks)
            {
                BlankValue = Double.Parse(header["BLANK"]);
                FitsShader.BlankValue = (float)BlankValue;
            }

            if (header.ContainsKey("BZERO"))
            {
                BZero = Double.Parse(header["BZERO"]);
                FitsShader.BZero = (float)BZero;
            }

            if (header.ContainsKey("BSCALE"))
            {
                BScale = Double.Parse(header["BSCALE"]);
                FitsShader.BScale = (float)BScale;
            }

            AxisSize = new int[NumAxis];

            for (int axis = 0; axis < NumAxis; axis++)
            {
                AxisSize[axis] = Int32.Parse(header[string.Format("NAXIS{0}", axis + 1)]);
                BufferSize *= AxisSize[axis];
            }

            int bitpix = Int32.Parse(header["BITPIX"]);

            this.ReadRemainingData(dataView, bitpix);
            //this.DataType = DataTypes.ByteT;

            //switch (bitsPix)
            //{
            //    case 8:
            //        this.DataType = DataTypes.ByteT;
            //        InitDataBytes(dataView, "getInt8");
            //        break;
            //    case 16:
            //        this.DataType = DataTypes.Int16T;
            //        InitDataShort(br);
            //        break;
            //    case 32:
            //        this.DataType = DataTypes.Int32T;
            //        InitDataInt(br);
            //        break;
            //    case -32:
            //        this.DataType = DataTypes.FloatT;
            //        InitDataFloat(br);
            //        break;
            //    case -64:
            //        this.DataType = DataTypes.DoubleT;
            //        InitDataDouble(br);
            //        break;
            //    default:
            //        this.DataType = DataTypes.None;
            //        break;
            //}

            if (NumAxis > 1)
            {
                if (NumAxis == 3)
                {
                    if (AxisSize[2] == 3)
                    {
                        color = true;
                    }
                }

                if (NumAxis > 2)
                {
                    sizeZ = Depth = AxisSize[2];
                    lastBitmapZ = (int)(sizeZ / 2);
                }
                sizeX = Width = AxisSize[0];
                sizeY = Height = AxisSize[1];
            }
            parseSuccessful = true;
        }

        private int sizeZ = 1;
        public int Depth = 1;

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

        private void ComputeWcs()
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

        int BufferSize = 1;

        //WebGLArray webGlArray = new WebGLArray();

        //public class WebGlArrayFits : WebGLArray
        //{
        //    public WebGlArrayFits(WebGLArrayBuffer buffer)
        //    {
        //        this.buffer = buffer;
        //        new Uint8Array(2);
        //    }
        //}
        public Float32Array buffer;
        //private void InitDataBytes(DataView dataView)
        //{
        //    //webGlArray.buffer = new WebGLArrayBuffer();
        //    //DataBuffer = buffer;
        //    buffer = br.ReadRemainingI16(BufferSize);
        //    //for (int i = 0; i < BufferSize; i++)
        //    //{
        //    //    this.position += 1;
        //        //if (MinVal > (double)buffer[i])
        //        //{
        //        //    MinVal = (double)buffer[i];
        //        //}
        //        //if (MaxVal < (double)buffer[i])
        //        //{
        //        //    MaxVal = (double)buffer[i];
        //        //}
        //    //}
        //}

        private Float32Array ReadRemainingData(DataView dataView, int bitpix)
        {
            int i = 0;
            buffer = new Float32Array(this.BufferSize);
            int dataUnitSize = Math.Abs(bitpix) / 8;
            while (this.position < dataView.byteLength)
            {
                switch (bitpix)
                {
                    case -64:
                        buffer[i] = dataView.getFloat64(this.position, false);
                        break;
                    case -32:
                        buffer[i] = dataView.getFloat32(this.position, false);
                        break;
                    case 8:
                        buffer[i] = dataView.getInt8(this.position, false);
                        break;
                    case 16:
                        buffer[i] = dataView.getInt16(this.position, false);
                        break;
                    case 32:
                        buffer[i] = dataView.getInt32(this.position, false);
                        break;
                    case 64:
                        //buffer[i] = dataView.getInt64(this.position, false);
                        break;
                }
                if (buffer[i] != this.BlankValue)
                {
                    if (buffer[i] < MinVal)
                    {
                        MinVal = buffer[i];
                    }
                    if (buffer[i] > MaxVal)
                    {
                        MaxVal = buffer[i];
                    }
                }
                i++;
                this.position += dataUnitSize;
            }

            
            FitsShader.Min = (float)(this.BZero + MinVal * this.BScale);
            FitsShader.Max = (float)(this.BZero + MaxVal * this.BScale);

            return buffer;
        }

        public ScaleTypes lastScale = ScaleTypes.Linear;
        public double lastBitmapMin = 0;
        public double lastBitmapMax = 0;
        public int lastBitmapZ = 0;
        public string lastBitmapColorMapperName = null;

        override public Bitmap GetBitmap()
        {
            if (lastBitmapMax == 0 && lastBitmapMin == 0)
            {
                lastBitmapMin = MinVal;
                lastBitmapMax = MaxVal;
            }

            return GetScaledBitmap(lastBitmapMin, lastBitmapMax, lastScale, lastBitmapZ, lastBitmapColorMapperName);
        }

        public Bitmap GetScaledBitmap(double min, double max, ScaleTypes scaleType, int z, string colorMapperName)
        {
            z = Math.Min(z, sizeZ);
            ScaleMap scale;
            lastScale = scaleType;
            lastBitmapMin = min;
            lastBitmapMax = max;
            lastBitmapZ = z;
            lastBitmapColorMapperName = colorMapperName;

            ColorMapContainer colorMapper = ColorMapContainer.FromNamedColormap(colorMapperName);

            switch (scaleType)
            {
                default:
                case ScaleTypes.Linear:
                    scale = new ScaleLinear(min, max);
                    break;
                case ScaleTypes.Log:
                    scale = new ScaleLog(min, max);
                    break;
                case ScaleTypes.Power:
                    scale = new ScalePow(min, max);
                    break;
                case ScaleTypes.SquareRoot:
                    scale = new ScaleSqrt(min, max);
                    break;
            }

            try
            {
                switch (DataType)
                {
                    case DataTypes.ByteT:
                        return GetBitmapByte(min, max, scale, lastBitmapZ, colorMapper);
                    case DataTypes.Int16T:
                        return GetBitmapShort(min, max, scale, lastBitmapZ, colorMapper);
                    case DataTypes.Int32T:
                        return GetBitmapInt(min, max, scale, lastBitmapZ, colorMapper);
                    case DataTypes.FloatT:
                        return GetBitmapFloat(min, max, scale, lastBitmapZ, colorMapper);
                    case DataTypes.DoubleT:
                        return GetBitmapDouble(min, max, scale, lastBitmapZ, colorMapper);
                    case DataTypes.None:
                    default:
                        return  Bitmap.Create(100, 100);
                }
            }
            catch
            {
                return Bitmap.Create(10, 10);
            }
        }

        private void SetPixelWithColorMap(Bitmap bmp, int x, int y, Byte val, ColorMapContainer colorMapper) {
            if (colorMapper == null) {
                bmp.SetPixel(x, y, val, val, val, (TransparentBlack && val == 0) ? 0 : 255);
                return;
            }

            float pixel_value = (float)val / 255;
            if (pixel_value != pixel_value) {
                // The above test is an unpleasant way of checking if
                // pixel_value is NaN, since ScriptSharp seems not to support
                // Float.IsNaN(). This case "can't happen" in C#, but due to
                // JavaScript's numerical model, it *can* in the transpiled
                // SDK.
                bmp.SetPixel(x, y, 0, 0, 0, 0);
                return;
            }

            Color pixel_color = colorMapper.FindClosestColor(pixel_value);
            bmp.SetPixel(x, y, (int)pixel_color.R, (int)pixel_color.G, (int)pixel_color.B, (TransparentBlack && val == 0) ? 0 : 255);
        }

        private Bitmap GetBitmapByte(double min, double max, ScaleMap scale, int z, ColorMapContainer colorMapper)
        {
            byte[] buf = (byte[])DataBuffer;
            double factor = max - min;
            int stride = AxisSize[0];
            int page = AxisSize[0] * AxisSize[1] * z;
            Bitmap bmp = Bitmap.Create(AxisSize[0], AxisSize[1]);

            for (int y = 0; y < AxisSize[1]; y++)
            {
                int indexY = ((AxisSize[1] - 1) - y);

                for (int x = 0; x < AxisSize[0]; x++)
                {
                    if (color)
                    {
                        int datR = buf[(x + indexY * stride)];
                        int datG = buf[(x + indexY * stride) + page];
                        int datB = buf[(x + indexY * stride) + page * 2];
                        if (ContainsBlanks && (double)datR == BlankValue)
                        {
                            bmp.SetPixel(x, y, 0, 0, 0, 0);
                        }
                        else
                        {
                            int r = scale.Map(datR);
                            int g = scale.Map(datG);
                            int b = scale.Map(datB);
                            bmp.SetPixel(x, y, r, g, b, 255);
                        }
                    }
                    else
                    {
                        int dataValue = buf[x + indexY * stride + page];
                        if (ContainsBlanks && (double)dataValue == BlankValue)
                        {
                            bmp.SetPixel(x, y, 0, 0, 0, 0);
                        }
                        else
                        {
                            Byte val = scale.Map(dataValue);
                            SetPixelWithColorMap(bmp, x, y, val, colorMapper);
                        }
                    }
                }
            }
            return bmp;
        }

        private Bitmap GetBitmapDouble(double min, double max, ScaleMap scale, int z, ColorMapContainer colorMapper)
        {
            double[] buf = (double[])DataBuffer;
            double factor = max - min;
            int stride = AxisSize[0];
            int page = AxisSize[0] * AxisSize[1] * z ;
            Bitmap bmp = Bitmap.Create(AxisSize[0], AxisSize[1]);

            for (int y = 0; y < AxisSize[1]; y++)
            {
                int indexY = ((AxisSize[1] - 1) - y);
                for (int x = 0; x < AxisSize[0]; x++)
                {
                    if (color)
                    {
                        double datR = buf[(x + indexY * stride)];
                        double datG = buf[(x + indexY * stride) + page];
                        double datB = buf[(x + indexY * stride) + page * 2];
                        if (ContainsBlanks && (double)datR == BlankValue)
                        {
                            bmp.SetPixel(x, y, 0, 0, 0, 0);
                        }
                        else
                        {
                            int r = scale.Map(datR);
                            int g = scale.Map(datG);
                            int b = scale.Map(datB);
                            bmp.SetPixel(x, y, r, g, b, 255);
                        }
                    }
                    else
                    {
                        double dataValue = buf[x + indexY * stride + page];
                        if (ContainsBlanks && (double)dataValue == BlankValue)
                        {
                            bmp.SetPixel(x, y, 0, 0, 0, 0);
                        }
                        else
                        {
                            Byte val = scale.Map(dataValue);
                            SetPixelWithColorMap(bmp, x, y, val, colorMapper);
                        }
                    }
                }
            }
            return bmp;
        }

        private Bitmap GetBitmapFloat(double min, double max, ScaleMap scale, int z, ColorMapContainer colorMapper)
        {
            float[] buf = (float[])DataBuffer;
            double factor = max - min;
            int stride = AxisSize[0];
            int page = AxisSize[0] * AxisSize[1] * z;
            Bitmap bmp = Bitmap.Create(AxisSize[0], AxisSize[1]);

            for (int y = 0; y < AxisSize[1]; y++)
            {
                int indexY = ((AxisSize[1] - 1) - y);
                for (int x = 0; x < AxisSize[0]; x++)
                {
                    if (color)
                    {
                        double datR = buf[(x + indexY * stride)];
                        double datG = buf[(x + indexY * stride) + page];
                        double datB = buf[(x + indexY * stride) + page * 2];
                        if (ContainsBlanks && (double)datR == BlankValue)
                        {
                            bmp.SetPixel(x, y, 0, 0, 0, 0);
                        }
                        else
                        {
                            int r = scale.Map(datR);
                            int g = scale.Map(datG);
                            int b = scale.Map(datB);
                            bmp.SetPixel(x, y, r, g, b, 255);
                        }
                    }
                    else
                    {
                        double dataValue = buf[x + indexY * stride + page];
                        if (ContainsBlanks && (double)dataValue == BlankValue)
                        {
                            bmp.SetPixel(x, y, 0, 0, 0, 0);
                        }
                        else
                        {
                            Byte val = scale.Map(dataValue);
                            SetPixelWithColorMap(bmp, x, y, val, colorMapper);
                        }
                    }
                }
            }
            return bmp;
        }

        private Bitmap GetBitmapInt(double min, double max, ScaleMap scale, int z, ColorMapContainer colorMapper)
        {
            int[] buf = (int[])DataBuffer;
            double factor = max - min;
            int stride = AxisSize[0];
            int page = AxisSize[0] * AxisSize[1] * z;
            Bitmap bmp = Bitmap.Create(AxisSize[0], AxisSize[1]);

            for (int y = 0; y < AxisSize[1]; y++)
            {
                int indexY = ((AxisSize[1] - 1) - y);
                for (int x = 0; x < AxisSize[0]; x++)
                {
                    if (color)
                    {
                        int datR = buf[(x + indexY * stride)];
                        int datG = buf[(x + indexY * stride) + page];
                        int datB = buf[(x + indexY * stride) + page * 2];
                        if (ContainsBlanks && (double)datR == BlankValue)
                        {
                            bmp.SetPixel(x, y, 0, 0, 0, 0);
                        }
                        else
                        {
                            int r = scale.Map(datR);
                            int g = scale.Map(datG);
                            int b = scale.Map(datB);
                            bmp.SetPixel(x, y, r, g, b, 255);
                        }
                    }
                    else
                    {
                        int dataValue = buf[x + indexY * stride + page];
                        if (ContainsBlanks && (double)dataValue == BlankValue)
                        {
                            bmp.SetPixel(x, y, 0, 0, 0, 0);
                        }
                        else
                        {
                            Byte val = scale.Map(dataValue);
                            SetPixelWithColorMap(bmp, x, y, val, colorMapper);
                        }
                    }
                }
            }

            return bmp;
        }
        public Bitmap GetBitmapShort(double min, double max, ScaleMap scale, int z, ColorMapContainer colorMapper)
        {
            short[] buf = (short[])DataBuffer;
            double factor = max - min;
            int stride = AxisSize[0];
            int page = AxisSize[0] * AxisSize[1] * z;
            Bitmap bmp = Bitmap.Create(AxisSize[0], AxisSize[1]);

            for (int y = 0; y < AxisSize[1]; y++)
            {
                int indexY = ((AxisSize[1] - 1) - y);

                for (int x = 0; x < AxisSize[0]; x++)
                {
                    if (color)
                    {
                        int datR = buf[(x + indexY * stride)];
                        int datG = buf[(x + indexY * stride) + page];
                        int datB = buf[(x + indexY * stride) + page * 2];
                        if (ContainsBlanks && (double)datR == BlankValue)
                        {
                            bmp.SetPixel(x, y, 0, 0, 0, 0);
                        }
                        else
                        {
                            int r = scale.Map(datR);
                            int g = scale.Map(datG);
                            int b = scale.Map(datB);
                            bmp.SetPixel(x, y, r, g, b, 255);
                        }
                    }
                    else
                    {
                        int dataValue = buf[x + indexY * stride + page];
                        if (ContainsBlanks && (double)dataValue == BlankValue)
                        {
                            bmp.SetPixel(x, y, 0, 0, 0, 0);
                        }
                        else
                        {
                            Byte val = scale.Map(dataValue);
                            SetPixelWithColorMap(bmp, x, y, val, colorMapper);
                        }
                    }

                }
            }
            return bmp;
        }
    }


}
