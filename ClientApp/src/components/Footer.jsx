import React from 'react';
import Markdown from '@components/common/Markdown';
import { getStaticContent } from '@data/StaticContent';


export default function Footer() {
  const content = getStaticContent('FooterCopyright');

  return (
    <footer>
      {content && (
        <div className="copyright text-center py-3">
          <Markdown source={content} />
        </div>
      )}
    </footer>
  );
}
