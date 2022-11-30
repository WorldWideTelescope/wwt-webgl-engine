# @wwtelescope/engine-types 0.6.4 (2022-11-30)

- No code changes. Make another release because the package of the previous
  release was accidentally incomplete, due to being produced manually as the
  kinks were being worked out in the updated build system.


# @wwtelescope/engine-types 0.6.3 (2022-11-30)

- No code changes.
- Update the `package.json` file to align with new Yarn-based build system
  (#217, @Carifio24, @pkgw).


# @wwtelescope/engine-types 0.6.2 (2022-04-01)

- Fix a URL typo in the package.json file (@Carifio24).


# @wwtelescope/engine-types 0.6.1 (2021-11-17)

- Correctly handle Date types in `isBaseSpreadSheetLayerSetting` (#155, @Carifio24).


# @wwtelescope/engine-types 0.6.0 (2021-09-20)

- Wire in the "Layer.enabled" setting
- Delist "settings" that can't be modified. This is nominally a breaking change,
  although such settings would have been of extremely limited use anyway.


# @wwtelescope/engine-types 0.5.0 (2021-07-20)

- Expose some engine color settings (#125, @pkgw). Unlike certain other
  settings, these are exposed in the API as strings, so they can go
  into this package.


# @wwtelescope/engine-types 0.4.0 (2021-06-03)

- Expose new core catalog-HiPS types used by the engine; namely,
  `BaseVoTableLayerSetting` and related items.


# @wwtelescope/engine-types 0.3.0 (2021-01-27)

This release contains a **breaking change** relating to a rework of how
"settings" are expressed in TypeScript. The previous system was pretty limited
and limiting; the new system is much more functional.

- New enumerations in support of SpreadSheetLayer and ImageSetLayer
- Rework how settings are expressed
- Upgrade TypeDoc and TypeScript
- Correct temporary GitHub URLs in the package.json files


# @wwtelescope/engine-types 0.2.0 (2020-12-30)

- Add the SettingsInterface


# @wwtelescope/engine-types 0.1.1 (2020-09-23)

- No code changes; issuing a new release as part of the Cranko switchover.


# [0.1.0](https://github.com/pkgw/wwt-webgl-engine/compare/@wwtelescope/engine-types@0.1.0-beta.0...@wwtelescope/engine-types@0.1.0) (2020-05-23)

**Note:** Version bump only for package @wwtelescope/engine-types
