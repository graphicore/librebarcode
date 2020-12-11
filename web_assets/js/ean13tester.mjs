/* jshint browser: true, esversion: 6*/
import getEncodeFallback from '../../app/lib/ean13Encoder/fallback.mjs';
import encodeCompatible from '../../app/lib/ean13Encoder/compatible.mjs';
import addWebfont from './addWebfont.mjs';

function insertBarcodes(hostElement, titleText, ...specimen) {
    var container = document.createElement('div')
      , children = []
      , title = document.createElement('h3')
      , makeSamples =(klass, codeTexts, noInput)=>{
            let samples = document.createElement('div');
            samples.classList.add('ean13_samples');
            for(let text of codeTexts) {
                let sample = document.createElement('span')
                  , output = document.createElement('span')
                  , code = document.createElement('span')
                  ;
                sample.classList.add('ean13_sample');
                if(!noInput){
                    output.appendChild(document.createTextNode(text));
                    sample.appendChild(output);
                    output.classList.add('ean13_sample-output');
                }
                code.appendChild(document.createTextNode(text));
                code.classList.add(klass);
                sample.appendChild(code);
                samples.appendChild(sample);
            }
            return samples;
        }
      ;
    container.classList.add('ean13_specimen');
    title.textContent = titleText;
    children.push(title);
    for(let [labelText, codeTexts, addCompat] of specimen) {
        let label = document.createElement('span');
        label.classList.add('ean13_specimen-label');
        label.appendChild(document.createTextNode(labelText));
        children.push(label);

        let samples = makeSamples('ean13', codeTexts);
        children.push(samples);

        if(addCompat) {
            let compat = makeSamples('compat_ean13', codeTexts, true);
            children.push(compat);
        }
    }
    children.push(document.createElement('hr'));
    for(let child of children)
        container.appendChild(child);
    hostElement.appendChild(container);
}

function ean13renderTests(encodeFallback) {
    let domItems = document.createDocumentFragment();
    for(let [title, inputs] of [
                      ['EAN-13 chksm 5'             , ['001234567890?', '0012345678905']]
                    , ['EAN-13 chksm 5 - 2'         , ['001234567890?12', '001234567890512']]
                    , ['EAN-13 chksm 5 - 5'         , ['001234567890?12345', '001234567890512345']]
                    , ['+ 5'                        , ['-12345']]
                    , ['EAN-8 chksm 0'              , ['1234567?', '12345670']]
                    , ['EAN-8 chksm 7'              , ['9031101?', '90311017']]
                    , ['EAN-8 chksm 2'              , ['0154684?', '01546842']]
                    , ['UPC-A chksm 5'              , ['01234567890?', '012345678905']]
                    , ['UPC-A (B) chksm 6'          , ['60251743703?', '602517437036']]
                    , ['UPC-E long (A) chksm 8'     , ['X01234500005?', 'X012345000058']]
                    , ['UPC-E long (B) chksm 0 - 2' , ['X04567000008?62', 'X04567000008062']]
                    , ['UPC-E long (C) chksm 3'     , ['X03400000567?', 'X034000005673']]
                    , ['UPC-E long (D) chksm 1 - 5' , ['X09840000075?83611', 'X09840000075183611']]
                    , ['UPC-E short (A) chksm 8'    , ['x123455?', 'x1234558']]
                    , ['UPC-E short (B) chksm 0 - 2', ['x456784?62', 'x456784262']]
                    , ['UPC-E short (C) chksm 3'    , ['x345670?', 'x3456703']]
                    , ['UPC-E short (D) chksm 1 - 5', ['x984753?83611', 'x984753183611']]
                    ]) {
        let outputs = []
          , compats = []
          ;
        for(let input of inputs) {
            outputs.push(encodeFallback(input));
            let compatInput;
            switch(input[0]){
                case '-':
                    // doesn't understand - to trigger add-ons
                    compatInput = input.slice(1);
                    break;
                case 'X':
                case 'x':
                    // falls through;
                    // No UPC-E in compat mode (special guard is not available)
                    break;
                default:
                    compatInput = input;
            }
            if(compatInput) {
                try {
                    compats.push(encodeCompatible(compatInput, true));
                }
                catch(e) {
                    console.warn(`encodeCompatible had an error with "${compatInput}":`, e);
                    compats.push('(XYZ)');
                }
            }
        }
        insertBarcodes(
            domItems
          , title
          , [`user input:`, inputs]
          , [`fallback encoder:`, outputs]
          , ...(compats.length ? [[`compatible encoder:`, compats, true]] : [])
        );
    }
    let hostElements = document.getElementsByClassName('attach-ean13tester');
    if(!hostElements.length)
        hostElements = [document.body];
    for(let i=0,l=hostElements.length;i<l;i++) {
        let hostElement = hostElements[i];
        hostElement.appendChild(
            // No need to clone for last hostElement.
            i === l - 1
                ? domItems
                : domItems.cloneNode(true)
        );
    }
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
        ([encodeFallback/* contentLoadedEvent*/])=>ean13renderTests(encodeFallback)
      , console.error
    );
}
main();
