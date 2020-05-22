class self {

}
module.exports = self;
const R = require('ramda');
const isEmpty = require('lodash/isEmpty');
const Result = require('folktale/result');
const Boom = require('@hapi/boom');
const { validateParameters } = require('../parameter/validate');
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
const gerenateJsonApiRegister = R.curry(
  (jsonApiSerializer, registerData) => {
    const typeErrors = validateParameters(
      { registerData },
      ['array'],
    );
    if (!isEmpty(typeErrors)) return Result.Error(Boom.badData(typeErrors));
    R.map(registerJsonApi(jsonApiSerializer))(registerData);
    return Result.Ok(jsonApiSerializer);
  },
);
self.gerenateJsonApiRegister = gerenateJsonApiRegister;
