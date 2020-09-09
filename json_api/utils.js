class self {

}
module.exports = self;
const R = require('ramda');
const Boom = require('@hapi/boom');
const Result = require('folktale/result');
const isEmpty = require('lodash/isEmpty');
const isArray = require('lodash/isArray');
const isPlainObject = require('lodash/isPlainObject');
const { isOk } = require('../folktale/instances');
const {
  jsonApiKeys, jsonApiEssentialkeys, jsonApiDataEssentialKeys, jsonApiDataKeys,
} = require('./constants');
const { trace } = require('../ramda/trace');
const {
  validateParameters,
} = require('../parameter/validate');
/**
 * Get error type: generic Js Error or Boom error object
 * @param  {import('./typedefs').UseGenericError} useGenericError
 * @param  {string} errorMessage - error's message
 * @return {Error|Boom}
 */
const getErrorType = R.curry(
  ({ useGenericError, boomErrorType }, errorMessage) => (
    useGenericError
      ? new Error(errorMessage)
      : Boom[boomErrorType](errorMessage)
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
      !isOk(jsonApiSerializer)
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
  /**
   * Hanlde function for getTypeAndAttrubutes
   * @param  {Object} jsonapiObject
   * @return {Object}
   */
const handleGetTypeAndAttrubutes = R.curry(
  (jsonapiObject) => {
    const typeErrors = validateParameters({ jsonapiObject }, ['object']);
    if (!isEmpty(typeErrors)) return Result.Error(new Error(typeErrors));
    const pickTypeAttributes = R.pick(['type', 'attributes']);
    return R.pipe(
      R.omit(['jsonapi', 'meta', 'links', 'included']),
      R.over(
        R.lensProp('data'),
        (lenedData) => (isArray(lenedData)
          ? R.map(pickTypeAttributes, lenedData)
          : pickTypeAttributes(lenedData)),
      ),
      Result.Ok,
    )(jsonapiObject);
  },
);
/**
 * Get type and attributes only from an jsonapi object
 * @param  {FolktaleResult|Object} result
 * @return {Object}
 */
const getTypeAndAttrubutes = R.curry(
  (result) => {
    if (!Result.hasInstance(result)) {
      return handleGetTypeAndAttrubutes(result);
    }
    return result.chain((data) => handleGetTypeAndAttrubutes(data));
  },
);
/**
 * getId of an jsonapi object
 * this function does not return Result
 * due to the fact that it is mostly use in selector
 * @param {Object} jsonApiData
 */
const getId = R.view(R.lensPath(['data', 'id']));
/**
 * get attributes of an jsonapi object
 * this function does not return Result
 * due to the fact that it is mostly use in selector
 * @param {Object} jsonApiData
 */
const getAttributes = R.view(R.lensPath(['data', 'attributes']));
/**
 * get relationships of an jsonapi object
 * this function does not return Result
 * due to the fact that it is mostly use in selector
 * @param {Object} jsonApiData
 */
const getRelationships = R.view(R.lensPath(['data', 'relationships']));
/**
 * get links of an jsonapi object
 * this function does not return Result
 * due to the fact that it is mostly use in selector
 * @param {Object} jsonApiData
 */
const getLinks = R.view(R.lensPath(['data', 'links']));
const getRelatedLinks = R.pipe(
  getLinks,
  R.prop('related'),
);
const getSelfLinks = R.pipe(
  getLinks,
  R.prop('self'),
);
/**
 * get type of an jsonapi object
 * this function does not return Result
 * due to the fact that it is mostly use in selector
 * @param {Object} jsonApiData
 */
const getType = R.view(R.lensPath(['data', 'type']));

/**
 * get meta data of an jsonapi object
 * this function does not return Result
 * due to the fact that it is mostly use in selector
 * @param {Object} jsonApiData
 */
const getMeta = R.view(R.lensPath(['meta']));

self.getErrorType = getErrorType;
self.isJsonApiRegisteringSuccessful = isJsonApiRegisteringSuccessful;
self.isJsonApi = isJsonApi;
self.getTypeAndAttrubutes = getTypeAndAttrubutes;
self.getId = getId;
self.getAttributes = getAttributes;
self.getLinks = getLinks;
self.getRelatedLinks = getRelatedLinks;
self.getSelfLinks = getSelfLinks;
self.getType = getType;
self.getMeta = getMeta;
self.getRelationships = getRelationships;
