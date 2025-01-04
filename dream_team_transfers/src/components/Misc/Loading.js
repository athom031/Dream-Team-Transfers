import React from 'react';

import './Loading.css';

function Loading() {
  return (
    <div className="loading">
        <img
            src={process.env.PUBLIC_URL + '/logo512.png'}
            className="logo"
            alt="loading logo"
        />
        <h3> </h3>
    </div>
  );
}

export default Loading;
