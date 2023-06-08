# rc: minor bump

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
