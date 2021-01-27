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
