This package defines messages for controlling the WorldWide Telescope
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

The {@link classicPywwt} module defines messages used by the [pywwt] Python package.
The research app understands and handles all of these messages.

[pywwt]: https://pywwt.readthedocs.io/

The {@link settings} module defines messages and types related to various high-level
settings for the research app. Settings relating to the WWT engine and its
graphical components, such as layers and annotations, are defined in the
{@link classicPywwt} module.

The {@link ViewStateMessage} interface is special: it defines a message that is
periodically emitted *by* the research app, if you have embedded it somewhere.
This message keeps your app updated with the basic status of the WWT view. You
can listen for such messages by [using the addEventListener API][listen] on the
research app’s window with an event type of `message`.

[listen]: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#the_dispatched_event

The {@link ApplicationStateMessage} is likewise emitted by the application in response
to various events that modify its non-view state. Client implementors should
keep in mind that the application may be talking to multiple clients
simultaneously, so such updates may arrive unexpectedly if another client has
triggered a state change.

In the same vein, the {@link selections.SelectionStateMessage} keeps clients
updated about the user’s interactive selection of sources in any catalogs that
may currently be displayed.

The {@link PingPongMessage} interface is also special. If you send this message to the
app, it will reply with an identical message. This is useful for checking
whether the app has started up, because usually there is no alternative to
polling it.

The {@link ClearTileCacheMessage} interface describes a message that, when received by
the app, will cause it to refresh its current cache of tiles. The primary use case
for this should be if a network error has caused a necessary tile to fail to load. This
should be used only when necessary, as it clears all previously downloaded tiles.
