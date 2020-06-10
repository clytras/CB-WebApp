import React from 'react';
import { Nav, Navbar, NavItem, NavLink, Badge } from 'reactstrap';
import { Link, useLocation } from 'react-router-dom';
import { useStoreOf } from '@stores';
import { Strings } from '@i18n';


export default function NavMenu() {
  const { pathname } = useLocation();
  const [newContactRequests] = useStoreOf('newContactRequests');

  return (
    <Navbar light>
      <Nav pills vertical>
        <NavItem>
          <NavLink active={/\/account\/?$/.test(pathname)} tag={Link} to="/account">{Strings.titles.Summary}</NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={/\/account\/profile\/?/.test(pathname)} tag={Link} to="/account/profile">{Strings.titles.Profile}</NavLink>
        </NavItem>
        <NavItem className="text-nowrap">
          <NavLink active={/\/account\/requests\/?/.test(pathname)} tag={Link} to="/account/requests">{Strings.titles.Requests}{
            newContactRequests > 0 && <Badge className="ml-1" color="light">{newContactRequests}</Badge>
          }</NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={/\/account\/settings\/?/.test(pathname)} tag={Link} to="/account/settings">{Strings.titles.Settings}</NavLink>
        </NavItem>
      </Nav>
    </Navbar>
  );
}
