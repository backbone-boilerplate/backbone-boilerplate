// Require libraries
var fs = require("fs");
var express = require("express");
var site = express.createServer();

// Determine which dist directory to use
var dir = process.argv.length > 2 && "./dist/" + process.argv[2];

// Use custom JS folder based off debug or release
dir && site.use("/assets/js", express.static(dir + "/js"));
dir && site.use("/assets/css", express.static(dir + "/css"));

// Serve static files
site.use("/app", express.static("./app"));
site.use("/assets", express.static("./assets"));
site.use("/dist", express.static("./dist"));

// Serve favicon.ico
site.use(express.favicon("./favicon.ico"));

if (process.argv[2] == '--reload' ||  process.argv.length > 3 && process.argv[3] == '--reload') {

	site.use(express.bodyParser());

	require('./tasks/reload/socket/serverStub.js').enableSocket(site);

} else {
	site.get("/reload.js", function(req, res) {
	  res.send("// to enable, pass '--reload' to server command");
	});
}

// Ensure all routes go home, client side app..
site.get("*", function(req, res) {
  fs.createReadStream("./index.html").pipe(res);
});

// Actually listen
site.listen(8000);

console.log("Server listening on http://localhost:8000");
