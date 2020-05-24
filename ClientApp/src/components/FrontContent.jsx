import React, { useState, useEffect } from 'react';
import { RProgressApi } from 'rprogress';
import { apiGet } from '@utils/net';
import { getStaticContent } from '@data/StaticContent';
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
  contentBlocks,
  tryStaticContent = true
}) {
  const [pendingBlocks, setPendingBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState([]);
  const [status, setStatus] = useState();
  const [error, setError] = useState();
  const [componentId] = useState(utsj());

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => contentController(), []);

  useEffect(() => {
    function fetchData() {
      RProgressApi.start();
      setLoading(true);
      setContent([]);
      setStatus();
      setError();
  
      const binds = Array.isArray(contentBlocks) ? contentBlocks.join(',') : contentBlocks;
  
      apiGet(`/api/Content/BindTo/${binds}`).then(async (resp) => {
        setStatus(resp.status);
  
        if (resp.ok) {
          const data = await resp.json();
          setContent(prev => ([...prev, ...data]));
        }
      }).catch(err => {
        setError(err && err.message);
      }).finally(() => {
        RProgressApi.complete();
        setLoading(false);
      });
    }

    if (pendingBlocks && pendingBlocks.length) {
      fetchData();
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingBlocks]);

  function contentController() {
    const blocks = Array.isArray(contentBlocks) ? contentBlocks : [contentBlocks];
    const newContent = [];
    let pendingContent = [];

    if (tryStaticContent) {
      for (const bindTo of blocks) {
        const content = getStaticContent(bindTo);
        if (content) {
          newContent.push({ content });
        } else {
          pendingContent.push(bindTo);
        }
      }
    } else {
      pendingContent = blocks;
    }

    setContent(newContent);
    setPendingBlocks(pendingContent);
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
