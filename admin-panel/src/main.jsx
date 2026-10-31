import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { isAdminPreviewEnabled } from './preview/previewMode.js';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

function renderApplication(application) {
  root.render(
    <React.StrictMode>
      <BrowserRouter
  basename={import.meta.env.BASE_URL.replace(/\/$/, '')}
  future={{
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  }}
>

        {application}
      </BrowserRouter>
    </React.StrictMode>,
  );
}

if (import.meta.env.DEV && isAdminPreviewEnabled(import.meta.env)) {
  import('./preview/PreviewApp.jsx')
    .then(({ default: PreviewApp }) => renderApplication(<PreviewApp />))
    .catch((error) => {
      console.error('Unable to load the local dashboard preview.', error);
      root.render(<main role="alert">Unable to load the local dashboard preview.</main>);
    });
} else {
  renderApplication(
    <AuthProvider>
      <App />
    </AuthProvider>,
  );
}
