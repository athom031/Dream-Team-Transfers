import './App.css';
import React, { useState, useEffect } from 'react';
import { initializeDB, getTeamPicked } from './db/db-utils';
import Loading from './components/Utils/Loading';
import HomePage from './components/HomePage/HomePage';
import DreamTeam from './components/DreamTeam/DreamTeam';
import Papa from 'papaparse';

function App() {
  const [teamData, setTeamData] = useState(null);

  useEffect(() => {
    initializeDB().then(() => {
      getTeamPicked().then(data => setTeamData(data));
    });

    fetch(process.env.PUBLIC_URL + '/csvs/players.csv')
    .then(response => response.text())
    .then(csvString => {
      const data = Papa.parse(csvString, { header: true, dynamicTyping: true }).data;
      // Calculate the total value for each team
      const teamValues = data.reduce((values, player) => {
        if (player.team_id >= 0 && player.team_id <= 19) {
          if (!values[player.team_id]) {
            values[player.team_id] = 0;
          }
          values[player.team_id] += player.player_market_value;
        }
        return values;
      }, {});
      console.log(teamValues);
    });
  }, []);


  if (teamData === null) {
    return (<Loading/>);
  } else if (teamData === -1) {
    return (<HomePage/>);
  } else {
    return (<DreamTeam/>);
  }
}

export default App;
