const R = require('ramda');

const flattenDataProp = R.curry(
  (jsonApiObject) => {
    const setData = R.flip(R.set(R.lensProp('data')));
    return R.pipe(
      R.prop('data'),
      R.flatten,
      setData(jsonApiObject),
    )(jsonApiObject);
  },
);
module.exports = {
  flattenDataProp,
};
