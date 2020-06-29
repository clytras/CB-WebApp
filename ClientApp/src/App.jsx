import React, { useEffect, useRef } from 'react';
import { hot } from 'react-hot-loader/root';
import { Route, Switch } from 'react-router';
import { Button } from 'reactstrap';
import Layout from '@components/Layout';
import { spaHeartbeat } from '@data/Spa/Heartbeat';
import { every } from 'lyxlib/utils/time';
import { RProgress } from 'rprogress';
import { ToastContainer, toast } from 'react-toastify';
import CookieConsent from "react-cookie-consent";
import { useStoreOf } from '@stores';
import ApiAuthorizationRoutes from '@components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from '@components/api-authorization/ApiAuthorizationConstants';
import AuthRoute from '@api-auth/AuthRoute';
import AuthRoleRoute from '@api-auth/AuthRoleRoute';
import Home from '@components/Home';
import Contact from '@components/Contact';
import ContentBody from '@components/common/ContentBody';
import { Strings } from '@i18n';

import {
  Register, Login, Logout,
  ConfirmEmail, ForgotPassword, ResetPassword,
  AdminIndex, AccountIndex, DiscoverIndex
} from '@lazy';

// import Login from '@lazy';
// import Logout from '@lazy/Logout';
// import ConfirmEmail from '@lazy/ConfirmEmail';
// import ForgotPassword from '@lazy/ForgotPassword';
// import ResetPassword from '@lazy/ResetPassword';
// import AdminIndex from '@lazy/AdminIndex';
// import AccountIndex from '@lazy/AccountIndex';

import { IdentityRoles } from '@api-auth';
import AuthService from '@api-auth/AuthorizeService';
import { getProfileOfUser } from '@data/BusinessProfile';

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
  const [, setNewContactRequests] = useStoreOf('newContactRequests', 'setNewContactRequests');
  const reloading = useRef(false);
  const newVersionToastRef = useRef();

  useEffect(() => {
    let initialAuthTimerId;
    let prevNewContactRequests;

    const authCheck = async () => {
      clearTimeout(initialAuthTimerId);

      try {
        const user = await AuthService.getFullUser();
        setAuthUser(user);

        const userProfile = await AuthService.getUserProfile();
        setAuthUserProfile(userProfile);

        const userBusinessProfile = await getProfileOfUser();
        setUserBusinessProfile(userBusinessProfile);

        const { newContactRequests } = userBusinessProfile || {};
        if (prevNewContactRequests !== newContactRequests) {
          setNewContactRequests(newContactRequests);
          prevNewContactRequests = newContactRequests;
        }

        // console.log('App:authCheck', user, userProfile, userBusinessProfile);
      } catch(err) {
        console.warn('App:authCheck FAIL', err);
      } finally {
        setAuthReady(true);
      }
    }

    const authSubscription = AuthService.subscribe(authCheck);

    initialAuthTimerId = setTimeout(authCheck, 1000);

    const heartBeatTimer = every('1m').do(async () => {
      const { ok, spaVersion, /*isAuth = false,*/ newContactRequests = 0 } = await spaHeartbeat();
  
      // const { spaVersion } = checkHeartbeat(heartbeat, { user });
      // setNeedsRelogin(needsRelogin);

      // const { version } = heartbeat || {};
      // setNewVersion(hasNewVersion ? version : {});

      if (ok) {
        if (prevNewContactRequests !== newContactRequests) {
          setNewContactRequests(newContactRequests);
          prevNewContactRequests = newContactRequests;
        }

        if (spaVersion !== window.__SpaVersion) {
          newVersionToastRef.current = toast.info(
            <>
              <div className="mb-2">{Strings.messages.AppNewVersion}</div>
              <Button color="light" onClick={handleReloadClick}>{Strings.titles.ReloadPage}</Button>
            </>,
            { autoClose: false, toastId: 'new-app-version' }
          );
        } else if (newVersionToastRef.current) {
          toast.dismiss(newVersionToastRef.current);
          newVersionToastRef.current = null;
        }
      }
    });

    const handleReloadClick = () => {
      if (!reloading.current) {
        reloading.current = true;
        heartBeatTimer.stop();
        window.location.reload();
      }
    }

    return () => {
      authSubscription && AuthService.unsubscribe(authSubscription);
      heartBeatTimer.stop();
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
          <Route exact path={[
            '/', '/contact', 
            '/account/login', '/account/logout', '/account/register',
            '/account/confirm-email', '/account/forgot-password', '/account/reset-password'
          ]}>
            <ContentBody>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/contact" component={Contact} />
                <Route path="/account/login" component={Login} />
                <Route path="/account/logout" component={Logout} />
                <Route path="/account/register" component={Register} />
                <Route path="/account/confirm-email" component={ConfirmEmail} />
                <Route path="/account/forgot-password" component={ForgotPassword} />
                <Route path="/account/reset-password" component={ResetPassword} />
              </Switch>
            </ContentBody>
          </Route>
          <Switch>
            <Route path="/account*" component={AccountIndex} />
            <Route path="/discover*" component={DiscoverIndex} />
          </Switch>

          {/* <Route path="/debug/ajax-auth" component={AjaxAuth} />
          <Route path="/debug/csrf-post" component={CSRFPost} /> */}
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
