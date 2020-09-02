const self = class {

};
module.exports = self;

const deserializedOutput = [
  {
    id: '1',
    links: {
      self: '/articles/1',
    },
    title: 'JSON API paints my bikeshed!',
    body: 'The shortest article. Ever.',
    created: '2015-05-22T14:56:29.000Z',
    author: {
      links: {
        self: '/peoples/1',
      },
      id: '1',
      firstName: 'Kaley',
      lastName: 'Maggio',
      email: 'Kaley-Maggio@example.com',
      age: '80',
      gender: 'male',
    },
    tags: [
      {
        id: '1',
      },
      {
        id: '2',
      },
    ],
    photos: [
      {
        id: 'ed70cf44-9a34-4878-84e6-0c0e4a450cfe',
      },
      {
        id: '24ba3666-a593-498c-9f5d-55a4ee08c72e',
      },
      {
        id: 'f386492d-df61-4573-b4e3-54f6f5d08acf',
      },
    ],
    comments: [
      {
        id: '1',
        body: 'First !',
      },
      {
        id: '2',
        body: 'I Like !',
      },
      {
        id: '3',
        body: 'Awesome',
      },
    ],
  },
];

self.deserializedOutput = deserializedOutput;
