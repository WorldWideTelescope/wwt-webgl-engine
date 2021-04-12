# rc: minor bump

- Add an API to add catalog HiPS to the view using its imageset handle
- Wire in simple support for FITS HiPS using Javascript parsing. Very slow, for
  now.


# @wwtelescope/engine 7.9.0 (2021-03-18)

- Initial support for catalog HiPS data from @imbasimba (#84)! Documentation and
  TypeScript bindings currently lacking but this should get us on the patch of
  demoing the functionality in the web client and wiring it up in the classic
  pywwt framework.
- Start reworking docs structure to have a place to document the research app
  (#82, @pkgw).


# @wwtelescope/engine 7.8.0 (2021-01-27)

- Expose many new APIs and types needed for pywwt functionality, including:
  - Better settings
  - SpreadSheetLayer
  - ImageSetLayer
  - track_object
  - Annotations
- Rework how settings are expressed
- Upgrade TypeDoc and TypeScript
- Correct temporary GitHub URLs in the package.json files


# @wwtelescope/engine 7.7.0 (2020-12-30)

- Expose a variety of new features to TypeScript to enable the construction of
  sophisticated tour playback UIs (#73, @pkgw)
- Fix a variety of bugs in tour playback  (#73, @pkgw):
  - Fix audio in Safari
  - Fix a variety of issues related to seeking around
  - Remove deprecated built-in UI hooks that cause weird interaction behavior
  - Add ability to preserve tour settings on pause to prevent jumps when things
    like localHorizonMode have been customized.
- Improvements to HiPS rendering (#72, @imbasimba)
  - In case of view order 0-2 tile 404, continue to burrow until order 3 or a
    tile found. HiPS order 0-2 may be deleted on some servers
  - Properly wait for HiPS properties to load before showing any HiPS tiles
  - Fixed point conversion of galactic HiPS


# @wwtelescope/engine 7.6.1 (2020-12-08)

- Improvements to the HiPS implementation. It now looks like it's working
  reliably for equatorial HiPS imagery! (#71, @imbasimba).


# @wwtelescope/engine 7.6.0 (2020-11-25)

- engine/wwtlib/Place.cs: use GetInnerText to get Place.Description text (#70, @pkgw)
- Start working on the HiPS implementation! Not yet fully baked, but the
  building blocks are there if you know how to turn them on. Future releases
  will refine the implementation and actually expose it to the world. (#68,
  @imbasimba)


# @wwtelescope/engine 7.5.1 (2020-10-10)

- Fix pinch-to-zoom on Firefox (on Linux and Android, at least) - it seems that
  its pointerIds sometimes just suddenly change on you.


# @wwtelescope/engine 7.5.0 (2020-10-09)

- Make sure crosshairs stay square when viewport size changes
- Add TypeScript bindings to the `WWTControl.zoom()` API.


# @wwtelescope/engine 7.4.2 (2020-09-23)

- No code changes; issuing a new release as part of the Cranko changeover.


# [7.4.0](https://github.com/pkgw/wwt-webgl-engine/compare/@wwtelescope/engine@7.4.0-beta.0...@wwtelescope/engine@7.4.0) (2020-07-23)

- Attempt to fix pointer-pinch-zoom freakout on Mac/Chrome (#58)
- Account for camera rotation when panning (#57)
- Expose more API control over zoom clamping
- Draw eclipsed moons if not in realistic-lighting mode (#55)
- Don't attempt to proxy localhost URLs on nonstandard ports


# [7.3.0](https://github.com/pkgw/wwt-webgl-engine/compare/@wwtelescope/engine@7.3.0-beta.0...@wwtelescope/engine@7.3.0) (2020-06-12)

- Export APIs related to basic tour playback


# [7.2.0](https://github.com/pkgw/wwt-webgl-engine/compare/@wwtelescope/engine@7.2.0-beta.0...@wwtelescope/engine@7.2.0) (2020-06-09)

- Export ScriptInterface.setForegroundOpacity
- Ensure that RenderContext imagesets default to null.


## [7.1.1](https://github.com/pkgw/wwt-webgl-engine/compare/@wwtelescope/engine@7.1.1-beta.1...@wwtelescope/engine@7.1.1) (2020-05-31)

- No code changes; re-releasing since the deployment pipeline wasn't fully
  working when 7.1.0 was released.


# [7.1.0](https://github.com/pkgw/wwt-webgl-engine/compare/@wwtelescope/engine@7.1.0-beta.1...@wwtelescope/engine@7.1.0) (2020-05-23)

**Note:** Version bump only for package @wwtelescope/engine
