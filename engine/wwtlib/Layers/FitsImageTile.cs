using System;
using System.Collections.Generic;
using System.Html;
using System.Html.Data.Files;
using System.Html.Media.Graphics;

namespace wwtlib
{
    public class FitsImageTile : FitsImage
    {
        public FitsImageTile(Imageset dataset, string file, WcsLoaded callMeBack) : base(dataset, file, null, callMeBack)
        {
        }

        // Min & Max are already known for pyramid FITS.
        // To improve performance, the below per pixel methods are overriden
        protected override void ReadDataUnitFloat64(DataView dataView)
        {
            int i = 0;
            while (this.position < dataView.byteLength)
            {
                dataUnit[i] = dataView.getFloat64(this.position, false);
                i++;
                this.position += 8;
            }
        }

        protected override void ReadDataUnitFloat32(DataView dataView)
        {
            int i = 0;
            while (this.position < dataView.byteLength)
            {
                dataUnit[i] = dataView.getFloat32(this.position, false);
                i++;
                this.position += 4;
            }
        }
        protected override void ReadDataUnitUint8(DataView dataView)
        {
            int i = 0;
            while (this.position < dataView.byteLength)
            {
                dataUnit[i] = dataView.getUint8(this.position);
                i++;
                this.position += 1;
            }
        }
        protected override void ReadDataUnitInt16(DataView dataView)
        {
            int i = 0;
            while (this.position < dataView.byteLength)
            {
                dataUnit[i] = dataView.getInt16(this.position, false);
                i++;
                this.position += 2;
            }
        }

        protected override void ReadDataUnitInt32(DataView dataView)
        {
            int i = 0;
            while (this.position < dataView.byteLength)
            {
                dataUnit[i] = dataView.getInt32(this.position, false);
                i++;
                this.position += 4;
            }
        }

        protected override void ComputeWcs()
        {
        }

    }
}
