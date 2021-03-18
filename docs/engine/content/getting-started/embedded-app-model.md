+++
title = "The Embedded App Model"
weight = 100
+++

The WWT [research app] is a pre-built web application for the exploration of
general astronomical data. It’s the tool that’s embedded in [the WWT JupyterLab
plugin][wwt-jlab]. If you don’t need to create any specialized effects, it’s
probably better and certainly easier to embed the WWT research app than to
create your own custom WWT-based application.

[research app]: https://docs.worldwidetelescope.org/research-app/latest/
[wwt-jlab]: https://github.com/WorldWideTelescope/wwt-jupyterlab/

In the research app documentation, the page [Embedding the Research
App][embedding] explains how to embed the research app in your own webpage or
app. All you need to get started is to add an HTML [`<iframe>`] element.

[embedding]: https://docs.worldwidetelescope.org/research-app/latest/embedding/
[`<iframe>`]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe

Once you’ve got that set up, you can control the research app programmatically
by sending it [JSON messages][messages-api]. These messages are easy to
construct and cover a variety of typical operations, such as loading an images
or sending the view to a particular set of coordinates. See [Controlling an
Embedded Research App][controlling] for an overview of how to send messages, and
the documentation of the [@wwtelescope/research-app-messages][messages-api] NPM
package for a specification of the allowed messages.

[messages-api]: ../../apiref/research-app-messages/
[controlling]: https://docs.worldwidetelescope.org/research-app/latest/controlling/
