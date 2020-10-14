// jshint esversion: 6
define([
    'LibreBarcode/builder/abstract'
  , 'LibreBarcode/validation'
], function(
    abstract
  , validation
){
    "use strict";

    var drawFromFont = abstract.drawFromFont
      , Transform = abstract.Transform
      ;

    var data = {
        symbolsBase: [
            // Ther patterns are from Set A, Set B and Set C patterns will
            // be derrived from that.
              [0, [3, 2, 1, 1], 'zero' , ['symbol',]]
            , [1, [2, 2, 2, 1], 'one'  , ['symbol',]]
            , [2, [2, 1, 2, 2], 'two'  , ['symbol',]]
            , [3, [1, 4, 1, 1], 'three', ['symbol',]]
            , [4, [1, 1, 3, 2], 'four' , ['symbol',]]
            , [5, [1, 2, 3, 1], 'five' , ['symbol',]]
            , [6, [1, 1, 1, 4], 'six'  , ['symbol',]]
            , [7, [1, 3, 1, 2], 'seven', ['symbol',]]
            , [8, [1, 2, 1, 3], 'eight', ['symbol',]]
            , [9, [3, 1, 1, 2], 'nine' , ['symbol',]]
        ]
      , glyphs: [
            // * pattern [S, B, S, B, S, B, ...]
            //       S = space/light bar B = bar/dark bar
            //       A 0 entry in the first position makes it start with a
            //       black bar, other zero pattern entries in the middle
            //       don't make sense and are not part of the spec, but
            //       I won't validate. 0 Entries at the end are the same as
            //       ending the array earlier.
            // * name/id unique!
            // * [groups]: used to select groups of glyphs
            // * targetChars ['c', 'h', 'a', 'r', 's'] => maybe needs to be done differently here
            [[7], 'space', [], [' ']]//
        ]
    };
    (()=>{

      let patternTransforms = {
          'setA': pattern=>pattern.slice()
          // Set B - the patterns are the reverse of Set A
        , 'setB': pattern=>pattern.slice().reverse()
          // Set C - the patterns are the inverse of Set A
          //         i.E. S becomes B, B becomes S
          //         pushing a 0 space at the front to make it
          //         effectively [B, S, B, S, ...]
        , 'setC': pattern=>[0, ...pattern]
      };

      for(let setName of ['setA', 'setB', 'setC']) {
          for(let [, pattern, name, groups] of data.symbolsBase) {
              data.glyphs.push([
                  patternTransforms[setName](pattern)
                , `${setName}.${name}` // e.g. setA.three
                , [setName, ...groups]
                , []
              ]);
          }
      }
      // Draw numbers 0-9 from the fontBelow, to have feedback for the
      // user.
      for(let [value, /*pattern*/, name, /*groups*/] of data.symbolsBase) {
          let char = value.toString()[0]
            , charCode = char.charCodeAt(0)
            ;
          data.glyphs.push([
               // Pattern: copy a number glyph from the below-font
               // use the char code
               {fromFont: true, charCode: charCode}
             , name
             , ['literal', 'number']
             , [char]
          ]);

          data.glyphs.push([
               // Pattern: copy a number glyph from the below-font
               // use the char code
               {fromFont: true, charCode: charCode}
             , `below.${name}`
             , ['below', 'number']
             , []
          ]);
      }
    })();

    // Auxiliary pattern
    data.glyphs.push(...[
            // Normal guard bar pattern
            [[0, 1, 1, 1], 'guard.normal', ['auxiliary', 'main'], []]
            // Centre guard bar pattern
          , [[1, 1, 1, 1, 1], 'guard.centre', ['auxiliary', 'main'], []]
            // Special guard bar pattern
          , [[1, 1, 1, 1, 1, 1], 'guard.special', ['auxiliary', 'main'], []]
            // Add-on guard bar pattern
          , [[0, 1, 1, 2], 'add_on.guard', ['auxiliary', 'add_on'], []]
            // Add-on delineator
          , [[1, 1], 'add_on.delineator', ['auxiliary', 'add_on'], []]
    ]);

    var EAN13Glyph = (function(Parent) {
    // "use strict";
    function EAN13Glyph(parameters, fontBelow, drawData, name, groups, targetChars=[]) {
        Parent.call(this, parameters, name, targetChars, false/*textBelowFlag*/);
        this.fontBelow = fontBelow;
        this.drawData = drawData;
        this.groups = new Set(groups);
    }

    var _p = EAN13Glyph.prototype = Object.create(Parent.prototype);
    _p.constructor = EAN13Glyph;

    Object.defineProperties(_p, {
        width: {
            get: function() {

                if(this.drawData.fromFont)
                    return this._drawPointsFromFont();

                if(Array.isArray(this.drawData))
                    return this.drawData.reduce((a, b)=>a + b) * this._parameters.unit;
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
                  , unicodes: this.targetCharCodes
                };
            }
          , enumerable: true
        }
    });

    _p._drawPointsFromPattern = function(pen) {
        var parameters = this._parameters
          , pattern = this.drawData
          , unit=parameters.unit
          , bottom = parameters.bottom
          , top = parameters.top
          , right = 0
          ;
        if(['guard.normal', 'guard.centre'].indexOf(this.name) !== -1){
          bottom -= 200;
        }
        for(let [i, modules] of pattern.entries()) {
          // S = space/light bar B = bar/dark bar
          // first item (i === 0) is always a space

            let isBar = i % 2 === 1
              , width = modules * unit
              , left
              ;
            left = right;
            right += width;

            if (!isBar) continue;

            pen.beginPath();
            // Closed contours don't start with a move
            pen.addPoint([left, bottom], 'line');
            pen.addPoint([left, top], 'line');
            pen.addPoint([right, top], 'line');
            pen.addPoint([right, bottom], 'line');
            pen.endPath();
        }
    };

    _p._getFontBelowScale = function() {
            // Using height to calculate the scale is good, because
            // it creates the same scaling for all of the font.
            // This results in the new height fitting into fontBelowHeight
            // units after scaling.
        var height = this.fontBelow['OS/2'].typoAscender
                            - this.fontBelow['OS/2'].typoDescender
          , scale = this._parameters.fontBelowHeight / height
          ;
        return scale;
    };

    // doubles to only calculate width if no pen is given
    _p._drawPointsFromFont = function(pen=null) {
        var transformation = null;
        if(this.name.startsWith('below.')) {
            let scale = this._getFontBelowScale();
            transformation = new Transform().scale(scale);
        }
        let [advanceWidth, drawPointsFunc] = drawFromFont(
                  this.fontBelow, this.drawData.charCode, transformation);
        if(pen)
            drawPointsFunc(pen);

        return advanceWidth;
    };

    _p.drawPoints = function(pen) {
        if(!this.drawsRawSymbol)
            throw new Error(`The glyph ${this.name} is marked as not drawing, `
                         +`yet it's drawPoints method is called.`);

        if(this.drawData.fromFont)
            return this._drawPointsFromFont(pen);

        // the default?
        if(Array.isArray(this.drawData)) {
            this._drawPointsFromPattern(pen);

            if(this.name.startsWith('set')) {
                let scale = this._getFontBelowScale()
                  , name = `below.${this.name.slice(this.name.indexOf('.')+1)}`
                  , transformation =  new Transform().translate(
                          0, -this.fontBelow['OS/2'].typoAscender * scale)
                  ;
                pen.addComponent(name, transformation);
            }
            return;
        }

    };

    _p.createComposites = function* (withTextBelow) {
        // jshint unused:vars
        return;
        // this is for the regular pattern glyphs
        // they are not unicode encoded, just accessed via GSUB
        // for(let charcode of this.targetCharCodes) {
        //     let name = glyph.name
        //       , unicodes = []
        //       , textBelowChars = glyph.value.toString()
        //       ;
        //     yield [name, unicodes, textBelowChars];
        // }
    };

    return EAN13Glyph;
    })(abstract.BarcodeGlyph);

    var Parent = abstract.BarcodeBuilder;

    function EAN13Builder(userParameters, fontInfo, fontBelow) {
        Parent.call(this, fontInfo, fontBelow);
        // validation
        this.parameters = this._validateParameters(userParameters);
        this._initGlyphs(fontBelow);
    }

    var _p = EAN13Builder.prototype = Object.create(Parent.prototype);
    _p.constructor = EAN13Builder;

    _p._glyphData = data.glyphs;
    _p.BarcodeGlyphType = EAN13Glyph;

    _p._defaultParameters = Object.create(Parent.prototype._defaultParameters);
    // x-advance unit == one module
    _p._defaultParameters.unit = 30;
    _p._validators = Parent.prototype._validators.slice();

    Array.prototype.push.apply(_p._validators, [
        function checkUnit(params) {
            validation.validatePositiveNumber('unit', params.unit);
        }
    ]);

    _p.getGlyphsByGroup = function(...groups) {
        var result = [];

        glyphs:
        for(let glyph of this.glyphs) {
            for(let group of groups) {
                if(!glyph.groups.has(group))
                    continue glyphs;
            }
            result.push(glyph);
        }


        return result;
    };

    _p._getFeatures = function() {
        var feature = [
            '@numbers = [', this.getGlyphsByGroup('literal', 'number').map(g=>g.name).join(' '),'];\n'
          , '@numBelow = [', this.getGlyphsByGroup('below', 'number').map(g=>g.name).join(' '),'];\n'
          , '@setA = [', this.getGlyphsByGroup('symbol', 'setA').map(g=>g.name).join(' '),'];\n'
          , '@setB = [', this.getGlyphsByGroup('symbol', 'setB').map(g=>g.name).join(' '),'];\n'
          , '@setC = [', this.getGlyphsByGroup('symbol', 'setC').map(g=>g.name).join(' '),'];\n'
          , `
#########
## EAN 13

# substitute one to many to insert the stop/end guard symbol after
# the last number in ean 13
lookup ean13_stop {
    sub zero by zero guard.normal;
    sub one by one guard.normal;
    sub two by two guard.normal;
    sub three by three guard.normal;
    sub four by four guard.normal;
    sub five by five guard.normal;
    sub six by six guard.normal;
    sub seven by seven guard.normal;
    sub eight by eight guard.normal;
    sub nine by nine guard.normal;
}ean13_stop;

feature calt {
   sub @numbers
       @numbers
       @numbers
       @numbers
       @numbers
       @numbers
       @numbers
       @numbers
       @numbers
       @numbers
       @numbers
       @numbers
       @numbers' lookup ean13_stop
       ;
}calt;

# substitute one to many to insert the centre guard symbol after
# the sixth (actually seventh before the first is removed) number in ean 13
lookup ean13_insert_center {
    sub zero by zero guard.centre;
    sub one by one guard.centre;
    sub two by two guard.centre;
    sub three by three guard.centre;
    sub four by four guard.centre;
    sub five by five guard.centre;
    sub six by six guard.centre;
    sub seven by seven guard.centre;
    sub eight by eight guard.centre;
    sub nine by nine guard.centre;
}ean13_insert_center;

feature calt {
   sub @numbers
       @numbers
       @numbers
       @numbers
       @numbers
       @numbers
       @numbers' lookup ean13_insert_center
       @numbers
       @numbers
       @numbers
       @numbers
       @numbers
       @numbers
       guard.normal
       ;
}calt;

# substitute one to many to insert the start guard symbol after
# the first number in ean 13 AND the human readable inital number,
# that has
lookup ean13_start {
    sub zero by below.zero guard.normal;
    sub one by below.one guard.normal;
    sub two by below.two guard.normal;
    sub three by below.three guard.normal;
    sub four by below.four guard.normal;
    sub five by below.five guard.normal;
    sub six by below.six guard.normal;
    sub seven by below.seven guard.normal;
    sub eight by below.eight guard.normal;
    sub nine by below.nine guard.normal;
}ean13_start;

feature calt {
   sub @numbers' lookup ean13_start
       @numbers
       @numbers
       @numbers
       @numbers
       @numbers
       @numbers
       guard.centre
       @numbers
       @numbers
       @numbers
       @numbers
       @numbers
       @numbers
       guard.normal
       ;
}calt;

# change a @number to @setA
lookup ean13_setA {
    sub @numbers by @setA;
}ean13_setA;

# change a @number to @setB
lookup ean13_setB {
    sub @numbers by @setB;
}ean13_setB;

# change a @number to @setC
lookup ean13_setC {
    sub @numbers by @setC;
}ean13_setC;

# Left half of an EAN-13 barcode
# variable parity mix of number sets A and B for
# the six symbol characters in the left half of the symbol.
feature calt {
   sub below.zero
       guard.normal
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setA
       guard.centre
       ;
   sub below.one
       guard.normal
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setB
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setB
       guard.centre
       ;
   sub below.two
       guard.normal
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setB
       @numbers' lookup ean13_setB
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setA
       guard.centre
       ;
   sub below.three
       guard.normal
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setB
       @numbers' lookup ean13_setB
       @numbers' lookup ean13_setB
       @numbers' lookup ean13_setA
       guard.centre
       ;
   sub below.four
       guard.normal
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setB
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setB
       @numbers' lookup ean13_setB
       guard.centre
       ;
   sub below.five
       guard.normal
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setB
       @numbers' lookup ean13_setB
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setB
       guard.centre
       ;
   sub below.six
       guard.normal
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setB
       @numbers' lookup ean13_setB
       @numbers' lookup ean13_setB
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setA
       guard.centre
       ;
   sub below.seven
       guard.normal
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setB
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setB
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setB
       guard.centre
       ;
   sub below.eight
       guard.normal
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setB
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setB
       @numbers' lookup ean13_setB
       @numbers' lookup ean13_setA
       guard.centre
       ;
   sub below.nine
       guard.normal
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setB
       @numbers' lookup ean13_setB
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setB
       @numbers' lookup ean13_setA
       guard.centre
       ;
}calt;


# Right half of an EAN-13 barcode is all setC
feature calt {
   sub guard.centre
       @numbers' lookup ean13_setC
       @numbers' lookup ean13_setC
       @numbers' lookup ean13_setC
       @numbers' lookup ean13_setC
       @numbers' lookup ean13_setC
       @numbers' lookup ean13_setC
       guard.normal
       ;
}calt;

########
## EAN-8

# substitute one to many to insert the stop/end guard symbol after
# the last number in ean 8, reuses the lookup ean13_stop
feature calt {
   sub @numbers
       @numbers
       @numbers
       @numbers
       @numbers
       @numbers
       @numbers
       @numbers' lookup ean13_stop
       ;
}calt;

# substitute one to many to insert the centre guard symbol after
# the sixth number in ean 8, reuses the lookup ean13_insert_center
feature calt {
   sub @numbers
       @numbers
       @numbers
       @numbers' lookup ean13_insert_center
       @numbers
       @numbers
       @numbers
       @numbers
       guard.normal
       ;
}calt;

# substitute one to many to insert the start guard symbol before
# the first number in ean 8.
lookup ean8_start {
    sub zero by guard.normal zero;
    sub one by guard.normal one;
    sub two by guard.normal two;
    sub three by guard.normal three;
    sub four by guard.normal four;
    sub five by guard.normal five;
    sub six by guard.normal six;
    sub seven by guard.normal seven;
    sub eight by guard.normal eight;
    sub nine by guard.normal nine;
}ean8_start;

feature calt {
   sub @numbers' lookup ean8_start
       @numbers
       @numbers
       @numbers
       guard.centre
       @numbers
       @numbers
       @numbers
       @numbers
       guard.normal
       ;
}calt;

# Left half of an EAN-8 barcode is all setA
feature calt {
   sub guard.normal
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setA
       guard.centre
       ;
}calt;

# Right half of an EAN-8 barcode is all setC
feature calt {
   sub guard.centre
       @numbers' lookup ean13_setC
       @numbers' lookup ean13_setC
       @numbers' lookup ean13_setC
       @numbers' lookup ean13_setC
       guard.normal
       ;
}calt;

# hack to ensure quiet zone
# the y movement number is a rough guess right now
feature calt {
    pos @numBelow <0 -318 0 0>;
}calt;


`
        ];
        return feature.join('');
    };

    _p.getFeatures = function(fontBelow) {
        var features = [
                this._getFeatures(fontBelow)
              , Parent.prototype.getFeatures.call(this, fontBelow)
          ].filter(function(item){ return !!item; });

        return features.join('\n');
    };

    return {
        Builder: EAN13Builder
      , Glyph: EAN13Glyph
    };
});
