import React from 'react';
import SideBar from './SideBar';
import SectionContainer from './SectionContainer';


export default function Layout({ children }) {
  return (
    <div className="admin-panel">
      <SideBar/>
      <SectionContainer>{children}</SectionContainer>
    </div>
  );
}
