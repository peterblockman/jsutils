const self = class {

};
module.exports = self;

const R = require('ramda');
const RA = require('ramda-adjunct');
const isPlainObject = require('lodash/isPlainObject');
const isArray = require('lodash/isArray');
const {
  trace,
} = require('../general_utils/ramda_utils');

/**
 * @typedef  {Object} BoomErrorPayload - Boom error payload
 * @property BoomErrorPayload.statusCode - HTTP status code
 * @property BoomErrorPayload.message - error's message
 * @property BoomErrorPayload.error - error's name
 *
 * @typedef  {Object} ErrorMessageData - contains JSONAPI error object properties
 * @property ErrorMessageData.message - error's message
 * @property ErrorMessageData.pointer - error's pointer
 * @property ErrorMessageData.parameter - error's parameter
 * More information: https://jsonapi.org/format/#error-objects
 */

/**
 * Split the message in errorPayload into: message, pointer and parameter
 * @param  {BoomErrorPayload} errorPayload
 * @return {Object}
 */
const splitErrorMessageAndPointer = R.curry(
  (errorPayload) => {
    const { message } = errorPayload;
    const splitMessage = R.split('_')(message);
    const [newMessage, pointer, parameter] = splitMessage;
    // splitMessage.length >= 3: only allow 1 message, 1 pointer and 1 parameter
    const isSplitMessageValid = splitMessage.length <= 3 && splitMessage.length >= 1;
    return isSplitMessageValid
      ? {
        message: newMessage,
        pointer,
        parameter,
      }
      : errorPayload;
  },
);
/**
 * Update error with JSONAPI's error object params
 * @param  {BoomErrorPayload} errorPayload
 * @param  {ErrorMessageData} newErrorMessageData
 * @return {Object}
 */
const updateError = R.curry(
  (errorPayload, newErrorMessageData) => {
    const { message, pointer, parameter } = newErrorMessageData;
    const messageLens = R.lensProp('message');
    const pointerLens = R.lensPath(['source', 'pointer']);
    const parameterLens = R.lensPath(['source', 'parameter']);
    return R.or(pointer, parameter)
      ? R.pipe(
        R.set(messageLens, message),
        R.set(pointerLens, pointer),
        R.set(parameterLens, parameter),
        RA.renameKeys({ statusCode: 'status', message: 'detail', error: 'title' }),
      )(errorPayload)
      : RA.renameKeys({ statusCode: 'status', message: 'detail', error: 'title' })(errorPayload);
  },
);
/**
 * Convert a Boom error payload to JSONAPI error
 * @param  {BoomErrorPayload} errorPayload)
 * @return {Object}
 */
const convertToJsonApiErrorIfSingleError = R.curry(
  (errorPayload) => R.pipe(
    splitErrorMessageAndPointer,
    updateError(errorPayload),
    (x) => [x], // JSONAPI always return an array
    R.flip(R.assoc('errors'))({}),
  )(errorPayload),
);
/**
* Convert Array of Boom error payload to JSONAPI error
* @param  {BoomErrorPayload} errorPayload
* @return {Array}
*/
const convertToJsonApiErrorIfMultipleErrors = R.curry(
  (errorPayload) => R.pipe(
    R.map(convertToJsonApiErrorIfSingleError),
    R.flip(R.assoc('errors'))({}),
  )(errorPayload),
);
/**
 * Convert Boom error payload to JSONAPI error
 * @param  {BoomErrorPayload} errorPayload
 * @return {Array}
 */
const convertToJsonApiError = R.curry(
  (errorPayload) => {
    if (isPlainObject(errorPayload)) {
      return convertToJsonApiErrorIfSingleError(errorPayload);
    } if (isArray(errorPayload)) {
      return convertToJsonApiErrorIfMultipleErrors(errorPayload);
    }
    return errorPayload;
  },
);
self.splitErrorMessageAndPointer = splitErrorMessageAndPointer;
self.updateError = updateError;
self.convertToJsonApiError = convertToJsonApiError;
