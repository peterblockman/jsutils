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
 * @typedef {boolean} UseGenericError - if true use JS generic Error
 */

/**
 * @typedef {Object} DeserializeConfig
 * @property {UseGenericError} useGenericError
 */

/**
 * @typedef {Object} JsonApiSerializer - instance from json-api-serializer
 * const JSONAPISerializer = require('json-api-serializer');
 * const Serializer = new JSONAPISerializer();
 */
/**
 * @typedef {JsonApiSerializer
 * & import('../folktale/typedefs').FolktaleResult} JsonApiSerializerResult - folktale result
 * of JsonApiSerializer
 */

/**
 * @typedef {Function|Null} JsonApiRegister - register jsonapi
 * if it is a function it has to return JsonApiRegister as defined below
 * const JSONAPISerializer = require('json-api-serializer');
 * const Serializer = new JSONAPISerializer();
 * const JsonApiRegister = Serializer.register
 * if it is null, registering jsonapi have to be done beforehand
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

/**
 * @typedef {Object} JsonApiUtils - contains JsonApiRegister, JsonApiSerializer and RegisterData
 * @property {JsonApiRegister} JsonApiUtils.jsonApiRegister
 * @property {JsonApiSerializer} JsonApiUtils.jsonApiSerializer
 * @property {RegisterData} JsonApiUtils.registerData
 */
