# rc: minor bump

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
