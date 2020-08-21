const R = require('ramda');
const isEmpty = require('lodash/isEmpty');
const isArray = require('lodash/isArray');
const isString = require('lodash/isString');
const isPlainObject = require('lodash/isPlainObject');
const toArray = require('lodash/toArray');
const Result = require('folktale/result');
const { unwrapResultList } = require('../folktale/instances');
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
  (include, jsonApiDataItem) => {
    // append included prop to avoild R.filter throw error
    const jsonApiDataToUse = !R.has('included', jsonApiDataItem)
      ? R.assoc('included', [], jsonApiDataItem)
      : jsonApiDataItem;
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
 * @param  {Object} jsonApiDataItem
 * @return {Object}
 */
const updateIncludedProps = R.curry(
  (include, jsonApiDataItem) => {
    const data = isEmpty(include)
      ? R.omit(['included'])(jsonApiDataItem)
      : updateIncludedPropsIfIncludeNotEmpty(include, jsonApiDataItem);
    return Result.Ok(data);
  },
);
/**
 * Keep included props of an json api object if request in query string
 * @param  {any} include - inlude from query string. Eg. ?inlcude=people
 * @param  {Array} jsonApiData - array of json api object
 * @return {Array}
 */
const handleKeepIncludedIfRequest = R.curry(
  (include, jsonApiData) => {
    if (isArray(jsonApiData)) {
      const data = R.map(
        updateIncludedProps(include),
      )(jsonApiData);
      return Result.Ok(unwrapResultList(data));
    } if (isPlainObject(jsonApiData)) {
      return updateIncludedProps(include, jsonApiData);
    }
    return Result.Ok(jsonApiData);
  },
);
const keepIncludedIfRequest = R.curry(
  (include, jsonApiData) => {
    if (!Result.hasInstance(jsonApiData)) {
      return handleKeepIncludedIfRequest(include, jsonApiData);
    }
    return jsonApiData.chain((data) => handleKeepIncludedIfRequest(include, data));
  },
);
module.exports = {
  updateIncludedProps,
  keepIncludedIfRequest,
};
