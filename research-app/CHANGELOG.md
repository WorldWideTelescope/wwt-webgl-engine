# rc: minor bump

- Handle a new JSON message activating mechanism in the engine that allows the
  tile cache to be manually cleared (#291, @Carifio24)


# @wwtelescope/research-app 0.16.0 (2023-09-15)

- Require the new, ESM-based version of the WebGL engine (#271, @pkgw). While
  the engine transition should not affect any packages that depend on it, such
  as this one, this requirement will help isolate any bugs associated with the
  transition.
- Update sponsorship branding and "front door" email address (#269, #271, @pkgw).


# @wwtelescope/research-app 0.15.0 (2023-07-01)

- Allow some grid overlay colors to be modified through JSON messages (#258,
  @Carifio24). In particular, `altAzGridColor`, `eclipticColor`,
  `eclipticGridColor`, `equatorialGridColor`, `galacticGridColor`, and
  `precessionChartColor` are now handled as engine settings.


# @wwtelescope/research-app 0.14.4 (2023-06-08)

- Also ensure that catalog layer info is not a proxy (#253, @Carifio24).


# @wwtelescope/research-app 0.14.3 (2023-05-30)

- Make sure not to send proxy objects when sending lists of selected
  sources over the messaging API (#251, @Carifio24).


# @wwtelescope/research-app 0.14.2 (2023-05-25)

- Load the HiPS catalog over HTTPS if the app itself is loaded over HTTPS,
  fixing potential mixed-content security errors (#249, @Carifio24).


# @wwtelescope/research-app 0.14.1 (2023-03-31)

- No code changes
- Bump webpack from 5.75.0 to 5.76.0


# @wwtelescope/research-app 0.14.0 (2023-02-27)

- Send the roll angle of the camera in view state messages (#231, @Carifio24).
- Correct missing @fortawesome/vue-fontawesome dependencies (#233, @pkgw).


# @wwtelescope/research-app 0.13.0 (2023-02-13)

- Add new circle and square plot types as options for rendering table layers
  (#228, @Carifio24). These had been hidden since there was a silly bug in their
  implementation in the engine layer.


# @wwtelescope/research-app 0.12.0 (2022-12-01)

- Update to Vue 3 and Pinia (#215, @Carifio24)! The overall user experience
  should be essentially the same as before, but this modernizes many of the
  package's internals. Some fronted components had to be migrated to new
  equivalents that are compatible with Vue 3.
- Control APIs should be unaffected, so we are treating this as a non-breaking
  change. If you actually depend upon this package in an NPM/Yarn project,
  however, this is likely a breaking change because the dependency on `vue` has
  gone from the 2.x series to the 3.x series.
- Allow the proximity threshold for clicking on catalog entries to be
  controlled through the API (#220, @Carifio24).
- Use a newer version of the engine that should fix clicking on catalog entries
  in Firefox (#219, @Carifio24).
- Cleanups and improvements to the build and packaging infrastructure (#217,
  @Carifio24, @pkgw). The source repository is now based on Yarn.
- Update to icons FontAwesome 6 (#217, @pkgw).


# @wwtelescope/research-app 0.11.1 (2022-10-25)

- Improve the point selection user experience in the research app (#213,
  @Carifio24). The effective radius for hit testing is now 4 pixels, rather
  than an unscaled constant gave bad results on unusual viewport sizes. The
  experience should now also be much more mobile-friendly.


# @wwtelescope/research-app 0.11.0 (2022-09-01)

- Implement functionality to export the current view as a tour if request (#190,
  @Carifio24). This isn't exposed in the user interface, for now, but
  (re-)enables tour export in pywwt.
- Emit new pointer movement messages, allowing containing applications (i.e.,
  the WWT JupyterLab extension) to properly handle drag-and-drop across the WWT
  embed (#205, @imbasimba).
- Fix state restoration for HiPS catalogs (#191, #197, @Carifio24).
- Fix API-based removal of non-HiPS catalog/table layers (#203, @Carifio24).


# @wwtelescope/research-app 0.10.0 (2022-04-05)

- Get support for FITS TOAST rendering from the latest engine (#181, @imbasimba)
- Support programmatic control of whether catalog items are selectable
  (clickable) in the UI (#183, @Carifio24). The click testing was slowing down
  the UI in some cases. At the moment this setting is only controllable through
  the messaging API, and not the UI itself.


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
