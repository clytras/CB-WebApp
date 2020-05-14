import React from 'react';
import clsx from 'clsx';
import { GridLoader, ClipLoader, MoonLoader } from 'react-spinners';
import { StyleSheet, css } from 'aphrodite';

const spinners = {
  'GridLoader': GridLoader,
  'ClipLoader': ClipLoader,
  'MoonLoader': MoonLoader
}

export default function LoadingOverlay({
  color = '#535353',
  size = 50,
  inline = false,
  loading = true,
  overlay = undefined,
  spinner = 'MoonLoader',
  topMost = false
}) {
  const Spinner = spinners[spinner];

  let style = {};

  if(overlay === true) {
    style = {
      backgroundColor: 'rgba(0,0,0,.2)'
    }
  } else if(overlay) {
    style = {
      backgroundColor: overlay
    }
  }

  return loading && (
    <div style={style} className={
      clsx(css(styles.overlay), {
        [css(styles.inline)]: inline,
        [css(styles.topMost)]: topMost
      })
    }>
      <Spinner
        size={size}
        color={color}
        loading={true}
      />
    </div>
  );
}

// export const GlobalLoadingOverlay = withStore(props => {
//   const store = props.store;
//   const ui = store.get('ui');
//   return <LoadingOverlay inline overlay topMost loading={ui.get('loading')}/>;
// });

const styles = StyleSheet.create({
  overlay: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topMost: {
    zIndex: 10000
  },
  inline: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0
  }
});
