this.namespace = {
  module: function() {
    var modules = {};

    return function(name) {
      if (modules[name]) {
        return modules[name];
      }

      return modules[name] = { Views: {} };
    };
  }(),

  app: _.extend({}, Backbone.Events)
};

jQuery(function($) {
  var app = namespace.app;

  var Router = Backbone.Router.extend({
    routes: {
      "": "index"
    },

    index: function() {
      //alert("Welcome to the homepage");
    }
  });
  
  app.router = new Router();
  Backbone.history.start();
});
