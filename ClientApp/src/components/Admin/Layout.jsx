import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import SideBar from './SideBar';
import SectionContainer from './SectionContainer';
import clsx from 'clsx';


export default function Layout({ children }) {
  return (
    <div className="admin-panel">
      <SideBar/>
      <SectionContainer>{children}</SectionContainer>
    </div>
  );
}
