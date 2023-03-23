namespace wwtlib
{
    public class VideoOutputType
    {
        public double Fps;
        public int Width;
        public int Height;
        public int TotalFrames = 0;
        public bool WaitDownload = false;
        public string Format = "image/jpeg";

        public VideoOutputType(int width, int height, double fps, string format, bool waitDownload)
        {
            Width = width;
            Height = height;
            Fps = fps;
            Format = format;
            WaitDownload = waitDownload;
        }
    }
}
