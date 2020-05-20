import React from 'react';
import { Button } from 'reactstrap';
import InlineMessage from '@components/common/InlineMessage';
import FrontContentBase from '@components/common/FrontContentBase';


export default function FeedbackMessage({ message, color, onRetry }) {
  return (
    <FrontContentBase centered>
      <InlineMessage text={message} color={color} />
      {onRetry && <Button onClick={onRetry}>Retry</Button>}
    </FrontContentBase>
  );
}
