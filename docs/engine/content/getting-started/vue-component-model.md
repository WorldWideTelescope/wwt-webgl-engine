+++
title = "The Vue/Pinia Component Model"
weight = 400
+++

The main WWT applications are built using the [Vue 3] UI framework with the
[Pinia] state management library. If you use these too, you can take advantage
of a lot of useful tools for creating your own customized WWT-based
applications.

[Vue 3]: https://vuejs.org/
[Pinia]: https://pinia.vuejs.org/

We’ll assume that you already have a skeleton Vue app in place. To add WWT to
it, we recommend adding
the {{engineapi(p="index.html",t="@wwtelescope/engine")}}
and {{piniaapi(p="index.html",t="@wwtelescope/engine-pinia")}} packages as
project dependencies, using a command something like:

```sh
$ npm install --save @wwtelescope/engine @wwtelescope/engine-pinia
```

From there, check out the main page of
the {{piniaapi(p="index.html",t="@wwtelescope/engine-pinia")}} documentation for
instructions on wiring WWT into your application as a [Vue component] and [Pinia
module]. Note that if you are using [TypeScript] (which we strongly encourage),
some manual futzing of your project files may be necessary to work around some
issues in the current Vue build infrastructure.

[Vue component]: https://v2.vuejs.org/v2/guide/#Composing-with-Components
[Pinia module]: https://pinia.vuejs.org/core-concepts/
[TypeScript]: https://www.typescriptlang.org/
