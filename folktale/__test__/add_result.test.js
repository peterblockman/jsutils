const isUndefined = require('lodash/isUndefined');
const Result = require('folktale/result');

const {
  returnResultOkOrError,
  returnResultOkOrErrorNotLogic,
  withFolktaleResultChain,
  withFolktaleResultChainAsync,
} = require('../add_result');
const { isInsatanceOfFolktaleResultOk, isInsatanceOfFolktaleResultError } = require('../instances');

describe('modules/folktale/add_result', () => {
  const value = 1;
  const errorMessage = 'it is undefined';
  describe('returnResultOkOrError', () => {
    it('Should return Result "Ok" and "Error"', () => {
      const errorMessage = 'it is undefined';
      const resultOk = returnResultOkOrError((x) => !isUndefined(x), errorMessage, value);
      const resultError = returnResultOkOrError((x) => !isUndefined(x), errorMessage, undefined);
      expect(isInsatanceOfFolktaleResultOk(resultOk)).toBe(true);
      expect(resultOk.merge()).toBe(value);
      expect(isInsatanceOfFolktaleResultError(resultError)).toBe(true);
      expect(resultError.merge()).toBe(errorMessage);
    });
  });
  describe('returnResultOkOrErrorNotLogic', () => {
    it('Should return Result "Ok" and "Error"', () => {
      const resultOk = returnResultOkOrErrorNotLogic(isUndefined, errorMessage, value);
      const resultError = returnResultOkOrErrorNotLogic(isUndefined, errorMessage, undefined);
      expect(isInsatanceOfFolktaleResultOk(resultOk)).toBe(true);
      expect(resultOk.merge()).toBe(value);
      expect(isInsatanceOfFolktaleResultError(resultError)).toBe(true);
      expect(resultError.merge()).toBe(errorMessage);
    });
  });
  describe('withFolktaleResultChain', () => {
    const func = (data) => data;
    it('Should chain Result when input is an Result.Ok', () => {
      const output = withFolktaleResultChain(func)(Result.Ok('foo'));
      expect(isInsatanceOfFolktaleResultOk(output)).toBe(true);
      expect(output.merge()).toBe('foo');
    });
    it('Should chain Result when input is an Result.Error', () => {
      const output = withFolktaleResultChain(func)(Result.Error('foo'));
      expect(isInsatanceOfFolktaleResultError(output)).toBe(true);
    });
    it('Should return error if input a non-folktale-result', () => {
      const output = withFolktaleResultChain(func)('foo');
      expect(isInsatanceOfFolktaleResultError(output)).toBe(true);
      expect(output.merge().output.payload.message).toBe('Input must be an instance of Result.Ok or Result.Error');
    });
  });
  describe('withFolktaleResultChainAsync', () => {
    const func = async (data) => data;
    it('Should chain Result when input is an Result.Ok', async (done) => {
      const output = await withFolktaleResultChainAsync(func)(Result.Ok('foo'));
      expect(isInsatanceOfFolktaleResultOk(output)).toBe(true);
      expect(output.merge()).toBe('foo');
      done();
    });
    it('Should chain Result when input is an Result.Error', async (done) => {
      const output = await withFolktaleResultChainAsync(func)(Result.Error('foo'));
      expect(isInsatanceOfFolktaleResultError(output)).toBe(true);
      done();
    });
    it('Should return error if input a non-folktale-result', async (done) => {
      const output = await withFolktaleResultChainAsync(func)('foo');
      expect(isInsatanceOfFolktaleResultError(output)).toBe(true);
      expect(output.merge().output.payload.message).toBe('Input must be an instance of Result.Ok or Result.Error');
      done();
    });
  });
});
