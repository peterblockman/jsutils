const isPlainObject = require('lodash/isPlainObject');
const isArray = require('lodash/isArray');

const {
  groupObjectPropsByStructure,
  groupObjectsProps,
  replaceNilPropGroupWithNone,
  groupDataBy,
} = require('../group');
const {
  user1,
  users,
  expectedOutput,
  structure,
  structures,
  key,
  singleItemGroupStructureObjects,
  singleItemGroupStructures,
} = require('./group_mocks');

describe('modules/utils/group', () => {
  describe('groupObjectPropsByStructure', () => {
    it('Should group an object with a given structure', () => {
      const groupedOutput = groupObjectPropsByStructure(structure, user1);
      expect(groupedOutput.userId).toBe(expectedOutput[0].userId);
      expect(groupedOutput.distributors).toMatchObject(expectedOutput[0].distributors);
    }); // end describe groupObjectPropsByStructure
  });
  describe('groupObjectsProps', () => {
    it('Should group an array of objects', () => {
      const groupedOutput = groupObjectsProps(key, structures, users);
      expect(groupedOutput).toMatchObject(expectedOutput);
    });
    it('Should head group if headGroup is true', () => {
      const groupedOutput = groupObjectsProps(
        key,
        singleItemGroupStructures,
        singleItemGroupStructureObjects,
      );
      expect(isArray(groupedOutput[0].cars)).toBe(true);
      expect(isPlainObject(groupedOutput[0].stats)).toBe(true);
    });
  }); // end describe groupObjectsProps

  describe('replaceNilPropGroupWithNone', () => {
    it('Should replace the id of a group with "none" if the is null and undefined', () => {
      const input = {
        foo: 1,
        fooGroup: {
          id: null,
          index: 1,
        },
        barGroup: {
          barId: 1,
          index: 2,
        },
        barFooGroup: {
          id: undefined,
          index: 2,
        },
      };
      const output = replaceNilPropGroupWithNone(
        [{ fooGroup: 'id' }, { barGroup: 'barId' }, { barFooGroup: 'id' }],
        [input],
      );
      expect(output[0].fooGroup.id).toBe('none');
      expect(output[0].barGroup.barId).toBe(1);
      expect(output[0].barFooGroup.id).toBe('none');
    });
  }); // end describe replaceNilPropGroupWithNone

  describe('groupDataBy', () => {
    it('Should replace the id of a group with "none" if the is null and undefined', () => {
      const expectedOutput = [
        [
          {
            userId: 1,
            name: 'hey',
            distributorId: 1,
            fruit: 'apple',
            car: 'toyoto',
            carId: 1,
          },
          {
            userId: 1,
            name: 'hey',
            distributorId: 2,
            fruit: 'orange',
            car: 'nissun',
            carId: 2,
          },
        ],
        [
          {
            userId: 2,
            distributorId: 1,
            fruit: 'banana',
            car: 'kame',
            carId: 3,
          },
          {
            userId: 2,
            distributorId: 3,
            fruit: 'pineapple',
            car: 'oudi',
            carId: 4,
          },
        ],
      ];
      const output = groupDataBy(
        'userId',
        users,
      );
      expect(output.length).toBe(2);
      expect(output).toStrictEqual(expectedOutput);
    });
  }); // end describe replaceNilPropGroupWithNone
});
