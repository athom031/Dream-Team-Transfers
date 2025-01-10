import './App.css';
import React, { useState, useEffect } from 'react';
import { initializeDB, getTeamPicked } from './db/db-utils';
import Loading from './components/Misc/Loading';
import HomePage from './components/HomePage/HomePage';
import DreamTeam from './components/DreamTeam/DreamTeam';

function App() {
  const [teamData, setTeamData] = useState(null);

  // load db data to decide which page to show
  useEffect(() => {
    initializeDB().then(() => {
      getTeamPicked().then((data) => setTeamData(data));
    });
  }, []);

  if (teamData === null) return <Loading />;
  else if (teamData === -1) return <HomePage />;
  else return <DreamTeam />;
}

export default App;
