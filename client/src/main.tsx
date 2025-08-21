import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './pages/AppBase';

/**
 * Ponto de entrada principal da aplicação React.
 * Renderiza o componente App na raiz do documento HTML.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <App />

);