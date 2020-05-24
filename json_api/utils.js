class self {

}
module.exports = self;
const R = require('ramda');
const Boom = require('@hapi/boom');
const Result = require('folktale/result');
const isEmpty = require('lodash/isEmpty');
const { isInsatanceOfFolktaleResultOk } = require('../folktale/instances');

/**
 * Get error type: generic Js Error or Boom error object
 * @param  {import('./typedefs').UseGenericError} useGenericError
 * @param  {string} errorMessage - error's message
 * @return {Error|Boom}
 */
const getErrorType = R.curry(
  (useGenericError, BoomErrorType, errorMessage) => (
    useGenericError
      ? new Error(errorMessage)
      : Boom[BoomErrorType](errorMessage)
  ),
);
/**
 * Check if jsonapi registering is successfully
 * condition:
 * - is instance of Result.Ok
 * - schemas is not empty
 * @param  {import('./typedefs').JsonApiSerializer} jsonApiSerializer
 * @return {boolean} it is not necessary to return a Result here as it only return boolean
 */
const isJsonApiRegisteringSuccessful = R.curry(
  (jsonApiSerializer) => {
    if (
      !isInsatanceOfFolktaleResultOk(jsonApiSerializer)
      || !Result.hasInstance(jsonApiSerializer)
    ) {
      return false;
    }
    const value = jsonApiSerializer.merge();
    return !isEmpty(R.prop('schemas')(value));
  },
);
self.getErrorType = getErrorType;
self.isJsonApiRegisteringSuccessful = isJsonApiRegisteringSuccessful;
