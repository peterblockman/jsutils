const isEmpty = require('lodash/isEmpty');
const { returnResultOkOrErrorNotLogic } = require('../folktale/add_result');

/**
 * Return a FolktaleResutl base on !Empty condiditon
 * @type {Boolean}
 */
const isEmptyOkOrErrorNotLogic = returnResultOkOrErrorNotLogic(isEmpty);

module.exports = {
  isEmptyOkOrErrorNotLogic,
};
