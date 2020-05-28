import React from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';

export default function Layout({ children }) {
  return (
    <Container className="mt-3">
      <div className="account">
        <NavMenu />
        <Container>
          {children}
        </Container>
      </div>
    </Container>
  );
}
