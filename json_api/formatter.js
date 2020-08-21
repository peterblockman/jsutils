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
const { isReduxAction, isRejectAction } = require('../redux/utils');

const createFormatData = (
  formatFn,
  jsonApiSerializer,
  type,
  jsonApiData,
  ...args
) => {
  if (isReduxAction(jsonApiData)) {
    const { type: actionType, payload } = jsonApiData;
    if (isRejectAction(actionType)) {
      return jsonApiData;
    }
    const deserializedData = jsonApiSerializer[formatFn](type, payload, ...args);
    return { type: actionType, payload: deserializedData };
  }
  const formatedData = jsonApiSerializer[formatFn](type, jsonApiData, ...args);
  return Result.Ok(formatedData);
};

const serialize = R.curryN(
  5,
  createFormatData,
)('serialize');
const deserialize = R.curryN(
  4,
  createFormatData,
)('deserialize');
const createFormatDataAsync = async (
  formatFn,
  jsonApiSerializer,
  type,
  jsonApiData,
  ...args
) => {
  if (isReduxAction(jsonApiData)) {
    const { type: actionType, payload } = jsonApiData;
    if (isRejectAction(actionType)) {
      return jsonApiData;
    }
    const deserializedData = await jsonApiSerializer[formatFn](type, payload, ...args);
    return { type: actionType, payload: deserializedData };
  }
  const formatedData = await jsonApiSerializer[formatFn](type, jsonApiData, ...args);
  return Result.Ok(formatedData);
};
const deserializeAsync = R.curryN(
  4,
  createFormatDataAsync,
)('deserializeAsync');
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
        jsonApiSerializer, type, extraData, data,
      },
      ['object', 'string', '*', 'object|array'],
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
    const includeToUse = include || [];
    return R.pipe(
      serialize(jsonApiSerializer, type, data),
      keepIncludedIfRequest(includeToUse),
    )(extraData);
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
 * Deserialize jsonapi
 * if one pass on redux action {type, payload}, instead of return Result
 * it will return the action object.
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
      return deserialize(jsonApiSerializer, type, jsonApiData);
    }
    return jsonApiData.chain(
      (data) => deserialize(jsonApiSerializer, type, jsonApiData),
    );
  },
);

const deserializeJsonApiGenericError = deserializeJsonApi({ useGenericError: true });
const deserializeJsonApiBoomError = deserializeJsonApi({ useGenericError: false });

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
      return Result.Error(
        getErrorType(
          { useGenericError, boomErrorType: 'badData' },
          typeErrors,
        ),
      );
    }
    if (!Result.hasInstance(jsonApiData)) {
      return deserializeAsync(jsonApiSerializer, type, jsonApiData);
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
        return deserializeAsync(jsonApiSerializer, type, data);
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
