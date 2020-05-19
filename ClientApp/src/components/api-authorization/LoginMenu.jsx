import React from 'react';
import { NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useStoreOf } from '@stores';


export default function LoginMenu() {
  const [authUserProfile] = useStoreOf('authUserProfile');

  console.log('LoginMenu');

  function renderAdminPanelLink() {
    const { isEditorRole, isAdminRole } = authUserProfile;

    if(isEditorRole || isAdminRole) {
      return (
        <NavItem>
          <NavLink tag={Link} className="text-dark" to="/admin">Admin Panel</NavLink>
        </NavItem>
      );
    }
  }

  const { hasUser, userName } = authUserProfile;

  if(hasUser) {
    return (
      <>
        <NavItem>
          <NavLink tag={Link} className="text-dark" to="/account">Hello {userName}</NavLink>
        </NavItem>
        {renderAdminPanelLink()}
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
