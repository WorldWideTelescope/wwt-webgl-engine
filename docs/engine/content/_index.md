+++
title = "WWT WebGL Engine Reference Manual"
sort_by = "weight"
insert_anchor_links = "right"
+++

The “[WebGL] engine” is the core renderer that powers the web-based forms of the
[AAS](https://aas.org/) [WorldWide Telescope] software system. While it
underpins the [WWT web client] application, it is a reusable [TypeScript]
framework that can be embedded in webpages or your own applications. Like this!

[WebGL]: https://www.khronos.org/webgl/
[WorldWide Telescope]: http://www.worldwidetelescope.org/
[WWT web client]: https://www.worldwidetelescope.org/webclient/
[TypeScript]: https://www.typescriptlang.org/

<iframe src="embed/?planet=mars" class="wwt-embed" allow="accelerometer; autoplay; clipboard-write; gyroscope" allowfullscreen>
</iframe>

This manual is the detailed reference on its usage and behavior.


## Historical Note

The Web manifestation of WWT has gone through several stages of evolution. These
stages include a [Silverlight] web client, a `<canvas>`-based “HTML5” version, a
“WebGL” iteration, and gradual improvements in its modularization. We won’t
intentionally break the pre-WebGL versions, but there are no guarantees that
they will continue functioning going forward.

[Silverlight]: https://www.microsoft.com/silverlight/
