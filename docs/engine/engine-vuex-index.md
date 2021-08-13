This package turns the [AAS WorldWide Telescope][wwt] rendering engine,
[@wwtelescope/engine], into a well-behaved web app component using [Vue],
[Vuex], and [TypeScript].

[wwt]: https://worldwidetelescope.org/home/
[@wwtelescope/engine]: https://github.com/WorldWideTelescope/wwt-webgl-engine
[Vue]: https://vuejs.org/
[Vuex]: https://vuex.vuejs.org/
[TypeScript]: https://www.typescriptlang.org/

The important top-level interfaces are:

- The [createPlugin] function for initializing the engine
- The [WWTAwareComponent] class defining Vue/Vuex hooks for interfacing with the
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
import { Component } from "vue-property-decorator";
import { fmtDegLat, fmtHours } from "@wwtelescope/astro";
import { WWTAwareComponent } from "@wwtelescope/engine-vuex";

// Extend WWTAwareComponent to auto-inherit WWT view properties:
@Component
export default class App extends WWTAwareComponent {
  get coordText() {
    return `${fmtHours(this.wwtRARad)} ${fmtDegLat(this.wwtDecRad)}`;
  }
}
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

By having your app inherit the [[WWTAwareComponent]] class, you get [TypeScript]
definitions of all of the properties, getters, actions, and mutations that allow
you to observe the WWT component and control it programmatically.

Above we use the [vue-property-decorator] package to simplify the creation of custom
Vue properties in a TypeScript context, but this isn't required.

[vue-property-decorator]: https://www.npmjs.com/package/vue-property-decorator

The associated main application file might look like this:

```ts
import Vue from "vue";
import Vuex from "vuex";
import { createPlugin } from "@wwtelescope/engine-vuex";

import App from "./App.vue";

Vue.use(Vuex);

const store = new Vuex.Store({});

Vue.use(createPlugin(), {
  store,
  namespace: "mywwt"
});

new Vue({
  store,
  el: "#app",
  render: createElement => {
    return createElement(App, {props: {"wwtNamespace": "mywwt"}});
  }
});
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
        vue$: path.resolve('./node_modules/vue/dist/vue.runtime.esm.js'),
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
of the [Vuex] state management library because the WWT engine maintains a great
deal of complex internal state. Realistic web applications will want to reflect
that state in other app components separate from the main WWT view, which calls
for the kind of careful state sychronization that [Vuex] provides.

Finally, because we are big believers in the reliability benefits of using type-
and compile-checked languages, this package is built using [TypeScript]. Since
TypeScript is compiled down to JavaScript, you can ignore the typing
declarations and use it as simple JavaScript library if you so choose.


# Architecture

It’s a bit tricky to provide [Vue components][vue-component] as plugin
libraries, and things get even more complicated if you want to link them up with
Vuex. The architecture of this library may seem a bit complicated but it’s the
most streamlined approach we could devise.

[vue-component]: https://vuejs.org/v2/guide/components.html

The core decision made by this library is to use [Vuex] to manage the shared
state of the WWT engine and the surrounding web app. We haven’t seriously
explored the alternative, but all of our experience in this field leads us to
believe that Vuex is the right paradigm to use if you want to have any chance of
creating a robust, reliable app.

Given that decision, since we’re providing the WWT component as a library, the
Vuex state needs to be exposed as a [Vuex dynamic module][vuex-dynamic-module].
This adds a little hassle because the module needs to be registered during app
startup.

[vuex-dynamic-module]: https://vuex.vuejs.org/guide/modules.html#dynamic-module-registration

Next, in order to make this library composable with a wide range of app
architectures, it is important that the WWT Vuex state module be
[namespaced][vuex-namespacing] configurably. This adds another wrinkle to the
library implementation that you might not see frequently.

[vuex-namespacing]: https://vuex.vuejs.org/guide/modules.html#namespacing
