using System;

namespace wwtlib
{
    public class HealpixUtils
    {
        static public void check(bool cond, String errtxt)
        {
            if (!cond) throw new Exception(errtxt);
        }

        /** Integer base 2 logarithm.
         */
        //static public int ilog2(long arg)
        //{
        //    int res = (int)Math.Log(arg, 2);

        //    return res;
        //}


        static public int ilog2(long arg)
        {
            //	return Math.max(Math.log2(arg));
            return 63 - HealpixUtils.numberOfLeadingZeros(Math.Max(arg, 1));
        }

        static public int numberOfLeadingZeros(int i)
        {
            if (i == 0)
                return 64;
            int n = 1;
            int x = (i >> 32);
            if (x == 0) { n += 32; x = i; }
            if (x >> 16 == 0) { n += 16; x <<= 16; }
            if (x >> 24 == 0) { n += 8; x <<= 8; }
            if (x >> 28 == 0) { n += 4; x <<= 4; }
            if (x >> 30 == 0) { n += 2; x <<= 2; }
            n -= x >> 31;
            return n;
        }


        /** Integer square root.
         */
        static public int isqrt(long arg)
        {
            long res = (long)Math.Sqrt(((double)arg) + 0.5);
            if (arg < (1L << 50)) return (int)res;
            if (res * res > arg)
                --res;
            else if ((res + 1) * (res + 1) <= arg)
                ++res;
            return (int)res;
        }

        /** Computes the cosine of the angular distance between two z, phi positions
            on the unit sphere. */
        static public double cosdist_zphi(double z1, double phi1,
          double z2, double phi2)
        {
            return z1 * z2 + FastMath.cos(phi1 - phi2) * Math.Sqrt((1.0 - z1 * z1) * (1.0 - z2 * z2));
        }
        /** Computes the cosine of the angular distance between two z, phi positions
            on the unit sphere. */
        //static public double cosdist_zphi(Zphi zp1, Zphi zp2)
        //{ return cosdist_zphi(zp1.z, zp1.phi, zp2.z, zp2.phi); }


        static public double fmodulo(double v1, double v2)
        {
            if (v1 >= 0)
                return (v1 < v2) ? v1 : v1 % v2;
            double tmp = v1 % v2 + v2;
            return (tmp == v2) ? 0d : tmp;
        }

        //static public bool approx(float a, float b, float epsilon)
        //{ return Math.Abs(a - b) < (epsilon * Math.Abs(b)); }
        //static public bool approx(double a, double b, double epsilon)
        //{ return Math.Abs(a - b) < (epsilon * Math.Abs(b)); }
    }
}