# rc: minor bump

- Expose the new mechanism in the engine that allows the tile cache to be
  manually cleared (#291, @Carifio24)
- Correct the `loadTour()` method on the Pinia store, fixing higher-level
  management and introspection of the tour timeline (#294, @pkgw)
- Lots of work on the documentation (#274, #275, #276, #277, #278, @pkgw)


# @wwtelescope/engine-pinia 0.9.0 (2023-09-15)

- Require the new, ESM-based version of the WebGL engine (#271, @pkgw). While
  the engine transition should not affect any packages that depend on it, such
  as this one, this requirement will help isolate any bugs associated with the
  transition.
- Update sponsorship branding and "front door" email address (#269, #271, @pkgw).


# @wwtelescope/engine-pinia 0.8.0 (2023-09-14)

- Add a `customId` prop the WWT component (#265, @nmearl). This allows you to
  precisely control the DOM id of the `<div>` that the app will bind to, in case
  the default ID selection (`wwtcmpt${N}`) does not work. In particular, if you
  have multiple independent WWT Vue apps within the same DOM tree, you can use
  this to avoid clashes.


# @wwtelescope/engine-pinia 0.7.0 (2023-06-08)

- Have the `addImagesetToRepository` method return an imageset (#256, @pkgw).


# @wwtelescope/engine-pinia 0.6.0 (2023-03-31)

- Expose the "addImageSetToRepository" function through the engine stack (#241, @pkgw)


# @wwtelescope/engine-pinia 0.5.0 (2023-03-29)

- Expose the new, expanded frame-capture functionality which can capture a
  sequence of frames (#239, @Carifio24).


# @wwtelescope/engine-pinia 0.4.0 (2023-03-20)

- Expose the engine's new frame capture functionality (#235, @Carifio24).


# @wwtelescope/engine-pinia 0.3.1 (2023-02-27)

- No code changes; just making Cranko happy.


# @wwtelescope/engine-pinia 0.3.0 (2023-02-15)

- Expose the "freestanding mode" that was added to the engine (#230, @pkgw). It
  can be activated by setting a Vue "prop" on the WWT Vue component.


# @wwtelescope/engine-pinia 0.2.0 (2023-01-19)

- Expose new engine APIs for getting the amount of time that basic "goto"
  movements will take to execute (#222, @Carifio24)
- Add new store APIs for accessing generic layers and imageset layers in the
  Pinia framework: `layerById`, `imagesetLayerById` (#223, @Carifio24)


# @wwtelescope/engine-pinia 0.1.0 (2022-11-30)

This package wraps the core rendering engine of the [AAS] [WorldWide
Telescope][wwt-home] (WWT) stack ([@wwtelescope/engine]) into a plugin for the
[Pinia] state management library. It is the successor to the
[@wwtelescope/engine-vuex] package, which targeted Vuex 3.0. Pinia is
effectively Vuex 5, according to its authors, and is the recommended state
management system for Vue 3.

[AAS]: https://aas.org/
[wwt-home]: https://worldwidetelescope.org/home/
[@wwtelescope/engine]: https://www.npmjs.com/package/@wwtelescope/engine
[Pinia]: https://pinia.vuejs.org/
[@wwtelescope/engine-vuex]: https://www.npmjs.com/package/@wwtelescope/engine-vuex

Changes in this package compared to [@wwtelescope/engine-vuex]:

- Adapt to Pinia (#215, @Carifio24). Duh.
- Cleanups and improvements to the build and packaging infrastructure (#217,
  @Carifio24, @pkgw). The source repository is now based on Yarn.
