import React from 'react';
import { NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useStoreOf } from '@stores';
import { Strings } from '@i18n';


export default function LoginMenu({ pathname }) {
  const [authUserProfile] = useStoreOf('authUserProfile');

  function renderAdminPanelLink() {
    const { isEditorRole, isAdminRole } = authUserProfile;

    if(isEditorRole || isAdminRole) {
      return (
        <NavItem>
          <NavLink tag={Link} to="/admin">{Strings.titles.Administrator}</NavLink>
        </NavItem>
      );
    }
  }

  const [, controller, action] = pathname.split('/');
  const isAccount = controller === 'account';
  const isRootAccount = isAccount && !/login|logout|register|reset-password|confirm-email/i.test(action);
  const isDiscover = controller === 'discover';
  const { hasUser /*, userName*/ } = authUserProfile;

  if(hasUser) {
    return (
      <>
        <NavItem active={isDiscover}>
          <NavLink tag={Link} to="/discover">{Strings.titles.Discover}</NavLink>
        </NavItem>
        <NavItem active={isRootAccount}>
          {/* <NavLink tag={Link} to="/account">Hello {userName}</NavLink> */}
          <NavLink tag={Link} to="/account">{Strings.titles.MyProfile}</NavLink>
        </NavItem>
        {renderAdminPanelLink()}
        <NavItem active={action === 'logout'}>
          <NavLink tag={Link} to="/account/logout">{Strings.titles.Logout}</NavLink>
        </NavItem>
      </>
    );
  }

  return (
    <>
      <NavItem active={action === 'register'}>
        <NavLink tag={Link} to="/account/register">{Strings.titles.Register}</NavLink>
      </NavItem>
      <NavItem active={action === 'login'}>
        <NavLink tag={Link} to="/account/login">{Strings.titles.Login}</NavLink>
      </NavItem>
    </>
  ); 
}
