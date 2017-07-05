define([
    'BarcodeLibre/builder/abstract'
], function(
    abstract
){
    "use strict";

    var data = {
        glyphs: [
            // the unicode chars are from:
            //   https://en.wikipedia.org/wiki/Code_128
            //   http://www.jtbarton.com/Barcodes/Code128.aspx
            // checksum value, pattern, canonical id/name (based on Code Set B) (name of the glyph in the font?), [unicode chars, []]
            [   0, "11011001100", "code-space", [" ", "\u00A0" ,"Ô", "ü", "Ï"]]
          , [   1, "11001101100", "code-exclam", ["!"]]
          , [   2, "11001100110", "code-quotedbl", ["\""]]
          , [   3, "10010011000", "code-numbersign", ["#"]]
          , [   4, "10010001100", "code-dollar", ["$"]]
          , [   5, "10001001100", "code-percent", ["%"]]
          , [   6, "10011001000", "code-ampersand", ["&"]]
          , [   7, "10011000100", "code-quotesingle", ["'"]]
          , [   8, "10001100100", "code-parenleft", ["("]]
          , [   9, "11001001000", "code-parenright", [")"]]
          , [  10, "11001000100", "code-asterisk", ["*"]]
          , [  11, "11000100100", "code-plus", ["+"]]
          , [  12, "10110011100", "code-comma", [","]]
          , [  13, "10011011100", "code-minus", ["-"]]
          , [  14, "10011001110", "code-period", ["."]]
          , [  15, "10111001100", "code-slash", ["/"]]
          , [  16, "10011101100", "code-zero", ["0"]]
          , [  17, "10011100110", "code-one", ["1"]]
          , [  18, "11001110010", "code-two", ["2"]]
          , [  19, "11001011100", "code-three", ["3"]]
          , [  20, "11001001110", "code-four", ["4"]]
          , [  21, "11011100100", "code-five", ["5"]]
          , [  22, "11001110100", "code-six", ["6"]]
          , [  23, "11101101110", "code-seven", ["7"]]
          , [  24, "11101001100", "code-eight", ["8"]]
          , [  25, "11100101100", "code-nine", ["9"]]
          , [  26, "11100100110", "code-colon", [":"]]
          , [  27, "11101100100", "code-semicolon", [";"]]
          , [  28, "11100110100", "code-less", ["<"]]
          , [  29, "11100110010", "code-equal", ["="]]
          , [  30, "11011011000", "code-greater", [">"]]
          , [  31, "11011000110", "code-question", ["?"]]
          , [  32, "11000110110", "code-at", ["@"]]
          , [  33, "10100011000", "code-A", ["A"]]
          , [  34, "10001011000", "code-B", ["B"]]
          , [  35, "10001000110", "code-C", ["C"]]
          , [  36, "10110001000", "code-D", ["D"]]
          , [  37, "10001101000", "code-E", ["E"]]
          , [  38, "10001100010", "code-F", ["F"]]
          , [  39, "11010001000", "code-G", ["G"]]
          , [  40, "11000101000", "code-H", ["H"]]
          , [  41, "11000100010", "code-I", ["I"]]
          , [  42, "10110111000", "code-J", ["J"]]
          , [  43, "10110001110", "code-K", ["K"]]
          , [  44, "10001101110", "code-L", ["L"]]
          , [  45, "10111011000", "code-M", ["M"]]
          , [  46, "10111000110", "code-N", ["N"]]
          , [  47, "10001110110", "code-O", ["O"]]
          , [  48, "11101110110", "code-P", ["P"]]
          , [  49, "11010001110", "code-Q", ["Q"]]
          , [  50, "11000101110", "code-R", ["R"]]
          , [  51, "11011101000", "code-S", ["S"]]
          , [  52, "11011100010", "code-T", ["T"]]
          , [  53, "11011101110", "code-U", ["U"]]
          , [  54, "11101011000", "code-V", ["V"]]
          , [  55, "11101000110", "code-W", ["W"]]
          , [  56, "11100010110", "code-X", ["X"]]
          , [  57, "11101101000", "code-Y", ["Y"]]
          , [  58, "11101100010", "code-Z", ["Z"]]
          , [  59, "11100011010", "code-bracketleft", ["["]]
          , [  60, "11101111010", "code-backslash", ["\\"]]
          , [  61, "11001000010", "code-bracketright", ["]"]]
          , [  62, "11110001010", "code-asciicircum", ["^"]]
          , [  63, "10100110000", "code-underscore", ["_"]]
          , [  64, "10100001100", "code-grave", ["`"]]
          , [  65, "10010110000", "code-a", ["a"]]
          , [  66, "10010000110", "code-b", ["b"]]
          , [  67, "10000101100", "code-c", ["c"]]
          , [  68, "10000100110", "code-d", ["d"]]
          , [  69, "10110010000", "code-e", ["e"]]
          , [  70, "10110000100", "code-f", ["f"]]
          , [  71, "10011010000", "code-g", ["g"]]
          , [  72, "10011000010", "code-h", ["h"]]
          , [  73, "10000110100", "code-i", ["i"]]
          , [  74, "10000110010", "code-j", ["j"]]
          , [  75, "11000010010", "code-k", ["k"]]
          , [  76, "11001010000", "code-l", ["l"]]
          , [  77, "11110111010", "code-m", ["m"]]
          , [  78, "11000010100", "code-n", ["n"]]
          , [  79, "10001111010", "code-o", ["o"]]
          , [  80, "10100111100", "code-p", ["p"]]
          , [  81, "10010111100", "code-q", ["q"]]
          , [  82, "10010011110", "code-r", ["r"]]
          , [  83, "10111100100", "code-s", ["s"]]
          , [  84, "10011110100", "code-t", ["t"]]
          , [  85, "10011110010", "code-u", ["u"]]
          , [  86, "11110100100", "code-v", ["v"]]
          , [  87, "11110010100", "code-w", ["w"]]
          , [  88, "11110010010", "code-x", ["x"]]
          , [  89, "11011011110", "code-y", ["y"]]
          , [  90, "11011110110", "code-z", ["z"]]
          , [  91, "11110110110", "code-braceleft", ["{"]]
          , [  92, "10101111000", "code-bar", ["|"]]
          , [  93, "10100011110", "code-braceright", ["}"]]
          , [  94, "10001011110", "code-asciitilde", ["~"]]
            // FIXME: we got some collisions of the unicode chars here!
            // the chars at the end override the chars before.
            // Like this, it works with the www.jtbarton.com Barcode
            // encoder, but it overrides some of the wikipedia.com encoding.
          , [  95, "10111101000", "code-DEL", ["È", "ð", "Ã"]]
          , [  96, "10111100010", "code-FNC3", ["É", "ñ", "Ä"]]
          , [  97, "11110101000", "code-FNC2", ["Ê", "ò", "Å"]]
          , [  98, "11110100010", "code-ShiftA", ["Ë", "ó", "Æ"]]
          , [  99, "10111011110", "code-CodeC", ["Ì", "ô", "Ç"]]
          , [ 100, "10111101110", "code-FNC4", ["Í", "õ", "È"]]
          , [ 101, "11101011110", "code-CodeA", ["Î", "ö", "É"]]
          , [ 102, "11110101110", "code-FNC1", ["Ï", "÷", "Ê"]]
          , [ 103, "11010000100", "code-StartCodeA", ["Ð", "ø", "Ë"]]
          , [ 104, "11010010000", "code-StartCodeB", ["Ñ", "ù", "Ì"]]
          , [ 105, "11010011100", "code-StartCodeC", ["Ò", "ú", "Í"]]
            // not needed in the font, stoppattern is used
          , [ 106, "11000111010", "code-stop", []]
            // TODO: what does this mean?
            // wikipedia:  In barcode fonts, the final bar is generally combined
            //        with the stop symbol to make a wider stop pattern.
          , [null, "1100011101011", "code-stoppattern", ["Ó", "û", "Î"]]
            // Not needed in the font. A scanner needs this to know it's reading
            // right to left. It's the reverse of the "stop" symbol.
            // - [null, "11010111000", "code-reversestop", []]
        ]
    };

    var Code128Glyph = (function(Parent) {
    // "use strict";
    function Code128Glyph(value, pattern, name, targetCharCodes) {
        Parent.call(this,  name, targetCharCodes);
        this.value = value;
        this.pattern = pattern;
    }

    var _p = Code128Glyph.prototype = Object.create(Parent.prototype);
    _p.constructor = Code128Glyph;

    Object.defineProperties(_p, {
        width: {
            get: function() {
                return this.pattern.length * this._parameters.unit;
            }
          , enumerable: true
        }
        // "width"      the advance with of the glyph
        // "height"     the advance height of the glyph
        // "unicodes"   a list of unicode values for this glyph
        // "note"       a string
        // "lib"        a dictionary containing custom data
        // "image"      a dictionary containing image data
        // "guidelines" a list of guideline data dictionaries
        //
        // width is the one interesting here
      , glifData: {
            get: function() {
                return {
                    width: this.width
                  , unicodes: []
                };
            }
          , enumerable: true
        }
    });

    _p.drawPoints = function(pen) {
        var parameters = this._parameters
          , unit=parameters.unit
          , bottom = parameters.bottom
          , top = parameters.top
          , type = null
          , i, l, left, right
          ;
        i = 0;
        l = this.pattern.length;
        while(i<l) {
            type = this.pattern[i];
            left = i * unit;
            for(;this.pattern[i] === type && i<l;i++);
            right = i * unit;

            if (type === '0') continue;

            pen.beginPath();
            // closed contours don't start with a move
            pen.addPoint([left, bottom], 'line');
            pen.addPoint([left, top], 'line');
            pen.addPoint([right, top], 'line');
            pen.addPoint([right, bottom], 'line');
            pen.endPath();
        }
    };

    return Code128Glyph;
    })(abstract.BarcodeGlyph);

    var Parent = abstract.BarcodeBuilder;

    function Code128Builder() {
        Parent.call(this);
        this._initGlyphs();
        this.parameters = {
          // specific:
            unit: 30
          // generic:
          , bottom: 0
          , top: 590
          , fontBelowHeight: 390
        };
    }

    var _p = Code128Builder.prototype = Object.create(Parent.prototype);
    _p.constructor = Code128Builder;

    _p._glyphData = data.glyphs;
    _p.BarcodeGlyphType = Code128Glyph;

    return {
        Builder: Code128Builder
      , Glyph: Code128Glyph
    };
});
