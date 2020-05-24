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
const { rPropWithFolktaleResult } = require('../ramda/ramda_folktale');

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
    const { useGenericError } = config;
    if (!isEmpty(typeErrors)) {
      return Result.Error(
        getErrorType(useGenericError, 'badData', typeErrors),
      );
    }
    R.map(registerJsonApi(jsonApiSerializer))(registerData);
    return Result.Ok(jsonApiSerializer);
  },
);
const gerenateJsonApiRegisterGenericError = createGerenateJsonApiRegister(
  { useGenericError: true },
);
const gerenateJsonApiRegisterBoomError = createGerenateJsonApiRegister(
  { useGenericError: false },
);
/**
 * Fetch register data and register jsonapi's types
 * return a generic Error if failed
 * @param {string} url
 * @param  {import('./typedefs').JsonApiRegister} jsonApiRegister
 * @return {import('./typedefs').JsonApiRegister
 * & import('../folktale/typedefs').FolktaleResult} jsonApiSerializer
 */
const fetchAndRegisterJsonApiGenericError = R.curry(
  async (url, jsonApiSerializer) => pipeAwait(
    axiosGet,
    rPropWithFolktaleResult('data'),
    withFolktaleResultChain(
      gerenateJsonApiRegisterGenericError(jsonApiSerializer),
    ),
  )(url),
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
    axiosGet,
    rPropWithFolktaleResult('data'),
    withFolktaleResultChain(
      gerenateJsonApiRegisterBoomError(jsonApiSerializer),
    ),
  )(url),
);
self.createGerenateJsonApiRegister = createGerenateJsonApiRegister;
self.gerenateJsonApiRegisterGenericError = gerenateJsonApiRegisterGenericError;
self.gerenateJsonApiRegisterBoomError = gerenateJsonApiRegisterBoomError;
self.fetchAndRegisterJsonApiGenericError = fetchAndRegisterJsonApiGenericError;
self.fetchAndRegisterJsonApiBoomError = fetchAndRegisterJsonApiBoomError;
