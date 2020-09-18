const isEmpty = require('lodash/isEmpty');
const { returnOkOrErrorNotLogic } = require('../folktale/add_result');

/**
 * Return a FolktaleResutl base on !Empty condiditon
 * @type {Boolean}
 */
const returnOkOrErrorEmptyLogic = returnOkOrErrorNotLogic(isEmpty);

module.exports = {
  returnOkOrErrorEmptyLogic,
};
