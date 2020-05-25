import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import LoadingOverlay from '@components/common/LoadingOverlay';
import Delayed from '@components/common/Delayed';
import { useStoreOf } from '@stores';


export default function AuthRoute({
  children,
  ...rest
}) {
  const [authReady] = useStoreOf('authReady');
  const [authUserProfile] = useStoreOf('authUserProfile');
  const { hasUser = false } = authUserProfile || {};

  console.log('AuthRoute', authReady, hasUser);

  if (!authReady) {
    return (
      <Delayed waitBeforeShow={1000}>
        <LoadingOverlay/>
      </Delayed>
    );
  }

  return <Route 
    {...rest}
    render={({ location }) => hasUser ? children : (
      <Redirect to={{
        pathname: '/account/login',
        state: { from: location }
      }}/>
    )}
  />;
}
