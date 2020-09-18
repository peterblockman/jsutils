const requireDir = require('require-directory');
const R = require('ramda');
const options = require('./options');

const createRequireDirectory = R.curry(
  (requireOptions, moduleToRequire) => requireDir(moduleToRequire, requireOptions),
);
const requireDirectory = createRequireDirectory(options);
module.exports = requireDirectory;
