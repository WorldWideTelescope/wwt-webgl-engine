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
