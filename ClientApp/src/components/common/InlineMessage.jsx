import React, { useState } from 'react';
import { Alert } from 'reactstrap';
import { utsj } from 'lyxlib/utils/time';
import Markdown from '@components/common/Markdown';


export default function InlineMessage({
  text,
  markdown,
  ...rest
}) {
  const [keyPrefix] = useState(utsj());

  if(markdown) {
    return (
      <Alert {...rest}>
        <Markdown source={markdown} />
      </Alert>
    );
  }

  return text && text.length ? (
    <Alert {...rest}>{Array.isArray(text) ? (
      <ul>
        {text.map((line, index) => <li key={`im-${keyPrefix}-${index}`}>{line}</li>)}
      </ul>
    ) : text}</Alert>
  ) : null;
}
