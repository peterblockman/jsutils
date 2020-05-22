class self {

}
module.exports = self;

const pipeAwait = (...functions) => (
  (input) => functions.reduce(
    (chain, func) => chain.then(func),
    Promise.resolve(input),
  )
);

self.pipeAwait = pipeAwait;
