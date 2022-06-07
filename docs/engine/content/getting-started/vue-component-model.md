+++
title = "The Vue/Vuex Component Model"
weight = 400
+++

The main WWT applications are built using the [Vue] UI framework using the
[Vuex] state management library. If you use these too, you can take advantage of
a lot of useful tools for creating your own customized WWT-based applications.

[Vue]: https://vuejs.org/
[Vuex]: https://vuex.vuejs.org/

We’ll assume that you already have a skeleton Vue app in place. To add WWT to
it, we recommend adding
the {{engineapi(p="index.html",t="@wwtelescope/engine")}}
and {{vuexapi(p="index.html",t="@wwtelescope/engine-vuex")}} packages as
project dependencies, using a command something like:

```sh
$ npm install --save @wwtelescope/engine @wwtelescope/engine-vuex
```

From there, check out the main page of
the {{vuexapi(p="index.html",t="@wwtelescope/engine-vuex")}} documentation for
instructions on wiring WWT into your application as a [Vue component] and [Vuex
module]. Note that if you are using [TypeScript] (which we strongly encourage),
some manual futzing of your project files may be necessary to work around some
issues in the current Vue build infrastructure.

[Vue component]: https://v2.vuejs.org/v2/guide/#Composing-with-Components
[Vuex module]: https://vuex.vuejs.org/guide/modules.html
[TypeScript]: https://www.typescriptlang.org/
