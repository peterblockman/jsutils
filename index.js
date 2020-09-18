const RA = require('ramda-adjunct');
const R = require('ramda');

const mergeMethods = R.pipe(
  RA.toArray,
  (array) => Object.assign({}, ...array),
);
const axios = mergeMethods(require('./src/axios'));
const folktale = mergeMethods(require('./src/folktale'));
const generalUtils = mergeMethods(require('./src/general_utils'));
const group = mergeMethods(require('./src/group'));
const jsonApi = mergeMethods(require('./src/json_api'));
const lodash = mergeMethods(require('./src/lodash'));
const parameter = mergeMethods(require('./src/parameter'));
const ramda = mergeMethods(require('./src/ramda'));
const redux = mergeMethods(require('./src/redux'));

module.exports = {
  ...axios,
  ...folktale,
  ...generalUtils,
  ...group,
  ...jsonApi,
  ...lodash,
  ...parameter,
  ...ramda,
  ...redux,
};
