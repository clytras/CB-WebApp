import React, { useState } from 'react';
import { Collapse, Container, Navbar, NavbarToggler, NavItem, NavLink, Row, Col } from 'reactstrap';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import LoginMenu from '@api-auth/LoginMenu';
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
