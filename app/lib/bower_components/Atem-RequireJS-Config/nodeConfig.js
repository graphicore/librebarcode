define([
    './tools'
  , './genericConfig'
], function(
    tools
  , genericConfig
  ){
    "use strict";

    var configure = tools.configure
      , copySetup = tools.copySetup
      , defaults = Object.create(null)
      , nodeConfig
      ;

    copySetup(genericConfig, defaults);

    // node specific configuration goes here
    nodeConfig = {
        paths: {

        }
    };

    copySetup(nodeConfig, defaults);
    return configure.bind(null, defaults);
});
