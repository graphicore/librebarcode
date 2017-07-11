define(['../lib/bower_components/Atem-RequireJS-Config/nodeConfig'],
function(configure) {
    var path = require('path')
      , rootDir = path.dirname(path.dirname(process.mainModule.filename))
      , setup = {
            baseUrl: rootDir + '/lib'
          , bowerPrefix: 'bower_components'
          , paths: {
                'LibreBarcode': './'
            }
        }
      ;
    define('rootDir', rootDir);
    return configure.bind(null, setup);
});
