namespace wwtlib
{
    public class VideoOutputType
    {
        public string Name;
        public double Fps;
        public int Width;
        public int Height;
        public int TotalFrames = 0;
        public int StartFrame = 0;
        public bool WaitDownload = false;
        public string Format = "image/jpeg";

        public VideoOutputType(string name, int width, int height, double fps, string format, bool waitDownload)
        {
            Name = name;
            Width = width;
            Height = height;
            Fps = fps;
            Format = format;
            WaitDownload = waitDownload;
        }
    }
}
