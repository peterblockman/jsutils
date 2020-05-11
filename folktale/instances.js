const R = require('ramda');
const Result = require('folktale/result');

const instances = {
  Ok: Result.Ok,
  Error: Result.Error,
};
const createIsInstaneOfFolktaleResult = R.curry(
  (instances, instanceType, itemToCheck) => itemToCheck instanceof instances[instanceType],
);
const isInsatanceOfFolktaleResult = createIsInstaneOfFolktaleResult(instances);
const isInsatanceOfFolktaleResultOk = isInsatanceOfFolktaleResult('Ok');
const isInsatanceOfFolktaleResultError = isInsatanceOfFolktaleResult('Error');

module.exports = {
  isInsatanceOfFolktaleResultOk,
  isInsatanceOfFolktaleResultError,
};
