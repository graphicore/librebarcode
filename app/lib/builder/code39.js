define([
    'BarcodeLibre/builder/abstract'
], function(
    abstract
){
    "use strict";

    // ISO/IEC 16388:2007
    // https://www.iso.org/standard/43897.html
    // (price: CHF88) ... wikipedia will do to get startet on this.
    //
    // http://www.makebarcode.com/specs/code_39.html
    // > The ratio of wide:narrow bar width may be in the range of 1.8 to 3.4.
    // > Barcodes with a narrow bar width of less than 0.020 inches (0.508mm)
    // > should have a ratio of at least 2.5. A ratio of 3.0 is recommended.
    // > Every Code 39 barcode should be preceded and followed by a quiet zone
    // > the width of at least 10 narrow bars.
    //
    //
    // https://en.wikipedia.org/wiki/Code_39
    // > The width ratio between narrow and wide is not critical, and may be chosen between 1:2 and 1:3
    //
    // Pattern
    // "▮": wide bar
    // "|": narrow bar
    // " ": white space (space)
    //  "":narrow space, is implicit between all bars where no " " wide space is present.

    var data = {
        glyphs: [
    // checksum value, pattern, canonical id/name (name of the glyph in the font?)
    //                                , [unicode chars], text_below_boolean_flag OR charcode
            [   1, "▮| ||▮", "code-one", ["1"], true]
          , [   2, "|▮ ||▮", "code-two", ["2"], true]
          , [   3, "▮▮ |||", "code-three", ["3"], true]
          , [   4, "|| ▮|▮", "code-four", ["4"], true]
          , [   5, "▮| ▮||", "code-five", ["5"], true]
          , [   6, "|▮ ▮||", "code-six", ["6"], true]
          , [   7, "|| |▮▮", "code-seven", ["7"], true]
          , [   8, "▮| |▮|", "code-eight", ["8"], true]
          , [   9, "|▮ |▮|", "code-nine", ["9"], true]
          , [   0, "|| ▮▮|", "code-zero", ["0"], true]
          , [  10, "▮|| |▮", "code-A", ["A"], true]
          , [  11, "|▮| |▮", "code-B", ["B"], true]
          , [  12, "▮▮| ||", "code-C", ["C"], true]
          , [  13, "||▮ |▮", "code-D", ["D"], true]
          , [  14, "▮|▮ ||", "code-E", ["E"], true]
          , [  15, "|▮▮ ||", "code-F", ["F"], true]
          , [  16, "||| ▮▮", "code-G", ["G"], true]
          , [  17, "▮|| ▮|", "code-H", ["H"], true]
          , [  18, "|▮| ▮|", "code-I", ["I"], true]
          , [  19, "||▮ ▮|", "code-J", ["J"], true]
          , [  20, "▮||| ▮", "code-K", ["K"], true]
          , [  21, "|▮|| ▮", "code-L", ["L"], true]
          , [  22, "▮▮|| |", "code-M", ["M"], true]
          , [  23, "||▮| ▮", "code-N", ["N"], true]
          , [  24, "▮|▮| |", "code-O", ["O"], true]
          , [  25, "|▮▮| |", "code-P", ["P"], true]
          , [  26, "|||▮ ▮", "code-Q", ["Q"], true]
          , [  27, "▮||▮ |", "code-R", ["R"], true]
          , [  28, "|▮|▮ |", "code-S", ["S"], true]
          , [  29, "||▮▮ |", "code-T", ["T"], true]
          , [  30, "▮ |||▮", "code-U", ["U"], true]
          , [  31, "| ▮||▮", "code-V", ["V"], true]
          , [  32, "▮ ▮|||", "code-W", ["W"], true]
          , [  33, "| |▮|▮", "code-X", ["X"], true]
          , [  34, "▮ |▮||", "code-Y", ["Y"], true]
          , [  35, "| ▮▮||", "code-Z", ["Z"], true]
          , [  36, "| ||▮▮", "code-minus", ["-"], true]
          , [  37, "▮ ||▮|", "code-period", ["."], true]
          , [  38, "| ▮|▮|", "code-space", [" ", "\u00A0"], false]
          , [null, "| |▮▮|", "code-startstop", ["*"], false]
          , [  39, "| || | |", "code-dollar", ["$"], true]
          , [  40, "| | || |", "code-slash", ["/"], true]
          , [  41, "| | | ||", "code-plus", ["+"], true]
          , [  42, "|| | | |", "code-percent", ["%"], true]
        ]
    };


    var Code39Glyph = (function(Parent) {
    // "use strict";
    function Code39Glyph(value, pattern, name, targetCharCodes, textBelowFlag) {
        Parent.call(this,  name, targetCharCodes, textBelowFlag);
        this.value = value;
        this.pattern = pattern;
    }

    var _p = Code39Glyph.prototype = Object.create(Parent.prototype);
    _p.constructor = Code39Glyph;

    Object.defineProperties(_p, {
        width: {
            get: function() {

                var parameters = this._parameters
                  , i, l
                  // a glyph leaves a 1 narrow part gap to the next glyph
                  , narrowParts = 1
                  , wideParts = 0
                  , wideStuff = new Set([' ', '▮'])
                  , narrow = parameters.narrow
                  , wide = parameters.wide
                  ;
                for(i=0,l=this.pattern.length;i<l;i++) {
                    if( i > 0 && this.pattern[i-1] !== ' ')
                        narrowParts += 1;

                    if (wideStuff.has(this.pattern[i]))
                        wideParts += 1;
                    else
                        narrowParts += 1;
                }
                return wideParts * wide + narrowParts * narrow;
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
          , advance=0
          , narrow = parameters.narrow
          , wide = parameters.wide
          , bottom = parameters.bottom
          , top = parameters.top
          , widths = {'|': narrow, '▮':wide, ' ': wide}
          , item, i, l, left, right
          ;

        for(i=0, l=this.pattern.length;i<l;i++) {
            if( i > 0 && this.pattern[i-1] !== ' ')
                advance += narrow;
            item = this.pattern[i];
            left = advance;
            right = advance = advance += widths[item];
            if(item === ' ')
                continue;

            pen.beginPath();
            // closed contours don't start with a move
            pen.addPoint([left, bottom], 'line');
            pen.addPoint([left, top], 'line');
            pen.addPoint([right, top], 'line');
            pen.addPoint([right, bottom], 'line');
            pen.endPath();
        }
    };

    return Code39Glyph;
    })(abstract.BarcodeGlyph);

    var Parent = abstract.BarcodeBuilder;

    function Code39Builder() {
        Parent.call(this);
        this._initGlyphs();
        this.parameters = {
          // specific:
            narrow: 30
          , wide: 90
          // generic:
          , bottom: 0
          , top: 590
          , fontBelowHeight: 390
        };
    }

    var _p = Code39Builder.prototype = Object.create(Parent.prototype);
    _p.constructor = Code39Builder;
    _p._glyphData = data.glyphs;
    _p.BarcodeGlyphType = Code39Glyph;

    return {
        Builder: Code39Builder
      , Glyph: Code39Glyph
    };
});
