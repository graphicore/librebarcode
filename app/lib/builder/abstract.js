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

    var AbstractBarcodeGlyph = (function(errors) {

    var NotImplementedError = errors.NotImplemented;

    function AbstractBarcodeGlyph(name, targetChars, textBelowFlag) {
        this.name = name;
        this.targetCharCodes = targetChars.map(
                        function(char){ return typeof char !== 'number'
                                            ? char.charCodeAt(0)
                                            : char
                                            ;
                        });
        this._parameters = null;
        this.textBelowFlag = textBelowFlag;
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

    function AbstractBarcodeBuilder() {
        this.glyphs = [];
        // the first argument passed to the glyphs drawPoints method
        this.parameters = null;
        this._char2Glyph = null;
    }

    var _p = AbstractBarcodeBuilder.prototype;
    _p.constructor = AbstractBarcodeBuilder;
    _p._glyphData = null;
    _p._initGlyphs = function(genericExtraArgs) {
        var i, l, glyph, args;
        for(i=0,l=this._glyphData.length;i<l;i++) {
            glyph = Object.create(this.BarcodeGlyphType.prototype);
            args = [];
            if(genericExtraArgs)
                Array.prototype.push.apply(args, genericExtraArgs);
            Array.prototype.push.apply(args, this._glyphData[i]);
            this.BarcodeGlyphType.apply(glyph, args);
            glyph.setParameters(this.parameters);
            this.glyphs.push(glyph);
        }
    };

    _p.getGlyphByChar = function(char) {
        var i, l, glyph, _char, registerCharcodes;

        if(this._char2Glyph === null) {
            this._char2Glyph = Object.create(null);
            registerCharcodes = function (char2Glyph, glyph, charCode) {
                char2Glyph[String.fromCharCode(charCode)] = glyph;
            };
            for(i=0,l=this.glyphs.length;i<l;i++) {
                glyph = this.glyphs[i];
                glyph.targetCharCodes.forEach(
                    registerCharcodes.bind(null, this._char2Glyph, glyph));
            }
        }

        _char = typeof char === 'number'
                          ? String.fromCharCode(char)
                          : char
                          ;

        if(!(_char in this._char2Glyph))
          throw new KeyError('Char "'+_char+'" not found in ' + this.constructor.name);
        return this._char2Glyph[_char];
    };

    _p.BarcodeGlyphType = AbstractBarcodeGlyph;

    _p._drawAddComponent = function (name, transformation, pen) {
        pen.addComponent( name, transformation || [1, 0, 0, 1, 0, 0] );
    };

    _p._writeGlyph = function(glyphSet, name, glifData, drawPointsFunc) {
        glyphSet.writeGlyph(false, name, glifData, drawPointsFunc
                             , undefined // formatVersion
                             , {precision: -1} // make precision configurable?
                             );

    };

    _p._makeGlyphBelowComponent = function(glyphSet, fontBelow, charcode
                                                        , transformation) {
        var glyph = fontBelow.glyphForCodePoint(charcode)
          , name = 'below.' + charcode2name(charcode)
            // only interested in the x movement to determine the new advanceWidth
          , advanceWidth = transformation.transformPoint([glyph.advanceWidth, 0])[0]
          , glifData = {
                unicodes: []
              , width: advanceWidth
            }
          ;
        function drawPointsFunc(pen) {
            var commands = glyph.path.commands
              , tpen = new TransformPointPen(pen, transformation)
              , s2pPen = new SegmentToPointPen(tpen)
              , i, l, command, args, points
              ;

            // segments to point pen
            for(i=0,l=commands.length;i<l;i++) {
                command = commands[i].command;
                args = commands[i].args;
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
                    points  = [];
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
        }

        this._writeGlyph(glyphSet, name, glifData, drawPointsFunc);
        return {name: name, advanceWidth: advanceWidth};
    };

    _p._addFontBelowComponent = function(pen, fontBelow, glyphSet, charcode
                                               , componentWidth, xoffset) {
        var glyph, height, scale, transformation;
        // Using height to calculate the scale is good, because
        // it creates the same scaling for all of the font.
        // This results in the new height fitting into fontBelowHeight
        // units after scaling.
        height = fontBelow['OS/2'].typoAscender
                            - fontBelow['OS/2'].typoDescender;
        scale = this.parameters.fontBelowHeight / height;

        // Make the skaling transformation and also changing
        // the advance width earlier, directly in the original drawing
        // (did use only the transformation of the component earlier),
        // otherwise, very huge fonts will screw the calculations
        // of average glyph width and such.
        transformation = new Transform().scale(scale);
        glyph = this._makeGlyphBelowComponent(glyphSet, fontBelow
                                            , charcode, transformation);


        transformation = new Transform()
                .translate(
                        // center using advance width, so the spacing
                        // of the giving font still has some influence
                        // which is rather good.
                        xoffset + (componentWidth - glyph.advanceWidth) / 2
                        // move down just the amount of the ascender
                        // that is still left.
                      , -fontBelow['OS/2'].typoAscender * scale
                );

        this._drawAddComponent(glyph.name, transformation, pen);
    };

    _p._makeComponent = function(glyphSet, fromGlyph, fontBelow, charcode) {
        // if more than one components are given they are drawn directly
        // next to each other.
        var name = charcode2name(charcode)
          , components = fromGlyph.components || [fromGlyph]
          , glifData = {
                unicodes: [charcode]
              , width: fromGlyph.width
            }
          , drawPointsFunc = function(components, pen) {
                // jshint: validthis: true
                var i, l, advance=0, component, transform;
                for(i=0,l=components.length;i<l;i++) {
                    component = components[i];
                    transform = new Transform().translate(advance, 0);
                    this._drawAddComponent(component.name, transform, pen);
                    advance += component.width;
                }
                if(!fontBelow || !fontBelow.hasGlyphForCodePoint(charcode))
                    return;
                this._addFontBelowComponent(pen, fontBelow, glyphSet
                                             , charcode, glifData.width, 0);
            }.bind(this, components)
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
                name: 'CR'
              , glifData: {
                    unicodes:[0x200B]
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

    _p._drawPointsFunc = function(glyphSet, fontBelow, glyph, pen) {
        glyph.drawPoints(pen);
        if(fontBelow && typeof(glyph.textBelowFlag) === "string") {
            var i, l;
            for(i=0,l=glyph.textBelowFlag.length;i<l;i++) {
                var charcode = glyph.textBelowFlag.charCodeAt(i)
                  , width = glyph.width / 2
                  , offset = i * width
                  ;
                if(fontBelow.hasGlyphForCodePoint(charcode)) {
                    this._addFontBelowComponent(pen, fontBelow
                        , glyphSet, charcode, width, offset);
                }
            }
        }
    };

    _p.drawGlyphs = function(glyphSet, fontBelow) {
        var i, l, glyph, drawPointsFunc;
        for(i=0,l=this.glyphs.length;i<l;i++) {
            glyph = this.glyphs[i];
            if(typeof(glyph.textBelowFlag) === "string" && !fontBelow)
                continue;

            drawPointsFunc = this._drawPointsFunc.bind(this
                                            , glyphSet, fontBelow, glyph);
            this._writeGlyph(glyphSet, glyph.name, glyph.glifData, drawPointsFunc);
        }
    };

    _p.addComponents = function(glyphSet, fontBelow) {
        var i, l, glyph;
        for(i=0,l=this.glyphs.length;i<l;i++) {
            glyph = this.glyphs[i];
            glyph.targetCharCodes
                .forEach(this._makeComponent.bind(this, glyphSet, glyph
                            , glyph.textBelowFlag ? fontBelow : undefined));
        }
    };

    _p.populateGlyphSet = function(glyphSet, fontBelow, fontinfo) {
        this.drawGlyphs(glyphSet, fontBelow);
        // now create all the compound glyphs
        this.addComponents(glyphSet, fontBelow);
        this.addNotdef(glyphSet, fontinfo);
        this.drawEmptyMandatoryGlyphs(glyphSet);
    };

    _p.getFeatures = function(fontBelow) {
        // jshint unused:vars
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
    };
});
