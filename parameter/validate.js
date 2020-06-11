class self {

}
module.exports = self;
const R = require('ramda');
const { validate } = require('bycontract');

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
const validateParametersThrow = validate;

self.validateParameter = validateParameter;
self.validateParameters = validateParameters;
self.validateParametersThrow = validateParametersThrow;
