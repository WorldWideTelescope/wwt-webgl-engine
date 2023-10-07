More idiomatic wrappers for the [WWT engine](../engine/).

This package provides infrastructure for controlling the WWT engine with your
own JavaScript/TypeScript code. It’s higher-level than the pure
[@wwtelescope/engine](../engine/) implementation, but not as sophisticated as
the [@wwtelescope/engine-pinia](../engine-pinia/) package, which helps you
include WWT in modern, component-based web applications via the [Vue] and
[Pinia] frameworks.

[Vue]: https://vuejs.org/
[Pinia]: https://pinia.vuejs.org/

Your primary gateway into this package is the {@link WWTInstance} type, which
provides an object-oriented interface for controlling the WWT engine.
