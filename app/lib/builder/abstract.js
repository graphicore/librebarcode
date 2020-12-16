// jshint esversion:6
define([
    'LibreBarcode/errors'
  , 'LibreBarcode/validation'
  , 'Atem-Pen-Case/pens/AbstractPen'
  , 'Atem-Math-Tools/transform'
  , 'Atem-Pen-Case/pens/TransformPointPen'
], function(
    errors
  , validation
  , AbstractPen
  , transform
  , TransformPointPen
) {
    "use strict";

    var Transform = transform.Transform
      , KeyError = errors.Key
      ;

    // TODO: move this to Atem-Pen-Case
    var SegmentToPointPen = (function(Parent, errors) {

    var assert = errors.assert;

    // TODO:implement in Atem-Pen-Case
    function GuessSmoothPointPen(){
        throw new Error('GuessSmoothPointPen is not implemented.');
    }

    /**
     * Adapter class that converts the (Segment)Pen protocol to the
     * PointPen protocol.
     */
    function SegmentToPointPen(pointPen, guessSmooth) {
        Parent.call(this);
        if(guessSmooth)
            this.pen = new GuessSmoothPointPen(pointPen);
        else
            this.pen = pointPen;
        this.contour = null;
    }
    var _p = SegmentToPointPen.prototype = Object.create(Parent.prototype);
    _p.constructor = SegmentToPointPen;

    _p._flushContour = function() {
        var pen = this.pen, i,l, pt, segmentType;
        pen.beginPath();
        for(i=0,l=this.contour.length;i<l;i++) {
            pt = this.contour[i][0];
            segmentType = this.contour[i][1];
            pen.addPoint(pt, segmentType);
        }
        pen.endPath();
    };

    _p.moveTo = function(pt) {
        this.contour = [];
        this.contour.push([pt, 'move']);
    };

    _p.lineTo = function(pt) {
        this.contour.push([pt, 'line']);
    };

    _p.curveTo = function(/* *pts */) {
        var i,l,pt;
        for(i=0,l=arguments.length-1;i<l;i++) {
            pt = arguments[i];
            this.contour.push([pt, null]);
        }
        this.contour.push([arguments[arguments.length-1], 'curve']);
    };

    _p.qCurveTo = function(/* *pts */) {
        var i,l,pt;
        if(arguments[arguments.length-1] === null)
            this.contour = [];
        for(i=0,l=arguments.length-1;i<l;i++) {
            pt = arguments[i];
            this.contour.push([pt, null]);
        }
        if(arguments[arguments.length-1] !== null)
            this.contour.push([arguments[arguments.length-1], "qcurve"]);
    };

    _p.closePath = function() {
        var lastIndex = this.contour.length-1, pt, type;
        if(this.contour.length
                && this.contour[0][0][0] == this.contour[lastIndex][0][0]
                && this.contour[0][0][1] == this.contour[lastIndex][0][1]
        ) {
            this.contour[0] = this.contour[lastIndex];
            this.contour.pop();
        }
        else {
            // There's an implied line at the end, replace "move" with "line"
            // for the first point
            pt = this.contour[0][0];
            type = this.contour[0][1];
            if(type === 'move')
                this.contour[0] = [pt, 'line'];
        }
        this._flushContour();
        this.contour = null;
    };

    _p.endPath = function() {
        this._flushContour();
        this.contour = null;
    };

    _p.addComponent = function(glyphName, transform) {
        assert(this.contour === null, 'assertion: this.contour === null');
        this.pen.addComponent(glyphName, transform);
    };

    return SegmentToPointPen;

    })(AbstractPen, errors);

    function drawFromFont(font, charcode, transformation = null) {
        var glyph = font.glyphForCodePoint(charcode)
          , commands = glyph.path.commands
          , advanceWidth = transformation !== null
                // only interested in the x movement to determine the new advanceWidth
                ? transformation.transformPoint([glyph.advanceWidth, 0])[0]
                : glyph.advanceWidth
          ;
        return [advanceWidth, function drawPoints(pen) {
            let tpen = transformation !== null
                ? new TransformPointPen(pen, transformation)
                : pen
             , s2pPen = new SegmentToPointPen(tpen)
             ;
            // segments to point pen
            for(let i=0,l=commands.length;i<l;i++) {
                let command = commands[i].command
                  , args = commands[i].args
                  , points
                  ;
                switch (command) {
                  case 'closePath':
                    s2pPen.closePath();
                    break;
                  case 'moveTo':
                    s2pPen.moveTo(args.slice(0,2));
                    break;
                  case 'lineTo':
                    s2pPen.lineTo(args.slice(0,2));
                    break;
                  case 'quadraticCurveTo':
                    points = [];
                    args = args.slice();
                    while(args.length) {
                        points.push(args.slice(0,2));
                        args = args.slice(2);
                    }
                    s2pPen.qCurveTo.apply(s2pPen, points);
                    break;
                  case 'bezierCurveTo':
                    points  = [];
                    args = args.slice();
                    while(args.length) {
                        points.push(args.slice(0,2));
                        args = args.slice(2);
                    }
                    s2pPen.curveTo.apply(s2pPen, points);
                    break;
                  default:
                    throw new ValueError('Curve command "' +command+ '" unknown.');
                }
            }
        }];
    }

    var AbstractBarcodeGlyph = (function(errors) {

    var NotImplementedError = errors.NotImplemented;

    function AbstractBarcodeGlyph(parameters, name, targetChars, textBelowFlag) {
        this._parameters = parameters;
        this.name = name;
        // drawing can be skipped if this glyph is just using symbols
        // created by other glyphs
        this.drawsRawSymbol = true;
        this.components = [this];
        this.targetCharCodes = targetChars.map(char=>typeof char !== 'number'
                                                    ? char.charCodeAt(0)
                                                    : char
                                               );
        this.textBelowFlag = textBelowFlag;
    }

    var _p = AbstractBarcodeGlyph.prototype;

    _p.drawPoints = function(pen) {
        // jshint unused:vars
        throw new NotImplementedError('drawPoints');
    };

    // Can be overriden by subclass, used for composites with
    // charcodes in createComposites.
    _p.compositeCharcodeToGlyphName =function (charcode) {
        return charcode2name(charcode);
    };

    _p.createComposites = function* (withTextBelow) {
        // jshint unused:vars
        for(let charcode of this.targetCharCodes) {
            let name = this.compositeCharcodeToGlyphName(charcode)
              , unicodes = [charcode]
              , textBelowChars = String.fromCharCode(charcode)
              ;
            yield [name, unicodes, textBelowChars];
        }
    };

    return AbstractBarcodeGlyph;
    })(errors);

    function charcode2name (charcode) {
        // TODO: charcode2name is very missing
        // maybe later, use GlyphData.xml, or something with a similar
        // result but less implementation effort.
        // For now: use uniXXXX names, which is fine, since we don't
        // want to hand-edit these fonts.
        var hex = charcode.toString(16).toUpperCase()
          , padding = '0000'.slice(hex.length)
          ;
          return ['uni', padding, hex].join('');
    }

    var ValidationError = errors.Validation
      , validate = validation.validate
      , ValueError = errors.Value
      ;

    function AbstractBarcodeBuilder(fontInfo, fontBelow) {
        this.fontInfo = fontInfo;
        this.fontBelow = fontBelow;
        this.glyphs = [];
        this.parameters = null;
        this._char2Glyph = null;
        this._name2Glyph = null;
    }

    var _p = AbstractBarcodeBuilder.prototype;
    _p.constructor = AbstractBarcodeBuilder;
    _p._glyphData = null;
    _p._initGlyphs = function(...injectedArgs) {
        for(let args of this._glyphData) {
            let glyph = new this.BarcodeGlyphType(this.parameters, ...injectedArgs, ...args);
            this.glyphs.push(glyph);
        }
    };

    _p.getGlyphByName = function(name){
        // lazily create this._name2Glyph
        if(this._name2Glyph === null) {
            this._name2Glyph = new Map();
            for(let glyph of this.glyphs) {
                if (this._name2Glyph.has(glyph.name))
                    throw new KeyError(`${glyph.name} already defined.`);
                this._name2Glyph.set(glyph.name, glyph);
            }
        }
        if(!this._name2Glyph.has(name))
            throw new KeyError(`Glyph "${name}" not found in ${this.constructor.name}`);
        return this._name2Glyph.get(name);
    };

    _p.getGlyphByChar = function(char) {
        var _char;

        // lazily create this._char2Glyph
        if(this._char2Glyph === null) {
            this._char2Glyph = new Map();
            for(let glyph of this.glyphs)
                for (let charCode of glyph.targetCharCodes) {
                    let char = String.fromCharCode(charCode);
                    if (this._char2Glyph.has(char))
                        throw new KeyError(`${glyph.name} defines a char `
                            + `"${char}" that is already registered  by glyph `
                            + `${this._char2Glyph.get(char).name}.`);
                    this._char2Glyph.set(char, glyph);
                }
        }

        _char = typeof char === 'number'
                          ? String.fromCharCode(char)
                          : char
                          ;

        if(!this._char2Glyph.has(_char))
          throw new KeyError('Char "'+_char+'" not found in ' + this.constructor.name);
        return this._char2Glyph.get(_char);
    };

    _p.BarcodeGlyphType = AbstractBarcodeGlyph;

    _p._penAddComponent = function (pen, name, transformation) {
        pen.addComponent( name, transformation || new Transform()/* === identity*/);
    };

    _p._writeGlyph = function(glyphSet, name, glifData, drawPointsFunc) {
        glyphSet.writeGlyph(false, name, glifData, drawPointsFunc
                             , undefined // formatVersion
                             , {precision: -1} // make precision configurable?
                             );

    };

    _p._drawGlyphFromFont = function(glyphSet, font, charcode, name
                                                        , transformation) {
        var [advanceWidth, drawPointsFunc] = drawFromFont(font, charcode, transformation)
          , glifData = {
                unicodes: []
              , width: advanceWidth
            }
          ;
        this._writeGlyph(glyphSet, name, glifData, drawPointsFunc);
        return {name: name, advanceWidth: advanceWidth};
    };

    _p._drawFontBelowGlyph = function(pen, fontBelow, glyphSet, charcode) {
        var glyph
            // Using height to calculate the scale is good, because
            // it creates the same scaling for all of the font.
            // This results in the new height fitting into fontBelowHeight
            // units after scaling.
          , height = fontBelow['OS/2'].typoAscender
                            - fontBelow['OS/2'].typoDescender
          , scale = this.parameters.fontBelowHeight / height
            // Make the skaling transformation and also changing
            // the advance width earlier, directly in the original drawing
            // (did use only the transformation of the component earlier),
            // otherwise, very huge fonts will screw the calculations
            // of average glyph width and such.
          , transformation = new Transform().scale(scale)
          , name = 'below.' + charcode2name(charcode)
          ;
        glyph = this._drawGlyphFromFont(glyphSet, fontBelow, charcode
                                       , name, transformation);
        return [glyph, scale];
    };

    // This makes the actually used glyphs
    _p._makeComposite = function(glyphSet, fromGlyph, fontBelow
                                      , name, unicodes, textBelowChars) {
        // if more than one components are given they are drawn directly
        // next to each other.
        var components = fromGlyph.components
          , glifData = {
                unicodes: unicodes
              , width: fromGlyph.width
            }
          , drawPointsFunc = pen=>{
                // jshint: validthis: true
                var advance=0;
                for(let component of components) {
                    let transform = new Transform().translate(advance, 0);
                    this._penAddComponent(pen, component.name, transform);
                    advance += component.width;
                }

                if(!fontBelow) return;

                for(let i=0, l=textBelowChars.length;i<l;i++) {
                    let charcode = textBelowChars.charCodeAt(i)
                      , width = glifData.width / l
                      , xOffset = i * width
                      ;
                    if(!fontBelow.hasGlyphForCodePoint(charcode)) {
                        console.warn(`In glyph ${name}: skipping missing `
                                    + `font-below glyph ${textBelowChars[i]}.`);
                        continue;
                    }
                    let [belowGlyph, scale] = this._drawFontBelowGlyph(
                                        pen, fontBelow, glyphSet, charcode)
                      , transformation = new Transform()
                            .translate(
                                    // center using advance width, so the spacing
                                    // of the giving font still has some influence
                                    // which is rather good.
                                    xOffset + (width - belowGlyph.advanceWidth) / 2
                                    // move down just the amount of the ascender
                                    // that is still left.
                                , -fontBelow['OS/2'].typoAscender * scale
                            );
                    this._penAddComponent(pen, belowGlyph.name, transformation);
                }
            }
          ;

        this._writeGlyph(glyphSet, name, glifData, drawPointsFunc);
    };

    _p.addNotdef = function(glyphSet, fontinfo) {
        var width = Math.round(fontinfo.unitsPerEm * 0.5)
          , ascender = fontinfo.ascender
          , descender = fontinfo.descender
          , unitsPerEm = fontinfo.unitsPerEm
          , glifData = {
                unicodes: []
              , width: width
            }
          ;

        function drawNotdef (pen) {
            var stroke = Math.round(unitsPerEm * 0.05)
              , xMin = stroke
              , xMax = width - stroke
              , yMax = ascender
              , yMin = descender
              ;
            pen.beginPath();
            pen.addPoint([xMin, yMin], 'line');
            pen.addPoint([xMin, yMax], 'line');
            pen.addPoint([xMax, yMax], 'line');
            pen.addPoint([xMax, yMin], 'line');
            pen.endPath();

            xMin += stroke;
            xMax -= stroke;
            yMax -= stroke;
            yMin += stroke;

            pen.beginPath();
            pen.addPoint([xMin, yMin], 'line');
            pen.addPoint([xMax, yMin], 'line');
            pen.addPoint([xMax, yMax], 'line');
            pen.addPoint([xMin, yMax], 'line');
            pen.endPath();
        }

        this._writeGlyph(glyphSet, '.notdef', glifData, drawNotdef);
    };

    _p.drawEmptyMandatoryGlyphs = function(glyphSet, names) {
        var glyphs = [
           {
                name: 'NULL'
              , glifData: {
                    unicodes:[0x0000]
                  , width: 0
                }
            }
          , {
                name: 'CR'
              , glifData: {
                    unicodes:[0x000D]
                  , width: 0
                }
            }
          , {
                // Unicode Character 'ZERO WIDTH SPACE' (U+200B)
                name: 'zwspace'
              , glifData: {
                    unicodes:[0x200B]
                  , width: 0
                }
            }
          , {
                // Unicode Character 'ZERO WIDTH NON-JOINER' (U+200C)
                name: 'zwnj'
              , glifData: {
                    unicodes:[0x200C]
                  , width: 0
                }
            }
          , {
                name: 'nbspace'
              , noblock: true
              , prodName: 'uni00A0'
              , glifData: {
                    unicodes:[0x00A0]
                    // same width as space
                    // TODO: there should be a "this.getSpaceWidth" method
                    // that can be overriden ...
                  , width: this.getGlyphByChar(' ').width
                }
            }
          ]
          , i, l
          ;

        function draw(){}
        for(i=0,l=glyphs.length;i<l;i++) {
            // If names is defined it must be a set, acting as a whitelist
            // for glyphs to be added.
            if(names && !glyphs[i].noblock && !names.has(glyphs[i].name))
                continue;
            this._writeGlyph(glyphSet
                           , glyphs[i].prodName || glyphs[i].name
                           , glyphs[i].glifData
                           , draw);
        }
    };
    _p.drawRawSymbols = function(glyphSet) {
        for(let glyph of this.glyphs) {
            if(!glyph.drawsRawSymbol) continue;
            this._writeGlyph(glyphSet, glyph.name, glyph.glifData
                                     , glyph.drawPoints.bind(glyph));
        }
    };

    _p.addCompositeGlyphs = function(glyphSet, fontBelow) {
        for(let glyph of this.glyphs) {
            for(let [name, unicodes, textBelowChars] of glyph.createComposites(!!fontBelow)) {
                this._makeComposite(glyphSet, glyph
                            , glyph.textBelowFlag ? fontBelow : undefined
                            , name, unicodes, textBelowChars);
            }
        }
    };

    // This is the central function
    _p.populateGlyphSet = function(glyphSet) {
        this.drawRawSymbols(glyphSet, this.fontBelow);
        // now create all the composite glyphs
        this.addCompositeGlyphs(glyphSet, this.fontBelow);
        this.addNotdef(glyphSet, this.fontInfo);
        this.drawEmptyMandatoryGlyphs(glyphSet);
    };

    _p.getFeatures = function() {
        // pass; override if needed
    };

    _p._defaultParameters = {
        // At the momemnt generic to all barcode fonts:
        force: false // ignore validation problems and just run
      , bottom: 0
      , top: 590
      , fontBelowHeight: 390
    };

    _p._validators = [
        function checkBottom(params) {
            validation.validateNumber('bottom', params.bottom);
        }
      , function checkTop(params) {
            validation.validateNumber('top', params.top);
            if(params.top <= params.bottom)
                throw new ValidationError('"top" must be bigger than bottom.');
        }
      , function checkFontBelowHeight(params) {
            validation.validatePositiveNumber('fontBelowHeight', params.fontBelowHeight);
        }
    ];

    _p._validateParameters = function(userParameters) {
        return validate.call(this, this._validators, this._defaultParameters, userParameters);
    };

    _p.reportParameters = function(logger, userParameters) {
        var i, l, keys, key, value, notes;
        keys = [];
        for(key in this.parameters)
            keys.push(key);
        keys.sort();
        logger = logger || console;
        logger.log('Got following parameters for ' + this.constructor.name + ':');
        for(i=0,l=keys.length;i<l;i++) {
            key = keys[i];
            value = this.parameters[key];
            notes = [];
            if(key in this._defaultParameters
                                && this._defaultParameters[key] === value)
                notes.push('default');
            if(userParameters && key in userParameters)
                notes.push('explicit');

            logger.log('  ' + key + ':'
                                , value
                                + (notes.length ? ' (' + notes.join(', ') + ')' : ''));
        }
    };

    return {
        BarcodeBuilder: AbstractBarcodeBuilder
      , BarcodeGlyph: AbstractBarcodeGlyph
      , charcode2name: charcode2name
      , drawFromFont: drawFromFont
      , Transform: Transform
    };
});
