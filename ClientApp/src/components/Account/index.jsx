import React from 'react';
import { Route, Switch } from 'react-router';
import Layout from './Layout';
import AuthRoute from '@api-auth/AuthRoute';
import Summary from './Summary';
import Profile from './Profile';
import Requests from './Requests';
import Settings from './Settings';


export default function Account() {
  return (
    <AuthRoute exact path={["/account", "/account/profile", "/account/settings", "/account/requests"]}>
      <Layout>
        <Switch>
          <Route exact path="/account" component={Summary} />
          <Route path="/account/profile" component={Profile} />
          <Route path="/account/requests" component={Requests} />
          <Route path="/account/settings" component={Settings} />
        </Switch>
      </Layout>
    </AuthRoute>
  );
}
