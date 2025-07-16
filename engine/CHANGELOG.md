# @wwtelescope/engine 7.31.0 (2025-07-16)

- Add a method for getting a `Place` as XML. This method uses pre-existing engine
  functionality to create the XML representation (#330, @Carifio24).
- Add a method allowing the view's roll angle to be obtained from the WWT script
  interface (#329, @Carifio24).
- Expose the constructor for the `Coordinates` class to TypeScript (#328, @Carifio24).
- Expose several items from the engine to TypeScript, including the `Vector3d` and
  `Coordinates` classes, and functionality for obtaining the rise/set/transit 
  time of an object (#324, @Carifio24).
- Allow adding an optional duration to the slew mover and the various `goto` methods of
  `WWTControl` (#320, @Carifio24). If specified, the movement will have the specified
  duration (in seconds), rather than a duration determined by the engine.
- Fix a bug where the gesture change handler was not respecting using the mode-dependent
  maximum zoom (#304, Carifio24). This fixes a bug that affected Solar System zooming
  on iOS.
- Fix a bug where the WWT clock ran too fast unless the rate was exactly 1 (#301, @Carifio24).
- Fix an issue with circle annotation sizing (#299, @pkgw). In particular, the circle
  sizing was missing a declination-dependent adjustment.
- Port code for drawing Galilean moons over from the Windows client (#298, @pkgw).


# @wwtelescope/engine 7.30.1 (2024-02-08)

- Further improvements to touch gesture handling (#288, @Carifio24). Hopefully
  this nails it!


# @wwtelescope/engine 7.30.0 (2024-02-07)

- Add a `TileCache.clearCache()` method allowing the tile cache to be cleared
  (#290, #291, @Carifio24). This shouldn't be used often but can provide a bit
  of a "reset button" if tile downloads have a hiccup.
- Actually honor the `zoomMin` setting (#292, @johnarban)


# @wwtelescope/engine 7.29.3 (2023-11-10)

- Improve handling of touch gestures: don't be so eager to rotate, and
  avoid panning as the user lifts up their fingers (#283, @Carifio24)
- Build the UMD module with a `globalObject` of `this` rather than `self` (#282,
  @pkgw). This should make the distributed files work in a wider variety of
  contexts, including the Constellations dev builds.


# @wwtelescope/engine 7.29.2 (2023-11-03)

- Correct world <-> screen coordinate transformations for when the camera roll
  angle is nonzero (#279, @Carifio24).
- Fit a corner case in HTTPS URL rewriting (#281, @pkgw). This should hopefully
  fix the linkage between Astrometry.Net and WWT, among other things.
- Update to the latest typedoc, and other improvements to the documentation
  infrastructure (#274, #275, #276, #277, #278, @pkgw).


# @wwtelescope/engine 7.29.1 (2023-09-15)

- Fix tracking functionality in "local horizon mode" (#270, @Carifio24).
- Update sponsorship branding and "front door" email address (#269, #271, @pkgw).


# @wwtelescope/engine 7.29.0 (2023-09-14)

Historically, the WWT engine in this module has consisted of JavaScript code
that was transpiled from a C# codebase using an unmaintained tool called
ScriptSharp. In this release, we drop the C# and work directly from JavaScript
(#261, #262, @pkgw).

The intention is that this change should be invisible to consumers of this
module. However, a few internal APIs have been renamed as part of the
adaptation, to better isolate dependencies. It is possible that external code
referenced these symbols despite their internal nature, but since this is
unsupported and we are not aware of any actual instances of this, we are not
categorizing these as API breaks:

- Some APIs in the `Planets` module/class have been moved into a new
  `Planets3d` name
- `RenderContext.useGl` become `render_globals.(set_)useGl`
- `RenderContext.useGlVersion2` become `render_globals.(set_)useGlVersion2`
- `Tile.demEnabled` become `render_globals.(set_)tileDemEnabled`
- `Tile.prepDevice` become `render_globals.(set_)tilePrepDevice`
- `Tile.uvMultiple` become `render_globals.(set_)tileUvMultiple`
- `TileCache.accessID` become `render_globals.(set_)tileCacheAccessID`
- `TileCache.addTileToQueue` become `render_globals.(set_)tileCacheAddTileToQueue`
- `TileCache.getCachedTile` become `render_globals.(set_)tileCacheGetCachedTile`
- `TileCache.getTile` become `render_globals.(set_)tileCacheGetTile`
- `TileCache.removeFromQueue` become `render_globals.(set_)tileCacheRemoveFromQueue`
- `WWTControl.singleton.freestandingMode` became `data_globals.(set_)freestandingMode`
- `Object3d.maX_VERTICES` and `Object3d.maX_POLYGONS` have disappeared.

It is also possible that the reorganization has unintentionally introduced
changes breaking existing code or behaviors, although a great deal of effort has
been spent to test that no visible changes have occurred. Any behavior changes
traceable to this migration are bugs that will be fixed.

The new codebase is written in plain JavaScript with ES6 (["ESM"]) module
syntax. [Webpack] then assembles the modularized source files into a [UMD]-style
single module file, the same form factor as delivered in previous releases. This
new approach will dramatically ease many aspects of WWT engine development
especially the use of JavaScript libraries and browser features, debugging, and
streamlining the build.

[Webpack]: https://webpack.js.org/
["ESM"]: https://nodejs.org/api/esm.html#modules-ecmascript-modules
[UMD]: https://github.com/umdjs/umd

This release does *not* support building against the individual ESM module
files, although you might be able to get such a use case to work. This is an
obvious potential direction for future work. Another possible direction for work
is a port to TypeScript.


# @wwtelescope/engine 7.28.2 (2023-07-23)

- Actually use the crosshairs color setting (#260, @Carifio24).


# @wwtelescope/engine 7.28.1 (2023-07-01)

- Make sure that annotations properly rerender after their opacity is changed
  (#259, @Carifio24).


# @wwtelescope/engine 7.28.0 (2023-06-26)

- Add support for rotating the view with two-finger touch gestures (#257, @Carifio24).


# @wwtelescope/engine 7.27.0 (2023-06-08)

- Have the `addImagesetToRepository` method return an imageset (#256, @pkgw).


# @wwtelescope/engine 7.26.0 (2023-05-25)

- Expose URLHelpers framework to TypeScript (#250, @imbasimba).


# @wwtelescope/engine 7.25.0 (2023-05-25)

- Add TypeScript declaration for `SpaceTimeController::get_metaNow` (#242, @Carifio24).


# @wwtelescope/engine 7.24.0 (2023-03-31)

- Expose the "addImageSetToRepository" function through the engine stack (#241, @pkgw)
- expose the Place.camParams property (#241, @pkgw)
- Ensure video frames are in the correct order (#240, @Carifio24)
- Make movers aware of SpaceTimeController.MetaNow (#240, @Carifio24)


# @wwtelescope/engine 7.23.0 (2023-03-29)

- Honor opacity settings for geometric annotations that weren't doing
  so before (#238, @Carifio24)
- Expand the frame-capture functionality to be able to capture a sequence of
  frames (#239, @Carifio24). This mode can make sure to wait for tile data to
  download before advancing the engine clock and emitting the next frame, using
  an implementation derived from the Windows client.


# @wwtelescope/engine 7.22.0 (2023-03-20)

- Add and expose more general frame capture functionality based on the
  CaptureThumbnail API (#235, @Carifio24).


# @wwtelescope/engine 7.21.0 (2023-02-27)

- Add guards for undefined variables allowing the engine to be imported in
  headless contexts (#232, @Carifio24). The engine can't run in any meaningful
  way in these contexts, but one may need access to types provided by the
  engine. In particular, in a Vue app with server-side rendering, the same code
  wants to run on both the client and the server-side rendering process, and
  this change makes this feasible.


# @wwtelescope/engine 7.20.0 (2023-02-15)

- Add a "freestanding mode", for WWT adopters who are unable or unwilling to
  rely on WWT's centralized webservices (#230, @pkgw). This forces the
  deactivation of a lot of engine functionality, but what's left is still very
  capable.
- Add a new class `WWTControlBuilder` that allows for more future-proof
  configuration of the WWT engine initialization (#230, @pkgw).
- Avoid a potential exception in screen coordinate computation (#230, @pkgw).


# @wwtelescope/engine 7.19.0 (2023-02-13)

- Make it possible to customize the colors used for various coordinate
  grid overlays and the heigh of the constellation names (#226, @Carifio24).
  These are exposed as new engine settings.
- In various table data layers, fix the icons used for circle and square
  plot types (#228, @Carifio24).


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
