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

export const Strings = new LocalizedStrings(Languages);

export function translateCodeMessage(code, defCode) {
  switch(code || defCode) {
    case 'AccountLocked': return Strings.messages.Auth.AccountLocked;
    case 'Account2FA': return Strings.messages.Auth.Account2FA;
    case 'LoginFail': return Strings.messages.Auth.LoginFail;
    default: return code || defCode;
  }
}

export function translateRequestError(error) {
  if(error) {
    return Strings.formatString(Strings.messages.RequestError, { error });
  }

  return Strings.messages.UnexpectedError;
}

export {
  supportedLanguageDefs
}
