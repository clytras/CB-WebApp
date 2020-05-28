import React from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';
import Footer from './Footer';


export default function Layout({ children }) {
  return (
    <div className="front">
      <NavMenu />
      {children}
      <Footer/>
    </div>
  );
}
