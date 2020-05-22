class self {

}
module.exports = self;
/**
 * @typedef {string} Type  - jsonapi's type
 */

/**
 * @typedef {Object} JsonApiData  - an object that have jsonapi structure
 * more info: https://jsonapi.org/
 */

/**
 * @typedef {boolean} UseNativeError - if true use JS native Error
 */

/**
 * @typedef {Object} DeserializeConfig
 * @property {UseNativeError} useNativeError
 */

/**
 * @typedef {Object} JsonApiSerializer - instance from json-api-serializer
 * const JSONAPISerializer = require('json-api-serializer');
 * const Serializer = new JSONAPISerializer();
 */

/**
 * @typedef {Object} JsonApiRegister - register jsonapi
 * const JSONAPISerializer = require('json-api-serializer');
 * const Serializer = new JSONAPISerializer();
 * const JsonApiRegister = Serializer.register
 */

/**
 * @typedef {Object} RegisterItem
 * @property type - JSONAPI's type
 * @property schema - json-api-serializer's schema
 * @property options - json-api-serializer's options
 */

/**
 * @typedef {RegisterItem[]} RegisterData - the register data
 */
