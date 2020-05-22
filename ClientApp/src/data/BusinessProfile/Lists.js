import startCase from 'lodash.startcase';
import get from 'lodash.get';
import { Strings } from '@i18n';
import BusinessActivities from './Activities';


export function getActivitiesFlatList(path, {
  options = true,
  onlyOptions = false
} = {}) {
  const list = path ? get(BusinessActivities, path) : BusinessActivities;
  const prepend = (path || '').split('.')[0];
  const recurse = (items, prepend) => {
    let result = [];
    const entries = Object.entries(items);

    for (const [alias, children] of entries) {    
      if (alias === '$') {
        if (options) {
          for (const option of children) {
            const $option = `$${option}`;
            const item = prepend ? [prepend, $option].join('.') : $option;
            result.push(item);
          }
        }
      } else if (typeof(children) === 'string') {
        if (children === '$' && options) {
          const $option = `$${alias}`;
          const item = prepend ? [prepend, $option].join('.') : $option;
          result.push(item);
        }
      } else {
        const item = prepend ? [prepend, alias].join('.') : alias;

        if (!onlyOptions) {
          result.push(item);
        }

        result = result.concat(recurse(children, item));
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
