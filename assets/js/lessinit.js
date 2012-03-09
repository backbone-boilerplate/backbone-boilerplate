// this is only included in development mode
require(['jquery'], function($) {

  // rename rel to stylesheet/less before loading less library
  $('link[rel=stylesheet]').attr('rel','stylesheet/less');
  require(['libs/less']);

});