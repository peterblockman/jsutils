const {
  isOk,
} = require('../../folktale/instances');
const {
  deserializeJsonApi,
  deserializeJsonApiAndGetOnlyData,
} = require('../formatter');
const {
  deserializedOutput,
} = require('./deserialize_mocks');
const { jsonApiMockObject } = require('./include_mocks');

describe('modules/json_api/formatter deserialize', () => {
  describe('deserializeJsonApi', () => {
    it('Should deserialize jsonapi', () => {
      const output = deserializeJsonApi(jsonApiMockObject);
      expect(isOk(output)).toBe(true);
      const data = output.merge();
      expect(data).toHaveProperty('meta');
      expect(data).toHaveProperty('data');
    });
  });
  describe('deserializeJsonApiAndGetOnlyData', () => {
    it('Should deserialize jsonapi and prop data', () => {
      const output = deserializeJsonApiAndGetOnlyData(jsonApiMockObject);
      expect(isOk(output)).toBe(true);
      const data = output.merge();
      expect(data).toStrictEqual(deserializedOutput);
    });
  });
});
