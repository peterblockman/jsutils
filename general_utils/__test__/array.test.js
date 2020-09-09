const {
  convertArrayToObject,
} = require('../array');

describe('array utils test', () => {
  describe('convertArrayToObject', () => {
    it('Should convert array into object', () => {
      const array = [
        {
          id: 1,
          ok: true,
        },
        {
          id: 2,
          ok: false,
        },
        {
          id: 1,
          ok: false,
        },

      ];
      const expectedOutput = {
        1: [{ id: 1, ok: true }, { id: 1, ok: false }],
        2: [{ id: 2, ok: false }],
      };
      const output = convertArrayToObject('id', array);
      expect(output).toStrictEqual(expectedOutput);
    });
  }); // end describe findShortestString
});
