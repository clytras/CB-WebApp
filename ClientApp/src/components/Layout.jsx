import React from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';

export default function Layout({ children }) {
  return (
    <div className="front">
      <NavMenu />
      <Container>
        {children}
      </Container>
    </div>
  );
}
