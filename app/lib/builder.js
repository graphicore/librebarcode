define([
    'ufojs/ufoLib/UFOWriter'
  , 'LibreBarcode/builder/code39'
  , 'LibreBarcode/builder/code128'
], function(
    UFOWriter
  , code39
  , code128
){
    "use strict";

    var Code39Builder = code39.Builder
      , Code128Builder = code128.Builder
      ;

    // TODO: unittests of our endproducts should reveal errors, i.e.
    // encode each available symbol in a barcode, make an image, scan that
    var Builders = {
        Code128: Code128Builder
      , Code39: Code39Builder
    };

    return function(io, codetype, ufodir, fontBelow, fontinfo, parameters) {
        var ufoWriter = UFOWriter.factory(false, io, ufodir, 3)
          , builder
          // default glyph set
          , glyphSet = ufoWriter.getGlyphSet(false)
          , minFontinfo, k, info
          ;
        if (!(codetype in Builders))
            throw new Error('Code type "' + codetype + '" is unknown. '
                + 'Use one of: ' + Object.keys(Builders).join(', ') + '.');

        builder = new Builders[codetype](parameters);
        builder.reportParameters();

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

        builder.populateGlyphSet(glyphSet, fontBelow, info);
        glyphSet.writeContents(false);
        ufoWriter.writeInfo(false, info);
        // TODO now write the real metadata ...
    };
});
