class self {

}
module.exports = self;
const R = require('ramda');
const isEmpty = require('lodash/isEmpty');
const isFunction = require('lodash/isFunction');
const Result = require('folktale/result');
const { keepIncludedIfRequest } = require('./included_prop');
const { validateParameters } = require('../parameter/validate');
const { getErrorType } = require('./utils');
const { pipeAwait } = require('../ramda/pipe');
const {
  isJsonApiRegisteringSuccessful,
} = require('./utils');
/**
 * Serializing data to JSONAPI format
 * @param  {string|string[]} include - the properties that be included in included property
 * @param {import('./typedefs').JsonApiUtils} jsonApiUtils - registerData included
 * @param  {import('./typedefs').Type} options.type  - json-api-serializer's type
 * @param  {any} options.extraData - json-api-serializer' extraData
 * @param  {Object|Object[]} data  - the data to convert
 * @return {Object|Object[]}
 */
const handleSerializeToJsonApi = R.curry(
  (
    config,
    include,
    {
      jsonApiRegister,
      jsonApiSerializer,
      registerData,
    },
    { type, extraData },
    data,
  ) => {
    const typeErrors = validateParameters(
      {
        include, jsonApiSerializer, type, extraData, data,
      },
      ['array', 'object', 'string', '*', 'object|array'],
    );
    const { useGenericError } = config;
    if (!isEmpty(typeErrors)) {
      return Result.Error(getErrorType(
        { useGenericError, boomErrorType: 'badData' },
        typeErrors,
      ));
    }
    if (isEmpty(data)) {
      return Result.Error(
        getErrorType({ useGenericError, boomErrorType: 'notFound' }, 'JSONAPI: No data provided'),
      );
    }
    if (isEmpty(type)) {
      return Result.Error(getErrorType(
        { useGenericError, boomErrorType: 'badData' },
        'type property not found in {type, extraData}',
      ));
    }
    // data is pass to jsonApiRegister because in some specific case
    // one needs to access to raw data
    if (isFunction(jsonApiRegister)) {
      const jsonApiRegistering = jsonApiRegister(jsonApiSerializer, registerData);
      if (!isJsonApiRegisteringSuccessful(jsonApiRegistering)) {
        return jsonApiRegistering;
      }
    }
    const serializedData = jsonApiSerializer.serialize(type, data, extraData);
    return Result.Ok(keepIncludedIfRequest(include, serializedData));
  },
);
/**
 * Serializing data to JSONAPI format and wrap it in foltale/result
 * @param  {string|string[]} include - the properties that be included in included property
 * @param {import('./typedefs').JsonApiUtils} jsonApiUtils - registerData excluded
 * @param  {import('./typedefs').Type} options.type
 * @param  {any} options.extraData - json-api-serializer' extraData
 * @param  {Object|Object[]} data  - the data to convert
 * @return {Object|Object[]}
 */
const createSerializeToJsonApi = R.curry(
  (
    config,
    include,
    {
      jsonApiRegister,
      jsonApiSerializer,
      registerData,
    },
    { type, extraData },
    dataResult,
  ) => {
    const typeErrors = validateParameters(
      {
        config,
      },
      ['object'],
    );
    const { useGenericError } = config;
    if (!isEmpty(typeErrors)) {
      return Result.Error(
        getErrorType(
          { useGenericError, boomErrorType: 'badData' },
          typeErrors,
        ),
      );
    }
    if (!Result.hasInstance(dataResult)) {
      return handleSerializeToJsonApi(
        config,
        include,
        {
          jsonApiRegister,
          jsonApiSerializer,
          registerData,
        },
        { type, extraData },
        dataResult,
      );
    }
    return dataResult.chain(
      (data) => handleSerializeToJsonApi(
        config,
        include,
        {
          jsonApiRegister,
          jsonApiSerializer,
          registerData,
        },
        { type, extraData },
        data,
      ),
    );
  },
);
const serializeToJsonApiGenericError = createSerializeToJsonApi({ useGenericError: true });
const serializeToJsonApiBoomError = createSerializeToJsonApi({ useGenericError: false });
/**
 * deserialize data into json api
 * @param  {import('./typedefs').DeserializeConfig} config
 * @param  {import('./typedefs').Type} type
 * @param  {import('./typedefs').JsonApiData} jsonApiData
 * @return {import('./typedefs').JsonApiData} deserialized json api
 */
const handleDeserializeJsonApi = R.curry(
  (jsonApiSerializer, type, jsonApiData) => {
    const deserializedData = jsonApiSerializer.deserialize(type, jsonApiData);
    return Result.Ok(deserializedData);
  },
);
/**
 * Deserialize jsonapi
 * @param  {import('./typedefs').DeserializeConfig} config
 * @param  {import('./typedefs').JsonApiRegister} jsonApiRegister
 * @param  {import('./typedefs').Type} type
 * @param  {import('./typedefs').JsonApiData} jsonApiData
 * @return {import('./typedefs').JsonApiData | import('./typedefs').JsonApiData
 * & import('../folktale/typedefs').FolktaleResult } jsonApiDataResult
 */
const deserializeJsonApi = R.curry(
  (
    config,
    { jsonApiRegister, registerData, jsonApiSerializer },
    type,
    jsonApiData,
  ) => {
    const typeErrors = validateParameters(
      {
        config, jsonApiSerializer, type, jsonApiData,
      },
      ['object', 'object', 'string', 'object|array'],
    );
    const { useGenericError } = config;
    if (!isEmpty(typeErrors)) {
      return Result.Error(getErrorType(
        { useGenericError, boomErrorType: 'badData' },
        typeErrors,
      ));
    }
    if (isFunction(jsonApiRegister)) {
      const jsonApiRegistering = jsonApiRegister(jsonApiSerializer, registerData);
      if (!isJsonApiRegisteringSuccessful(jsonApiRegistering)) {
        return jsonApiRegistering;
      }
    }
    if (!Result.hasInstance(jsonApiData)) {
      return handleDeserializeJsonApi(jsonApiSerializer, type, jsonApiData);
    }
    return jsonApiData.chain(
      (data) => handleDeserializeJsonApi(jsonApiSerializer, type, data),
    );
  },
);

const deserializeJsonApiGenericError = deserializeJsonApi({ useGenericError: true });
const deserializeJsonApiBoomError = deserializeJsonApi({ useGenericError: false });
/**
 * deserialize data  async into json api
 * @param  {import('./typedefs').DeserializeConfig} config
 * @param  {import('./typedefs').Type} type
 * @param  {import('./typedefs').JsonApiData} jsonApiData
 * @return {import('./typedefs').JsonApiData} deserialized json api
 */
const handleDeserializeJsonApiAsync = R.curry(
  async (jsonApiSerializer, type, jsonApiData) => {
    const deserializedData = await jsonApiSerializer.deserializeAsync(type, jsonApiData);
    return Result.Ok(deserializedData);
  },
);
/**
 * Deserialize jsonapi async
 * @param  {import('./typedefs').DeserializeConfig} config
 * @param  {import('./typedefs').JsonApiRegister} jsonApiRegister
 * @param  {import('./typedefs').Type} type
 * @param  {import('./typedefs').JsonApiData} jsonApiData
 * @return {import('./typedefs').JsonApiData
 * & import('../folktale/typedefs').FolktaleResult} jsonApiDataResult
 */
const deserializeJsonApiAsync = R.curry(
  async (
    config,
    { jsonApiRegister, registerData, jsonApiSerializer },
    type,
    jsonApiData) => {
    const typeErrors = validateParameters(
      {
        config, jsonApiSerializer, type, jsonApiData,
      },
      ['object', 'object', 'string', 'object|array'],
    );
    const { useGenericError } = config;
    if (!isEmpty(typeErrors)) {
      return Result.Error(
        getErrorType(
          { useGenericError, boomErrorType: 'badData' },
          typeErrors,
        ),
      );
    }
    if (!Result.hasInstance(jsonApiData)) {
      return handleDeserializeJsonApiAsync(jsonApiSerializer, type, jsonApiData);
    }
    if (isFunction(jsonApiRegister)) {
      const jsonApiRegistering = jsonApiRegister(jsonApiSerializer, registerData);
      if (!isJsonApiRegisteringSuccessful(jsonApiRegistering)) {
        return jsonApiRegistering;
      }
    }
    return jsonApiData.chain(
      async (data) => {
        const typeErrors = validateParameters(
          {
            data,
          },
          ['object|array'],
        );
        if (!isEmpty(typeErrors)) {
          return Result.Error(getErrorType(
            { useGenericError, boomErrorType: 'badData' },
            typeErrors,
          ));
        }
        return handleDeserializeJsonApiAsync(jsonApiSerializer, type, data);
      },
    );
  },
);
const deserializeJsonApiGenericErrorAsync = deserializeJsonApiAsync({ useGenericError: true });
const deserializeJsonApiBoomErrorAsync = deserializeJsonApiAsync({ useGenericError: false });

self.createSerializeToJsonApi = createSerializeToJsonApi;
self.serializeToJsonApiGenericError = serializeToJsonApiGenericError;
self.serializeToJsonApiBoomError = serializeToJsonApiBoomError;
self.handleSerializeToJsonApi = handleSerializeToJsonApi;
self.deserializeJsonApi = deserializeJsonApi;
self.deserializeJsonApiAsync = deserializeJsonApiAsync;
self.deserializeJsonApiGenericError = deserializeJsonApiGenericError;
self.deserializeJsonApiBoomError = deserializeJsonApiBoomError;
self.deserializeJsonApiGenericErrorAsync = deserializeJsonApiGenericErrorAsync;
self.deserializeJsonApiBoomErrorAsync = deserializeJsonApiBoomErrorAsync;
