class self {

}
module.exports = self;
const R = require('ramda');
const Result = require('folktale/result');
const isEmpty = require('lodash/isEmpty');
const { validateParameters } = require('../parameter/validate');

const predicate = R.curry(
  (key, acc, item) => {
    // get the value of the key
    const value = item[key];
    const valueInAcc = R.clone(acc[value]);
    // order of if matters
    if (valueInAcc) {
      acc[value] = R.concat(acc[value], [item]);
    }
    if (!valueInAcc) {
      acc[value] = [item];
    }
    return acc;
  },
);
const handleConvertArrayToObject = R.curry(
  (key, array) => {
    const typeErrors = validateParameters(
      {
        key, array,
      },
      ['string', 'array'],
    );
    if (!isEmpty(typeErrors)) {
      return Result.Error(typeErrors);
    }
    const data = R.reduce(
      predicate(key),
      {},
      array,
    );
    return Result.Ok(data);
  },
);
const convertArrayToObject = R.curry(
  (key, array) => {
    if (!Result.hasInstance(array)) {
      return handleConvertArrayToObject(key, array);
    }
    return array.chain((data) => handleConvertArrayToObject(key, data));
  },
);
self.convertArrayToObject = convertArrayToObject;
