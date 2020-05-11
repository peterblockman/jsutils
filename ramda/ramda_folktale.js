const self = class {

};
module.exports = self;
const R = require('ramda');
const { withFolktaleResultChain } = require('../folktale/add_result');

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

self.rPropWithFolktaleResult = rPropWithFolktaleResult;
self.rHeadWithFolktaleResult = rHeadWithFolktaleResult;
