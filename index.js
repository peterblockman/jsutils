const RA = require('ramda-adjunct');
const R = require('ramda');

const mergeMethods = R.pipe(
  RA.toArray,
  (array) => Object.assign({}, ...array),
);
const axiosError = require('./src/axios/error');
const axiosRequest = require('./src/axios/request');
const folktaleAddResult = require('./src/folktale/add_result');
const folktaleInstance = require('./src/folktale/instances');
const folktaleValues = require('./src/folktale/values');

const generalUtilsArray = require('./src/general_utils/array');
const generalUtilsDate = require('./src/general_utils/date');
const generalUtilsUtils = require('./src/general_utils/utils');

const groupGroup = require('./src/group/group');

const jsonApiDataProp = require('./src/json_api/data_prop');
const jsonApiError = require('./src/json_api/error');
const jsonApiFormatter = require('./src/json_api/formatter');
const jsonApiIncludedProp = require('./src/json_api/included_prop');
const jsonApiRegister = require('./src/json_api/register');
const jsonApiUtils = require('./src/json_api/utils');

const lodashFolktale = require('./src/lodash/lodash_folktale');
const lodashFp = require('./src/lodash/fp');

const parameterValidate = require('./src/parameter/validate');
const ramdaPipe = require('./src/ramda/pipe');
const ramdaFolktale = require('./src/ramda/ramda_folktale');
const ramdaTrace = require('./src/ramda/trace');

const reduxUtils = require('./src/redux/utils');

module.exports = {
  ...axiosError,
  ...axiosRequest,
  ...folktaleAddResult,
  ...folktaleInstance,
  ...folktaleValues,
  ...generalUtilsArray,
  ...generalUtilsDate,
  ...generalUtilsUtils,
  ...groupGroup,
  ...jsonApiDataProp,
  ...jsonApiError,
  ...jsonApiIncludedProp,
  ...jsonApiFormatter,
  ...jsonApiRegister,
  ...jsonApiUtils,
  ...lodashFolktale,
  ...lodashFp,
  ...parameterValidate,
  ...ramdaPipe,
  ...ramdaFolktale,
  ...ramdaTrace,
  ...reduxUtils,
};
