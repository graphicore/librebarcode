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

You'll need these installed and configured first:

- `git`
- `bash` (or compatible shell, like `zsh`)
- `node` – v18.20.8 is pinned and >v18 will not build. (>=v14.13.1 is confirmed to work, except on ARM Macs
  which only have access to >=v16).
  - `fnm` or `vp env` (Vite+) recommended for Node version management
- `bower`
- `uv`

Are dependencies missing? Please, let me know.

```shell
# fetch the sources
path/to $ git clone git@github.com:graphicore/librebarcode.git
path/to $ cd librebarcode

# switch to pinned JS version if necessary, e.g.
path/to/librebarcode $ n use
# fnm or vp env will do this for you

# install JavaScript dependencies
path/to/librebarcode $ npm install
path/to/librebarcode $ bower install

# install Python and Python dependencies
path/to/librebarcode $ uv sync

# now build (uv run ensures the Python venv is on PATH)
path/to/librebarcode $ uv run ./app/bin/buildAll

# the fonts should be in the fonts/ directory
# the UFO sources should be in the sources/ directory
```

## Licensing

The fonts are licensed under OFL.

The barcode font generators and encoders are GPL3+.
