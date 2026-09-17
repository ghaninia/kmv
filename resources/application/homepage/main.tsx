import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './fonts.css';
import './index.css';
import './farmix-overrides.css';

const container = document.getElementById('homepage-root');

if (container) {
    createRoot(container).render(
        <StrictMode>
            <App />
        </StrictMode>,
    );
}
