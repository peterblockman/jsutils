const R = require('ramda');
const {
  isInsatanceOfFolktaleResultOk,
  isInsatanceOfFolktaleResultError,
} = require('./instances');


const acceptOrThrow = R.curry((data) => {
  if (isInsatanceOfFolktaleResultError(data)) {
    throw data.merge();
  } else if (isInsatanceOfFolktaleResultOk(data)) {
    return data.merge();
  }
  return data;
});


module.exports = {
  acceptOrThrow,
};
