import React, { useEffect } from 'react';
import '../Styles/AlertBar.css';

const AlertBar = ({ message, type, duration, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`alert-bar ${type}`}>
      {message}
    </div>
  );
};

export default AlertBar;
