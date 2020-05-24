import { removeAllWhitespaces } from 'lyxlib/utils/str';


export const isPhoneNumber = ({
  number,
  minLength = 10,
  maxLength = 15
}) => {
  const check = removeAllWhitespaces(number);
  return check.length >= minLength &&
         check.length <= maxLength &&
         /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g.test(check);
}

export const ifString = (value, isValue, isNotValue = null) => 
  typeof(value) === 'string' ? (isValue === undefined ? value : isValue) : isNotValue;
