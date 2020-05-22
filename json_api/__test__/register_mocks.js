class self {

}
module.exports = self;
const JSONAPISerializer = require('json-api-serializer');

const Serializer = new JSONAPISerializer();

const registerData = [
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
];

self.registerData = registerData;
self.Serializer = Serializer;
