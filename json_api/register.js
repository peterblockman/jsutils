class self {

}
module.exports = self;
const R = require('ramda');
const isEmpty = require('lodash/isEmpty');
const Result = require('folktale/result');
const { validateParameters } = require('../parameter/validate');
const { getErrorType } = require('./utils');
const { pipeAwait } = require('../ramda/pipe');
const { axiosGet } = require('../axios/request');
const { withFolktaleResultChain } = require('../folktale/add_result');
/**
 * jsonapi register
 * @param  {import('./typedefs').JsonAPiSerializer} jsonApiSerializer
 * @param  {import('./typedefs').RegisterItem} registerData
 * @return {import('./typedefs').JsonAPiSerializer}
 */
const registerJsonApi = R.curry(
  (jsonApiSerializer, registerItem) => {
    const { type, schema, options } = registerItem;
    return !schema
      ? jsonApiSerializer.register(type, options)
      : jsonApiSerializer.register(type, schema, options);
  },
);
/**
 * Generate jsonapi register
 * @param  {import('./typedefs').JsonAPiSerializer} jsonApiSerializer
 * @param  {import('./typedefs').RegisterItem} registerData
 * @return  @return {import('./typedefs').JsonApiRegister
 * & import('../folktale/typedefs').FolktaleResult} jsonApiRegister
 */
const createGerenateJsonApiRegister = R.curry(
  (config, jsonApiSerializer, registerData) => {
    const typeErrors = validateParameters(
      { registerData },
      ['array'],
    );
    const { useNativeError } = config;
    if (!isEmpty(typeErrors)) {
      return Result.Error(
        getErrorType(useNativeError, 'badData', typeErrors),
      );
    }
    R.map(registerJsonApi(jsonApiSerializer))(registerData);
    return Result.Ok(jsonApiSerializer);
  },
);
const gerenateJsonApiRegisterNativeError = createGerenateJsonApiRegister({ useNativeError: true });
const gerenateJsonApiRegisterBoomError = createGerenateJsonApiRegister({ useNativeError: false });
/**
 * Fetch register data and register jsonapi's types
 * return a native Error if failed
 * @param {string} url
 * @param  {import('./typedefs').JsonApiRegister} jsonApiRegister
 * @return {import('./typedefs').JsonApiRegister
 * & import('../folktale/typedefs').FolktaleResult} jsonApiSerializer
 */
const fetchAndRegisterJsonApiNativeError = R.curry(
  async (url, jsonApiSerializer) => pipeAwait(
    axiosGet(url),
    withFolktaleResultChain(
      gerenateJsonApiRegisterNativeError(jsonApiSerializer),
    ),
  ),
);
/**
 * Fetch register data and register jsonapi's types
 * return a Boom Error if failed
 * @param {string} url
 * @param  {import('./typedefs').JsonApiRegister} jsonApiRegister
 * @return {import('./typedefs').JsonApiRegister
 * & import('../folktale/typedefs').FolktaleResult} jsonApiSerializer
 */
const fetchAndRegisterJsonApiBoomError = R.curry(
  async (url, jsonApiSerializer) => pipeAwait(
    axiosGet(url),
    withFolktaleResultChain(
      gerenateJsonApiRegisterBoomError(jsonApiSerializer),
    ),
  ),
);
self.createGerenateJsonApiRegister = createGerenateJsonApiRegister;
self.gerenateJsonApiRegisterNativeError = gerenateJsonApiRegisterNativeError;
self.gerenateJsonApiRegisterBoomError = gerenateJsonApiRegisterBoomError;
self.fetchAndRegisterJsonApiNativeError = fetchAndRegisterJsonApiNativeError;
self.fetchAndRegisterJsonApiBoomError = fetchAndRegisterJsonApiBoomError;
