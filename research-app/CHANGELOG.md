# @wwtelescope/research-app 0.2.1 (2021-06-04)

- Tweak some of the background selector CSS so that it doesn't cover up the
  hamburger menu, and so that it shrinks better in a narrow viewport (#107,
  #110, @Carifio24, @pkgw)


# @wwtelescope/research-app 0.2.0 (2021-06-03)

Lots of new features!

- Add a background chooser UI (@Carifio24). Unlike the background chooser in the
  embed app, this one is "research-grade", allowing access to the full suite of
  WWT all-sky imagery, including the many HiPS datasets that we can now render,
  with slick autocompletion.
- Use the new 7.11 series of the engine with WebGL-based FITS rendering, and show
  a warning if the user's browser doesn't support it (@imbasimba). This is motivated
  because almost everyone supports WebGL 2.0 now, but for a little while longer in
  Safari you need to turn it on as an "advanced" option.
- Add a core set of view-control keybindings mirroring the pywwt widget
  (@Carifio24).
- Start implementing keyboard accessibility for the main app (@Carifio24).
- Handle some new messages needed for the OpenSpace integration work
  (@imbasimba): there are new JSON messages letting you reorder imageset layers,
  control the roll of the viewer, have more control over imagesets to load, control
  whether to "goto" those imagesets when they are loaded, and control whether to load
  WTML collections recursively.
- Loosen version requirements for Vue CLI tooling (@pkgw).


# @wwtelescope/research-app 0.1.0 (2021-01-27)

First release of the new "research application". This will be the embeddable UI
for use in Jupyter, reseacher-oriented interfaces, etc.

This version can handle all of the messages from the pywwt "JSON API", which
means that it can be dropped in as a replacement for the pywwt widget with the
proper JupyterLab glue, as implemented in what is currently called the
`wwt-research-kit` repo.
