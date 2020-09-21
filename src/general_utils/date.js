class self {

}
module.exports = self;

const isNaN = require('lodash/isNaN');
const R = require('ramda');

const {
  SECONDS,
  MINUTES,
  HOURS,
  DAYS,
} = require('./constants');

const isDate = (dateStr) => !isNaN(new Date(dateStr).getDate());

const isDateValid = (isoDate) => {
  const date = new Date(isoDate);
  const canConvertToValidDate = date !== 'Invalid Date' && !isNaN(date);
  if (!canConvertToValidDate) return false;
  const canConvertBackToIsoDateString = isoDate === date.toISOString();
  return canConvertBackToIsoDateString;
};

/**
 * Convert time given in minutes to milliseconds
 * @param  {number} minutes
 * @return {number}          Time in milliseconds
 */
const convertMinuteToMiliSecond = R.curry((minutes) => minutes * 60 * 1000);

/**
 * Returns the difference between two time in milliseconds
 * @param  {Date|string|null} startTime starting time
 * @param  {Date|string|null} endTime   ending time
 * @return {number}       difference between time in milliseconds
 */
const getTimeDiffInMiliSecond = R.curry((startTime, endTime) => {
  // MS = Milliseconds
  const startTimeInMiliSecond = startTime === null
    ? new Date().getTime()
    : new Date(startTime).getTime();
  const endTimeInMiliSecond = endTime === null
    ? new Date().getTime()
    : new Date(endTime).getTime();
  const timeDiffInMiliSecond = endTimeInMiliSecond - startTimeInMiliSecond;
  return timeDiffInMiliSecond;
});

/**
 * Returns the difference between two time in minutes
 * @param  {Date|string|null} startTime starting time
 * @param  {Date|string|null} endTime   ending time
 * @return {number}       difference between time in hours
 */
const getTimeDiffInMinute = R.curry((startTime, endTime) => {
  const timeDiffInMiliSecond = getTimeDiffInMiliSecond(startTime, endTime);
  return timeDiffInMiliSecond / MINUTES;
});

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


/**
 * Returns the difference between two time in hours
 * @param  {Date|string|null} startTime starting time
 * @param  {Date|string|null} endTime   ending time
 * @return {number}       difference between time in hours
 */
const getTimeDiffInHour = R.curry((startTime, endTime) => {
  const timeDiffInMiliSecond = getTimeDiffInMiliSecond(startTime, endTime);
  return timeDiffInMiliSecond / HOURS;
});

/**
 * Returns the difference between two time in days
 * @param  {Date|string|null} startTime starting time
 * @param  {Date|string|null} endTime   ending time
 * @return {number}       difference between time in days
 */
const getTimeDiffInDay = R.curry((startTime, endTime) => {
  const timeDiffInMiliSecond = getTimeDiffInMiliSecond(startTime, endTime);
  return timeDiffInMiliSecond / DAYS;
});

self.isDate = isDate;
self.isDateValid = isDateValid;
self.convertMinuteToMiliSecond = convertMinuteToMiliSecond;
self.getTimeDiffInSecond = getTimeDiffInSecond;
self.getTimeDiffInMiliSecond = getTimeDiffInMiliSecond;
self.getTimeDiffInMinute = getTimeDiffInMinute;
self.getTimeDiffInHour = getTimeDiffInHour;
self.getTimeDiffInDay = getTimeDiffInDay;
