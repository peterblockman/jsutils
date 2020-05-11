const R = require('ramda');
const isArray = require('lodash/isArray');

const { isEmpty } = require('lodash');
const { withFolktaleResultChain } = require('../folktale/add_result');

const lensMatching = (pred) => R.lens(
  R.find(pred), // getter
  (newVal, array) => {
    const index = R.findIndex(pred, array);
    return R.update(index, newVal, array);
  },
); // setter tell lens how to update
const makeLensMatchingBy = (key) => R.compose(
  lensMatching, //
  R.propEq(key), // take value and obj get the prop name id,
);
// updaters
const handleGetId = (id) => (isArray(id) ? R.path(id) : R.prop(id));
const handleLensId = (id) => (isArray(id) ? R.lensPath(id) : R.lensProp(id));
const mergeArrayAndGroupedArrayAsObj = R.curry(
  (key, oldArray, groupedNewArrayAsObj) => R.addIndex(R.reduce)(
    (acc, item) => {
      const itemKey = R.view(handleLensId(key), item);
      const groupedNewArrayItem = R.view(R.lensProp(itemKey), groupedNewArrayAsObj);
      if (groupedNewArrayItem) {
        acc = acc.concat([R.mergeDeepRight(item, groupedNewArrayItem[0])]);
      } else {
        acc = acc.concat(item);
      }
      return acc;
    },
    [],
  )(oldArray),
);
const merge2ArrayOfObj = R.curry((id, oldArray, newArray) => (!isEmpty(oldArray) && !isEmpty(newArray)
  ? R.pipe(
    R.groupBy(handleGetId(id)),
    mergeArrayAndGroupedArrayAsObj(id)(oldArray),
  )(newArray) : []));
const lensArrayOfObjNestedInObj = R.curry(({
  lensKeyLv1, lenKeysLv2, filterKey, mergeKey,
}, filterValue, currentData, newData) => {
  const lensFilter = R.compose(
    lensMatching, //
    R.propEq(filterKey), // take value and obj get the prop name id,
  );
  const keyLens = R.compose(
    R.lensProp(lensKeyLv1),
    lensFilter(filterValue),
    R.lensProp(lenKeysLv2),
  );
  return R.over(keyLens, R.flip(merge2ArrayOfObj(mergeKey))(newData), currentData);
});
const trace = (label) => (value) => {
  console.log(`${label}: ${JSON.stringify(value)}`);
  return value;
};
/**
 * Works like R.prop, return a folktale result
 * @param  {string} key   - key to prop
 * @param  {FolktaleResult} - the value must be an object
 * @return {FolktaleResult}
 */
const rPropWithFolktaleResult = R.curry(
  (key, result) => withFolktaleResultChain(R.prop(key), result),
);
/**
 * Works like R.head, return a folktale result
 * @param  {string} key   - key to prop
 * @param  {FolktaleResult} result - the value must be an array
 * @return {FolktaleResult}
 */
const rHeadWithFolktaleResult = R.curry(
  (result) => withFolktaleResultChain(R.head, result),
);
module.exports = {
  merge2ArrayOfObj,
  lensArrayOfObjNestedInObj,
  trace,
  lensMatching,
  makeLensMatchingBy,
  rPropWithFolktaleResult,
  rHeadWithFolktaleResult,
};
