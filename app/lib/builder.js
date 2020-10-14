define([
    'ufojs/ufoLib/UFOWriter'
  , 'LibreBarcode/builder/code39'
  , 'LibreBarcode/builder/code39Extended'
  , 'LibreBarcode/builder/code128'
  , 'LibreBarcode/builder/ean13'
], function(
    UFOWriter
  , code39
  , code39Extended
  , code128
  , ean13
){
    "use strict";

    // TODO: unittests of our endproducts should reveal errors, i.e.
    // encode each available symbol in a barcode, make an image, scan that
    var Builders = {
        Code128: code128.Builder
      , Code39: code39.Builder
      , Code39Extended:  code39Extended.Builder
      , EAN13: ean13.Builder
    };

    return function(io, codetype, ufodir, fontBelow, fontinfo, parameters) {
        var ufoWriter = UFOWriter.factory(false, io, ufodir, 3)
          , builder
          // default glyph set
          , glyphSet = ufoWriter.getGlyphSet(false)
          , minFontinfo, k, info, features
          ;
        if (!(codetype in Builders))
            throw new Error('Code type "' + codetype + '" is unknown. '
                + 'Use one of: ' + Object.keys(Builders).join(', ') + '.');

        // fontforge requires a fontinfo.plist that defines unitsPerEm
        // AbstractBarcodeBuilder requires unitsPerEm, ascender descender
        // to draw the .notdef glyph.
        minFontinfo = {
              unitsPerEm: 1000
            , ascender: 600
            , descender: -400
        };

        info = Object.create(null);
        for (k in minFontinfo)
            info[k]=minFontinfo[k];
        for (k in fontinfo)
            info[k]=fontinfo[k];
            // Add at least:
            //    familyName
            //    styleName
            //    xHeight
            //    capHeight
            // but you'll need more info for a good font!

        builder = new Builders[codetype](parameters, info, fontBelow);
        builder.reportParameters(null, parameters);

        builder.populateGlyphSet(glyphSet);
        glyphSet.writeContents(false);
        ufoWriter.writeInfo(false, builder.fontInfo);
        features = builder.getFeatures();
        if(features)
            ufoWriter.writeFeatures(false, features);
        // TODO now write the real metadata ...
    };
});
