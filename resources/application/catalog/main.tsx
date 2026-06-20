import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import './index.css';

/**
 * Entry point for the public catalog storefront.
 *
 * Mounts the React tree into `#catalog-root` (see `catalog.blade.php`) and
 * scopes client-side routing to the `/catalog` URL prefix.
 */
const container = document.getElementById('catalog-root');

if (container) {
    createRoot(container).render(
        <StrictMode>
            <BrowserRouter basename="/catalog">
                <App />
            </BrowserRouter>
        </StrictMode>,
    );
}
