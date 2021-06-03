# rc: minor bump

This release contains a fairly trivial breaking change.

- Add a new `SetLayerOrder` message to control imageset layer stacking
  (@imbasimba)
- Add a new URL-based `CreateImageSetLayer` API that makes it easier to
  load generic imagery into layers (not just FITS) (@imbasimba)
- Add a new optional `roll` parameter to `CenterOnCoordinates` (@imbasima)
- Add an optional `loadChildFolders` setting to `LoadImageCollection` (@imbasima)
- BREAKING: rename `RemoveFitsLayer` to `RemoveImageSetLayer` (@imbasima)


# @wwtelescope/research-app-messages 0.4.0 (2021-01-27)

- Add a typing layer for pywwt spreadsheet settings
- Fix detection of the SpreadSheetLayer modify message
- Wire up the TrackObjectMessage
- Fix another linter complaint


# @wwtelescope/research-app-messages 0.3.0 (2021-01-12)

- Add `classicPywwt.applyBaseUrlIfApplicable`.


# @wwtelescope/research-app-messages 0.2.0 (2021-01-07)

- Update NPM/TypeScript meta-foo to try to play nice with Jupyter.


# @wwtelescope/research-app-messages 0.1.0 (2021-01-07)

- Initial release of message types module for the prototype research application
  and Jupyer extension. It looks like we might need to make this publicly
  available for the extension to work.
