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
  you import your own all-sky surveys.
- **No built-in image sets.** Likewise, WWT’s built-in database of all-sky maps
  and “study” images will not be available. If you wish to show any surveys or
  studies, you must load them in yourself.
- **No constellation artwork.** These images are pulled from a WWT web API.
- **No ISS (International Space Station) frame.** WWT’s support for showing the
  location of the ISS depends on a web API to provide its current orbital
  parameters, so this support must be disabled in freestanding mode.
- **No automatic name-based thumbnail images for places.** These will use a
  generic star thumbnail image instead.


## Activating Freestanding Mode

TKTK.
