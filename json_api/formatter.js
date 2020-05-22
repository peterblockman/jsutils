class self {

}
module.exports = self;
const R = require('ramda');
const isPlainObject = require('lodash/isPlainObject');
const isArray = require('lodash/isArray');
const isString = require('lodash/isString');
const isEmpty = require('lodash/isEmpty');
const Boom = require('@hapi/boom');
const Result = require('folktale/result');
const { keepIncludedIfRequest } = require('./included_prop');
const { validateParameters } = require('../parameter/validate');

/**
 * Serializing data to JSONAPI format
 * @param  {string|string[]} include - the properties that be included in included property
 * @param  {import('./typedefs').JsonApiRegister} jsonApiRegister
 * @param  {import('./typedefs').JsonApiSerializer} jsonApiSerializer
 * @param  {import('./typedefs').Type} options.type  - json-api-serializer's type
 * @param  {any} options.extraData - json-api-serializer' extraData
 * @param  {Object|Object[]} data  - the data to convert
 * @return {Object|Object[]}
 */
const serializeToJsonApi = R.curry(
  (
    include,
    jsonApiSerializer,
    { type, extraData },
    data,
  ) => {
    const serializedData = jsonApiSerializer.serialize(type, data, extraData);
    return keepIncludedIfRequest(include, serializedData);
  },
);
/**
 * Serializing data to JSONAPI format and wrap it in foltale/result
 * @param  {string|string[]} include - the properties that be included in included property
 * @param  {import('./typedefs').JsonApiRegister} jsonApiRegister
 * @param  {import('./typedefs').JsonApiSerializer} jsonApiSerializer
 * @param  {import('./typedefs').Type} options.type
 * @param  {any} options.extraData - json-api-serializer' extraData
 * @param  {Object|Object[]} data  - the data to convert
 * @return {Object|Object[]}
 */
const serializeToJsonApiWithResult = R.curry(
  (
    include,
    jsonApiSerializer,
    { type, extraData },
    data,
  ) => {
    if (isEmpty(data)) return Result.Error(Boom.notFound('JSONAPI: No data provided'));
    if (!isArray(data) && !isPlainObject(data)) {
      return Result
        .Error(Boom.badData('Data\'s type for JSONAPI serializing not supported'));
    }
    if (!isString(type)) {
      return Result
        .Error(Boom.badData('type property not found in {type, extraData}'));
    }
    return Result.Ok(
      serializeToJsonApi(
        include,
        jsonApiSerializer,
        { type, extraData },
        data,
      ),
    );
  },
);
/**
 * [description]
 * @param  {[type]} useNativeError [description]
 * @param  {[type]} errorMessage   [description]
 * @return {[type]}                [description]
 */
const getErrorType = R.curry(
  (useNativeError, errorMessage) => (
    useNativeError
      ? new Error(errorMessage)
      : Boom.badData(errorMessage)
  ),
);
/**
 * Deserialize jsonapi
 * @param  {import('./typedefs').DeserializeConfig} config
 * @param  {import('./typedefs').JsonApiRegister} jsonApiRegister
 * @param  {import('./typedefs').Type} type
 * @param  {import('./typedefs').JsonApiData} jsonApiData
 * @return {import('./typedefs').JsonApiData
 * & import('../folktale/typedefs').FolktaleResult} jsonApiData
 */
const deserializeJsonApi = R.curry(
  (config, jsonApiSerializer, type, jsonApiData) => {
    const typeErrors = validateParameters(
      {
        config, jsonApiSerializer, type, jsonApiData,
      },
      ['object', 'object', 'string', 'object|array'],
    );
    const { useNativeError } = config;
    if (!isEmpty(typeErrors)) return Result.Error(getErrorType(useNativeError, typeErrors));
    const deserializedData = jsonApiSerializer.deserialize(type, jsonApiData);
    return Result.Ok(deserializedData);
  },
);

const deserializeJsonApiNativeError = deserializeJsonApi({ useNativeError: true });
const deserializeJsonApiBoomError = deserializeJsonApi({ useNativeError: false });
/**
 * Deserialize jsonapi async
 * @param  {import('./typedefs').DeserializeConfig} config
 * @param  {import('./typedefs').JsonApiRegister} jsonApiRegister
 * @param  {import('./typedefs').Type} type
 * @param  {import('./typedefs').JsonApiData} jsonApiData
 * @return {import('./typedefs').JsonApiData
 * & import('../folktale/typedefs').FolktaleResult} jsonApiData
 */
const deserializeJsonApiAsync = R.curry(
  async (config, jsonApiSerializer, type, jsonApiData) => {
    const typeErrors = validateParameters(
      {
        config, jsonApiSerializer, type, jsonApiData,
      },
      ['object', 'object', 'string', 'object|array'],
    );
    const { useNativeError } = config;
    if (!isEmpty(typeErrors)) return Result.Error(useNativeError(useNativeError, typeErrors));
    const deserializedData = await jsonApiSerializer.deserializeAsync(type, jsonApiData);
    return Result.Ok(deserializedData);
  },
);
const deserializeJsonApiNativeErrorAsync = deserializeJsonApiAsync({ useNativeError: true });
const deserializeJsonApiBoomErrorAsync = deserializeJsonApiAsync({ useNativeError: false });

self.serializeToJsonApiWithResult = serializeToJsonApiWithResult;
self.serializeToJsonApi = serializeToJsonApi;
self.deserializeJsonApi = deserializeJsonApi;
self.deserializeJsonApiAsync = deserializeJsonApiAsync;
self.deserializeJsonApiNativeError = deserializeJsonApiNativeError;
self.deserializeJsonApiBoomError = deserializeJsonApiBoomError;
self.deserializeJsonApiNativeErrorAsync = deserializeJsonApiNativeErrorAsync;
self.deserializeJsonApiBoomErrorAsync = deserializeJsonApiBoomErrorAsync;
