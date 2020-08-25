const R = require('ramda');
const RA = require('ramda-adjunct');
const Result = require('folktale/result');
const uniqBy = require('lodash/fp/uniqBy');
const isEmpty = require('lodash/isEmpty');
const isArray = require('lodash/fp/isArray');
const isPlainObject = require('lodash/isPlainObject');
const groupBy = require('lodash/groupBy');
const { trace } = require('../ramda/trace');
const { isArrayOfObjects } = require('../general_utils/utils');

/**
 * Uniq group item by uniqKey if uniqKey not provided
 * return the groupData
 * @param  {string} uniqKey   [description]
 * @param  {Array} groupData [description]
 * @return {Array}           [description]
 */
const uniqGroupItem = R.curry(
  (uniqKey, groupData) => (!uniqKey
    ? groupData
    : R.uniqBy(R.prop(uniqKey), groupData)),
);
/**
 *  Group an object's properties
 *  it doesnot remove common propeters
 * @param  {Object} structure - grouping sucture
 * @param  {string} key  - the key to group object
 * @return {Object}
 */
const groupObjectPropsByStructure = R.curry(
  (structure, item) => {
    const { groupName, groupProps, uniqKey } = structure;
    return R.reduce(
      (acc, subItem) => ({
        ...R.omit(groupProps)(subItem),
        [groupName]: R.pipe(
          R.pick(groupProps),
          R.flip(R.append)(acc[groupName]),
          uniqGroupItem(uniqKey),
        )(subItem),
      }),
      { [groupName]: [] },
    )(item);
  },
);
/**
 *  Group an object's properties but only group the value and remove the key
 * @param  {Object} structure - grouping sucture
 * @param  {string} key  - the key to group object
 * @return {Object}
 */
const groupObjectPropsByStructureKeepOnlyValue = R.curry(
  (structure, item) => {
    const { groupName, groupProps } = structure;
    return R.reduce(
      (acc, subItem) => ({
        ...R.omit(groupProps)(subItem),
        [groupName]: acc[groupName].concat([R.pick(groupProps)(subItem)[groupProps]]),
      }),
      { [groupName]: [] },
    )(item);
  },
);
/**
 *  Group object's properties in array of objects
 *  it doesnot remove common propeters
 * @param  {string} key  - the key to group object
 * @param  {Object[]} structures - grouping sucture
 * @return {Object[]}
 */
const groupObjectsPropsByStructures = R.curry(
  (key, structures, data) => (
    R.reduce(
      (acc, structure) => {
        const groupedData = R.pipe(
          R.groupBy((x) => x[key]),
          RA.toArray,
          R.map(groupObjectPropsByStructure(structure)),
        )(data);
        return R.concat(acc, groupedData);
      },
      [],
      structures,
    )
  ),
);
/**
 *  Group object's properties in array of objects
 *  it doesnot remove common propeties
 * @param  {string} key  - the key to group object
 * @param  {Object[]} structures - grouping sucture
 * @return {Object[]}
 */
const groupObjectsPropsByStructuresKeepOnlyValue = R.curry(
  (key, structures, data) => (
    R.reduce(
      (acc, structure) => {
        const groupedData = R.pipe(
          R.groupBy((x) => x[key]),
          RA.toArray,
          R.map(groupObjectPropsByStructureKeepOnlyValue(structure)),
        )(data);
        return R.concat(acc, groupedData);
      },
      [],
      structures,
    )
  ),
);
/**
 * Get strutuces item
 * @param  {string} itemKey
 * @param  {Object[]} structures
 * @return {Array}
 */
const creatGetStructureItem = R.curry(
  (itemKey, structures) => R.pipe(
    R.map((strucuture) => strucuture[itemKey]),
    R.flatten,
  )(structures),
);
const getGroupProps = creatGetStructureItem('groupProps');
const getGroupNames = creatGetStructureItem('groupName');
/**
 * Get common properties of the objects
 * @param  {string} key  - the key to group object
 * @param  {Object[]} structures - grouping sucture
 * @param  {Object[]} objects
 * @return {Object[]}
 */
const getCommonProps = R.curry(
  (key, structures, objects) => {
    const allGroupProps = getGroupProps(structures);
    return R.pipe(
      R.map(R.omit(allGroupProps)),
      uniqBy(key),
    )(objects);
  },
);
/**
 * combineCommonAndGroupedData's inner reduce function
 * @param  {string} key  - the key to group object
 * @param  {Object[]} structures - grouping sucture
 * @param  {Object[]} commonData  - contains objects that have
 * properties that are not used to group
 * @param {Array} acc  -  reduce's acc
 * @return {Object[]}
 */
const combineCommonAndGroupedItem = R.curry(
  (key, structures, groupedData, acc, item) => {
    const groupNames = getGroupNames(structures);
    const groupPropsData = R.pipe(
      R.filter((x) => x[key] === item[key]),
      R.reduce((acc, x) => ({ ...acc, ...x }), {}), // merge all item into 1 object
      R.pick(groupNames),
      R.merge(item),
    )(groupedData);
    return R.append(groupPropsData, acc);
  },
);
/**
 * Combine common data and grouped data
 * @param  {string} key  - the key to group object
 * @param  {Object[]} structures - grouping sucture
 * @param  {Object[]} commonData  - contains objects that have
 * properties that are not used to group
 * @param {Object[]} groupedData  -  contains objects that have
 * properties that are not used to group
 * @return {Object[]}
 */
const combineCommonAndGroupedData = R.curry(
  (key, structures, commonData, groupedData) => R.reduce(
    combineCommonAndGroupedItem(key, structures, groupedData),
    [],
    commonData,
  ),
);
/**
 * Check headGroup, then head if true
 * @param  {Objects[]} groupedObject
 * @param  {string} acc
 * @param  {Objects[]} groupStructure
 * @return {Objects[]}
 */
const headGroupData = R.curry(
  (groupedObject, acc, groupStructure) => R.pipe(
    (item) => {
      const { headGroup, groupName } = groupStructure;
      const handleHead = R.curry(
        (
          groupName,
          headGroup,
          groupData,
        ) => (headGroup ? R.head(groupData[groupName]) : groupData[groupName]),
      );
      return R.pipe(
        handleHead(groupName, headGroup),
        R.flip(R.assoc(groupName))(acc),
      )(item);
    },
  )(groupedObject),
);
/**
 * Check if groupedObject's grouped props is single, then head if true
 * return the current grouped props if false
 * @param  {string} key
 * @param  {Objects[]} structures
 * @param  {Objects[]} groupedObject
 * @return {Objects[]}
 */
const headGroupedPropsIfSingle = R.curry(
  (key, structures, groupedObject) => R.pipe(
    R.map(R.pick(['groupName', 'headGroup'])),
    R.reduce(
      headGroupData(groupedObject),
      groupedObject,
    ),
  )(structures),
);
const isAllNull = R.all((x) => !x);

const isObjectValuesAllNull = R.curry(
  (object) => R.pipe(
    R.values,
    isAllNull,
  )(object),
);
const shouldOmitGroup = R.curry(
  (value) => {
    const isAllNull = R.all((x) => !x);
    if (isPlainObject(value)) {
      const isAllValuesNull = isObjectValuesAllNull(value);
      const shouldOmit = isEmpty(value) || isAllValuesNull;
      return shouldOmit;
    }
    if (isArray(value)) {
      if (isEmpty(value)) return true;
      if (isAllNull(value)) return true;
      if (isArrayOfObjects(value)) {
        return R.pipe(
          R.map(
            (item) => isObjectValuesAllNull(item),
          ),
          R.all((x) => x),
        )(value);
      }
    }
    return false;
  },
);
const handleremoveGroupIfNull = R.curry((dataItem) => R.pipe(
  R.toPairs,
  R.filter((pairs) => RA.isObjLike(pairs[1])),
  R.reduce(
    (acc, pairs) => {
      const [key, value] = pairs;
      const shouldOmit = shouldOmitGroup(value);
      if (shouldOmit) {
        return R.omit([key], acc);
      }
      return acc;
    },
    dataItem,
  ),
)(dataItem));
const removeGroupIfNull = R.curry(
  (data) => {
    if (isPlainObject(data)) return handleremoveGroupIfNull(data);
    if (isArray(data)) return R.map(handleremoveGroupIfNull, data);
    return data;
  },
);
/**
 * Group object's properties in array of objects
 * with a given key and structures
 * assuming that all objects have the same keys
 * TODO add check if all objects' keys are the same
 * @param  {string} key  - the key to group object
 * @param  {Object[]} structures - grouping sucture
 * @properties structure.groupProps - the properties that will be grouped
 * @properties structure.groupName - the name of the groups
 * @properties structure.uniqKey - key to make group items unique
 * @properties structure.headGroup - head the group if true
 * @param  {Object[]} objects
 * @return {Object[]}
 */
const groupObjectsProps = R.curry(
  (key, structures, objects) => {
    if (isEmpty(objects)) return objects;
    const commonData = getCommonProps(key, structures, objects);
    return R.pipe(
      groupObjectsPropsByStructures(key, structures),
      combineCommonAndGroupedData(key, structures, commonData),
      R.map(headGroupedPropsIfSingle(key, structures)),
      removeGroupIfNull,
    )(objects);
  },
);
/**
 * Group object's properties in array of value
 * with a given key and structures
 * @param  {string} key  - the key to group object
 * @param  {Object[]} structures - grouping sucture
 * @properties structure.groupProps - the properties that will be grouped
 * @properties structure.groupName - the name of the groups
 * @param  {Object[]} objects
 * @return {Object[]}
 */
const groupObjectsPropsKeepOnlyValue = R.curry(
  (key, structures, objects) => {
    if (isEmpty(objects)) return objects;
    const commonData = getCommonProps(key, structures, objects);
    return R.pipe(
      groupObjectsPropsByStructuresKeepOnlyValue(key, structures),
      combineCommonAndGroupedData(key, structures, commonData),
    )(objects);
  },
);


/**
 * Replace an propperty of a group to none if it is null
 * Used with json-api-serializer
 * @param  {string[]}  groupNames
 * @param  {Object[]} data
 * @return {Array}
 */
const handleCreateReplaceNilPropGroup = R.curry(
  (replaceValue, groupNamesAndKeys, item) => R.reduce(
    (acc, groupItem) => {
      const [key, value] = R.pipe(R.toPairs, R.head)(groupItem);
      const id = item[key][value];
      return R.isNil(id)
        ? R.set(R.lensPath([key, value]), replaceValue)(acc)
        : acc;
    },
    item,
    groupNamesAndKeys,
  ),
);
/**
 * Replace an propperty of a group to none if it is null
 * work with array and object
 * Used with json-api-serializer
 * @param  {string[]}  groupNames
 * @param  {Object[]} data
 * @return {Array}
 */
const createReplaceNilPropGroup = R.curry(
  (replaceValue, groupNamesAndKeys, data) => {
    if (isArray(data)) {
      return R.map(
        (item) => handleCreateReplaceNilPropGroup(replaceValue, groupNamesAndKeys, item),
        data,
      );
    } if (isPlainObject(data)) {
      return handleCreateReplaceNilPropGroup(replaceValue, groupNamesAndKeys, data);
    }
    return data;
  },
);

const replaceNilPropGroupWithNone = createReplaceNilPropGroup('none');
/**
 * simple grouping an Array based on a groupByKey
 * the different with groupObjectsProps is that it groups the array
 * and returns the grouped array without a property keys
 * @param  {string} groupByKey - the key to group
 * @return {Array}
 */
const groupDataBy = R.curry(
  (groupByKey, data) => Object.values(groupBy(data, groupByKey)),
);

module.exports = {
  groupObjectPropsByStructure,
  groupObjectsPropsKeepOnlyValue,
  groupObjectsProps,
  replaceNilPropGroupWithNone,
  groupDataBy,
  removeGroupIfNull,
};
