using System;

namespace wwtlib
{
    public class Hploc
    {
        public double z;
        public double phi;
        public double sth;
        public bool have_sth;

        /** Default constructor. */
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
      //  public static Hploc Create(Zphi zphi)
      //  {
      //      Hploc temp = new Hploc();
      //      temp.z = zphi.z;
      //      temp.phi = zphi.phi;
      //      temp.have_sth = false;
      //      return temp;
      //  }
      //  public static Hploc Create(Pointing ptg)
      //  {
      //      Hploc temp = new Hploc();
      //      HealpixUtils.check((ptg.theta >= 0d) && (ptg.theta <= Math.PI),
      //"invalid theta value");
      //      temp.z = FastMath.cos(ptg.theta);
      //      temp.phi = ptg.phi;
      //      if (Math.Abs(temp.z) > 0.99)
      //      {
      //          temp.sth = FastMath.sin(ptg.theta);
      //          temp.have_sth = true;
      //      }
      //      return temp;
      //  }

        public Zphi toZphi()
        { return Zphi.Create(z, phi); }

        public Pointing toPointing()
        {
            double st;
            if (have_sth)
            {
                st = sth;
            } else
            {
                st = Math.Sqrt((1.0 - z)  * (1.0 + z));
            }

            return Pointing.Create(FastMath.atan2(st, z), phi);
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
            return Vector3d.Create(x, y, z);
            //return Vector3d.Create(-x, z, -y);



            //return new Vector3d(x, z, y); //for planet

            //switch (Earth3d.DebugValue)
            //{
            //    case 1: return new Vector3d(x, z, y);
            //    case 2: return new Vector3d(x, z, -y);
            //    case 3: return new Vector3d(-x, z, -y);
            //    case 4: return new Vector3d(-x, z, y);
            //    case 5: return new Vector3d(x, -z, -y);
            //    case 6: return new Vector3d(-x, z, -y);
            //    default: return new Vector3d(x, z, y);

            //}
            //Reversed the Z and Y axes

        }
    }
}