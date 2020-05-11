const {
  splitErrorMessageAndPointer,
  updateError,
  convertToJsonApiError,
} = require('../error');

describe('modules/json_api/error', () => {
  const errorPayload = {
    statusCode: 400,
    error: 'Not found',
    message: 'User not found_data/attributes/user_userId',
  };
  const newErrorMessageData = {
    message: 'User not found',
    pointer: 'data/attributes/user',
    parameter: 'userId',
  };
  describe('splitErrorMessageAndPointer', () => {
    it('Should split original message into a message, pointer and parameter', () => {
      const output = splitErrorMessageAndPointer(errorPayload);
      expect(output).toMatchObject(newErrorMessageData);
    });
    it('Should not split original message into a message, pointer and parameter if original message does not have underscore', () => {
      const errorPayload = {
        statusCode: 400,
        error: 'Not found',
        message: 'User not found',
      };
      const output = splitErrorMessageAndPointer(errorPayload);
      const expectedOutput = { message: 'User not found', pointer: undefined, parameter: undefined };
      expect(output).toMatchObject(expectedOutput);
    });
  });
  const expectedOutput = {
    status: 400,
    title: 'Not found',
    detail: 'User not found',
    source: { pointer: 'data/attributes/user', parameter: 'userId' },
  };
  describe('updateError', () => {
    it('Should split original message into a message, pointer and parameter', () => {
      const output = updateError(errorPayload, newErrorMessageData);
      expect(output).toMatchObject(expectedOutput);
    });
  });
  describe('convertToJsonApiError', () => {
    it('Should convert error payload into jsonapi format error object', () => {
      const output = convertToJsonApiError(errorPayload);
      expect(output).toMatchObject({ errors: [expectedOutput] });
    });
  });
});
