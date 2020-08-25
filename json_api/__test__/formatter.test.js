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
  removeGroupIfNull,
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
      const type = 'article';
      const jsonApiData = { type: 'foo', payload: jsonApiMockObject };
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
      expect(output).toHaveProperty('type');
      expect(output).toHaveProperty('payload');
      expect(output.payload).toStrictEqual(expectedDeserializedOutput);
    });
  });
  describe('removeGroupIfNull', () => {
    const mockComments = {
      _id: null,
      body: null,
      created: null,
    };
    const mockAuthors = [
      {
        id: null,
        firstName: null,
        lastName: null,
        email: null,
        age: null,
        gender: null,
      },
      {
        id: null,
        firstName: null,
        lastName: null,
        email: null,
        age: null,
        gender: null,
      },
    ];

    const data = R.map(
      R.pipe(
        R.assoc('comments', mockComments),
        R.assoc('author', mockAuthors),
      ),
      rawData,
    );
    const expectedOutput = [
      {
        id: '1',
        title: 'JSON API paints my bikeshed!',
        body: 'The shortest article. Ever.',
        created: '2015-05-22T14:56:29.000Z',
        updated: '2015-05-22T14:56:28.000Z',
        tags: ['1', '2'],
        photos: [
          'ed70cf44-9a34-4878-84e6-0c0e4a450cfe',
          '24ba3666-a593-498c-9f5d-55a4ee08c72e',
          'f386492d-df61-4573-b4e3-54f6f5d08acf',
        ],
      },
    ];
    it('Remove the group data if null when data is an array', () => {
      const output = removeGroupIfNull(data);
      expect(output).toStrictEqual(expectedOutput);
    });
    it('Remove the group data if null when data is an object', () => {
      const output = removeGroupIfNull(data[0]);
      expect(output).toStrictEqual(expectedOutput[0]);
    });
  });
});
