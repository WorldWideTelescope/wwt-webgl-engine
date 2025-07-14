This package builds on top of the Pinia store created by the [@wwtelescope/engine-pinia]
package to create a set of reusable Vue components that facilitate building user 
interfaces for [WorldWide Telescope][wwt] (WWT) applications.

[wwt]: https://worldwidetelescope.org/home/
[@wwtelescope/engine-pinia]: https://www.npmjs.com/package/@wwtelescope/engine-pinia

Currently this package provides the following component:

- The Finder Scope, which is an overlay on the WWT view that provides information about the
  nearest item of interest (encoded as a WWT Place object) to the center of its crosshairs.
  The list of items of interest is provided via an object implementing the 
  {@link SearchDataProvider} interface. This package provides the implementing
  {@link DefaultSearchDataProvider} class with a built-in set of astronomical items 
  so that the Finder Scope can be used out-of-the-box, but applications are encouraged
  to implement their own provider to fit their particular needs. The Finder Scope is
  based on the component of the same name from the [WWT webclient][webclient].
  - The {@link SearchDataProvider} interface requires the implementation of a single method,
    `placeForLocation`, which takes in a location (specified using RA/Dec, in degrees)
    and returns a promise resolving to a `Place`. It's somewhat expected that this is 
    the closest location to the given position (so that it will lie under the finder 
    scope's crosshairs), but implementations are free to return any `Place` that they
    choose.

- The Skyball, which shows a representation of the current WWT viewport on the field
  of the sky. This is drawn on an HTML5 canvas, with the canvas size and display colors
  being customizable via props. This component is a Vue version of an item of the same
  name from the WWT [webclient].

[webclient]: https://worldwidetelescope.org/webclient/
