import React, { useState } from 'react';
import { Alert } from 'reactstrap';
import { utsj } from 'lyxlib/utils/time';


export default function InlineMessage({
  text,
  ...rest
}) {
  const [keyPrefix] = useState(utsj());

  return text && text.length ? (
    <Alert {...rest}>{Array.isArray(text) ? (
      <ul>
        {text.map((line, index) => <li key={`im-${keyPrefix}-${index}`}>{line}</li>)}
      </ul>
    ) : text}</Alert>
  ) : null;
}
