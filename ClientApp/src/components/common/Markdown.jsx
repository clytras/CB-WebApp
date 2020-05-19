import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';


export default function Markdown(props) {
  return <ReactMarkdown {...props} renderers={{ link: MarkdownLink }} />;
}

function MarkdownLink({ href, children}) {
  return (
    href.match(/^\//)
      ? <Link to={href}>{children}</Link>
      : <a href={href}>{children}</a>
  );
}
