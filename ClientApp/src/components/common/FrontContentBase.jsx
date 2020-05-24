import React from 'react';
import { StyleSheet, css } from 'aphrodite';


export default function FrontContentBase({
  children,
  columnSize = 6,
  offsetSize = 'col',
  centered = false
}) {

  let className = `col-sm-12 col-md-${columnSize} `;

  if(offsetSize) {
    className += `col-md-offset-${offsetSize === 'col' ? columnSize : offsetSize} `;
  }

  if(centered) {
    className += css(styles.centered);
  }

  return <div className={className}>{children}</div>;
}

const styles = StyleSheet.create({
  centered: {
    margin: 'auto'
  }
});
