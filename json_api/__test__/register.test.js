const R = require('ramda');
const Result = require('folktale/result');
const AxiosMockAdapter = require('axios-mock-adapter');
const JSONAPISerializer = require('json-api-serializer');
const axios = require('axios');
const {
  registerData,
  Serializer,
} = require('./register_mocks');
const {
  createGerenateJsonApiRegister,
  fetchAndRegisterJsonApiGenericError,
} = require('../register');
const {
  createSerializeToJsonApi,
} = require('../formatter');
const {
  rawData,
  type,
  objectKeys,
} = require('./formatter_mocks');
const {
  isInsatanceOfFolktaleResultOk,
} = require('../../folktale/instances');
const { jsonApiMockObject } = require('./include_mocks');

const axiosMock = new AxiosMockAdapter(axios);

describe('modules/json_api/register', () => {
  describe('register/createGerenateJsonApiRegister', () => {
    it('Should generate jsonapi register', () => {
      const output = createGerenateJsonApiRegister({ useGenericError: false }, Serializer, registerData);
      const { schemas } = output.merge();
      expect(schemas).toHaveProperty('people');
      expect(schemas).toHaveProperty('tag');
      expect(schemas).toHaveProperty('photo');
    });
    it('Should generate jsonapi register and serialize jsonapi', () => {
      const Serializer = new JSONAPISerializer();
      createGerenateJsonApiRegister({ useGenericError: false }, Serializer, registerData);
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
    });
  });
  describe('register/fetchAndRegisterJsonApiGenericError', () => {
    const jsonApiResgisterRes = {
      data: [
        {
          type: 'secretPhraseValidation',
          id: 'userId',
          topLevelLinks: {
            self: 'localhost:5001/address_party/validate-secret-phrase',
          },
        },
      ],
    };
    it('Should fetch and generate json api register', async (done) => {
      const url = 'foo.com';
      const Serializer = new JSONAPISerializer();
      axiosMock.onGet(url).reply(200, jsonApiResgisterRes);
      const output = await fetchAndRegisterJsonApiGenericError(url, Serializer, registerData);
      const { schemas } = output.merge();
      expect(schemas).toHaveProperty('secretPhraseValidation');
      done();
    });
  });
});
