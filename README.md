# Libre Barcode Font Project

Fonts to write barcodes:

## Code 39

* Libre Barcode 39
* Libre Barcode 39 Text

## Code 128

* Libre Barcode 128
* Libre Barcode 128 Text

## How to install and build


You'll need `git`, `bash`, `python2.7`, `virtualenv`, `node`(=nodejs) with `npm`, `bower`.

Are dependencies missing? Please, let me know.


```
# fetch the sources
path/to $ git clone git@github.com:graphicore/librebarcode.git
path/to $ cd librebarcode

# best start with an virtual environment
path/to/librebarcode $ virtualenv venv
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

The fonts are licensed under OFL.
The barcode font generator scripts are GPL3+.
