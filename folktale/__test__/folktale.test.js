const Result = require('folktale/result');
const { acceptOrThrow } = require('../values');


describe('modules/folktale/values', () => {
  describe('acceptOrThrow', () => {
    it('Should return Result\'s value when Result is "Ok"', () => {
      const input = Result.Ok('foo');
      const output = acceptOrThrow(input);
      expect(output).toBe('foo');
    });
    it('Should throw Result\'s  when Result is "Error"', () => {
      const input = Result.Error('foo');
      expect(() => acceptOrThrow(input)).toThrowError('foo');
    });
  });
});
