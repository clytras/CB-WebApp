import { Strings } from '@i18n';

export function getCountriesForSelect() {
  return Object.entries(Strings.Collections.Countries).map(([value, label]) => ({ value, label }));
}
