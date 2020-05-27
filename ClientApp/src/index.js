import 'bootstrap/dist/css/bootstrap.css';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import LoadingOverlay from '@components/common/LoadingOverlay';
//import registerServiceWorker from './registerServiceWorker';

// const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

ReactDOM.render(
  // <BrowserRouter basename={baseUrl}>

  <Suspense fallback={<LoadingOverlay inline overlay topmost size={100} />}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </Suspense>

, rootElement);

// Uncomment the line above that imports the registerServiceWorker function
// and the line below to register the generated service worker.
// By default create-react-app includes a service worker to improve the
// performance of the application by caching static assets. This service
// worker can interfere with the Identity UI, so it is
// disabled by default when Identity is being used.
//
//registerServiceWorker();
