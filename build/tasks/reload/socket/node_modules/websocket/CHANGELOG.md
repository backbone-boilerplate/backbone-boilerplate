Changelog
=========

Version 1.0.4
-------------
*Released 2011-12-18*

- Now validates that incoming UTF-8 messages do, in fact, contain valid UTF-8 data.  The connection is dropped with prejudice if invalid data is received.  This strict behavior conforms to the WebSocket RFC and is verified by the Autobahn Test Suite.  This is accomplished in a performant way by using a native C++ Node module created by [einaros](https://github.com/einaros).
- Updated handling of connection closure to pass more of the Autobahn Test Suite.

Version 1.0.3
-------------
*Released 2011-12-18*

- Substantial speed increase (~150% on my machine, depending on the circumstances) due to an optimization in FastBufferList.js that drastically reduces the number of memory alloctions and buffer copying. ([kazuyukitanimura](https://github.com/kazuyukitanimura))


Version 1.0.2
-------------
*Released 2011-11-28*

- Fixing whiteboard example to work under Node 0.6.x ([theturtle32](https://github.com/theturtle32))
- Now correctly emitting a `close` event with a 1006 error code if there is a TCP error while writing to the socket during the handshake. ([theturtle32](https://github.com/theturtle32))
- Catching errors when writing to the TCP socket during the handshake. ([justoneplanet](https://github.com/justoneplanet))
- No longer outputting console.warn messages when there is an error writing to the TCP socket ([justoneplanet](https://github.com/justoneplanet))
- Fixing some formatting errors, commas, semicolons, etc.  ([kaisellgren](https://github.com/kaisellgren))


Version 1.0.1
-------------
*Released 2011-11-21*

- Now works with Node 0.6.2 as well as 0.4.12
- Support TLS in WebSocketClient
- Added support for setting and reading cookies
- Added WebSocketServer.prototype.broadcast(data) convenience method
- Added `resourceURL` property to WebSocketRequest objects.  It is a Node URL object with the `resource` and any query string params already parsed.
- The WebSocket request router no longer includes the entire query string when trying to match the path name of the request.
- WebSocketRouterRequest objects now include all the properties and events of WebSocketRequest objects.
- Removed more console.log statements.  Please rely on the various events emitted to be notified of error conditions.  I decided that it is not a library's place to spew information to the console.
- Renamed the `websocketVersion` property to `webSocketVersion` throughout the code to fix inconsistent capitalization.  `websocketVersion` has been kept for compatibility but is deprecated and may be removed in the future.
- Now outputting the sanitized version of custom header names rather than the raw value.  This prevents invalid HTTP from being put onto the wire if given an illegal header name.


I decided it's time to start maintaining a changelog now, starting with version 1.0.1.

