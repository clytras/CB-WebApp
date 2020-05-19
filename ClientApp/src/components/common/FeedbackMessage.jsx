import React from 'react';
import { Button } from 'reactstrap';
import InlineMessage from '@components/common/InlineMessage';
import FrontContentBase from '@components/common/FrontContentBase';


export default function FeedbackMessage({ message, color, onRetry }) {
  return (
    <FrontContentBase centered>
      <InlineMessage color={color}>{message}</InlineMessage>
      {onRetry && <Button onClick={onRetry}>Retry</Button>}
    </FrontContentBase>
  );
}
