+++
title = "The Embedded App Model"
weight = 100
+++

The WWT “research app” is a pre-built application for the exploration of generic
astronomical data. It’s the application that’s embedded in [the WWT JupyterLab
plugin][wwt-jlab]. If you don’t need to create any specialized effects, it’s
probably better and certainly easier to embed the WWT research app than to
create your own custom WWT-based application.

[wwt-jlab]: https://github.com/WorldWideTelescope/wwt-jupyterlab/

You can control the research app from another webpage by sending it [JSON
messages][messages-api]. These messages are easy to construct and cover a
variety of typical operations, such as loading an images or sending the view to
a particular set of coordinates.

[messages-api]: ../../apiref/research-app-messages/

**TODO**: cross-reference when research-app docs are live!
