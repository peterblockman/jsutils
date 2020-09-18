const {
  findShortestString,
  isStringWithDelimeter,
  splitBy,
} = require('../utils');

describe('Utils test', () => {
  describe('findShortestString', () => {
    it('Should return a shortest string from an array', () => {
      const array = ['foo', 'barfoo', 'barbarfoo'];
      const expectedOutput = 'foo';
      const shortestString = findShortestString(array);
      expect(shortestString).toBe(expectedOutput);
    });
    it('Should return a shortest string from an object', () => {
      const object = { x: 'foo', y: 'barfoo', z: 'barbarfoo' };
      const expectedOutput = 'foo';
      const shortestString = findShortestString(object);
      expect(shortestString).toBe(expectedOutput);
    });

    it('Should return an empty string when inputtting an empty array', () => {
      expect(findShortestString([])).toBe('');
    });
    it('Should return an empty string when inputtting an empty object', () => {
      expect(findShortestString({})).toBe('');
    });
  }); // end describe findShortestString
  describe('isStringWithDelimeter', () => {
    it('should return true if string has specific delimeter', () => {
      const string = 'apple,orange,banana';
      const isDelimited = isStringWithDelimeter(',', string);
      expect(isDelimited).toBe(true);
    });
    it('should return false if string doesnot has a specific delimeter', () => {
      const string = 'apple orange banana';
      const isDelimited = isStringWithDelimeter(',', string);
      expect(isDelimited).toBe(false);
    });
  }); // end isStringWithDelimeter
  describe('splitBy', () => {
    const string = 'apple,orange,banana';
    const array = ['apple', 'orange', 'banana'];
    it('should return an array if input has specific delimeter', () => {
      const splitedOutput = splitBy(',', string);
      expect(splitedOutput).toMatchObject(array);
    });
    it('should return the input if input is an array', () => {
      const splitedOutput = splitBy(',', array);
      expect(splitedOutput).toMatchObject(array);
    });
  });
  describe('groupDeep', () => {
    const string = 'apple,orange,banana';
    const array = ['apple', 'orange', 'banana'];
    it('should return an array if input has specific delimeter', () => {
      const splitedOutput = splitBy(',', string);
      expect(splitedOutput).toMatchObject(array);
    });
    it('should return the input if input is an array', () => {
      const splitedOutput = splitBy(',', array);
      expect(splitedOutput).toMatchObject(array);
    });
  });
});
