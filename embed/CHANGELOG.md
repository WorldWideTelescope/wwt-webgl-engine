# rc: micro bump

- No code changes; update webpack dependency version.


# @wwtelescope/embed 1.7.1 (2024-02-07)

- Pull in a change in the `@wwtelescope/engine-pinia` package that corrects the
  tour playback timeline scrubber (#294, @pkgw).


# @wwtelescope/embed 1.7.0 (2023-09-15)

- Require the new, ESM-based version of the WebGL engine (#271, @pkgw). While
  the engine transition should not affect any packages that depend on it, such
  as this one, this requirement will help isolate any bugs associated with the
  transition.
- Update sponsorship branding and "front door" email address (#269, #271, @pkgw).


# @wwtelescope/embed 1.6.2 (2023-03-31)

- No code changes
- Bump webpack from 5.75.0 to 5.76.0


# @wwtelescope/embed 1.6.1 (2023-02-27)

- Correct missing @fortawesome/vue-fontawesome dependencies (#233, @pkgw)


# @wwtelescope/embed 1.6.0 (2022-12-01)

- Update to Vue 3 and Pinia (#215, @Carifio24)! The overall user experience
  should be essentially the same as before, but this modernizes many of the
  package's internals. Some fronted components had to be migrated to new
  equivalents that are compatible with Vue 3.
- Control APIs should be unaffected, so we are treating this as a non-breaking
  change. If you actually depend upon this package in an NPM/Yarn project,
  however, this is likely a breaking change because the dependency on `vue` has
  gone from the 2.x series to the 3.x series.
- Cleanups and improvements to the build and packaging infrastructure (#217,
  @Carifio24, @pkgw). The source repository is now based on Yarn.


# @wwtelescope/embed 1.5.4 (2022-04-01)

- Fix a URL typo in the package.json file (@Carifio24).
- Pin the version of fontawesome-svg-core more tightly to keep the build working (@Carifio24)


# @wwtelescope/embed 1.5.3 (2021-10-21)

- Fix the centering of the background WWT logo in the "ready to start" tour
  playback mode (#150, @pkgw).


# @wwtelescope/embed 1.5.2 (2021-09-21)

- An internal improvement to our folder loading code broke the way that the
  embed processed WTML files, making it so that it wouldn't probably home in on
  specified places. Update the WTML processing to fix this (@Carifio24, #143).


# @wwtelescope/embed 1.5.1 (2021-08-04)

- If a tour is being played back and the user pauses it, populate the background
  chooser with our list of standard backgrounds for Sky mode. This could yield
  incorrect results if the tour is currently in a different mode, but most of
  the time it will be better than our current approach, which is to show an
  empty list. Our support for non-Sky modes needs to be tidied up more
  generally. (#127, @pkgw)


# @wwtelescope/embed 1.5.0 (2021-06-17)

- Add support for panorama images (#117, @Carifio24)

[#117]: https://github.com/WorldWideTelescope/wwt-webgl-engine/pull/117


# @wwtelescope/embed 1.4.2 (2021-06-03)

- Loosen version requirements for Vue CLI tooling


# @wwtelescope/embed 1.4.1 (2021-01-27)

- Update v-tooltip, hopefully making Lerna a bit happier
- Correct temporary GitHub URLs in the package.json files


# @wwtelescope/embed 1.4.0 (2020-12-30)

- Large amounts of UI polish for tour playback. We now have UI controls, fixes
  for mobile, and a "letterbox" mode that ensures that the aspect ratio of the
  WWT canvas is reasonable when playing back tours.


# @wwtelescope/embed 1.3.0 (2020-10-09)

- Add new UI "controls" (to be distinguished from the "tools"): zoom buttons and
  a fullscreen toggle. Woo!


# @wwtelescope/embed 1.2.1 (2020-09-24)

- No code changes; just issuing a new release for the Cranko conversion.


# [1.2.0](https://github.com/pkgw/wwt-webgl-engine/compare/@wwtelescope/embed@1.2.0-beta.1...@wwtelescope/embed@1.2.0) (2020-06-12)

- Implement a very basic tour playback mode.


# [1.1.0](https://github.com/pkgw/wwt-webgl-engine/compare/@wwtelescope/embed@1.1.0-beta.0...@wwtelescope/embed@1.1.0) (2020-06-09)

- Add some tools to the embed user interface, including an opacity control for
  the foreground image and a background chooser.


# [1.0.0](https://github.com/pkgw/wwt-webgl-engine/compare/@wwtelescope/embed@0.1.1...@wwtelescope/embed@1.0.0) (2020-05-24)

- Version-only bump to 1.0 — we are going to try very hard to avoid breakage since we want
  to encourage people to run around sticking embed URLs everywhere they can think of.


## [0.1.1](https://github.com/pkgw/wwt-webgl-engine/compare/@wwtelescope/embed@0.1.1-beta.0...@wwtelescope/embed@0.1.1) (2020-05-24)

- New release to needed due to bug in continuous deployment infrastructure.


# [0.1.0](https://github.com/pkgw/wwt-webgl-engine/compare/@wwtelescope/embed@0.1.0-beta.4...@wwtelescope/embed@0.1.0) (2020-05-24)

**Note:** Version bump only for package @wwtelescope/embed
