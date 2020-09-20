const {
  getTimeDiffInSecond,
} = require('../date');

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
});
