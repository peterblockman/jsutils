const round = require('lodash/round');
const R = require('ramda');
/**
 * Make Lodash's round functional
 * @param  {number}
 * @param  {number}
 * @return {number}
 */
const roundFp = R.curry(
  (precision, number) => round(number, precision),
);
/**
 * Return a FolktaleResutl base on !Empty condiditon
 * @type {Boolean}
 */

module.exports = {
  roundFp,
};
