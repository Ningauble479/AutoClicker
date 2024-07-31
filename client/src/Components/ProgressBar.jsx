import React, { useEffect, useState, useRef } from 'react';
import '../Styles/ProgressBar.css';

const ProgressBar = ({ intervalTime }) => {
  const [progress, setProgress] = useState(0);
  const requestRef = useRef();
  const startTimeRef = useRef(Date.now());

  const updateProgress = () => {
    const now = Date.now();
    const elapsed = now - startTimeRef.current;
    const percent = (elapsed / intervalTime) * 100;

    if (percent >= 100) {
      startTimeRef.current = now;
    }
    
    setProgress(Math.min(percent, 100));
    requestRef.current = requestAnimationFrame(updateProgress);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(requestRef.current);
  }, [intervalTime]);

  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: `${progress}%` }} />
    </div>
  );
};

export default ProgressBar;