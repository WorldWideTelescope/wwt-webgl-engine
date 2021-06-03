# rc: minor bump

This release features a lot of exciting work, mainly centered on accelerated
FITS rendering and new APIs to support a growing range of client applications!

- Start rendering FITS files using WebGL, as opposed to pure JavaScript data
  processing. This gives us a large performance boost, making it feasible to
  render all-sky FITS/HiPS data sets among other things. (@imbasimba)
- The WebGL-based FITS rendering requires WebGL 2.0. If this is note available,
  the previous JavaScript code will be used as a fallback. The engine now
  exports a warning indicator so that users can be notified if this is the case.
  While WebGL 2.0 is widely supported, it is still behind a feature gate in
  Safari. (@imbasimba)
- Related to these changes, make some fixes to the histogram UI widget (@imbasimba)
- The Python-based colormaps built into the engine, used for rendering FITS
  data, weren't quite using the full range of each colormap, seemingly due to an
  oversight. Fix that. (@imbasimba)
- New APIs to support OpenSpace integration. Some of these are genuinely new
  (e.g. `SetImageSetLayerOrder`) and others expose existing functionality to
  TypeScript. The `LoadFitsLayer` API was generalized to allow more flexible
  URL-based loading of image data, which should come in handy (@imbasimba)
- Expose new APIs to TypeScript to support new controls in the apps: `move` and
  `_tilt`. The leading underscore for the latter is a bit unfortunate, but is needed
  to preserve compatibility with code in production. (@Carifio24)
- Loading of a WTML collection now supports recursive loading of folder
  hierarchies. This is not the default, but sometimes it is useful, and the
  presence of the option helps clarify what the default behavior is (@imbasimba)
- More pieces of the code now identify imagesets by their URL, including the
  WTML loading which deduplicates by URL. One can think of situations where it
  might be valid to have two usefully different imagesets that share the same
  image-data URL, but these cases ought to be rare, and they can in principle be
  worked around by adding a URL fragment or unused query-string parameter. On
  the flip side, it is quite helpful to have global and stable unique
  identifiers for imagesets. (@imbasimba)
- Expose some new APIs relating to "catalog HiPS" datasets. (@imbasimba, @pkgw)
- Improvements to handling of FITS HiPS data sets, such as reading the built-in
  suggested minimum and maximum values for the data stretch (@imbasimba).


# @wwtelescope/engine 7.10.0 (2021-04-12)

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
