/* jshint esversion:6, browser: true */
import hbjs from './hbjs.mjs';

// no good way to load wasm from within a module yet.
const wasmURL = new URL('hb.wasm', import.meta.url);

export default async function getHarfbuzz(){
    let result = await fetch(wasmURL)
      , moduleData = await result.arrayBuffer()
      , wasm = await WebAssembly.instantiate(moduleData)
      ;
    wasm.instance.exports.memory.grow(400); // each page is 64kb in size
    return hbjs(wasm.instance);

}
