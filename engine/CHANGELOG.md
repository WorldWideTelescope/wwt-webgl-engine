# @wwtelescope/engine 7.18.0 (2023-01-19)

- Add APIs for getting the amount of time that basic "goto" movements
  will take to execute (#222, @Carifio24)


# @wwtelescope/engine 7.17.2 (2022-11-30)

- Fix mouse-based selection of catalog entries in Firefox (#216, #219, @Carifio24).
- Cleanups and improvements to the build and packaging infrastructure (#217,
  @Carifio24, @pkgw). The source repository is now based on Yarn.


# @wwtelescope/engine 7.17.1 (2022-10-25)

- Fix a half-pixel offset in the positioning of untiled FITS files (#211,
  @imbasimba). This stemmed from the difference between the FITS and WWT pixel
  coordinate systems.
- Allow negative RA's in the `GotoRADecZoom()` API (#212, @imbasimba).
- Improve the logic that guesses where the center of an Imageset is (#212,
  @imbasimba, @pkgw). This can't be done reliably with only an Imageset in hand;
  you need to wrap it in a Place and specify its visual center manually. But
  sometimes we need to guess. The previous logic could yield bad results because
  it failed to account for the image rotation, among other issues. For un-tiled
  images, we must guess the image size; the current hardcoded guess is 800x800
  pixels.


# @wwtelescope/engine 7.17.0 (2022-09-01)

- Add interfaces to get the screen point for given spatial coordinates (#206,
  @Carifio24). The primary intended use here is to improve interactive selection
  of catalog items in the UI.
- Fix some incorrect time-span parsing that was causing incorrect tour durations
  (#54, #204, @Carifio24).
- Properly trigger the `AddImageSetLayer` callback when adding a layer, even if
  it was loaded previously (#202, @imbasimba).
- Expose the `FolderUp` class to TypeScript, used for WTML folder navigation
  in our custom collection explorer apps (#201, @Carifio24).
- Fix loading of VOTable layers in tours (#193, @Carifio24).
- Expose some tour-related functionality from the engine to TypeScript (#190,
  @Carifio24). This supports the functionality for the research app to export
  tours.


# @wwtelescope/engine 7.16.0 (2022-04-05)

- Add support for FITS TOAST rendering! (#181, @imbasimba). There aren't yet any
  such datasets out in the wild, but we’ll work on tools to create them. This
  change actually *reduced* the number of lines of code because it consolidated
  existing functionalities.


# @wwtelescope/engine 7.15.0 (2022-04-01)

- Fix up emitted tour files to be compatible with the Windows client, including
  a switch to use V5 UUIDs for internal HiPS catalog layer IDs (#178,
  @Carifio24). This adds a new API that can be used by downstream modules.
- Fix longitudes in non-astronomical spreadsheet layers, which were accidentally
  flipped in the previous release (#180, @Carifio24).
- Finally provide a hook to import the external `pako` JavaScript module in the
  new engine, so that compression and decompression can work reliably (#170,
  @Carifio24)
- Fix "vibrations" of tiled imagesets when zoomed in to very high levels (#169,
  @imbasimba)
- Fix the location panned to when loading tiled imagesets with non-central
  coordinate offsets (#168, @imbasimba)
- Fix a URL typo in the package.json file (#173, @Carifio24).
- Bump some dependency versions (#175, #185)


# @wwtelescope/engine 7.14.5 (2022-01-06)

- Fix 180-degree rotation of longitudes when rendering data tables in 3D (#166,
  @Carifio24, @pkgw). The problem pretty clearly seems to have stemmed from some
  longitude flip that showed up in the early webclient implementation and has
  been worked around in a successive series of hacks over time. This fix should
  address the symptoms, but it would be nice to trace down the underlying cause
  and get things back to being more in sync with the Windows client codebase.
- Change the default FITS colormap to Viridis to agree with pywwt (#162,
  @imbasimba).


# @wwtelescope/engine 7.14.4 (2021-12-02)

- Fix error handling in web file requests that don't get proxied (#161, @imbasimba)
- Increase the performance of drawing filled circles by a factor of ~50 (#160,
  @imbasimba). The naive implementation was generating more than a thousand triangles,
  when that number can be *much* smaller. We're currently still generating 72 triangles,
  and could likely get another large improvement with more work if needed.


# @wwtelescope/engine 7.14.3 (2021-11-17)

- Fix `HealpixTile::IsTileBigEnough` to work with planetary HiPS datasets (#157,
  @imbasimba).


# @wwtelescope/engine 7.14.2 (2021-10-21)

- Fix display of tiled FITS images when using WebGL 1 (#150, @imbasimba).


# @wwtelescope/engine 7.14.1 (2021-09-24)

- Fix positioning of FITS SkyImages when using WebGL 1 (#147, @imbasimba).


# @wwtelescope/engine 7.14.0 (2021-09-20)

- Add support for tiled FITS studies!!! (@imbasimba, @pkgw, #115, #129, #135)
  The WWT engine can now display FITS imagery of arbitrary size, if the data are
  preprocessed into WWT's tiled "study" format. This can be done using the
  [toasty] Python package.
- Add functionality for finding RA and Dec of a given point in the WWT viewport,
  as well as for finding the nearest HiPS catalog object (@Carifio24, #123)
- Internal refactorings to help ensure that users of FITS imagesets can get
  proper FITS properties (max and min values, etc.) once the data have loaded
  (@pkgw).
- Turn off the "transparent-black" FITS image setting by default (#140, @imbasimba).
  This mimics the default behavior of pywwt.
- When loading an imageset with the "goto" behavior turned on, guess an appropriate
  zoom level (@pkgw).
- Define and implement a bunch of TypeScript interfaces for the "settings"
  associated with various WWT objects (@pkgw, #131). These are needed to help
  build up reactive user interfaces for settings in the web UIs.
- Expose various APIs to TypeScript (@pkgw, #131)
  - The `Layer.enabled` setting
  - The `LayerMap` API to TypeScript
  - `WWTControl.getCurrentReferenceFrame()`
  - `Imageset.{get,set}_wcsImage()`

[toasty]: https://toasty.readthedocs.io/


# @wwtelescope/engine 7.13.0 (2021-07-23)

- Expose Imageset HiPS properties in the TypeScript API, for use by
  downstream applications (#126, @pkgw)


# @wwtelescope/engine 7.12.0 (2021-07-06)

- Remove misspelled, unused `set_opaciy` declaration from Layer API.
- Expose interfaces needed to change HiPS catalog display colors in the research
  app (#119, @Carifio24)


# @wwtelescope/engine 7.11.3 (2021-06-11)

- Fix rendering of non-FITS SkyImages (#113, #114, @imbasimba)


# @wwtelescope/engine 7.11.2 (2021-06-04)

- Fix opacity settings for the new WebGL FITS renderer (#106, #108, @imbasimba)


# @wwtelescope/engine 7.11.1 (2021-06-03)

- Fix an unintentional API breakage that broke the webclient (@pkgw). We
  made a struct field private.
- Expose the new API related to that breakage since it *is* better, though
  (@carifio24).


# @wwtelescope/engine 7.11.0 (2021-06-03)

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
