import React from 'react';
import './index.css';

const customLoader = () => {
  return (
    <div id="outer">
      <div id="middle">
        <div id="inner"></div>
      </div>
    </div>
  );
};

export default customLoader;
