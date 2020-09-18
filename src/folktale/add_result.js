const R = require('ramda');
const Result = require('folktale/result');
const Boom = require('@hapi/boom');
const { isOk, isError } = require('./instances');


/**
 * Chain function with folktale Result.chain
 * @param  {Function} func  - the function that will be chained
 * @param  {FolktaleResult} result -  foltale result
 * @return {FolktaleResult}
 */
const chain = R.curry(
  (func, result) => {
    if (!R.or(
      isOk(result),
      isError(result),
    )) {
      return Result.Error(Boom.badData('Input must be an instance of Result.Ok or Result.Error'));
    }
    return result.chain((data) => {
      const output = func(data);
      if (Result.hasInstance(output)) return output;
      return Result.Ok(output);
    });
  },
);
/**
 * Chain function with folktale Result.chain Async
 * @param  {Function} asyncFunc  - the async function that will be chained
 * @param  {FolktaleResult} result -  foltale result
 * @return {FolktaleResult}
 */
const chainAsync = R.curry(
  async (asyncFunc, result) => {
    if (!R.or(
      isOk(result),
      isError(result),
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
 * sometime we has to pass a value instead of folktale/result
 * @param  {string|Object} errorMessage - error message to pass to Result.Error or it can be Boom.Error(errorMessage)
 * @param  {Function} conditionFunction - a function that take 1 argument and return boolean
 * @param  {any} value  - the value to pass to Reuslt.Ok
 * @return {FolktaleResult}
 */
const returnOkOrError = R.curry(
  (conditionFunction, errorMessage, value) => {
    const getResult = (errorMessage, data) => (conditionFunction(data)
      ? Result.Ok(data)
      : Result.Error(errorMessage));
    if (Result.hasInstance(value)) {
      return value.chain(
        (data) => getResult(errorMessage, data),
      );
    }
    return getResult(errorMessage, value);
  },
);
/**
 * Return Result Ok or Error base on a the boolean value
 * return from !conditionFunction (! ís read bang)
 * @param  {string|BoomError} errorMessage - error message or Boom Error object to pass to Result.Error
 * @param  {Function} conditionFunction - a function that take 1 argument and return boolean
 * @param  {any} value  - the value to pass to Reuslt.Ok
 * @return {FolktaleResult}
 */
const returnOkOrErrorNotLogic = R.curry(
  (conditionFunction, errorMessage, value) => {
    const getResult = (errorMessage, data) => (!conditionFunction(data)
      ? Result.Ok(data)
      : Result.Error(errorMessage));
    if (Result.hasInstance(value)) {
      return value.chain(
        (data) => getResult(errorMessage, data),
      );
    }
    return getResult(errorMessage, value);
  },
);


module.exports = {
  returnOkOrError,
  returnOkOrErrorNotLogic,
  chain,
  chainAsync,
};
