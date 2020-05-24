import React from 'react';
import { Route, Switch } from 'react-router';
import Layout from './Layout';
import AuthRoute from '@api-auth/AuthRoute';
import Summary from './Summary';
import Profile from './Profile';
import Settings from './Settings';


export default function Account() {
  return (
      <Layout>
        <AuthRoute path="/account*">
          <Switch>
            <Route exact path="/account" component={Summary} />
            <Route path="/account/profile" component={Profile} />
            <Route path="/account/settings" component={Settings} />
          </Switch>
        </AuthRoute>
      </Layout>
  );
}
