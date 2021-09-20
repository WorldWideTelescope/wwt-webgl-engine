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
    public enum DataTypes { ByteT = 0, Int16T = 1, Int32T = 2, FloatT = 3, DoubleT = 4, None = 5 };

    //Legacy class to support JS parsing until Safari supports WebGL 2.0
    //Use FitsImage.cs if possible
    public class FitsImageJs : FitsImage
    {
        public DataTypes DataType = DataTypes.None;

        private bool color = false;
        private object DataBuffer;

        public FitsImageJs(Imageset dataset, string file, Blob blob, WcsLoaded callMeBack) : base (dataset, file, blob, callMeBack)
        {
        }
        public bool isTiledFits = false;
        public static FitsImageJs CreateTiledFits(Imageset dataset, string file, WcsLoaded callMeBack)
        {
            FitsImageJs fits = new FitsImageJs(dataset, file, null, callMeBack);
            fits.isTiledFits = true;
            return fits;
        }

        public override void ReadFromBin(DataView dataView)
        {
            base.ReadFromBin(dataView);
            if (NumAxis == 3)
            {
                if (AxisSize[2] == 3)
                {
                    color = true;
                }
            }
        }

        protected override void ReadDataUnit(DataView dataView, int bitpix)
        {
            BinaryReader br = new BinaryReader(new Uint8Array(dataView.buffer));
            br.position = position;
            switch (bitpix)
            {
                case -64:
                    DataType = DataTypes.DoubleT;
                    ReadDataUnitFloat64(br);
                    break;
                case -32:
                    DataType = DataTypes.FloatT;
                    ReadDataUnitFloat32(br);
                    break;
                case 8:
                    DataType = DataTypes.ByteT;
                    ReadDataUnitUint8(br);
                    break;
                case 16:
                    DataType = DataTypes.Int16T;
                    ReadDataUnitInt16(br);
                    break;
                case 32:
                    DataType = DataTypes.Int32T;
                    ReadDataUnitInt32(br);
                    break;
            }
            fitsProperties.LowerCut = fitsProperties.MinVal;
            fitsProperties.UpperCut = fitsProperties.MaxVal;
        }

        private void ReadDataUnitUint8(BinaryReader br)
        {
            byte[] buffer = new byte[BufferSize];
            DataBuffer = buffer;
            for (int i = 0; i < BufferSize; i++)
            {
                buffer[i] = br.ReadByte();
                if (fitsProperties.MinVal > (double)buffer[i])
                {
                    fitsProperties.MinVal = (double)buffer[i];
                }
                if (fitsProperties.MaxVal < (double)buffer[i])
                {
                    fitsProperties.MaxVal = (double)buffer[i];
                }
            }
        }

        private void ReadDataUnitInt16(BinaryReader br)
        {
            short[] buffer = new Int16[BufferSize];
            DataBuffer = buffer;
            for (int i = 0; i < BufferSize; i++)
            {
                buffer[i] = (short)((br.ReadSByte() * 256) + (short)br.ReadByte());
                if (fitsProperties.MinVal > (double)buffer[i])
                {
                    fitsProperties.MinVal = (double)buffer[i];
                }
                if (fitsProperties.MaxVal < (double)buffer[i])
                {
                    fitsProperties.MaxVal = (double)buffer[i];
                }
            }
        }

        private void ReadDataUnitInt32(BinaryReader br)
        {
            int[] buffer = new int[BufferSize];
            DataBuffer = buffer;
            for (int i = 0; i < BufferSize; i++)
            {
                buffer[i] = (br.ReadSByte() << 24) + (br.ReadSByte() << 16) + (br.ReadSByte() << 8) + br.ReadByte();
                if (fitsProperties.MinVal > (double)buffer[i])
                {
                    fitsProperties.MinVal = (double)buffer[i];
                }
                if (fitsProperties.MaxVal < (double)buffer[i])
                {
                    fitsProperties.MaxVal = (double)buffer[i];
                }
            }
        }

        private void ReadDataUnitFloat32(BinaryReader br)
        {
            float[] buffer = new float[BufferSize];
            DataBuffer = buffer;
            Uint8Array part = new Uint8Array(4);
            for (int i = 0; i < BufferSize; i++)
            {
                part[3] = br.ReadByte();
                part[2] = br.ReadByte();
                part[1] = br.ReadByte();
                part[0] = br.ReadByte();

                buffer[i] = (new Float32Array(part.buffer, 0, 1))[0];

                if (fitsProperties.MinVal > (double)buffer[i])
                {
                    fitsProperties.MinVal = (double)buffer[i];
                }
                if (fitsProperties.MaxVal < (double)buffer[i])
                {
                    fitsProperties.MaxVal = (double)buffer[i];
                }
            }
        }

        private void ReadDataUnitFloat64(BinaryReader br)
        {
            double[] buffer = new double[BufferSize];
            Uint8Array part = new Uint8Array(8);
            DataBuffer = buffer;
            for (int i = 0; i < BufferSize; i++)
            {
                part[7] = br.ReadByte();
                part[6] = br.ReadByte();
                part[5] = br.ReadByte();
                part[4] = br.ReadByte();
                part[3] = br.ReadByte();
                part[2] = br.ReadByte();
                part[1] = br.ReadByte();
                part[0] = br.ReadByte();
                buffer[i] = (new Float64Array(part.buffer, 0, 1))[0];

                if (fitsProperties.MinVal > (double)buffer[i])
                {
                    fitsProperties.MinVal = (double)buffer[i];
                }
                if (fitsProperties.MaxVal < (double)buffer[i])
                {
                    fitsProperties.MaxVal = (double)buffer[i];
                }
            }
        }

        override public Bitmap GetBitmap()
        {
            if (fitsProperties.UpperCut == 0 && fitsProperties.LowerCut == 0)
            {
                fitsProperties.LowerCut = fitsProperties.MinVal;
                fitsProperties.UpperCut = fitsProperties.MaxVal;
            }

            return GetScaledBitmap(fitsProperties.LowerCut, fitsProperties.UpperCut, fitsProperties.ScaleType, 0, fitsProperties.ColorMapName);
        }

        public Bitmap GetScaledBitmap(double min, double max, ScaleTypes scaleType, int z, string colorMapperName)
        {
            ScaleMap scale;
            fitsProperties.ScaleType = scaleType;
            fitsProperties.LowerCut = min;
            fitsProperties.UpperCut = max;
            fitsProperties.ColorMapName = colorMapperName;

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
                case ScaleTypes.HistogramEqualization:
                    scale = new HistogramEqualization(this, min, max);
                    break;
            }

            try
            {
                switch (DataType)
                {
                    case DataTypes.ByteT:
                        return GetBitmapByte(min, max, scale, 0, colorMapper);
                    case DataTypes.Int16T:
                        return GetBitmapShort(min, max, scale, 0, colorMapper);
                    case DataTypes.Int32T:
                        return GetBitmapInt(min, max, scale, 0, colorMapper);
                    case DataTypes.FloatT:
                        return GetBitmapFloat(min, max, scale, 0, colorMapper);
                    case DataTypes.DoubleT:
                        return GetBitmapDouble(min, max, scale, 0, colorMapper);
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
                bmp.SetPixel(x, y, val, val, val, (fitsProperties.TransparentBlack && val == 0) ? 0 : 255);
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
            bmp.SetPixel(x, y, (int)pixel_color.R, (int)pixel_color.G, (int)pixel_color.B, (fitsProperties.TransparentBlack && val == 0) ? 0 : 255);
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
                        if (fitsProperties.ContainsBlanks && (double)datR == fitsProperties.BlankValue)
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
                        if (fitsProperties.ContainsBlanks && (double)dataValue == fitsProperties.BlankValue)
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
                        if (fitsProperties.ContainsBlanks && (double)datR == fitsProperties.BlankValue)
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
                        if (fitsProperties.ContainsBlanks && (double)dataValue == fitsProperties.BlankValue)
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
                        if (fitsProperties.ContainsBlanks && (double)datR == fitsProperties.BlankValue)
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
                        if (fitsProperties.ContainsBlanks && (double)dataValue == fitsProperties.BlankValue)
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
                        if (fitsProperties.ContainsBlanks && (double)datR == fitsProperties.BlankValue)
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
                        if (fitsProperties.ContainsBlanks && (double)dataValue == fitsProperties.BlankValue)
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
                        if (fitsProperties.ContainsBlanks && (double)datR == fitsProperties.BlankValue)
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
                        if (fitsProperties.ContainsBlanks && (double)dataValue == fitsProperties.BlankValue)
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

        protected override void ComputeWcs()
        {
            if (!isTiledFits)
            {
                base.ComputeWcs();
            }
        }

        protected override void PopulateHistogram(int[] histogram)
        {
            switch (DataType)
            {
                case DataTypes.ByteT:
                    PopulateHistogramByte(histogram);
                    break;
                case DataTypes.Int16T:
                    PopulateHistogramInt16(histogram);
                    break;
                case DataTypes.Int32T:
                    PopulateHistogramInt32(histogram);
                    break;
                case DataTypes.FloatT:
                    PopulateHistogramFloat(histogram);
                    break;
                case DataTypes.DoubleT:
                    PopulateHistogramDouble(histogram);
                    break;
            }
        }

        private void PopulateHistogramDouble(int[] histogram)
        {
            int buckets = histogram.Length;
            double[] buf = (double[])DataBuffer;
            double factor = (fitsProperties.MaxVal - fitsProperties.MinVal) / buckets;

            foreach (double val in buf)
            {
                if (!(val == double.NaN))
                {
                    histogram[Math.Min(buckets - 1, (int)((val - fitsProperties.MinVal) / factor))]++;
                }
            }
        }

        private void PopulateHistogramFloat(int[] histogram)
        {
            int buckets = histogram.Length;
            float[] buf = (float[])DataBuffer;
            double factor = (fitsProperties.MaxVal - fitsProperties.MinVal) / buckets;

            foreach (float val in buf)
            {
                if (!(val == NaN))
                {
                    histogram[Math.Min(buckets - 1, (int)((val - fitsProperties.MinVal) / factor))]++;
                }
            }
        }

        private void PopulateHistogramInt32(int[] histogram)
        {
            int buckets = histogram.Length;
            Int32[] buf = (Int32[])DataBuffer;
            double factor = (fitsProperties.MaxVal - fitsProperties.MinVal) / buckets;

            foreach (Int32 val in buf)
            {
                histogram[Math.Min(buckets - 1, (int)((val - fitsProperties.MinVal) / factor))]++;
            }
        }

        private void PopulateHistogramInt16(int[] histogram)
        {
            int buckets = histogram.Length;
            short[] buf = (short[])DataBuffer;
            double factor = (fitsProperties.MaxVal - fitsProperties.MinVal) / buckets;

            foreach (Int16 val in buf)
            {
                histogram[Math.Min(buckets - 1, (int)((val - fitsProperties.MinVal) / factor))]++;
            }
        }

        private void PopulateHistogramByte(int[] histogram)
        {
            int buckets = histogram.Length;
            Byte[] buf = (Byte[])DataBuffer;
            double factor = (fitsProperties.MaxVal - fitsProperties.MinVal) / buckets;

            foreach (Byte val in buf)
            {
                histogram[Math.Min(buckets - 1, (int)((val - fitsProperties.MinVal) / factor))]++;
            }
        }

    }


    public abstract class ScaleMap
    {
        public abstract byte Map(double val);
    }

    public class ScaleLinear : ScaleMap
    {
        double min;
        double max;
        double factor;
        double logFactor;
        public ScaleLinear(double min, double max)
        {
            this.min = min;
            this.max = max;
            factor = max - min;
        }

        public override byte Map(double val)
        {
            return (Byte)Math.Min(255, Math.Max(0, (int)((double)(val - min) / factor * 255)));
        }
    }

    public class ScaleLog : ScaleMap
    {
        double min;
        double max;
        double factor;
        double logFactor;
        public ScaleLog(double min, double max)
        {
            this.min = min;
            this.max = max;
            factor = max - min;
            logFactor = 255 / Math.Log(255);
        }

        public override byte Map(double val)
        {
            return (Byte)Math.Min(255, Math.Max(0, (int)((double)Math.Log((val - min) / factor * 255) * logFactor)));
        }
    }

    public class ScalePow : ScaleMap
    {
        double min;
        double max;
        double factor;
        double powFactor;
        public ScalePow(double min, double max)
        {
            this.min = min;
            this.max = max;
            factor = max - min;
            powFactor = 255 / Math.Pow(255, 2);
        }

        public override byte Map(double val)
        {
            return (Byte)Math.Min(255, Math.Max(0, (int)((double)Math.Pow((val - min) / factor * 255, 2) * powFactor)));
        }
    }

    public class ScaleSqrt : ScaleMap
    {
        double min;
        double max;
        double factor;
        double sqrtFactor;
        public ScaleSqrt(double min, double max)
        {
            this.min = min;
            this.max = max;
            factor = max - min;
            sqrtFactor = 255 / Math.Sqrt(255);
        }

        public override byte Map(double val)
        {
            return (Byte)Math.Min(255, Math.Max(0, (int)((double)Math.Sqrt((val - min) / factor * 255) * sqrtFactor)));
        }
    }

    public class HistogramEqualization : ScaleMap
    {
        double min;
        double max;
        double factor;
        int[] Histogram;
        int maxHistogramValue = 1;
        Byte[] lookup;
        const int buckets = 10000;
        public HistogramEqualization(FitsImageJs image, double min, double max)
        {
            this.min = min;
            this.max = max;
            factor = max - min;
            Histogram = image.ComputeHistogram(buckets);
            maxHistogramValue = Histogram[buckets];
            lookup = new Byte[buckets];
            int totalCounts = (int)(image.SizeX * image.SizeY);
            int sum = 0;
            for (int i = 0; i < buckets; i++)
            {
                sum += Histogram[i];
                lookup[i] = (Byte)(Math.Min(255, ((sum * 255.0)) / totalCounts) + .5);
            }
        }

        public override byte Map(double val)
        {
            return (Byte)lookup[Math.Min(buckets - 1, Math.Max(0, (int)((double)(val - min) / factor * (buckets - 1.0))))];
        }
    }
}
