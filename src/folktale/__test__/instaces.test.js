const Result = require('folktale/result');
const Boom = require('@hapi/boom');
const {
  isEveryItemOk,
  unwrapResultList,
} = require('../instances');


describe('modules/folktale/instances', () => {
  describe('isEveryItemOk', () => {
    it('Should return true when every item is "Ok"', () => {
      const input = [Result.Ok('foo'), Result.Ok('bar')];
      const output = isEveryItemOk(input);
      expect(output).toBe(true);
    });
    it('Should throw fall when a Result is not "Ok"', () => {
      const input = [Result.Ok('foo'), 'bar'];
      const output = isEveryItemOk(input);
      expect(output).toBe(false);
    });
  });
  describe('unwrapResultList', () => {
    it('Should return unwraped item when every item is "Ok"', () => {
      const input = [Result.Ok('foo'), Result.Ok('bar')];
      const output = unwrapResultList(input);
      expect(output).toStrictEqual(['foo', 'bar']);
    });
    it('Should return unwraped item when item are mixed with Ok and normal data type', () => {
      const input = [Result.Ok('foo'), 'bar'];
      const output = unwrapResultList(input);
      expect(output).toStrictEqual(['foo', 'bar']);
    });
    it('Should return error message when there is an Error', () => {
      const input = [Result.Error('foo'), Result.Error('bar'), 'car'];
      const output = unwrapResultList(input);
      expect(output).toBe('foo bar');
    });
    it('Should return error message when there is an Error', () => {
      const input = [Result.Error(Boom.badData('foo')), Result.Error(Boom.badData('bar'))];
      const output = unwrapResultList(input);
      expect(output).toBe('foo bar');
    });
    it('Should return error message when there is an Error', () => {
      const input = Result.Ok({ foo: 'bar' });
      const output = unwrapResultList(input);
      expect(output).toStrictEqual({ foo: 'bar' });
    });
  });
});
