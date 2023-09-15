# rc: minor bump

- Require the new, ESM-based version of the WebGL engine (#271, @pkgw). While
  the engine transition should not affect any packages that depend on it, such
  as this one, this requirement will help isolate any bugs associated with the
  transition.
- Update sponsorship branding and "front door" email address (#269, #271, @pkgw).


# @wwtelescope/embed-creator 0.4.2 (2023-03-31)

- No code changes
- Bump webpack from 5.75.0 to 5.76.0


# @wwtelescope/embed-creator 0.4.1 (2023-02-27)

- Update dependency version specifications (#233, @pkgw)


# @wwtelescope/embed-creator 0.4.0 (2022-11-30)

- Update to Vue 3 (#215, @Carifio24)! Functional changes should be nil, but
  this modernizes many of the internals.
- Cleanups and improvements to the build and packaging infrastructure (#217,
  @Carifio24, @pkgw). The source repository is now based on Yarn.
- Update to FontAwesome 6.


# @wwtelescope/embed-creator 0.3.5 (2022-04-01)

- Fix a URL typo in the package.json file (@Carifio24).
- Pin the version of fontawesome-svg-core more tightly to keep the build working (@Carifio24)


# @wwtelescope/embed-creator 0.3.4 (2021-06-03)

- Loosen version requirements for Vue CLI tooling


# @wwtelescope/embed-creator 0.3.3 (2021-01-27)

- Remove superfluous no-op "doc" script in the `package.json`
- Correct temporary GitHub URLs in the package.json files


# @wwtelescope/embed-creator 0.3.2 (2020-12-30)

- Use https:// for some sample URLs. Fixes the tour sample when visiting the site
  using HTTPS.


# @wwtelescope/embed-creator 0.3.1 (2020-12-30)

- No code changes, just making Cranko happy.


# @wwtelescope/embed-creator 0.3.0 (2020-10-09)

- Add permissions in the recommended embed `<iframe>` HTML. This will allow
  embeds to fullscreen. We also request some additional permissions that aren't
  used now, but that we might wish to use in the future.


#  @wwtelescope/embed-creator 0.2.1 (2020-09-24)

- No code changes; just issuing a new release for the Cranko switchover.


# [0.2.0](https://github.com/pkgw/wwt-webgl-engine/compare/@wwtelescope/embed-creator@0.2.0-beta.1...@wwtelescope/embed-creator@0.2.0) (2020-06-12)

- Wire up a minimal UI for creating tour-playback embeds


## [0.1.1](https://github.com/pkgw/wwt-webgl-engine/compare/@wwtelescope/embed-creator@0.1.1-beta.0...@wwtelescope/embed-creator@0.1.1) (2020-06-09)

- If activating a "show image" mode, clear out mutually inconsistent state from
  the planetary mode.


# [0.1.0](https://github.com/pkgw/wwt-webgl-engine/compare/@wwtelescope/embed-creator@0.1.0-beta.3...@wwtelescope/embed-creator@0.1.0) (2020-05-24)

**Note:** Version bump only for package @wwtelescope/embed-creator
