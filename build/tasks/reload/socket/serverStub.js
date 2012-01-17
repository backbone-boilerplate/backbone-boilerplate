var WebSocketServer = require("websocket").server;
var fs = require("fs");

exports.enableSocket = function(site) {

	console.log("Reload task support enabled.");

	wsServer = new WebSocketServer({
	    httpServer: site,
	    autoAcceptConnections: true // DON'T use on production!
	});

	wsServer.on('connect', function() {
		console.log((new Date()) + ' Connection accepted.');
	});

	site.post("/reload", function(req, res) {
		var msg = req.body.message,
				connections = wsServer.connections;

		for (var i=0;i<connections.length;i++) {
				connections[i].sendUTF(msg);
		}
	});

	// Todo: figure out a better way to handle this
	site.get("/reload.js", function(req, res) {
	  fs.createReadStream(__dirname + "/reloadClient.js").pipe(res);
	});

}