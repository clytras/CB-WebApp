import React from 'react';
import { Route, Switch } from 'react-router';
import Layout from './Layout';
import Dashboard from './Dashboard';
import ContentIndex from './Content';
import ContentCU from './Content/CU';
import Users from './Users';


export default function Admin() {

  return (
    <Layout>
      <Switch>
        <Route exact path="/admin" component={Dashboard} />
        <Route exact path="/admin/content" component={ContentIndex} />
        <Route path="/admin/content/add" component={ContentCU} />
        <Route path="/admin/content/edit/:itemId" component={ContentCU} />
        <Route path="/admin/users" component={Users} />
      </Switch>
    </Layout>
  );
}
