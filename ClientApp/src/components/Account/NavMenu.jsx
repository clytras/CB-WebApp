import React from 'react';
import { Nav, Navbar, NavItem, NavLink } from 'reactstrap';
import { Link, useLocation } from 'react-router-dom';


export default function NavMenu() {
  const { pathname } = useLocation();

  return (
    <Navbar light>
      <Nav pills vertical>
        <NavItem>
          <NavLink active={/\/account\/?$/.test(pathname)} tag={Link} to="/account">Summary</NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={/\/account\/profile\/?/.test(pathname)} tag={Link} to="/account/profile">Profile</NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={/\/account\/settings\/?/.test(pathname)} tag={Link} to="/account/settings">Settings</NavLink>
        </NavItem>
      </Nav>
    </Navbar>
  );
}
