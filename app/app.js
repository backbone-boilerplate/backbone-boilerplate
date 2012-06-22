define([
  // Libraries.
  "jquery",
  "lodash",
  "backbone"
],

function($, _, Backbone) {

  // Localize or create a new JavaScript Template object.
  var JST = window.JST = window.JST || {},
	  JSTqueue = {};
  
  // Keep active application instances namespaced under an app object.
  return _.extend({

    // This is useful when developing if you don't want to use a
    // build process every time you change a template.
    //
    // Delete if you are using a different template loading method.
    fetchTemplate: function(path, done) {
      // Append the file extension.
      path += ".html";
      
      // Check if template is already loaded, if so call callback and return
      if ( JST[path] ) {
        if ( _.isFunction(done) ) {
            done( JST[path] );
            return;
        }
      }
      
      // If template is not loading, add it to the queue
      if ( !JSTqueue[path] ) {
        JSTqueue[path] = $.ajax({
          url: path,
          dataType: "text",
          success: function( contents ) {
            JST[path] = _.template( contents );
          }
        });
      }
      
      // When template is done loading, call callback
      JSTqueue[path].done(function() {
        if ( _.isFunction(done) ) {
          done( JST[path] );
        }
      });
    },

    // Create a custom object with a nested Views object.
    module: function(additionalProps) {
      return _.extend({ Views: {} }, additionalProps);
    }

  // Mix Backbone.Events into the app object.
  }, Backbone.Events);

});
