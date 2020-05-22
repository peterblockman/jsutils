const {
  registerData,
  Serializer,
} = require('./register_mocks');
const { createGerenateJsonApiRegister } = require('../register');

describe('modules/json_api/register', () => {
  describe('register/createGerenateJsonApiRegister', () => {
    it('Should generate json api register', () => {
      const output = createGerenateJsonApiRegister({ useNativeError: false }, Serializer, registerData);
      expect(output.merge().schemas).toHaveProperty('people');
      expect(output.merge().schemas).toHaveProperty('tag');
      expect(output.merge().schemas).toHaveProperty('photo');
    });
  });
});
