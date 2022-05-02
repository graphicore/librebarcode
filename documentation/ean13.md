---
title:  "EAN 13"
order: 100
modules:
    - "web_assets/js/ean13encoder.mjs"
---

# {{ page.title }} Manual

Available font variants:

  * **Libre Barcode EAN13 Text** has text below.

The EAN 13 font implements all of the EAN/UPC symbology in [GS1 General Specifications](https://www.gs1.org/standards/barcodes-epcrfid-id-keys/gs1-general-specifications) (version 20),
[get the PDF](https://www.gs1.org/sites/default/files/docs/barcodes/GS1_General_Specifications.pdf) start at **5.2 Linear barcodes - EAN/UPC symbology specifications**.

That is the symbol types:

 * EAN-13
 * EAN-8
 * UPC-A
 * UPC-E
 * 2-digit Add-On (for EAN-13, UPC-A/-E)
 * 5-digit Add-On (for EAN-13, UPC-A/-E)

Wikipedia has a bunch of relevant articles: [EAN](https://en.wikipedia.org/wiki/International_Article_Number),
[EAN-8](https://en.wikipedia.org/wiki/EAN-8) and [UPC](https://en.wikipedia.org/wiki/Universal_Product_Code)

## Contents

 * [Usage TL;DR](#usage-tldr)
 * [Usage Details](#usage-details)
   * [Standard Input Method](#standard-input-method)
   * [Fallback Input Method](#fallback-input-method)
   * [Compatible Input Method](#compatible-input-method)
 * [Expected Inputs](#expected-inputs)
   * [Main Symbols](#expected-inputs-main-symbols)
   * [Add Ons](#expected-inputs-add-ons)
   * [Main Symbols + Add Ons](#expected-inputs-main-symbols-add-ons)
 * [EAN 13 Encoder](#ean13-encoder)

## <a name="usage-tldr">Usage TL;DR</a>

The font aims to make barcode creation as simple as possible: **Enter your digits,
the font does all the rest.** Don't know the check digit? Use a "?" (question mark)
as placeholder and the font will calculate it for you:

 * Example for EAN-13, enter: `0012345678905` or `001234567890?`
 * Result: <span class="ean13">001234567890?</span>

See the [Expected Inputs](#expected-inputs) for details.

Play with the interactive [EAN 13 Encoder](#ean13-encoder).

## <a name="usage-details">Usage Details</a>

This sounds easy, however, in this symbology there's no straight one to
one mapping from digit entered to barcode symbol. Au contraire, each digit relates
to 3 pattern variants (called Set A, B and C) which are used to codify additional
information in the barcode, depending on how they are intermixed. Adding the special
layout characteristics of the different symbol types and the requirements of the
["Compatible" input method](#compatible) we end up with *13 different glyphs per digit*.
The complexity increases by the way different structuring "guard" patterns have
to be inserted.

### <a name="standard-input-method">Standard Input Method</a>

The preferred way to use this font is by the [Expected Inputs](#expected-inputs),
optionally with the **question mark as placeholder to trigger check-digit calculation**.
This requires no step in-between and keeps the value of the barcode in the document,
that means e.g. that full text search and copy and paste will keep working.

The rules to compose the correct barcodes from the [Expected Inputs](#expected-inputs) are
implemented in the font as [OpenType Feature](https://en.wikipedia.org/wiki/List_of_typographic_features)
namely by the [`calt` "Contextual Alternates"](https://docs.microsoft.com/en-us/typography/opentype/spec/features_ae#tag-calt) feature.

*"This feature should be active by default."*, says the spec, and a modern text rendering
pipeline will execute it without problems by default. However, not all software is equally
fit, and so there are currently different issues e.g. with Microsoft Office or Apple iOS Browsers
and different approaches to mitigate them:

 * For Browsers (Safari and Chrome) on Apples iOS Browsers, the short answer is,
   use `font-feature-settings: "calt" 1;` in your CSS. Here's a description:
   [issue #29](https://github.com/graphicore/librebarcode/issues/29#issuecomment-742230442).
 * For Microsoft Word (2010? ff.) there's a deeply buried user interface to
   activate "Contextual Alternates", described here: [issues #28](https://github.com/graphicore/librebarcode/issues/28#issuecomment-712286333)
 * If no OpenType Features are available e.g. in Microsoft Excel, have a
   look at the ["Fallback" input method](#fallback-input-method) and ["Compatible" input method](#compatible-input-method).

### <a name="fallback-input-method">Fallback Input Method</a>

For cases where there are no functioning OpenType features available, all glyphs
of the font are encoded with a Unicode character-code, this makes them accessible directly.
However, the input string becomes cryptic, it does not reflect the value that is
associated with the barcode. **Encoding by hand is not an option**, and therefore
a fallback encoder exists. The encoder takes the same numeric input as the font and
outputs a string of characters that will render the **exact same as the OpenType feature**
enabled version. This encoder uses the original font and is shaping (executing the
OpenType features) in JavaScript (using [Harfbuzz-JS](https://github.com/harfbuzz/harfbuzzjs)),
the resulting output glyphs are used to get their Unicode character-code. This way, the
fallback encoder will always be en par with the font implementation. Low maintenance!

 * Example for UPC-A, enter: `012345678905` or `01234567890?`
 * The fallback encoder produces: <code class="ean13_encode-fallback" data-input="01234567890?"></code>
 * Result: <span class="ean13_encode-fallback ean13" data-input="01234567890?"></span>

There's a [EAN 13 Encoder](#ean13-encoder) on this page and an [EAN 13 Bulk Encoder](./ean13-bulk.html) for many codes.

### <a name="compatible-input-method">Compatible Input Method</a>

Another FLOSS font for the EAN/UPC family exists: [grandzebu.net:  The EAN 13 code](https://grandzebu.net/informatique/codbar-en/ean13.htm).
The Libre Barcode font uses an encoding compatible to the Grandzebu font. This means
barcodes that are encoded for the Grandzebu font can also be displayed with the
Libre Barcode font. And further, Grandzebu provides Visual Basic 6 encoder tools,
that can also be used in a VBA macro linked to Excel or Word documents.

The downside is, that the compatible mode, in some cases, doesn't have the
subtlety as required by the spec, in terms of the barcode layout. Despite
of the not optimal layout, the barcodes it can produce will still be perfectly
readable for barcode scanners. Besides that, it also lacks the "Special Guard"
bar pattern, which is required for UPC-E.

A compatible encoder is available, it works similar to the fallback encoder.

 * Example for UPC-A, enter: `012345678905` or `01234567890?`
 * The compatible encoder produces: <code class="ean13_encode-compatible" data-input="01234567890?"></code>
 * Result:<br />
   <span class="ean13_encode-compatible ean13" data-input="01234567890?"></span><br />
   and with the Grandzebu font:<br />
   <span class="ean13_encode-compatible compat_ean13" data-input="01234567890?"></span>

There's a [EAN 13 Encoder](#ean13-encoder) on this page and an [EAN 13 Bulk Encoder](./ean13-bulk.html) for many codes.

## <a name="expected-inputs">Expected Inputs</a>

The font is optimized for a range of inputs that make sense in the context of
the EAN/UPC symbology:
 * Strings of digits of specific lengths.
 * Optionally at the right position a "?" question mark to trigger check sum
   calculation.
 * UPC-E must be marked with "x" or "X" for their short and long input forms, otherwise, UPC-E would clash with other symbol types.

What follows is a table of expected inputs. Inputs outside of these expected cases will not produce useful barcodes or unwanted effects.

<table class="ean13_expected">
<tr class="ean13_expected_section">
    <th colspan="2"><a name="expected-inputs-main-symbols">Main Symbols</a></th>
</tr>

<tr class="ean13_expected_code-head"><th colspan=2>EAN-13</th></tr>
<tr>
    <th>Pattern<br />D = a digit</th>
    <td><code>DDDDDDDDDDDDD</code> or <code>DDDDDDDDDDDD?</code></td>
</tr>
<tr>
    <th>Example</th>
    <td><code>0012345678905</code> or <code>001234567890?</code></td>
</tr>
<tr>
    <th>Description</th>
    <td>13 digits, the last digit is the check digit.</td>
</tr>
<tr>
    <th>Code</th>
    <td class="ean13">001234567890?</td>
</tr>

<tr class="ean13_expected_code-head"><th colspan=2>EAN-8</th></tr>
<tr>
    <th>Pattern<br />D = a digit</th>
    <td><code>DDDDDDDD</code> or <code>DDDDDDD?</code></td>
</tr>
<tr>
    <th>Example</th>
    <td><code>12345670</code> or <code>1234567?</code></td>
</tr>
<tr>
    <th>Description</th>
    <td>8 digits, the last digit is the check digit.</td>
</tr>
<tr>
    <th>Code</th>
    <td class="ean13">1234567?</td>
</tr>

<tr class="ean13_expected_code-head"><th colspan=2>UPC-A</th></tr>
<tr>
    <th>Pattern<br />D = a digit</th>
    <td><code>DDDDDDDDDDDD</code> or <code>DDDDDDDDDDD?</code></td>
</tr>
<tr>
    <th>Example</th>
    <td><code>012345678905</code> or <code>01234567890?</code></td>
</tr>
<tr>
    <th>Description</th>
    <td>12 digits, the last digit is the check digit.</td>
</tr>
<tr>
    <th>Code</th>
    <td class="ean13">01234567890?</td>
</tr>

<tr class="ean13_expected_code-head"><th colspan=2>UPC-E short input</th></tr>
<tr>
    <th>Pattern<br />D = a digit</th>
    <td><code>xDDDDDDD</code> or <code>xDDDDDD?</code></td>
</tr>
<tr>
    <th>Example</th>
    <td><code>x1234558</code> or <code>x123455?</code></td>
</tr>
<tr>
    <th>Description</th>
    <td>"x" (lower case x) and 7 digits, the last digit is the check digit.</td>
</tr>
<tr>
    <th>Code</th>
    <td class="ean13">x123455?</td>
</tr>

<tr class="ean13_expected_code-head"><th colspan=2>UPC-E long input</th></tr>
<tr>
    <th>Pattern<br />D = a digit</th>
    <td><code>XDDDDDDDDDDDD</code> or <code>XDDDDDDDDDDD?</code></td>
</tr>
<tr>
    <th>Example</th>
    <td><code>X098400000751</code> or <code>X09840000075?</code></td>
</tr>
<tr>
    <th>Description</th>
    <td>"X" (upper case X) and 12 digits, the last digit is the check digit.<br />
       <em>NOTE:</em> UPC-E is a compressed "zero-suppressed" form of certain UPC-A codes
       that start with a zero and feature four or five zeros in a row starting
       from certain positions. Not all possible 12-digit inputs can be compressed
       into UPC-E and if not possible the font will also fail to create a functional
       barcode. This input method is maybe most useful to test if a UPC-A code
       qualifies as UPC-E.</td>
</tr>
<tr>
    <th>Code</th>
    <td class="ean13">X09840000075?</td>
</tr>

<tr class="ean13_expected_section">
    <th colspan="2"><a name="expected-inputs-add-ons">Add Ons</a></th>
</tr>
<tr>
    <td colspan="2">The add on symbols are not meant to stand-alone, however, there's
       a method to produce them by prefixing them with a "-" (minus sign).</td>
</tr>

<tr class="ean13_expected_code-head"><th colspan=2>2-digit</th></tr>
<tr>
    <th>Pattern<br />D = a digit</th>
    <td><code>-DD</code></td>
</tr>
<tr>
    <th>Example</th>
    <td><code>-34</code></td>
</tr>
<tr>
    <th>Description</th>
    <td>"-" (minus sign) and 2 digits.</td>
</tr>
<tr>
    <th>Code</th>
    <td class="ean13">-34</td>
</tr>

<tr class="ean13_expected_code-head"><th colspan=2>5-digit</th></tr>
<tr>
    <th>Pattern<br />D = a digit</th>
    <td><code>-DDDDD</code></td>
</tr>
<tr>
    <th>Example</th>
    <td><code>-87613</code></td>
</tr>
<tr>
    <th>Description</th>
    <td>"-" (minus sign) and 5 digits.</td>
</tr>
<tr>
    <th>Code</th>
    <td class="ean13">-87613</td>
</tr>

<tr class="ean13_expected_section">
    <th colspan="2"><a name="expected-inputs-main-symbols-add-ons">Main Symbols + Add Ons</a></th>
</tr>
<tr>
    <td colspan="2">EAN13, UPC-A and UPC-E can be expanded by an Add-On.
    Input is done by simply adding two or five digits directly after the
    main symbol. EAN-8 does not support Add-Ons.</td>
</tr>

<tr class="ean13_expected_code-head"><th colspan=2>EAN13 - 2-digit</th></tr>
<tr>
    <th>Pattern<br />D = a digit</th>
    <td><code>DDDDDDDDDDDDDDD</code> or <code>DDDDDDDDDDDD?DD</code></td>
</tr>
<tr>
    <th>Example</th>
    <td><code>001234567890512</code> or <code>001234567890?12</code></td>
</tr>
<tr>
    <th>Description</th>
    <td>15 digits or 12 digits, a question mark and 2 digits.</td>
</tr>
<tr>
    <th>Code</th>
    <td class="ean13">001234567890?12</td>
</tr>

<tr class="ean13_expected_code-head"><th colspan=2>EAN13 - 5-digit</th></tr>
<tr>
    <th>Pattern<br />D = a digit</th>
    <td><code>DDDDDDDDDDDDDDDDDD</code> or <code>DDDDDDDDDDDD?DDDD</code></td>
</tr>
<tr>
    <th>Example</th>
    <td><code>001234567890512987</code> or <code>001234567890?12987</code></td>
</tr>
<tr>
    <th>Description</th>
    <td>18 digits or 12 digits, a question mark and 5 digits.</td>
</tr>
<tr>
    <th>Code</th>
    <td class="ean13">001234567890?12987</td>
</tr>

<tr class="ean13_expected_code-head"><th colspan=2>UPC-A - 2-digit</th></tr>
<tr>
    <th>Pattern<br />D = a digit</th>
    <td><code>DDDDDDDDDDDDDD</code> or <code>DDDDDDDDDDD?DD</code></td>
</tr>
<tr>
    <th>Example</th>
    <td><code>01234567890512</code> or <code>01234567890?12</code></td>
</tr>
<tr>
    <th>Description</th>
    <td>14 digits or 11 digits, a question mark and 2 digits.</td>
</tr>
<tr>
    <th>Code</th>
    <td class="ean13">01234567890?12</td>
</tr>

<tr class="ean13_expected_code-head"><th colspan=2>UPC-A - 5-digit</th></tr>
<tr>
    <th>Pattern<br />D = a digit</th>
    <td><code>DDDDDDDDDDDDDDDDD</code> or <code>DDDDDDDDDDD?DDDDD</code></td>
</tr>
<tr>
    <th>Example</th>
    <td><code>01234567890512987</code> or <code>01234567890?12987</code></td>
</tr>
<tr>
    <th>Description</th>
    <td>17 digits or 11 digits, a question mark and 5 digits</td>
</tr>
<tr>
    <th>Code</th>
    <td class="ean13">01234567890?12987</td>
</tr>

<tr class="ean13_expected_code-head"><th colspan=2>UPC-E short - 2-digit</th></tr>
<tr>
    <th>Pattern<br />D = a digit</th>
    <td><code>xDDDDDDDDD</code> or <code>xDDDDDD?DD</code></td>
</tr>
<tr>
    <th>Example</th>
    <td><code>x123455883</code> or <code>x123455?83</code></td>
</tr>
<tr>
    <th>Description</th>
    <td>"x" and 9 digits or "x" and 6 digits, a question mark and 2 digits.</td>
</tr>
<tr>
    <th>Code</th>
    <td class="ean13">x123455?83</td>
</tr>

<tr class="ean13_expected_code-head"><th colspan=2>UPC-E short - 5-digit</th></tr>
<tr>
    <th>Pattern<br />D = a digit</th>
    <td><code>xDDDDDDDDDDDD</code> or <code>xDDDDDD?DDDDD</code></td>
</tr>
<tr>
    <th>Example</th>
    <td><code>x123455883045</code> or <code>x123455?83045</code></td>
</tr>
<tr>
    <th>Description</th>
    <td>"x" and 12 digits or "x" and 6 digits, a question mark and 5 digits.</td>
</tr>
<tr>
    <th>Code</th>
    <td class="ean13">x123455?83045</td>
</tr>

<tr class="ean13_expected_code-head"><th colspan=2>UPC-E long - 2-digit</th></tr>
<tr>
    <th>Pattern<br />D = a digit</th>
    <td><code>XDDDDDDDDDDDDDD</code> or <code>XDDDDDDDDDDD?DD</code></td>
</tr>
<tr>
    <th>Example</th>
    <td><code>X04567000008062</code> or <code>X04567000008?62</code></td>
</tr>
<tr>
    <th>Description</th>
    <td>"X" and 14 digits or "X" and 11 digits, a question mark and 2 digits.</td>
</tr>
<tr>
    <th>Code</th>
    <td class="ean13">X04567000008?62</td>
</tr>

<tr class="ean13_expected_code-head"><th colspan=2>UPC-E long - 5-digit</th></tr>
<tr>
    <th>Pattern<br />D = a digit</th>
    <td><code>XDDDDDDDDDDDDDDDDD</code> or <code>XDDDDDDDDDDD?DDDDD</code></td>
</tr>
<tr>
    <th>Example</th>
    <td><code>X09840000075183611</code> or <code>X09840000075?83611</code></td>
</tr>
<tr>
    <th>Description</th>
    <td>"X" and 17 digits or "X" 11 and digits, a question mark and 5 digits.</td>
</tr>
<tr>
    <th>Code</th>
    <td class="ean13">X09840000075?83611</td>
</tr>
</table>


There's an [EAN 13 Technical Testing page](./ean13-testing.html) with many examples.

There's also an [EAN 13 Bulk Encoder](./ean13-bulk.html) for many codes.

<a name="ean13-encoder"></a>
{% include ean13encoder.md %}
