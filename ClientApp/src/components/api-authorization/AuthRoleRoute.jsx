import React from 'react';
import { Route } from 'react-router-dom';
import { Alert } from 'reactstrap';
import { useStoreOf } from '@stores';
import { Strings } from '@i18n';
import FrontContentBase from '@components/common/FrontContentBase';
import Layout from '@components/Layout';
import Delayed from '@components/common/Delayed';


export default function AuthRoleRoute({
  ofRoles = '*',
  children,
  ...rest
}) {
  const [authReady] = useStoreOf('authReady');
  const [authUserProfile] = useStoreOf('authUserProfile');

  if (!authReady) {
    return null;
  }

  if(ofRoles === '*' || authUserProfile.isOneOfRoles(ofRoles)) {
    return <Route {...rest}>{children}</Route>;
  }

  return (
    <Delayed>
      <Layout>
        <FrontContentBase centered>
          <Alert color="warning">{Strings.messages.Auth.ResourceAccessDenied}</Alert>
        </FrontContentBase>
      </Layout>
    </Delayed>
  );
}
