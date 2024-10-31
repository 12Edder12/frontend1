import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa 'react-dom/client' en lugar de 'react-dom'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

// Usa 'createRoot' en lugar de 'render'
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

reportWebVitals();
