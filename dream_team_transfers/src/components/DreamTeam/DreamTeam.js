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

import { loadCSVData } from '../../utils/parse-csv';

import './DreamTeam.css';

function DreamTeam() {
  const [NationsCSVData, setNationsCSVData] = useState(null);
  const [PlayersCSVData, setPlayersCSVData] = useState(null);
  const [PositionsCSVData, setPositionsCSVData] = useState(null);
  const [TeamsCSVData, setTeamsCSVData] = useState(null);
  const [csvLoading, setCsvLoading] = useState(true);

  // load in csv files when app loads once and pass it into dream team
  useEffect(() => {
    const loadAllCSVData = async () => {
      try {
        setCsvLoading(true);
        const [nationsData, playersData, positionsData, teamsData] =
          await Promise.all([
            loadCSVData('nations.csv'),
            loadCSVData('players.csv'),
            loadCSVData('positions.csv'),
            loadCSVData('teams.csv'),
          ]);

        setNationsCSVData(nationsData);
        setPlayersCSVData(playersData);
        setPositionsCSVData(positionsData);
        setTeamsCSVData(teamsData);
        setCsvLoading(false);
      } catch (error) {
        console.error('Error loading CSV data:', error);
        setCsvLoading(false);
      }
    };

    loadAllCSVData();
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
          <Route
            path="/player-market"
            element={
              <PlayerMarket
                NationsCSVData={NationsCSVData}
                PlayersCSVData={PlayersCSVData}
                TeamsCSVData={TeamsCSVData}
                csvLoading={csvLoading}
              />
            }
          />
          <Route path="/transfer-summary" element={<TransferSummary />} />
          <Route path="/team-restart" element={<TeamRestart />} />
          <Route
            path="/"
            element={
              <StartingEleven
                NationsCSVData={NationsCSVData}
                PlayersCSVData={PlayersCSVData}
                PositionsCSVData={PositionsCSVData}
                TeamsCSVData={TeamsCSVData}
              />
            }
          />
          <Route
            path="/home"
            element={
              <StartingEleven
                NationsCSVData={NationsCSVData}
                PlayersCSVData={PlayersCSVData}
                PositionsCSVData={PositionsCSVData}
                TeamsCSVData={TeamsCSVData}
              />
            }
          />
          <Route
            path="/starting-eleven"
            element={
              <StartingEleven
                NationsCSVData={NationsCSVData}
                PlayersCSVData={PlayersCSVData}
                PositionsCSVData={PositionsCSVData}
                TeamsCSVData={TeamsCSVData}
              />
            }
          />
          <Route path="/dev" element={<Dev />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default DreamTeam;
