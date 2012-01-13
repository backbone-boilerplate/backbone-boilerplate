WebSocket Client & Server Implementation for Node
=================================================

Overview
--------
This is a pure JavaScript implementation of the WebSocket protocol versions 8 and 13 for Node.  There are some example client and server applications that implement various interoperability testing protocols in the "test" folder.

Current News
------------

- As of version 1.0.4, WebSocket-Node now validates that incoming UTF-8 messages actually contain well-formed UTF-8 data, and will drop the connection if not.  This is accomplished in a performant manner by using a native C++ module created by [einaros](https://github.com/einaros).  See the section about the Autobahn Test Suite below for details.

- WebSocket-Node was already [one of the fastest WebSocket libraries for Node](http://hobbycoding.posterous.com/websockt-binary-data-transfer-benchmark-rsult), and thanks to a small patch from [kazuyukitanimura](https://github.com/kazuyukitanimura), this library is now [up to 200% faster](http://hobbycoding.posterous.com/how-to-make-websocket-work-2x-faster-on-nodej) as of version 1.0.3!

Changelog
---------

Current Version: 1.0.4

[View the changelog](https://github.com/Worlize/WebSocket-Node/blob/master/CHANGELOG.md)

Browser Support
---------------

* Firefox 7 (Old) (Protocol Version 8)
* Firefox 8 (Stable) (Protocol Version 8)
* Firefox 9 (Beta) (Protocol Version 8)
* Chrome 14 (Old) (Protocol Version 8)
* Chrome 15 (Stable) (Protocol Version 8)
* Chrome 16 (Beta) (Protocol Version 13)
* Internet Explorer 10 (Preview) (Protocol Version 8?)

***Safari is not supported at this time as it uses an old draft of WebSockets***

**Note about FireFox:  Firefox [uses a prefixed constructor name](https://developer.mozilla.org/en/WebSockets/WebSockets_reference/WebSocket) in its client side JavaScript, MozWebSocket(), which will be changed to WebSocket() presumably when the WebSocket API has been finalized by the W3C.**

I made a decision early on to explicitly avoid maintaining multiple slightly different copies of the same code just to support the browsers currently in the wild.  The major browsers that support WebSocket are on a rapid-release schedule (with the exception of Safari) and now that the final version of the protocol has been [published as an official RFC](http://datatracker.ietf.org/doc/rfc6455/), it won't be long before support in the wild stabilizes on that version.  My client application is in Flash/ActionScript 3, so for my purposes I'm not dependent on the browser implementations.  *I made an exception to my stated intention here to support protocol version 8 along with 13, since only one minor thing changed and it was trivial to handle conditionally.*  The library now interoperates with other clients and servers implementing draft -08 all the way up through the final RFC.

***If you need to simultaneously support older production browser versions that had implemented draft-75/draft-76/draft-00, take a look here: https://gist.github.com/1428579***

For a WebSocket protocol 8 (draft-10) client written in ActionScript 3, see my [AS3WebScocket](https://github.com/Worlize/AS3WebSocket) project.

Autobahn Tests
--------------
The very complete [Autobahn Test Suite](http://www.tavendo.de/autobahn/testsuite.html) is used by most WebSocket implementations to test spec compliance and interoperability.

**Note about failing UTF-8 tests:** There are some UTF-8 validation tests that fail due to the fact that Node automatically converts non-existent unicode characters to the [Unicode Replacement Character](http://en.wikipedia.org/wiki/Specials_%28Unicode_block%29#Replacement_character) internally, and it is not possible to disable this behavior.  The Autobahn Test Suite requires that the code points for these non-existent characters are echoed back to the test server unaltered, since the numerical representations of those code points would still be valid UTF-8.  ***I do not consider this to be a problem*** since it is very unlikely to cause any issues in any real-world application, so these test failures should be ignored.

**Note about the ws test results:** The [ws test results](http://einaros.github.com/ws/servers/index.html) posted by einaros show "Pass" for these tests run against [ws](https://github.com/einaros/ws/), another WebSocket library for Node.  These results are somewhat misleading.  The reason they show as "Pass" is because his test application passes back the binary data for UTF-8 messages without the decode/encode phase that would be unavoidable in any real application using the library.  I believe that entirely defeats the intent of the Autobahn UTF-8 validation tests, and is an inaccurate result.  The results displayed for 'ws' in the server test results below use a modified test application that includes the decode/encode phase in order to provide an accurate result.

- [View Server Test Results](http://worlize.github.com/WebSocket-Node/test-report/servers/)
- [View Client Test Results](http://worlize.github.com/WebSocket-Node/test-report/clients/)

Notes
-----
This library has been used in production on [worlize.com](https://www.worlize.com) since April 2011 and seems to be stable.  Your mileage may vary.

***Note about Draft Naming and versioning:*** *The draft number (draft-17) does not necessarily correspond to the protocol version (13.)  Many times a new draft is released with only editorial changes, in which case the protocol version is not incremented.  The drafts are interoperable within a protocol version, with only editorial changes.  The current implementation of WebSocket-Node works protocol version 8 (drafts -08 through -12) and protocol version 13 (drafts -13 through -17 and the final RFC.)*

**Tested with the following node versions:**

- 0.4.12
- 0.6.6

It may work in earlier or later versions but I'm not actively testing it outside of the listed versions.  YMMV.

Documentation
=============

For more complete documentation, see the [Documentation Wiki](https://github.com/Worlize/WebSocket-Node/wiki/Documentation).

Installation
------------
In your project root:

    $ npm install websocket
  
Then in your code:

```javascript
var WebSocketServer = require('websocket').server;
var WebSocketClient = require('websocket').client;
var WebSocketFrame  = require('websocket').frame;
var WebSocketRouter = require('websocket').router;
```

Current Features:
-----------------
- Licensed under the Apache License, Version 2.0
- Protocol version "8" and "13" (Draft-08 through the final RFC) framing and handshake
- Can handle/aggregate received fragmented messages
- Can fragment outgoing messages
- Router to mount multiple applications to various path and protocol combinations
- TLS supported for outbound connections via WebSocketClient
- Cookie setting and parsing
- Tunable settings
  - Max Receivable Frame Size
  - Max Aggregate ReceivedMessage Size
  - Whether to fragment outgoing messages
  - Fragmentation chunk size for outgoing messages
  - Whether to automatically send ping frames for the purposes of keepalive
  - Keep-alive ping interval
  - Whether or not to automatically assemble received fragments (allows application to handle individual fragments directly)
  - How long to wait after sending a close frame for acknowledgment before closing the socket.


Known Issues/Missing Features:
------------------------------
- No API for user-provided protocol extensions.
- Haven't tested TLS for the Server.  (Perhaps this is handled automatically by attaching the WebSocket server to a https.createServer instead of http.createServer?)  My server implements TLS via stunnel->haproxy->node.


Usage Examples
==============

Server Example
--------------

Here's a short example showing a server that echos back anything sent to it, whether utf-8 or binary.

```javascript
#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept(null, request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});
```

Client Example
--------------

This is a simple example client that will print out any utf-8 messages it receives on the console, and periodically sends a random number.

*This code demonstrates a client in Node.js, not in the browser*

```javascript
#!/usr/bin/env node
var WebSocketClient = require('websocket').client;

var client = new WebSocketClient();

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('WebSocket client connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });
    
    function sendNumber() {
        if (connection.connected) {
            var number = Math.round(Math.random() * 0xFFFFFF);
            connection.sendUTF(number.toString());
            setTimeout(sendNumber, 1000);
        }
    }
    sendNumber();
});

client.connect('ws://localhost:8080/', 'echo-protocol');
```
    
Request Router Example
----------------------

For an example of using the request router, see `libwebsockets-test-server.js` in the `test` folder.


Resources
---------

A presentation on the state of the WebSockets protocol that I gave on July 23, 2011 at the LA Hacker News meetup.  [WebSockets: The Real-Time Web, Delivered](http://www.scribd.com/doc/60898569/WebSockets-The-Real-Time-Web-Delivered)