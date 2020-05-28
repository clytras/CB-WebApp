import React from 'react';
import { Container } from 'reactstrap';


export default function ContentBody({
  withBackground = true,
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
      <div className="content">{children}</div>
    </Container>
  );
}
