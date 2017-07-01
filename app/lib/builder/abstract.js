define([
    'Atem-Errors/errors'
], function(
    errors
){
    "use strict";

    var AbstractBarcodeGlyph = (function(errors) {

    var NotImplementedError = errors.NotImplemented;

    function AbstractBarcodeGlyph(name, targetChars) {
        this.name = name;
        this.targetCharCodes = targetChars.map(
                        function(char){ return char.charCodeAt(0);});
        this._parameters = null;
    }

    var _p = AbstractBarcodeGlyph.prototype;

    _p.setParameters = function(params) {
        this._parameters = params;
    };

    _p.drawPoints = function(parameters, pen) {
        // jshint unused:vars
        throw new NotImplementedError('drawPoints');
    };

    return AbstractBarcodeGlyph;
    })(errors);


    function AbstractBarcodeBuilder(){
        this.glyphs = [];
        // the first argument passed to the glyphs drawPoints method
        this.parameters = null;
    }

    var _p = AbstractBarcodeBuilder.prototype;
    _p.constructor = AbstractBarcodeBuilder;
    _p._glyphData = null;
    _p._initGlyphs = function() {
        var i, l, glyph;
        for(i=0,l=this._glyphData.length;i<l;i++) {
            glyph = Object.create(this.BarcodeGlyphType.prototype);
            this.BarcodeGlyphType.apply(glyph, this._glyphData[i]);
            this.glyphs.push(glyph);
        }
    };

    _p.BarcodeGlyphType = AbstractBarcodeGlyph;

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

    return {
        BarcodeBuilder: AbstractBarcodeBuilder
      , BarcodeGlyph: AbstractBarcodeGlyph
    };
});
