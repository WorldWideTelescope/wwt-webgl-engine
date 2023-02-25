// MainView.cs
//

using System;
using System.Collections.Generic;
using System.Html;
using System.Runtime.CompilerServices;
using System.Html.Media.Graphics;
using System.Net;
using System.Serialization;

namespace wwtlib
{    
    internal static class MainView
    {
        static MainView()
        {
            Script.Literal("if (typeof document === \"undefined\") { canvas = null; return; }");
            CanvasElement canvas = (CanvasElement)Document.GetElementById("canvas");
        }

        static void DrawTest()
        {
            CanvasElement canvas = (CanvasElement) Document.GetElementById("canvas");

            CanvasContext2D ctx = (CanvasContext2D) canvas.GetContext(Rendering.Render2D);

            ctx.FillStyle = "rgb(80,0,0)";
            ctx.FillRect(120, 120, 165, 160);

            ctx.FillStyle = "rgba(0, 0, 160, 0.5)";
            ctx.FillRect(140, 140, 165, 160);

        }
    }
}
