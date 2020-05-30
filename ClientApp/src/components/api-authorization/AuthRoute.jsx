import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import LoadingOverlay from '@components/common/LoadingOverlay';
import Delayed from '@components/common/Delayed';
import { useStoreOf } from '@stores';
import styled from 'styled-components';


const Flexed = styled.div`margin-top: 2em; flex: 1`;

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
      <Flexed>
        <Delayed waitBeforeShow={1000}>
          <LoadingOverlay/>
        </Delayed>
      </Flexed>
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
