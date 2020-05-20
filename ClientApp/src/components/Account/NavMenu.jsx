import React from 'react';
import { Row, Col, Collapse, Container, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link, useLocation } from 'react-router-dom';


export default function NavMenu() {
  const { pathname } = useLocation();
  // const [routeId, setRouteId] = useState();


  // useEffect(() => {
  //   console.log('location.pathname', location.pathname);
  //   const [, routeIdSegment] = location.pathname.match(/\/([a-z0-9-]+)/i) || [];
  //   setRouteId(routeIdSegment);
  // }, [location]);

  // const toggleNavbar = () => setCollapsed(!collapsed);

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
