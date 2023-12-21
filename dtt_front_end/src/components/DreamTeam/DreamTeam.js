import React from 'react';
import { clearDb } from '../../constants/db-constants';

function DreamTeam() {
    const handleStartOver = () => {
      clearDb().then((updatedRecord) => {
        console.log('Successfully cleared DB', updatedRecord);
        window.location.reload();
      });
    };

  return (
    <div className="dream-team">
      <h1>Welcome to the DreamTeam!</h1>
      <button onClick={handleStartOver}>Start over</button>
    </div>
  );
}

export default DreamTeam;
