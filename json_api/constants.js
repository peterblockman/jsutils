const self = class {

};
module.exports = self;

const jsonApiKeys = ['data', 'included', 'jsonapi', 'errors', 'links', 'meta'];
const jsonApiEssentialkeys = ['data', 'errors', 'meta'];
const jsonApiDataKeys = ['type', 'id', 'attributes', 'relationships', 'links'];
const jsonApiDataEssentialKeys = ['type', 'attributes'];
self.jsonApiKeys = jsonApiKeys;
self.jsonApiEssentialkeys = jsonApiEssentialkeys;
self.jsonApiDataKeys = jsonApiDataKeys;
self.jsonApiDataEssentialKeys = jsonApiDataEssentialKeys;
