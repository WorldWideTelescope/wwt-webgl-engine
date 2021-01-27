# rc: minor bump

This release contains a **breaking change** relating to a rework of how
"settings" are expressed in TypeScript. The previous system was pretty limited
and limiting; the new system is much more functional.

- Expose lots of new engine facets:
  - Annotations
  - Table (spreadsheet) layers
  - Image layers
  - The "track object" comand
- Track the rework of how settings are expressed
- Upgrade TypeDoc and TypeScript


# @wwtelescope/engine-vuex 0.6.0 (2021-01-07)

- Add new interfaces for monitoring and controlling the WWT internal clock.


# @wwtelescope/engine-vuex 0.5.0 (2020-12-30)

This release contains a **breaking change.**

- Add a variety of APIs to support tour playback (#73, @pkgw)
- I cannot figure out how to provide both the new `loadTour` and the old
  `loadAndPlayTour` as separate Actions that share a common implementation. So
  I've removed `loadAndPlayTour` and replaced it with `loadTour` that takes a
  `play` boolean argument. To get the old functionality, use the new action and
  set `play` to true. (In detail, these now need to be mutation-actions and I
  think that basic issue is that the Vuex module decorator does a lot of funky
  transformations on the underlying code that make it so that you can't just
  delegate to a shared async function.)
- Expose the current zoom level.


# @wwtelescope/engine-vuex 0.4.0 (2020-10-09)

- Add an API to adjust the zoom level.


# @wwtelescope/engine-vuex 0.3.1 (2020-09-23)

- No code changes; issuing a new release for the Cranko switchover.


# [0.3.0](https://github.com/pkgw/wwt-webgl-engine/compare/@wwtelescope/engine-vuex@0.3.0-beta.1...@wwtelescope/engine-vuex@0.3.0) (2020-06-12)

- Export interfaces relating to basic tour playback


# [0.2.0](https://github.com/pkgw/wwt-webgl-engine/compare/@wwtelescope/engine-vuex@0.2.0-beta.0...@wwtelescope/engine-vuex@0.2.0) (2020-06-09)

- Expose current foreground and background imagesets, and the foreground
  opacity, as state
- Clean up internal mechanism for updating Vuex state from the WWT component


# [0.1.0](https://github.com/pkgw/wwt-webgl-engine/compare/@wwtelescope/engine-vuex@0.1.0-beta.2...@wwtelescope/engine-vuex@0.1.0) (2020-05-23)

**Note:** Version bump only for package @wwtelescope/engine-vuex
