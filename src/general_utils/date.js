class self {

}
module.exports = self;
const isNaN = require('lodash/isNaN');

const isDate = (dateStr) => !isNaN(new Date(dateStr).getDate());

self.isDate = isDate;
