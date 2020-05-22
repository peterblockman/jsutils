const Result = require('folktale/result');
const R = require('ramda');
const Boom = require('@hapi/boom');

const JSONAPISerializer = require('json-api-serializer');
const {
  isInsatanceOfFolktaleResultOk,
  isInsatanceOfFolktaleResultError,
} = require('../../folktale/instances');
const {
  serializeToJsonApiWithResult,
  deserializeJsonApi,
  // deserializeJsonApi,
  createSerializeToJsonApi,
} = require('../formatter');
const {
  Serializer,
  rawData,
  expectedDeserializedOutput,
  type,
} = require('./formatter_mocks');

const { jsonApiMockObject } = require('./include_mocks');

describe('modules/json_api/formatter', () => {
  describe('createSerializeToJsonApi', () => {
    const objectKeys = ['jsonapi', 'meta', 'links', 'data'];
    it('Shoud serialize to json api and return a Result.Ok when data is an object (useNativeError false)', () => {
      const output = createSerializeToJsonApi(
        {
          useNativeError: false,
        },
        [],
        Serializer,
        {
          type,
          extraData: { count: 2 },
        },
        rawData,
      );
      expect(isInsatanceOfFolktaleResultOk(output)).toBe(true);
      expect(R.keys(output.merge())).toMatchObject(objectKeys);
      expect(output.merge().data).toMatchObject(jsonApiMockObject.data);
      expect(output.merge().data).not.toHaveProperty('included');
    });
    it('Shoud serialize to json api and return a Result.Ok when data is an array (useNativeError false)', () => {
      const output = createSerializeToJsonApi(
        {
          useNativeError: false,
        },
        ['people'],
        Serializer,
        {
          type,
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
  describe('deserializeJsonApi', () => {
    it('Should deserialize jsonapi data (useNativeError true)', () => {
      const config = {
        useNativeError: true,
      };
      const output = deserializeJsonApi(config, Serializer, type, jsonApiMockObject);
      expect(isInsatanceOfFolktaleResultOk(output)).toBe(true);
      expect(output.merge()).toStrictEqual(expectedDeserializedOutput);
    });

    it('Should return Result.Error data when type is invalid (useNativeError true)', () => {
      const config = {
        useNativeError: true,
      };
      const type = 1;
      const output = deserializeJsonApi(config, Serializer, type, jsonApiMockObject);
      expect(isInsatanceOfFolktaleResultError(output)).toBe(true);
      const error = output.merge();
      expect(error instanceof Error).toBe(true);
      expect(error.message).toBe('type expected string but got number');
    });
    it('Should deserialize jsonapi data (useNativeError false)', () => {
      const config = {
        useNativeError: false,
      };
      const output = deserializeJsonApi(config, Serializer, type, jsonApiMockObject);
      expect(isInsatanceOfFolktaleResultOk(output)).toBe(true);
      expect(output.merge()).toStrictEqual(expectedDeserializedOutput);
    });
    it('Should return Result.Error data when type is invalid (useNativeError true)', () => {
      const config = {
        useNativeError: false,
      };
      const type = 1;
      const output = deserializeJsonApi(config, Serializer, type, jsonApiMockObject);
      expect(isInsatanceOfFolktaleResultError(output)).toBe(true);
      const error = output.merge();
      expect(Boom.isBoom(error)).toBe(true);
      expect(error.message).toBe('type expected string but got number');
    });
  });
});
