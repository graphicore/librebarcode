# Libre Barcode Font Project

Fonts to write barcodes.

[Manual Pages](https://graphicore.github.io/librebarcode/)

## Code 39

* Libre Barcode 39
* Libre Barcode 39 Text
* Libre Barcode Extended 39
* Libre Barcode Extended 39 Text

[Code 39 manual](https://graphicore.github.io/librebarcode/documentation/code39)

## Code 128

* Libre Barcode 128
* Libre Barcode 128 Text

[Code 128 manual](https://graphicore.github.io/librebarcode/documentation/code128)

## EAN 13 (EAN 8, UPC-A, UPC-E, 2- and 5-digit Add-Ons)

* Libre Barcode EAN13 Text

[EAN 13 manual](https://graphicore.github.io/librebarcode/documentation/ean13)


## How to install and build

You'll need `git`, `bash`, `python3.6`, `node`(=nodejs e.g. v14.13.1 is confirmed to work, use `nvm` to manage node versions) with `npm`, `bower` and `ttfautohint` (if not in your distribution I suggest: [ttfautohint-build](https://github.com/source-foundry/ttfautohint-build)). Maybe you'll have to install the `python3-venv` module.

Are dependencies missing? Please, let me know.


```
# fetch the sources
path/to $ git clone git@github.com:graphicore/librebarcode.git
path/to $ cd librebarcode

# best start with an virtual environment
path/to/librebarcode $ python3 -m venv venv
path/to/librebarcode $ . venv/bin/activate

# installs fontmake and fontbakery
(venv) path/to/librebarcode $ pip install -r requirements.txt

# installs javascript dependencies
(venv) path/to/librebarcode $ npm install
(venv) path/to/librebarcode $ bower install

# now build:
(venv) path/to/librebarcode $ ./app/bin/buildAll

# the fonts should be in the librebarcode/fonts directory now
# The UFO sources should be in the sources directory
```

## Licensing

The fonts are licensed under OFL.<br />
The barcode font generators and encoders are GPL3+.
