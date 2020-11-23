// jshint esversion: 7
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
              [0, [3, 2, 1, 1], 'zero' , ['symbol', 'zero']]
            , [1, [2, 2, 2, 1], 'one'  , ['symbol', 'one']]
            , [2, [2, 1, 2, 2], 'two'  , ['symbol', 'two']]
            , [3, [1, 4, 1, 1], 'three', ['symbol', 'three']]
            , [4, [1, 1, 3, 2], 'four' , ['symbol', 'four']]
            , [5, [1, 2, 3, 1], 'five' , ['symbol', 'five']]
            , [6, [1, 1, 1, 4], 'six'  , ['symbol', 'six']]
            , [7, [1, 3, 1, 2], 'seven', ['symbol', 'seven']]
            , [8, [1, 2, 1, 3], 'eight', ['symbol', 'eight']]
            , [9, [3, 1, 1, 2], 'nine' , ['symbol', 'nine']]
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
            [[7], 'space', [], [' ']] // 7 * unit ... drawn as a space
          , [{fromFont: true, charCode: 'e'.charCodeAt(0)}, 'e.upce.marker', [], ['e']]
          , [{fromFont: true, charCode: 'E'.charCodeAt(0)}, 'E.upce.marker', [], ['E']]
          , [{fromFont: true, charCode: '<'.charCodeAt(0)}, 'lt.below', ['below', 'default', 'quietzone'], ['<']]
          , [{fromFont: true, charCode: '>'.charCodeAt(0)}, 'gt.below', ['below', 'default', 'quietzone'], ['>']]
        ]
    };

    // ['one', 'two', 'three', ...]
    const DIGITS = data.symbolsBase.map(([,,name,])=>name);

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
                , `${name}.${setName}` // e.g. three.setA
                , [setName, 'main', ...groups]
                , []
              ]);


              // only setA and setC are used in UPC-A and EAN-8
              if(setName !== 'setB') {
                  // EAN-8 is shorter (see parameters.topEAN8)
                  data.glyphs.push([
                      patternTransforms[setName](pattern)
                    , `${name}.ean8.${setName}` // e.g. three.ean8.setA
                    , [setName, 'ean8', ...groups]
                    , []
                  ]);

                  // Special layout version for UPC-A first and last pattern
                  data.glyphs.push([
                      patternTransforms[setName](pattern)
                      // Prefixed with an "." to remove the glyph name from
                      // the AGLFN interpretation of the glyph sting.
                      // Instead, the names of the quiet zone numbers will
                      // be used in UPC-A, otherwise we'd have a duplication.
                    , `.${name}.upcA.${setName}` // e.g. .three.upcA.setA
                    , [setName, 'upcA', ...groups]
                    , []
                  ]);
              }

              // only setA and setB are used in add-ons
              if(setName !== 'setC')
                  data.glyphs.push([
                      patternTransforms[setName](pattern)
                    , `${name}.addOn.${setName}` // e.g. three.addOn.setA
                    , [setName, 'addOn', ...groups]
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
             , `${name}.below`
             , ['below', 'number', 'default']
             , []
          ]);
          data.glyphs.push([
               {fromFont: true, charCode: charCode}
             , `${name}.below.upcquietzone`
             , ['below', 'number', 'upcquietzone']
             , []
          ]);
      }
    })();

    // Auxiliary pattern
    data.glyphs.push(...[
            // Normal guard bar pattern
            [[0, 1, 1, 1], 'guard.normal', ['auxiliary', 'main', 'guard.normal'], []]
          , [[0, 1, 1, 1], 'guard.normal.ean8', ['auxiliary', 'main', 'guard.normal', 'ean8'], []]
          , [[0, 1, 1, 1], 'guard.normal.triggerAddOn', ['auxiliary', 'main', 'guard.normal', 'triggerAddOn'], []]
            // Centre guard bar pattern
          , [[1, 1, 1, 1, 1], 'guard.centre', ['auxiliary', 'main'], []]
          , [[1, 1, 1, 1, 1], 'guard.centre.ean8', ['auxiliary', 'main', 'ean8'], []]
            // Special guard bar pattern
          , [[1, 1, 1, 1, 1, 1], 'guard.special', ['auxiliary', 'main', 'triggerAddOn'], []]
            // Add-on guard bar pattern
          , [[0, 1, 1, 2], 'addOn.guard.twoDigit', ['auxiliary', 'addOn', 'addOn.guard'], []]
          , [[0, 1, 1, 2], 'addOn.guard.fiveDigit', ['auxiliary', 'addOn', 'addOn.guard'], []]
            // Add-on delineator
          , [[1, 1], 'addOn.delineator', ['auxiliary', 'addOn'], []]
    ]);

    var EAN13Glyph = (function(Parent) {
    // "use strict";
    function EAN13Glyph(parameters, getGlyphByName, fontBelow, drawData, name, groups, targetChars=[]) {
        Parent.call(this, parameters, name, targetChars, false/*textBelowFlag*/);
        this.getGlyphByName = getGlyphByName;
        this.fontBelow = fontBelow;
        this.drawData = drawData;
        this.groups = new Set(groups);
    }

    var _p = EAN13Glyph.prototype = Object.create(Parent.prototype);
    _p.constructor = EAN13Glyph;

    Object.defineProperties(_p, {
        width: {
            get: function() {
                return this.drawPoints(null);
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

    // CAUTION: if groups is an empty list this returns true.
    _p.hasGroups = function(...groups) {
        for(let group of groups) {
            if(!this.groups.has(group)) return false;
        }
        return true;
    };

    _p._drawPointsFromPattern = function(pen) {
        var parameters = this._parameters
          , pattern = this.drawData
          , unit=parameters.unit
          , bottom = parameters.bottom
          , top = unit * (this.hasGroups('ean8')
                              ? parameters.topEAN8
                              : parameters.top)
          , right = 0
          ;

        // In GS1 Generel Specifications pdf document under
        //    5.2.3.1 Nominal dimensions of characters
        // There's an exception, quote:
        //  > The X-dimension at nominal size is 0.330 millimetre (0.0130 inch).
        //  >
        //  > The width of each bar (dark bar) and space (light bar) is
        //  > determined by multiplying the X-dimension by the module width
        //  > of each bar (dark bar) and space (light bar) (1, 2, 3, or 4).
        //  > There is an exception for characters 1, 2, 7, and 8. For these
        //  > characters, the bars (dark bars) and spaces (light bars) are
        //  > reduced or enlarged by one-thirteenth of a module to provide a
        //  > uniform distribution of bar width tolerances and thus improve
        //  > scanning reliability.
        //
        // This is accompanied by a table:
        //  > Figure 5.2.3.1-1. Reduction/enlargement for characters 1, 2, 7, and 8
        //  >                 |       Number set A           |       Number Set B and C
        //  > Character value | bar/dark bar | space/light bar | bar/dark bar | space/light bar
        //  > ---------------------------------------------------------------------------------
        //  >        1        |  - 0.025 mm  | + 0.025 mm      | + 0.025 mm  | - 0.025 mm
        //  >        2        |  - 0.025 mm  | + 0.025 mm      | + 0.025 mm  | - 0.025 mm
        //  >        7        |  + 0.025 mm  | - 0.025 mm      | - 0.025 mm  | + 0.025 mm
        //  >        8        |  + 0.025 mm  | - 0.025 mm      | - 0.025 mm  | + 0.025 mm
        //
        //  Because we can't draw in physical sizes here, we'll have to
        //  stick to the "one-thirteens" rule here:
        //    0.330 mm /13 = 0.025384615384615387 mm
        //   (Rounded to three decimal pointsthat's the 0.025 mm.)
        //  What is called X-Dimension above is our "parameters.unit" (default: 30)
        let barAdjustmentMagnitude = unit / 13 // 30 / 13 = 2.3076923076923075
         , barAdjustments = {
            'setA': {
                  'one':   [-barAdjustmentMagnitude,  barAdjustmentMagnitude]
                , 'two':   [-barAdjustmentMagnitude,  barAdjustmentMagnitude]
                , 'seven': [ barAdjustmentMagnitude, -barAdjustmentMagnitude]
                , 'eight': [ barAdjustmentMagnitude, -barAdjustmentMagnitude]
            }
          , 'setB': {
                  'one':   [ barAdjustmentMagnitude, -barAdjustmentMagnitude]
                , 'two':   [ barAdjustmentMagnitude, -barAdjustmentMagnitude]
                , 'seven': [-barAdjustmentMagnitude,  barAdjustmentMagnitude]
                , 'eight': [-barAdjustmentMagnitude,  barAdjustmentMagnitude]
            }
          }
          ;
        barAdjustments['setC'] = barAdjustments['setB'];
        var [barAdjustmentDark, barAdjustmentLight] = [0, 0];
        if(this.hasGroups('symbol')) {
            getAdjustment:
            for(let setName of Object.keys(barAdjustments)){
                if(!this.hasGroups(setName)) continue;
                let setAdjustments = barAdjustments[setName];
                for(let symbolName of Object.keys(setAdjustments)) {
                    if(!this.hasGroups(symbolName)) continue;
                    // assert this.hasGroups('symbol', setName, symbolName)
                    [barAdjustmentDark, barAdjustmentLight] = setAdjustments[symbolName];
                    break getAdjustment;
                }
            }
        }

        // TODO: all these "special" cases, it should be configurable
        // via the `parameters`.
        if(this.hasGroups('auxiliary', 'main')
                // the add-on symbols are at the bottom aligned with
                // the guard patterns
                || this.hasGroups('addOn')
                // the first and last digit symbol of UPC-A is aligned
                // with the guard patterns
                || this.hasGroups('symbol', 'upcA')) {
            bottom -= parameters.auxiliaryDrop * unit;
        }
        if (this.hasGroups('addOn') /* auxiliary and main */ ) {
            // make room for the text **above**
            top -= this.fontBelowHeight + this.fontBelowPadding;
        }

        if (this.hasGroups('addOn.guard')) {
            // Add a quiet-zone between the barcode and the add-on
            // right === advance
            right = this.getGlyphByName('space').width;
        }

        for(let [i, modules] of pattern.entries()) {
          // S = space/light bar B = bar/dark bar
          // first item (i === 0) is always a space

            let isBar = i % 2 === 1
              , width = modules * unit
              , left
              ;

            width = isBar
                    ? width + barAdjustmentDark
                    : width + barAdjustmentLight
                    ;

            left = right;
            right += width;
            // if pen is not given this is used to calculate the accurate witdh.
            if (!isBar || !pen) continue;

            pen.beginPath();
            // Closed contours don't start with a move
            pen.addPoint([left, bottom], 'line');
            pen.addPoint([left, top], 'line');
            pen.addPoint([right, top], 'line');
            pen.addPoint([right, bottom], 'line');
            pen.endPath();
        }
        return right;
    };

    _p._getFontBelowScaleByWidth = function(widthUnits) {
            // Here's a strong assumption that the font is monospaced
            // or that at least the figures are tabular tabular lining
            // figures, so all figures have the same advance width.
          var glyph = this.fontBelow.glyphForCodePoint('0'.charCodeAt(0))
          , width = glyph.advanceWidth
          , unit = this._parameters.unit
          , scale = widthUnits * unit / width
          ;
        return scale;
    };

    Object.defineProperty(_p, 'fontBelowHeight', {
        get: function() {
            // pattern width is 7
            var scale = this._getFontBelowScaleByWidth(7)
              , height = this.fontBelow['OS/2'].capHeight
              ;
            return height * scale;
        }
    });

    Object.defineProperty(_p, 'fontBelowPadding', {
        get: function() {
            return this._parameters.fontBelowPadding * this._parameters.unit;
        }
    });

    // doubles to only calculate width if no pen is given
    _p._drawPointsFromFont = function(pen=null) {
        var transformation = null
          , advanceWidth = null
          ;
        if(this.hasGroups('below')) {
            let scale = 1
              , unit = this._parameters.unit
              , y = 0
              ;

            if(this.hasGroups('default'))
                // pattern width is 7
                scale = this._getFontBelowScaleByWidth(7);
            else if(this.hasGroups('upcquietzone')) {
                    // Width 4 is defined by the spec:
                    //
                    // > 5.2.5 Human readable interpretation
                    // > [...]
                    // > For UPC-A and UPC-E barcodes, the size of the first
                    // > and last digits should be reduced to a maximum width
                    // > equivalent to four modules.
                let widthModules = 4
                    // From trying out (using Inconsolata!), drawing the
                    // glyphs 1.25 times bigger is good to make it fill
                    // out its full available space of 4 units
                    // FIXME: make this configurable!
                  , adjustFont = this._parameters.adjustFontUPCQuietZone || 1
                  , adjustedWidthModules = widthModules * adjustFont
                  ;
                advanceWidth = widthModules * unit;
                scale = this._getFontBelowScaleByWidth(widthModules) * adjustFont;
                // move back to center on y axis:
                y =  (widthModules - adjustedWidthModules) / 2 * unit;
            }

            transformation = new Transform()
                .translate(y, -(this.fontBelowHeight + this.fontBelowPadding))
                .scale(scale);
        }
        let [advanceWidth_, drawPointsFunc] = drawFromFont(
                  this.fontBelow, this.drawData.charCode, transformation);

        if(pen)
            drawPointsFunc(pen);

        return advanceWidth !== null ? advanceWidth : advanceWidth_;
    };

    _p.drawPoints = function(pen) {
        if(!this.drawsRawSymbol)
            throw new Error(`The glyph ${this.name} is marked as not drawing, `
                         +`yet it's drawPoints method is called.`);

        if(this.drawData.fromFont)
            return this._drawPointsFromFont(pen);

        // the default?
        if(Array.isArray(this.drawData)) {
            let advance = this._drawPointsFromPattern(pen);

            if(pen) {
                // add font below ...
                if(this.hasGroups('symbol', 'main') || this.hasGroups('symbol', 'ean8')) {
                    let name = `${this.name.slice(0, this.name.indexOf('.'))}.below`;
                    pen.addComponent(name, new Transform());
                }

                // add font above ...
                if(this.hasGroups('symbol', 'addOn')) {
                    let name = `${this.name.slice(0, this.name.indexOf('.'))}.below`
                      , unit = this._parameters.unit
                      , transformation =  new Transform().translate(0,
                            // Glyph is at -(this.fontBelowHeight
                            //                  + this.fontBelowPadding)
                            // it is moved up, so that it touches top:
                            // NOTE: there are no add-ons for ean-8 so there's
                            // no need to distinguish with this._parameters.topEAN8
                            this._parameters.top * unit + this.fontBelowPadding)
                      ;
                    pen.addComponent(name, transformation);
                }
            }
            return advance;
        }
        throw new Error(`Don't know how to draw the glyph ${this.name}.`);
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
        this._initGlyphs(name=>this.getGlyphByName(name), fontBelow);
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

        for(let glyph of this.glyphs) {
            if(!glyph.hasGroups(...groups)) continue;
            result.push(glyph);
        }

        return result;
    };

    _p._getFeatures = function() {
        var featureTag = 'calt'
          , feature = [
                '@numbers = [', this.getGlyphsByGroup('literal', 'number').map(g=>g.name).join(' '),'];\n'
              , '@numBelow = [', this.getGlyphsByGroup('below', 'number', 'default').map(g=>g.name).join(' '),'];\n'
              , '@setA = [', this.getGlyphsByGroup('symbol', 'setA', 'main').map(g=>g.name).join(' '),'];\n'
              , '@setB = [', this.getGlyphsByGroup('symbol', 'setB', 'main').map(g=>g.name).join(' '),'];\n'
              , '@setC = [', this.getGlyphsByGroup('symbol', 'setC', 'main').map(g=>g.name).join(' '),'];\n'
              , `
#########
## EAN 13

# substitute one to many to insert the stop/end guard symbol after
# the last number in ean 13
lookup ean13_stop {
    sub zero by zero guard.normal.triggerAddOn;
    sub one by one guard.normal.triggerAddOn;
    sub two by two guard.normal.triggerAddOn;
    sub three by three guard.normal.triggerAddOn;
    sub four by four guard.normal.triggerAddOn;
    sub five by five guard.normal.triggerAddOn;
    sub six by six guard.normal.triggerAddOn;
    sub seven by seven guard.normal.triggerAddOn;
    sub eight by eight guard.normal.triggerAddOn;
    sub nine by nine guard.normal.triggerAddOn;
}ean13_stop;

lookup upcA_stop {
`
, ...(function*(){
    for(let name of DIGITS)
        yield `    sub ${name} by .${name}.upcA.setC guard.normal.triggerAddOn ${name}.below.upcquietzone;` + '\n';

  })()
, `
}upcA_stop;

# substitute one to many to insert the stop/end guard symbol after
# the last number in ean 8, could reuse the lookup ean13_stop BUT
# EAN-13 has a special named version of guard.normal (guard.normal.triggerAddOn)
# to allow triggering the add ons which ean-8 doesn't support.
lookup ean8_stop {
    sub zero by zero guard.normal.ean8;
    sub one by one guard.normal.ean8;
    sub two by two guard.normal.ean8;
    sub three by three guard.normal.ean8;
    sub four by four guard.normal.ean8;
    sub five by five guard.normal.ean8;
    sub six by six guard.normal.ean8;
    sub seven by seven guard.normal.ean8;
    sub eight by eight guard.normal.ean8;
    sub nine by nine guard.normal.ean8;
}ean8_stop;

lookup upcE_stop {
`,...(function*(){
    for(let name of DIGITS)
      yield `    sub ${name} by guard.special ${name}.below.upcquietzone;` + '\n';
})()
,`}upcE_stop;

# In order to be able to distinguish which type of code we want to build
# we distinguish between a different number of input @numbers and initially
# mark them with the stop symbol at the right place. The following features
# and substitutions can pick up savely from there.
#
# Luckily most combinations can be decided without colisions. UPC-E is the
# exception, but that is be handled with a special marker anyways!
#     * E marks a full UPC-compatible(!) GTIN-12 as input
#     * e marks a short 7 digit input, the encoded numbers plus checksum.
# To ensure a UPC-E is indeed scannable using E is preferable, because
# it will not encode properly if it is incompatible!
#
#
#  Column AA: with explicit check sum
#  Column BB: if we would calculate the checksum (last digit) on the fly
#             input length could be reduced by 1. (But that's fairly complex.)
#
#  COMBINATIONS           AA   BB
# --------------------    --------
#  EAN-13 + addOn-5       18   17
#  UPC-A + addOn-5        17   16
#  (E + UPC-E + addOn-5   17   16)
#  EAN-13 + addOn-2       15   14
#  UPC-A + addOn-2        14   13
#  (E + UPC-E + addOn-2   14   13)
#  EAN-13                 13   12
#  UPC-A                  12   11
#  (E + UPC-E             12   11)
#  (e + UPC-E + addOn-5   12   impossible)
#  (e + UPC-E + addOn-2    9   impossible)
#  EAN-8                   8    7
#  (e + UPC-E              7   impossible)

feature ${featureTag} {
`, ...(function*(){
    var repeat = (str, l)=>{
        let res = [];
        for(let i=0; i<l; i++) res.push(str);
        return res.join('\n       ');
    };
    // EAN-13 + addOn-5
    yield `   sub ${repeat("@numbers'", 13)} lookup ean13_stop
       ${repeat('@numbers', 5)}
       ;` + '\n';

    // UPC-E + addOn-5 from suitable UPC-A
    // User needs to enter an "E" as a marker to request an upc-e code
    yield `   sub E.upce.marker'
       zero'
       ${repeat("@numbers'", 11)} lookup upcE_stop
       ${repeat('@numbers', 5)}
       ;` + '\n';
    // UPC-A + addOn-5
    yield `   sub ${repeat("@numbers'", 12)} lookup upcA_stop
       ${repeat('@numbers', 5)}
       ;` + '\n';
    // EAN-13 + addOn-2
    yield `   sub ${repeat("@numbers'", 13)} lookup ean13_stop
       ${repeat('@numbers', 2)}
       ;` + '\n';
    // UPC-E + addOn-2 from suitable UPC-A
    // User needs to enter an "E" as a marker to request an upc-e code
    yield `   sub E.upce.marker'
       zero'
       ${repeat("@numbers'", 11)} lookup upcE_stop
       ${repeat('@numbers', 2)}
       ;` + '\n';
    // UPC-A + addOn-2
    yield `   sub ${repeat("@numbers'", 12)} lookup upcA_stop
       ${repeat('@numbers', 2)}
       ;` + '\n';
    // EAN-13
    yield `   sub ${repeat("@numbers'", 13)} lookup ean13_stop
       ;` + '\n';
    // UPC-E from suitable UPC-A
    // User needs to enter an "E" as a marker to request an upc-e code
    yield `   sub E.upce.marker'
       zero'
       ${repeat("@numbers'", 11)} lookup upcE_stop
       ;` + '\n';
    // UPC-E + addOn-5 from short input:
    //          7 digits input, last digit is the checksum
    // User needs to enter an "e" as a marker to request an upc-e code.
    yield `   sub e.upce.marker
       ${repeat("@numbers'", 7)} lookup upcE_stop
       ${repeat('@numbers', 5)}
       ;` + '\n';
    // UPC-A
    yield `   sub ${repeat("@numbers'", 12)} lookup upcA_stop
       ;` + '\n';
    // UPC-E + addOn-2 from short input:
    //          7 digits input, last digit is the checksum
    // User needs to enter an "e" as a marker to request an upc-e code.
    yield `   sub e.upce.marker
       ${repeat("@numbers'", 7)} lookup upcE_stop
       ${repeat('@numbers', 2)}
       ;` + '\n';
    // EAN-8
    yield `   sub ${repeat("@numbers'", 8)} lookup ean8_stop
       ;` + '\n';
    // UPC-E + addOn-2 from short input:
    //          7 digits input, last digit is the checksum
    yield `   sub e.upce.marker
       ${repeat("@numbers'", 7)} lookup upcE_stop;
       ;` + '\n';
  })()
,`
}${featureTag};


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

feature ${featureTag} {
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
       guard.normal.triggerAddOn
       ;
}${featureTag};

# substitute one to many to insert the start guard symbol after
# the first number in ean 13 AND the human readable inital number,
# that has
lookup ean13_start {
    sub zero by zero.below guard.normal;
    sub one by one.below guard.normal;
    sub two by two.below guard.normal;
    sub three by three.below guard.normal;
    sub four by four.below guard.normal;
    sub five by five.below guard.normal;
    sub six by six.below guard.normal;
    sub seven by seven.below guard.normal;
    sub eight by eight.below guard.normal;
    sub nine by nine.below guard.normal;
}ean13_start;

feature ${featureTag} {
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
       guard.normal.triggerAddOn
       ;
}${featureTag};

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
feature ${featureTag}{
`, ...(function*(){
    let numbersets = ['AAAAAA', 'AABABB', 'AABBAB', 'AABBBA', 'ABAABB'
                    , 'ABBAAB', 'ABBBAA', 'ABABAB', 'ABABBA', 'ABBABA'];
    for(let i=0; i<10; i++) {
        let name=DIGITS[i]
          , numberset=numbersets[i]
          ;

        yield `   sub ${name}.below
       guard.normal
       @numbers' lookup ean13_set${numberset[0]}
       @numbers' lookup ean13_set${numberset[1]}
       @numbers' lookup ean13_set${numberset[2]}
       @numbers' lookup ean13_set${numberset[3]}
       @numbers' lookup ean13_set${numberset[4]}
       @numbers' lookup ean13_set${numberset[5]}
       guard.centre
       ;` + '\n';
    }
})()
,`}${featureTag};


# Right half of an EAN-13 barcode is all setC
feature ${featureTag} {
   sub guard.centre
       @numbers' lookup ean13_setC
       @numbers' lookup ean13_setC
       @numbers' lookup ean13_setC
       @numbers' lookup ean13_setC
       @numbers' lookup ean13_setC
       @numbers' lookup ean13_setC
       guard.normal.triggerAddOn
       ;
}${featureTag};

########
## UPC-A

# This is very similar to EAN-13 but it triggers at only 12 digits and
# the first six digits are always SET-A, exactly as EAN-13 when starting
# with a zero. Also, the layout is a bit different, as the first and last
# digit codes are like the guard patterns elongated and the digits are used
# outside of the code to establish the quiet zones.


@upcASetA = [${ this.getGlyphsByGroup('symbol', 'setA', 'upcA').map(g=>g.name).join(' ')}];
@upcASetC = [${ this.getGlyphsByGroup('symbol', 'setC', 'upcA').map(g=>g.name).join(' ')}];
@numBelowUpcquietzone = [${ this.getGlyphsByGroup('below', 'number', 'upcquietzone').map(g=>g.name).join(' ')}];

feature ${featureTag} {
   sub @numbers
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
       @upcASetC
       guard.normal.triggerAddOn
       @numBelowUpcquietzone
       ;
}${featureTag};


lookup upcA_start {
`
, ...(function*(){
    for(let name of DIGITS)
        yield `    sub ${name} by ${name}.below.upcquietzone guard.normal .${name}.upcA.setA;` + '\n';
  })()
, `
}upcA_start;

feature ${featureTag} {
   sub @numbers' lookup upcA_start
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
       @upcASetC
       guard.normal.triggerAddOn
       @numBelowUpcquietzone
       ;
}${featureTag};

# Left half of an UPC-A barcode is all set A
feature ${featureTag} {
   sub @numBelowUpcquietzone
       guard.normal
       @upcASetA
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setA
       @numbers' lookup ean13_setA
       guard.centre
       ;
}${featureTag};

# Right half of an UPC-A barcode is all setC
feature ${featureTag} {
   sub guard.centre
       @numbers' lookup ean13_setC
       @numbers' lookup ean13_setC
       @numbers' lookup ean13_setC
       @numbers' lookup ean13_setC
       @numbers' lookup ean13_setC
       @upcASetC
       guard.normal.triggerAddOn
       @numBelowUpcquietzone
       ;
}${featureTag};


########
## UPC-E

# Reduce UPC-3 long form to short form
# we know as glyph state:
#   E.upce.marker zero(D1) 10x@numbers(D2-D11) marker.special @numBelowUpcquietzone(D12:checksum)
# the result of the reduction will be:
#   E.upce.marker zero(D1) 6x@numbers(X1-D6) marker.special @numBelowUpcquietzone(D12:checksum)

@numNotZero = [ ${DIGITS.filter(name=>name !== 'zero').join(' ')} ];

lookup upcE_remove_four_zeros {
`,...(function*(){
    for(let name of DIGITS) {
        yield `    sub ${name} zero zero zero zero by ${name};` + '\n';
    }
})()
,`}upcE_remove_four_zeros ;

lookup upcE_remove_five_zeros {
`,...(function*(){
    for(let name of DIGITS) {
        yield `    sub ${name} zero zero zero zero zero by ${name};` + '\n';
    }
})()
,`}upcE_remove_five_zeros ;

`,...(function*(){
    for(let outerName of DIGITS.slice(0,5)){
        yield `lookup upcE_insert_${outerName}{` + '\n';
        for(let name of DIGITS)
            yield `    sub ${name} by ${name} ${outerName};` + '\n';
        yield `}upcE_insert_${outerName};` + '\n';
    }
})()
,`

lookup upcE_remove_single{
`,...(function*(){
    for(let name1 of DIGITS)
        for(let name2 of DIGITS)
            yield `    sub ${name1} ${name2} by ${name2};` + '\n';
    // special case!
    yield `    sub E.upce.marker zero by E.upce.marker;` + '\n';
})()
,`}upcE_remove_single;

lookup upcE_case3_switch {
`,...(function*(){
    for(let name1 of ['zero', 'one', 'two']) {
        for(let name2 of DIGITS) {
            if(name1 === name2) continue;
            yield `    sub ${name1}' lookup upcE_remove_single lookup upcE_insert_${name1} ${name2}';` + '\n';
        }
    }
})()
,`}upcE_case3_switch;

feature ${featureTag} {
# Rules for the reduction:
# CASE A
#   * D11 equals 5, 6, 7, 8, or 9
#   * and D7 to D10 inclusive are all 0
#   * and D6 is not 0
#   * Example:  E012345000058 => 123455
#   =>
#   * D7 to D10 are not encoded.
#   * Symbol character: X1 X2 X3 X4 X5 X6
#   * Data character:   D2 D3 D4 D5 D6 D11
    sub E.upce.marker zero
        @numbers @numbers @numbers @numbers
        @numNotZero' lookup upcE_remove_four_zeros zero' zero' zero' zero'
        [ five six seven eight nine ]
        guard.special
        ;
# CASE B
#   * D6 to D10 inclusive are all 0
#   * and D5 is not 0
#   * Example: E045670000080 => 456784
#   =>
#   * D6 to D10 are not encoded and X6 = 4.
#   * Symbol character: X1 X2 X3 X4 X5  X6
#   * Data character:   D2 D3 D4 D5 D11 4
    sub E.upce.marker zero
        @numbers @numbers @numbers
        @numNotZero' lookup upcE_remove_five_zeros zero'
        lookup upcE_insert_four
        zero' zero' zero' zero'
        @numbers'
        guard.special
        ;
# CASE C
#   * D4 is 0, 1, or 2
#   * and D5 to D8 inclusive are all 0
#   * Example: E034000005673 => 345670
#              E077200008889 (checksum not correct) => 778882
#   =>
#   * D5 to D8 are not encoded.
#   * Symbol character: X1 X2 X3 X4  X5  X6
#   * Data character:   D2 D3 D9 D10 D11 D4
    sub E.upce.marker zero
        @numbers @numbers [zero one two]'
        lookup upcE_remove_four_zeros
        # lookup upcE_case3_switch
        # after removing four we need to manipulate the positions that
        # have been occupied by zeros before, hence it appears that
        # we "upcE_case3_switch" with zeros, but it's defacto switching
        # with those positions where the zeros have been initially.
        lookup upcE_case3_switch
        zero' lookup upcE_case3_switch
        zero' lookup upcE_case3_switch
        zero' zero'
        @numbers' @numbers' @numbers'
        guard.special
        ;
# CASE D
#   * D4 is 3, 4, 5, 6, 7, 8, or 9
#   * and D5 to D9 inclusive are all 0
#   * Example: E098400000751 => 984753
#              E077700000889 (checksum not correct) => 777883
#   =>
#   * D5 to D9 are not encoded and X6 = 3
#   * Symbol character: X1 X2 X3 X4  X5  X6
#   * Data character:   D2 D3 D4 D10 D11 3
    sub E.upce.marker zero
        @numbers @numbers
        [three four five six seven eight nine]' lookup upcE_remove_five_zeros
        zero' zero' lookup upcE_insert_three
        zero' zero' zero'
        @numbers' @numbers'
        guard.special
        ;
}${featureTag};


# Now this unifies for short input and long input:

lookup upcE_start{
    sub e.upce.marker by zero.below.upcquietzone guard.normal;
    sub E.upce.marker by zero.below.upcquietzone guard.normal;
} upcE_start;

feature ${featureTag} {
  sub E.upce.marker' lookup upcE_remove_single lookup upcE_start  zero' @numbers @numbers @numbers @numbers @numbers @numbers guard.special;
  sub e.upce.marker' lookup upcE_start @numbers @numbers @numbers @numbers @numbers @numbers guard.special;
}${featureTag};


# variable parity mix of number sets A and B for
# the six symbol characters in UPC-E
feature ${featureTag}{
`, ...(function*(){
    let numbersets = ['BBBAAA', 'BBABAA', 'BBAABA' , 'BBAAAB', 'BABBAA'
                     ,'BAABBA', 'BAAABB', 'BABABA', 'BABAAB', 'BAABAB'];
    for(let i=0; i<10; i++) {
        let name=DIGITS[i]
          , numberset=numbersets[i]
          ;

        yield `   sub guard.normal
       @numbers' lookup ean13_set${numberset[0]}
       @numbers' lookup ean13_set${numberset[1]}
       @numbers' lookup ean13_set${numberset[2]}
       @numbers' lookup ean13_set${numberset[3]}
       @numbers' lookup ean13_set${numberset[4]}
       @numbers' lookup ean13_set${numberset[5]}
       guard.special
       ${name}.below.upcquietzone
       ;` + '\n';
    }
})()
,`}${featureTag};


########
## EAN-8

# substitute one to many to insert the centre guard symbol after the number
lookup ean8_insert_center {
    sub zero by zero guard.centre.ean8;
    sub one by one guard.centre.ean8;
    sub two by two guard.centre.ean8;
    sub three by three guard.centre.ean8;
    sub four by four guard.centre.ean8;
    sub five by five guard.centre.ean8;
    sub six by six guard.centre.ean8;
    sub seven by seven guard.centre.ean8;
    sub eight by eight guard.centre.ean8;
    sub nine by nine guard.centre.ean8;
}ean8_insert_center;

# substitute one to many to insert the centre guard symbol after
# the fourth number in ean 8
feature ${featureTag} {
   sub @numbers
       @numbers
       @numbers
       @numbers' lookup ean8_insert_center
       @numbers
       @numbers
       @numbers
       @numbers
       guard.normal.ean8
       ;
}${featureTag};

# substitute one to many to insert the start guard symbol before
# the first number in ean 8.
lookup ean8_start {
    sub zero by guard.normal.ean8 zero;
    sub one by guard.normal.ean8 one;
    sub two by guard.normal.ean8 two;
    sub three by guard.normal.ean8 three;
    sub four by guard.normal.ean8 four;
    sub five by guard.normal.ean8 five;
    sub six by guard.normal.ean8 six;
    sub seven by guard.normal.ean8 seven;
    sub eight by guard.normal.ean8 eight;
    sub nine by guard.normal.ean8 nine;
}ean8_start;

feature ${featureTag} {
   sub @numbers' lookup ean8_start
       @numbers
       @numbers
       @numbers
       guard.centre.ean8
       @numbers
       @numbers
       @numbers
       @numbers
       guard.normal.ean8
       ;
}${featureTag};

@ean8SetA = [${ this.getGlyphsByGroup('symbol', 'setA', 'ean8').map(g=>g.name).join(' ')}];
@ean8SetC = [${ this.getGlyphsByGroup('symbol', 'setC', 'ean8').map(g=>g.name).join(' ')}];

lookup ean8_setA{
    sub @numbers by @ean8SetA;
}ean8_setA;

lookup ean8_setC{
    sub @numbers by @ean8SetC;
}ean8_setC;

# Left half of an EAN-8 barcode is all setA
feature ${featureTag} {
   sub guard.normal.ean8
       @numbers' lookup ean8_setA
       @numbers' lookup ean8_setA
       @numbers' lookup ean8_setA
       @numbers' lookup ean8_setA
       guard.centre.ean8
       ;
}${featureTag};

# Right half of an EAN-8 barcode is all setC
feature ${featureTag} {
   sub guard.centre.ean8
       @numbers' lookup ean8_setC
       @numbers' lookup ean8_setC
       @numbers' lookup ean8_setC
       @numbers' lookup ean8_setC
       guard.normal.ean8
       ;
}${featureTag};


# Add ons
# NOTE: the five digit add-on should be triggered first, otherwise, the
# 2 didgit add on would "shadow" or negatively impair the 5 digit add-on
# lookup wise, this can start building after a @endTriggerAddOn was
# inserted, which is usually  the first thing we do for a barcode.


# We need a group that holds a special version of stop guard, that
# enables a two/five digit add on:
#   * "guard.normal" at the end of EAN-8 must not trigger the add ons
#   *  but "guard.normal" at the end of EAN-13, UPC-A must trigger it
#   *  as well as "guard.special" which ends only UPC-E.
# "guard.normal.triggerAddOn" is, despite of its name identical to
# "guard.normal" Also good, in this case is that having an explicit
# end-pattern that triggers the add-ons is very good to control.

@endTriggerAddOn = [${ this.getGlyphsByGroup('triggerAddOn').map(g=>g.name).join(' ') }];

lookup addOn_start_five {
    sub guard.normal.triggerAddOn by guard.normal.triggerAddOn addOn.guard.fiveDigit;
    sub guard.special by guard.special addOn.guard.fiveDigit;
    # UPC-A, UPC-E
    `,...(function*(){
    for(let name of DIGITS)
        yield `    sub ${name}.below.upcquietzone by ${name}.below.upcquietzone addOn.guard.fiveDigit;` + '\n';
})()
,`
}addOn_start_five;

lookup addOn_start_two {
    sub guard.normal.triggerAddOn by guard.normal.triggerAddOn addOn.guard.twoDigit;
    sub guard.special by guard.special addOn.guard.twoDigit;
    # UPC-A, UPC-E
`,...(function*(){
    for(let name of DIGITS)
        yield `    sub ${name}.below.upcquietzone by ${name}.below.upcquietzone addOn.guard.twoDigit;` + '\n';
})()
,`}addOn_start_two;

feature ${featureTag} {
  # five digit
  # UPC-A
  sub guard.normal.triggerAddOn'
      @numBelowUpcquietzone' lookup addOn_start_five
      @numbers
      @numbers
      @numbers
      @numbers
      @numbers
      ;
  # UPC-E
  sub guard.special'
      @numBelowUpcquietzone' lookup addOn_start_five
      @numbers
      @numbers
      @numbers
      @numbers
      @numbers
      ;
  # EAN-13
  sub @endTriggerAddOn' lookup addOn_start_five
      @numbers
      @numbers
      @numbers
      @numbers
      @numbers
      ;
  # two digit
  # UPC-A
  sub guard.normal.triggerAddOn'
      @numBelowUpcquietzone' lookup addOn_start_two
      @numbers
      @numbers
      ;
  # UPC-E
  sub guard.special'
      @numBelowUpcquietzone' lookup addOn_start_two
      @numbers
      @numbers
      ;
  # EAN-13
  sub @endTriggerAddOn' lookup addOn_start_two
      @numbers
      @numbers
      ;
}${featureTag};

@addOnSetA = [${ this.getGlyphsByGroup('symbol', 'setA', 'addOn').map(g=>g.name).join(' ')}];
@addOnSetB = [${ this.getGlyphsByGroup('symbol', 'setB', 'addOn').map(g=>g.name).join(' ')}];

# change a @numbers to @addOnSetA
lookup addOn_setA{
  sub @numbers by @addOnSetA;
}addOn_setA;

# change a @numbers to @addOnSetB
lookup addOn_setB{
  sub @numbers by @addOnSetB;
}addOn_setB;
`,
...(()=>{
  // since this doesn't work:
  //    sub @numbers by addOn.delineator @addOnSetA;
  function* makeSubs(setName) {
    for(let name of DIGITS)
      // sub one by addOn.delineator one.
      yield `    sub ${name} by addOn.delineator ${name}.addOn.${setName};` + '\n';
  }
  return [`
# change a @numbers to addOn.delineator @addOnSetA
lookup addOn_setA_right{
`,
  ...makeSubs('setA'),
`}addOn_setA_right;

# change a @numbers to addOn.delineator @addOnSetB
lookup addOn_setB_right{
`,
...makeSubs('setB'),
`}addOn_setB_right;`
  ];
})(),
`
# Multiple of 4 (00,04,08,..96)
lookup addOn_twoDigit_remainZero{
    sub @numbers' lookup addOn_setA
        @numbers' lookup addOn_setA_right
        ;
}addOn_twoDigit_remainZero;

# Multiple of 4+1 (01,05,..97)
lookup addOn_twoDigit_remainOne{
    sub @numbers' lookup addOn_setA
        @numbers' lookup addOn_setB_right
        ;
}addOn_twoDigit_remainOne;

# Multiple of 4+2 (02,06,..98)
lookup addOn_twoDigit_remainTwo{
    sub @numbers' lookup addOn_setB
        @numbers' lookup addOn_setA_right
        ;
}addOn_twoDigit_remainTwo;

# Multiple of 4+3 (03,07,..99)
lookup addOn_twoDigit_remainThree{
    sub @numbers' lookup addOn_setB
        @numbers' lookup addOn_setB_right
        ;
}addOn_twoDigit_remainThree;

feature ${featureTag} {
`,
// => this won't work!
// sub zero one by zero.set_A one.set_B

// => maybe this:

...(function*(){
    let lookups = [
          'addOn_twoDigit_remainZero',
          'addOn_twoDigit_remainOne',
          'addOn_twoDigit_remainTwo',
          'addOn_twoDigit_remainThree'
    ];
    for(let i=0, l=100; i<l; i++) {
        let lookup = lookups[i%4]
          , left = DIGITS[Math.floor(i/10)]
          , right = DIGITS[i % 10]
          ;

        //sub zero' one' lookup addOn_twoDigit_remainOne
        // sub zero' five' lookup addOn_twoDigit_remainOne
        yield `    sub addOn.guard.twoDigit ${left}' lookup ${lookup} ${right}';` + '\n';

    }
}()),
`}${featureTag};

# AddOn Five Digits
`,
(()=>{
    // returns an empty string, left here for documentation
    function getDigits(num_, padLen) {
        let num = Math.abs(Math.floor(num_))
          , digits = [...((num >= 10) ? getDigits(num/10) : []), num % 10]
          ;
        if(!padLen || digits.length >= padLen)
            return digits;
        let padding = [];
        for(let i=0, l=padLen-digits.length; i<l; i++)
            padding.push(0);
        return [...padding, ...digits];
    }
    // The original checksum calculation:
    function chksm(i) {
        let [d1, d2, d3, d4, d5] = getDigits(i, 5);
        return ((d1 + d3 + d5) * 3 + (d2 + d4) * 9) % 10;
    }
    // This is equivalent to chksm (verified it for i=0;i<=100000;i++),
    // but it uses only the least significant
    // digit for each calculation. Much easier to implement in GSUB!
    // Keeping it for documentation, it won't be called.
    function chksm2(i) {
        let [d1, d2, d3, d4, d5] = getDigits(i, 5)
          // only use the least significant digit of each calculation
          , d1_3 = (d1 + d3) % 10
          , d1_3_5 = (d1_3 + d5) % 10
          , d1_3_5x3 = (d1_3_5 * 3) % 10
          , d2_4 = (d2 + d4) % 10
          , d2_4x9 = (d2_4 * 9) % 10
          ;
        return (d1_3_5x3 + d2_4x9) % 10;
    }
    return '';
})()
,...(function*(){
    for(let name of DIGITS) {
      yield `
lookup result_${name} {
    # GSUB LookupType 2] Multiple substitution -> insert an additional number
    # as result after the guard
    sub addOn.guard.fiveDigit by addOn.guard.fiveDigit ${name}.below;
    # [GSUB LookupType 1] Single substitution -> replace an existing numBelow
    # with the result
    sub @numBelow by ${name}.below;
}result_${name};` + '\n';
    }


    // checksum calculation follows
    yield `
# using the below digits to store calculation results
feature ${featureTag}{
    # STEP 1 A: Sum the digits in Positions one and three, keep modulo 10.
    # inserts the result right after addOn.guard.fiveDigit
    # => addOn.guard.fiveDigit @numBelow[STEP 1 A] @numbers ...` + '\n';
    for(let i=0;i<10;i++) {
        for(let j=0;j<10;j++) {
            let d1 = DIGITS[i]
              , d2 = DIGITS[j]
              , r = DIGITS[(i + j) % 10]
              ;
            yield `    sub addOn.guard.fiveDigit' lookup result_${r} ${d1} @numbers ${d2};` + '\n';
        }
    }
    yield`}${featureTag};` + '\n';


    yield `
feature ${featureTag}{
    # STEP 1 B: Sum the digits in Positions STEP 1 A (one + three) and five, keep modulo 10.
    # => addOn.guard.fiveDigit @numBelow[STEP 1 B] @numbers ...` + '\n';
    for(let i=0;i<10;i++) {
        for(let j=0;j<10;j++) {
            let d1 = DIGITS[i]
              , d2 = DIGITS[j]
              , r = DIGITS[(i + j) % 10]
              ;
            yield `    sub addOn.guard.fiveDigit ${d1}.below' lookup result_${r} @numbers @numbers @numbers @numbers ${d2};` + '\n';
        }
    }
    yield`}${featureTag};` + '\n';


    yield `
feature ${featureTag}{
    # STEP 2: Multiply the result of STEP 1 by 3 keep modulo 10
    # => addOn.guard.fiveDigit @numBelow[STEP 2] @numbers ...` + '\n';
    for(let i=0;i<10;i++) {
        let d = DIGITS[i]
          , r = DIGITS[(i * 3) % 10]
          ;
        yield `    sub addOn.guard.fiveDigit ${d}.below' lookup result_${r};` + '\n';
    }
    yield`}${featureTag};` + '\n';


    yield `
feature ${featureTag}{
    # STEP 3: Sum Positions two and four keep modulo 10
    # inserts the result right after addOn.guard.fiveDigit
    # => addOn.guard.fiveDigit @numBelow[STEP 3] @numBelow[STEP 2] @numbers ...` + '\n';
    for(let i=0;i<10;i++) {
        for(let j=0;j<10;j++) {
            let d1 = DIGITS[i]
              , d2 = DIGITS[j]
              , r = DIGITS[(i + j) % 10]
              ;
            yield `    sub addOn.guard.fiveDigit' lookup result_${r} @numBelow @numbers ${d1} @numbers ${d2};` + '\n';
        }
    }
    yield`}${featureTag};` + '\n';

    yield `
feature ${featureTag}{
    # STEP 4: multiply the result of STEP 3 by 9 keep modulo 10
    # => addOn.guard.fiveDigit @numBelow[STEP 4] @numBelow[STEP 2] @numbers ...` + '\n';
    for(let i=0;i<10;i++) {
        let d = DIGITS[i]
          , r = DIGITS[(i * 9) % 10]
          ;
        yield `    sub addOn.guard.fiveDigit ${d}.below' lookup result_${r} @numBelow @numbers;` + '\n';
    }
    yield`}${featureTag};` + '\n';

    yield `
lookup fiveDigit_addOn_checksum{
    # STEP 5 and STEP 6 checksum!
    # Sum the results of steps 2 and 4 keep modulo 10
    # => addOn.guard.fiveDigit @numBelow[CHECKSUM] @numbers ...` + '\n';
    for(let i=0;i<10;i++) {
        for(let j=0;j<10;j++) {
            let d1 = DIGITS[i]
              , d2 = DIGITS[j]
              , r = DIGITS[(i + j) % 10]
              ;
            yield `    sub ${d1}.below ${d2}.below by ${r}.below;` + '\n';
        }
    }
    yield`}fiveDigit_addOn_checksum;` + '\n';

    yield `
feature ${featureTag} {
    # See STEP 5 above.
    # => addOn.guard.fiveDigit @numBelow[CHECKSUM] @numbers ...
    sub addOn.guard.fiveDigit @numBelow' lookup fiveDigit_addOn_checksum @numBelow';
}${featureTag};` + '\n';

    yield `
feature ${featureTag}{
    # encode the numbers with the right numbersets addOn_setA or addOn_setB` + '\n';
    let numbersets = ['BBAAA', 'BABAA', 'BAABA', 'BAAAB', 'ABBAA'
                    , 'AABBA', 'AAABB', 'ABABA', 'ABAAB', 'AABAB'];
    for(let i=0; i<10; i++) {
        let name=DIGITS[i]
          , numberset=numbersets[i]
          ;

        yield `    sub
        addOn.guard.fiveDigit
        ${name}.below
        @numbers' lookup addOn_set${numberset[0]}
        @numbers' lookup addOn_set${numberset[1]}
        @numbers' lookup addOn_set${numberset[2]}
        @numbers' lookup addOn_set${numberset[3]}
        @numbers' lookup addOn_set${numberset[4]}
        ;` + '\n';
    }
    yield`}${featureTag};` + '\n';
}())
,`

# clean up: remove the @numBelow[CHECKSUM] from the result
feature ${featureTag} {
  sub addOn.guard.fiveDigit @numBelow by addOn.guard.fiveDigit;
}${featureTag};


# finish the addon by inserting the delineator between all number symbols
lookup addOnNumbersAB_insert_delineator{
`, ...(function*(glyphs){
      // contains setA and setB addOn symbols
      for(let glyph of glyphs)
          yield `    sub ${glyph.name} by addOn.delineator ${glyph.name};` + '\n';
      }(this.getGlyphsByGroup('symbol', 'addOn')))
    ,`
}addOnNumbersAB_insert_delineator;

@addOnSetAB = [${ this.getGlyphsByGroup('symbol', 'addOn').map(g=>g.name).join(' ') }];

feature ${featureTag} {
    sub addOn.guard.fiveDigit
        @addOnSetAB
        @addOnSetAB
        @addOnSetAB
        @addOnSetAB
        @addOnSetAB' lookup addOnNumbersAB_insert_delineator
        ;
}${featureTag};

feature ${featureTag} {
    sub addOn.guard.fiveDigit
        @addOnSetAB
        @addOnSetAB
        @addOnSetAB
        @addOnSetAB' lookup addOnNumbersAB_insert_delineator
        addOn.delineator
        @addOnSetAB
        ;
}${featureTag};

feature ${featureTag} {
    sub addOn.guard.fiveDigit
        @addOnSetAB
        @addOnSetAB
        @addOnSetAB' lookup addOnNumbersAB_insert_delineator
        addOn.delineator
        @addOnSetAB
        addOn.delineator
        @addOnSetAB
        ;
}${featureTag};

feature ${featureTag} {
    sub addOn.guard.fiveDigit
        @addOnSetAB
        @addOnSetAB' lookup addOnNumbersAB_insert_delineator
        addOn.delineator
        @addOnSetAB
        addOn.delineator
        @addOnSetAB
        addOn.delineator
        @addOnSetAB
        ;
}${featureTag};
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
