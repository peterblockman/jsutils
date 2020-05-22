class self {

}
module.exports = self;
const R = require('ramda');
const isEmpty = require('lodash/isEmpty');
const Result = require('folktale/result');
const Boom = require('@hapi/boom');
const { validateParameters } = require('../parameter/validate');

const registerJsonApi = R.curry(
  (jsonApiSerializer, registerItem) => {
    const { type, schema, options } = registerItem;
    return !schema
      ? jsonApiSerializer.register(type, options)
      : jsonApiSerializer.register(type, schema, options);
  },
);
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
