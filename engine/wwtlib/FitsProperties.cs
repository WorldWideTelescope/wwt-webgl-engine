using System;
using System.Collections.Generic;

namespace wwtlib
{

    public enum ScaleTypes { Linear = 0, Log = 1, Power = 2, SquareRoot = 3, HistogramEqualization = 4 };
    public class FitsProperties
    {
        public double BZero = 0;
        public double BScale = 1;
        public double BlankValue = double.MinValue;
        public double MaxVal = double.MinValue;
        public double MinVal = double.MaxValue;
        public double UpperCut = double.MinValue;
        public double LowerCut = double.MaxValue;
        public bool TransparentBlack = true;

        public string ColorMapName = "gray";
        public ScaleTypes ScaleType = ScaleTypes.Linear;


        public FitsProperties()
        {
        }

    }
}
