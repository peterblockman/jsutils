class self {

}
module.exports = self;
const R = require('ramda');
/**
 * Check if an error is an Axios's error
 * @param  {Object} error
 * @return {boolean}
 */
const isAxiosError = R.curry(
  (error) => R.prop('isAxiosError')(error),
);
/**
 * Check if an error is an Axios's error in dev testing
 * axios-mock-adapter has not supported isAxiosError yet
 * @param  {Object} error
 * @return {boolean}
 */
const isAxiosErrorDev = R.curry(
  (error) => R.or(
    R.prop('response'),
    R.prop('request'),
  )(error),
);

const handleAxiosError = R.curry(
  (error) => {
    if (error.response) {
      /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
      return error.response;
    } if (error.request) {
      /*
         * The request was made but no response was received, `error.request`
         * is an instance of XMLHttpRequest in the browser and an instance
         * of http.ClientRequest in Node.js
         */
      return error.request;
    }
    // Something happened in setting up the request and triggered an Error
    // or other type of error
    return error;
  },
);

self.isAxiosError = isAxiosError;
self.isAxiosErrorDev = isAxiosErrorDev;
self.handleAxiosError = handleAxiosError;
