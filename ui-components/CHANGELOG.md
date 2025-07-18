# @wwtelescope/ui-components 0.1.1 (2025-07-18)

- Fix a bug where the Finder Scope's circle annotation could fail to be cleared when
  the component is destroyed (#333, @Carifio24).

# @wwtelescope/ui-components 0.1.0 (2025-07-16)

First release of a new subpackage for general-purpose WWT user interface components.
Currently this package contains two components, both of which are based on the components
of the same name in the WWT webclient:
- The Finder Scope is an overlay on the WWT view that provides information about the nearest
  item of interest (encoded as a `Place` object). This list is provided via a prop providing 
  an implementation of the `SearchDataProvider` interface. This package contains a
  `DefaultSearchDataProvider` class implementing this interface, which uses the same
  items as the WWT webclient, though client applications are free to use their own implementations.
- The Skyball shows a representation of the current WWT viewport on the sphere of the sky.
  The display of the skyball (size and colors) is customizable via props.
