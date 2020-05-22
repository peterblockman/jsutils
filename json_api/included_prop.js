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
 * @param  {Object} jsonApiData
 * @return {Object}
 */
const updateIncludedPropsIfIncludeNotEmpty = R.curry(
  (include, jsonApiData) => {
    // append included prop to avoild R.filter throw error
    const jsonApiDataToUse = !R.prop('included', jsonApiData)
      ? R.assoc('included', [], jsonApiData)
      : jsonApiData;
    const includeToUse = convertIncludeToArray(include);
    const setIncluded = R.flip(R.set(R.lensProp('included')));
    const updatedJsonApiObject = R.pipe(
      R.prop('included'),
      R.filter((item) => R.includes(item.type, includeToUse)),
      setIncluded(jsonApiDataToUse),
    )(jsonApiDataToUse);
    return isEmpty(updatedJsonApiObject.included)
      ? R.omit(['included'])(jsonApiDataToUse)
      : updatedJsonApiObject;
  },
);
/**
 * Update included props of an json api object
 * @param  {any} include - inlude from query string. Eg. ?inlcude=people
 * @param  {Object} jsonApiData
 * @return {Object}
 */
const updateIncludedProps = R.curry(
  (include, jsonApiData) => (
    isEmpty(include)
      ? R.omit(['included'])(jsonApiData)
      : updateIncludedPropsIfIncludeNotEmpty(include, jsonApiData)),
);
/**
 * Keep included props of an json api object if request in query string
 * @param  {any} include - inlude from query string. Eg. ?inlcude=people
 * @param  {Array} jsonApiDatas - array of json api object
 * @return {Array}
 */
const keepIncludedIfRequest = R.curry(
  (include, jsonApiDatas) => {
    if (isArray(jsonApiDatas)) {
      return R.map(
        updateIncludedProps(include),
      )(jsonApiDatas);
    } if (isPlainObject(jsonApiDatas)) {
      return updateIncludedProps(include, jsonApiDatas);
    }
    return jsonApiDatas;
  },
);
module.exports = {
  updateIncludedProps,
  keepIncludedIfRequest,
};
