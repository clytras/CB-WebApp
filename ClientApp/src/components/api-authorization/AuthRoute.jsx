import React from 'react';
import { Redirect, Route } from 'react-router-dom';
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
    return null;
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
