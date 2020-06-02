class self {

}
module.exports = self;
const R = require('ramda');
const Boom = require('@hapi/boom');
const Result = require('folktale/result');
const isEmpty = require('lodash/isEmpty');
const isPlainObject = require('lodash/isPlainObject');
const isArray = require('lodash/isArray');
const { isInsatanceOfFolktaleResultOk } = require('../folktale/instances');
const {
  jsonApiKeys, jsonApiEssentialkeys, jsonApiDataEssentialKeys, jsonApiDataKeys,
} = require('./constants');
const { trace } = require('../ramda/trace');

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

const handleGetJsonApiDataKeys = R.curry((data) => {
  if (isPlainObject(data)) return R.keys(data);
  if (isArray(data)) return R.map(R.keys, data);
});
const handleFlatten = (keys) => (!keys ? [] : R.flatten(keys));
const getJsonApiDataKeys = R.curry(
  (data) => R.pipe(
    R.prop('data'),
    handleGetJsonApiDataKeys,
    handleFlatten,
  )(data),
);
const createIsJsonApi = R.curry(
  (
    jsonApiKeys,
    jsonApiEssentialkeys,
    jsonApiDataKeys,
    jsonApiDataEssentialKeys,
    data,
  ) => {
    if (isEmpty(data)) return false;
    const keys = R.pipe(
      R.keys,
      R.filter((x) => R.includes(x, jsonApiKeys)),
    )(data);
    const essentialKeys = R.filter((x) => R.includes(x, jsonApiEssentialkeys), keys);
    const dataKeys = R.pipe(
      getJsonApiDataKeys,
      R.filter((x) => R.includes(x, jsonApiDataKeys)),
    )(data);
    const dataEssentialkeys = R.pipe(
      getJsonApiDataKeys,
      R.filter((x) => R.includes(x, jsonApiDataEssentialKeys)),
    )(data);

    const isKeysValid = !isEmpty(keys) && !isEmpty(essentialKeys);
    const isDataKeysValid = !isEmpty(dataKeys) && !isEmpty(dataEssentialkeys);
    return isKeysValid && isDataKeysValid;
  },
);
const isJsonApi = createIsJsonApi(
  jsonApiKeys,
  jsonApiEssentialkeys,
  jsonApiDataKeys,
  jsonApiDataEssentialKeys,
);
self.getErrorType = getErrorType;
self.isJsonApiRegisteringSuccessful = isJsonApiRegisteringSuccessful;
self.isJsonApi = isJsonApi;
