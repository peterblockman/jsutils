class self {

}
module.exports = self;
const JSONAPISerializer = require('json-api-serializer');

const Serializer = new JSONAPISerializer();

const registerData = [
  {
    type: 'article',
    options: {
      id: 'id',
      blacklist: ['updated'],
      links: {
        self(data) {
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
    },
  },
  {
    type: 'people',
    options: {
      id: 'id',
      links: {
        self(data) {
          return `/peoples/${data.id}`;
        },
      },
    },
  },
  {
    type: 'tag',
    options: {
      id: 'id',
    },
  },
  {
    type: 'photo',
    options: {
      id: 'id',
    },
  },
  {
    type: 'photo',
    schema: 'only-body',
    options: {
      id: 'id',
    },
  },
  {
    type: 'comment',
    schema: 'only-body',
    options: {
      id: '_id',
    },
  },
];

self.registerData = registerData;
self.Serializer = Serializer;
