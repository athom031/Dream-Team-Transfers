import './App.css';
import React, { useState, useEffect } from 'react';
import { initializeDB, getTeamData, getTeamPicked } from './db/db-utils';
import Loading from './components/Utils/Loading';

function App() {
  const [teamData, setTeamData] = useState(null);

  useEffect(() => {
    initializeDB().then(() => {
      getTeamPicked().then(data => setTeamData(data));
    });
  }, []);


  if (teamData === null) {
    return (<Loading/>);
  } else if (teamData === -1) {
    return (<Loading/>);
  } else {
    return <div>Team picked: {teamData}</div>;
  }
}

export default App;
