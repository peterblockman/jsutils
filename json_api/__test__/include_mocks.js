const jsonApiMockObject = {
  jsonapi: {
    version: '1.0',
  },
  meta: {
    count: 2,
    total: 1,
  },
  links: {
    self: '/articles',
  },
  data: [{
    type: 'article',
    id: '1',
    attributes: {
      title: 'JSON API paints my bikeshed!',
      body: 'The shortest article. Ever.',
      created: '2015-05-22T14:56:29.000Z',
    },
    relationships: {
      author: {
        data: {
          type: 'people',
          id: '1',
        },
        links: {
          self: '/articles/1/relationships/author',
          related: '/articles/1/author',
        },
      },
      tags: {
        data: [{
          type: 'tag',
          id: '1',
        }, {
          type: 'tag',
          id: '2',
        }],
      },
      photos: {
        data: [{
          type: 'photo',
          id: 'ed70cf44-9a34-4878-84e6-0c0e4a450cfe',
        }, {
          type: 'photo',
          id: '24ba3666-a593-498c-9f5d-55a4ee08c72e',
        }, {
          type: 'photo',
          id: 'f386492d-df61-4573-b4e3-54f6f5d08acf',
        }],
      },
      comments: {
        data: [{
          type: 'comment',
          id: '1',
        }, {
          type: 'comment',
          id: '2',
        }, {
          type: 'comment',
          id: '3',
        }],
      },
    },
    links: {
      self: '/articles/1',
    },
  }],
  included: [{
    type: 'people',
    id: '1',
    attributes: {
      firstName: 'Kaley',
      lastName: 'Maggio',
      email: 'Kaley-Maggio@example.com',
      age: '80',
      gender: 'male',
    },
    links: {
      self: '/peoples/1',
    },
  }, {
    type: 'comment',
    id: '1',
    attributes: {
      body: 'First !',
    },
  }, {
    type: 'comment',
    id: '2',
    attributes: {
      body: 'I Like !',
    },
  }, {
    type: 'comment',
    id: '3',
    attributes: {
      body: 'Awesome',
    },
  }],
};

module.exports = {
  jsonApiMockObject,
};
