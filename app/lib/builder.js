define([
    'yaml'
  , 'ufojs/ufoLib/UFOWriter'
  , 'Atem-Errors/errors'
], function(
    yaml
  , UFOWriter
  , errors
){
    "use strict";

    var BarcodeGlyph = (function(errors) {

    var NotImplementedError = errors.NotImplemented;

    function BarcodeGlyph(name, targetChars) {
        this.name = name;
        this.targetCharCodes = targetChars.map(
                        function(char){ return char.charCodeAt(0);});
        this._parameters = null;
    }

    var _p = BarcodeGlyph.prototype;

    _p.setParameters = function(params) {
        this._parameters = params;
    };

    _p.drawPoints = function(parameters, pen) {
        // jshint unused:vars
        throw new NotImplementedError('drawPoints');
    };

    return BarcodeGlyph;
    })(errors);

    ////////////////////////////////////////////////////////

    var Code39Glyph = (function(Parent) {
    // "use strict";
    function Code39Glyph(value, pattern, name, targetCharCodes) {
        Parent.call(this,  name, targetCharCodes);
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
    })(BarcodeGlyph);

    ////////////////////////////////////////////////////////

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
    })(BarcodeGlyph);

    ////////////////////////////////////////////////////////

    var BarcodeBuilder = (function(BarcodeGlyph) {
    function BarcodeBuilder(){
        this.glyphs = [];
        // the first argument passed to the glyphs drawPoints method
        this.parameters = null;
    }

    var _p = BarcodeBuilder.prototype;
    _p.constructor = BarcodeBuilder;
    _p._glyphData = null;
    _p._initGlyphs = function() {
        var i, l, glyph;
        for(i=0,l=this._glyphData.length;i<l;i++) {
            glyph = Object.create(this.BarcodeGlyphType.prototype);
            this.BarcodeGlyphType.apply(glyph, this._glyphData[i]);
            this.glyphs.push(glyph);
        }
    };

    _p.BarcodeGlyphType = BarcodeGlyph;

    _p._charcode2name = function (charcode) {
        // FIXME: charcode2name is very much missing
        // maybe later, use GlyphData.xml, or something with a similar
        // result but less implementation effort.
        // for now: use uniXXXX names
        var hex = charcode.toString(16).toUpperCase()
          , padding = '0000'.slice(hex.length)
          ;
          return ['uni', padding, hex].join('');
    };

    _p._drawAddComponent = function (name, pen) {
        pen.addComponent( name, [1, 0, 0, 1, 0, 0] );
    };

    _p._makeComponent = function (glyphSet, component, charcode) {
        var name = this._charcode2name(charcode)
          , glifData = {
                unicodes: [charcode]
              , width: component.width
            }
          , drawPointsFunc = this._drawAddComponent.bind(this, component.name)
          ;
        glyphSet.writeGlyph(false, name, glifData, drawPointsFunc
                             , undefined // formatVersion
                             , {precision: -1} // make precision configurable?
                             );
    };

    _p.populateGlyphSet = function(glyphSet) {
        var i, l, glyph, drawPointsFunc;
        for(i=0,l=this.glyphs.length;i<l;i++) {
            glyph = this.glyphs[i];

            glyph.setParameters(this.parameters);

            drawPointsFunc = glyph.drawPoints.bind(glyph);
            glyphSet.writeGlyph(false, glyph.name, glyph.glifData
                             , drawPointsFunc
                             , undefined // formatVersion
                             , {precision: -1} // make precision configurable?
                             );

            // now create all the compound glyphs
            glyph.targetCharCodes
                .forEach(this._makeComponent.bind(this, glyphSet, glyph));
        }
    };

    return BarcodeBuilder;
    })(BarcodeGlyph);

    ////////////////////////////////////////////////////////

    var Code39Builder  = (function(Parent, Code39Glyph) {
    // data/code_128.yaml
    // we expect these files to be in a good condition and skip sanity tests
    // here. unittests of our endproduct should reveal errors, i.e.
    // encode each available symbol in a barcode, make an image, scan that
    // it'll likely be better to just inline the data
    // TODO:
    var fs = require('fs')
      , data = yaml.safeLoad(fs.readFileSync('app/lib/barcodesData/code_39.yaml', 'utf8'))
      ;
    function Code39Builder() {
        Parent.call(this);
        this._initGlyphs();
        this.parameters = {
            narrow: 30
          , wide: 90
          , bottom: 0
          , top: 500
        };
    }

    var _p = Code39Builder.prototype = Object.create(Parent.prototype);
    _p.constructor = Code39Builder;

    _p._glyphData = data.glyphs;
    _p.BarcodeGlyphType = Code39Glyph;

    return Code39Builder;
    })(BarcodeBuilder, Code39Glyph);

    ////////////////////////////////////////////////////////

    var Code128Builder  = (function(Parent, Code128Glyph) {
    // data/code_128.yaml
    // we expect these files to be in a good condition and skip sanity tests
    // here. unittests of our endproduct should reveal errors, i.e.
    // encode each available symbol in a barcode, make an image, scan that
    // it'll likely be better to just inline the data
    // TODO:
    var fs = require('fs')
      , data = yaml.safeLoad(fs.readFileSync('app/lib/barcodesData/code_128.yaml', 'utf8'))
      ;
    function Code128Builder() {
        Parent.call(this);
        this._initGlyphs();
        this.parameters = {
            unit: 30
          , bottom: 0
          , top: 500
        };
    }

    var _p = Code128Builder.prototype = Object.create(Parent.prototype);
    _p.constructor = Code128Builder;

    _p._glyphData = data.glyphs;
    _p.BarcodeGlyphType = Code128Glyph;

    return Code128Builder;
    })(BarcodeBuilder, Code128Glyph);

    ////////////////////////////

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
