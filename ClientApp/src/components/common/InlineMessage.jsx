import React from 'react';
import { Alert } from 'reactstrap';


export default function InlineMessage({
  text,
  ...rest
}) {
  return text ? (
    <Alert {...rest}>{text}</Alert>
  ) : null;
}
