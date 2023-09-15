# @wwtelescope/engine

The [@wwtelescope/engine] package implements the core
[WorldWide Telescope][wwt-home] (WWT) rendering engine. Learn more about WWT
[here][wwt-home].

[@wwtelescope/engine]: https://www.npmjs.com/package/@wwtelescope/engine
[wwt-home]: https://worldwidetelescope.org/home/

For more information, see [the main README of the wwt-webgl-engine
repository][main-readme], which contains the source for this package.

[main-readme]: https://github.com/WorldWideTelescope/wwt-webgl-engine/#readme


## Source structure

The WWT engine code originated in the C# implementation of the [WWT Windows
Client][winclient]. Initially, this code was transpiled into JavaScript using a
tool called [ScriptSharp], which has been unmaintained for a long time.

[winclient]: https://github.com/WorldWideTelescope/wwt-windows-client/
[ScriptSharp]: https://github.com/nikhilk/scriptsharp

Now, the engine is built from pure JavaScript written using ES6 module syntax,
using code derived from the ScriptSharp outputs. Its overall structure and form
closely tracks the original C# code.
