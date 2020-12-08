# rc: micro bump

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
