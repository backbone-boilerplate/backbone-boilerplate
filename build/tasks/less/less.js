/*
 * Grunt Task File
 * ---------------
 *
 * Task: less
 * Description: Compile LESS files to CSS and minify.
 * Dependencies: less@1.2.1 / clean-css@0.3.2
 *
 */

task.registerBasicTask("less", "Compile LESS files to CSS and optionally minify.", function(data, name) {

  // load libraries
  var less = require('less');
  var cleanCSS = require('clean-css');

  // initialize LESS parser
  var parser = new(less.Parser)(data.options);

  // make sure task runs until parser is completely finished (imports are processed asynchronously)
  var taskDone = this.async();

  // iterate over files to compile/compress
  Object.keys(data.files).forEach(function(dest) {

    // grab src file to compile dest to
    var src = data.files[dest];

    // run less compiler
    parser.parse(file.read(src), function (err, tree) {

      // record error (if any)
      if(err) {
        log.error(err);
      }

      // compile less to css
      var css = tree.toCSS();

      // if config specified minify, do so with clean-css
      if(data.options.compress) {
        css = cleanCSS.process(css);
      }

      // write contents
      file.write(dest,css);

      // flag task as complete
      taskDone();
    });

  });

  // Fail task if errors were logged.
  if (task.hadErrors()) { return false; }

  // Otherwise, print a success message.
  log.writeln("LESS compiling complete.");
});
