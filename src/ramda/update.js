class self {

}
module.exports = self;
const R = require('ramda');

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
const handleGetId = (id) => (Array.isArray(id) ? R.path(id) : R.prop(id));
const handleLensId = (id) => (Array.isArray(id) ? R.lensPath(id) : R.lensProp(id));
const handleMergeItem = R.curry((oldArrayItem, groupedNewArrayItem) => R.map(
  R.mergeDeepRight(oldArrayItem),
)(groupedNewArrayItem));
const mergeArrayAndGroupedArray = R.curry(
  (key, oldArray, groupedNewArrayAsObj) => R.addIndex(R.reduce)(
    (acc, item) => {
      const itemKey = R.view(handleLensId(key), item);
      const groupedNewArrayItem = R.view(R.lensProp(itemKey), groupedNewArrayAsObj);
      if (groupedNewArrayItem) {
        acc = acc.concat(handleMergeItem(item, groupedNewArrayItem));
      } else {
        acc = acc.concat(item);
      }
      return acc;
    },
    [],
  )(oldArray),
);
const merge2ArrayOfObj = R.curry((id, oldArray, newArray) => R.pipe(
  R.groupBy(handleGetId(id)),
  mergeArrayAndGroupedArray(id)(oldArray),
)(newArray));
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

self.merge2ArrayOfObj = merge2ArrayOfObj;
self.lensArrayOfObjNestedInObj = lensArrayOfObjNestedInObj;

self.lensMatching = lensMatching;
self.makeLensMatchingBy = makeLensMatchingBy;
