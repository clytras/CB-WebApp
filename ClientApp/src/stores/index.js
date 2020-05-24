import React from 'react';
import useGlobalHook from 'use-global-hook';
import { UserProfile } from '@api-auth/AuthorizeService';
import { BusinessProfile } from '@data/BusinessProfile';
import * as actions from './actions';

const initialState = {
  appLanguage: null,
  authReady: false,
  authUser: null,
  authUserProfile: new UserProfile(),
  userBusinessProfile: new BusinessProfile(),
  meta: {}
}

const globalHook = useGlobalHook(React, initialState, actions);

export default globalHook;
export function useStoreOf(prop, action = null) {
  return globalHook(
    store => store[prop],
    action && (actions => actions[action])
  );
}
