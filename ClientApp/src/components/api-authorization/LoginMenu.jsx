import React from 'react';
import { NavItem, NavLink, Badge } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useStoreOf } from '@stores';
import { Strings } from '@i18n';


export default function LoginMenu({ pathname }) {
  const [authUserProfile] = useStoreOf('authUserProfile');
  const [newContactRequests] = useStoreOf('newContactRequests');

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
  const isContact = /\/contact\/?/i.test(pathname);
  const { hasUser /*, userName*/ } = authUserProfile;
  const notifications = newContactRequests;

  if(hasUser) {
    return (
      <>
        <NavItem active={isDiscover}>
          <NavLink tag={Link} to="/discover">{Strings.titles.Discover}</NavLink>
        </NavItem>
        <NavItem active={isRootAccount}>
          {/* <NavLink tag={Link} to="/account">Hello {userName}</NavLink> */}
          <NavLink tag={Link} to="/account">{Strings.titles.MyProfile}{
            notifications > 0 && <Badge className="ml-1" color="success">{notifications}</Badge>
          }</NavLink>
        </NavItem>
        {renderAdminPanelLink()}
        <NavItem active={isContact}>
          <NavLink tag={Link} to="/contact">Contact</NavLink>
        </NavItem>
        <NavItem active={action === 'logout'}>
          <NavLink tag={Link} to="/account/logout">{Strings.titles.Logout}</NavLink>
        </NavItem>
      </>
    );
  }

  return (
    <>
      <NavItem active={isContact}>
        <NavLink tag={Link} to="/contact">Contact</NavLink>
      </NavItem>
      <NavItem active={action === 'register'}>
        <NavLink tag={Link} to="/account/register">{Strings.titles.Register}</NavLink>
      </NavItem>
      <NavItem active={action === 'login'}>
        <NavLink tag={Link} to="/account/login">{Strings.titles.Login}</NavLink>
      </NavItem>
    </>
  ); 
}
