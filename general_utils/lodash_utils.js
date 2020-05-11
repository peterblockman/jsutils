const round = require('lodash/round');
const isEmpty = require('lodash/isEmpty');
const R = require('ramda');
const { returnResultOkOrErrorNotLogic } = require('../folktale/add_result');
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
const isEmptyOkOrErrorNotLogic = returnResultOkOrErrorNotLogic(isEmpty);

module.exports = {
  roundFp,
  isEmptyOkOrErrorNotLogic,
};
