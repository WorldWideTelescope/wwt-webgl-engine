using System;
using System.Collections.Generic;
using System.Html;
using System.Html.Data.Files;

namespace wwtlib
{
    public class FitsImageWebGL : WcsImage
    {
        public bool errored = false;
        public int NumAxis = 0;
        public double BZero = 0;
        public double BScale = 1;
        public int[] AxisSize;
        public bool ContainsBlanks = false;
        public double BlankValue = double.MinValue;
        public Float32Array dataUnit;

        private readonly Dictionary<String, String> header = new Dictionary<string, string>();
        private readonly WcsLoaded callBack;
        private WebFile webFile;
        private bool parseSuccessful = false;
        private int position = 0;
        private int BufferSize = 1;

        public FitsImageWebGL(string file, WcsLoaded callMeBack)
        {
            callBack = callMeBack;
            filename = file;
            GetFile(file);
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

        public void ReadFromBin(DataView dataView)
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

            this.ReadDataUnit(dataView, bitpix);

            if (NumAxis > 1)
            {
                sizeX = AxisSize[0];
                sizeY = AxisSize[1];
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

        private Float32Array ReadDataUnit(DataView dataView, int bitpix)
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
                    //ReadDataUnitInt64(dataView);
                    break;
            }

            return dataUnit;
        }

        private void ReadDataUnitFloat64(DataView dataView)
        {
            int i = 0;
            while (this.position < dataView.byteLength)
            {
                dataUnit[i] = dataView.getFloat64(this.position, false);
                i++;
                this.position += 8;
            }
        }

        private void ReadDataUnitFloat32(DataView dataView)
        {
            int i = 0;
            while (this.position < dataView.byteLength)
            {
                dataUnit[i] = dataView.getFloat32(this.position, false);
                i++;
                this.position += 4;
            }
        }
        private void ReadDataUnitUint8(DataView dataView)
        {
            int i = 0;
            while (this.position < dataView.byteLength)
            {
                dataUnit[i] = dataView.getUint8(this.position);
                i++;
                this.position += 1;
            }
        }
        private void ReadDataUnitInt16(DataView dataView)
        {
            int i = 0;
            while (this.position < dataView.byteLength)
            {
                dataUnit[i] = dataView.getInt16(this.position, false);
                i++;
                this.position += 2;
            }
        }

        private void ReadDataUnitInt32(DataView dataView)
        {
            int i = 0;
            while (this.position < dataView.byteLength)
            {
                dataUnit[i] = dataView.getInt32(this.position, false);
                i++;
                this.position += 4;
            }
        }

    }
}
