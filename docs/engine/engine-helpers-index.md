More idiomatic wrappers for the [engine](../engine/).

This package provides infrastructure for controlling the WWT engine with your
own JavaScript/TypeScript coe. It’s higher-level than the pure
[@wwtelescope/engine](../engine/) implementation, but not as sophisticated as
the [@wwtelescope/engine-pinia](../engine-pinia/) package, which depends on
[Vue] and [Pinia].

[Vue]: https://vuejs.org/
[Pinia]: https://pinia.vuejs.org/

Your primary gateway into this package is the
[WWTInstance](./classes/WWTInstance.html) type, which provides an
object-oriented interface for controlling the WWT engine.
