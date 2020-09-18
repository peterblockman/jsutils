const R = require('ramda');
const {
  isOk,
  isError,
} = require('./instances');


const acceptOrThrow = R.curry((data) => {
  if (isError(data)) {
    throw data.merge();
  } else if (isOk(data)) {
    return data.merge();
  }
  return data;
});


module.exports = {
  acceptOrThrow,
};
