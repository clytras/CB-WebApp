import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { RProgressApi } from 'rprogress';
import { apiGet } from '@utils/net';
import HttpStatus from 'http-status-codes';
import Markdown from '@components/common/Markdown';
import FeedbackMessage from '@components/common/FeedbackMessage';
import { utsj } from 'lyxlib/utils/time';


export function ContentBody({ children }) {
  return (
    <div className="content">
      {children}
    </div>
  );
}

export default function FrontContent({
  contentBlocks
}) {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState();
  const [status, setStatus] = useState();
  const [error, setError] = useState();
  const [componentId] = useState(utsj());

  useEffect(() => fetchData(), []);

  function fetchData() {
    RProgressApi.start();
    setLoading(true);
    setContent();
    setStatus();
    setError();

    const binds = Array.isArray(contentBlocks) ? contentBlocks.join(',') : contentBlocks;

    apiGet(`/api/Content/BindTo/${binds}`).then(async (resp) => {
      setStatus(resp.status);

      if(resp.ok) {
        setContent(await resp.json());
      }
    }).catch(err => {
      setError(err && err.message);
    }).finally(() => {
      RProgressApi.complete();
      setLoading(false);
    });
  }

  if(error) {
    return <FeedbackMessage message={error} color="danger" />;
  }

  if(status && status !== 200) {
    return (
      <div className="http-status">
        <span className="code">{status}</span>
        <span className="text">{HttpStatus.getStatusText(status)}</span>
      </div>
    );
  }

  if(!loading && content && content.length) {
    return (
      <ContentBody>
        {content.map(({ content }, i) => <Markdown key={`frontcontent-content-${componentId}-${i}`} source={content} />)}
      </ContentBody>
    );
  }

  return null;
}
