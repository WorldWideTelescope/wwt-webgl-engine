+++
title = "Controlling an Embedded Research App"
weight = 200
+++

If you [embed][embedding] the WWT research app inside one of your own web apps,
you can control its behavior by sending it JSON messages using JavaScript.

[embedding]: @/embedding.md


# First Things First: Security

Embedding one web app inside of another is a classic way to introduce
[cross-site scripting][xss] (XSS) security vulnerabilities. Therefore, the Web
standards that support this embedding come with a bunch of security-related
hoops that you need to jump through. If you’re trying to implement the protocols
described on this page, be aware that you’ll have to be careful about
implementing your security practices correctly. Most important, you need to be
careful about constructing your own app such that it won’t propagate untrusted
inputs into the WWT research app.

[xss]: https://developer.mozilla.org/en-US/docs/Web/Security/Types_of_attacks#cross-site_scripting_xss


# Message Types

The WWT research app is fundamentally controlled by sending it [JSON] “messages”.

[JSON]: https://www.json.org/json-en.html

Supported messages are defined in the [@wwtelescope/research-app-messages] NPM
package, [documented here][msg-docs]. We recommend that you construct your
messages using [TypeScript] code that imports the
[@wwtelescope/research-app-messages] package as a dependency. But if you’re
unwilling or unable to do so, you can construct messages any way that you like,
so long as a you end up with JSON objects. You can use the
[research-app-messages documentation][msg-docs] as a specification for message
object structures without needing to actually use or import the package.

[@wwtelescope/research-app-messages]: https://www.npmjs.com/package/@wwtelescope/research-app-messages
[msg-docs]: https://docs.worldwidetelescope.org/webgl-reference/latest/apiref/research-app-messages/
[TypeScript]: https://www.typescriptlang.org/

To see an index of the messages that are supported, visit the
[@wwtelescope/research-app-messages documentation][msg-docs].


# Sending Messages

To actually send your messages to an embedded research app, you must use the
[Window.postMessage()] web API.

[Window.postMessage()]: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage

In order to have something to post a message *to*, you’ll need a JavaScript
variable corresponding to your embedded app’s window. If the embedded app is
specified in static HTML, you might do this using the
[Document.getElementById()] web API. If you create it programmatically, you
should already have the variable handy.

[Document.getElementById()]: https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById

Pay attention to the documentation of the *targetOrigin* parameter to the
[Window.postMessage()] API call. As the documentation should make clear, your
code should provide a non-default value for this parameter, since you should
always be loading the research app from a known [origin][web-origin] (probably
`https://web.wwtassets.org/`). If you don’t do this correctly, you will be
opening up security holes in your web application.

[web-origin]: https://developer.mozilla.org/en-US/docs/Glossary/Origin
