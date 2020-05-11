const R = require('ramda');
const isEmpty = require('lodash/isEmpty');
const isArray = require('lodash/isArray');
const isString = require('lodash/isString');
const isPlainObject = require('lodash/isPlainObject');
const toArray = require('lodash/toArray');

/**
 * Concert include to array
 * @param  {any} include
 * @return {Array}
 */
const convertIncludeToArray = R.curry(
  (include) => {
    if (isArray(include)) return include;
    return isString(include) ? [include] : toArray(include);
  },
);
/**
 * Update included props when include is not empty
 * @param  {any} include - inlude from query string. Eg. ?inlcude=people
 * @param  {Object} jsonApiObject
 * @return {Object}
 */
const updateIncludedPropsIfIncludeNotEmpty = R.curry(
  (include, jsonApiObject) => {
    // append included prop to avoild R.filter throw error
    const jsonApiObjectToUse = !R.prop('included', jsonApiObject)
      ? R.assoc('included', [], jsonApiObject)
      : jsonApiObject;
    const includeToUse = convertIncludeToArray(include);
    const setIncluded = R.flip(R.set(R.lensProp('included')));
    const updatedJsonApiObject = R.pipe(
      R.prop('included'),
      R.filter((item) => R.includes(item.type, includeToUse)),
      setIncluded(jsonApiObjectToUse),
    )(jsonApiObjectToUse);
    return isEmpty(updatedJsonApiObject.included)
      ? R.omit(['included'])(jsonApiObjectToUse)
      : updatedJsonApiObject;
  },
);
/**
 * Update included props of an json api object
 * @param  {any} include - inlude from query string. Eg. ?inlcude=people
 * @param  {Object} jsonApiObject
 * @return {Object}
 */
const updateIncludedProps = R.curry(
  (include, jsonApiObject) => (
    isEmpty(include)
      ? R.omit(['included'])(jsonApiObject)
      : updateIncludedPropsIfIncludeNotEmpty(include, jsonApiObject)),
);
/**
 * Keep included props of an json api object if request in query string
 * @param  {any} include - inlude from query string. Eg. ?inlcude=people
 * @param  {Array} jsonApiObjects - array of json api object
 * @return {Array}
 */
const keepIncludedIfRequest = R.curry(
  (include, jsonApiObjects) => {
    if (isArray(jsonApiObjects)) {
      return R.map(
        updateIncludedProps(include),
      )(jsonApiObjects);
    } if (isPlainObject(jsonApiObjects)) {
      return updateIncludedProps(include, jsonApiObjects);
    }
    return jsonApiObjects;
  },
);
module.exports = {
  updateIncludedProps,
  keepIncludedIfRequest,
};
