const isPlainObject = require('lodash/isPlainObject');
const isArray = require('lodash/isArray');

const {
  groupObjectPropsByStructure,
  groupObjectsProps,
  replaceNilPropGroupWithNone,
  groupDataBy,
  removeGroupIfNull,
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
    it('Should remove null group', () => {
      const structure = [
        ...singleItemGroupStructures,
        {
          groupName: 'foo',
          groupProps: ['bar', 'banana'],
        },
      ];
      const groupedOutput = groupObjectsProps(
        key,
        structure,
        singleItemGroupStructureObjects,
      );
      expect(groupedOutput[0].foo).toBe(undefined);
      expect(groupedOutput[1].foo).toBe(undefined);
    });
    it('Should rename if request', () => {
      const structures = [
        {
          groupName: 'distributors',
          groupProps: ['distributorId', 'fruit'],
        },
        {
          groupName: 'cars',
          groupProps: ['car', 'carId'],
          renameProps: {
            car: 'newCar',
          },
        },
      ];
      const groupedOutput = groupObjectsProps(
        key,
        structures,
        users,
      );
      expect(groupedOutput[0].cars[0]).toHaveProperty('newCar');
      expect(groupedOutput[0].cars[0]).not.toHaveProperty('car');
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

    const data = [{
      id: '1',
      title: 'JSON API paints my bikeshed!',
      body: 'The shortest article. Ever.',
      created: '2015-05-22T14:56:29.000Z',
      updated: '2015-05-22T14:56:28.000Z',
      mockComments,
      mockAuthors,
      tags: ['1', '2'],
      photos: [
        'ed70cf44-9a34-4878-84e6-0c0e4a450cfe',
        '24ba3666-a593-498c-9f5d-55a4ee08c72e',
        'f386492d-df61-4573-b4e3-54f6f5d08acf',
      ],
    }];

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
