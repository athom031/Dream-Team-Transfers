import React, { useState, useEffect } from 'react';
import Dexie from 'dexie';
import HomePage from './components/HomePage/HomePage';
import DreamTeam from './components/DreamTeam/DreamTeam';
import { DB_NAME, DB_VERSION, DB_ID, DB_SCHEMA } from './constants/db-constants';

function App() {
  const [teamPicked, setTeamPicked] = useState(false);

  useEffect(() => {
    // if not yet initialized, initialize the database
    const db = new Dexie(DB_NAME);
    db.version(DB_VERSION).stores({
      team: DB_SCHEMA
    });

    // check if a team has been picked (checking browser db)
    db.team.get(DB_ID).then((team) => {
      if (team && team.team_picked) {
        setTeamPicked(true);
      }
    });
  }, []);

  return (
    <div>
      { teamPicked ? <DreamTeam /> : <HomePage /> }
    </div>
  );
}

export default App;
