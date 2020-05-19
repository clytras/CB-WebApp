import React from 'react';
import SectionBar from './SectionBar';

export default function Content({ children }) {
  return (
    <div className="section-cotainer">
      <SectionBar/>
      <section className="content">
        {children}
      </section>
    </div>
  );
}
