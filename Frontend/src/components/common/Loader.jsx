import React from 'react';
import './Loader.css';

const Loader = ({ size = 'medium', fullScreen = false, text = '' }) => {
  const loaderElement = (
    <div className={text ? 'loader-with-text' : ''}>
      <div className={`loader loader-${size}`}></div>
      {text && <span className="loader-text">{text}</span>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loader-fullscreen">
        {loaderElement}
      </div>
    );
  }

  return (
    <div className="loader-container">
      {loaderElement}
    </div>
  );
};

export default Loader;