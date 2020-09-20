class self {

}
module.exports = self;

const isNaN = require('lodash/isNaN');
const R = require('ramda');

const { SECONDS } = require('./constants');

const isDate = (dateStr) => !isNaN(new Date(dateStr).getDate());

const isDateValid = (isoDate) => {
  const date = new Date(isoDate);
  const canConvertToValidDate = date !== 'Invalid Date' && !isNaN(date);
  if (!canConvertToValidDate) return false;
  const canConvertBackToIsoDateString = isoDate === date.toISOString();
  return canConvertBackToIsoDateString;
};

/**
 * Returns the difference between current time and the time given as parameter in seconds
 * @param  {Date|string|null} startTime starting time
 * @param  {Date|string|null} endTime   ending time
 * @return {number}       difference between time in seconds
 */
const getTimeDiffInSecond = R.curry((startTime, endTime) => {
  const startTimeInMiliSecond = startTime === null
    ? new Date().getTime()
    : new Date(startTime).getTime();
  const endTimeInMiliSecond = endTime === null
    ? new Date().getTime()
    : new Date(endTime).getTime();
  const timeDiffInMiliSecond = endTimeInMiliSecond - startTimeInMiliSecond;
  return timeDiffInMiliSecond / SECONDS;
});

self.isDate = isDate;
self.isDateValid = isDateValid;
self.getTimeDiffInSecond = getTimeDiffInSecond;
