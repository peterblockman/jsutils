const {
  isEmpty,
  chain,
  map,
  pick,
  omit,
  groupBy,
  uniqWith,
  uniqBy,
  sortBy,
  isNumber,
} = require('lodash');
const isPlainObject = require('lodash/isPlainObject');
const toNumber = require('lodash/toNumber');
const isString = require('lodash/isString');
const isArray = require('lodash/isArray');
const chunk = require('lodash/chunk');
const sumBy = require('lodash/fp/sumBy');
const countBy = require('lodash/fp/countBy');
const endsWith = require('lodash/fp/endsWith');
const Promise = require('bluebird');
const R = require('ramda');
const RA = require('ramda-adjunct');
const { regexExp } = require('./constants');
const { trace } = require('./ramda_utils');

const getMaxOfArray = (arrayData) => (
  Math.max.apply(Math, arrayData.data.map((o) => o[arrayData.key]))
);
const pipeAwait = (...functions) => (input) => functions.reduce((chain, func) => chain.then(func), Promise.resolve(input));
// TODO change it so it is easier to scale
const groupQueryResult = (
  lv1GroupBy,
  lv1Picks,
  lv2GroupBy,
  lv2Picks,
  lv2GroupKey,
  lv3Picks,
  lv3GroupKey,
  extra,
) => async (data) => Promise.all(
  chain(data)
    .groupBy(lv1GroupBy)
    .map((i) => {
      if (!lv2GroupBy) return { ...pick(i[0], lv1Picks) };
      const extraData = {
        [lv3GroupKey]: [],
      };
      const lv2GroupData = lv3GroupKey
        ? chain(i)
          .map((v) => pick(v, lv2Picks))
          .groupBy(lv2GroupBy)
          .map((k) => {
            k = sortBy(k, ['sigOrder']);
            const lv3Data = map(k, (o) => omit(o, lv3Picks.omit));
            if (!extraData[lv3GroupKey][0] && extra) extraData[lv3GroupKey] = [...lv3Data];
            return {
              ...pick(k[0], lv3Picks.pick),
              [lv3GroupKey]: lv3Data,
            };
          })
          .value()
        : chain(i)
          .groupBy(lv2GroupBy)
          .map((v) => map(v, (o) => pick(o, lv2Picks)))
          .flatten()
          .value();
      return {
        ...pick(i[0], lv1Picks),
        ...extra && { ...extraData },
        [lv2GroupKey]: lv2GroupData,
      };
    })
    .value(),
);

/*
@Param: groupStructure<Array> -[{groupName: '', groupByKey: '', groupProps: []}]
*/
const groupObjectPropsByStructure = R.curry((item, structure) => {
  const { groupName, groupProps } = structure;
  return R.reduce(
    (acc, subItem) => {
      acc = {
        ...R.omit(groupProps)(subItem),
        [groupName]: acc[groupName].concat([R.pick(groupProps)(subItem)]),
      };
      return acc;
    }, { [groupName]: [] },
  )(item);
});
const groupObjectsPropsByStructures = R.curry((groupStructures, item) => R.pipe(
  R.slice(1, groupStructures.length),
  R.reduce(groupObjectPropsByStructure, item),
)(groupStructures));
const groupDeep = R.curry(
  (groupStructures, data) => {
    const { groupKey } = groupStructures[0];
    return R.pipe(
      R.groupBy((x) => x[groupKey]),
      RA.toArray,
      R.map(groupObjectsPropsByStructures(groupStructures)),
    )(data);
  },
);


const getWhereInArray = (objectsArray) => objectsArray.map((object) => Object.values(object));
const groupData = (groupByKey) => (data) => Object.values(groupBy(data, groupByKey));
const sortData = (sortByKey) => (data) => Object.values(sortBy(data, [sortByKey]));

const isPartiesUnique = (arrUserId, othUserId) => (arrUserId === othUserId);
const uniquifyParties = (arrVal, othVal) => {
  const { userId: arrUserId, publicKey: arrPublicKey } = arrVal;
  const { userId: othUserId, publicKey: othPublicKey } = othVal;

  return isPartiesUnique(arrUserId, othUserId);
};
const removeDuplicatePartiesInAddresses = async (addresses) => {
  const uniquePartiesAddresses = await Promise.map(addresses, (adrressItem) => {
    const { parties } = adrressItem;
    const uniqueParties = uniqWith(parties, uniquifyParties);
    return {
      ...adrressItem,
      parties: uniqueParties,
    };
  });
  return uniquePartiesAddresses;
};
const uniqByHOC = (iteratee) => (array) => uniqBy(array, iteratee);
const alwaysReturnArray = (item) => (isArray(item) ? item : [item]);
// UPDATE
const addItemToArrayObj = (item) => (array) => array.map((i) => ({ ...i, ...item }));
const updateObjInArray = R.curry(
  (comparingKey, itemToUpdate, array) => array.map((i, arrayIndex) => {
    const shoudUpdate = isNumber(comparingKey)
      ? comparingKey === arrayIndex
      : i[comparingKey] !== undefined ? i[comparingKey] === itemToUpdate[comparingKey] : false;
    return shoudUpdate
      ? R.mergeDeepRight(i, itemToUpdate)
      : i;
  }),
);
const getPropertyFromObj = (key) => (obj) => obj[key];
const injectPropertyBackToObj = (key) => (obj) => (data) => ({ ...obj, [key]: data });
const updateArrayInObj = R.curry(({ obj, updatingKey, comparingKey }, itemToUpdate) => R.pipe(
  getPropertyFromObj(updatingKey),
  updateObjInArray(comparingKey)(itemToUpdate),
  injectPropertyBackToObj(updatingKey)(obj),
)(obj));
const mergeArrayAndGroupedArrayAsObj = (key) => (array) => (groupedArrayAsObj) => R.map(
  (item) => R.merge(item, groupedArrayAsObj[item[key]][0]),
)(array);
const merge2ArrayOfObj = (id) => (array1) => (array2) => R.pipe(
  R.groupBy(R.prop(id)),
  mergeArrayAndGroupedArrayAsObj(id)(array1),
)(array2);

// LENS
const multipleKeysLens = (keys) => R.lens(R.pick(keys), (x, s) => R.merge(s, R.pick(keys, x)));

const lensMatching = (pred) => R.lens(
  R.find(pred), // getter
  (newVal, array) => {
    const index = R.findIndex(pred, array);
    if (isPlainObject(newVal)) {
      return updateObjInArray(newVal, index, array);
    }
    return R.update(index, newVal, array);
  },
);
/**
 * Split string by a delimiter
 * if input is an Array return input
 * @param  {string}  delimiter
 * @param  {string|Array} input
 * @return {Array}
 */
const splitBy = R.curry(
  (delimiter, input) => (
    !isArray(input) && input
      ? R.split(delimiter, input)
      : input
  ),
);
const splitByDot = splitBy('.');
const splitByDash = splitBy('_');
const splitByComma = splitBy(',');

const extractBeforeDot = (domainName) => splitByDot(domainName)[0];
const removeAllNumber = (string) => string.replace(regexExp.matchNumberRegex, '');

const getFuntion = R.curry((functions, type) => R.prop(type)(functions));
const handleGetFunction = R.curry((functions, type) => {
  const fn = getFuntion(functions, type);
  if (!fn) throw new Error('Function not found');
  return fn;
});
const parseArrayQueries = R.curry((queries) => (isString(queries) ? R.map(JSON.parse)(queries) : queries));
const parseJsonQuery = R.curry((queries) => (isString(queries) ? JSON.parse(queries) : queries));
const parseQuery = R.curry((queries) => (isArray(queries) ? parseArrayQueries(queries) : parseJsonQuery(queries)));
const getQueryBy = R.curry((key, queries) => {
  const prop = R.prop(key)(queries);
  return prop ? parseQuery(prop) : parseQuery(queries);
});
const getQueryByQ = getQueryBy('q');

/**
 * Convert input from type string 'true', 'false' to type boolean true, false
 * @param  {input} input string
 * @return {boolean}
 */
const checkBooleanQuery = (input) => {
  switch (true) {
    case isString(input) && !isEmpty(input):
      return input === 'true';
    default:
      return Boolean(input);
  }
};
const chooseMainnetOrTestnet = (useTestNet) => (checkBooleanQuery(useTestNet) ? 'testnet' : 'mainnet');
const endsWithSlash = endsWith('/');
const appendUrlWithSlash = (url) => (endsWithSlash(url) ? url : `${url}/`);
const getStringByte = (string) => Buffer.byteLength(string, 'utf8');
const handleSumBy = R.curry((sumKey, item) => {
  const prop = R.prop(sumKey)(item);
  return toNumber(prop) || 0;
});
const sumFromList = R.curry((sumKey, list) => sumBy(handleSumBy(sumKey))(list));
const countItemBy = R.curry((iteratee, array) => R.pipe(
  countBy(iteratee),
  R.prop('true'),
)(array));
const countItemByKey = R.curry((key, value, array) => countItemBy(
  (x) => x[key] === value, array,
));
/**
 * Convert an object to an array of objects
 * @param  {Object}
 * @return {Array}
 */
const objectToArrayOfObjects = R.curry((obj) => R.pipe(
  R.toPairs,
  R.map(([key, value]) => ({ [key]: value })),
)(obj));

/**
 * chunk an object into smaller size
 * @param  {number}
 * @param  {Object}
 * @return {Object}
 */
const chunkObject = R.curry(
  (chunkSize, obj) => R.pipe(objectToArrayOfObjects, chunk(chunkSize))(obj),
);
/**
 * @param  {Array} array
 * @return {boolean}
 */
const isArrayOfObjects = R.curry(
  (array) => isArray(array) && R.all((item) => isPlainObject(item))(array),
);
/**
 * @param  {Array} array
 * @return {boolean}
 */
const isArrayOfStrings = R.curry(
  (array) => isArray(array) && R.all((item) => isString(item))(array),
);
  /**
   * Generate a number in [min, max] range with fixed length from a string
   * @param  {number} min
   * @param  {number} max
   * @param  {number} numberLen
   * @return {number}
   */
const generateRamdonNumber = R.curry(
  (min, max, numberLen, string) => {
    let str = '';
    for (const i in string) {
      str += string.charCodeAt(i);
    }
    let number = '';
    for (let i = 0; i < numberLen; i++) {
      const random = Math.floor(Math.random() * (max - min + 1)) + min;
      number += str[random];
    }
    return number;
  },
);
  /**
   * reduce function
   * @param  {string} left  the accumulation value, start with firt index value
   * @param  {string} right value on the right
   * @return {sting}
   */
const compareStringLength = R.curry(
  (left, right) => (left.length <= right.length ? left : right),
);
const findShortestStringIfNotEmpty = R.curry(
  (strings) => (
    isArray(strings)
      ? R.reduce(compareStringLength, strings[0], strings)
      : R.pipe(
        R.values,
        R.reduce(compareStringLength, R.values(strings)[0]),
      )(strings)
  ),
);
/**
   * Return the shortest sting from an array of string
   * @param  {string[]} strings [description]
   * @return {string}
   */
const findShortestString = R.curry(
  (strings) => (isEmpty(strings)
    ? ''
    : findShortestStringIfNotEmpty(strings)
  ),
);
const appendWith = R.curry((suffix, string) => string + suffix);
const appendWithDollarSign = appendWith('$');
const prependWith = R.curry((prefix, string) => prefix + string);
const prependWithCarat = prependWith('^');
/**
 * check if string have delimeter
 * @param  {string} delimeter
 * @param  {string} string
 * @return {boolean}
 */
const isStringWithDelimeter = R.curry(
  (delimeter, string) => R.includes(delimeter, string),
);
const isStringWithComma = isStringWithDelimeter(',');

module.exports = {
  getMaxOfArray,
  pipeAwait,
  groupQueryResult,
  getWhereInArray,
  groupData,
  isPartiesUnique,
  uniquifyParties,
  removeDuplicatePartiesInAddresses,
  uniqByHOC,
  alwaysReturnArray,
  sortData,
  addItemToArrayObj,
  updateObjInArray,
  updateArrayInObj,
  multipleKeysLens,
  lensMatching,
  merge2ArrayOfObj,
  extractBeforeDot,
  removeAllNumber,
  handleGetFunction,
  getQueryByQ,
  chooseMainnetOrTestnet,
  appendUrlWithSlash,
  splitByDash,
  splitByComma,
  splitBy,
  groupDeep,
  getStringByte,
  sumFromList,
  countItemByKey,
  chunkObject,
  isArrayOfObjects,
  isArrayOfStrings,
  generateRamdonNumber,
  findShortestString,
  appendWith,
  appendWithDollarSign,
  prependWith,
  prependWithCarat,
  isStringWithDelimeter,
  isStringWithComma,
};
