define([
    'LibreBarcode/builder/abstract'
  , 'LibreBarcode/validation'
], function(
    abstract
  , validation
){
    "use strict";

    var data = {
        glyphs: [
            // the unicode chars are from:
            //   http://www.idautomation.com/barcode-fonts/code.128/user-manual.html
            //   http://www.jtbarton.com/Barcodes/Code128.aspx
            // checksum value, pattern, canonical id/name (based on Code Set B)
            // (name of the glyph in the font?), [unicode chars], textbelow_flag_or_charcodes
            [   0, "11011001100", "code.space", [" ", "Â"], false]
          , [   1, "11001101100", "code.exclam", ["!"], true]
          , [   2, "11001100110", "code.quotedbl", ["\""], true]
          , [   3, "10010011000", "code.numbersign", ["#"], true]
          , [   4, "10010001100", "code.dollar", ["$"], true]
          , [   5, "10001001100", "code.percent", ["%"], true]
          , [   6, "10011001000", "code.ampersand", ["&"], true]
          , [   7, "10011000100", "code.quotesingle", ["'"], true]
          , [   8, "10001100100", "code.parenleft", ["("], true]
          , [   9, "11001001000", "code.parenright", [")"], true]
          , [  10, "11001000100", "code.asterisk", ["*"], true]
          , [  11, "11000100100", "code.plus", ["+"], true]
          , [  12, "10110011100", "code.comma", [","], true]
          , [  13, "10011011100", "code.minus", ["-"], true]
          , [  14, "10011001110", "code.period", ["."], true]
          , [  15, "10111001100", "code.slash", ["/"], true]
          , [  16, "10011101100", "code.zero", ["0"], true]
          , [  17, "10011100110", "code.one", ["1"], true]
          , [  18, "11001110010", "code.two", ["2"], true]
          , [  19, "11001011100", "code.three", ["3"], true]
          , [  20, "11001001110", "code.four", ["4"], true]
          , [  21, "11011100100", "code.five", ["5"], true]
          , [  22, "11001110100", "code.six", ["6"], true]
          , [  23, "11101101110", "code.seven", ["7"], true]
          , [  24, "11101001100", "code.eight", ["8"], true]
          , [  25, "11100101100", "code.nine", ["9"], true]
          , [  26, "11100100110", "code.colon", [":"], true]
          , [  27, "11101100100", "code.semicolon", [";"], true]
          , [  28, "11100110100", "code.less", ["<"], true]
          , [  29, "11100110010", "code.equal", ["="], true]
          , [  30, "11011011000", "code.greater", [">"], true]
          , [  31, "11011000110", "code.question", ["?"], true]
          , [  32, "11000110110", "code.at", ["@"], true]
          , [  33, "10100011000", "code.A", ["A"], true]
          , [  34, "10001011000", "code.B", ["B"], true]
          , [  35, "10001000110", "code.C", ["C"], true]
          , [  36, "10110001000", "code.D", ["D"], true]
          , [  37, "10001101000", "code.E", ["E"], true]
          , [  38, "10001100010", "code.F", ["F"], true]
          , [  39, "11010001000", "code.G", ["G"], true]
          , [  40, "11000101000", "code.H", ["H"], true]
          , [  41, "11000100010", "code.I", ["I"], true]
          , [  42, "10110111000", "code.J", ["J"], true]
          , [  43, "10110001110", "code.K", ["K"], true]
          , [  44, "10001101110", "code.L", ["L"], true]
          , [  45, "10111011000", "code.M", ["M"], true]
          , [  46, "10111000110", "code.N", ["N"], true]
          , [  47, "10001110110", "code.O", ["O"], true]
          , [  48, "11101110110", "code.P", ["P"], true]
          , [  49, "11010001110", "code.Q", ["Q"], true]
          , [  50, "11000101110", "code.R", ["R"], true]
          , [  51, "11011101000", "code.S", ["S"], true]
          , [  52, "11011100010", "code.T", ["T"], true]
          , [  53, "11011101110", "code.U", ["U"], true]
          , [  54, "11101011000", "code.V", ["V"], true]
          , [  55, "11101000110", "code.W", ["W"], true]
          , [  56, "11100010110", "code.X", ["X"], true]
          , [  57, "11101101000", "code.Y", ["Y"], true]
          , [  58, "11101100010", "code.Z", ["Z"], true]
          , [  59, "11100011010", "code.bracketleft", ["["], true]
          , [  60, "11101111010", "code.backslash", ["\\"], true]
          , [  61, "11001000010", "code.bracketright", ["]"], true]
          , [  62, "11110001010", "code.asciicircum", ["^"], true]
          , [  63, "10100110000", "code.underscore", ["_"], true]
          , [  64, "10100001100", "code.grave", ["`"], true]
          , [  65, "10010110000", "code.a", ["a"], true]
          , [  66, "10010000110", "code.b", ["b"], true]
          , [  67, "10000101100", "code.c", ["c"], true]
          , [  68, "10000100110", "code.d", ["d"], true]
          , [  69, "10110010000", "code.e", ["e"], true]
          , [  70, "10110000100", "code.f", ["f"], true]
          , [  71, "10011010000", "code.g", ["g"], true]
          , [  72, "10011000010", "code.h", ["h"], true]
          , [  73, "10000110100", "code.i", ["i"], true]
          , [  74, "10000110010", "code.j", ["j"], true]
          , [  75, "11000010010", "code.k", ["k"], true]
          , [  76, "11001010000", "code.l", ["l"], true]
          , [  77, "11110111010", "code.m", ["m"], true]
          , [  78, "11000010100", "code.n", ["n"], true]
          , [  79, "10001111010", "code.o", ["o"], true]
          , [  80, "10100111100", "code.p", ["p"], true]
          , [  81, "10010111100", "code.q", ["q"], true]
          , [  82, "10010011110", "code.r", ["r"], true]
          , [  83, "10111100100", "code.s", ["s"], true]
          , [  84, "10011110100", "code.t", ["t"], true]
          , [  85, "10011110010", "code.u", ["u"], true]
          , [  86, "11110100100", "code.v", ["v"], true]
          , [  87, "11110010100", "code.w", ["w"], true]
          , [  88, "11110010010", "code.x", ["x"], true]
          , [  89, "11011011110", "code.y", ["y"], true]
          , [  90, "11011110110", "code.z", ["z"], true]
          , [  91, "11110110110", "code.braceleft", ["{"], true]
          , [  92, "10101111000", "code.bar", ["|"], true]
          , [  93, "10100011110", "code.braceright", ["}"], true]
          , [  94, "10001011110", "code.asciitilde", ["~"], true]
            // FIXME: we got some collisions of the unicode chars here!
            // the chars at the end override the chars before.
            // Like this, it works with the www.jtbarton.com Barcode
            // encoder, but it overrides some of the wikipedia.com encoding.
          , [  95, "10111101000", "code.DEL", ["Ã"], false]
          , [  96, "10111100010", "code.FNC3", ["Ä"], false]
          , [  97, "11110101000", "code.FNC2", ["Å"], false]
          , [  98, "11110100010", "code.ShiftA", ["Æ"], false]
          , [  99, "10111011110", "code.CodeC", ["Ç"], false]
          , [ 100, "10111101110", "code.FNC4", ["È"], false]
          , [ 101, "11101011110", "code.CodeA", ["É"], false]
          , [ 102, "11110101110", "code.FNC1", ["Ê"], false]
          , [ 103, "11010000100", "code.StartCodeA", ["Ë"], false]
          , [ 104, "11010010000", "code.StartCodeB", ["Ì"], false]
          , [ 105, "11010011100", "code.StartCodeC", ["Í"], false]
            // not needed in the font, stoppattern is used
            //, [ 106, "11000111010", "code.stop", [], false]
            // TODO: what does this mean?
            // wikipedia:  In barcode fonts, the final bar is generally combined
            //        with the stop symbol to make a wider stop pattern.
          , [null, "1100011101011", "code.stoppattern", ["Î"], false]
            // Not needed in the font. A scanner needs this to know it's reading
            // right to left. It's the reverse of the "stop" symbol.
            //, [null, "11010111000", "code.reversestop", [], false]
        ]
    };

    var Code128Glyph = (function(Parent) {
    // "use strict";
    function Code128Glyph(value, pattern, name, targetCharCodes, textBelowFlag) {
        Parent.call(this,  name, targetCharCodes, textBelowFlag);
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
            // Closed contours don't start with a move
            pen.addPoint([left, bottom], 'line');
            pen.addPoint([left, top], 'line');
            pen.addPoint([right, top], 'line');
            pen.addPoint([right, bottom], 'line');
            pen.endPath();
        }
    };

    return Code128Glyph;
    })(abstract.BarcodeGlyph);

    var Parent = abstract.BarcodeBuilder
      , charcode2name = abstract.charcode2name
      ;

    function Code128Builder(userParameters) {
        Parent.call(this);
        // validation
        this.parameters = this._validateParameters(userParameters);
        this._initGlyphs();
    }

    var _p = Code128Builder.prototype = Object.create(Parent.prototype);
    _p.constructor = Code128Builder;

    var i, glyph, num;
    for(i=0;i<=99;i++) {
        glyph = data.glyphs[i];
        num = i.toString().padStart(2, "0");
        data.glyphs.push([null, glyph[1], "code.C" + num, [], num]);
    }

    _p._glyphData = data.glyphs;
    _p.BarcodeGlyphType = Code128Glyph;

    _p._defaultParameters = Object.create(Parent.prototype._defaultParameters);
    _p._defaultParameters.unit = 30;
    _p._validators = Parent.prototype._validators.slice();

    Array.prototype.push.apply(_p._validators, [
        function checkUnit(params) {
            validation.validatePositiveNumber('unit', params.unit);
        }
    ]);


    _p._getFeatures = function(fontBelow) {
        var textbelow
          , notextbelow
          , start, stop
          , digitspre, digitspost
          , feature
          , i, l, j, ll, glyph, charcode, stoppattern
          ;

        if(!fontBelow)
          return;

        textbelow = [];
        notextbelow = [];
        digitspre = [];
        digitspost = [];
        // similar to addComponents!
        for(i=0,l=this.glyphs.length;i<l;i++) {
            glyph = this.glyphs[i];

            if(typeof(glyph.textBelowFlag) === "string")
                digitspost.push(glyph.name);
            if(i <= 99)
                digitspre.push(charcode2name(glyph.targetCharCodes[0]));

            if(!glyph.textBelowFlag)
                continue;
            for(j=0,ll=glyph.targetCharCodes.length;j<ll;j++) {
                charcode = glyph.targetCharCodes[j];
                if(!fontBelow.hasGlyphForCodePoint(charcode))
                    continue;
                textbelow.push(charcode2name(charcode));
                notextbelow.push(glyph.name);
            }
        }
        // the glyphs with text below that are directly followed by the
        // code.stoppattern glyph are substituted by their no-text below
        // versions. Because, directly before code.stoppattern is the
        // check-sum symbol, and we don't want this to be human readable
        stoppattern = charcode2name('Î'.charCodeAt(0));
        start = ['Ç', 'Í'].map(function(c) {
            return charcode2name(c.charCodeAt(0));
        })
        stop = ['È', 'É', 'Î'].map(function(c) {
            return charcode2name(c.charCodeAt(0));
        })
        feature = [
            '@textbelow = [', textbelow.join(' '),'];\n'
          , '@notextbelow = [', notextbelow.join(' '),'];\n'
          , 'feature calt {\n'
          , "    sub @textbelow' ",stoppattern,' by @notextbelow;\n'
          , '} calt;\n'
          , "\n"
          , "@digits.pre  = [", digitspre.join(" "), "];\n"
          , "@digits.post = [", digitspost.join(" "), "];\n"
          , "@start       = [", start.join(" "), "];\n"
          , "@stop        = [", stop.join(" "), "];\n"
          , "lookup digits.c {\n"
          , "    sub @digits.pre by @digits.post;\n"
          , "} digits.c;\n"
          , "feature calt {\n"
          , "    sub @start @digits.pre' lookup digits.c;\n"
          , "} calt;\n"
          , "feature calt {\n"
          , "    ignore sub @digits.post' @stop';\n"
          , "    sub @digits.post @digits.pre' lookup digits.c;\n"
          , "} calt;\n"
        ];

        return feature.join('');
    }

    _p.getFeatures = function(fontBelow) {
        var features = [
                this._getFeatures(fontBelow)
              , Parent.prototype.getFeatures.call(this, fontBelow)
          ].filter(function(item){ return !!item; });

        return features.join('\n');('Î'.charCodeAt(0));
        feature = [
        , '@textbelow = [', textbelow.join(' '),'];\n'
        , '@notextbelow = [', notextbelow.join(' '),'];\n'
        , 'feature calt {\n'
        , "    sub @textbelow' ",stoppattern,' by @notextbelow;\n'
        , '} calt;\n'
        ];

        return feature.join('')
    };

    return {
        Builder: Code128Builder
      , Glyph: Code128Glyph
    };
});
