import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Root';
import './bootstrap';
import '../../css/app.css';

ReactDOM.createRoot(document.getElementById('app')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
