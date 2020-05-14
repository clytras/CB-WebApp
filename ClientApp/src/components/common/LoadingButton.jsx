import React from 'react';
import { Button } from 'reactstrap';
import MoonLoader from "react-spinners/MoonLoader";
import { StyleSheet, css } from 'aphrodite';


export default function LoadingButton({
  children,
  loading,
  disabled,
  ...rest
}) {

  return (
    <Button {...rest} disabled={disabled || loading}>
      <div className={css(styles.content)}>
        {loading && <MoonLoader size={14} color="white" />}
        <div className={css(styles.children)}>
          {children}
        </div>
      </div>
    </Button>
  )
}


const styles = StyleSheet.create({
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  children: {
    marginLeft: 5
  }
});
