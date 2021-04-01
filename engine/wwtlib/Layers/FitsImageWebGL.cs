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

        private bool ValidateFitsSimple(DataView dataView)
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
            }

            if (header.ContainsKey("BZERO"))
            {
                BZero = Double.Parse(header["BZERO"]);
            }

            if (header.ContainsKey("BSCALE"))
            {
                BScale = Double.Parse(header["BSCALE"]);
            }

            AxisSize = new int[NumAxis];

            for (int axis = 0; axis < NumAxis; axis++)
            {
                AxisSize[axis] = Int32.Parse(header[string.Format("NAXIS{0}", axis + 1)]);
                BufferSize *= AxisSize[axis];
            }

            int bitpix = Int32.Parse(header["BITPIX"]);

            this.ReadRemainingData(dataView, bitpix);

            if (NumAxis > 1)
            {
                if (NumAxis == 3)
                {
                    if (AxisSize[2] == 3)
                    {
                        color = true;
                    }
                }

                sizeX = Width = AxisSize[0];
                sizeY = Height = AxisSize[1];
            }
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

        int BufferSize = 1;

        public Float32Array buffer;

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
                i++;
                this.position += dataUnitSize;
            }


            return buffer;
        }

        public ScaleTypes lastScale = ScaleTypes.Linear;
    }


}
