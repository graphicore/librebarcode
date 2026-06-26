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

You'll need:

- `git`
- `bash`
- `python3` (up to v3.9 is confirmed to work)
- `node` (>= v14.13.1 is confirmed to work; won't build on newer than v18)
- `npm`
- `bower`
- `ttfautohint` (on macOS with Homebrew: `brew install ttfautohint`;
  see [the website](https://freetype.org/ttfautohint/) for more info)
- `python3-venv` module

Are dependencies missing? Please, let me know.

```shell
# fetch the sources
path/to $ git clone git@github.com:graphicore/librebarcode.git
path/to $ cd librebarcode

# installs javascript dependencies
path/to/librebarcode $ npm install
path/to/librebarcode $ bower install

# best start with an virtual environment
# first ensure the active version of Python is not newer than 3.9
path/to/librebarcode $ python3 -m venv venv
path/to/librebarcode $ . venv/bin/activate

# installs fontmake and fontbakery
(venv) path/to/librebarcode $ pip install -r requirements.txt

# now build:
(venv) path/to/librebarcode $ ./app/bin/buildAll

# the fonts should be in the librebarcode/fonts directory now
# The UFO sources should be in the sources directory
```

## Contributing

To update the Python dependencies, edit `requirements.in` and regenerate
`requirements.txt` using `pip-compile`. Then reinstall from the updated
requirements.txt.

```shell
(venv) path/to/librebarcode $ pip install pip-tools
(venv) path/to/librebarcode $ pip-compile --upgrade requirements.in
(venv) path/to/librebarcode $ pip install -r requirements.txt

```

## Licensing

The fonts are licensed under OFL.

The barcode font generators and encoders are GPL3+.
