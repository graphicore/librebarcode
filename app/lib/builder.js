define([
    'ufojs/ufoLib/UFOWriter'
  , 'BarcodeLibre/builder/code39'
  , 'BarcodeLibre/builder/code128'
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

    return function(io, path) {
        var ufoWriter = UFOWriter.factory(false, io, path, 3)
          , builder = new Code128Builder()
          // default glyph set
          , glyphSet = ufoWriter.getGlyphSet(false)
          , fontinfo
          ;
        builder.populateGlyphSet(glyphSet);
        glyphSet.writeContents(false);
        // this is a stub
        // fontforge requires a fontinfo.plist that defines unitsPerEm
        fontinfo = {
              unitsPerEm: 1000
            , ascender: 800
            , descender: -200
            , familyName: 'BarcodeLibreTesting'
            , styleName: 'regular'
            , xHeight: 400
            , capHeight: 600
        };
        ufoWriter.writeInfo(false, fontinfo);
        // TODO now write the real metadata ...
    };
});
