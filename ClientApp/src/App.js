import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router';
import { Layout } from '@components/Layout';
import { Home } from '@components/Home';
import { RProgress } from 'rprogress';
import { FetchData } from '@components/FetchData';
import { useStoreOf } from '@stores';
import { Counter } from '@components/Counter';
import AuthorizeRoute from '@components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from '@components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from '@components/api-authorization/ApiAuthorizationConstants';
import AjaxAuth from '@api-auth/AjaxAuth';
import AuthRoute from '@api-auth/AuthRoute';
import AdminIndex from '@components/Admin';
import AdminContent from '@components/Admin/Content';
import Login from '@api-auth/Login';
import Register from '@api-auth/Register';
import { IdentityRoles } from '@api-auth';
import authService from '@api-auth/AuthorizeService';

import 'rprogress/lib/components/overlay/overlay-styles.css';
import 'rprogress/lib/components/rprogress/rprogress-styles.css';
import './custom.css';


export default function App() {
  const [, setAuthUser] = useStoreOf('authUser', 'setAuthUser');

  useEffect(() => {
    const authSubscription = authService.subscribe(authCheck);

    authCheck();

    return () => {
      authSubscription && authService.unsubscribe(authSubscription);
    }
  }, []);

  const authCheck = async () => {
    const user = await authService.getUser();
    setAuthUser(user);
  }

  return (
    <>
      <Switch>
        <AuthRoute path="/admin" ofRoles={[IdentityRoles.Admin, IdentityRoles.Editor]}>
          <Route path="/admin" component={AdminIndex} />
          <Route path="/admin/content" component={AdminContent} />
        </AuthRoute>
        <Route path={[
          '/', 
          '/counter', 
          '/ajax-auth', 
          '/account/login', 
          '/account/logout',
          '/account/confirm-email',
          '/account/resend-email-confirmation'
        ]}>
          <Layout>
            <Route exact path="/" component={Home} />
            <Route path="/counter" component={Counter} />
            <Route path="/ajax-auth" component={AjaxAuth} />
            <Route path="/account/login" component={Login} />
            <Route path="/account/register" component={Register} />
          </Layout>
        </Route>

        {/* <Layout>
          <Route exact path='/' component={Home} />
          <Route path='/counter' component={Counter} />
          <Route path='/ajax-auth' component={AjaxAuth} />
          <AuthorizeRoute path='/fetch-data' component={FetchData} />
          <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
        </Layout> */}
      </Switch>
      <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
      <RProgress color={'red'} type="incremental" />
    </>
  );
}
