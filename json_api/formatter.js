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
const { pipeAwait } = require('../ramda/pipe');
const { axiosGet } = require('../axios/request');
/**
 * [description]
 * @param  {[type]} useNativeError [description]
 * @param  {[type]} errorMessage   [description]
 * @return {[type]}                [description]
 */
const getErrorType = R.curry(
  (useNativeError, BoomErrorType, errorMessage) => (
    useNativeError
      ? new Error(errorMessage)
      : Boom[BoomErrorType](errorMessage)
  ),
);
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
const handleSerializeToJsonApi = R.curry(
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
const createSerializeToJsonApi = R.curry(
  (
    config,
    include,
    jsonApiSerializer,
    { type, extraData },
    data,
  ) => {
    const typeErrors = validateParameters(
      {
        config, jsonApiSerializer, type, extraData, data,
      },
      ['object', 'object', 'string', '*', 'object|array'],
    );
    const { useNativeError } = config;
    if (!isEmpty(typeErrors)) return Result.Error(getErrorType(useNativeError, 'badData', typeErrors));
    if (isEmpty(data)) {
      return Result.Error(
        getErrorType(useNativeError, 'notFound', 'JSONAPI: No data provided'),
      );
    }
    if (!isArray(data) && !isPlainObject(data)) {
      return Result.Error(getErrorType(
        useNativeError,
        'badData',
        'Data\'s type for JSONAPI serializing not supported',
      ));
    }
    if (!isString(type)) {
      return Result.Error(getErrorType(
        useNativeError,
        'badData',
        'type property not found in {type, extraData}',
      ));
    }
    return Result.Ok(
      handleSerializeToJsonApi(
        include,
        jsonApiSerializer,
        { type, extraData },
        data,
      ),
    );
  },
);
const serializeToJsonApiNativeError = createSerializeToJsonApi({ useNativeError: true });
const serializeToJsonApiBoomError = createSerializeToJsonApi({ useNativeError: false });
/**
 * Fetch register data and serialize jsonapi
 * return a native Error if failed
 * @param {string} url
 * @param  {import('./typedefs').DeserializeConfig} config
 * @param  {import('./typedefs').JsonApiRegister} jsonApiRegister
 * @param  {import('./typedefs').Type} type
 * @param  {import('./typedefs').JsonApiData} jsonApiData
 * @return {import('./typedefs').JsonApiData
 * & import('../folktale/typedefs').FolktaleResult} jsonApiData
 */
const fetchRegisterAndSerializeJsonApiNativeError = R.curry(
  async (
    url,
    include,
    jsonApiSerializer,
    { type, extraData },
    data,
  ) => pipeAwait(
    axiosGet(url),
    serializeToJsonApiNativeError(include,
      jsonApiSerializer,
      { type, extraData },
      data),
  ),
);
/**
 * Fetch register data and serialize jsonapi
 * return a Boom Error if failed
 * @param {string} url
 * @param  {import('./typedefs').DeserializeConfig} config
 * @param  {import('./typedefs').JsonApiRegister} jsonApiRegister
 * @param  {import('./typedefs').Type} type
 * @param  {import('./typedefs').JsonApiData} jsonApiData
 * @return {import('./typedefs').JsonApiData
 * & import('../folktale/typedefs').FolktaleResult} jsonApiData
 */
const fetchRegisterAndSerializeJsonApiBoomError = R.curry(
  async (
    url,
    include,
    jsonApiSerializer,
    { type, extraData },
    data,
  ) => pipeAwait(
    axiosGet(url),
    serializeToJsonApiBoomError(
      include,
      jsonApiSerializer,
      { type, extraData },
      data,
    ),
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
    if (!isEmpty(typeErrors)) return Result.Error(getErrorType(useNativeError, 'badData', typeErrors));
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
    if (!isEmpty(typeErrors)) return Result.Error(useNativeError(useNativeError, 'badData', typeErrors));
    const deserializedData = await jsonApiSerializer.deserializeAsync(type, jsonApiData);
    return Result.Ok(deserializedData);
  },
);
const deserializeJsonApiNativeErrorAsync = deserializeJsonApiAsync({ useNativeError: true });
const deserializeJsonApiBoomErrorAsync = deserializeJsonApiAsync({ useNativeError: false });

/**
 * Fetch register data and deserialize jsonapi
 * return a native Error if failed
 * @param {string} url
 * @param  {import('./typedefs').DeserializeConfig} config
 * @param  {import('./typedefs').JsonApiRegister} jsonApiRegister
 * @param  {import('./typedefs').Type} type
 * @param  {import('./typedefs').JsonApiData} jsonApiData
 * @return {import('./typedefs').JsonApiData
 * & import('../folktale/typedefs').FolktaleResult} jsonApiData
 */
const fetchRegisterAndDeserializeJsonApiNativeError = R.curry(
  async (url, jsonApiSerializer, type, jsonApiData) => pipeAwait(
    axiosGet(url),
    deserializeJsonApiNativeErrorAsync(jsonApiSerializer, type, jsonApiData),
  ),
);
/**
 * Fetch register data and deserialize jsonapi
 * return a Boom Error if failed
 * @param {string} url
 * @param  {import('./typedefs').DeserializeConfig} config
 * @param  {import('./typedefs').JsonApiRegister} jsonApiRegister
 * @param  {import('./typedefs').Type} type
 * @param  {import('./typedefs').JsonApiData} jsonApiData
 * @return {import('./typedefs').JsonApiData
 * & import('../folktale/typedefs').FolktaleResult} jsonApiData
 */
const fetchRegisterAndDeserializeJsonApiBoomError = R.curry(
  async (url, jsonApiSerializer, type, jsonApiData) => pipeAwait(
    axiosGet(url),
    deserializeJsonApiBoomErrorAsync(jsonApiSerializer, type, jsonApiData),
  ),
);
self.createSerializeToJsonApi = createSerializeToJsonApi;
self.serializeToJsonApiNativeError = serializeToJsonApiNativeError;
self.serializeToJsonApiBoomError = serializeToJsonApiBoomError;
self.handleSerializeToJsonApi = handleSerializeToJsonApi;
self.deserializeJsonApi = deserializeJsonApi;
self.deserializeJsonApiAsync = deserializeJsonApiAsync;
self.deserializeJsonApiNativeError = deserializeJsonApiNativeError;
self.deserializeJsonApiBoomError = deserializeJsonApiBoomError;
self.deserializeJsonApiNativeErrorAsync = deserializeJsonApiNativeErrorAsync;
self.deserializeJsonApiBoomErrorAsync = deserializeJsonApiBoomErrorAsync;
self.fetchRegisterAndDeserializeJsonApiNativeError = fetchRegisterAndDeserializeJsonApiNativeError;
self.fetchRegisterAndDeserializeJsonApiBoomError = fetchRegisterAndDeserializeJsonApiBoomError;
self.fetchRegisterAndSerializeJsonApiNativeError = fetchRegisterAndSerializeJsonApiNativeError;
self.fetchRegisterAndSerializeJsonApiBoomError = fetchRegisterAndSerializeJsonApiBoomError;
