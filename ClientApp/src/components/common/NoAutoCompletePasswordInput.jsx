import React, { useState, useEffect } from 'react';
import { Input } from 'reactstrap';


/**
 * Make it smart...!
 * 
 * This component is to prevent password auto-complete and
 * force users type their password instead of auto-completing it.
 * 
 * This can prevent individual users to use functionalities such as
 * "Account Deletion" and/or "Password Change" when it happens to
 * have access to the users browser/device.
 * 
 * Application should always force users to TYPE/PASTE their
 * password in order to perform such dangerous tasks.
 */

export default function NoAutoCompletePasswordInput({ onChange, ...props }) {
  const [password, setPassword] = useState('');
  const [hasTyped, setHasTyped] = useState(false);
  const [hasPasted, setHasPasted] = useState(false);
  const [hasPrefilled, setHasPrefilled] = useState(false);

  useEffect(() => {
    if (!hasPrefilled && onChange) {
      onChange(password);
    }
  }, [password, hasPrefilled]);

  // We accept either typing or pasting the password,
  // never both actions combined

  const handlePaste = () => {
    setHasPasted(!hasTyped);
  }

  const handleKeyDown = ({ key, keyCode }) => {
    // Chrome triggers keydown event on auto-complete,
    // but the keyCode is set to undefined so we can catch it
  
    if (keyCode !== undefined && key !== 'Unidentified') {
      setHasTyped(!hasPasted);
    }
  }

  const handleChange = ({ currentTarget: { value }}) => {
    if (!hasTyped && !hasPasted) {
      setHasPrefilled(true);
    } else if (value.length > 0) {
      if (hasTyped || hasPasted) {
        setPassword(value);
      }
    } else {
      setHasPrefilled(false);
      setHasTyped(false);
      setHasPasted(false);
      setPassword('');
    }
  }

  return (
    <Input {...props} type="password"
      onChange={handleChange}
      onPaste={handlePaste}
      onKeyDown={handleKeyDown} />
  );
}
