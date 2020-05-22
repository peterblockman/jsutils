class self {

}
module.exports = self;
const JSONAPISerializer = require('json-api-serializer');

const Serializer = new JSONAPISerializer();
const rawData = [
  {
    id: '1',
    title: 'JSON API paints my bikeshed!',
    body: 'The shortest article. Ever.',
    created: '2015-05-22T14:56:29.000Z',
    updated: '2015-05-22T14:56:28.000Z',
    author: {
      id: '1',
      firstName: 'Kaley',
      lastName: 'Maggio',
      email: 'Kaley-Maggio@example.com',
      age: '80',
      gender: 'male',
    },
    tags: ['1', '2'],
    photos: [
      'ed70cf44-9a34-4878-84e6-0c0e4a450cfe',
      '24ba3666-a593-498c-9f5d-55a4ee08c72e',
      'f386492d-df61-4573-b4e3-54f6f5d08acf',
    ],
    comments: [
      {
        _id: '1',
        body: 'First !',
        created: '2015-08-14T18:42:16.475Z',
      },
      {
        _id: '2',
        body: 'I Like !',
        created: '2015-09-14T18:42:12.475Z',
      },
      {
        _id: '3',
        body: 'Awesome',
        created: '2015-09-15T18:42:12.475Z',
      },
    ],
  },
];
const type = 'article';
// Register 'article' type
Serializer.register(type, {
  id: 'id', // The attributes to use as the reference. Default = 'id'.
  blacklist: ['updated'], // An array of blacklisted attributes. Default = []
  links: {
    // An object or a function that describes links.
    self(data) {
      // Can be a function or a string value ex: { self: '/articles/1'}
      return `/articles/${data.id}`;
    },
  },
  relationships: {
    // An object defining some relationships.
    author: {
      type: 'people', // The type of the resource
      links(data) {
        // An object or a function that describes Relationships links
        return {
          self: `/articles/${data.id}/relationships/author`,
          related: `/articles/${data.id}/author`,
        };
      },
    },
    tags: {
      type: 'tag',
    },
    photos: {
      type: 'photo',
    },
    comments: {
      type: 'comment',
      schema: 'only-body', // A custom schema
    },
  },
  topLevelMeta(data, extraData) {
    // An object or a function that describes top level meta.
    return {
      count: extraData.count,
      total: data.length,
    };
  },
  topLevelLinks: {
    // An object or a function that describes top level links.
    self: '/articles', // Can be a function (with extra data argument) or a string value
  },
});

// Register 'people' type
Serializer.register('people', {
  id: 'id',
  links: {
    self(data) {
      return `/peoples/${data.id}`;
    },
  },
});
// Register 'tag' type
Serializer.register('tag', {
  id: 'id',
});

// Register 'photo' type
Serializer.register('photo', {
  id: 'id',
});

// Register 'comment' type with a custom schema
Serializer.register('comment', 'only-body', {
  id: '_id',
});

const expectedDeserializedOutput = [
  {
    id: '1',
    title: 'JSON API paints my bikeshed!',
    body: 'The shortest article. Ever.',
    created: '2015-05-22T14:56:29.000Z',
    author: {
      id: '1',
      firstName: 'Kaley',
      lastName: 'Maggio',
      email: 'Kaley-Maggio@example.com',
      age: '80',
      gender: 'male',
      links: {
        self: '/peoples/1',
      },
    },
    tags: [
      '1',
      '2',
    ],
    photos: [
      'ed70cf44-9a34-4878-84e6-0c0e4a450cfe',
      '24ba3666-a593-498c-9f5d-55a4ee08c72e',
      'f386492d-df61-4573-b4e3-54f6f5d08acf',
    ],
    comments: [
      {
        _id: '1',
        body: 'First !',
      },
      {
        _id: '2',
        body: 'I Like !',
      },
      {
        _id: '3',
        body: 'Awesome',
      },
    ],
    links: {
      self: '/articles/1',
    },
  },
];

self.Serializer = Serializer;
self.rawData = rawData;
self.expectedDeserializedOutput = expectedDeserializedOutput;
self.type = type;
