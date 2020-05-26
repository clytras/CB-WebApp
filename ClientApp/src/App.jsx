import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import { Route, Switch } from 'react-router';
import Layout from '@components/Layout';
import { RProgress } from 'rprogress';
import { ToastContainer } from 'react-toastify';
import CookieConsent from "react-cookie-consent";
import { useStoreOf } from '@stores';
import ApiAuthorizationRoutes from '@components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from '@components/api-authorization/ApiAuthorizationConstants';
import AuthRoute from '@api-auth/AuthRoute';
import AuthRoleRoute from '@api-auth/AuthRoleRoute';
import Home from '@components/Home';
import Contact from '@components/Contact';
import AdminIndex from '@components/Admin';
import AccountIndex from '@components/Account';
import ForgotPassword from '@api-auth/ForgotPassword';
import ResetPassword from '@api-auth/ResetPassword';
import Login from '@api-auth/Login';
import Logout from '@api-auth/Logout';
import Register from '@api-auth/Register';
import ConfirmEmail from '@api-auth/ConfirmEmail';
import { IdentityRoles } from '@api-auth';
import AuthService from '@api-auth/AuthorizeService';
import { BusinessProfile } from '@data/BusinessProfile';

import 'rprogress/lib/components/overlay/overlay-styles.css';
import 'rprogress/lib/components/rprogress/rprogress-styles.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-markdown-editor-lite/lib/index.css';
import 'pretty-checkbox';
import './App.scss';
import './custom.css';

// import CSRFPost from '@components/debug/CSRFPost';
// import AjaxAuth from '@components/debug/AjaxAuth';


function App() {
  const [, setAuthReady] = useStoreOf('authReady', 'setAuthReady');
  const [, setAuthUser] = useStoreOf('authUser', 'setAuthUser');
  const [, setAuthUserProfile] = useStoreOf('authUserProfile', 'setAuthUserProfile');
  const [, setUserBusinessProfile] = useStoreOf('userBusinessProfile', 'setUserBusinessProfile');

  useEffect(() => {
    let initialAuthTimerId;

    const authCheck = async () => {
      clearTimeout(initialAuthTimerId);

      try {
        const user = await AuthService.getFullUser();
        setAuthUser(user);

        const userProfile = await AuthService.getUserProfile();
        setAuthUserProfile(userProfile);

        const userBusinessProfile = await BusinessProfile.GetProfileOfUser();
        setUserBusinessProfile(userBusinessProfile);

        console.log('App:authCheck', user, userProfile, userBusinessProfile);
      } catch(err) {
        console.warn('App:authCheck FAIL', err);
      } finally {
        setAuthReady(true);
      }
    }

    const authSubscription = AuthService.subscribe(authCheck);

    initialAuthTimerId = setTimeout(authCheck, 1000);

    return () => {
      authSubscription && AuthService.unsubscribe(authSubscription);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Switch>
        <AuthRoute path="/admin">
          <AuthRoleRoute path="/admin" ofRoles={[IdentityRoles.Admin, IdentityRoles.Editor]} component={AdminIndex} />
        </AuthRoute>
        <Layout>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/account/login" component={Login} />
            <Route path="/account/logout" component={Logout} />
            <Route path="/account/register" component={Register} />
            <Route path="/account/confirm-email" component={ConfirmEmail} />
            <Route path="/account/forgot-password" component={ForgotPassword} />
            <Route path="/account/reset-password" component={ResetPassword} />
            <Route path="/account*" component={AccountIndex} />
            <Route path="/contact" component={Contact} />

            {/* <Route path="/debug/ajax-auth" component={AjaxAuth} />
            <Route path="/debug/csrf-post" component={CSRFPost} /> */}
          </Switch>
        </Layout>
      </Switch>
      <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
      <CookieConsent sameSite="lax"
        disableStyles={true}
        location="bottom"
        buttonClasses="btn btn-primary"
        containerClasses="cookie-consent alert alert-warning col-lg-12"
        contentClasses="text-capitalize">
        <h4>This website uses cookies to enhance the user experience.</h4>
        <p>By continuing to browse the site you're agreeing to our use of cookies.</p>
      </CookieConsent>
      <RProgress color={'red'} type="incremental" />
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default hot(App);
