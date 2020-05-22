const {
  registerData,
  Serializer,
} = require('./register_mocks');
const { gerenateJsonApiRegister } = require('../register');

describe('modules/json_api/register', () => {
  describe('register/gerenateJsonApiRegister', () => {
    it('Should generate json api register', () => {
      const output = gerenateJsonApiRegister(Serializer, registerData);
      expect(output.merge().schemas).toHaveProperty('people');
      expect(output.merge().schemas).toHaveProperty('tag');
      expect(output.merge().schemas).toHaveProperty('photo');
    });
  });
});
