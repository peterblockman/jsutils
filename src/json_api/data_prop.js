const R = require('ramda');

const flattenDataProp = R.curry(
  (jsonApiData) => {
    const setData = R.flip(R.set(R.lensProp('data')));
    return R.pipe(
      R.prop('data'),
      R.flatten,
      setData(jsonApiData),
    )(jsonApiData);
  },
);
module.exports = {
  flattenDataProp,
};
