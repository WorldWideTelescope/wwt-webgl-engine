using System;

namespace wwtlib
{

    public class Fxyf : HealpixTables
    {

        /** x-coordinate within the basis pixel, range [0.0;1.0] */
        public double fx;
        /** y-coordinate within the basis pixel, range [0.0;1.0] */
        public double fy;
        /** index of the HEALPix basis pixel, range [0;11] */
        public int face;
        public Fxyf()
        {

        }
        public static Fxyf Create(double x, double y, int f)
        {
            Fxyf temp = new Fxyf();
            temp.fx = x;
            temp.fy = y;
            temp.face = f;
            return temp;
        }

        private static readonly double halfpi = Math.PI / 2d;

        private static readonly double inv_halfpi = 2d / Math.PI;

        private static readonly double twothird = 2d / 3d;

        private static Fxyf FromHploc(Hploc loc)
        {
            Fxyf temp = new Fxyf();
            double z = loc.z, phi = loc.phi;

            double za = Math.Abs(z);
            double tt = HealpixUtils.fmodulo((phi * Fxyf.inv_halfpi), 4.0);// in [0,4)

            if (za <= Fxyf.twothird) // Equatorial region
            {
                double temp1 = 0.5 + tt;
                double temp2 = z * 0.75;
                double jp = temp1 - temp2; // index of  ascending edge line
                double jm = temp1 + temp2; // index of descending edge line
                long ifp = (long)jp;  // in {0,4}
                long ifm = (long)jm;
                long face_num = (ifp == ifm) ? (ifp | 4) : ((ifp < ifm) ? ifp : (ifm + 8));
                temp.fx = HealpixUtils.fmodulo(jm, 1d);
                temp.fy = 1d - HealpixUtils.fmodulo(jp, 1d);
                temp.face = (int)face_num;
            }
            else // polar region, za > 2/3
            {
                int ntt = Math.Min(3, (int)tt);
                double tp = tt - ntt;
                double tmp;
                if ((za < 0.99) || (!loc.have_sth))
                {
                    tmp = Math.Sqrt(3 * (1 - za));
                } else
                {
                    tmp = loc.sth / Math.Sqrt((1d + za) / 3d);
                }

                double jp = tp * tmp; // increasing edge line index
                double jm = (1.0 - tp) * tmp; // decreasing edge line index
                if (jp >= 1d) jp = 1d; // for points too close to the boundary
                if (jm >= 1d) jm = 1d;
                if (z >= 0)
                { temp.fx = 1d - jm; temp.fy = 1d - jp; temp.face = ntt; }
                else
                { temp.fx = jp; temp.fy = jm; temp.face = ntt + 8; }
            }
            return temp;
        }

        public static Fxyf FromVector(Vector3d v)
        { 
            return Fxyf.FromHploc(Hploc.Create(v));
        }

        protected Hploc toHploc()
        {
            Hploc loc = new Hploc();
            double jr = jrll[face] - fx - fy;

            double nr; double tmp;
            if (jr < 1)
            {
                nr = jr;
                tmp = nr * nr / 3d;
                loc.z = 1 - tmp;
                if (loc.z > 0.99) { loc.sth = Math.Sqrt(tmp * (2d - tmp)); loc.have_sth = true; }
            }
            else if (jr > 3)
            {
                nr = 4 - jr;
                tmp = nr * nr / 3d;
                loc.z = tmp - 1;
                if (loc.z < -0.99) { loc.sth = Math.Sqrt(tmp * (2d - tmp)); loc.have_sth = true; }
            }
            else
            {
                nr = 1;
                loc.z = (2 - jr) * 2d / 3d;
            }

            tmp = jpll[face] * nr + fx - fy;
            if (tmp < 0) tmp += 8;
            if (tmp >= 8) tmp -= 8;
            loc.phi = (nr < 1e-15) ? 0 : (0.5 * Fxyf.halfpi * tmp) / nr;
            return loc;
        }
        public Vector3d toVec3()
        { return toHploc().toVec3(); }
    }
}