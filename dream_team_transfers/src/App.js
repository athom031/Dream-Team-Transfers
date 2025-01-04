import './App.css';
import React, { useState, useEffect } from 'react';
import { initializeDB, getTeamPicked } from './db/db-utils';
import Loading from './components/Utils/Loading';
import HomePage from './components/HomePage/HomePage';
import DreamTeam from './components/DreamTeam/DreamTeam';

function App() {
  const [teamData, setTeamData] = useState(null);

  useEffect(() => {
    initializeDB().then(() => {
      getTeamPicked().then(data => setTeamData(data));
    });
  }, []);


  // if (teamData === null) {
  //   return (<Loading/>);
  // } else if (teamData === -1) {
  if(teamData === -1) {
    return (<Loading/>);
  } else {
    return (<DreamTeam/>);
  }
}

export default App;
