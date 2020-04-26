+++
title = "WWT WebGL Engine Reference Manual"
sort_by = "weight"
insert_anchor_links = "right"
+++

The [WebGL] engine of the [AAS](https://aas.org/) [WorldWide Telescope] puts
essentially the entire power of the [WWT web client] in a JavaScript package
that can be embedded in your own applications. This document is the detailed
reference on its usage and behavior.

[WebGL]: https://www.khronos.org/webgl/
[WorldWide Telescope]: http://www.worldwidetelescope.org/
[WWT web client]: http://www.worldwidetelescope.org/webclient/

{% note() %}
The TypeScript engine described in this document is also sometimes called the
“web control”, “web client”, or the “web SDK”.
{% end %}


## Historical Note

The Web manifestation of WWT has gone through several stages of evolution.
These stages include a [Silverlight] version and the `<canvas>`-based “HTML5”
version. This documentation describes the “WebGL” version, which is the latest
and, we hope, final version of the WWT web engine. We won’t intentionally
break the older versions, but there are no guarantees that they will continue
functioning going forward.

[Silverlight]: https://www.microsoft.com/silverlight/
