const {
  isEmpty,
} = require('lodash');
const isPlainObject = require('lodash/isPlainObject');
const toNumber = require('lodash/toNumber');
const isString = require('lodash/isString');
const isArray = require('lodash/isArray');
const chunk = require('lodash/chunk');
const sumBy = require('lodash/fp/sumBy');
const countBy = require('lodash/fp/countBy');
const endsWith = require('lodash/fp/endsWith');
const R = require('ramda');
const { regexExp } = require('./constants');

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
  addItemToArrayObj,
  extractBeforeDot,
  removeAllNumber,
  chooseMainnetOrTestnet,
  appendUrlWithSlash,
  splitByDash,
  splitByComma,
  splitBy,
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
