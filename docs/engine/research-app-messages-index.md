This package defines messages for controlling the AAS WorldWide Telescope
[research app]. The only implementation code that it contains are [TypeScript]
[type guard functions].

[research app]: https://docs.worldwidetelescope.org/research-app/latest/
[TypeScript]: https://www.typescriptlang.org/
[type guard functions]: https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards

Read [Controlling an Embedded Research App][controlling] for instructions on how
to send your messages to an embedded app.

[controlling]: https://docs.worldwidetelescope.org/research-app/latest/controlling/

If you’re developing an app in a [TypeScript] framework, you can add this package
as a dependency and use its types to construct the messages that you send to the
research app. But if you’re unwilling or unable to do so, you can also just use
the documentation here as a reference for how to construct your own messages as
[JSON] structures. While certain messages might gain additional features as the
research app evolves, forward compatibility will be maintained unless it is
absolutely impossible to avoid a breakage.

[JSON]: https://www.json.org/

The [classicPywwt] module defines messages used by the [pywwt] Python package.
The research app understands and handles all of these messages.

[classicPywwt]: ./modules/classicpywwt.html
[pywwt]: https://pywwt.readthedocs.io/

The [ViewStateMessage] interface is special: it defines a message that is
periodically emitted *by* the research app, if you have embedded it somewhere.
This message keeps your app updated with the basic status of the WWT view. You
can listen for such messages by [using the addEventListener API][listen] on the
research app’s window with an event type of `message`.

[ViewStateMessage]: ./interfaces/viewstatemessage.html
[listen]: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#the_dispatched_event