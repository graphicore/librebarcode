/* jshint browser: true, esversion: 6*/

export default function addWebfont(arrBuff, familyName, weight, style) {
    var document = window.document
      , FontFace = window.FontFace
      , Blob = window.Blob
      , URL = window.URL
      ;
    if(FontFace){
        var fontface = new FontFace(familyName, arrBuff,{
                weight: weight
              , style: style
            });
        document.fonts.add(fontface);
    }
    else{
        // Internet Explorer
        var styleElem = document.createElement('style');
        // seems like Webkit needs this,it won't do any harm.
        styleElem.appendChild(document.createTextNode(''));
        document.head.appendChild(styleElem);
        // oldschool, a bit bloated, probably outdated
        // https://www.w3.org/TR/css-font-loading-3/#css-connected
        // to remove, the css @font-face rule must be removed
        var blob = new Blob([arrBuff], { type: 'font/opentype' })
          , url = URL.createObjectURL(blob)
          ;
        styleElem.sheet.insertRule([
                '@font-face {'
                + 'font-family: "' + familyName +'";'
                + 'src: url("' + url + '") format("opentype");'
                + 'font-weight:  ' + weight + ';'
                + 'font-style: ' + style + ';'
                + '}'
        ].join(''));
    }
}
