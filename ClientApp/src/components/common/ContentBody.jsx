import React from 'react';
import { Container } from 'reactstrap';
import clsx from 'clsx';


export default function ContentBody({
  withBackground = true,
  withStatic = false,
  children
}) {

  function render(content) {
    if (withBackground) {
      return <div className="content-container">{content}</div>;
    }

    return content;
  }

  return render(
    <Container>
      <div className={clsx('content', withStatic && 'static')}>{children}</div>
    </Container>
  );
}
