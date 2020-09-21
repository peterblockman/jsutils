const self = class {

};
module.exports = self;
const R = require('ramda');

/**
 * Determine if data is a redux action
 * @param  {any} data
 * @return {boolean}
 */
const isReduxAction = R.curry(
  (data) => {
    const hasType = R.has('type', data);
    const hasPayload = R.has('payload', data);
    const isReduxAction = hasType && hasPayload;
    return isReduxAction;
  },
);

const isRejectAction = R.includes('REJECT_');

const isActionTypeExist = (actionType) => Boolean(actionType);
const checkActionType = R.curry(
  (type, actionType) => (isActionTypeExist(actionType) ? R.includes(type, actionType) : false),
);

const isSuccessAction = R.curry(
  (type) => R.and(
    checkActionType('SUCCESS', type),
    !isRejectAction(type),
  ),
);

self.isReduxAction = isReduxAction;
self.isRejectAction = isRejectAction;
self.isSuccessAction = isSuccessAction;
