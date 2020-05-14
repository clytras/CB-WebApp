import React from 'react';
import { NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useStoreOf } from '@stores';


export default function LoginMenu() {
  const [authUser] = useStoreOf('authUser');

  if(authUser) {
    const { name } = authUser;
    return (
      <>
        <NavItem>
          <NavLink tag={Link} className="text-dark" to="/account">Hello {name}</NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} className="text-dark" to="/account/logout">Logout</NavLink>
        </NavItem>
      </>
    );
  }

  return (
    <>
      <NavItem>
        <NavLink tag={Link} className="text-dark" to="/account/register">Register</NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} className="text-dark" to="/account/login">Login</NavLink>
      </NavItem>
    </>
  ); 
}
