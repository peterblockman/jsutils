const JSONAPISerializer = require('json-api-serializer');
const Result = require('folktale/result');
const {
  registerData,
  Serializer,
} = require('./register_mocks');
const {
  isJsonApiRegisteringSuccessful,
} = require('../utils');
const {
  createGerenateJsonApiRegister,
} = require('../register');

describe('modules/json_api/utils', () => {
  describe('utils/isJsonApiRegisteringSuccessful', () => {
    it('Should return true when registering successfully', () => {
      createGerenateJsonApiRegister({ useGenericError: false }, Serializer, registerData);
      const output = isJsonApiRegisteringSuccessful(Result.Ok(Serializer));
      expect(output).toBe(true);
    });
    it('Should return false when registering failed', () => {
      const Serializer = new JSONAPISerializer();
      const output = isJsonApiRegisteringSuccessful(Result.Ok(Serializer));
      expect(output).toBe(false);
    });
  });
});
