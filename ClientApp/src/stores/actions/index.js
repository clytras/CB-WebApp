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
