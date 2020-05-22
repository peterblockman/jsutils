class self {

}
module.exports = self;
const R = require('ramda');
const Boom = require('@hapi/boom');

/**
 * [description]
 * @param  {import('./typedefs').UseNativeError} useNativeError
 * @param  {string} errorMessage - error's message
 * @return {Error|Boom}
 */
const getErrorType = R.curry(
  (useNativeError, BoomErrorType, errorMessage) => (
    useNativeError
      ? new Error(errorMessage)
      : Boom[BoomErrorType](errorMessage)
  ),
);

self.getErrorType = getErrorType;
