/* jshint browser: true, esversion: 6*/
import encode from '../../app/lib/code128Encoder/encoder.mjs';

function initEncoder(){
            var codeContainer = document.body.getElementsByClassName('code128-encoder_display')[0]
              , inputElement = document.body.getElementsByClassName('code128-encoder_input')[0]
              , outputElement = document.body.getElementsByClassName('code128-encoder_output')[0]
              ;

            inputElement.addEventListener('input', function(){
                var result = encode(inputElement.value);
                codeContainer.textContent = result || '';
                outputElement.value = result || '';
            })
            outputElement.addEventListener('click', outputElement.select);
            inputElement.value = 'Hello World!';
            inputElement.dispatchEvent(new Event('input'));
        }

function main() {
    (new Promise(resolve /*, reject*/ => window.addEventListener('DOMContentLoaded', resolve)))
    .then(
        (/* contentLoadedEvent*/)=>initEncoder()
      , console.error);
}
main();
