+++
title = "Getting Started"
weight = 100
sort_by = "weight"
insert_anchor_links = "right"
+++

There are a range of ways that you can use the WWT WebGL engine, depending on
the level of sophistication that you’re trying to achieve and the tools you’re
prepared to use.

- If you want to deploy a generic interface for astronomical data visualization,
  you can probably skip most of the coding by simply **[embedding the WWT
  research app](@/getting-started/embedded-app-model.md)** and not building your
  own custom UI.
- Prototyping a custom UI with basic HTML and JavaScript, and no build tools or
  fancy infrastructure? You may want to use the **[hosted JavaScript
  model](@/getting-started/hosted-javascript-model.md)**. But for serious
  applications, we recommend adopting more sophisticated tooling.
- If you’re using [npm] or another JavaScript package manager, a slightly more
  elaborate approach is the **[bundled TypeScript
  model](@/getting-started/bundled-typescript-model.md)**: import
  the {{engineapi(p="index.html",t="@wwtelescope/engine")}} package into your
  project and interface with it using the [TypeScript] language.
- If the bundled TypeScript approach sounds good *and* you can use [Vue] with
  [Pinia] — or if you don’t know that you *can’t* use them — we strongly
  recommend the **[Vue/Pinia component
  model](@/getting-started/vue-component-model.md)**.

[npm]: https://npmjs.com/
[TypeScript]: https://www.typescriptlang.org/
[Vue]: https://vuejs.org/
[Pinia]: https://pinia.vuejs.org/
