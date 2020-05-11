const R = require('ramda');
const {
  isInsatanceOfFolktaleResultOk,
} = require('../../folktale/instances');
const { serializeToJsonApiWithResult } = require('../formatter');
const { Serializer, registerJsonApiMock, rawData } = require('./formatter_mocks');
const { jsonApiMockObject } = require('./include_mocks');

describe('modules/json_api/formatter', () => {
  describe('serializeToJsonApiWithResult', () => {
    const objectKeys = ['jsonapi', 'meta', 'links', 'data'];
    it('Shoud serialize to json api and return a Result.Ok when data is an object', () => {
      const output = serializeToJsonApiWithResult(
        [],
        registerJsonApiMock,
        Serializer,
        {
          type: 'article',
          extraData: { count: 2 },
        },
        rawData,
      );
      expect(isInsatanceOfFolktaleResultOk(output)).toBe(true);
      expect(R.keys(output.merge())).toMatchObject(objectKeys);
      expect(output.merge().data).toMatchObject(jsonApiMockObject.data);
      expect(output.merge().data).not.toHaveProperty('included');
    });
    it('Shoud serialize to json api and return a Result.Ok when data is an array', () => {
      const output = serializeToJsonApiWithResult(
        ['people'],
        registerJsonApiMock,
        Serializer,
        {
          type: 'article',
          extraData: { count: 2 },
        },
        [rawData, rawData],
      );
      expect(isInsatanceOfFolktaleResultOk(output)).toBe(true);
      const outputData = output.merge();
      expect(R.keys(outputData)).toMatchObject([...objectKeys, 'included']);
      expect(outputData.data.length).toBe(2);
      expect(outputData).toHaveProperty('included');
      R.map((item) => {
        expect(item).toHaveProperty('type');
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('attributes');
        expect(item).toHaveProperty('meta');
        expect(item).toHaveProperty('links');
      })(R.flatten(outputData.data));
    });
  });
});
