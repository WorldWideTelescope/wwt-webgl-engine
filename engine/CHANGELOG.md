# rc: minor bump

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
