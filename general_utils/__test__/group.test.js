const isPlainObject = require('lodash/isPlainObject');
const isArray = require('lodash/isArray');

const {
  groupObjectPropsByStructure,
  groupObjectsProps,
  groupObjectsPropsAndHeadIfSingle,
  replaceNilPropGroupWithNone,
} = require('../group');
const {
  object,
  objects,
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
      const groupedOutput = groupObjectPropsByStructure(structure, object);
      expect(groupedOutput.userId).toBe(expectedOutput[0].userId);
      expect(groupedOutput.distributors).toMatchObject(expectedOutput[0].distributors);
    }); // end describe groupObjectPropsByStructure
  });
  describe('groupObjectsProps', () => {
    it('Should group an array of objects', () => {
      const groupedOutput = groupObjectsProps(key, structures, objects);
      expect(groupedOutput).toMatchObject(expectedOutput);
    });
  }); // end describe groupObjectsProps
  describe('groupObjectsPropsAndHeadIfSingle', () => {
    it('Should group an array of objects', () => {
      const groupedOutput = groupObjectsPropsAndHeadIfSingle(
        key,
        singleItemGroupStructures,
        singleItemGroupStructureObjects,
      );
      expect(groupedOutput[0].userId).toBe(1);
      expect(isPlainObject(groupedOutput[0].cars)).toBe(true);
      expect(groupedOutput[1].userId).toBe(2);
      expect(isArray(groupedOutput[1].cars)).toBe(true);
    });
  }); // end describe groupObjectsPropsAndHeadIfSingle
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
  }); // end describe groupObjectsPropsAndHeadIfSingle
});
