/* jshint esversion: 6 */
function checksumGTIN(digits) {
    // Must be right-alligned so the odd-even rule works correctly
    // also for even length input, hence the .slice().reverse().
    const [sumOdd, sumEven] = digits.slice().reverse().reduce(
        (accumulator, currentValue, i)=>{
            accumulator[i % 2] += currentValue;
            return accumulator;
        }, [0, 0]);
    return (10 - ((sumEven + sumOdd * 3) % 10)) % 10;
}

const charSets = {
    A: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
  , B: ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T']
  , C: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
};

function compatibleEAN13(digits) {
    const numbersets = ['AAAAAA', 'AABABB', 'AABBAB', 'AABBBA', 'ABAABB'
            , 'ABBAAB', 'ABBBAA', 'ABABAB', 'ABABBA', 'ABBABA']
      , numberset = numbersets[digits[0]]
      ;
    return [
              '' + digits[0]
            , charSets[numberset[0]][digits[1]]
            , charSets[numberset[1]][digits[2]]
            , charSets[numberset[2]][digits[3]]
            , charSets[numberset[3]][digits[4]]
            , charSets[numberset[4]][digits[5]]
            , charSets[numberset[5]][digits[6]]
            , '*'
            , charSets.C[digits[7]]
            , charSets.C[digits[8]]
            , charSets.C[digits[9]]
            , charSets.C[digits[10]]
            , charSets.C[digits[11]]
            , charSets.C[digits[12]]
            , '+'
        ].join('');
}

function compatibleEAN8(digits) {
    return [ ':'
            , charSets.A[digits[0]]
            , charSets.A[digits[1]]
            , charSets.A[digits[2]]
            , charSets.A[digits[3]]
            , '*'
            , charSets.C[digits[4]]
            , charSets.C[digits[5]]
            , charSets.C[digits[6]]
            , charSets.C[digits[7]]
            , '+'
    ].join('');
}

function compatibleAddOn2(digits) {
    const numbersets = [
            'AA' // Multiple of 4 (00,04,08,..96)
          , 'AB' // Multiple of 4+1 (01,05,..97)
          , 'BA' // Multiple of 4+2 (02,06,..98)
          , 'BB' // Multiple of 4+3 (03,07,..99)
        ]
      , checksum = (10 * digits[0] + digits[1]) % 4
      , numberset = numbersets[checksum]
      ;
    return [
            '['
          , charSets[numberset[0]][digits[0]]
          , '\\'
          , charSets[numberset[1]][digits[1]]
        ].join('');
}

function compatibleAddOn5(digits) {
    const numbersets = ['BBAAA', 'BABAA', 'BAABA', 'BAAAB', 'ABBAA'
            , 'AABBA', 'AAABB', 'ABABA', 'ABAAB', 'AABAB']
      , [d1, d2, d3, d4, d5] = digits
      , checksum = ((d1 + d3 + d5) * 3 + (d2 + d4) * 9) % 10
      , numberset = numbersets[checksum]
      ;
    return ['['
          , charSets[numberset[0]][digits[0]]
          , '\\'
          , charSets[numberset[1]][digits[1]]
          , '\\'
          , charSets[numberset[2]][digits[2]]
          , '\\'
          , charSets[numberset[3]][digits[3]]
          , '\\'
          , charSets[numberset[4]][digits[4]]
        ].join('');
}

function input2didgits(input) {
    for(let i=0, l=input.length; i<l; i++) {
        const charcode = input[i].charCodeAt(0);
        if(charcode < 48 || charcode > 57) {
            throw new Error(`Non-digit character "${input[i]}" `
                        + `(${input[i].charCodeAt(0)}) found in: ${input};`);
        }
    }
    return Array.from(input).map(s=>[0,1,2,3,4,5,6,7,8,9][s]);
}

export default function encode(input) {
    const checkSumMarkerPos = input.indexOf('?')
      , checksumExcluded = checkSumMarkerPos !== -1
      , input_ = checksumExcluded
                    ? input.slice(0, checkSumMarkerPos)
                            + input.slice(checkSumMarkerPos+1)
                    : input
      , digits = input2didgits(input_)
      , result = []
      ;
    switch(digits.length + (checksumExcluded ? 1 : 0)) {
        case 18:
            {
            // EAN-13: 13 + 5
            // checksumExcluded: 12 + 5
            const addOn5 = digits.slice(-5)
              , ean13 = digits.slice(0, -5);
            if(checksumExcluded)
                ean13.push(checksumGTIN(ean13));
            result.push(compatibleEAN13(ean13)
                      , compatibleAddOn5(addOn5));
            }
            break;
        case 17:
            {
            // UPC-A: 12 + 5
            // checksumExcluded: 11 + 5
            const addOn5 = digits.slice(-5)
            // is handled as ean-13, thus prepending a 0
              , upca = [0, ...digits.slice(0, -5)];
            if(checksumExcluded)
                upca.push(checksumGTIN(upca));
            result.push(compatibleEAN13(upca)
                      , compatibleAddOn5(addOn5));
            }
            break;
        case 15:
            {
            // EAN-13: 13 + 2
            // checksumExcluded: 12 + 5
            const addOn2 = digits.slice(-2)
              , ean13 = digits.slice(0, -2);
            if(checksumExcluded)
                ean13.push(checksumGTIN(ean13));
            result.push(compatibleEAN13(ean13)
                      , compatibleAddOn2(addOn2));
            }
            break;
        case 14:
            {
            // UPC-A: 12 + 2
            // checksumExcluded: 11 + 2
            const addOn2 = digits.slice(-2)
              // is handled as ean-13, thus prepending a 0
              , upca = [0, ...digits.slice(0, -2)];
            if(checksumExcluded)
                upca.push(checksumGTIN(upca));
            result.push(compatibleEAN13(upca)
                      , compatibleAddOn2(addOn2));
            }
            break;
        case 13:
            {
            // EAN-13
            const ean13 = digits.slice();
            if(checksumExcluded)
                ean13.push(checksumGTIN(ean13));
            result.push(compatibleEAN13(ean13));
            }
            break;
        case 12:
            {
            // UPC-A
            // is handled as ean-13, thus prepending a 0
            const upca = [0, ...digits];
            if(checksumExcluded)
                upca.push(checksumGTIN(upca));
            result.push(compatibleEAN13(upca));
            }
            break;
        case 8:
            {
            // EAN-8
            const ean8 = digits.slice();
            if(checksumExcluded)
                ean8.push(checksumGTIN(ean8));
            result.push(compatibleEAN8(ean8));
            }
            break;
        // stand alone add-on are not standard but may have
        // a use case.
        case 5:
            // Add-On 5
            result.push(compatibleAddOn5(digits));
            break;
        case 2:
            // Add-On 2
            result.push(compatibleAddOn2(digits));
            break;
    }
    if(result.length) {
        return result.join('');
    }
    throw new Error(`Don't know how to handle input `
        + `length ${input.length} of "${input}".`);
}
