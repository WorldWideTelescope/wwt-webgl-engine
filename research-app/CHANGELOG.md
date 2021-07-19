# rc: minor bump

A few new messages and bugfixes that are important to handle situations where
multiple clients might be talking to multiple apps (#121, #122, #124, @pkgw):

- Handle ping-pong messages and sessionId assignment
- Implement threadId in LoadImageCollection
- Avoid a startup race condition in message handling
- Fix cross-origin messaging on Chrome (related to `instanceof Window` failing
  with cross-origin messages)
- Require the latest research-app-messages, which fixes a backwards-compatibility
  issue with CreateImageSetLayerMessage


# @wwtelescope/research-app 0.3.0 (2021-07-06)

- Add MVP UI for loading and visualizing HiPS progressive catalogs (#119,
  @Carifio24). You can now overlay sources from well-known catalogs like Gaia
  DR2, 2MASS, and more. Currently there are only a couple of controls for
  catalog rendering, but more will be added in subsequent releases.
- Post a `load_image_collection_completed` message to the app's owner, if
  present, allowing it to know when WTML file loads have completed (#118,
  @imbasimba).


# @wwtelescope/research-app 0.2.2 (2021-06-11)

- Avoid a crash when running in browser environments that do not define the
  `ServiceWorker` type (#111, @imbasimba)


# @wwtelescope/research-app 0.2.1 (2021-06-04)

- Tweak some of the background selector CSS so that it doesn't cover up the
  hamburger menu, and so that it shrinks better in a narrow viewport (#107,
  #110, @Carifio24, @pkgw)


# @wwtelescope/research-app 0.2.0 (2021-06-03)

Lots of new features!

- Add a background chooser UI (@Carifio24). Unlike the background chooser in the
  embed app, this one is "research-grade", allowing access to the full suite of
  WWT all-sky imagery, including the many HiPS datasets that we can now render,
  with slick autocompletion.
- Use the new 7.11 series of the engine with WebGL-based FITS rendering, and show
  a warning if the user's browser doesn't support it (@imbasimba). This is motivated
  because almost everyone supports WebGL 2.0 now, but for a little while longer in
  Safari you need to turn it on as an "advanced" option.
- Add a core set of view-control keybindings mirroring the pywwt widget
  (@Carifio24).
- Start implementing keyboard accessibility for the main app (@Carifio24).
- Handle some new messages needed for the OpenSpace integration work
  (@imbasimba): there are new JSON messages letting you reorder imageset layers,
  control the roll of the viewer, have more control over imagesets to load, control
  whether to "goto" those imagesets when they are loaded, and control whether to load
  WTML collections recursively.
- Loosen version requirements for Vue CLI tooling (@pkgw).


# @wwtelescope/research-app 0.1.0 (2021-01-27)

First release of the new "research application". This will be the embeddable UI
for use in Jupyter, reseacher-oriented interfaces, etc.

This version can handle all of the messages from the pywwt "JSON API", which
means that it can be dropped in as a replacement for the pywwt widget with the
proper JupyterLab glue, as implemented in what is currently called the
`wwt-research-kit` repo.
