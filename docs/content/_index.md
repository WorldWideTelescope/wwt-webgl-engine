+++
title = "WWT WebGL Engine Reference Manual"
sort_by = "weight"
insert_anchor_links = "right"
+++

The [WebGL] engine of the [AAS](https://aas.org/) [WorldWide Telescope] puts
essentially the entire power of the [WWT web client] in a [TypeScript] package
that can be embedded in webpages or your own applications. Like this!

[WebGL]: https://www.khronos.org/webgl/
[WorldWide Telescope]: http://www.worldwidetelescope.org/
[WWT web client]: https://www.worldwidetelescope.org/webclient/
[TypeScript]: https://www.typescriptlang.org/

<iframe src="embed/?planet=mars" class="wwt-embed" allow="accelerometer; autoplay; clipboard-write; gyroscope" allowfullscreen>
</iframe>

This manual is the detailed reference on its usage and behavior.


## Historical Note

The Web manifestation of WWT has gone through several stages of evolution.
These stages include a [Silverlight] version and the `<canvas>`-based “HTML5”
version. This documentation describes the “WebGL” version, which is the latest
and, we hope, final version of the WWT web engine. We won’t intentionally
break the older versions, but there are no guarantees that they will continue
functioning going forward.

[Silverlight]: https://www.microsoft.com/silverlight/
