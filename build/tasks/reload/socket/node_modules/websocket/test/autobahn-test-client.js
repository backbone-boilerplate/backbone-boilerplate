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
var wsVersion = require('../lib/websocket').version;
var querystring = require('querystring');

var args = { /* defaults */
    secure: false,
    port: '9000',
    host: 'localhost'
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

console.log("WebSocket-Node: Echo test client for running against the Autobahn test suite");
console.log("Usage: ./libwebsockets-test-client.js --host=127.0.0.1 --port=9000 [--secure]");
console.log("");


console.log("Starting test run.");

getCaseCount(function(caseCount) {
    var currentCase = 1;
    runNextTestCase();
    
    function runNextTestCase() {
        runTestCase(currentCase++, caseCount, function() {
            if (currentCase <= caseCount) {
                process.nextTick(runNextTestCase);
            }
            else {
                process.nextTick(function() {
                    console.log("Test suite complete, generating report.");
                    updateReport(function() {
                        console.log("Report generated.");
                    });
                });
            }
        });
    }
});


function runTestCase(caseIndex, caseCount, callback) {
    console.log("Running test " + caseIndex + " of " + caseCount);
    var echoClient = new WebSocketClient({
        maxReceivedFrameSize: 64*1024*1024,   // 64MiB
        maxReceivedMessageSize: 64*1024*1024, // 64MiB
        fragmentOutgoingMessages: false,
        keepalive: false,
        disableNagleAlgorithm: false
    });

    echoClient.on('connectFailed', function(error) {
        console.log("Connect Error: " + error.toString());
    });

    echoClient.on('connect', function(connection) {
        connection.on('error', function(error) {
            console.log("Connection Error: " + error.toString());
        });
        connection.on('close', function() {
            callback();
        });
        connection.on('message', function(message) {
            if (message.type === 'utf8') {
                connection.sendUTF(message.utf8Data);
            }
            else if (message.type === 'binary') {
                connection.sendBytes(message.binaryData);
            }
        });
    });
    
    var qs = querystring.stringify({
        case: caseIndex,
        agent: "WebSocket-Node Client v" + wsVersion
    });
    var url = "ws://" + args.host + ":" + args.port + "/runCase?" + qs;
    echoClient.connect("ws://" + args.host + ":" + args.port + "/runCase?" + qs, []);
}

function getCaseCount(callback) {
    var client = new WebSocketClient();
    var caseCount = NaN;
    client.on('connect', function(connection) {
        connection.on('close', function() {
            callback(caseCount);
        });
        connection.on('message', function(message) {
            if (message.type === 'utf8') {
                console.log("Got case count: " + message.utf8Data);
                caseCount = parseInt(message.utf8Data, 10);
            }
            else if (message.type === 'binary') {
                throw new Error("Unexpected binary message when retrieving case count");
            }
        });
    });
    client.connect('ws://' + args.host + ':' + args.port + '/getCaseCount', []);
}

function updateReport(callback) {
    var client = new WebSocketClient();
    var qs = querystring.stringify({
        agent: "WebSocket-Node Client v" + wsVersion
    });
    client.on('connect', function(connection) {
        connection.on('close', callback);
    });
    client.connect('ws://localhost:9000/updateReports?' + qs);
}