class self {

}
module.exports = self;
const R = require('ramda');
const Result = require('folktale/result');
const isArray = require('lodash/isArray');
const isPlainObject = require('lodash/isPlainObject');
const Boom = require('@hapi/boom');

const instances = {
  Ok: Result.Ok,
  Error: Result.Error,
};
const createIsResult = R.curry(
  (instances, instanceType, itemToCheck) => instances[instanceType].hasInstance(itemToCheck),
);
const isResult = createIsResult(instances);
const isOk = isResult('Ok');
const isError = isResult('Error');

const handleIsEveryItemOk = R.curry(
  (data) => {
    if (isArray(data)) {
      return R.all(isOk, data);
    }
    return false;
  },
);
const isEveryItemOk = R.curry((result) => {
  if (!Result.hasInstance(result)) return handleIsEveryItemOk(result);
  result.chain((data) => handleIsEveryItemOk(data));
});
// this function is deplicated use R.sequence
const hanleUnwrapResultList = R.curry(
  (data) => {
    if (!isArray(data)) {
      return data;
    }
    if (isEveryItemOk(data)) {
      return R.map(
        (item) => item.merge(),
        data,
      );
    }
    if (R.any(isError, data)) {
      // return the error message
      return R.pipe(
        R.filter(isError),
        R.map((item) => {
          const values = item.merge();
          if (values instanceof Error) {
            return values.message;
          }
          if (Boom.isBoom(values)) {
            return R.view(
              R.lensPath(['output', 'payload', 'message']),
              values,
            );
          }
          return values;
        }),
        R.join(' '),
      )(data);
    }
    // mixed between Ok and normal data type
    return R.map(
      (item) => (
        isOk(item)
          ? item.merge()
          : item
      ),
      data,
    );
  },
);
/**
 * Unwrap folttake result list
 * if resultInput's data is an array, unwrap all item in the array then:
 * - return an array of unwraped item, there is no Error
 * - return a string message, if there is an Error
 * if esultInput's data is an array, return the data
 * @param  {FolktaleResult|Array} resultInput
 * @return {any}
 */
const unwrapResultList = R.curry(
  (resultInput) => {
    if (!Result.hasInstance(resultInput)) return hanleUnwrapResultList(resultInput);
    return resultInput.chain((data) => hanleUnwrapResultList(data));
  },
);
self.isOk = isOk;
self.isError = isError;
self.isEveryItemOk = isEveryItemOk;
self.unwrapResultList = unwrapResultList;
