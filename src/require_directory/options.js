const R = require('ramda');
const camelCase = require('lodash/camelCase');

const excludeTest = R.curry((path) => {
  const regrex = new RegExp('(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$');
  return regrex.test(path);
});
// rename all the filenames to camelCase. It is easier to require without changinig name
const options = { exclude: excludeTest, rename: camelCase };
module.exports = options;
