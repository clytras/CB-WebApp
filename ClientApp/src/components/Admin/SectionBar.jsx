import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { useLocation } from 'react-router-dom';
import { useStoreOf } from '@stores';
import { Strings } from '@i18n';
import { FaUserAlt } from "react-icons/fa";


function UserMenu() {
  const [authUserProfile] = useStoreOf('authUserProfile');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(prevState => !prevState);

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle} className="profile-menu">
      <DropdownToggle className="profile-button" color="default">
        <FaUserAlt/>
      </DropdownToggle >
      <DropdownMenu right>
        <DropdownItem header>{authUserProfile.userName}</DropdownItem>
        <DropdownItem tag={Link} to="/account/profile">Account Profile</DropdownItem>
        <DropdownItem divider />
        <DropdownItem tag={Link} to="/account/logout">Log out</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default function SectionBar() {
  const location = useLocation();
  const [sections, setSections] = useState([]);

  useEffect(() => {
    // const [, sectionSegment] = location.pathname.match(/\/admin\/([a-z0-9-]+)/i) || [];
    const [, adminSection] = location.pathname.match(/\/admin\/(.*)/i) || [];

    console.log('SectionBar:effect', adminSection, location.pathname, location.pathname.match(/\/admin\/([a-z0-9-]+)\//i))

    if(adminSection) {
      const segmentsSections = adminSection.split('/').map(s => s in Strings.titles.Nav.Sections ? Strings.titles.Nav.Sections[s] : s);

      setSections(segmentsSections);
    } else {
      setSections([Strings.titles.Nav.Sections.dashboard]);
    }
  }, [location]);

  console.log('SectionBar', location);

  return (
    <div className="section-bar">
      <div className="info">
        <div className="sections">{sections && sections.join(' / ')}</div>
      </div>
      <UserMenu/>
    </div>
  );
}
