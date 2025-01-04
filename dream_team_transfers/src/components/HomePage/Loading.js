import React from 'react';
/* STYLE SHEETS */
import './LoadingCSS/Loading.css';
import './LoadingCSS/Loading-laptop.css';
import './LoadingCSS/Loading-tablet.css';
import './LoadingCSS/Loading-phone.css';

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
