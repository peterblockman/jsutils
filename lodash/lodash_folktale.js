const isEmpty = require('lodash/isEmpty');
const { returnResultOkOrErrorNotLogic } = require('../folktale/add_result');

/**
 * Return a FolktaleResutl base on !Empty condiditon
 * @type {Boolean}
 */
const returnResultOkOrErrorEmptyLogic = returnResultOkOrErrorNotLogic(isEmpty);

module.exports = {
  returnResultOkOrErrorEmptyLogic,
};
