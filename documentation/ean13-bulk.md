---
title:  EAN-13 Bulk Fallback and Compatible Encoder
listed: false
modules:
    - web_assets/js/ean13bulk.mjs
---

# {{ page.title }}

A bulk fallback/compatible encoder for many codes. Ideally enter a line separated list,
but the converter will try to retain any other string formatting and mach only on what could
be an EAN 13 code.

## Input
<textarea class="ean13_bulk ean13_bulk-input" placeholder="paste your codes"></textarea>

## Output Fallback Encoding
<textarea class="ean13_bulk ean13_bulk-output_fallback" disabled></textarea>

## Output Compatible Encoding
<textarea class="ean13_bulk ean13_bulk-output_compatible" disabled></textarea>

## Rendered Input
<pre class="ean13_bulk ean13_bulk-input_render"></pre>

## Rendered Output Fallback Encoding
<pre class="ean13_bulk ean13_bulk-output_fallback_render"></pre>

## Rendered Output Compatible Encoding
<pre class="ean13_bulk ean13_bulk-output_compatible_render"></pre>
