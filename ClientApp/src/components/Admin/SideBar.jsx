import React from 'react';
import { NavItem, NavLink, Nav } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FaUserAlt, FaNewspaper } from "react-icons/fa";
import clsx from 'clsx';

export default function SideBar() {

  return (
    <div className={clsx('sidebar', 'is-open')}>
      <div className="sidebar-header">
        <span color="info" style={{color: '#fff'}}>&times;</span>
        <h3>Bootstrap Sidebar</h3>
      </div>
      <div className="side-menu">
        <Nav vertical className="list-unstyled pb-3">
          <p>Dummy Heading</p>
          {/* <SubMenu title="Home" icon={faHome} items={submenus[0]}/> */}
          <NavItem>
            <NavLink tag={Link} to={'/users'}>
              <FaUserAlt/>Users
            </NavLink>
          </NavItem>
          {/* <SubMenu title="Pages" icon={faCopy} items={submenus[1]}/> */}
          <NavItem>
            <NavLink tag={Link} to={'/pages'}>
              <FaNewspaper/>Content Blocks
            </NavLink>
          </NavItem>
        </Nav>        
      </div>
    </div>
  );
}
