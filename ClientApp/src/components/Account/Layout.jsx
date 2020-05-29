import React from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';

export default function Layout({ children }) {
  return (
    <Container className="account mt-3">
      <NavMenu />
      <Container>
        {children}
      </Container>
    </Container>
  );
}
