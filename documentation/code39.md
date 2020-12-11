---
title:  "Code 39"
---

# {{ page.title }}

Available font variants:

  * **Libre Barcode 39** is without text below.
  * **Libre Barcode 39 Text** has text below.
  * **Libre Barcode 39 Extended** supports additional characters, and is without text below.
  * **Libre Barcode 39 Extended Text** supports additional characters, and has text below.

To use these wrap the text to encode into `*` asterisks, enter `*HELLO WORLD*`:

Result:

<span class="code39Text">\*HELLO WORLD\*</span>

## Plain Variants:

Supports the input characters: "$ / + % 0–9 A–Z - ."  and " "(space)

## Extended Variants:

Supports full ASCII as input characters.

From [Full ASCII Code 39](https://en.wikipedia.org/wiki/Code_39):

> Code 39 is restricted to 43 characters. In Full ASCII Code 39 Symbols
0-9, A-Z, ".", "-" and space are the same as their representations in
Code 39. Lower case letters, additional punctuation characters and control
characters are represented by sequences of two characters of Code 39.

This means, internally in the font e.g. an "a" is encoded as "+A" or
an "@" as "%V". There's a table in the linked Wikipedia article.

Thus, **be aware**, some scanners will interpret "extended Code 39" as
just plain Code 39 and decode e.g. "Hello" as "H+E+L+L+O".

See the [Wikipedia Code 39 page](https://en.wikipedia.org/wiki/Code_39) for more info.

