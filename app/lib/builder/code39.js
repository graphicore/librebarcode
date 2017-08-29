define([
    'LibreBarcode/errors'
  , 'LibreBarcode/validation'
  , 'LibreBarcode/builder/abstract'
], function(
    errors
  , validation
  , abstract
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
          , [  10, "▮|| |▮", "code-A", ["A", "a"], true]
          , [  11, "|▮| |▮", "code-B", ["B", "b"], true]
          , [  12, "▮▮| ||", "code-C", ["C", "c"], true]
          , [  13, "||▮ |▮", "code-D", ["D", "d"], true]
          , [  14, "▮|▮ ||", "code-E", ["E", "e"], true]
          , [  15, "|▮▮ ||", "code-F", ["F", "f"], true]
          , [  16, "||| ▮▮", "code-G", ["G", "g"], true]
          , [  17, "▮|| ▮|", "code-H", ["H", "h"], true]
          , [  18, "|▮| ▮|", "code-I", ["I", "i"], true]
          , [  19, "||▮ ▮|", "code-J", ["J", "j"], true]
          , [  20, "▮||| ▮", "code-K", ["K", "k"], true]
          , [  21, "|▮|| ▮", "code-L", ["L", "l"], true]
          , [  22, "▮▮|| |", "code-M", ["M", "m"], true]
          , [  23, "||▮| ▮", "code-N", ["N", "n"], true]
          , [  24, "▮|▮| |", "code-O", ["O", "o"], true]
          , [  25, "|▮▮| |", "code-P", ["P", "p"], true]
          , [  26, "|||▮ ▮", "code-Q", ["Q", "q"], true]
          , [  27, "▮||▮ |", "code-R", ["R", "r"], true]
          , [  28, "|▮|▮ |", "code-S", ["S", "s"], true]
          , [  29, "||▮▮ |", "code-T", ["T", "t"], true]
          , [  30, "▮ |||▮", "code-U", ["U", "u"], true]
          , [  31, "| ▮||▮", "code-V", ["V", "v"], true]
          , [  32, "▮ ▮|||", "code-W", ["W", "w"], true]
          , [  33, "| |▮|▮", "code-X", ["X", "x"], true]
          , [  34, "▮ |▮||", "code-Y", ["Y", "y"], true]
          , [  35, "| ▮▮||", "code-Z", ["Z", "z"], true]
          , [  36, "| ||▮▮", "code-minus", ["-"], true]
          , [  37, "▮ ||▮|", "code-period", ["."], true]
          , [  38, "| ▮|▮|", "code-space", [" "], false]
          , [null, "| |▮▮|", "code-startstop", ["*"], false]
          , [  39, "| | | ||", "code-dollar", ["$"], true]
          , [  40, "| | || |", "code-slash", ["/"], true]
          , [  41, "| || | |", "code-plus", ["+"], true]
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
            if(i > 0 && this.pattern[i-1] !== ' ')
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

    function Code39Builder(userParameters) {
        Parent.call(this);
        // validation
        this.parameters = this._validateParameters(userParameters);
        this._initGlyphs();
    }

    var _p = Code39Builder.prototype = Object.create(Parent.prototype);
    _p.constructor = Code39Builder;
    _p._glyphData = data.glyphs;
    _p.BarcodeGlyphType = Code39Glyph;

    _p._defaultParameters = Object.create(Parent.prototype._defaultParameters);
     //  narrow/wide should be between 1/2 and 1/3
    _p._defaultParameters.narrow = 30;
    // for small printed codes a wider ratio makes sense, can
    // also help with low resolution media or scanners.
    // max 3 min 2
    _p._defaultParameters.wideToNarrowRatio = 3;

    // overrides abstract.BarcodeBuilder.prototype._makeGlyphBelowComponent
    _p._makeGlyphBelowComponent = function (glyphSet, fontBelow, charcode, transformation) {
      // In this version, we only have upper case symbols
      var _charcode = String.fromCharCode(charcode).toUpperCase().charCodeAt(0);
      return Parent.prototype._makeGlyphBelowComponent.call(this, glyphSet
                                        , fontBelow, _charcode, transformation);
    };

    _p._validators = Parent.prototype._validators.slice();
    Array.prototype.push.apply(_p._validators, [
        function checkNarrow(params) {
            validation.validatePositiveNumber('narrow', params.narrow);
        }
      , function checkOrSetWide(params) {
            var ratio;
            if('wide' in params) {
                // `wide` was set explicitly
                validation.validatePositiveNumber('wide', params.wide);
                ratio = params.wide / params.narrow;
                validation.validateMinMax('ratio wide/narrow', ratio, 2, 3);
                params.wideToNarrowRatio = ratio;
            }
            else {
                // set wide via ratio
                validation.validateNumber('wideToNarrowRatio', params.wideToNarrowRatio);
                validation.validateMinMax('wideToNarrowRatio', params.wideToNarrowRatio
                                                                , 2, 3);
                params.wide = params.narrow * params.wideToNarrowRatio;
            }
        }
    ]);

    return {
        Builder: Code39Builder
      , Glyph: Code39Glyph
    };
});
