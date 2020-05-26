class self {

}
module.exports = self;
const axios = require('axios');
const R = require('ramda');
const isEmpty = require('lodash/isEmpty');
const Result = require('folktale/result');
const { pipeAwait } = require('../ramda/pipe');
const { trace } = require('../ramda/trace');


const extractAxiosData = (axiosResResult) => axiosResResult.chain(
  (axiosRes) => Result.Ok(axiosRes.data),
);
const extractDataFromServerData = (axiosData) => axiosData;
const encodeURIComponentJSON = (jsonData) => encodeURIComponent(JSON.stringify(jsonData));

const doesConfigContainData = R.curry(
  (config) => R.pipe(
    R.prop('data'),
    R.equals(true),
  )(config),
);

const shouldAddDataToConfig = R.curry(
  (config) => !isEmpty(config) && !doesConfigContainData(config),
);

/**
 * Handle axios request
 * @param  {string} method <get, post, put, patch,..> - all axios's method
 * @param  {string} url - api endpoint
 * @param  {Object} config contains data and other axios configs - similar
 * to axios object but doesnot contain url property
 * @return {Object} axios's response object
 * Note that in many cases we only need to pass data,
 * that is why we check doesConfigContainData
 */
const handleAxiosRequest = R.curry(
  async (method, url, config) => {
    try {
      const configToUse = shouldAddDataToConfig(config)
        ? { data: config }
        : config;
      const res = await axios(R.merge({ method, url }, configToUse));
      return Result.Ok(res);
    } catch (error) {
      return Result.Error(error);
    }
  },
);
/**
 * create axios request
 * @param  {string} method <get, post, put, patch,..> - all axios's method
 * @param  {string} url - api endpoint
 * @param  {Object|FolktaleResult} config contains data and other axios configs - similar
 * to axios object but doesnot contain url property
 * @return {Object} axios's response object
 * Note that in many cases we only need to pass data,
 * that is why we check doesConfigContainData
 */
const createAxiosRequest = R.curry(
  async (method, url, config) => {
    if (!Result.hasInstance(config)) return handleAxiosRequest(method, url, config);
    return config.chain(
      async (configData) => handleAxiosRequest(method, url, configData),
    );
  },
);
// because many get request only need url, so we flip it
const axiosGet = R.curry(
  async (url) => pipeAwait(
    R.flip(createAxiosRequest('get'))({}),
    extractAxiosData,
  )(url),
);
const axiosPost = R.curry(
  async (url, config) => pipeAwait(
    createAxiosRequest('post', url),
    extractAxiosData,
  )(config),
);
const axiosPut = R.curry(
  async (url, config) => pipeAwait(
    createAxiosRequest('put', url),
    extractAxiosData,
  )(config),
);
const axiosPatch = R.curry(
  async (url, config) => pipeAwait(
    createAxiosRequest('patch', url),
    extractAxiosData,
  )(config),
);

self.extractDataFromServerData = extractDataFromServerData;
self.encodeURIComponentJSON = encodeURIComponentJSON;
self.axiosGet = axiosGet;
self.axiosPost = axiosPost;
self.axiosPut = axiosPut;
self.axiosPatch = axiosPatch;
