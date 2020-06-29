import React from 'react';
import { useLocation } from 'react-router-dom';
import { NavItem, NavLink, Nav } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FaUserAlt, FaNewspaper } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import clsx from 'clsx';

export default function SideBar() {
  const location = useLocation();

  // function isSelected(subRoute) {
  //   const re = new RegExp(`/admin/${subRoute}`);
  //   return re.test(location.pathname);
  // }

  function isSelectedClass(subRoute) {
    const re = new RegExp(`/admin/${subRoute}`);
    return re.test(location.pathname) && 'selected';
  }

  return (
    <div className={clsx('sidebar', 'is-open')}>
      <div className="sidebar-header">
        {/* <span color="info" style={{color: '#fff'}}>&times;</span> */}
        {/* <h3>Bootstrap Sidebar</h3> */}
        <Link to="/">
          <img alt="Admin Logo" className="logo" src="/assets/Interreg-Greenmind-Logo_alpha.png"/>
        </Link>
      </div>
      <div className="side-menu">
        <Nav vertical className="list-unstyled pb-3">
          <p>Admin Panel</p>
          {/* <SubMenu title="Home" icon={faHome} items={submenus[0]}/> */}
          <NavItem className={clsx(/\/admin\/?$/.test(location.pathname) && 'selected')}>
            <NavLink tag={Link} to={'/admin'}>
              <MdDashboard/> Dashboard
            </NavLink>
          </NavItem>
          <NavItem className={clsx(isSelectedClass('users'))}>
            <NavLink tag={Link} to={'/admin/users'}>
              <FaUserAlt/> Users
            </NavLink>
          </NavItem>
          {/* <SubMenu title="Pages" icon={faCopy} items={submenus[1]}/> */}
          <NavItem className={clsx(isSelectedClass('content'))}>
            <NavLink tag={Link} to={'/admin/content'}>
              <FaNewspaper/> Content Blocks
            </NavLink>
          </NavItem>
        </Nav>        
      </div>
    </div>
  );
}
