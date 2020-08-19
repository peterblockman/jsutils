const R = require('ramda');
const JSONAPISerializer = require('json-api-serializer');
const Result = require('folktale/result');
const {
  registerData,
  Serializer,
} = require('./register_mocks');
const {
  isJsonApiRegisteringSuccessful,
  isJsonApi,
  getTypeAndAttrubutes,
} = require('../utils');
const { jsonApiMockObject } = require('./include_mocks');

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
  describe('utils/isJsonApi', () => {
    it('Should return true when pass a jsonapi data', () => {
      const output = isJsonApi(jsonApiMockObject);
      expect(output).toBe(true);
    });
    it('Should return false when pass a non-jsonapi data', () => {
      const output = isJsonApi({ foo: 1 });
      expect(output).toBe(false);
    });
    it('Should return false when pass a empty object', () => {
      const output = isJsonApi({});
      expect(output).toBe(false);
    });
  });
  describe('utils/getTypeAndAttrubutes', () => {
    it('Should return jsonapi object with data that have type and attributes only', () => {
      const output = R.pipe(
        getTypeAndAttrubutes,
        (result) => result.merge(),
      )(jsonApiMockObject);
      expect(output).toHaveProperty('data');
      const data = R.pipe(
        R.prop('data'),
        R.head,
      )(output);
      expect(data).toHaveProperty('type');
      expect(data).toHaveProperty('attributes');
    });
  });
});
