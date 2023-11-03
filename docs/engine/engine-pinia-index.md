This package turns the [WorldWide Telescope][wwt] rendering engine,
[@wwtelescope/engine], into a well-behaved web app component using [Vue],
[Pinia], and [TypeScript].

[wwt]: https://worldwidetelescope.org/home/
[@wwtelescope/engine]: https://github.com/WorldWideTelescope/wwt-webgl-engine
[Vue]: https://vuejs.org/
[Pinia]: https://pinia.vuejs.org/
[TypeScript]: https://www.typescriptlang.org/

Vue and Pinia are systems that provide a slick, modern framework for creating
[component-based] Web applications. This kind of approach requires more
infrastructure than hand-coding HTML and JavaScript, but it allows you to build
large, sophisticated apps in a tractable way — while also making it easy to take
advantage of pre-built, third-party app components. To learn more about these
frameworks, we suggest checking out [the Vue
guide](https://vuejs.org/guide/introduction.html) and then [the Pinia
guide](https://pinia.vuejs.org/core-concepts/). There are many, many other
tutorials for these popular packages around the web as well.

[component-based]: https://vuejs.org/guide/essentials/component-basics.html

This package provides the following building blocks:

- A system that lets you control the WWT engine using the [Pinia]
  state-management framework, accessed with the {@link engineStore} function.
  This integration provides a standardized way for different pieces of code
  (say, different components of a web app) to observe the state of the WWT
  engine (say, the current coordinates of its view center) as well as control it
  (say, trigger a slew to a new location).
- A reusable [Vue] component, {@link WWTComponent}, that contains a WWT view and
  links it up to the Pinia system. If you include a {@link WWTComponent} in your
  Vue-based web application, you can control it from anywhere else in your
  codebase by using Pinia actions like {@link engineStore.gotoRADecZoom}.
- Finally, this package also provides a helper called {@link WWTAwareComponent}.
  If you are using Vue’s [“options API”][opt-api], you can use it as a base
  class for your own Vue components (say, a readout of the current view
  coordinates) to gain easy access to the WWT state. Specifically, this base
  class provides a full suite of getters and methods that are automagically
  wired up to the engine’s Pinia state. In Vue’s [“composition API”][opt-api],
  the recommended style is use the {@link engineStore} directly.

[Vue component]: https://vuejs.org/guide/essentials/component-basics.html
[opt-api]: https://vuejs.org/guide/introduction.html#api-styles

The key benefit provided by this whole framework is that it makes it easy to
integrate WWT into a modern, component-based web application. *Any* component
that needs to observe or control the WWT view — not just the one directly
wrapping it — can do so, thanks to Pinia.


# API Overview

If you‘re constructing a Vue app based on this system, you’ll need to use these
key interfaces:

- {@link WWTComponent} to include an actual WWT view in your app somewhere
- If that you have any code that needs to interact with WWT, also:
  - {@link wwtPinia} to set up the WWT Pinia linkage.
  - {@link engineStore} or {@link WWTAwareComponent} to talk to the engine.

See the next section for a minimal example of how to do this. If you’re using
Vue’s Options API, you may also find it convenient to use {@link
WWTAwareComponent} as a base class for some of your components to get pre-wired
methods for interacting with the WWT engine Pinia state.

Once you have wired things up, you presumably want to know what WWT is doing and
to command it! See [The WWT Pinia
Interface](functions/engineStore.html#md:the-wwt-pinia-interface) for an
overview of all the possible ways that your application code can interact with
the WWT engine.


# Quick Start for Vue Initiates

If you’re familiar with Vue, you might want to see what a minimal
[single-file-component][sfc] building on this library would look like:

[sfc]: https://vuejs.org/guide/scaling-up/sfc.html

```vue
<template>
  <div id="app">
    <!-- Include a WWT Component: -->
    <WorldWideTelescope></WorldWideTelescope>
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

By having your app extend the {@link WWTAwareComponent} component, you get
[TypeScript] definitions of all of the properties, getters, and actions that
allow you to observe the WWT component and control it programmatically.

The associated main application file might look like this:

```ts
import { createApp } from "vue";
import { wwtPinia, WWTComponent } from "@wwtelescope/engine-pinia";

import App from "./App.vue";

createApp(App)
  .use(wwtPinia)
  .component('WorldWideTelescope', WWTComponent)
  .mount("#app");
```

Note that for now, **you can only include one WWT component in each app**,
because the WWT engine library maintains global state. To work around this, use
iframes.

Alternatively, it is possible to mount separate *full instances* of
the application to the same web page by passing in a unique `id` when creating
the Vue app using the `customId` prop.

```ts
...

createApp(App, {
    customId: "myCustomId"
  })
  .use(wwtPinia)
  .component('WorldWideTelescope', WWTComponent)
  .mount("#app");
```

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

Once you've gotten the basics set up, consult the documentation of the {@link
WWTAwareComponent} for an organized overview of all of the ways that your app
can interact with the WWT rendering engine.


# Motivation

The [@wwtelescope/engine] module provides an extremely powerful and flexible
astronomical visualization engine. However, because its code was based on the C#
underyling the [WWT Windows application][wwt-windows], it is far from idiomatic
and does not integrate smoothly into the modern web development ecosystem.

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

[vue-component]: https://vuejs.org/guide/essentials/component-basics.html

The core decision made by this library is to use [Pinia] to manage the shared
state of the WWT engine and the surrounding web app. We haven’t seriously
explored the alternatives, but all of our experience in this field leads us to
believe that Pinia is the right paradigm to use if you want to have any chance of
creating a robust, reliable app.
