+++
title = "Getting Started"
weight = 100
+++

While the WWT WebGL engine is a sophisticated piece of code, its external
interface resembles that of many other Web libraries. Here is a simple HTML
file that embeds an interactive WWT viewer:

```html
<!doctype html>
<html lang="en">
  <head>
    <title>My First WWT Application</title>
    <script src="http://www.worldwidetelescope.org/webclient/sdk/wwtsdk.js"></script>
    <!--[if IE]> <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script><![endif]-->
  </head>
  <body>
    <div id="wwtcanvas" style="width: 750px; height: 750px"></div>

    <script type="text/javascript">
function init_wwt() {
    wwtlib.WWTControl.initControlParam('wwtcanvas', true);
}

window.addEventListener('load', init_wwt);
    </script>
  </body>
</html>
```

The key elements are:

1. The `<script>` tag in the `<head>` section that loads up the WWT WebGL
   engine. You interface with this library via a global variable named
   `wwtlib`.
2. A `<div>` element that becomes home for the WWT viewport.
3. A JavaScript shim that calls the function
   **WWTControl.initControlParam()** to initialize the engine and start it
   rendering.

The ["simple viewer" example] in our collection of [WebGL engine examples]
demonstrates what you get in such a webpage. (Although the code used in that
example is not quite identical to what we show above.) You can pan around and
use the scroll wheel to zoom in, providing an interface reminiscent of popular
Earth map web apps. The detailed map of the sky shown in this example, which
derives from the [Digitized Sky Survey], totals up to about a terabyte of
data! The WWT WebGL engine streams the data to your browser as you navigate.

["simple viewer" example]: http://webhosted.wwt-forum.org/webengine-examples/#simple-viewer
[WebGL engine examples]: http://webhosted.wwt-forum.org/webengine-examples/
[Digitized Sky Survey]: https://en.wikipedia.org/wiki/Digitized_Sky_Survey

If you leave your browser window open, you may notice your CPU fans kicking
in. This is because the WWT engine’s display is informed by a real-time
simulation of the known universe. If you centered your display on the Sun and
came back a day later, you would see that the Sun had moved a little bit
relative to the background stars while you were gone. The WWT engine has a
“3D” mode in which you can speed up time and watch the planets of the Solar
System as they spin and orbit the Sun.


# Controlling the Engine

You can only start up one WWT rendering engine per webpage. (If you want
multiple engines in the same view, use `<iframe>` elements.) You interact with
the engine through two singleton objects: an instance of the
**ScriptInterface** class and an instance of the **WWTControl** class. You
can obtain these singletons and start using them after a **ready** event is
fired:

```js
function on_ready() {
    // This is how you get the ScriptInterface singleton:
    var wwt_si = wwtlib.WWTControl.scriptInterface;
    wwt_si.settings.set_showCrosshairs(false);

    // It's generally only needed in specialized
    // circumstances, but for reference, this is how
    // you get the WWTControl singleton:
    var wwt_ctl = wwtlib.WWTControl.singleton;
}

// This is how you create the ScriptInterface singleton:
var wwt_si = wwtlib.WWTControl.initControlParam('wwtcanvas', true);
wwt_si.add_ready(on_ready);
```

Once you have these objects, you can do things like
send the view to a particular location, play a tour, or
change the imagery being displayed.


# Loading Data

WWT is a visual engine, so the odds are good that at some point you’ll want to
load more data into it. The [WWT Data Files Reference] aims to document the
kinds of assets used by the WWT ecosystem.

[WWT Data Files Reference]: https://worldwidetelescope.gitbook.io/data-files-reference/
