+++
title = "API References"
weight = 99999
+++

This manual includes TypeScript API reference documentation for the following
packages:

- [@wwtelescope/astro](./astro/), some astronomy utilities
- [@wwtelescope/embed-common](./embed-common/), utilities related to the engine embedding functionality
- [@wwtelescope/engine](./engine/), the unadorned WebGL engine
- [@wwtelescope/engine-helpers](./engine-helpers/), idiomatic TypeScript wrappers around the core engine
- [@wwtelescope/engine-types](./engine-types/), basic data types related to the engine
- [@wwtelescope/engine-pinia](./engine-pinia/), the engine wrapped into a reusable [Vue]/[Pinia] component library
- [@wwtelescope/research-app-messages](./research-app-messages/), commands that
  can be sent to the research app

[Vue]: https://vuejs.org/
[Pinia]: https://pinia.vuejs.org/

If you’re interested in writing code to control a WWT display, you might want to
check out the following sections of the documentation:

- For pure JavaScript without any frameworks (the [hosted JavaScript
  model](@/getting-started/hosted-javascript-model.md)) see
  [@wwtelescope/engine](./engine/).
- To control an embedded instance of the research app (the [embedded app
  model](@/getting-started/embedded-app-model.md)) see
  [@wwtelescope/research-app-messages](./research-app-messages/).
- For a custom component-based web app built with Vue (the [Vue component
  model](@/getting-started/vue-component-model.md)) see [the WWT Pinia
  interface](engine-pinia/functions/engineStore.html#md:the-wwt-pinia-interface)
  in [@wwtelescope/engine-pinia](./engine-pinia/).
