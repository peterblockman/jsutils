const R = require('ramda');
const Boom = require('@hapi/boom');
const Result = require('folktale/result');
const {
  isInsatanceOfFolktaleResultOk,
  isInsatanceOfFolktaleResultError,
} = require('../../folktale/instances');
const {
  deserializeJsonApi,
  createSerializeToJsonApi,
} = require('../formatter');
const {
  Serializer,
  rawData,
  expectedDeserializedOutput,
  type,
  objectKeys,
} = require('./formatter_mocks');

const { jsonApiMockObject } = require('./include_mocks');

describe('modules/json_api/formatter', () => {
  describe('createSerializeToJsonApi', () => {
    it('Shoud serialize to json api and return a Result.Ok when data is an object (useGenericError false)', () => {
      const output = createSerializeToJsonApi(
        {
          useGenericError: false,
        },
        [],
        Serializer,
        {
          type,
          extraData: { count: 2 },
        },
        Result.Ok(rawData),
      );
      expect(isInsatanceOfFolktaleResultOk(output)).toBe(true);
      expect(R.keys(output.merge())).toMatchObject(objectKeys);
      expect(output.merge().data).toMatchObject(jsonApiMockObject.data);
      expect(output.merge().data).not.toHaveProperty('included');
    });
    it('Shoud serialize to json api and return a Result.Ok when data is an array (useGenericError false)', () => {
      const output = createSerializeToJsonApi(
        {
          useGenericError: false,
        },
        ['people'],
        Serializer,
        {
          type,
          extraData: { count: 2 },
        },
        Result.Ok([rawData, rawData]),
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
    it('Should deserialize jsonapi data (useGenericError true)', () => {
      const config = {
        useGenericError: true,
      };
      const output = deserializeJsonApi(config, Serializer, type, jsonApiMockObject);
      expect(isInsatanceOfFolktaleResultOk(output)).toBe(true);
      expect(output.merge()).toStrictEqual(expectedDeserializedOutput);
    });

    it('Should return Result.Error data when type is invalid (useGenericError true)', () => {
      const config = {
        useGenericError: true,
      };
      const type = 1;
      const output = deserializeJsonApi(config, Serializer, type, jsonApiMockObject);
      expect(isInsatanceOfFolktaleResultError(output)).toBe(true);
      const error = output.merge();
      expect(error instanceof Error).toBe(true);
      expect(error.message).toBe('type expected string but got number');
    });
    it('Should deserialize jsonapi data (useGenericError false)', () => {
      const config = {
        useGenericError: false,
      };
      const output = deserializeJsonApi(config, Serializer, type, jsonApiMockObject);
      expect(isInsatanceOfFolktaleResultOk(output)).toBe(true);
      expect(output.merge()).toStrictEqual(expectedDeserializedOutput);
    });
    it('Should return Result.Error data when type is invalid (useGenericError true)', () => {
      const config = {
        useGenericError: false,
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
