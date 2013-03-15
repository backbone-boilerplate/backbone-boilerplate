define [
  # Application.
  "app"
],

(app) ->

  # Defining the application router, you can attach sub routers here.
  Router = Backbone.Router.extend
    routes: {
      "": "index"
    }

    index: () ->
      # Handle index sub route here.

  return Router
