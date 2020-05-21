import React from 'react';
import { NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useStoreOf } from '@stores';


export default function LoginMenu({ pathname }) {
  const [authUserProfile] = useStoreOf('authUserProfile');

  function renderAdminPanelLink() {
    const { isEditorRole, isAdminRole } = authUserProfile;

    if(isEditorRole || isAdminRole) {
      return (
        <NavItem>
          <NavLink tag={Link} to="/admin">Admin Panel</NavLink>
        </NavItem>
      );
    }
  }

  const [, controller, action] = pathname.split('/');
  const isAccount = controller === 'account';
  const irRootAccount = isAccount && !/login|logout|register|reset-password|confirm-email/i.test(action);
  const { hasUser, userName } = authUserProfile;

  if(hasUser) {
    return (
      <>
        <NavItem active={irRootAccount}>
          <NavLink tag={Link} to="/account">Hello {userName}</NavLink>
        </NavItem>
        {renderAdminPanelLink()}
        <NavItem active={action === 'logout'}>
          <NavLink tag={Link} to="/account/logout">Logout</NavLink>
        </NavItem>
      </>
    );
  }

  return (
    <>
      <NavItem active={action === 'register'}>
        <NavLink tag={Link} to="/account/register">Register</NavLink>
      </NavItem>
      <NavItem active={action === 'login'}>
        <NavLink tag={Link} to="/account/login">Login</NavLink>
      </NavItem>
    </>
  ); 
}
