// TIME CONSTANTS
// These can be used to convert time from milliseconds to following units
const SECONDS = 1000;
const MINUTES = SECONDS * 60;
const HOURS = MINUTES * 60;
const DAYS = HOURS * 24;
const WEEKS = DAYS * 7;
const MONTHS = DAYS * 30;
const YEARS = DAYS * 365;

// move apiUrl to database
module.exports = Object.freeze({
  apiConfig: {
    zen: {
      nodeAPI: {
        defaultSvParentLocation: 'na',
        defaultSvChildLocation: 'ts2',
        na: {
          ts1: 'https://securenodes1.na.zensystem.io/api/',
          ts2: 'https://securenodes2.na.zensystem.io/api/',
          ts3: 'https://securenodes3.na.zensystem.io/api/',
          ts4: 'https://securenodes4.na.zensystem.io/api/',
        },
        eu: {
          ts1: 'https://securenodes1.eu.zensystem.io/api/',
          ts2: 'https://securenodes2.eu.zensystem.io/api/',
          ts3: 'https://securenodes3.eu.zensystem.io/api/',
          ts4: 'https://securenodes4.eu.zensystem.io/api/',
        },
      },
    },
    useTestNet: false,
    page: 1,
    row: 5000,
  },
  message: {
    errorMsg: {
      resErrorMsg: 'There are something wrong when interacting with database.',
      notFoundMsg: 'not found.',
      notProvidedMsg: 'Please provide ',
    },

  },
  indexInHdWalletWhenNotExist: -1,
  regexExp: {
    macAddressRegex: /^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$/,
    emailRegex: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    getNumberRegex: /[^0-9]/g,
    matchNumberRegex: /[0-9]/g,
    onlyNumberRegex: /^[0-9]+\.?[0-9]*$/,
  },
  whereMethods: ['where', 'orWhere', 'andWhere', 'whereIn', 'multipleWhereIn'],
  otherMethods: ['limit', 'offset', 'orderBy'],
  SECONDS,
  MINUTES,
  HOURS,
  DAYS,
  WEEKS,
  MONTHS,
  YEARS,
});
