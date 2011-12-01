// Require libraries
var os = require("os");
var fs = require("fs");
var cluster = require("cluster");
var express = require("express");
var site = express.createServer();

// Var up, bro
var i, read;
var forks = [];

// Master thread spawns new listeners
if (cluster.isMaster) {
  function create() {
    // Spawn a new worker for each available thread
    for (i = 0; i < os.cpus().length; i++) {
      forks.push(cluster.fork());
    }
  }

  function destroy() {
    // Destroy all original forks
    forks.forEach(function(fork) {
      fork.send({ cmd: "kill" });
    });

    forks = [];
  }

  // Spin up initial forks
  create();

  return;
}

// Kill off the process
process.on("message", function(msg) {
  if (msg.cmd && msg.cmd == "kill") {
    process.exit();
  }
});

// Serve static files
site.use("/assets", express.static("./assets"));
site.use("/app", express.static("./app"));

// Ensure all routes go home, client side app..
site.get("*", function(req, res) {
  fs.createReadStream("./index.html").pipe(res);
});

// Actually listen
site.listen(8000);
