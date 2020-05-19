import React, { useState, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import authService from './AuthorizeService'


export default function AuthRoute({
  children,
  ...rest
}) {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const authSubscription = authService.subscribe(authCheck);

    authCheck();

    return () => {
      authSubscription && authService.unsubscribe(authSubscription);
    }
  }, []);

  const authCheck = async () => {
    setReady(false);

    const isAuth = await authService.isAuthenticated();
    let user;

    if(isAuth) {
      user = await authService.getUser();
    }

    setAuthenticated(isAuth);
    setReady(true);
  }

  if(!ready) {
    return null;
  }

  console.log('AuthRoute', authenticated);

  return <Route 
    {...rest}
    render={({ location }) => authenticated ? children : (
      <Redirect to={{
        pathname: '/account/login',
        state: { from: location }
      }}/>
    )}
  />;
}
