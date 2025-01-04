import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

function PlayerList() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    Papa.parse('/players.csv', {
      download: true,
      header: true,
      complete: (results) => {
        setPlayers(results.data);
      }
    });
  }, []);

  return (
    <div>
      {players.map((player, index) => (
        <div key={index}>
          <img src={player.player_portrait_small_pic} alt={player.player_name} />
          <p>{player.player_name}</p>
        </div>
      ))}
    </div>
  );
}

export default PlayerList;
