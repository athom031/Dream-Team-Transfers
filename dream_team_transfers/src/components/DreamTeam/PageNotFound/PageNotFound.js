import React from 'react';
import { Link } from 'react-router-dom';

import './PageNotFound.css';

function PageNotFound() {
  return (
    <div className="not-found-container">
        <h1 className='not-found-container-title'>
            404
        </h1>
        <p className='not-found-container-text'>
            Oops! The page you're looking for doesn't exist.
        </p>
        <Link to="/home" className="not-found-home-link">
            Go back to Dream Team
        </Link>
    </div>
  );
}
export default PageNotFound;
