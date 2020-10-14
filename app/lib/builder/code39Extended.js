// jshint esversion:6
define([
    'LibreBarcode/errors'
  , 'LibreBarcode/validation'
  , 'LibreBarcode/builder/abstract'
  , 'LibreBarcode/builder/code39'
], function(
    errors
  , validation
  , abstract
  , code39
){
    "use strict";
    var data = {
        glyphs: [
          // Nr, Character, Encoding,
          // where:
          //  Nr -- equals the unicode charcode!
          //  Character -- unused, but nice as info for humans
          //  Encoding -- Code 39 encoding
          //  textBelowFlag -- true to render text below
          [  0, 'NUL', '%U', false]
        , [  1, 'SOH', '$A', false]
        , [  2, 'STX', '$B', false]
        , [  3, 'ETX', '$C', false]
        , [  4, 'EOT', '$D', false]
        , [  5, 'ENQ', '$E', false]
        , [  6, 'ACK', '$F', false]
        , [  7, 'BEL', '$G', false]
        , [  8, 'BS', '$H', false]
        , [  9, 'HT', '$I', false]
        , [ 10, 'LF', '$J', false]
        , [ 11, 'VT', '$K', false]
        , [ 12, 'FF', '$L', false]
        , [ 13, 'CR', '$M', false]
        , [ 14, 'SO', '$N', false]
        , [ 15, 'SI', '$O', false]
        , [ 16, 'DLE', '$P', false]
        , [ 17, 'DC1', '$Q', false]
        , [ 18, 'DC2', '$R', false]
        , [ 19, 'DC3', '$S', false]
        , [ 20, 'DC4', '$T', false]
        , [ 21, 'NAK', '$U', false]
        , [ 22, 'SYN', '$V', false]
        , [ 23, 'ETB', '$W', false]
        , [ 24, 'CAN', '$X', false]
        , [ 25, 'EM', '$Y', false]
        , [ 26, 'SUB', '$Z', false]
        , [ 27, 'ESC', '%A', false]
        , [ 28, 'FS', '%B', false]
        , [ 29, 'GS', '%C', false]
        , [ 30, 'RS', '%D', false]
        , [ 31, 'US', '%E', false]
        , [ 32, ' ', ' ', false] // space
        , [ 33, '!', '/A', true]
        , [ 34, '"', '/B', true]
        , [ 35, '#', '/C', true]
        , [ 36, '$', '/D', true]
        , [ 37, '%', '/E', true]
        , [ 38, '&', '/F', true]
        , [ 39, '\'', '/G', true]
        , [ 40, '(', '/H', true]
        , [ 41, ')', '/I', true]
          // FIXME: a value of * should be encoded as: '/J'
          // but we need the asterisk as start/stop symbol
          // Where to put start/stop?
        , [ 42, 'start/stop', '*', false]
        // This is how asterisk should look!
        // , [ 42, '*', '/J', true]
        , [ 43, '+', '/K', true]
        , [ 44, ',', '/L', true]
        , [ 45, '-', '-', true]
        , [ 46, '.', '.', true]
        , [ 47, '/', '/O', true]
        , [ 48, '0', '0', true]
        , [ 49, '1', '1', true]
        , [ 50, '2', '2', true]
        , [ 51, '3', '3', true]
        , [ 52, '4', '4', true]
        , [ 53, '5', '5', true]
        , [ 54, '6', '6', true]
        , [ 55, '7', '7', true]
        , [ 56, '8', '8', true]
        , [ 57, '9', '9', true]
        , [ 58, ':', '/Z', true]
        , [ 59, ';', '%F', true]
        , [ 60, '<', '%G', true]
        , [ 61, '=', '%H', true]
        , [ 62, '>', '%I', true]
        , [ 63, '?', '%J', true]
        , [ 64, '@', '%V', true]
        , [ 65, 'A', 'A', true]
        , [ 66, 'B', 'B', true]
        , [ 67, 'C', 'C', true]
        , [ 68, 'D', 'D', true]
        , [ 69, 'E', 'E', true]
        , [ 70, 'F', 'F', true]
        , [ 71, 'G', 'G', true]
        , [ 72, 'H', 'H', true]
        , [ 73, 'I', 'I', true]
        , [ 74, 'J', 'J', true]
        , [ 75, 'K', 'K', true]
        , [ 76, 'L', 'L', true]
        , [ 77, 'M', 'M', true]
        , [ 78, 'N', 'N', true]
        , [ 79, 'O', 'O', true]
        , [ 80, 'P', 'P', true]
        , [ 81, 'Q', 'Q', true]
        , [ 82, 'R', 'R', true]
        , [ 83, 'S', 'S', true]
        , [ 84, 'T', 'T', true]
        , [ 85, 'U', 'U', true]
        , [ 86, 'V', 'V', true]
        , [ 87, 'W', 'W', true]
        , [ 88, 'X', 'X', true]
        , [ 89, 'Y', 'Y', true]
        , [ 90, 'Z', 'Z', true]
        , [ 91, '[', '%K', true]
        , [ 92, '\\', '%L', true]
        , [ 93, ']', '%M', true]
        , [ 94, '^', '%N', true]
        , [ 95, '_', '%O', true]
        , [ 96, '`', '%W', true]
        , [ 97, 'a', '+A', true]
        , [ 98, 'b', '+B', true]
        , [ 99, 'c', '+C', true]
        , [100, 'd', '+D', true]
        , [101, 'e', '+E', true]
        , [102, 'f', '+F', true]
        , [103, 'g', '+G', true]
        , [104, 'h', '+H', true]
        , [105, 'i', '+I', true]
        , [106, 'j', '+J', true]
        , [107, 'k', '+K', true]
        , [108, 'l', '+L', true]
        , [109, 'm', '+M', true]
        , [110, 'n', '+N', true]
        , [111, 'o', '+O', true]
        , [112, 'p', '+P', true]
        , [113, 'q', '+Q', true]
        , [114, 'r', '+R', true]
        , [115, 's', '+S', true]
        , [116, 't', '+T', true]
        , [117, 'u', '+U', true]
        , [118, 'v', '+V', true]
        , [119, 'w', '+W', true]
        , [120, 'x', '+X', true]
        , [121, 'y', '+Y', true]
        , [122, 'z', '+Z', true]
        , [123, '{', '%P', true]
        , [124, '|', '%Q', true]
        , [125, '}', '%R', true]
        , [126, '~', '%S', true]
        // For DEL these are all the available C 39 encodings (Wikipedia):
        //      '%T', '%X', '%Y', '%Z'
        // but in a font, we can only associate one glyph with a char
        // (We could map many chars to one glyph though, but this here is
        // the other way around.)
        // http://www.idautomation.com/barcode-faq/code-39/#Extended_Code_39
        // agrees on %T
        , [127, 'DEL', '%T', false] //
        ]
      }
      , charcode2name = abstract.charcode2name
      , Code39Builder = code39.Builder
      ;

    var Code39ExtendedGlyph = (function(Parent) {
    function Code39ExtendedGlyph(parameters, getGlyphByChar, charcode, characer, code39Encoding, textBelowFlag) {
        Parent.call(this,  parameters, charcode2name(charcode), [charcode], textBelowFlag);
        this.characer = characer; // unused, but nice as info in glyphs.data
        this.code39Encoding = code39Encoding;

        this.components = this.code39Encoding.split('').map(getGlyphByChar);
        this.width = this.components.reduce(function(sum, component) {
            return sum + component.width;
        }, 0);
    }

    var _p = Code39ExtendedGlyph.prototype = Object.create(Parent.prototype);
    _p.constructor = Code39ExtendedGlyph;


    return Code39ExtendedGlyph;
    })(abstract.BarcodeGlyph);

    var Parent = abstract.BarcodeBuilder;

    function Code39ExtendedBuilder(userParameters, fontInfo, fontBelow) {
        Parent.call(this, fontInfo, fontBelow);
        // tight coupling here ...
        this.code39builder = new Code39Builder(userParameters, fontInfo, fontBelow);
        this.parameters = this.code39builder._validateParameters(userParameters);
        this._initGlyphs(char=>this.code39builder.getGlyphByChar(char));
    }

    var _p = Code39ExtendedBuilder.prototype = Object.create(Parent.prototype);
    _p.constructor = Code39ExtendedBuilder;
    _p._glyphData = data.glyphs;
    _p.BarcodeGlyphType = Code39ExtendedGlyph;
    _p._defaultParameters = Object.create(Code39Builder.prototype._defaultParameters);

    _p.populateGlyphSet = function(glyphSet) {
        // jshint unused:vars
        // Let Code39 do the work and draw all code.{} glyphs!
        this.code39builder.drawRawSymbols(glyphSet);
        this.addCompositeGlyphs(glyphSet, this.fontBelow);
        // No need for most of these, they are encoded in Code 39 Extended:
        //      addNotdef, drawEmptyMandatoryGlyphs
        this.drawEmptyMandatoryGlyphs(glyphSet);
    };

    return {
        Builder: Code39ExtendedBuilder
      , Glyph: Code39ExtendedGlyph
    };
});
