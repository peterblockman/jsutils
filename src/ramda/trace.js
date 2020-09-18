class self {

}
module.exports = self;
const R = require('ramda');

const trace = R.curry((label, value) => {
  console.log(`${label}: ${JSON.stringify(value)}`);
  return value;
});
const traceObject = R.curry((label, value) => {
  console.log(`${label}: `);
  console.log(value);
  return value;
});

self.trace = trace;
self.traceObject = traceObject;
