const R = require('ramda');
const uniq = require('lodash/uniq');
const { keepIncludedIfRequest, updateIncludedProps } = require('../included_prop');
const { jsonApiMockObject } = require('./include_mocks');

describe('json_api/include', () => {
  const getOutputTypes = (mockObjectOutput) => R.pipe(
    R.map((item) => item.type),
    uniq,
  )(mockObjectOutput.included);
  describe('updateIncludedProps', () => {
    it('Should keep included props if include is an Array', () => {
      const include = ['people'];
      const mockObjectOutput = updateIncludedProps(include, jsonApiMockObject);
      const data = mockObjectOutput.getOrElse(undefined);
      const types = getOutputTypes(data);
      expect(data).toHaveProperty('included');
      expect(R.equals(types, include)).toBe(true);
    });
    it('Should keep included props if include is a string', () => {
      const include = 'people';
      const mockObjectOutput = updateIncludedProps(include, jsonApiMockObject);
      const data = mockObjectOutput.getOrElse(undefined);
      const types = getOutputTypes(data);
      expect(data).toHaveProperty('included');
      expect(R.equals(types, [include])).toBe(true);
    });
    it('Should keep included props if include is an object', () => {
      const include = { includeProp: 'people' };
      const mockObjectOutput = updateIncludedProps(include, jsonApiMockObject);
      const data = mockObjectOutput.getOrElse(undefined);
      const types = getOutputTypes(data);
      expect(data).toHaveProperty('included');
      expect(R.equals(types, [include.includeProp])).toBe(true);
    });
    it('Should drop included props if not request', () => {
      const include = undefined;
      const output = updateIncludedProps(include, jsonApiMockObject);
      expect(output.getOrElse(undefined)).not.toHaveProperty('included');
    });
    it('Should drop included props if request with include that have props which doesnot exist in included', () => {
      const include = ['photo'];
      const output = updateIncludedProps(include, jsonApiMockObject);
      expect(output.getOrElse(undefined)).not.toHaveProperty('included');
    });
    it('Should keep only included props that exist', () => {
      const include = ['people', 'photo'];
      const mockObjectOutput = updateIncludedProps(include, jsonApiMockObject);
      const data = mockObjectOutput.getOrElse(undefined);
      const types = getOutputTypes(data);
      expect(data).toHaveProperty('included');
      expect(R.equals(types, ['people'])).toBe(true);
    });
  });
  describe('keepIncludedIfRequest', () => {
    it('Should keep included props if request and jsonApiDatas is an array', () => {
      const include = ['people'];
      const mockObjectsOutput = keepIncludedIfRequest(
        include,
        [jsonApiMockObject, jsonApiMockObject],
      );
      const data = mockObjectsOutput.getOrElse(undefined);
      R.map((mockObjectOutput) => {
        const types = getOutputTypes(mockObjectOutput);
        expect(mockObjectOutput).toHaveProperty('included');
        expect(R.equals(types, include)).toBe(true);
      }, data);
    });
    it('Should keep included props if include and jsonApiDatas is an object', () => {
      const include = ['people'];
      const mockObjectOutput = keepIncludedIfRequest(include, jsonApiMockObject);
      const data = mockObjectOutput.getOrElse(undefined);
      const types = getOutputTypes(data);
      expect(data).toHaveProperty('included');
      expect(R.equals(types, include)).toBe(true);
    });
    it('Should drop included props if not request (include is undefined)', () => {
      const include = undefined;
      const mockObjectsOutput = keepIncludedIfRequest(
        include,
        [jsonApiMockObject, jsonApiMockObject],
      );
      const data = mockObjectsOutput.getOrElse(undefined);
      R.map((mockObjectOutput) => {
        expect(
          mockObjectOutput,
        ).not.toHaveProperty('included');
      }, data);
    });
    it('Should drop included props if not request (include is an empty array)', () => {
      const include = [];
      const mockObjectsOutput = keepIncludedIfRequest(
        include,
        [jsonApiMockObject, jsonApiMockObject],
      );
      const data = mockObjectsOutput.getOrElse(undefined);

      R.map((mockObjectOutput) => {
        expect(mockObjectOutput).not.toHaveProperty('included');
      }, data);
    });
  });
});
