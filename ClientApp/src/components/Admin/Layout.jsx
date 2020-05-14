import React from 'react';
import { StyleSheet, css } from 'aphrodite';


export default function Layout({ children }) {
  return (
    <div className={css(styles.layout)}>
      {children}
    </div>
  );
}

const styles = StyleSheet.create({
  layout: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row'
  }
});
