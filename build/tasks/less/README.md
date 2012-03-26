## Less CSS Compilation

* Contributed By: Tyler Kellen (@tkellen)

This build task compiles and minifies less stylesheets.

### Installation/Updating instructions

Download this folder into your `build/tasks` directory.  Remove any
existing `build/tasks/less` folder to avoid potential conflicts.

### Configuration

Inside your `build/config.js` file, add a section named `less` and specify the
less parser options, as well as the files you wish to compile.

``` javascript
less: {
  compile: {
    options: {
      paths: ['assets/css'],
      compress: true
    },
    files: {
      'dist/release/style.css': 'assets/css/style.less'
    }
  }
},

```
The `paths` option specifies directories to scan for @import directives.
The `compress` option conditionally invokes clean-css to minify the LESS compiled CSS.

### Usage ###

At the bottom of your `build/config.js` you will see `registerTask` containing
a list of build tasks to run, simply add less in this space-separated list.

``` javascript
// An example registration might look something like this
task.registerTask("default", "clean ... less");
```