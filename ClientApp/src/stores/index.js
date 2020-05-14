import React from 'react';
import useGlobalHook from 'use-global-hook';
import * as actions from './actions';

const initialState = {
  appLanguage: null,
  authUser: null,
  meta: {},
  counter: 12,
};

const globalHook = useGlobalHook(React, initialState, actions);

export default globalHook;
export function useStoreOf(prop, action = null) {
  return globalHook(
    store => store[prop],
    action && (actions => actions[action])
  );
}
