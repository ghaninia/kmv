import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Root';
import './bootstrap';

ReactDOM.createRoot(document.getElementById('app')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
