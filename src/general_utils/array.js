class self {

}
module.exports = self;
const R = require('ramda');

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
const convertArrayToObject = R.curry(
  (key, array) => {
    const data = R.reduce(
      predicate(key),
      {},
      array,
    );
    return data;
  },
);

self.convertArrayToObject = convertArrayToObject;
