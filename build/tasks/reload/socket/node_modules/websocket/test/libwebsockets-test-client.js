#!/usr/bin/env node
/************************************************************************
 *  Copyright 2010-2011 Worlize Inc.
 *  
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  
 *      http://www.apache.org/licenses/LICENSE-2.0
 *  
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ***********************************************************************/

var WebSocketClient = require('../lib/WebSocketClient');

var args = { /* defaults */
    secure: false
};

/* Parse command line options */
var pattern = /^--(.*?)(?:=(.*))?$/;
process.argv.forEach(function(value) {
    var match = pattern.exec(value);
    if (match) {
        args[match[1]] = match[2] ? match[2] : true;
    }
});

args.protocol = args.secure ? 'wss:' : 'ws:'

if (!args.host || !args.port) {
    console.log("WebSocket-Node: Test client for Andy Green's libwebsockets-test-server");
    console.log("Usage: ./libwebsockets-test-client.js --host=127.0.0.1 --port=8080 [--secure]");
    console.log("");
    return;
}

var mirrorClient = new WebSocketClient();

mirrorClient.on('connectFailed', function(error) {
    console.log("Connect Error: " + error.toString());
});

mirrorClient.on('connect', function(connection) {
    console.log("lws-mirror-protocol connected");
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log("lws-mirror-protocol Connection Closed");
    });  
    function spamCircles() {
        if (connection.connected) {
            // c #7A9237 487 181 14;
            var color = 0x800000 + Math.round(Math.random() * 0x7FFFFF);
            var x = Math.round(Math.random() * 502);
            var y = Math.round(Math.random() * 306);
            var radius = Math.round(Math.random() * 30);
            connection.send("c #" + color.toString(16) + " " + x + " " + y + " " + radius + ";");
            setTimeout(spamCircles, 10);
        }
    }
    spamCircles();
});

mirrorClient.connect(args.protocol + '//' + args.host + ':' + args.port + '/', 'lws-mirror-protocol');


var incrementClient = new WebSocketClient();

incrementClient.on('connectFailed', function(error) {
    console.log("Connect Error: " + error.toString());
});

incrementClient.on('connect', function(connection) {
    console.log("dumb-increment-protocol connected");
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log("dumb-increment-protocol Connection Closed");
    })
    connection.on('message', function(message) {
        console.log("Number: '" + message.utf8Data + "'");
    });
});

incrementClient.connect(args.protocol + '//' + args.host + ':' + args.port + '/', 'dumb-increment-protocol');
