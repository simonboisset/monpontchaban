import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { Loading } from 'components/Loading';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import './index.css';
import * as serviceWorker from './serviceWorker';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

ReactDOM.render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={Loading}>
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
