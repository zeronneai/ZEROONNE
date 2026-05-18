import React, { lazy, Suspense } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
const BlogIndex = lazy(() => import('./src/pages/BlogIndex'));
const BlogPost  = lazy(() => import('./src/pages/BlogPost'));
const FAQ       = lazy(() => import('./src/pages/FAQ'));

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Could not find root element to mount to');

const app = (
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/faq"       element={<FAQ />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

// Use hydrateRoot when the server/prerender has already injected HTML,
// otherwise fall back to a fresh createRoot mount.
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
