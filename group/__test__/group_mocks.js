const object = [
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
];
const objects = [
  ...object,
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
];
const structure = {
  groupName: 'distributors',
  groupProps: ['distributorId', 'fruit'],
};
const structure2 = {
  groupName: 'cars',
  groupProps: ['car', 'carId'],
};
const key = 'userId';

const structures = [
  structure,
  structure2,
];
const expectedOutput = [
  {
    userId: 1,
    name: 'hey',
    distributors: [
      {
        distributorId: 1,
        fruit: 'apple',
      },
      {
        distributorId: 2,
        fruit: 'orange',
      },
    ],
    cars: [
      {
        car: 'toyoto',
        carId: 1,
      },
      {
        car: 'nissun',
        carId: 2,
      },
    ],
  },
  {
    userId: 2,
    distributors: [
      {
        distributorId: 1,
        fruit: 'banana',
      },
      {
        distributorId: 3,
        fruit: 'pineapple',
      },
    ],
    cars: [
      {
        car: 'kame',
        carId: 3,
      },
      {
        car: 'oudi',
        carId: 4,
      },
    ],
  },
];
const singleItemGroupStructureObjects = [
  {
    userId: 1,
    car: 'keicar',
    size: 'small',
    wheel: 'x',
  },
  {
    userId: 2,
    car: 'oudi',
    size: 'medium',
    wheel: 'y',
  },
  {
    userId: 2,
    car: 'vasza',
    size: 'large',
    wheel: 'z',
  },
];
const singleItemGroupStructures = [
  {
    groupName: 'cars',
    groupProps: ['car'],
  },
  {
    groupName: 'stats',
    groupProps: ['size', 'wheel'],
  },
];
module.exports = {
  object,
  objects,
  expectedOutput,
  structure,
  structures,
  key,
  singleItemGroupStructureObjects,
  singleItemGroupStructures,
};
