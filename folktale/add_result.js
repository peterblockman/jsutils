const R = require('ramda');
const Result = require('folktale/result');
const Boom = require('@hapi/boom');
const { isInsatanceOfFolktaleResultOk, isInsatanceOfFolktaleResultError } = require('./instances');


/**
 * Chain function with folktale Result.chain
 * @param  {Function} func  - the function that will be chained
 * @param  {FolktaleResult} result -  foltale result
 * @return {FolktaleResult}
 */
const withFolktaleResultChain = R.curry(
  (func, result) => {
    if (!R.or(
      isInsatanceOfFolktaleResultOk(result),
      isInsatanceOfFolktaleResultError(result),
    )) {
      return Result.Error(Boom.badData('Input must be an instance of Result.Ok or Result.Error'));
    }
    return result.chain((data) => Result.Ok(func(data)));
  },
);
/**
 * Chain function with folktale Result.chain Async
 * @param  {Function} asyncFunc  - the async function that will be chained
 * @param  {FolktaleResult} result -  foltale result
 * @return {FolktaleResult}
 */
const withFolktaleResultChainAsync = R.curry(
  async (asyncFunc, result) => {
    if (!R.or(
      isInsatanceOfFolktaleResultOk(result),
      isInsatanceOfFolktaleResultError(result),
    )) {
      return Result.Error(Boom.badData('Input must be an instance of Result.Ok or Result.Error'));
    }
    return result.chain(async (data) => {
      const output = await asyncFunc(data);
      if (Result.hasInstance(output)) return output;
      return Result.Ok(output);
    });
  },
);
/**
 * Return Result Ok or Error base on a boolean value returned from conditionFunction
 * @param  {string|Object} errorMessage - error message to pass to Result.Error or it can be Boom.Error(errorMessage)
 * @param  {Function} conditionFunction - a function that take 1 argument and return boolean
 * @param  {any} value  - the value to pass to Reuslt.Ok
 * @return {FolktaleResult}
 */
const returnResultOkOrError = R.curry(
  (conditionFunction, errorMessage, value) => (
    conditionFunction(value)
      ? Result.Ok(value)
      : Result.Error(errorMessage)),
);
/**
 * Return Result Ok or Error base on a the boolean value
 * return from !conditionFunction (! ís read bang)
 * @param  {string|BoomError} errorMessage - error message or Boom Error object to pass to Result.Error
 * @param  {Function} conditionFunction - a function that take 1 argument and return boolean
 * @param  {any} value  - the value to pass to Reuslt.Ok
 * @return {FolktaleResult}
 */
const returnResultOkOrErrorNotLogic = R.curry(
  (conditionFunction, errorMessage, value) => (
    !conditionFunction(value)
      ? Result.Ok(value)
      : Result.Error(errorMessage)),
);

module.exports = {
  returnResultOkOrError,
  returnResultOkOrErrorNotLogic,
  withFolktaleResultChain,
  withFolktaleResultChainAsync,
};
