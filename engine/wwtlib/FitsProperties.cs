using System;
using System.Collections.Generic;

namespace wwtlib
{
    public enum ScaleTypes {
        Linear = 0,
        Log = 1,
        Power = 2,
        SquareRoot = 3,
        HistogramEqualization = 4
    };

    public class FitsProperties
    {
        public double BZero = 0;
        public double BScale = 1;
        public bool ContainsBlanks = false;
        public double BlankValue = double.MinValue;
        public double MaxVal = double.MinValue;
        public double MinVal = double.MaxValue;
        public double UpperCut = double.MinValue;
        public double LowerCut = double.MaxValue;
        public bool TransparentBlack = false;
        public string ColorMapName = "gray";
        public ScaleTypes ScaleType = ScaleTypes.Linear;

        // This field exists to support non-HiPS tiled FITS imagesets. We need a
        // mechanism to notify callers when the top-level tile is loaded,
        // because only after that has happened is it possible to set up
        // trustworthy values for properties like LowerCut here. *HiPS* tiled
        // FITS imagesets don't need this because they have a separate top-level
        // "properties" file that can be used to trigger a callback.
        //
        // We need to load the top-level tile to properly set up the properties
        // here because (1) they can't be determined well from the level-0 tile
        // data alone, (2) we want to give the dataset author a chance to
        // customize them, and (3) the tiled FITS data-loaders don't calculate
        // min/max from the data for performance reasons. And we'd prefer not to
        // add the relevant values to the ImageSet XML definition.
        //
        // Anyway, the tangent tile image loading code will cause this action to
        // be triggered when the level-0 tile loads successfully. It would make
        // sense to also trigger this action for when a non-tiled FITS file is
        // loaded, but in that use case the existing WcsLoaded callback
        // suffices. The tiling framework already uses WcsLoaded so for that
        // case we need to add this extra hook.
        public Action<FitsImage> OnMainImageLoaded = null;

        public FitsProperties()
        {
        }

        // See description of the OnMainImageLoaded field. This method exists to
        // help non-HiPS tiled FITS datasets notify callers when the initial
        // data have loaded and these FitsProperties can be trusted.
        internal void FireMainImageLoaded(FitsImage image)
        {
            if (OnMainImageLoaded != null) {
                OnMainImageLoaded(image);
            }
        }
    }
}
