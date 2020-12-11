<div class="ean13-encoder">
{%- capture markup -%}

## <a name="ean13encoder">EAN 13 Encoder</a>

<label>Enter a code: <input type="text" name="to-encode" class="ean13-encoder_input" /></label>

#### Standard Input Method
<div class="ean13-encoder_display_standard ean13">Z</div>

#### Fallback Input Method
<label>Copy the fallback input: <input type="text" readonly class="ean13-encoder_output_fallback" /></label>
<div class="ean13-encoder_display_fallback ean13">Z</div>


#### Compatible Input Method
<label>Copy the compatible Input: <input type="text" readonly class="ean13-encoder_output_compatible" /></label>
<div class="ean13-encoder_display_compatible ean13">Z</div>
With the Grandzebu font:
<div class="ean13-encoder_display_compatible compat_ean13">Z</div>

{%- endcapture- %}
{{ markup | markdownify }}
</div>
