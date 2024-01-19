
import './DreamTeam.css';

import NavBar from './NavBar/NavBar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import StartingEleven from './StartingEleven/StartingEleven';
import SquadList from './SquadList/SquadList';
import PlayerMarket from './PlayerMarket/PlayerMarket';
import TransferSummary from './TransferSummary/TransferSummary';
import TeamRestart from './TeamRestart/TeamRestart';
import PageNotFound from './PageNotFound/PageNotFound';

function DreamTeam() {
  return (
    <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route path="/squad-list" element={<SquadList />} />
        <Route path="/player-market" element={<PlayerMarket />} />
        <Route path="/transfer-summary" element={<TransferSummary />} />
        <Route path="/team-restart" element={<TeamRestart />} />
        <Route path="/" element={<StartingEleven />} />
        <Route path="/home" element={<StartingEleven />} />
        <Route path="/starting-eleven" element={<StartingEleven />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default DreamTeam;
