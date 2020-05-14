import React from 'react';
import { Route, Switch } from 'react-router';
import Layout from './Layout';
import SideBar from './SideBar';
import Dashboard from './Dashboard';


export default function Admin() {

  return (
    <Route component={Layout}>
      <Switch>
        <Route path="/admin" component={Dashboard} />
      </Switch>
    </Route>
  );
}
