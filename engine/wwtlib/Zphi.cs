using System;

namespace wwtlib
{
    public class Zphi
    {
        /** Cosine of the colatitude, or z component of unit vector; Range [-1;1]. */
        public double z;

        /** Longitude in radians; Range [0; 2Pi]. */
        public double phi;


        public Zphi() { }

        public static Zphi Create(double z_, double phi_)
        {
            Zphi temp = new Zphi();
            temp.z = z_;
            temp.phi = phi_;
            return temp;
        }
        
        //public static Zphi Create(Vector3d v)
        //{ 
        //    Zphi temp = new Zphi();
        //    temp.z = v.Z / v.Length(); 
        //    temp.phi = FastMath.atan2(v.Y, v.X); 
        //    return temp;
        //}


        //public static Zphi Create(Pointing ptg)
        //{ 
        //    Zphi temp = new Zphi();
        //    temp.z = FastMath.cos(ptg.theta); 
        //    temp.phi = ptg.phi; 
        //    return temp;
        //}

        public String toString()
        {
            StringBuilder s = new StringBuilder();
            s.Append("zphi("); s.Append(z);
            s.Append(","); s.Append(phi);
            s.Append(")");
            return s.ToString();
        }


    }
}