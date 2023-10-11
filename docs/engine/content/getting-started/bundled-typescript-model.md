+++
title = "The Bundled TypeScript Model"
weight = 300
+++

If you’re using [npm] or another JavaScript package manager, we recommend
bundling the WWT engine in your application and interfacing with it using the
[TypeScript] language. Relative to the [hosted JavaScript
model](@/getting-started/hosted-javascript-model.md), the combination of a
package manager and TypeScript makes it much easier to build complex, reliable
applications.

[npm]: https://npmjs.com/
[TypeScript]: https://www.typescriptlang.org/

We’ll assume that you’ve got a skeleton application set up using your package
manager of choice and TypeScript compilation set up. If you’re not sure where to
start, there are innumerable tutorials out there. To pick one example, the
TypeScript docs [show how to create a simple app using the `gulp`
tool][ts-gulp-example]. If you don’t have a preferred UI framework, we recommend
[Vue] since that’s what the existing WWT apps use, and
the {{piniaapi(p="index.html",t="@wwtelescope/engine-pinia")}} package provides lots
of useful tools for building sophisticated WWT-powered apps in a Vue
environment.

[ts-gulp-example]: https://www.typescriptlang.org/docs/handbook/gulp.html
[Vue]: https://vuejs.org/

Once your skeleton is ready, we recommend adding
the {{engineapi(p="index.html",t="@wwtelescope/engine")}}
and {{helpersapi(p="index.html",t="@wwtelescope/engine-helpers")}}
packages as dependencies, using a command something like:

```sh
$ npm install --save @wwtelescope/engine @wwtelescope/engine-helpers
```

In your HTML, you should create a `<div>` with a unique ID which will host the
WWT viewport:

```html
<div id="wwtcanvas" style="width: 750px; height: 750px"></div>
```

In your application’s initialization code, you need to initialize the WWT engine and
link it up to your `<div>`:

```ts
import { WWTInstance } from '@wwtelescope/engine-helpers';

// asynchronous initialization:
const wwt = new WWTInstance({
  elId: 'wwtcanvas',
  startInternalRenderLoop: true,
});
await wwt.waitForReady();
```

After the engine has signaled readiness, you can start controlling it.
The {{helpersapi(p="classes/WWTInstance.html",t="WWTInstance")}} class offers
two conveniences:

1. Its `ctl`, `si`, `lm`, and `stc` fields provide access to the core components
   of the WWT engine as exposed in {{engineapi(p="index.html",t="@wwtelescope/engine")}}.
2. The class also provides convenience wrappers around certain APIs that benefit from
   more idiomatic JavaScript/TypeScript usage, as in the async-aware
   method {{helpersapi(p="classes/WWTInstance.html#waitForReady",t="waitForReady()")}}.

Check out the {{helpersapi(p="classes/WWTInstance.html",t="WWTInstance")}} API
reference to explore the possibilities!
