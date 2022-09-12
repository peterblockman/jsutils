const axiosError = require('./src/axios/error');
const axiosRequest = require('./src/axios/request');

const generalUtilsArray = require('./src/general_utils/array');
const generalUtilsDate = require('./src/general_utils/date');
const generalUtilsUtils = require('./src/general_utils/utils');

const groupGroup = require('./src/group/group');

const ramdaPipe = require('./src/ramda/pipe');
const ramdaTrace = require('./src/ramda/trace');

const reduxUtils = require('./src/redux/utils');

module.exports = {
  ...axiosError,
  ...axiosRequest,
  ...generalUtilsArray,
  ...generalUtilsDate,
  ...generalUtilsUtils,
  ...groupGroup,
  ...ramdaPipe,
  ...ramdaTrace,
  ...reduxUtils,
};
