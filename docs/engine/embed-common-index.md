Utilities relating to the embedding functionality.

Check out the [module page](./modules.html) for an index of the types defined in
this package.

The core type is [EmbedSettings](./classes/EmbedSettings.html), which expresses
a set of settings that can be used to configure the WWT embed app. The [embed
creator](https://embed.worldwidetelescope.org/) uses this type to serialize
settings, and the [embed app](https://www.npmjs.com/package/@wwtelescope/embed)
uses it to deserialize them and set up the engine.
