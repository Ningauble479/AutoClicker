import React from 'react';
import ReactDOM from 'react-dom';
import './Styles/index.css';
import App from './Pages/App';
import reportWebVitals from './CRA/reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();