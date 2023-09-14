using System;

namespace wwtlib
{
    public class Hploc
    {
        public double z;
        public double phi;
        public double sth;
        public bool have_sth;

        public Hploc() { }
        public static Hploc Create(Vector3d v)
        {
            Hploc temp = new Hploc();

            double xl = 1 / v.Length();
            temp.z = v.Z * xl;
            temp.phi = FastMath.atan2(v.Y, v.X);
            if (Math.Abs(temp.z) > 0.99)
            {
                temp.sth = Math.Sqrt(v.X * v.X + v.Y * v.Y) * xl;
                temp.have_sth = true;
            }
            return temp;
        }

        public Vector3d toVec3()
        {
            double st;
            if (have_sth)
            {
                st = sth;
            }
            else
            {
                st = Math.Sqrt((1.0 - z) * (1.0 + z));
            }

            double x = st * FastMath.cos(phi);
            double y = st * FastMath.sin(phi);
            return Vector3d.Create(x, z, y); 
            //Reversed the Z and Y axes
        }
    }
}