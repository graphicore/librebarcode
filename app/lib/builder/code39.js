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
            [   1, "▮| ||▮", "code.one", ["1"], true]
          , [   2, "|▮ ||▮", "code.two", ["2"], true]
          , [   3, "▮▮ |||", "code.three", ["3"], true]
          , [   4, "|| ▮|▮", "code.four", ["4"], true]
          , [   5, "▮| ▮||", "code.five", ["5"], true]
          , [   6, "|▮ ▮||", "code.six", ["6"], true]
          , [   7, "|| |▮▮", "code.seven", ["7"], true]
          , [   8, "▮| |▮|", "code.eight", ["8"], true]
          , [   9, "|▮ |▮|", "code.nine", ["9"], true]
          , [   0, "|| ▮▮|", "code.zero", ["0"], true]
          , [  10, "▮|| |▮", "code.A", ["A", "a"], true]
          , [  11, "|▮| |▮", "code.B", ["B", "b"], true]
          , [  12, "▮▮| ||", "code.C", ["C", "c"], true]
          , [  13, "||▮ |▮", "code.D", ["D", "d"], true]
          , [  14, "▮|▮ ||", "code.E", ["E", "e"], true]
          , [  15, "|▮▮ ||", "code.F", ["F", "f"], true]
          , [  16, "||| ▮▮", "code.G", ["G", "g"], true]
          , [  17, "▮|| ▮|", "code.H", ["H", "h"], true]
          , [  18, "|▮| ▮|", "code.I", ["I", "i"], true]
          , [  19, "||▮ ▮|", "code.J", ["J", "j"], true]
          , [  20, "▮||| ▮", "code.K", ["K", "k"], true]
          , [  21, "|▮|| ▮", "code.L", ["L", "l"], true]
          , [  22, "▮▮|| |", "code.M", ["M", "m"], true]
          , [  23, "||▮| ▮", "code.N", ["N", "n"], true]
          , [  24, "▮|▮| |", "code.O", ["O", "o"], true]
          , [  25, "|▮▮| |", "code.P", ["P", "p"], true]
          , [  26, "|||▮ ▮", "code.Q", ["Q", "q"], true]
          , [  27, "▮||▮ |", "code.R", ["R", "r"], true]
          , [  28, "|▮|▮ |", "code.S", ["S", "s"], true]
          , [  29, "||▮▮ |", "code.T", ["T", "t"], true]
          , [  30, "▮ |||▮", "code.U", ["U", "u"], true]
          , [  31, "| ▮||▮", "code.V", ["V", "v"], true]
          , [  32, "▮ ▮|||", "code.W", ["W", "w"], true]
          , [  33, "| |▮|▮", "code.X", ["X", "x"], true]
          , [  34, "▮ |▮||", "code.Y", ["Y", "y"], true]
          , [  35, "| ▮▮||", "code.Z", ["Z", "z"], true]
          , [  36, "| ||▮▮", "code.minus", ["-"], true]
          , [  37, "▮ ||▮|", "code.period", ["."], true]
          , [  38, "| ▮|▮|", "code.space", [" "], false]
          , [null, "| |▮▮|", "code.startstop", ["*"], false]
          , [  39, "| | | ||", "code.dollar", ["$"], true]
          , [  40, "| | || |", "code.slash", ["/"], true]
          , [  41, "| || | |", "code.plus", ["+"], true]
          , [  42, "|| | | |", "code.percent", ["%"], true]
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
                return this.drawPoints();
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

    function _drawBar(pen, left, bottom, top, right) {
        pen.beginPath();
        // closed contours don't start with a move
        pen.addPoint([left, bottom], 'line');
        pen.addPoint([left, top], 'line');
        pen.addPoint([right, top], 'line');
        pen.addPoint([right, bottom], 'line');
        pen.endPath();
    }
    /**
     * This function draws the glyphs and doubles as glyph width
     * calculation. It returns the glyph width.
     *
     * If the pen argument is not set or falsy, it is not used and only
     * the width is calculated.
     */
    _p.drawPoints = function(pen/*optional*/) {
        var parameters = this._parameters
          , advance = 0
          , narrowWhite = parameters.narrowWhite
          , widths = {
                '|': parameters.narrowBlack
              , '▮': parameters.wideBlack
              , ' ': parameters.wideWhite
            }
          , bottom = parameters.bottom
          , top = parameters.top
          , item = null
          , nextItem, i, l, left, right
          ;
        for(i=0, l=this.pattern.length;i<l;i++) {
            item = this.pattern[i];
            // if there's no nextItem it's null
            nextItem = this.pattern[i+1] || null;

            left = advance;
            right = advance = left + widths[item];
            if(item === ' ')
                // Wide white bar:
                //    doesn't use the pen
                //    never needs a following narrow white bar
                continue;
            if(pen)
                _drawBar(pen, left, bottom, top, right);
            if(this.pattern[i+1] !== ' ')
                // Add a narrow white bar between two consecutive black
                // bars and at the end.
                // end: this.pattern[i+1] === undefined
                // not two consecutive black bars: this.pattern[i+1] === ' '
                advance += narrowWhite;
        }
        // this is the total glyph width
        return advance;
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
    // wide = narrow * wideToNarrowRatio; OR explicitly set

    // These are added here to enable fine control over the black and
    // white bars width.
    // The trigger for this feature was #19
    // https://github.com/graphicore/librebarcode/issues/19
    // For a special printer an adjustment for "ink swell" was needed,
    // because the black stripes grew too big and filled in the narrow
    // white stripes. For comprehensive adjustment the width units of
    // each bar type narrow/wide * white/black can be changed individually.
    _p._defaultParameters.blackAdjustment = 0;
    // narrowBlackAdjustment = blackAdjustment; OR explicitly set
    // wideBlackAdjustment = blackAdjustment; OR explicitly set

    _p._defaultParameters.whiteAdjustment = 0;
    // narrowWhiteAdjustment = whiteAdjustment; OR explicitly set
    // wideWhiteAdjustment = whiteAdjustment; OR explicitly set

    // wideBlack = wide + wideBlackAdjustment; OR explicitly set
    // wideWhite = wide + wideWhiteAdjustment; OR explicitly set
    // narrowBlack = narrow + narrowBlackAdjustment; OR explicitly set
    // narrowWhite = narrow + narrowWhiteAdjustment; OR explicitly set

    // overrides abstract.BarcodeBuilder.prototype._makeGlyphBelowComponent
    _p._makeGlyphBelowComponent = function (glyphSet, fontBelow, charcode, transformation) {
      // In this version, we only have upper case symbols
      var _charcode = String.fromCharCode(charcode).toUpperCase().charCodeAt(0);
      return Parent.prototype._makeGlyphBelowComponent.call(this, glyphSet
                                        , fontBelow, _charcode, transformation);
    };

    _p._validators = Parent.prototype._validators.slice();

    function _capitalizeFirst(str) {
        return str[0].toUpperCase() + str.slice(1);
    }

    function _checkOrSetGeneralAdustment(barType) {
            // let barType = "white"
            // e.g. whiteAdjustment
        var barAdjustment = barType + 'Adjustment';
        function _validatorFunc(params) {
            validation.validateNumber(barAdjustment, params[barAdjustment]);
        }
        return _validatorFunc;
    }

    function _checkOrSetSpecificAdustment(width, barType) {
            // let barType = "white", width = "narrow"
            // e.g. whiteAdjustment
        var barAdjustment = barType + 'Adjustment'
            // e.g. narrowWhiteAdjustment
          , widthBarAdjustment = width + _capitalizeFirst(barType) + 'Adjustment'
          ;
        function _validatorFunc(params) {
            if(widthBarAdjustment in params)
                validation.validateNumber(widthBarAdjustment, params[widthBarAdjustment]);
            else
                params[widthBarAdjustment] = params[barAdjustment];

            validation.validatePositiveNumber(
                      // e.g. "narrow + narrowWhiteAdjustment"
                      width + ' + ' + widthBarAdjustment
                      // e.g. params.narrow + params.narrowWhiteAdjustment
                    , params[width] + params[widthBarAdjustment]);
        }
        return _validatorFunc;
    }

    function _checkOrSetBar(width, barType) {
           // let barType = "white", width = "narrow"
           // e.g. narrowWhite
         var widthBar = width + _capitalizeFirst(barType)
           // e.g. narrowWhiteAdjustment
           , widthBarAdjustment = widthBar + 'Adjustment'
           ;
        function _validatorFunc(params) {
            // narrowWhiteAdjustment
            if(!(widthBar in params))
                params[widthBar] = widthBarAdjustment in params
                      ? params[width] + params[widthBarAdjustment]
                      : params[width]
                      ;
            validation.validatePositiveNumber(widthBar, params[widthBar]);
        }
        return _validatorFunc;
    }

    Array.prototype.push.apply(_p._validators, [
        function checkNarrow(params) {
            validation.validatePositiveNumber('narrow', params.narrow);
        }
      , function checkOrSetWide(params) {
            var ratio;
            if('wide' in params) {
                // `wide` was set explicitly.
                // If it's negative we don't set the params.wideToNarrowRatio
                // because that's nothing we need to support anyways.
                validation.validatePositiveNumber('wide', params.wide);
                ratio = params.wide / params.narrow;
                params.wideToNarrowRatio = ratio;
                // If `--force` is used, params.wideToNarrowRatio will
                // already be set.
                validation.validateMinMax('ratio wide/narrow', ratio, 2, 3);
            }
            else {
                // Set wide via ratio.
                // If it's not a number, params.wide will be a NaN, hence
                // we don't need to set it in that case anyways.
                validation.validateNumber('wideToNarrowRatio', params.wideToNarrowRatio);
                params.wide = params.narrow * params.wideToNarrowRatio;
                // It is OK to break (raise) here if `--force` is set,
                // because we run it after setting params.wide.
                validation.validateMinMax('wideToNarrowRatio', params.wideToNarrowRatio
                                                                , 2, 3);
            }
        }
        // blackAdjustment
      , _checkOrSetGeneralAdustment('black')
        // narrowBlackAdjustment
      , _checkOrSetSpecificAdustment('narrow', 'black')
        // wideBlackAdjustment
      , _checkOrSetSpecificAdustment('wide', 'black')
        // whiteAdjustment
      , _checkOrSetGeneralAdustment('white')
        // narrowWhiteAdjustment
      , _checkOrSetSpecificAdustment('narrow', 'white')
        // wideWhiteAdjustment
      , _checkOrSetSpecificAdustment('wide', 'white')
        // narrowBlack
      , _checkOrSetBar('narrow', 'black')
        // wideBlack
      , _checkOrSetBar('wide', 'black')
        // narrowWhite
      , _checkOrSetBar('narrow', 'white')
        // wideWhite
      , _checkOrSetBar('wide', 'white')
    ]);

    return {
        Builder: Code39Builder
      , Glyph: Code39Glyph
    };
});
