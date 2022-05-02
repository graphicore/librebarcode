/* jshint browser: true, esversion: 6*/
import getEncodeFallback from '../../app/lib/ean13Encoder/fallback.mjs';
import encodeCompatible from '../../app/lib/ean13Encoder/compatible.mjs';
import addWebfont from './addWebfont.mjs';

/**
 *  Just like Pythons zip.
 */
function* zip(...arrays) {
    let len = Math.min(...arrays.map(a=>a.length));
    for(let i=0;i<len;i++)
        yield arrays.map(a=>a[i]); // jshint ignore:line
}

function _prepareInput(raw) {
    let pre = '', codes = [], joins = []
     , codeExp = /[xX\-]?[\d]+\??[\d]*/g
     , cursor = 0
     ;
    for(let match of raw.matchAll(codeExp)) {
        joins.push(raw.slice(cursor, match.index));
        codes.push(match[0]);
        cursor = match.index + match[0].length;
    }
    joins.push(raw.slice(cursor, raw.length));
    pre = joins.shift();
    return {pre, codes, joins};
}

function Estr(str) {
    this._val = str;
}
Estr.prototype.toString = function(){ return `(${this._val})`;};
Estr.prototype.valueOf = function(){ return this._val;};

function _eanElem(doc, str) {
    let isError = str instanceof Estr
      , elem = doc.createElement(isError ? 'strong' : 'span')
      ;
    elem.textContent = str.valueOf();
    elem.classList.add(isError ? 'error' : 'ean13');
    return elem;
}

function flatten(items, joins, pre) {
    return Array.from(zip(items, joins))
                .reduce((accum, item)=>[...accum, ...item], pre || []);
}


function empty(elem) {
    while(elem.lastChild) elem.lastChild.remove();
}

function render(elem, items, joins, pre) {
    empty(elem);
    elem.append(...flatten(items, joins, pre));
}

function encode(encoder, inputs) {
    return inputs.map(code=>{
        try {
            return encoder(code);
        }
        catch(e) {
            return new Estr(e);
        }
    });
}

function initBulkEncoder(encodeFallback, elem) {
    let doc = elem.ownerDocument
      , inputElement = elem.querySelector('.ean13_bulk-input')
      , outputElementFallback = elem.querySelector('.ean13_bulk-output_fallback')
      , outputElementCompatible = elem.querySelector('.ean13_bulk-output_compatible')
      , inputRender = elem.querySelector('.ean13_bulk-input_render')
      , fallbackRender = elem.querySelector('.ean13_bulk-output_fallback_render')
      , compatibleRender= elem.querySelector('.ean13_bulk-output_compatible_render')
      , eanElem = _eanElem.bind(null, doc)
      ;

    inputElement.addEventListener('input', (evt)=>{
        let raw = evt.target.value
          , input = _prepareInput(raw)
          , fallbacks, compatibles
          ;
        fallbacks = encode(encodeFallback, input.codes);
        compatibles = encode(encodeCompatible, input.codes);

        outputElementFallback.value = flatten(fallbacks, input.joins, [input.pre]).join('');
        outputElementCompatible.value = flatten(compatibles, input.joins, [input.pre]).join('');
        render(inputRender, input.codes.map(eanElem), input.joins, [input.pre   ]);
        render(fallbackRender, fallbacks.map(eanElem), input.joins, [input.pre]);
        render(compatibleRender, compatibles.map(eanElem), input.joins, [input.pre]);
    });
}


function main() {
    Promise.all([
        getEncodeFallback().then(encodeFallback=>{
            // ASAP
            addWebfont(encodeFallback.fontBlob, 'Libre Barcode EAN13 Text', 400, 'normal');
            return encodeFallback;
        })
        // quick and dirty dom ready:
      , new Promise(resolve /*, reject*/ => window.addEventListener('DOMContentLoaded', resolve))
    ]).then(
        ([encodeFallback/* contentLoadedEvent*/])=>initBulkEncoder(encodeFallback, document.body)
      , console.error
    );
}
main();
