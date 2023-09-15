# rc: minor bump

- Require the new, ESM-based version of the WebGL engine (#271, @pkgw). While
  the engine transition should not affect any packages that depend on it, such
  as this one, this requirement will help isolate any bugs associated with the
  transition.
- Update sponsorship branding and "front door" email address (#269, #271, @pkgw).


# @wwtelescope/engine-helpers 0.15.1 (2023-07-23)

- Add a `type: module` field to the `package.json` file (#264, @pkgw). This more
  accurately reflects the files that we're distributing.


# @wwtelescope/engine-helpers 0.15.0 (2023-06-08)

- Have the `addImagesetToRepository` method return an imageset (#256, @pkgw).


# @wwtelescope/engine-helpers 0.14.0 (2023-03-31)

- Expose the "addImageSetToRepository" function through the engine stack (#241, @pkgw)
- Remove unnecessary `name` parameter in the frame export code (#240, @Carifio24)


# @wwtelescope/engine-helpers 0.13.0 (2023-03-29)

- Expose the new, expanded frame-capture functionality which can capture a
  sequence of frames (#239, @Carifio24).


# @wwtelescope/engine-helpers 0.12.0 (2023-03-20)

- Expose the engine's new frame capture functionality (#235, @Carifio24).


# @wwtelescope/engine-helpers 0.11.1 (2023-02-27)

- No code changes; just making Cranko happy.


# @wwtelescope/engine-helpers 0.11.0 (2023-02-15)

- Expose the "freestanding mode" that was added to the engine (#230, @pkgw).


# @wwtelescope/engine-helpers 0.10.0 (2023-02-13)

- Expose some new engine settings that make make it possible to customize the
  colors used for various coordinate grid overlays and the heigh of the
  constellation names (#226, @Carifio24).


# @wwtelescope/engine-helpers 0.9.0 (2023-01-19)

- Expose new engine APIs for getting the amount of time that basic "goto"
  movements will take to execute (#222, @Carifio24)


# @wwtelescope/engine-helpers 0.8.3 (2022-11-30)

- No code changes.
- Cleanups and improvements to the build and packaging infrastructure (#217,
  @Carifio24, @pkgw). The source repository is now based on Yarn.


# @wwtelescope/engine-helpers 0.8.2 (2022-04-01)

- Fix a URL typo in the package.json file (@Carifio24).


# @wwtelescope/engine-helpers 0.8.1 (2021-11-17)

- Fix bad copy/paste-o that made the `polylineannotation` module pretty useless
  (#155, @Carifio24).


# @wwtelescope/engine-helpers 0.8.0 (2021-09-20)

- Provide a homogeneous set of settings interfaces, building on the new
  interfaces provided by some of the lower-level packages (@pkgw, #131, #134).
  There is a new suite of functions for extracting, copying, and storing
  settings, which make it easier to bridge WWT settings into systems external to
  WWT itself, such as Vue and Vuex.
- Properly type `StretchFitsLayerOptions.stretch` as a `ScaleTypes`. This
  is technically a breaking change although the TypeScript compiler doesn't
  always seem to mind if you still initialize the field with a number.


# @wwtelescope/engine-helpers 0.7.0 (2021-07-23)

- Add various wrappers for catalog HiPS functionality: an async-ified wrapper
  for getCatalogHipsDataInView, an API to pull settings out of a spreadsheet
  layer, and a new async addCatalogHipsByName implementation (#126, @pkgw)


# @wwtelescope/engine-helpers 0.6.0 (2021-06-03)

- Add helpers relating to some of the new APIs in the 7.11 series of the engine.
  These include roll controls, optional recursive loading of WTML collections,
  showing warnings if WebGL 2.0 isn't available, URL-based loading of imageset
  layers, controlling "goto" functionality when loading imageset layers, and
  catalog HiPS APIs.


# @wwtelescope/engine-helpers 0.5.0 (2021-01-27)

This release contains a **breaking change** relating to a rework of how
"settings" are expressed in TypeScript. The previous system was pretty limited
and limiting; the new system is much more functional.

- Many new APIs and types related to our improved system for handling settings.
- Expose the layer manager as one of the core state objects
- Add wrappers for layer mutations
- Implement FITS layer colormap control
- Implement FITS layer stretch control
- Upgrade TypeDoc and TypeScript
- Correct temporary GitHub URLs in the package.json files


# @wwtelescope/engine-helpers 0.4.0 (2020-12-30)

- A variety of new APIs to support better tour playback (#73, @pkgw)
  - `seekToTourTimecode()`
  - `getEffectiveTourTimecode()`
  - `getIsTourPlaying()`
  - `loadTour()`
  - a simple hook for detecting when a tour finishes playing


# @wwtelescope/engine-helpers 0.3.1 (2020-09-23)

- No code changes; issuing a new release for the Cranko switchover.


# [0.3.0](https://github.com/pkgw/wwt-webgl-engine/compare/@wwtelescope/engine-helpers@0.3.0-beta.1...@wwtelescope/engine-helpers@0.3.0) (2020-06-12)

- Export helpers relating to tour playback


# [0.2.0](https://github.com/pkgw/wwt-webgl-engine/compare/@wwtelescope/engine-helpers@0.2.0-beta.0...@wwtelescope/engine-helpers@0.2.0) (2020-06-09)

- Expose setForegroundOpacity


# [0.1.0](https://github.com/pkgw/wwt-webgl-engine/compare/@wwtelescope/engine-helpers@0.1.0-beta.2...@wwtelescope/engine-helpers@0.1.0) (2020-05-23)

**Note:** Version bump only for package @wwtelescope/engine-helpers
