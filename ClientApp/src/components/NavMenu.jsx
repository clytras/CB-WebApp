import React, { useState, useEffect } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import LoginMenu from '@api-auth/LoginMenu';


const Logo = styled.img`
  width: 30%;
`;

export default function NavMenu() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(true);
  const [routeId, setRouteId] = useState();


  // useEffect(() => {
  //   console.log('location.pathname', location.pathname);
  //   const [, routeIdSegment] = location.pathname.match(/\/([a-z0-9-]+)/i) || [];
  //   setRouteId(routeIdSegment);
  // }, [location]);

  const toggleNavbar = () => setCollapsed(!collapsed);

  return (
    <header>
      <div>
        <Link to="/"><Logo src="/assets/Interreg-Greenmind-Logo.jpg"/></Link>
      </div>
      <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
        <Container>
          {/* <NavbarBrand tag={Link} to="/">EKETAGreenmindB2B</NavbarBrand> */}
          <NavbarToggler onClick={toggleNavbar} className="mr-2" />
          <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!collapsed} navbar>
            <ul className="navbar-nav flex-grow">
              <NavItem active={pathname === '/'}>
                <NavLink tag={Link} to="/">Home</NavLink>
              </NavItem>
              {/* <NavItem>
                <NavLink tag={Link} className="text-dark" to="/counter">Counter</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/fetch-data">Fetch data</NavLink>
              </NavItem>
              <NavItem>
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

// export class NavMenu extends Component {
//   static displayName = NavMenu.name;

//   constructor (props) {
//     super(props);

//     this.toggleNavbar = this.toggleNavbar.bind(this);
//     this.state = {
//       collapsed: true
//     };
//   }

//   toggleNavbar () {
//     this.setState({
//       collapsed: !this.state.collapsed
//     });
//   }

//   render () {
//     return (
//       <header>
//         <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
//           <Container>
//             <NavbarBrand tag={Link} to="/">EKETAGreenmindB2B</NavbarBrand>
//             <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
//             <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
//               <ul className="navbar-nav flex-grow">
//                 <NavItem>
//                   <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
//                 </NavItem>
//                 <NavItem>
//                   <NavLink tag={Link} className="text-dark" to="/counter">Counter</NavLink>
//                 </NavItem>
//                 <NavItem>
//                   <NavLink tag={Link} className="text-dark" to="/fetch-data">Fetch data</NavLink>
//                 </NavItem>
//                 <NavItem>
//                   <NavLink tag={Link} className="text-dark" to="/ajax-auth">Ajax Auth</NavLink>
//                 </NavItem>
//                 <LoginMenu>
//                 </LoginMenu>
//               </ul>
//             </Collapse>
//           </Container>
//         </Navbar>
//       </header>
//     );
//   }
// }
