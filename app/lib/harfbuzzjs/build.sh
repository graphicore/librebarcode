#! /usr/bin/env bash

mkdir .build -p
cd .build

if [ -d harfbuzzjs ]; then
   cd harfbuzzjs
   git pull --rebase
else
   git clone --depth 1 git@github.com:harfbuzz/harfbuzzjs.git
   cd harfbuzzjs
fi

./build.sh
cd ../..
cp .build/harfbuzzjs/hb.wasm hb.wasm
echo 'define(function(require, exports, module){' > hbjs.js
cat .build/harfbuzzjs/hbjs.js >> hbjs.js
echo '});' >> hbjs.js


cat .build/harfbuzzjs/hbjs.js > hbjs.mjs
echo 'export default hbjs;' >> hbjs.mjs
