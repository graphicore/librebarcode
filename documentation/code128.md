---
title:  "Code 128"
modules:
    - "web_assets/js/code128encoder.mjs"
---

# {{ page.title }}

Available font variants:

  * **Libre Barcode 128** is without text below.
  * **Libre Barcode 128 Text** has text below.

To use these fonts you have to use an encoder like [the one below](#code128encoder).
It is an optimizing encoder, that means, it produces the shortest barcode that
can encode the input. For this the encoder, if necessary or shorter, switches
between the three available Code Sets (list from Wikipedia):

 * 128A **Code Set A** – ASCII characters 00 to 95 (0–9, A–Z and control codes), special characters, and FNC 1–4
 * 128B **Code Set B** – ASCII characters 32 to 127 (0–9, A–Z, a–z), special characters, and FNC 1–4
 * 128C **Code Set C** – 00–99 (encodes two digits with a single code point) and FNC1

The other task of the encoder is to calculate the checksum symbol, that must be included before the stop symbol.

See the [Wikipedia Code 128 page](https://en.wikipedia.org/wiki/Code_128) for more detailed info.

{% include code128encoder.md %}
