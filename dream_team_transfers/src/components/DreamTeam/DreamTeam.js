import { BrowserRouter, Routes, Route } from 'react-router-dom';

import NavBar from './NavBar/NavBar';
import StartingEleven from './StartingEleven/StartingEleven';
import SquadList from './SquadList/SquadList';
import PlayerMarket from './PlayerMarket/PlayerMarket';
import TransferSummary from './TransferSummary/TransferSummary';
import TeamRestart from './TeamRestart/TeamRestart';
import PageNotFound from './PageNotFound/PageNotFound';
import Dev from '../Dev/Dev';
import { useState, useEffect } from 'react';

import {
  // getLeaguesCSV,
  getNationsCSV,
  getPlayersCSV,
  getPositionsCSV,
  // getTeamsCSV
} from '../../utils/parse-csv';

import './DreamTeam.css';

function DreamTeam() {
  // const [LeagueCSVData, setLeagueCSVData] = useState(null);
  const [NationsCSVData, setNationsCSVData] = useState(null);
  const [PlayersCSVData, setPlayersCSVData] = useState(null);
  const [PositionsCSVData, setPositionsCSVData] = useState(null);
  // const [TeamsCSVData, setTeamsCSVData] = useState(null);

  // load in csv files when app loads once and pass it into dream team
  useEffect(() => {
    // getLeaguesCSV().then(data => setLeagueCSVData(data));
    getNationsCSV().then((data) => setNationsCSVData(data));
    getPlayersCSV().then((data) => setPlayersCSVData(data));
    getPositionsCSV().then((data) => setPositionsCSVData(data));
    // getTeamsCSV().then(data => setTeamsCSVData(data));
  }, []);

  return (
    <BrowserRouter>
      <div className="dream-team">
        <NavBar />
        <Routes>
          <Route
            path="/squad-list"
            element={
              <SquadList
                NationsCSVData={NationsCSVData}
                PlayersCSVData={PlayersCSVData}
                PositionsCSVData={PositionsCSVData}
              />
            }
          />
          <Route path="/player-market" element={<PlayerMarket />} />
          <Route path="/transfer-summary" element={<TransferSummary />} />
          <Route path="/team-restart" element={<TeamRestart />} />
          <Route path="/" element={<StartingEleven />} />
          <Route path="/home" element={<StartingEleven />} />
          <Route path="/starting-eleven" element={<StartingEleven />} />
          <Route path="/dev" element={<Dev />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default DreamTeam;
