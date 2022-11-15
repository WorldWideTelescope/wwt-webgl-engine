This package turns the [AAS WorldWide Telescope][wwt] rendering engine,
[@wwtelescope/engine], into a well-behaved web app component using [Vue],
[Pinia], and [TypeScript].

[wwt]: https://worldwidetelescope.org/home/
[@wwtelescope/engine]: https://github.com/WorldWideTelescope/wwt-webgl-engine
[Vue]: https://vuejs.org/
[Pinia]: https://pinia.vuejs.org/
[TypeScript]: https://www.typescriptlang.org/

The important top-level interfaces are:

- The [WWTAwareComponent] component defining Vue/Pinia hooks for interfacing with the
  engine

[createPlugin]: ./globals.html#createplugin
[WWTAwareComponent]: ./classes/wwtawarecomponent.html


# Quick Start

A minimal Vue [single-file-component][sfc] building on this library might look like
this:

[sfc]: https://vuejs.org/v2/guide/single-file-components.html

```vue
<template>
  <div id="app">
    <!-- Include a WWT Component: -->
    <WorldWideTelescope wwt-namespace="mywwt"></WorldWideTelescope>
    <p class="coord-overlay">{{ coordText }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { fmtDegLat, fmtHours } from "@wwtelescope/astro";
import { WWTAwareComponent } from "@wwtelescope/engine-pinia";

// Extend WWTAwareComponent to auto-inherit WWT view properties:
export default App = defineComponent({
  extends: WWTAwareComponent,

  computed: {
    coordText() {
      return `${fmtHours(this.wwtRARad)} ${fmtDegLat(this.wwtDecRad)}`;
    }
  }
});
</script>

<style lang="less">
#app {
  .wwtelescope-component {
    width: 600px;
    height: 400px;
    margin: 0;
    padding: 0;
  }

  .coord-overlay {
    position: absolute;
    top: 1rem;
    left: 1rem;
    color: #FFF;
  }
}
</style>
```

By having your app extend the [[WWTAwareComponent]] component, you get [TypeScript]
definitions of all of the properties, getters, and actions that allow
you to observe the WWT component and control it programmatically.

The associated main application file might look like this:

```ts
import { createApp } from "vue";
import { wwtPinia, WWTComponent } from "@wwtelescope/engine-pinia";

import App from "./App.vue";

createApp(App, {
    wwtNamespace: "mywwt"
  })
  .use(wwtPinia)
  .component('WorldWideTelescope', WWTComponent)
  .mount("#app");
```

Note that for now, **you can only include one WWT component in each app**,
because the WWT engine library maintains global state. To work around this, use
iframes.

Finally, if you’re using [Webpack], you may run into a pitfall because this
library must explicitly depend on the Vue package to obtain its TypeScript
types. This can lead Webpack to include multiple copies of Vue in your final app
bundle, leading to all sorts of non-obvious problems. If you’re using [Vue CLI]
for your app, the following code in `vue.config.js` fixes the problem:

[Webpack]: https://webpack.js.org/
[Vue CLI]: https://cli.vuejs.org/

```js
const path = require('path');

module.exports = {
  // ...

  configureWebpack: {
    resolve: {
      alias: {
        vue$: path.resolve('./node_modules/vue/dist/vue.runtime.esm-bundler.js'),
      },
    },
  },
};
```

See [this GitHub
comment](https://github.com/vuejs/vue-cli/issues/4271#issuecomment-585299391)
for more information.

Once you've gotten the basics set up, consult the documentation of the
[WWTAwareComponent] for an organized overview of all of the ways that your app
can interact with the WWT rendering engine.


# Motivation

The [@wwtelescope/engine] module provides an extremely powerful and flexible
astronomical visualization engine. However, because its code is transpiled from
the C# underyling the [WWT Windows application][wwt-windows], it is far from
idiomatic and does not integrate smoothly into the modern web development
ecosystem.

[wwt-windows]: https://github.com/WorldWideTelescope/wwt-windows-client

This package exposes the power of the WWT engine to [Vue]. It requires the use
of the [Pinia] state management library because the WWT engine maintains a great
deal of complex internal state. Realistic web applications will want to reflect
that state in other app components separate from the main WWT view, which calls
for the kind of careful state sychronization that [Pinia] provides.

Finally, because we are big believers in the reliability benefits of using type-
and compile-checked languages, this package is built using [TypeScript]. Since
TypeScript is compiled down to JavaScript, you can ignore the typing
declarations and use it as simple JavaScript library if you so choose.


# Architecture

It’s a bit tricky to provide [Vue components][vue-component] as plugin
libraries, and things get even more complicated if you want to link them up with
Pinia. The architecture of this library may seem a bit complicated but it’s the
most streamlined approach we could devise.

[vue-component]: https://vuejs.org/v2/guide/components.html

The core decision made by this library is to use [Pinia] to manage the shared
state of the WWT engine and the surrounding web app. We haven’t seriously
explored the alternatives, but all of our experience in this field leads us to
believe that Pinia is the right paradigm to use if you want to have any chance of
creating a robust, reliable app.
