import startCase from 'lodash.startcase';
import { Strings } from '@i18n';

/**
 * Dollar sign ($) is for list options collection or for a single option item
 */

export default BusinessLists = {
  TopicsOfInterest: {
    CleanPowerTransport: {
      $: [
        'Electromobility',
        'MicroMobility',
        'Biofuels',
        'HydrogenMobility'
      ]
    },
    AirMobility: {
      $: [
        'DronesManufacturing',
        'DronesTrading'
      ]
    },
    Logistics: {
      $: [
        'LastmileLogistics',
        'DronesApplicationsForLogistics'
      ]
    },
    UrbanMobility: {
      $: [
        'SharedMobility',
        'TrafficManagementSystems'
      ]
    },
    TransportInfrastructure: {
      $: [
        'RailInfrastructure',
        'RoadInfrastructure',
        'MaritimeInfrastructure',
        'AirTransportInfrastructure'
      ]
    },
    Automotive: {
      $: [
        'ElectricVehiclesManufacturing',
        'ElectricVehiclesTrading',
        'AutonomousVehiclesManufacturing',
        'AutonomousVehiclesTrading'
      ]
    },
    ICTTransport: {
      $: [
        'ITSSystems',
        'CITSSystems',
        'DataAnalyticsTransport'
      ]
    },
    TransportPolicy: '$',
    ConsultingServices: '$'
  },
  Offer: {
    Collaboration: {
      $: [
        'ForFundingCall',
        'DevelopNewProduct',
        'DevelopNewService'
      ]
    },
    TechnicalCooperation: '$',
    ConsultingServices: {
      $: [
        'BusinessConsultingServices',
        'TransportRelatedConsultingServices',
      ]
    }
  },
  Request: {
    Collaboration: {
      $: [
        'ForFundingCall',
        'DevelopNewProduct',
        'DevelopNewService'
      ]
    },
    Supplier: {
      $: [
        'ForComponents',
        'ForServices',
        'ForData'
      ]
    },
    ConsultingServices: {
      $: [
        'BusinessConsultingServices',
        'TransportRelatedConsultingServices',
      ]
    }
  }
}

export function getFlatList(path, {
  options = true,
  onlyOptions = false
} = {}) {
  const list = path ? get(BusinessLists, path) : BusinessLists;
  const prepend = (path || '').split('.')[0];
  const recurse = (items, prepend) => {
    const result = [];
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
      } else if (!onlyOptions) {
        const item = prepend ? [prepend, alias].join('.') : alias;
        result.push(item);
        result = result.concat(recurse(children, item));
      }
      
    }

    return result;
  }

  if (list) {
    return recurse(list, prepend);
  }
}

export function getListItemName(item, removeOptionSign = false) {
  if (item) {
    const [, name] = item.match(removeOptionSign ? /\.?\$(\w+)$/ : /\.?(\$?\w+)$/);
    return name;
  }
}

export function getListItemText(item) {
  const name = getListItemName(item, true);

  if (name) {
    if (name in Strings.Business.Lists) {
      return Strings.Business.Lists[name];
    }
  
    return startCase(item);
  }

  return `[${item}:text]`;
}

export function getAllEntryNames() {
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

  recurse(BusinessLists);
  return names;
}
