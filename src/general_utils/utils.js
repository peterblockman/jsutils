const {
  isEmpty,
} = require('lodash');
const isPlainObject = require('lodash/isPlainObject');
const toNumber = require('lodash/toNumber');
const isString = require('lodash/isString');
const isArray = require('lodash/isArray');
const chunk = require('lodash/chunk');
const uniqBy = require('lodash/uniqBy');
const uniqWith = require('lodash/uniqWith');
const groupBy = require('lodash/groupBy');
const sortBy = require('lodash/sortBy');
const chain = require('lodash/chain');
const isNumber = require('lodash/isNumber');
const pick = require('lodash/pick');
const map = require('lodash/map');
const omit = require('lodash/omit');

const sumBy = require('lodash/fp/sumBy');
const countBy = require('lodash/fp/countBy');
const endsWith = require('lodash/fp/endsWith');
const R = require('ramda');
const { Decimal } = require('decimal.js');
const { regexExp } = require('./constants');

const { emailRegex } = regexExp;

const getMaxOfArray = (arrayData) => (
  Math.max.apply(Math, arrayData.data.map((o) => o[arrayData.key]))
);

// UPDATE
const addItemToArrayObj = (item) => (array) => array.map((i) => ({ ...i, ...item }));
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
const splitByAtMark = splitBy('@');
const extractDomainFromEmail = (email) => splitByAtMark(email)[0];
const validateEmail = (email) => emailRegex.test(email);


const extractBeforeDot = (domainName) => splitByDot(domainName)[0];
const removeAllNumber = (string) => string.replace(regexExp.matchNumberRegex, '');
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
const removeLastSlash = (url) => (
  endsWithSlash(url)
    ? R.slice(0, -1, url)
    : url
);
const getStringByte = (string) => Buffer.byteLength(string, 'utf8');
const handleSumBy = R.curry((sumKey, item) => {
  const prop = R.prop(sumKey)(item);
  return toNumber(prop) || 0;
});
/**
 * Convert targets object's props to number
 * @param  {Object} object -  the object
 * @return {Object}
 */
const toNumbers = R.curry(
  (targetKeys, object) => R.pipe(
    R.pick(targetKeys),
    R.map(toNumber),
    R.merge(object),
  )(object),
);
const toStatoshis = (amount) => {
  const satoshis = new Decimal(amount).times(100000000);
  return Number(satoshis);
};
const toCrypto = (amount) => {
  const crypto = new Decimal(amount).div(100000000);
  return Number(crypto);
};
const weiToEther = (amount) => {
  const ether = new Decimal(amount).div(1000000000000000000);
  return Number(ether);
};
const gweiToEther = (amount) => {
  const ether = new Decimal(amount).div(1000000000);
  return Number(ether);
};
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

const sliceLongValue = (value) => `*${value.slice(-20)}`;
const handleNonLastValue = (value) => (validateEmail(value) ? extractDomainFromEmail(value) : value);
const isValueTooLong = (value, maxLabelElementLength) => value.length >= maxLabelElementLength;
const combineLabelAndValue = R.curry((seperator, label, value) => `${label}${seperator} ${value}`);
const combineLabelAndValueByColon = combineLabelAndValue(':');
const makeSelectLabel = (label, value, valueTooLong) => {
  if (valueTooLong) {
    return R.pipe(
      sliceLongValue,
      combineLabelAndValueByColon(label),
    )(value);
  }
  return R.pipe(
    handleNonLastValue,
    combineLabelAndValueByColon(label),
  )(value);
};
const append = R.curry(
  (string, stringToAppend, separator) => (
    stringToAppend
      ? string + stringToAppend + separator
      : string),
);

const getValues = R.curry((labelKeys, data) => labelKeys.map((item) => {
  const { key, label } = item;
  return {
    label,
    value: data[key],
  };
}));

const generateLabels = R.curry((maxLabelElementLength, labelKeys, data) => {
  const handleReduce = (acc, item, index, array) => {
    const { value, label } = item;
    if (value) {
      const valueTooLong = isValueTooLong(value, maxLabelElementLength);
      const newValue = makeSelectLabel(label, value, valueTooLong);
      const isNotLastValue = index + 1 !== array.length;
      const separator = isNotLastValue ? '/' : '';
      acc = append(acc, newValue, separator);
    }
    return acc;
  };
  return !isEmpty(labelKeys)
    ? R.pipe(
      getValues(labelKeys),
      R.addIndex(R.reduce)(handleReduce, ''),
    )(data)
    : data;
});
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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function withCancel(fn, cancelled, dispatch) {
  return (...args) => {
    if (!cancelled) {
      return !dispatch
        ? fn(...args)
        : dispatch(fn(...args));
    }
  };
}

const generateUrlQueries = (queries) => R.pipe(
  R.toPairs,
  R.addIndex(R.reduce)((acc, item, index) => {
    const prefix = index === 0 ? '?' : '&';
    acc += `${prefix}${item[0]}=${item[1]}`;
    return acc;
  }, ''),
)(queries);
const encodeURIComponentJSON = (jsonData) => encodeURIComponent(JSON.stringify(jsonData));
/**
 *  encode uri component query object
 * @param  {Object} obj) query object - the object that contains query value
 * @return {string}
 */
const encodeURIComponentObjPropJSON = (obj) => R.pipe(
  R.map((x) => encodeURIComponent(x)),
  JSON.stringify,
)(obj);
/**
 * encode uri component array of objs
 * @param  {Object[]} objs array of query obj
 * @return {string}
 */
const encodeURIComponentObjsPropJSON = (objs) => R.map(encodeURIComponentObjPropJSON)(objs);
const appendQueryToUrl = R.curry((queryKey, baseUrl, query) => baseUrl + queryKey + query);
const appendArrayQueryToUrl = R.curry((queryKey, baseUrl, queries) => R.pipe(
  encodeURIComponentObjsPropJSON,
  R.addIndex(R.reduce)((acc, query, index) => {
    const queryKeyToUse = index === 0 ? `?${queryKey}` : `&${queryKey}`;
    acc = appendQueryToUrl(queryKeyToUse)(acc)(query);
    return acc;
  }, baseUrl),
)(queries));

const appendObjQueryToUrl = R.curry((queryKey, baseUrl, queries) => R.pipe(
  encodeURIComponentObjPropJSON,
  appendQueryToUrl(queryKey)(baseUrl),
)(queries));

const createGenerateEncodedQueryUrl = R.curry(
  (queryKey, baseUrl, queries) => (
    isArray(queries)
      ? appendArrayQueryToUrl(queryKey, baseUrl, queries)
      : appendObjQueryToUrl(queryKey, baseUrl, queries)),
);

const generateEncondedQueryUrl = R.curry(
  (baseUrl, queries) => {
    const generator = isArray(queries)
      ? createGenerateEncodedQueryUrl('q[]=')
      : createGenerateEncodedQueryUrl('?q=');
    return generator(baseUrl, queries);
  },
);
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

const groupData = (groupByKey) => (data) => Object.values(groupBy(data, groupByKey));
const sortData = (sortByKey) => (data) => Object.values(sortBy(data, [sortByKey]));

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

const getFuntion = R.curry((functions, type) => R.prop(type)(functions));
const handleGetFunction = R.curry((functions, type) => {
  const fn = getFuntion(functions, type);
  if (!fn) throw new Error('Function not found');
  return fn;
});

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

module.exports = {
  getMaxOfArray,
  addItemToArrayObj,
  extractBeforeDot,
  removeAllNumber,
  toNumbers,
  toStatoshis,
  toCrypto,
  weiToEther,
  gweiToEther,
  chooseMainnetOrTestnet,
  appendUrlWithSlash,
  removeLastSlash,
  splitByDash,
  splitByComma,
  splitBy,
  extractDomainFromEmail,
  validateEmail,
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
  generateLabels,
  isStringWithDelimeter,
  isStringWithComma,
  sliceLongValue,
  sleep,
  withCancel,
  generateUrlQueries,
  encodeURIComponentJSON,
  encodeURIComponentObjPropJSON,
  encodeURIComponentObjsPropJSON,
  generateEncondedQueryUrl,
  uniquifyParties,
  removeDuplicatePartiesInAddresses,
  uniqByHOC,
  groupData,
  sortData,
  updateObjInArray,
  handleGetFunction,
  groupQueryResult,
};
