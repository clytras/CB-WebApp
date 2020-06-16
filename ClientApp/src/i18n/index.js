import LocalizedStrings from 'react-localization';
import Languages, { supportedLanguageDefs } from './languages';
import HttpStatus from 'http-status-codes';
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

export async function translateResponseMessage(response, { defCode }) {
  let data, text;

  try {
    data = await response.json();
  } catch(derr) {
    try {
      text = await response.text();
    } catch(terr) {}
  }

  if (data) {
    if (Array.isArray(data)) {
      return data;
    }
  
    const { errorCode } = data;
    
    if (errorCode) {
      return translateCodeMessage(errorCode, defCode);
    }

    return httpUnknownError(response.statusCode, data);
  }

  return httpUnknownError(response.statusCode, text);
}

export function translateCodeMessage(code, defCode) {
  switch(code || defCode) {
    case 'AccountLocked': return Strings.messages.Auth.AccountLocked;
    case 'Account2FA': return Strings.messages.Auth.Account2FA;
    case 'LoginFail': return Strings.messages.Auth.LoginFail;
    case 'AccountExists': return Strings.messages.Auth.AccountExists;
    case 'RegistrationError': return Strings.messages.Auth.RegistrationError;
    case 'EmailNotMatchRequest': return Strings.messages.Auth.EmailNotMatchRequest;
    case 'NoProfile': return Strings.messages.UserHasNoProfile;
    case 'CheckAccount': return Strings.messages.Auth.AccountNotFound;
    default: return defCode === undefined ? code : defCode;
  }
}

export function translateRequestError(error) {
  if(error) {
    return Strings.formatString(Strings.messages.RequestError, { error });
  }

  return Strings.messages.UnexpectedError;
}

export function httpRejectedError(statusCode, message = Strings.messages.RequestRejected) {
  return `${message}.\n\n${Strings.titles.RejectionReason}: ${statusCode} ${HttpStatus.getStatusText(statusCode)}`;
}

export function httpUnknownError(statusCode, responseText, message = Strings.messages.RequestProblem) {
  let result = `${message}.\n\n${Strings.titles.RequestProblem}: ${statusCode} ${HttpStatus.getStatusText(statusCode)}`;

  if (responseText) {
    result = `${result}\n${Strings.titles.ResponseText}: "${responseText}"`;
  }

  return result;
}

export {
  supportedLanguageDefs
}
