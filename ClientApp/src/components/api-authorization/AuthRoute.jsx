import React, { useState, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import authService from './AuthorizeService'
import { IdentityRoles } from '.';


export default function AuthRoute({
  ofRoles = '*',
  children,
  ...rest
}) {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState();

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
    setAuthUser(user);
    setReady(true);
  }

  if(!ready) {
    return <div>Not ready</div>;
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

  // if(!authenticated) {
  //   // return <div>Need Login</div>
  //   return <Route 
  //     {...rest}
  //     render(({ location }) => )
  //   />;
  // }

  return (
    <div>
      <h3>Authenticated</h3>
      <pre>{JSON.stringify(authUser, null, 2)}</pre>
    </div>
  );
  
}
