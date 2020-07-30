class self {

}
module.exports = self;
const R = require('ramda');
const { validate } = require('bycontract');
const isEmpty = require('lodash/isEmpty');
const { getErrorType } = require('../json_api/utils');
/**
 * Validate parameter of a function
 * @param  {import('./typedefs').ParameterToValidate} arg
 * @return {string}
 */
const validateParameter = R.curry((arg, type) => {
  const [key, value] = arg;
  try {
    validate(value, type);
    return null;
  } catch (err) {
    return `${key} ${err.message}`;
  }
});
/**
 * Validate parameters of a function. Returns a string of errors.
 * if there is no error return an empty string
 * @param  {import('./typedefs').ParametersToValidate} args
 * @return {string} error message
 */
const validateParameters = R.curry((args, types) => {
  const mapIndexed = R.addIndex(R.map);
  const argsArray = R.toPairs(args);
  return R.pipe(
    mapIndexed((arg, index) => validateParameter(arg, types[index])),
    R.filter((value) => value != null),
    R.join(', '),
  )(argsArray);
});


const createValidateParametersThrow = R.curry((config, args, types) => {
  const { useGenericError } = config;
  const mapIndexed = R.addIndex(R.map);
  const argsArray = R.toPairs(args);
  const typeErrors = R.pipe(
    mapIndexed((arg, index) => validateParameter(arg, types[index])),
    R.filter((value) => value != null),
    R.join(', '),
  )(argsArray);
  if (!isEmpty(typeErrors)) throw getErrorType({ useGenericError, boomErrorType: 'badData' }, typeErrors);
  return args;
});
const validateParametersThrowGenericError = createValidateParametersThrow({ useGenericError: true });
const validateParametersThrowBoomError = createValidateParametersThrow({ useGenericError: false });

self.validateParameter = validateParameter;
self.validateParameters = validateParameters;
self.createValidateParametersThrow = createValidateParametersThrow;
self.validateParametersThrowGenericError = validateParametersThrowGenericError;
self.validateParametersThrowBoomError = validateParametersThrowBoomError;
