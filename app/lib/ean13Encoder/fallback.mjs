/* jshint esversion: 6, browser:true*/
import getHarfbuzz from '../harfbuzzjs/harfbuzz.mjs';
import opentype from '../bower_components/opentype.js/dist/opentype.module.js';
const LIBREBARCODE_EAN13_URL = new URL('../../../fonts/LibreBarcodeEAN13Text-Regular.ttf', import.meta.url);

function makeEncode(hb, fontBlob) {
    var blob = hb.createBlob(fontBlob)
      , face = hb.createFace(blob, 0)
      , font = hb.createFont(face)
      , otfont = opentype.parse(fontBlob)
      ;
    function encode(input) {
        var buffer = hb.createBuffer()
         , shaped
         , chars = []
         ;
        buffer.addText(input);
        buffer.guessSegmentProperties();
        // buffer.setDirection('ltr'); // optional as can be by guessSegmentProperties also
        hb.shape(font, buffer); // features are not supported yet
        shaped = buffer.json(font);
        buffer.destroy();
        chars = [];
        for(let x of shaped)
            chars.push(String.fromCharCode(otfont.glyphs.get(x.g).unicode));
        if(chars.indexOf('\u0000') !== -1)
            // If it has .null chars it's unlikely that the result is
            // of any use.
            throw new Error(`Can\'t encode input "${input}".`);
        return chars.join('');
    }

    // Looks like these must be destroyed if not needed anymore.
    // Is not my current use case though.
    encode.destroy = ()=>{
        font.destroy();
        face.destroy();
        blob.destroy();
    };

    encode.fontBlob = fontBlob;
    return encode;
}

export default async function getEncode(){
    let [hb, fontBlob] = await Promise.all([
        getHarfbuzz()
      , fetch(LIBREBARCODE_EAN13_URL)
            .then(res=>res.arrayBuffer())
            // .then(blob=> new Uint8Array(blob)) // "fontBlob"
    ]);
    return makeEncode(hb, fontBlob);
}
