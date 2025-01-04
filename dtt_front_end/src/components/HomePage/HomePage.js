import React, { useState } from 'react';
import TeamSelector from './TeamSelector';
import { putDbField } from '../../constants/db-constants';

function HomePage() {
  const [selectedTeam, setSelectedTeam] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();  // Prevent the default form submission behavior
    console.log(selectedTeam);
    putDbField('team_picked', Number(selectedTeam)).then(() => console.log('Successfully set team picked as ' + selectedTeam));
    // You can call putDbField here to update the database with the selected team
    // putDbField('team_picked', selectedTeam);
  };

  return (
    <div className="home-page">
      <h1>Welcome to the home page!</h1>
      <form onSubmit={handleSubmit}>
        <TeamSelector selectedTeam={selectedTeam} onTeamChange={setSelectedTeam} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default HomePage;
