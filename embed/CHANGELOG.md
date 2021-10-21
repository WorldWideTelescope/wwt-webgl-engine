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
