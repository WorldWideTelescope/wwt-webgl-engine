# rc: minor bump

New APIs to help support startup scripting of the research app (#155,
@Carifio24):

- `layers.isLoadHipsCatalogCompletedMessage`
- `layers.MultiModifyTableLayerMessage` and type guard function
- `layers.MultiModifyFitsLayerMessage` and type guard function
- `layers.MultiModifyAnnotationMessage` and type guard function
- `selections.AddSourceMessage` and type guard function


# @wwtelescope/research-app-messages 0.11.2 (2021-10-27)

- Not quite "fix the fix", but ... improve it (#154, @pkgw). We only replaced
  the first instance of braces.


# @wwtelescope/research-app-messages 0.11.1 (2021-10-26)

- Work around undesirable URL escaping that could be added when applying a
  base-URL in `classic_pywwt.applyBaseUrlIfApplicable()` (#153, @pkgw). This
  escaping irrevocably altered URLs with WWT templates, which in turn made it
  impossible to use certain engine APIs that look up URLs using string
  comparions.


# @wwtelescope/research-app-messages 0.11.0 (2021-10-25)

- Update the selection interface to support selected sources that originate in
  either HiPS progressive catalogs (as before) or also regular "spreadsheet"
  layers (#146, @Carifio24). This change involves some field name changes that
  would break existing client code that interacted with source selection
  messages, if there was any in the wild.


# @wwtelescope/research-app-messages 0.10.0 (2021-09-20)

More new interfaces and fixes supporting neat new features in the research app
(@Carifio24, @pkgw)!

- Fix a function signature bug which was preventing catalogs from being made
  visible after being hidden.
- Add the `SelectionStateMessage` for broadcasting messages about source and
  catalog selections, and related types.
- Wire in the `Layer.enabled` setting


# @wwtelescope/research-app-messages 0.9.0 (2021-07-23)

- Add new messages for interacting with HiPS catalogs (#126, @pkgw). These are a
  bit funky since they're sort of simultaneously imagesets and spreadsheet
  layers. The new messages allow them to be created and controlled using the
  existing spreadsheet layer APIs. You can also download the data that they
  contain.
- Also add an ApplicationStateMessage that currently allows clients to learn the
  names of available HiPS catalogs. It will be expanded to convey the other
  pieces of state that clients will want to track (e.g., current foreground and
  background imagery).


# @wwtelescope/research-app-messages 0.8.0 (2021-07-20)

- Define a simple new app-level settings framework (#125, @pkgw). This
  currently provides one setting, `hideAllChrome`, needed to help pywwt.


# @wwtelescope/research-app-messages 0.7.1 (2021-07-16)

- Fix an accidental backwards-compatibility breakage: the `mode` field of
  CreateImageSetLayerMessage has to remain optional (#122, @pkgw)


# @wwtelescope/research-app-messages 0.7.0 (2021-07-16)

Add a few new attributes to improve our positioning for allowing multiple
clients to talk to multiple apps, all through a single messaging hub (#121,
@pkgw):

- add a threadId field to LoadImageCollection
- add a sessionId field to ViewStateMessage
- define the PingPongMessage

Also fix up some docs overrides.


# @wwtelescope/research-app-messages 0.6.0 (2021-07-06)

- Define a new `LoadImageCollectionCompletedMessage` type (#118, @imbasimba)


# @wwtelescope/research-app-messages 0.5.0 (2021-06-03)

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
