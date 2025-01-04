import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage/HomePage';
import DreamTeam from './components/DreamTeam/DreamTeam';
import { getDb, getDbField } from './constants/db-constants';

function App() {
  // const [teamPicked, setTeamPicked] = useState(false);

  // useEffect(() => {
  //   // if not yet initialized, initialize the database
  //   // and get the team_picked
  //   const intervalId = setInterval(() => {
  //     getDbField('team_picked').then((teamPicked) => {
  //       console.log(teamPicked);
  //       setTeamPicked(teamPicked);
  //     });
  //   }, 500); // Check every second

  //   // Clean up the interval on unmount
  //   return () => clearInterval(intervalId);
  // }, []);

  return (
    <div>
      { teamPicked ? <DreamTeam /> : <HomePage /> }
    </div>
  );
}

export default App;
