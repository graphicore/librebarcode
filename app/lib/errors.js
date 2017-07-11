define([
    'Atem-Errors/errors'
], function(
    atemErrors
) {
    "use strict";
    var errors = Object.create(atemErrors)
      , makeError = atemErrors.makeError.bind(null, errors)
      ;
    makeError('Validation', undefined, errors.Error);

    return errors;
});
