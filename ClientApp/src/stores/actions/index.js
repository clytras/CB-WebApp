export const setAppLanguage = (store, appLanguage) => {
  store.setState({ appLanguage });
}

export const addCounter = (store, value = 1) => {
  // let { counter } = store.state;
  // counter += value;
  const counter = store.state.counter + value;
  store.setState({ counter });
}

export const setAppMeta = (store, meta) => {
  store.setState({ meta });
}

export const setAuthReady = (store, authReady) => {
  store.setState({ authReady });
}

export const setAuthUser = (store, authUser) => {
  store.setState({ authUser });
}

export const setAuthUserProfile = (store, authUserProfile) => {
  store.setState({ authUserProfile });
}

export const setUserBusinessProfile = (store, userBusinessProfile) => {
  store.setState({ userBusinessProfile });
}

export const setNewContactRequests = (store, newContactRequests) => {
  store.setState({ newContactRequests });
}
