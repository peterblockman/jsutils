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

const axiosMock = new AxiosMockAdapter(axios);

describe('modules/json_api/register', () => {
  describe('register/createGerenateJsonApiRegister', () => {
    it('Should generate json api register', () => {
      const output = createGerenateJsonApiRegister({ useGenericError: false }, Serializer, registerData);
      const { schemas } = output.merge();
      expect(schemas).toHaveProperty('people');
      expect(schemas).toHaveProperty('tag');
      expect(schemas).toHaveProperty('photo');
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
      done();
      expect(schemas).toHaveProperty('secretPhraseValidation');
    });
  });
});
