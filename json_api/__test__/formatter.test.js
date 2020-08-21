const R = require('ramda');
const Boom = require('@hapi/boom');
const Result = require('folktale/result');
const JSONAPISerializer = require('json-api-serializer');
const {
  isInsatanceOfFolktaleResultOk,
  isInsatanceOfFolktaleResultError,
} = require('../../folktale/instances');
const {
  deserializeJsonApi,
  createSerializeToJsonApi,
} = require('../formatter');
const {
  rawData,
  expectedDeserializedOutput,
  type,
  objectKeys,
} = require('./formatter_mocks');
const { registerData } = require('./register_mocks');
const { gerenateJsonApiRegisterBoomError } = require('../register');
const { jsonApiMockObject } = require('./include_mocks');

describe('modules/json_api/formatter', () => {
  describe('createSerializeToJsonApi', () => {
    let jsonApiSerializer;
    beforeEach(() => {
      const tempSerializer = new JSONAPISerializer();
      gerenateJsonApiRegisterBoomError(tempSerializer, registerData);
      jsonApiSerializer = tempSerializer;
    });
    it('Shoud serialize to json api and return a Result.Ok when data is an object (useGenericError false)', () => {
      const output = createSerializeToJsonApi(
        {
          useGenericError: false,
        },
        [],
        { jsonApiSerializer },
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
        { jsonApiSerializer },
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
    it('Shoud serialize to json api and return a Result.Ok when data is an object (useGenericError false) when pass a jsonApiRegister', () => {
      const jsonApiSerializer = new JSONAPISerializer();
      const output = createSerializeToJsonApi(
        {
          useGenericError: false,
        },
        [],
        {
          jsonApiSerializer,
          jsonApiRegister: gerenateJsonApiRegisterBoomError,
          registerData,
        },
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
  });
  describe('deserializeJsonApi', () => {
    let jsonApiSerializer;
    beforeEach(() => {
      jsonApiSerializer = new JSONAPISerializer();
    });
    it('Should deserialize jsonapi data (useGenericError true)', () => {
      const config = {
        useGenericError: true,
      };
      const output = deserializeJsonApi(
        config,
        {
          jsonApiSerializer,
          jsonApiRegister: gerenateJsonApiRegisterBoomError,
          registerData,
        },
        type,
        jsonApiMockObject,
      );
      expect(isInsatanceOfFolktaleResultOk(output)).toBe(true);
      expect(output.merge()).toStrictEqual(expectedDeserializedOutput);
    });

    it('Should return Result.Error data when type is invalid (useGenericError true)', () => {
      const config = {
        useGenericError: true,
      };
      const type = 1;
      const output = deserializeJsonApi(
        config,
        {
          jsonApiSerializer,
          jsonApiRegister: gerenateJsonApiRegisterBoomError,
          registerData,
        },
        type,
        jsonApiMockObject,
      );
      expect(isInsatanceOfFolktaleResultError(output)).toBe(true);
      const error = output.merge();
      expect(error instanceof Error).toBe(true);
      expect(error.message).toBe('type expected string but got number');
    });
    it('Should deserialize jsonapi data (useGenericError false)', () => {
      const config = {
        useGenericError: false,
      };
      const output = deserializeJsonApi(
        config,
        {
          jsonApiSerializer,
          jsonApiRegister: gerenateJsonApiRegisterBoomError,
          registerData,
        },
        type,
        jsonApiMockObject,
      );
      expect(isInsatanceOfFolktaleResultOk(output)).toBe(true);
      expect(output.merge()).toStrictEqual(expectedDeserializedOutput);
    });
    it('Should return Result.Error data when type is invalid (useGenericError true)', () => {
      const config = {
        useGenericError: false,
      };
      const type = 1;
      const output = deserializeJsonApi(
        config,
        {
          jsonApiSerializer,
          jsonApiRegister: gerenateJsonApiRegisterBoomError,
          registerData,
        },
        type,
        jsonApiMockObject,
      );
      expect(isInsatanceOfFolktaleResultError(output)).toBe(true);
      const error = output.merge();
      expect(Boom.isBoom(error)).toBe(true);
      expect(error.message).toBe('type expected string but got number');
    });
    it('Should return the redux action if pass it to the function', () => {
      const config = {
        useGenericError: false,
      };
      const type = 'bar';
      const jsonApiData = { type: 'foo', payload: 'bar' };
      const output = deserializeJsonApi(
        config,
        {
          jsonApiSerializer,
          jsonApiRegister: gerenateJsonApiRegisterBoomError,
          registerData,
        },
        type,
        jsonApiData,
      );
      expect(output).toStrictEqual(jsonApiData);
    });
  });
});
