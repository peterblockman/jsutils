const {
  validateParameter,
  validateParameters,
  createValidateParametersThrow,
} = require('../validate');

describe('/modules/parameter/validate', () => {
  describe('validateParameter', () => {
    it('Should return null if parameter validated as correct type', () => {
      const output = validateParameter(['param', 1], 'number');
      expect(output).toBe(null);
    });
    it('Should return error message if parameter validated as incorrect type', () => {
      const errorMessage = validateParameter(['param', 1], 'string');
      expect(errorMessage).toBe('param expected string but got number');
    });
  });
  describe('validateParameters', () => {
    const expectedErrors = 'param1 expected string but got number, param2 expected number but got string';
    const params = {
      param1: 1,
      param2: 'abc',
    };
    it('Should return error messages', () => {
      const output = validateParameters(params, ['string', 'number']);
      expect(output).toBe(expectedErrors);
    });
  });
  describe('createValidateParametersThrow', () => {
    const expectedErrors = 'param2 expected number but got string';
    const params = {
      param1: 1,
      param2: 'abc',
    };
    it('Should throw error messages', () => {
      try {
        createValidateParametersThrow({ useGenericError: false }, params, ['number', 'number']);
      } catch (error) {
        expect(error.message).toBe(expectedErrors);
      }
    });
  });
});
