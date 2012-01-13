// ============================================================================
// TASKS
// ============================================================================

var throttle = false;

task.registerTask("reload", "Reload connected clients when a file has changed.", function (data, name) {
	var errorcount = fail.errorcount;
	if (!throttle && this.updatedWatchFile) {
		task.helper('reload', this.updatedWatchFile);
		throttle = true;
		setTimeout(function() { throttle = false; }, 2000);
		log.writeln(this.updatedWatchFile + " updated. Reload triggered.");
	} else {
		return;
	}
	// Fail task if there were errors.
	if (fail.errorcount > errorcount) {
		return false;
	}
});

// ============================================================================
// HELPERS
// ============================================================================

task.registerHelper("reload", function (file) {
	var http = require('http'),
			fileData = "file=" + file,
			options = {
				host:'localhost',
				port:8000,
				method:'POST',
				path:'/reload',
				headers:{
					'Content-Type':'application/x-www-form-urlencoded',
					'Content-Length':fileData.length
				}
			},
			post_req = http.request(options,
				function (proxyResponse) {}).on('error', function (e) {
					console.log("Got error: " + e.message);
				}
			);

	post_req.write(fileData);
	post_req.end();

});

