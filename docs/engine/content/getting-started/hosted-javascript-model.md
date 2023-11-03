+++
title = "The Hosted JavaScript Model"
weight = 200
+++

You can get a simple WWT web application up and running with hand-coded HTML and
JavaScript. This is a “hosted” model where your HTML links to a copy of the WWT
engine hosted by the WWT project, rather than including the engine in your app
as a bundled module.

Here’s simple HTML that will get you going:

```html
<!doctype html>
<html lang="en">
<head>
    <title>My First WWT Application</title>
    <script src="https://web.wwtassets.org/engine/7/wwtsdk.js"></script>
</head>
<body>
    <div id="wwtcanvas" style="width: 750px; height: 750px; background-color: #000"></div>

    <script type="text/javascript">
        function init_wwt() {
            const builder = new wwtlib.WWTControlBuilder("wwtcanvas");
            builder.startRenderLoop(true);
            builder.create();
        }

        window.addEventListener("load", init_wwt);
    </script>
</body>
</html>
```

The key elements are:

1. The `<script>` tag in the `<head>` section that loads up the WWT WebGL
   engine. You interface with this library via a global variable named
   `wwtlib`.
2. A `<div>` element that becomes home for the WWT viewport.
3. A JavaScript shim that uses the
   {{engineapi(p="classes/WWTControlBuilder.html",t="WWTControlBuilder")}}
   class to initialize the engine and start it rendering.

With this minimal initialization, you get a viewer that allows you to pan around
and use the scroll wheel to zoom in, providing an interface reminiscent of
popular Earth map web apps.

Once this framework is established, the sky is the limit! You can access the
full power of the WWT rendering engine through the JavaScript APIs that are
documented in the {{engineapi(p="index.html",t="@wwtelescope/engine")}}
TypeScript module, namespaced inside the `wwtlib` variable. The majority of your
programmatic interactions with the engine will occur
the {{engineapi(p="classes/WWTControl-1.html",t="WWTControl")}}
class, accessed through
the {{engineapi(p="variables/WWTControl.singleton.html",t="wwtlib.WWTControl.singleton")}}
singleton value, and
the {{engineapi(p="classes/ScriptInterface.html",t="ScriptInterface")}} class,
returned by
the {{engineapi(p="classes/WWTControlBuilder.html#create",t="WWTControlBuilder.create()")}}
function.
