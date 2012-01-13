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

function Whiteboard(canvasId) {
    this.initCanvas(canvasId);
    
    // Define accepted commands
    this.messageHandlers = {
        initCommands: this.initCommands.bind(this),
        drawLine: this.drawLine.bind(this),
        clear: this.clear.bind(this)
    };

    // Initial state
    this.lastPoint = null;
    this.mouseDown = false;
    this.color = {
        r: 0,
        g: 0,
        b: 0
    };
};

Whiteboard.prototype.connect = function() {
    var url = "ws://" + document.URL.substr(7).split('/')[0];
    
    var wsCtor = window['MozWebSocket'] ? MozWebSocket : WebSocket;
    this.socket = new wsCtor(url, 'whiteboard-example');

    this.socket.onmessage = this.handleWebsocketMessage.bind(this);
    this.socket.onclose = this.handleWebsocketClose.bind(this);

    this.addCanvasEventListeners();
};

Whiteboard.prototype.handleWebsocketMessage = function(message) {
    try {
        var command = JSON.parse(message.data);
    }
    catch(e) { /* do nothing */ }
    
    if (command) {
        this.dispatchCommand(command);
    }
};

Whiteboard.prototype.handleWebsocketClose = function() {
    alert("WebSocket Connection Closed.");
};

Whiteboard.prototype.dispatchCommand = function(command) {
    // Do we have a handler function for this command?
    var handler = this.messageHandlers[command.msg];
    if (typeof(handler) === 'function') {
        // If so, call it and pass the parameter data
        handler.call(this, command.data);
    }
};

Whiteboard.prototype.initCommands = function(commandList) {
    /* Upon connection, the contents of the whiteboard
       are drawn by replaying all commands since the
       last time it was cleared */
    commandList.forEach(function(command) {
        this.dispatchCommand(command);
    }.bind(this));
};

Whiteboard.prototype.sendClear = function() {
    this.socket.send(JSON.stringify({ msg: 'clear' }));
};

Whiteboard.prototype.setColor = function(r,g,b) {
    this.color = {
        r: r,
        g: g,
        b: b
    };
};

Whiteboard.prototype.drawLine = function(data) {
    // Set the color
    var color = data.color;
    this.ctx.strokeStyle = 'rgb(' + color.r + "," + color.g + "," + color.b +')';

    this.ctx.beginPath();
    
    var points = data.points;
    // Starting point
    this.ctx.moveTo(points[0]+0.5, points[1]+0.5);
    
    // Ending point
    this.ctx.lineTo(points[2]+0.5, points[3]+0.5);
    
    this.ctx.stroke();
};

Whiteboard.prototype.clear = function() {
    this.canvas.width = this.canvas.width;
};

Whiteboard.prototype.handleMouseDown = function(event) {
    this.mouseDown = true;
	this.lastPoint = this.resolveMousePosition(event);
};

Whiteboard.prototype.handleMouseUp = function(event) {
    this.mouseDown = false;
    this.lastPoint = null;
};

Whiteboard.prototype.handleMouseMove = function(event) {
    if (!this.mouseDown) { return; }

    var currentPoint = this.resolveMousePosition(event);

    // Send a draw command to the server.
    // The actual line is drawn when the command
    // is received back from the server.
    this.socket.send(JSON.stringify({
        msg: 'drawLine',
        data: {
            color: this.color,
            points: [
                this.lastPoint.x,
                this.lastPoint.y,
                currentPoint.x,
                currentPoint.y
            ]
        }
    }));
    
    this.lastPoint = currentPoint;
};

Whiteboard.prototype.initCanvas = function(canvasId) {
    this.canvasId = canvasId;
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.initCanvasOffset();
};

Whiteboard.prototype.initCanvasOffset = function() {
    this.offsetX = this.offsetY = 0;
    var element = this.canvas;
    if (element.offsetParent) {
        do {
            this.offsetX += element.offsetLeft;
            this.offsetY += element.offsetTop;
        }
        while ((element = element.offsetParent));
    }
};

Whiteboard.prototype.addCanvasEventListeners = function() {
    this.canvas.addEventListener(
        'mousedown', this.handleMouseDown.bind(this), false);
    
    window.document.addEventListener(
        'mouseup', this.handleMouseUp.bind(this), false);
        
    this.canvas.addEventListener(
        'mousemove', this.handleMouseMove.bind(this), false);
};

Whiteboard.prototype.resolveMousePosition = function(event) {
    var x, y;
	if (event.offsetX) {
		x = event.offsetX;
		y = event.offsetY;
	} else {
		x = event.layerX - this.offsetX;
		y = event.layerY - this.offsetY;
	}
	return { x: x, y: y };
};
