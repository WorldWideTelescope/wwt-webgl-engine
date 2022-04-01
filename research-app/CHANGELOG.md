# @wwtelescope/research-app 0.9.3 (2022-04-01)

- Internal updates to use the new UUID system for progressive HiPS catalog
  datasets, which is needed to create tour files that are compatible with the
  Windows client (#178, @carifio24).
- Pin the version of fontawesome-svg-core more tightly to keep the build working
  (@carifio24).


# @wwtelescope/research-app 0.9.2 (2022-01-19)

- Use the new `name` field on `image_layer_create` messages if provided (#165,
  @imbasimba)


# @wwtelescope/research-app 0.9.1 (2021-11-18)

- Fix scripting in production builds --- whoops! (#159, @Carifio24) The
  production builds seem to have different timing behavior with regards to
  JavaScript "promise" evaluation that broke the scripting system's message
  processing.


# @wwtelescope/research-app 0.9.0 (2021-11-17)

- Add the ability to script the app startup (#155, @Carifio24). The app can now
  be launched with a query parameter named `script` that specifies a series of
  control messages that the app will process and act upon as it starts up. In
  particular, the parameter is a comma-separated list of messages to process,
  where each message is BASE64-encoded, UTF8 JSON content. The app has logic to
  wait for asynchronous messages to resolve appropriately. This new
  functionality makes it possible to create pre-loaded embeds based on the
  research app UI, in the same way that's already possible with the "embed" app
  which is designed for non-specialists.
- Fix the left panel to behave better when it's narrow (#156, @Carifio24).


# @wwtelescope/research-app 0.8.1 (2021-10-26)

- Fix some cases where invisible HTML elements prevent clicks from reaching the
  WWT application (#152, @Carifio24).


# @wwtelescope/research-app 0.8.0 (2021-10-25)

- Allow users to use the UI to configure how not just HiPS progressive catalog
  data, but also generic "spreadsheet" layers, are displayed (#146, @Carifio24).
- Update the CSS and layout to be more responsive and work better in narrow
  windows (#148, @Carifio24).


# @wwtelescope/research-app 0.7.1 (2021-09-24)

- Bump minimum required engine version to get the WebGL1 position fix (#147, @imbasimba)
- Tidy up the control panel some more (#144, @Carifio24)


# @wwtelescope/research-app 0.7.0 (2021-09-21)

So many new features!

- Add the ability to select sources by clicking, and give user links to query
  the coordinates on SIMBAD and NED (@Carifio24, #123, #133). Sources have (very
  basic) automatic name generation.
- Add an "Add Imagery As Layer" tool (@pkgw, #138)
- Add a "Load WTML Collection" tool (@pkgw, #138)
- Add a UI for "imagery" (layers) of FITS data (@pkgw, #138). This includes
  interactive stretch controls.
- Rename "layers" to more specific "catalogs" (@pkgw, #138)
- Add some new UI controls for HiPS catalogs:
  - A scale factor control
  - PlotType control
- Lots of UI/UX polish all around


# @wwtelescope/research-app 0.6.0 (2021-07-23)

- Add support for HiPS catalog control messages (#126, @pkgw). These enable
  pywwt to work with HiPS catalogs and download their data. This includes a
  minor rework to track the API changes in the engine-vuex module.


# @wwtelescope/research-app 0.5.0 (2021-07-20)

- Implement the new `hideAllChrome` setting, and some engine color settings, for
  pywwt (#125, @pkgw)


# @wwtelescope/research-app 0.4.0 (2021-07-19)

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
