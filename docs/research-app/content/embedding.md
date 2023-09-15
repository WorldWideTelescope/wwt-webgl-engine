+++
title = "Embedding the Research App"
weight = 100
+++

One of the most useful things about the WWT research application is that you can
[embed][embed-intro] it in your own webpages or web applications. This is useful
on its own, and you can also go farther and [control][controlling] the embed
programmatically from the outside.

[embed-intro]: https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Other_embedding_technologies
[controlling]: @/controlling.md

**NOTE:** *This functionality is in beta-test and the details here are subject to
change. We will do our best to ensure that the documentation stays accurate but
it is possible that information here might be out of date.*

Here’s an example of an app embed:

{{ app() }}


# “Hosted” Embedding

You can embed the research app in your website using an HTML [`<iframe>`] tag. The
easiest way to get this going is to point your iframe at the official WWT-hosted
version of the app. If you’re hand-coding HTML, you might write:

[`<iframe>`]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe

```html
<iframe
  id="wwtResearch"
  width="750px"
  height="600px"
  src="https://web.wwtassets.org/research/latest/"
  allow="accelerometer; clipboard-write; gyroscope"
  allowfullscreen
  frameborder="0"
>
  <p>ERROR: cannot display WorldWide Telescope research app!</p>
</iframe>
```

The only really essential item here is the `src` attribute, which specifies
where the research app `iframe` will come from. The link shown above points to
WWT servers, so that your app embed will automatically get updates to the app
as development occurs.


# Custom Embedding

You can also build the app yourself and embed a custom version rather than the
default WWT-supplied version. In particular, you may need to do this if you need
the app to be able access restricted data as defined by the web’s [same-origin
policy][same-origin]. For instance, say that you have access-protected data
being served off of `mysurvey.org`, and you want to embed the WWT research app
to allow people to explore the data. Even if you serve up the embed from a page
in the `mysurvey.org` domain, the WWT hosted app still has an origin of
`https://web.wwtassets.org`, and web security policies prevent it from “knowing”
the authentication information for `mysurvey.org`. But if you host a custom
build of the app *also* on `mysurvey.org`, everything will be on the same
origin, and access will be allowed.

[same-origin]: https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy

All you need to host your own version of the research app is a static-file HTTP
service — there are no active server-side components in the app per se. The
research app is based on the [Vue] framework.

[Vue]: https://vuejs.org/

To deploy a custom version of the app, you’ll need to build it from its source
in the [@wwtelescope/research-app] NPM package or the [wwt-webgl-engine] Git
repository. Copy the built files (the `dist/` subdirectory) to whichever
directory will allow your web server to make them available, and you’re good to
go. You should be able to follow the same pattern as for the hosted case, just
changing the `src` attribute of the `<iframe>` to point to your version of the
app.

[@wwtelescope/research-app]: https://www.npmjs.com/package/@wwtelescope/research-app
[wwt-webgl-engine]: https://github.com/WorldWideTelescope/wwt-webgl-engine/


Unlike the “hosted” approach, you’ll be responsible for deploying updates to the
app’s functionality.

If you look at this source code to this HTML page, you’ll see that it uses a
custom embed of the research app — this documentation is built as part of
deployment of the [wwt-webgl-engine] repository, and a custom copy of the app is
included to ensure that the example app and the documentation are in sync.
