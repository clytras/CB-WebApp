import LocalizedStrings from 'react-localization';
import Languages, { supportedLanguageDefs } from './languages';
import {
  protoFormatPlural,
  protoSelectString,
  protoGetSafeCurrentLocale,
  protoSetSafeLanguage,
  protoHasLocale,
  protoGetInterfaceLocale,
  protoAutoSetLanguage
} from './utils';

LocalizedStrings.prototype.formatPlural = protoFormatPlural;
LocalizedStrings.prototype.selectString = protoSelectString;
LocalizedStrings.prototype.getSafeCurrentLocale = protoGetSafeCurrentLocale;
LocalizedStrings.prototype.hasLocale = protoHasLocale;
LocalizedStrings.prototype.getInterfaceLocale = protoGetInterfaceLocale;
LocalizedStrings.prototype.setSafeLanguage = protoSetSafeLanguage;
LocalizedStrings.prototype.autoSetLanguage = protoAutoSetLanguage;

const Strings = new LocalizedStrings(Languages);

export {
  Strings,
  supportedLanguageDefs
}
