import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import { Route, Switch } from 'react-router';
import Layout from '@components/Layout';
import { Home } from '@components/Home';
import { RProgress } from 'rprogress';
import { ToastContainer } from 'react-toastify';
import { FetchData } from '@components/FetchData';
import { useStoreOf } from '@stores';
import { Counter } from '@components/Counter';
import AuthorizeRoute from '@components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from '@components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from '@components/api-authorization/ApiAuthorizationConstants';
import AuthRoute from '@api-auth/AuthRoute';
import AuthRoleRoute from '@api-auth/AuthRoleRoute';
import AdminIndex from '@components/Admin';
import AdminContent from '@components/Admin/Content';
import Login from '@api-auth/Login';
import Logout from '@api-auth/Logout';
import Register from '@api-auth/Register';
import ConfirmEmail from '@api-auth/ConfirmEmail';
import { IdentityRoles } from '@api-auth';
import authService from '@api-auth/AuthorizeService';

import 'rprogress/lib/components/overlay/overlay-styles.css';
import 'rprogress/lib/components/rprogress/rprogress-styles.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-markdown-editor-lite/lib/index.css';
import './App.scss';
import './custom.css';


import CSRFPost from '@components/debug/CSRFPost';
import AjaxAuth from '@components/debug/AjaxAuth';


function App() {
  const [, setAuthUser] = useStoreOf('authUser', 'setAuthUser');
  const [, setAuthUserProfile] = useStoreOf('authUserProfile', 'setAuthUserProfile');

  useEffect(() => {
    const authSubscription = authService.subscribe(authCheck);

    authCheck();

    return () => {
      authSubscription && authService.unsubscribe(authSubscription);
    }
  }, []);

  const authCheck = async () => {
    const user = await authService.getFullUser();
    const userProfile = await authService.getUserProfile();

    console.log('App:authCheck', user, userProfile);

    setAuthUser(user);
    setAuthUserProfile(userProfile);
  }

  return (
    <>
      <Switch>
        <AuthRoute path="/admin">
          <AuthRoleRoute path="/admin" ofRoles={[IdentityRoles.Admin, IdentityRoles.Editor]} component={AdminIndex} />
        </AuthRoute>
        <Route exact path={[
          '/', 
          '/counter', 
          '/ajax-auth', 
          '/account/login', 
          '/account/logout',
          '/account/confirm-email',
          '/account/resend-email-confirmation',

          '/debug/csrf-post'
        ]}>
          <Layout>
            <Route exact path="/" component={Home} />
            <Route path="/counter" component={Counter} />
            <Route path="/account/login" component={Login} />
            <Route path="/account/logout" component={Logout} />
            <Route path="/account/register" component={Register} />
            <Route path="/account/confirm-email/:userId?/:confirmationCode?" component={ConfirmEmail} />

            <Route path="/debug/ajax-auth" component={AjaxAuth} />
            <Route path="/debug/csrf-post" component={CSRFPost} />
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
      <ToastContainer />
    </>
  );
}

export default hot(App);
