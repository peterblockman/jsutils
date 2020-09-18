const R = require('ramda');
const { isArrayOfObjects } = require('../../general_utils/utils');
const { flattenDataProp } = require('../data_prop');
const { jsonApiMockObject } = require('./include_mocks');

describe('json_api/data_prop', () => {
  describe('flattenDataProp', () => {
    it('Shoud flatten data prop of json api object', () => {
      // add 1 more item to data prop for testing
      const newData = R.set(
        R.lensProp('data'),
        [jsonApiMockObject.data, jsonApiMockObject.data],
        jsonApiMockObject,
      );
      const output = flattenDataProp(newData);
      const { data } = output;
      expect(isArrayOfObjects(data)).toBe(true);
    });
  });
});
