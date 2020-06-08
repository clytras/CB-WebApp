import React, { useState } from 'react';
import { Collapse, Container, Navbar, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import LoginMenu from '@api-auth/LoginMenu';


const Logo = styled.img`
  width: 30%;
`;

export default function NavMenu() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(true);

  const toggleNavbar = () => setCollapsed(!collapsed);

  return (
    <header>
      <div>
        <Link to="/"><Logo src="/assets/Interreg-Greenmind-Logo.jpg"/></Link>
      </div>
      <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow" light>
        <Container>
          {/* <NavbarBrand tag={Link} to="/">CERTHB2B</NavbarBrand> */}
          <NavbarToggler onClick={toggleNavbar} className="mr-2" />
          <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!collapsed} navbar>
            <ul className="navbar-nav flex-grow">
              <NavItem active={pathname === '/'}>
                <NavLink tag={Link} to="/">Home</NavLink>
              </NavItem>
              {/* <NavItem>
                <NavLink tag={Link} className="text-dark" to="/debug/csrf-post">CSRF Post</NavLink>
              </NavItem> */}
              {/* <NavItem active={/\/contact\/?/i.test(pathname)}>
                <NavLink tag={Link} to="/contact">Contact</NavLink>
              </NavItem> */}
              {/* <NavItem>
                <NavLink tag={Link} className="text-dark" to="/ajax-auth">Ajax Auth</NavLink>
              </NavItem> */}
              <LoginMenu pathname={pathname} />
            </ul>
          </Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
