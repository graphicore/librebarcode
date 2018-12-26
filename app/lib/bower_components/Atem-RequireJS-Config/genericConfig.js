define([], function(){
    "use strict";

    // this is configuration that is shared between all configuration
    // targets. I.e. Node.js and Browsers at the moment
    var config = {
        paths: {
            'Atem-CPS': '%bower%/Atem-CPS/lib'
          , 'Atem-CPS-whitelisting': '%bower%/Atem-CPS-whitelisting/lib'
          , 'Atem-CPS-Toolkit': '%bower%/Atem-CPS-Toolkit/lib'
          , 'Atem-Errors': '%bower%/Atem-Errors/lib'
          , 'Atem-IO': '%bower%/Atem-IO/lib'
          , 'Atem-Math-Tools': '%bower%/Atem-Math-Tools/lib'
          , 'Atem-Pen-Case': '%bower%/Atem-Pen-Case/lib'
          , 'Atem-Property-Language': '%bower%/Atem-Property-Language/lib'
          , 'Atem-Logging': '%bower%/Atem-Logging/lib'
          , 'Atem-MOM': '%bower%/Atem-MOM/lib'
          , 'Atem-MOM-Toolkit': '%bower%/Atem-MOM-Toolkit/lib'
          , 'obtain': '%bower%/obtainjs/lib'
          , 'complex': '%bower%/complex/lib'
          , 'gonzales': '%bower%/gonzales/amd'
          , 'bloomfilter': '%bower%/bloomfilter.js/bloomfilter'
          , 'ufojs': '%bower%/ufoJS/lib'
          , 'util-logging': '%bower%/util-logging-amd/lib'
          , 'metapolator-cpsLib': '%bower%/metapolator-cpsLib/lib'

          , 'requireLib': '%bower%/requirejs/require'
          , 'require/text': '%bower%/requirejs-text/text'
          , 'yaml': '%bower%/js-yaml/dist/js-yaml.min'
          , 'jszip': '%bower%/jszip/dist/jszip'
          , 'EventEmitter': '%bower%/event-emitter.js/dist/event-emitter'
          , 'opentype': '%bower%/opentype.js/dist/opentype.min'
          , 'marked': '%bower%/marked/lib/marked'
          , 'mustache': '%bower%/mustache.js/mustache'

            // Atem applications must override their own path in their own setup
          , 'metapolator': '%bower%/metapolator/app/lib'
          , 'BEF': '%bower%/Bauhaus-Emblem-Font/app/lib'
          , 'Atem-CPS-Developer-Tool': '%bower%/Atem-CPS-Developer-Tool/app/lib'

        }
      , es6Variants: [
            'Atem-MOM/rendering/basics'
          , 'Atem-MOM/export/UFOExporter'
          , 'Atem-MOM/export/OTFExporter'
          , 'Atem-MOM/import/UFOImporter'
        ]
    };
    return config;
});
