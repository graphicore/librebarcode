/* jshint esversion:6 */
var data = [
        // the unicode chars are from:
        //   www.idautomation.com/barcode-fonts/code.128/user-manual.html
        //   http://www.jtbarton.com/Barcodes/Code128.aspx
        // checksum value, pattern, canonical id/name (based on Code Set B)
        // (name of the glyph in the font?), [unicode chars], textbelow_flag_or_charcodes
        [   0, ' ', ' ', '00', [' ', 'Â']]
      , [   1, '!', '!', '01', '!']
      , [   2, '"', '"', '02', '"']
      , [   3, '#', '#', '03', '#']
      , [   4, '$', '$', '04', '$']
      , [   5, '%', '%', '05', '%']
      , [   6, '&', '&', '06', '&']
      , [   7, "'", "'", "07", "'"]
      , [   8, '(', '(', '08', '(']
      , [   9, ')', ')', '09', ')']
      , [  10, '*', '*', '10', '*']
      , [  11, '+', '+', '11', '+']
      , [  12, ',', ',', '12', ',']
      , [  13, '-', '-', '13', '-']
      , [  14, '.', '.', '14', '.']
      , [  15, '/', '/', '15', '/']
      , [  16, '0', '0', '16', '0']
      , [  17, '1', '1', '17', '1']
      , [  18, '2', '2', '18', '2']
      , [  19, '3', '3', '19', '3']
      , [  20, '4', '4', '20', '4']
      , [  21, '5', '5', '21', '5']
      , [  22, '6', '6', '22', '6']
      , [  23, '7', '7', '23', '7']
      , [  24, '8', '8', '24', '8']
      , [  25, '9', '9', '25', '9']
      , [  26, ':', ':', '26', ':']
      , [  27, ';', ';', '27', ';']
      , [  28, '<', '<', '28', '<']
      , [  29, '=', '=', '29', '=']
      , [  30, '>', '>', '30', '>']
      , [  31, '?', '?', '31', '?']
      , [  32, '@', '@', '32', '@']
      , [  33, 'A', 'A', '33', 'A']
      , [  34, 'B', 'B', '34', 'B']
      , [  35, 'C', 'C', '35', 'C']
      , [  36, 'D', 'D', '36', 'D']
      , [  37, 'E', 'E', '37', 'E']
      , [  38, 'F', 'F', '38', 'F']
      , [  39, 'G', 'G', '39', 'G']
      , [  40, 'H', 'H', '40', 'H']
      , [  41, 'I', 'I', '41', 'I']
      , [  42, 'J', 'J', '42', 'J']
      , [  43, 'K', 'K', '43', 'K']
      , [  44, 'L', 'L', '44', 'L']
      , [  45, 'M', 'M', '45', 'M']
      , [  46, 'N', 'N', '46', 'N']
      , [  47, 'O', 'O', '47', 'O']
      , [  48, 'P', 'P', '48', 'P']
      , [  49, 'Q', 'Q', '49', 'Q']
      , [  50, 'R', 'R', '50', 'R']
      , [  51, 'S', 'S', '51', 'S']
      , [  52, 'T', 'T', '52', 'T']
      , [  53, 'U', 'U', '53', 'U']
      , [  54, 'V', 'V', '54', 'V']
      , [  55, 'W', 'W', '55', 'W']
      , [  56, 'X', 'X', '56', 'X']
      , [  57, 'Y', 'Y', '57', 'Y']
      , [  58, 'Z', 'Z', '58', 'Z']
      , [  59, '[', '[', '59', '[']
      , [  60, '\\', '\\', '60', '\\']
      , [  61, ']', ']', '61', ']']
      , [  62, '^', '^', '62', '^']
      , [  63, '_', '_', '63', '_']
      , [  64, 'NUL', '`', '64', '`']
      , [  65, 'SOH', 'a', '65', 'a']
      , [  66, 'STX', 'b', '66', 'b']
      , [  67, 'ETX', 'c', '67', 'c']
      , [  68, 'EOT', 'd', '68', 'd']
      , [  69, 'ENQ', 'e', '69', 'e']
      , [  70, 'ACK', 'f', '70', 'f']
      , [  71, 'BEL', 'g', '71', 'g']
      , [  72, 'BS', 'h', '72', 'h']
      , [  73, 'HT', 'i', '73', 'i']
      , [  74, 'LF', 'j', '74', 'j']
      , [  75, 'VT', 'k', '75', 'k']
      , [  76, 'FF', 'l', '76', 'l']
      , [  77, 'CR', 'm', '77', 'm']
      , [  78, 'SO', 'n', '78', 'n']
      , [  79, 'SI', 'o', '79', 'o']
      , [  80, 'DLE', 'p', '80', 'p']
      , [  81, 'DC1', 'q', '81', 'q']
      , [  82, 'DC2', 'r', '82', 'r']
      , [  83, 'DC3', 's', '83', 's']
      , [  84, 'DC4', 't', '84', 't']
      , [  85, 'NAK', 'u', '85', 'u']
      , [  86, 'SYN', 'v', '86', 'v']
      , [  87, 'ETB', 'w', '87', 'w']
      , [  88, 'CAN', 'x', '88', 'x']
      , [  89, 'EM', 'y', '89', 'y']
      , [  90, 'SUB', 'z', '90', 'z']
      , [  91, 'ESC', '{', '91', '{']
      , [  92, 'FS', '|', '92', '|']
      , [  93, 'GS', '}', '93', '}']
      , [  94, 'RS', '~', '94', '~']
      , [  95, 'US', 'DEL', '95', 'Ã']
      , [  96, 'FNC 3', 'FNC 3', '96', 'Ä']
      , [  97, 'FNC 2', 'FNC 2', '97', 'Å']
      , [  98, 'Shift B', 'Shift A', '98', 'Æ']
      , [  99, 'Code C', 'Code C', '99', 'Ç']
      , [ 100, 'Code B', 'FNC 4', 'Code B', 'È']
      , [ 101, 'FNC 4', 'Code A', 'Code A', 'É']
      , [ 102, 'FNC 1', 'FNC 1', 'FNC 1', 'Ê']
      , [ 103, 'Start Code A', 'Start Code A', 'Start Code A', 'Ë']
      , [ 104, 'Start Code B', 'Start Code B', 'Start Code B', 'Ì']
      , [ 105, 'Start Code C', 'Start Code C', 'Start Code C', 'Í']

    ]
  , stopChar = 'Î'
  ;

var CodeSymbol = (function() {
function CodeSymbol(value, checksumValue, code, switchedCode, char, isCtrl) {
    Object.defineProperties(this, {
        value: {value: value} // lol
      , checksumValue: {value: checksumValue}
      , code: {value: code}
      , switchedCode: {value: switchedCode || code}
      , char: {value: char}
      , weight: {value: weight(isCtrl, value)}
      , isCtrl: {value: isCtrl}
      , isShif: {value: (new Set(['Shift B', 'Shift A'])).has(value)}
      , isSwitch: {value: !!switchedCode}
    });
}
var _p = CodeSymbol.prototype;

_p.toString = function(){
    return ['<Code ', this.code.name,':',' ',this.value, '>'].join('');
};

function weight(isCtrl, value) {
    // A symbol always has a weight of 1, its impact on the
    // encoded result length is the weight function.
    // control characters weight is 0.
    // Code C symbols is 2 (they all encode 2 digits)
    return 1 - (isCtrl ? 0 : value.length);
}

return CodeSymbol;
})();

var CodeSet = (function() {
function CodeSet(name, data, stopChar) {
    Object.defineProperties(this, {
        name: {value: name}
      , stopChar: {value: stopChar}
    });

    this._data = data;
    this._values = new Map();
    this._symbols = new Map();
    this._byIndex = [];
    var i, l, column;
    switch(this.name) {
        case('A'):
            column = 1;
            break;
        case('B'):
            column = 2;
            break;
        case('C'):
            column = 3;
            break;
    }
    for(i=0,l=data.length;i<l;i++) {
        this._values.set(data[i][column], data[i]);
        this._byIndex[i] = data[i][column];
    }
}
_p = CodeSet.prototype;

_p.getByIndex = function(index){
    return this.get(this._byIndex[index]);
};

Object.defineProperty(_p, 'switchSymbols', {
    get: function(){
        if(!this._switchSymbols){
            this._switchSymbols = [
                this.get('Code A')
              , this.get('Code B')
              , this.get('Code C')
              , this.get('Shift A')
              , this.get('Shift B')
            ].filter(function(s){return !!s;});
        }
        return this._switchSymbols;
    }
});

_p.get = function(value) {
    var symbol, data, checksumValue, code, switchedCode, char, isCtrl;
    if(!this._values.has(value))
        return null;

    symbol = this._symbols.get(value);
    if(!symbol) {
        // lazy init
        data = this._values.get(value);
        checksumValue = data[0];
        code = this;
        // using global values here!
        switch(value) {
            case('Shift A'):
            //falls through
            case('Start Code A'):
            //falls through
            case('Code A'):
                switchedCode = codeSetA;
                break;
            case('Shift B'):
            //falls through
            case('Start Code B'):
            //falls through
            case('Code B'):
                switchedCode = codeSetB;
                break;
            case('Start Code C'):
            //falls through
            case('Code C'):
                switchedCode = codeSetC;
                break;
            default:
                switchedCode = null;
        }

        if(this.name === 'A')
            isCtrl = checksumValue >= 64;
        else if(this.name === 'B')
            isCtrl = checksumValue >= 95;
        else if(this.name === 'C')
            isCtrl = checksumValue >= 100;

        char = data[data.length - 1];
        if(char instanceof Array)
            // it's an array
            char = char[0];

        symbol = new CodeSymbol(value, checksumValue, code, switchedCode, char, isCtrl);
        this._symbols.set(value, symbol);
    }
    return symbol;
};

return CodeSet;
})();

var codeSetA = new CodeSet('A', data, stopChar)
  , codeSetB = new CodeSet('B', data, stopChar)
  , codeSetC = new CodeSet('C', data, stopChar)
  , startCodeA = codeSetA.get('Start Code A')
  , startCodeB = codeSetB.get('Start Code B')
  , startCodeC = codeSetC.get('Start Code C')
  ;

function _addPaths(weight2Paths, paths) {
    var i, l
      , encoded
      , equalWeightPaths
      ;
    for(i=0,l=paths.length;i<l;i++) {
        encoded = paths[i];
        equalWeightPaths = weight2Paths.get(encoded.weight);
        if(!equalWeightPaths) {
            equalWeightPaths = [];
            weight2Paths.set(encoded.weight, equalWeightPaths);
        }
        equalWeightPaths.push(encoded);
    }
}

function findSolutions(value) {
       // weight, routes -> we'll only explore the lightest routes
     var weight2Paths = new Map()
        // start with three routes, one for each code:
      , lightest = _addPaths(weight2Paths, [
            new Encoding([startCodeB])
          , new Encoding([startCodeA])
          , new Encoding([startCodeC])
        ])
      , i, l
      , lightestPaths
        // used to not solve the same sub-system multiple times
      , explored = new Map()
      , encoded, results, intermediates, solution, weights
      ;

    while(weight2Paths.size) {
        weights = Array.from(weight2Paths.keys());
        lightest = weights[0];
        for(i=1,l=weights.length;i<l;i++) {
            if(weights[i] < lightest)
                lightest = weights[i];
        }
        if(lightest === undefined)
            break;
        lightestPaths = weight2Paths.get(lightest);
        weight2Paths.delete(lightest);
        for(i=0,l=lightestPaths.length;i<l;i++) {
            encoded = lightestPaths[i];
            results = nextStep(explored, value, encoded);
            solution = results[0];
            if(solution)
                // found one
                return solution;
            intermediates = results[1];
            _addPaths(weight2Paths, intermediates);
        }
    }
    return null;
}

/**
 * As an optimization we use _weight and _value here and trust it blindly.
 * This is only used internally, so we don't have to run symbolsWeightChange
 * for each new Encoded object.
 */
function Encoding(symbols, _value, _weight) {
    if('freeze' in Object)
        // no defensive copying, we just guard like this, if the caller
        // doesn't like this side effect, he should pass in a copy,
        Object.freeze(symbols);

    var value = _value || symbols.map(function(s){return s.isCtrl ? '' : s.value;}).join('');
    Object.defineProperties(this, {
        symbols: {value: symbols}
      , value: {value: value}
      , weight: {value: _weight || value.length + symbolsWeightChange(symbols)}
    });
    // assert this.weight === this.value.length + symbolsWeightChange(this.symbols)
}
var _p = Encoding.prototype;

/**
 * returns a new Encoded instance with the added symbol.
 * Encoded instances are immutable.
 */
_p.addSymbol = function(symbol) {
    var symbols = Array.prototype.slice.call(this.symbols)
      , newValue = this.value + (symbol.isCtrl ? '' : symbol.value)
      , oldSymbolsChange = this.weight - this.value.length
      ;
    symbols.push(symbol);

    return new Encoding(symbols
            , newValue
            , newValue.length + oldSymbolsChange + symbol.weight
    );
};

_p.toString = function(){
    return this.symbols.join(' ');
};

Object.defineProperties(_p, {
    lastSymbol: {
        get: function() {
            if(!this.symbols.length)
                throw new Error('There are no symbols yet');
            return this.symbols[this.symbols.length - 1];
        }
    }
  , currentCode: {
        get: function() {
            if(this.symbols.length >= 3 && this.symbols[this.symbols.length - 2].isShift)
                return this.symbols[this.symbols.length - 2].code;
            // `switchedCode` is equal to `code` if the symbol is
            // not switching.
            return this.lastSymbol.switchedCode;
        }
    }
  , chars: {
        get: function() {
            if(!this._chars) {
                var allChars = this.symbols.map(function(s){return s.char;});
                allChars.push(this._getCheckSumSymbol().char
                            , this.currentCode.stopChar);
                this._chars = allChars.join('');
            }
            return this._chars;
        }
    }
});

_p._calculateChecksum = function() {
    var i, l, position, sum = 0;
    for(i=0,l=this.symbols.length;i<l;i++) {
        position = i === 0 ? 1 : i;
        sum =  sum + (position * this.symbols[i].checksumValue);
    }
    return sum % 103;
};

_p._getCheckSumSymbol = function() {
    var checkSum = this._calculateChecksum()
      , checkSumSymbol = this.currentCode.getByIndex(checkSum)
      ;
    return checkSumSymbol;
};

/**
 * Takes one code and returns a list of codes, one for each valid
 * encoding choice. if there's no valid choice it returns an empty
 * list and the subject can not be encoded
 */
function nextStep(explored, value, encoded) {
    var intermediates = []
      , code = encoded.currentCode
      , symbolValue, symbol
      , newEncoded, exploredSet
      , nextSymbols = []
      , i, l
      , exploredKey
      ;

    symbolValue = value.slice(encoded.value.length
                            , encoded.value.length + (encoded.currentCode === codeSetC ? 2 : 1));

    symbol = code.get(symbolValue);
    if(symbol)
        nextSymbols.push(symbol);

    exploredKey = encoded.currentCode.name + '::' + encoded.value;

    exploredSet = explored.get(exploredKey);
    if(!exploredSet) {
        exploredSet = new Set();
        explored.set(exploredKey, exploredSet);
    }
    // code.switchSymbols also emits Shift A | Shift B
    if(!encoded.lastSymbol.isSwitch)
        Array.prototype.push.apply(nextSymbols, code.switchSymbols);

    for(i=0,l=nextSymbols.length;i<l;i++) {
        symbol = nextSymbols[i];
        // If the symbol was already explored at this code + value
        // we skip this variation, otherwise we'd check all possible
        // variations.
        if(exploredSet.has(symbol))
            continue;
        exploredSet.add(symbol);
        newEncoded = encoded.addSymbol(symbol);
        if(newEncoded.value === value)
            // found one
            return [newEncoded, null];
        intermediates.push(newEncoded);
    }
    return [null, intermediates];
}

/**
 * But we can also attach a weight to a code object and change it
 * when the code is changed. The results must be identical though.
 */
function symbolsWeightChange(symbols) {
    function reducer(reduction, symbol) {
        return reduction + symbol.weight;
    }
    return symbols.reduce(reducer, 0);
}

export default function encode(value) {
    var result = findSolutions(value, false);
    return result && result.chars || result;
}
