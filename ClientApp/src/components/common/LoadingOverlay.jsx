import React from 'react';
import clsx from 'clsx';
import { GridLoader, ClipLoader, MoonLoader, BarLoader } from 'react-spinners';
import { StyleSheet, css } from 'aphrodite';

const spinners = {
  'GridLoader': GridLoader,
  'ClipLoader': ClipLoader,
  'MoonLoader': MoonLoader,
  'BarLoader': BarLoader
}

export default function LoadingOverlay({
  color = '#535353',
  size = 50,
  height = 8,
  width = 220,
  inline = false,
  loading = true,
  overlay = undefined,
  spinner = 'MoonLoader',
  topmost = false
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

  const props = spinner === 'BarLoader' ? { width, height } : { size };

  return loading && (
    <div style={style} className={
      clsx(css(styles.overlay), {
        [css(styles.inline)]: inline,
        [css(styles.topmost)]: topmost
      })
    }>
      <Spinner
        {...props}
        color={color}
        loading={true}
      />
    </div>
  );
}

// export const GlobalLoadingOverlay = withStore(props => {
//   const store = props.store;
//   const ui = store.get('ui');
//   return <LoadingOverlay inline overlay topmost loading={ui.get('loading')}/>;
// });

const styles = StyleSheet.create({
  overlay: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topmost: {
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
