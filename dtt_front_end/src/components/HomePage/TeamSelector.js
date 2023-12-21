import React from 'react';
import { PREMIER_LEAGUE_TEAM_INFOS } from '../../constants/pl-team-infos';

function TeamSelector({ selectedTeam, onTeamChange }) {
  const handleChange = (event) => {
    onTeamChange(event.target.value);
  };

  return (
    <div>
      <select value={selectedTeam} onChange={handleChange}>
        <option value="">Select a team</option>
        {Object.values(PREMIER_LEAGUE_TEAM_INFOS).map((team) => (
          <option key={team.team_id} value={team.team_id}>
            {team.name}
          </option>
        ))}
      </select>
      {selectedTeam && <p>You selected team ID: {selectedTeam}</p>}
    </div>
  );
}

export default TeamSelector;
