import React, { useState, useEffect } from 'react';
import { initializeDB, getTeamPicked } from './db/db-utils';

function App() {
  const [teamData, setTeamData] = useState(null);

  useEffect(() => {
    initializeDB().then(() => {
      getTeamPicked().then(data => setTeamData(data));
    });
  }, []);

  if (teamData === null) {
    return <div>Retrieving info from database...</div>;
  } else if (teamData === -1) {
    return <div>No team picked</div>;
  } else {
    return <div>Team picked: {teamData}</div>;
  }
}

export default App;
