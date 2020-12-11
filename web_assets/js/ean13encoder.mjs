/* jshint browser: true, esversion: 7*/
import getEncodeFallback from '../../app/lib/ean13Encoder/fallback.mjs';
import encodeCompatible from '../../app/lib/ean13Encoder/compatible.mjs';
import addWebfont from './addWebfont.mjs';

function execInlineEncoders(encodeFallback) {
    for( let [encode, class_] of [
                        [encodeCompatible, 'ean13_encode-compatible'],
                        [encodeFallback, 'ean13_encode-fallback']]) {
        let targtes = document.getElementsByClassName(class_);
        for(let target of targtes)
            target.textContent = encode(target.getAttribute('data-input'));
    }
}
function initEncoder(encodeFallback, elem){
    var inputElement = elem.getElementsByClassName('ean13-encoder_input')[0]
      , standardDisplays = elem.getElementsByClassName('ean13-encoder_display_standard')
      , fallbackElements = [
            elem.getElementsByClassName('ean13-encoder_output_fallback')  // value =
          , elem.getElementsByClassName('ean13-encoder_display_fallback') // textContent =
        ]
      , compatibleElements = [
            elem.getElementsByClassName('ean13-encoder_output_compatible')  // value =
          , elem.getElementsByClassName('ean13-encoder_display_compatible') // textContent =
        ]
      , setTexts=(elements, text)=>{
            for(let elem of elements)
                elem.textContent = text || '';
        }
      , setValues=(elements, text)=>{
            for(let elem of elements)
                elem.value = text || '';
        }
      , setVisible=(elements, visible)=>{
            for(let elem of elements)
                if(visible)
                    elem.style.display = null;
                else
                    elem.style.display = 'none';
        }
      , encode=(encodeFn, input, targetInputs, targetElements)=>{
            try {
                var encoded = encodeFn(input);
                setValues(targetInputs, encoded);
                setTexts(targetElements, encoded);
                setVisible(targetElements, true);
            }
            catch(e) {
                setValues(targetInputs, '(not available)');
                setVisible(targetElements, false);
            }
        }
      ;


    inputElement.addEventListener('input', function(){
        var input = inputElement.value;
        setTexts(standardDisplays, input);
        encode(encodeFallback, input, ...fallbackElements);
        encode(encodeCompatible, input, ...compatibleElements);
    });
    for(let outputElement of [...fallbackElements[0], ...compatibleElements[0]]){
        outputElement.addEventListener('click', outputElement.select);
    }
    // Random EAN-13
    inputElement.value = Math.floor(Math.random() * 10**12) + '?';
    inputElement.dispatchEvent(new Event('input'));
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
        ([encodeFallback/* contentLoadedEvent*/])=>{
            execInlineEncoders(encodeFallback);
            for(let elem of document.getElementsByClassName('ean13-encoder'))
                initEncoder(encodeFallback, elem);
        }
      , console.error
    );
}
main();
