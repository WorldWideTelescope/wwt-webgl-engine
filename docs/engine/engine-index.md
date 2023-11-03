This package contains the core WWT WebGL engine. It is written in plain
JavaScript and decorated with TypeScript annotations, which are then used to
generate this documentation. The annotations cover very large fractions of its
functionality, but not everything.

To work with the WWT engine in your own code, we recommended starting with a
higher-level module like [@wwtelescope/engine-helpers](../engine-helpers/) or
the [Vue]-based framework in [@wwtelescope/engine-pinia](../engine-pinia/).
However, regardless of which broad framework you use, if you interact with the
engine in detail you will likely end up using and referring to the definitions
in this module.

[Vue]: https://vuejs.org/

Your primary interfaces to control the engine are the
[WWTControl](./classes/WWTControl-1.html) and the
[ScriptInterface](./classes/ScriptInterface.html) types, both of which exist as
global singletons. To initialize these objects, use
[WWTControlBuilder](./classes/WWTControlBuilder.html).
