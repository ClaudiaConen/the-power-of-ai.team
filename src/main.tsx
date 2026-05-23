import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <a href="#main-content" className="skip-link">Zum Inhalt springen</a>
    <main id="main-content">
      <App />
    </main>
  </StrictMode>
);
