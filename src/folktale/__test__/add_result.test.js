const isUndefined = require('lodash/isUndefined');
const Result = require('folktale/result');

const {
  returnOkOrError,
  returnOkOrErrorNotLogic,
  chain,
  chainAsync,
} = require('../add_result');
const { isOk, isError } = require('../instances');

describe('modules/folktale/add_result', () => {
  const value = 1;
  const errorMessage = 'it is undefined';
  describe('returnOkOrError', () => {
    it('Should return Result "Ok" and "Error"', () => {
      const errorMessage = 'it is undefined';
      const resultOk = returnOkOrError((x) => !isUndefined(x), errorMessage, value);
      const resultError = returnOkOrError((x) => !isUndefined(x), errorMessage, undefined);
      expect(isOk(resultOk)).toBe(true);
      expect(resultOk.merge()).toBe(value);
      expect(isError(resultError)).toBe(true);
      expect(resultError.merge()).toBe(errorMessage);
    });
  });
  describe('returnOkOrErrorNotLogic', () => {
    it('Should return Result "Ok" and "Error"', () => {
      const resultOk = returnOkOrErrorNotLogic(isUndefined, errorMessage, value);
      const resultError = returnOkOrErrorNotLogic(isUndefined, errorMessage, undefined);
      expect(isOk(resultOk)).toBe(true);
      expect(resultOk.merge()).toBe(value);
      expect(isError(resultError)).toBe(true);
      expect(resultError.merge()).toBe(errorMessage);
    });
  });
  describe('chain', () => {
    const func = (data) => data;
    it('Should chain Result when input is an Result.Ok', () => {
      const output = chain(func)(Result.Ok('foo'));
      expect(isOk(output)).toBe(true);
      expect(output.merge()).toBe('foo');
    });
    it('Should chain Result when input is an Result.Error', () => {
      const output = chain(func)(Result.Error('foo'));
      expect(isError(output)).toBe(true);
    });
    it('Should return error if input a non-folktale-result', () => {
      const output = chain(func)('foo');
      expect(isError(output)).toBe(true);
      expect(output.merge().output.payload.message).toBe('Input must be an instance of Result.Ok or Result.Error');
    });
  });
  describe('chainAsync', () => {
    const func = async (data) => data;
    it('Should chain Result when input is an Result.Ok', async (done) => {
      const output = await chainAsync(func)(Result.Ok('foo'));
      expect(isOk(output)).toBe(true);
      expect(output.merge()).toBe('foo');
      done();
    });
    it('Should chain Result when input is an Result.Error', async (done) => {
      const output = await chainAsync(func)(Result.Error('foo'));
      expect(isError(output)).toBe(true);
      done();
    });
    it('Should return error if input a non-folktale-result', async (done) => {
      const output = await chainAsync(func)('foo');
      expect(isError(output)).toBe(true);
      expect(output.merge().output.payload.message).toBe('Input must be an instance of Result.Ok or Result.Error');
      done();
    });
  });
});
