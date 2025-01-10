import './StartingEleven.css';
import React from 'react';
import { FORMATIONS } from '../../../utils/formations';

function StartingEleven() {
  const [lineup, setLineup] = React.useState([
    'John Doe',
    'Jane Smith',
    'Mike Johnson',
    'Emily Brown',
    'David Lee',
    'Sarah Wilson',
    'Tom Davis',
    'Lisa Moore',
    'Chris Taylor',
    'Emma White',
    'Alex Martin',
  ]);

  const [subs, setSubs] = React.useState([
    'Ryan Clark',
    'Olivia Hall',
    'Daniel King',
    'Sophia Adams',
    'James Wright',
  ]);

  const [selectedFormation, setSelectedFormation] = React.useState('4-3-3');
  const positions = FORMATIONS[selectedFormation];

  const handleDragStart = (e, player) => {
    e.dataTransfer.setData('player', player);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex, isSub) => {
    e.preventDefault();
    const player = e.dataTransfer.getData('player');
    const sourceIndex = lineup.indexOf(player);
    const newLineup = [...lineup];
    const newSubs = [...subs];

    if (sourceIndex !== -1) {
      newLineup[sourceIndex] = newLineup[targetIndex];
      newLineup[targetIndex] = player;
    } else {
      const subIndex = subs.indexOf(player);
      if (subIndex !== -1) {
        if (isSub) {
          [newSubs[subIndex], newSubs[targetIndex]] = [
            newSubs[targetIndex],
            newSubs[subIndex],
          ];
        } else {
          newSubs[subIndex] = newLineup[targetIndex];
          newLineup[targetIndex] = player;
        }
      }
    }

    setLineup(newLineup);
    setSubs(newSubs);
  };

  return (
    <div className="starting-eleven">
      <div className="starting-eleven-container">
        <div className="soccer-field-container">
          <div className="lineup-grid">
            {positions.map((row, rowIndex) => (
              <div key={rowIndex} className="lineup-row">
                {row.map((pos, colIndex) => {
                  const flatIndex =
                    positions.slice(0, rowIndex).flat().length + colIndex;
                  return (
                    <div
                      key={colIndex}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, flatIndex, false)}
                      className="player-slot"
                    >
                      <div>{pos}</div>
                      <div
                        draggable
                        onDragStart={(e) =>
                          handleDragStart(e, lineup[flatIndex])
                        }
                        className="player"
                      >
                        {lineup[flatIndex]}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <select
            onChange={(e) => setSelectedFormation(e.target.value)}
            className="formation-selector"
          >
            {Object.keys(FORMATIONS).map((formation) => (
              <option key={formation} value={formation}>
                {formation}
              </option>
            ))}
          </select>
        </div>
        <h2 className="subs-title">Subs Bench</h2>
        <ul className="subs-bench">
          {subs.map((sub, index) => (
            <li
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, sub)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index, true)}
              className="sub"
            >
              {sub}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default StartingEleven;
