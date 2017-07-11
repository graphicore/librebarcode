define([
    'LibreBarcode/errors'
], function(
    errors
) {
    "use strict";

    var ValidationError = errors.Validation;

    function validateNumber(name, value) {
        if (value !== value)
            throw new ValidationError('"' + name + '" is NaN (not a number).');

        if (typeof value !== 'number')
            throw new ValidationError('"' + name + '" must be a number type, '
                            + 'but is: ' + typeof value + '.');
        if (!isFinite(value))
            throw new ValidationError('"' + name + '" must be a finite number, '
                            + 'but is: ' + value + '.');
    }

    function validatePositiveNumber(name, value){
        validateNumber(name, value);
        if (value <= 0)
            throw new ValidationError('"' + name + '" must be bigger than zero.');
    }

    function validateMinMax(name, value, min, max) {
        if(value < min || value > max)
            throw new ValidationError('The "'+name+'" must be '
                                + 'min ' + min + ' and max ' + max
                                + ' but is: ' + value + '.');
    }

    function validate(validators, defaultDict, userDict) {
        // jshint validthis:true
        // this is called with the host object of validators as thisArg
        var result = Object.create(null)
          , k, i, l
          ;
        for(k in defaultDict)
            result[k] = defaultDict[k];
        for (k in userDict)
            result[k] = userDict[k];

        for(i=0,l=validators.length;i<l;i++) {
            // expect ValidationError to bubble up and halt the program.
            try {
                validators[i].call(this, result);
            }
            catch(err) {
                if(!(err instanceof ValidationError))
                    throw err;
                // it is an ValidationError
                if(!result.force) {
                    errors.warn('Use --force to let validation errors pass.');
                    // re-raise
                    throw err;
                }
                errors.warn(err.message);
            }
        }
        return result;
    }


    return {
        validate: validate
      , validateNumber: validateNumber
      , validatePositiveNumber: validatePositiveNumber
      , validateMinMax: validateMinMax
    };
});
