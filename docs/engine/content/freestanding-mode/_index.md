+++
title = "Freestanding Mode"
weight = 100
sort_by = "weight"
insert_anchor_links = "right"
+++

As of version 7.20, the WWT WebGL engine supports a “freestanding mode” that
allows it to run in a purely self-contained fashion — it will not make any
requests to the `worldwidetelescope.org` servers for supporting data. This
disables a number of the engine’s capabilities, but may be of interest for WWT
adopters who are unwilling or unable to depend on external services.


## Limitations of Freestanding Mode

Activating the freestanding mode causes the engine to be limited in the
following ways:

- **No default sky map.** WWT’s built-in DSS sky map will not be
  available. The sky view will only be able to show an empty, black sky unless
  you import your own all-sky survey(s).
- **No built-in image sets.** Likewise, WWT’s built-in database of all-sky maps
  and “study” images will not be available. If you wish to show any surveys or
  studies, you must load them in yourself.
- **No 3D “solar system” mode.** The engine won't prevent you from activating
  this mode, but it will be virtually useless. Many aspects of this mode rely on
  WWT APIs, including:
  - COSMOS galaxies database
  - Hipparcos star database
  - Minor planets database
  - Planet and moon textures
- **Most tours will not work.** If a tour relies on assets provided by the core
  WWT APIs, they will not have been loaded and will be missing. If you construct
  a tour that does *not* rely on these assets, it will work as expected.
- **No automatic proxying.** When fetching web resources, if the WWT engine runs
  into a problem that seems to be due to HTTP/HTTPS mismatches or CORS
  restrictions, it will reroute the relevant requests through a proxy service on
  `worldwidetelescope.org` that works around the issue(s). In freestanding mode,
  this behavior is disabled.
- **No constellation artwork.** These images are pulled from a WWT web API.
- **No ISS (International Space Station) coordinate frame or 3D model.** WWT’s
  support for showing the ISS depends on web APIs to provide its current orbital
  parameters and a 3D model, so this support must be disabled in freestanding
  mode.
- **Tour URLs in WTML folders must be specified.** In the standard mode,
  references to tours can be resolved to a URL that fetches their data based on
  a UUID registered with the WWT webservice. This is not possible in
  freestanding mode.
- **No automatic ID-based thumbnail images for tours.** As above. These will use
  a generic star thumbnail image instead.
- **No automatic name-based thumbnail images for Places in WTML folders.** These
  will use a generic star thumbnail image instead.
- **No automatic Bing-based DEM data for Mercator projection imagesets.** Some
  Earth data have elevation data automatically attached. This feature will be
  deactivated.


## Activating Freestanding Mode

If you are using WWT in [the Vue/Pinia component model](../getting-started/vue-component-model.md),
activate freestanding mode by specifying the [Vue prop] `wwt-freestanding-asset-baseurl`:

```xml
<template>
  <div>
    <WorldWideTelescope
      id="wwt"
      wwt-freestanding-asset-baseurl="https://myassets.org/wwtengine"
    ></WorldWideTelescope>
    <div id="my-ui-controls">...</div>
  </div>
</template>
```

[Vue prop]: https://vuejs.org/guide/components/props.html

This value is a base URL that will be used to look up simple, static data assets
used by the engine. The default value used in the production version of WWT is
`https://web.wwtassets.org/engine/assets`, and you can use that value here if
you don’t mind depending on `wwtassets.org`.

If you're using the [bundled TypeScript
model](../getting-started/bundled-typescript-model.md), you can activate the
mode with an analogous parameter,
{{helpersapi(p="interfaces/InitControlSettings.html#freestandingAssetBaseurl",t="InitControlSettings#freestandingAssetBaseurl")}},
when calling {{helpersapi(p="classes/WWTInstance.html#constructor",t="the WWTInstance constructor")}}
provided in the {{helpersapi(p="index.html",t="@wwtelescope/engine-helpers")}} package.

Finally, at the lowest levels of abstraction, such as what you would have in the
[hosted JavaScript model](../getting-started/hosted-javascript-model.md), you
can call the {{engineapi(p="classes/WWTControlBuilder.html#freestandingMode",
t="freestandingMode() method")}} on the
{{engineapi(p="classes/WWTControlBuilder.html", t="WWTControlBuilder class")}}
exported in the {{engineapi(p="index.html",t="@wwtelescope/engine")}} package.
Once again, this API takes the same asset baseurl parameter as seen above.


## Engine Assets

Currently, the engine assets are not indexed elsewhere. To serve up your own assets,
download the following files from the default baseurl given above:

- `callisto.png`
- `circle.png`
- `ConstellationNamePositions_EN.txt`
- `constellations.txt`
- `earth.png`
- `europa.png`
- `figures.txt`
- `ganymede.png`
- `glyphs1.png`
- `glyphs1.xml`
- `io.png`
- `jupiter.png`
- `mars.png`
- `mercury.png`
- `moon.png`
- `moons.txt`
- `moonshadow.png`
- `neptune.png`
- `pins.png`
- `pluto.png`
- `saturn.png`
- `StarProfileAlpha.png`
- `sun.png`
- `sunCorona.png`
- `thumb_folder.jpg`
- `thumb_folderup.jpg`
- `thumb_star.jpg`
- `uranus.png`
- `venus.png`

The following assets are only used in 3D mode and so are unlikely to be needed if
you are using WWT in freestanding mode:

- `galimg/gal_$N.jpg` for *N* ranging from `0000` to `0255`, inclusive
- `milkywaybar.jpg`
- `saturnringsshadow.png`
- `saturnringsstrip.png`