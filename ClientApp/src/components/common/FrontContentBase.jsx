import React from 'react';
import { Col } from 'reactstrap';
import { StyleSheet/*, css*/ } from 'aphrodite/no-important';
import clsx from 'clsx';


export default function FrontContentBase({
  children,
  // columnSize = 8,
  // offsetSize = 2,

  sm = 12,
  md = 8,
  lg = 6,
  xl = 6,

  centered = false,
  className = ''
}) {

  // let clsName = `col-sm-12 col-md-${columnSize} ${className} `;

  // if(offsetSize) {
  //   clsName += `col-md-offset-${offsetSize === 'col' ? columnSize : offsetSize} `;
  // }

  // if(centered) {
  //   clsName += css(styles.centered);
  // }

  // return <div className={clsName}>{children}</div>;

  function getColProps(size) {
    if (centered) {
      const offset = Math.round((12 - size) / 2);
      return { size, offset };
    }
    return size;
  }

  return (
    <Col className={clsx(className, centered && styles.centered)} 
      sm={getColProps(sm)} lg={getColProps(lg)} md={getColProps(md)} xl={getColProps(xl)}>
      {children}
    </Col>
  );
}

const styles = StyleSheet.create({
  centered: {
    margin: 'auto'
  }
});
