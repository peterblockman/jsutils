const self = class {

};
module.exports = self;
const R = require('ramda');
const { chain } = require('../folktale/add_result');

/**
 * Works like R.prop, return a folktale result
 * @param  {string} key   - key to prop
 * @param  {FolktaleResult} - the value must be an object
 * @return {FolktaleResult}
 */
const rPropWithFolktaleResult = R.curry(
  (key, result) => chain(R.prop(key), result),
);
/**
 * Works like R.head, return a folktale result
 * @param  {string} key   - key to prop
 * @param  {FolktaleResult} result - the value must be an array
 * @return {FolktaleResult}
 */
const rHeadWithFolktaleResult = R.curry(
  (result) => chain(R.head, result),
);


/**
 * Works like R.omit, return a folktale result
 * @param  {Array} keys   - keys to omit
 * @param  {FolktaleResult} result - the value must be an object
 * @return {FolktaleResult}
 */
const rOmitWithFolktaleResult = R.curry(
  (keys, result) => chain(R.omit(keys), result),
);
/**
 * Works like R.pick, return a folktale result
 * @param  {Array} keys   - keys to pick
 * @param  {FolktaleResult} result - the value must be an object
 * @return {FolktaleResult}
 */
const rPickWithFolktaleResult = R.curry(
  (keys, result) => chain(R.pick(keys), result),
);
/**
 * Works like R.merge, return a folktale result
 * @param  {Object} firstObject   - first object to merge
 * @param  {FolktaleResult} result - the value must be an object
 * @return {FolktaleResult}
 */
const rMergeWithFolktaleResult = R.curry(
  (firstObject, result) => chain(R.merge(firstObject), result),
);
self.rPropWithFolktaleResult = rPropWithFolktaleResult;
self.rHeadWithFolktaleResult = rHeadWithFolktaleResult;
self.rOmitWithFolktaleResult = rOmitWithFolktaleResult;
self.rPickWithFolktaleResult = rPickWithFolktaleResult;
self.rMergeWithFolktaleResult = rMergeWithFolktaleResult;
