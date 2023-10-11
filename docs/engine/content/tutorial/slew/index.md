+++
title = "Slewing the View"
weight = 200
+++

Now that we have a basic WWT view, let’s write code to command it slew the view
where we want.

You can’t send commands to the WWT engine until it is fully initialized. This
initialization process involves fetching some resources from the network (unless
you’re in [Freestanding Mode](@/freestanding-mode/_index.md)), so it will take
an unpredictable amount of time. Since we’re using the plain JavaScript engine,
which is quite conservative in the language features it uses, this means that we
need to add a callback.

Edit the JavaScript code of your `index.html` file to read as follows (new or
modified lines of code are highlighted):

```js,hl_lines=1 6-7 10-14
var script_interface, wwt;

function init_wwt() {
    const builder = new wwtlib.WWTControlBuilder("wwtcanvas");
    builder.startRenderLoop(true);
    script_interface = builder.create();
    script_interface.add_ready(on_ready);
}

function on_ready() {
    console.log("WWT is ready!");
    wwt = wwtlib.WWTControl.singleton;
    wwt.gotoRADecZoom(17.75, -28.9, 10, false);
}

window.addEventListener("load", init_wwt);
```

We’re now using the method
{{engineapi(p="classes/ScriptInterface.html#add_ready",t="ScriptInterface.add_ready()")}}
to add a callback that will be invoked once the engine is initialized. Once that
happens, we’re allowed to access the variable that is our main “portal” to
controlling WWT: the global variable
{{engineapi(p="variables/WWTControl.singleton.html",t="WWTControl.singleton")}},
which is an instance of the class
{{engineapi(p="classes/WWTControl-1.html",t="WWTControl")}}. Here, we assign it
to a variable named `wwt` for convenience. In a real WWT app based on the above
framework, the vast majority of your interactions with the engine would be
through this `wwt` variable.

Finally, in this example we use the method
{{engineapi(p="classes/WWTControl-1.html#gotoRADecZoom",t="WWTControl.gotoRADecZoom()")}}
to cause the view to slew to the Galactic Center. As detailed in the API
reference documentation, the four arguments here are the target RA in hours, the
target declination in degrees, the target “zoom level”, and a boolean indicating
whether the slew should be instant or not.

<div class="callout callout-note">

In the [bundled TypeScript
model](@/getting-started/bundled-typescript-model.md), you would use
{{helpersapi(p="classes/WWTInstance.html#gotoRADecZoom",t="WWTInstance.gotoRADecZoom()")}},
which additionally returns a [promise] that resolves when the slew completes.
You can use this as the basis for async code that easily constructs complex
effects without getting mired in a maze of callbacks.

[promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

</div>

<div class="callout callout-note">

In the [Vue/Pinia component model](@/getting-started/vue-component-model.md),
you would use
{{piniaapi(p="functions/engineStore.html#gotoRADecZoom",t="engineStore().gotoRADecZoom()")}},
which also returns a promise.

</div>

This is good of a place as any to talk about the zoom level setting. WWT’s “sky
mode” — the Google-Maps-like interface we’ve seen so far — quantifies its zoom
level as *the angular height of the WWT viewport*. If you resize the `<div>`
containing WWT, that angular height will stay constant (unless you change it
simultaneously, of course). So if you double the width alone of the WWT `<div>`,
the view would show twice as much “stuff” laterally. But if you double both the
width and the height, the view will show exactly the same amount of stuff, but
at twice the resolution.

For obscure reasons, in sky mode, WWT quantifies the zoom level as the angular
height of the viewport in degrees, **times six**. So in the code above, the
final viewport height ends up at around 1.67 degrees. Larger values of the zoom
setting correspond to being more zoomed out. By default, the maximum allowed
zoom setting in sky mode is 360, or a viewport angular height of 60°. This can
be overridden with
{{engineapi(p="classes/WWTControl-1.html#set_zoomMax",t="WWTControl.set_zoomMax()")}},
but larger values will induce significant distortions in the display.
