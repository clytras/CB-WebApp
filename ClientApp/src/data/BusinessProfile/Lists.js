import startCase from 'lodash.startcase';
import get from 'lodash.get';
import { Strings } from '@i18n';
import BusinessActivities from './Activities';


export function getActivitiesListWithCounters(data, applySelectionsOf) {
  if (!data) data = BusinessActivities;

  function recurse(obj, cur = '') {
    const out = { ...obj, _count: 0 };

    if (cur) cur = `${cur}.`;
    if (applySelectionsOf) out._select = 0;
  
    for (const key in obj) {
      const value = obj[key];
  
      if (key === '$') {
        out._count += value.length;

        if (applySelectionsOf) {
          for (const option of value) {
            if (applySelectionsOf.indexOf(`${cur}$${option}`) > -1) {
              out._select++;
            }
          }
        }
      } else if (value === '$') {
        out._count++;

        if (applySelectionsOf && applySelectionsOf.indexOf(`${cur}$${key}`) > -1) {
          out._select++;
        }
      } else {
        out[key] = recurse(value, `${cur}${key}`);
        out._count += out[key]._count;

        if (applySelectionsOf) {
          out._select += out[key]._select;
        }
      }
    }
  
    return out;
  }

  return recurse(data);
}

/**
 * Mas girnaei to dentro me ta activities se flatlist (array).
 * @param string  path                  Mporoume na dosoume path an theloume na paroume kati mesa apo to dentro (oxi aparetito)
 * @param {bool}  options               An tha epistrafoun ta options apo tis listes
 * @param {bool}  onlyOptions           An tha epistrafoun mono options xoris katigories
 * @param {bool}  withCounters          Na epistrafoun oi metrites ton option gia kathe katigoria (einai recursive to metrima)
 * @param {bool}  withSelectedCounters  Na epistrafei object metriton (anti gia arithmo mono total) me 2 properties,
 *                                      total gia to sinolo kai select gia ta epilegmena options
 * @param {array} applySelectionsOf     Lista me ta options pou na koitaksei gia epilegmena options
 */

export function getActivitiesFlatList(path, {
  options = true,
  onlyOptions = false,
  withCounters = false,
  withSelectedCounters = false,
  applySelectionsOf = []
} = {}) {
  const data = withCounters ?
    getActivitiesListWithCounters(
      BusinessActivities, 
      withSelectedCounters && applySelectionsOf
    ) : 
    BusinessActivities;
  const list = path ? get(data, path) : data;
  const prepend = (path || '').split('.')[0];
  const recurse = (items, prepend) => {
    let result = withCounters ? {} : [];
    const entries = Object.entries(items);
    const add = option => {
      const $option = `$${option}`;
      const path = [prepend, $option].join('.');

      if (!withCounters) {
        const item = prepend ? path : $option;
        result.push(item);
      }
    }

    for (const [alias, children] of entries) {
      if (alias === '$') {
        if (options) {
          for (const option of children) {
            add(option);
          }
        }
      } else if (typeof(children) === 'string') {
        if (children === '$' && options) {
          add(alias);
        }
      } else if (!onlyOptions && alias !== '_count' && alias !== '_select') {
        const item = prepend ? [prepend, alias].join('.') : alias;
        if (withCounters) {
          if (withSelectedCounters) {
            result[item] = { total: children._count, select: children._select };
          } else {
            result[item] = children._count;
          }
          
          result = {...result, ...recurse(children, item) };
        } else {
          result.push(item);
          result = result.concat(recurse(children, item));
        }
      }
    }

    return result;
  }

  if (list) {
    return recurse(list, prepend);
  }
}

export function getActivitiesListItemName(item, removeOptionSign = false) {
  if (item) {
    const [, name] = item.match(removeOptionSign ? /\.?\$(\w+)$/ : /\.?(\$?\w+)$/);
    return name;
  }
}

export function getActivitiesListItemText(item) {
  const name = getActivitiesListItemName(item, true);

  if (name) {
    if (name in Strings.Business.Lists) {
      return Strings.Business.Lists[name];
    }
  
    return startCase(item);
  }

  return `[${item}:text]`;
}

export function getAllActivitiesEntryNames() {
  const names = [];
  const recurse = (items) => {
    const entries = Object.entries(items);

    for (const [alias, children] of entries) {    
      if (alias === '$') {
        for (const option of children) {
          if (names.indexOf(option) === -1) {
            names.push(option);
          }
        }
      } else if (typeof(children) === 'string') {
        if (children === '$') {
          if (names.indexOf(alias) === -1) {
            names.push(alias);
          }
        }
      } else {
        if (names.indexOf(alias) === -1) {
          names.push(alias);
        }
        recurse(children);
      }
    }
  }

  recurse(BusinessActivities);
  return names;
}

export function getActivitiesForSelect(baseAlias) {
  const entries = Object.entries(BusinessActivities[baseAlias]);
  const groups = [];
  const directGroup = [];

  for (const [alias, children] of entries) {
    if (children === '$') {
      directGroup.push({
        label: Strings.Business.Lists[alias],
        value: `${baseAlias}.$${alias}`
      })
    } else if (typeof(children) === 'object') {
      const options = [];
      for (const option of children.$) {
        options.push({
          label: Strings.Business.Lists[option],
          value: `${baseAlias}.${alias}.$${option}`
        });
      }

      if (options.length) {
        groups.push({ label: Strings.Business.Lists[alias], options });
      }
    }
  }

  if (directGroup.length) {
    groups.push({ label: Strings.Business.Lists[baseAlias], options: directGroup });
  }

  return groups;
}
