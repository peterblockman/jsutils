const R = require('ramda');
const isPlainObject = require('lodash/isPlainObject');
const isArray = require('lodash/isArray');
const isString = require('lodash/isString');
const isEmpty = require('lodash/isEmpty');
const Boom = require('@hapi/boom');
const Result = require('folktale/result');
const { keepIncludedIfRequest } = require('./included_prop');
/**
 * Serializing data to JSONAPI format
 * @param  {string|string[]} include - the properties that be included in included property
 * @param  {Function} jsonApiRegister - register function that has json-api-serializer's Serializer.register
 * @param  {[type]} jsonApiSerializer - serialize functionthat has json-api-serializer's Serializer.serialize
 * @param  {string} options.type  - json-api-serializer's type
 * @param  {any} options.extraData - json-api-serializer' extraData
 * @param  {Object|Object[]} data  - the data to convert
 * @return {Object|Object[]}
 */
const serializeToJsonApi = R.curry(
  (include, jsonApiRegister, jsonApiSerializer, { type, extraData }, data) => {
    jsonApiRegister(data);
    const serializedData = jsonApiSerializer.serialize(type, data, extraData);
    return keepIncludedIfRequest(include, serializedData);
  },
);
/**
 * Serializing data to JSONAPI format and wrap it in foltale/result
 * @param  {string|string[]} include - the properties that be included in included property
 * @param  {Function} jsonApiRegister - register function that has json-api-serializer's Serializer.register
 * @param  {[type]} jsonApiSerializer - serialize functionthat has json-api-serializer's Serializer.serialize
 * @param  {string} options.type  - json-api-serializer's type
 * @param  {any} options.extraData - json-api-serializer' extraData
 * @param  {Object|Object[]} data  - the data to convert
 * @return {Object|Object[]}
 */
const serializeToJsonApiWithResult = R.curry(
  (
    include,
    jsonApiRegister,
    jsonApiSerializer,
    { type, extraData },
    data,
  ) => {
    if (isEmpty(data)) return Result.Error(Boom.notFound('JSONAPI: No data provided'));
    if (!isArray(data) && !isPlainObject(data)) {
      return Result
        .Error(Boom.badData('Data\'s type for JSONAPI serializing not supported'));
    }
    if (!isString(type)) {
      return Result
        .Error(Boom.badData('type property not found in {type, extraData}'));
    }
    return Result.Ok(
      serializeToJsonApi(
        include,
        jsonApiRegister,
        jsonApiSerializer,
        { type, extraData },
        data,
      ),
    );
  },
);
module.exports = {
  serializeToJsonApiWithResult,
  serializeToJsonApi,
};