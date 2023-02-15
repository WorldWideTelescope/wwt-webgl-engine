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

Activating the freestanding mode causes the engine to be limited in the following ways:

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

TKTK.
