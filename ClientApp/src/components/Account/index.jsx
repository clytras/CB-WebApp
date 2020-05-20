import React from 'react';
import { Route, Switch } from 'react-router';
import Layout from './Layout';
import Summary from './Summary';
import Profile from './Profile';
import Settings from './Settings';


export default function Account() {
  return (
      <Layout>
        <Switch>
        <Route exact path="/account" component={Summary} />
        <Route path="/account/profile" component={Profile} />
        <Route path="/account/settings" component={Settings} />
        </Switch>
      </Layout>
  
  );
}
