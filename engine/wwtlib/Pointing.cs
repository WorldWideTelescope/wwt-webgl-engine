using System;

namespace wwtlib
{
    public class Pointing
    {
        /** Colatitude in radians (0 is North Pole; Pi is South Pole) */
        public double theta;

        /** Longitude in radians */
        public double phi;

        /** Default constructor */
        public Pointing() { }

        //public static Pointing Create(Pointing ptg)
        //{
        //    Pointing temp = new Pointing();
        //    temp.theta = ptg.theta; 
        //    temp.phi = ptg.phi;
        //    return temp;
        //}

        /** Simple constructor initializing both values.
            @param theta in radians [0,Pi]
            @param phi in radians [0,2*Pi] */
        public static Pointing Create(double theta, double phi)
        {
            Pointing temp = new Pointing();
            temp.theta = theta;
            temp.phi = phi;
            return temp;
        }

        //public static Pointing Create(Vector3d vec)
        //{
        //    Pointing temp = new Pointing();
        //    temp.theta = FastMath.atan2(Math.Sqrt(vec.X * vec.X + vec.Y * vec.Y), vec.Z);
        //    temp.phi = FastMath.atan2(vec.Y, vec.X);
        //    if (temp.phi < 0d)
        //    {
        //        temp.phi += 2 * Math.PI;
        //    }
        //    if (temp.phi >= 2 * Math.PI)
        //    {
        //        temp.phi -= 2 * Math.PI;
        //    }
        //    return temp;
        //}


        //public static Pointing Create(Zphi zphi)
        //{
        //    Pointing temp = new Pointing();
        //    double xy = Math.Sqrt((1d - zphi.z) * (1d + zphi.z));
        //    temp.theta = FastMath.atan2(xy, zphi.z); 
        //    temp.phi = zphi.phi;
        //    return temp;
        //}

        /** Normalize theta range */
        public void normalizeTheta()
        {
            theta = HealpixUtils.fmodulo(theta, 2 * Math.PI);
            if (theta > Math.PI)
            {
                phi += Math.PI;
                theta = 2 * Math.PI - theta;
            }
        }

        /** Normalize theta and phi ranges */
        public void normalize()
        {
            normalizeTheta();
            phi = HealpixUtils.fmodulo(phi, 2 * Math.PI);
        }

        public String toString()
        {
            StringBuilder s = new StringBuilder();
            s.Append("ptg("); s.Append(theta);
            s.Append(","); s.Append(phi);
            s.Append(")");
            return s.ToString();
        }


    }
}