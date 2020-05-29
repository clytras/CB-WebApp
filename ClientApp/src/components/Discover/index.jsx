import React from 'react';
import { Route, Switch } from 'react-router';
import AuthRoute from '@api-auth/AuthRoute';
import ContentBody from '@components/common/ContentBody';
import Profiles from './Profiles';
import OpenProfile from './OpenProfile';


export default function Discover() {
  return (
    <AuthRoute path="/discover*">
      <ContentBody>
        <Switch>
          <Route exact path="/discover" component={Profiles} />
          <Route path="/discover/profile/:profileId" component={OpenProfile} />
          {/* <Route path="/account/profile" component={Profile} />
          <Route path="/account/settings" component={Settings} /> */}
        </Switch>
      </ContentBody>
    </AuthRoute>
  );
}
