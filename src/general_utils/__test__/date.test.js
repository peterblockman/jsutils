const {
  convertMinuteToMiliSecond,
  getTimeDiffInSecond,
  getTimeDiffInMiliSecond,
  getTimeDiffInMinute,
  getTimeDiffInHour,
  getTimeDiffInDay,
} = require('../date');
const {
  SECONDS,
  MINUTES,
  HOURS,
  DAYS,
} = require('../constants');

describe('date', () => {
  describe('getTimeDiffInSecond', () => {
    it('Should get the time different in second', () => {
      const startTime = new Date().getTime();
      const endTime = new Date().getTime() + 9000;
      const expectedResult = (endTime - startTime) / 1000;
      const result = getTimeDiffInSecond(startTime, endTime);
      expect(result).toBeGreaterThanOrEqual(expectedResult);
    });
    it('Should get the time different in second when endTime is not given', () => {
      const startTime = new Date().getTime() - 9000;
      const endTime = new Date().getTime();
      const expectedResult = (endTime - startTime) / 1000;
      const result = getTimeDiffInSecond(startTime, null);
      expect(result).toBeGreaterThanOrEqual(expectedResult);
    });
    it('Should get the time different in second when endTime is not given', () => {
      const startTime = new Date().getTime();
      const endTime = new Date().getTime() + 9000;
      const expectedResult = (endTime - startTime) / 1000;
      const result = getTimeDiffInSecond(null, endTime);
      expect(result).toBeLessThanOrEqual(expectedResult);
    });
  });
  describe('convertMinuteToMillisecond', () => {
    it('Should convert from minute to milliseconds', () => {
      const timeInMilliseconds = convertMinuteToMiliSecond(10);
      expect(timeInMilliseconds).toBe(600000);
    });
  });
  describe('getTimeDiffInMiliSecond', () => {
    it('Should get the time different in second', () => {
      const startTime = new Date().getTime();
      const endTime = new Date().getTime() + 9000;
      const expectedResult = (endTime - startTime);
      const result = getTimeDiffInMiliSecond(startTime, endTime);
      expect(result).toBeGreaterThanOrEqual(expectedResult);
    });
    it('Should get the time different in second when endTime is not given', () => {
      const startTime = new Date().getTime() - 9000;
      const endTime = new Date().getTime();
      const expectedResult = (endTime - startTime);
      const result = getTimeDiffInMiliSecond(startTime, null);
      expect(result).toBeGreaterThanOrEqual(expectedResult);
    });
    it('Should get the time different in second when endTime is not given', () => {
      const startTime = new Date().getTime();
      const endTime = new Date().getTime() + 9000;
      const expectedResult = (endTime - startTime);
      const result = getTimeDiffInMiliSecond(null, endTime);
      expect(result).toBeLessThanOrEqual(expectedResult);
    });
  });
  describe('getTimeDiffInMinute', () => {
    it('Should get the time different in minutes', () => {
      const startTime = new Date().getTime();
      const endTime = new Date().getTime() + 5 * MINUTES;
      const expectedResult = (endTime - startTime) / MINUTES;
      const result = getTimeDiffInMinute(startTime, endTime);
      expect(result).toBe(expectedResult);
    });
  });
  describe('getTimeDiffInHour', () => {
    it('Should get the time different in hours', () => {
      const startTime = new Date().getTime();
      const endTime = new Date().getTime() + 5 * HOURS;
      const expectedResult = (endTime - startTime) / HOURS;
      const result = getTimeDiffInHour(startTime, endTime);
      expect(result).toBe(expectedResult);
    });
  });
  describe('getTimeDiffInDay', () => {
    it('Should get the time different in days', () => {
      const startTime = new Date().getTime();
      const endTime = new Date().getTime() + 5 * DAYS;
      const expectedResult = (endTime - startTime) / DAYS;
      const result = getTimeDiffInDay(startTime, endTime);
      expect(result).toBe(expectedResult);
    });
  });
});
