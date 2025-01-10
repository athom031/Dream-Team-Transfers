import './SquadList.css';
import { getTeamData, sellPlayer, updateKitNumber } from '../../../db/db-utils';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useTable, useSortBy } from 'react-table';
import {
  getCurrencyDenomination,
  getCurrencyDenominationShort,
  getCurrencyRounded,
  CURRENCY_UNIT,
} from '../../../utils/money-utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { POSITION_CIRCLES } from '../../../utils/positions';

function SquadList({ NationsCSVData, PositionsCSVData, PlayersCSVData }) {
  // reading from db
  const [teamBudget, setTeamBudget] = useState(-1);
  const [teamValue, setTeamValue] = useState(-1);
  const [teamPicked, setTeamPicked] = useState(-1);
  const [relevantNations, setRelevantNations] = useState({});
  const [relevantPositions, setRelevantPositions] = useState({});
  const [teamPlayers, setTeamPlayers] = useState([]);
  // writing to db
  const [playersSold, setPlayersSold] = useState([]);
  const [playersBought, setPlayersBought] = useState([]);
  const [kitUpdates, setKitUpdates] = useState({});

  const calculateAge = (birthDate) => {
    // Treat "TRANSFER_WINDOW_START" as the
    // date Summer Transfer Window Opened (2023/2024 Season)
    const TRANSFER_WINDOW_START = new Date('2023-06-14');
    let age = TRANSFER_WINDOW_START.getFullYear() - birthDate.getFullYear();
    const m = TRANSFER_WINDOW_START.getMonth() - birthDate.getMonth();
    if (
      m < 0 ||
      (m === 0 && TRANSFER_WINDOW_START.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  function removeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function SellButton({ playerId }) {
    const [isButtonActive, setIsButtonActive] = useState(false);
    const timer = useRef(null);

    const handleButtonPress = () => {
      setIsButtonActive(true);
      timer.current = setTimeout(() => {
        const playerValue = Number(
          PlayersCSVData[playerId].player_market_value
        );
        const currBudget = Number(teamBudget);
        const currValue = Number(teamValue);
        sellPlayer(playerId, playerValue).then(() => {
          setPlayersSold([...playersSold, playerId]);
          setTeamBudget(String(currBudget + playerValue));
          setTeamValue(String(currValue - playerValue));
        });
        setIsButtonActive(false);
      }, 2000);
    };

    const handleButtonRelease = () => {
      clearTimeout(timer.current);
      if (isButtonActive) {
        setIsButtonActive(false);
      }
    };

    return (
      <button
        className={`squad-list-button ${isButtonActive ? 'active' : ''}`}
        onMouseDown={handleButtonPress}
        onMouseUp={handleButtonRelease}
        onMouseLeave={handleButtonRelease}
      >
        <span className={`sell-text ${isButtonActive ? 'active' : ''}`}>
          Sell
        </span>
        {isButtonActive && <div className="fill-effect"></div>}
      </button>
    );
  }

  function EditableKitNumber({ playerId, kitNumber }) {
    const [isEditing, setIsEditing] = useState(false);
    const [newKitNumber, setNewKitNumber] = useState(kitNumber);

    const handleEdit = () => {
      setIsEditing(true);
    };

    const handleChange = (e) => {
      setNewKitNumber(e.target.value);
    };

    const handleBlur = () => {
      setIsEditing(false);
      if (newKitNumber !== kitNumber) {
        updateKitNumber(playerId, newKitNumber).then(() => {
          setKitUpdates({
            ...kitUpdates,
            [playerId]: newKitNumber,
          });
        });
      }
    };

    return isEditing ? (
      <input
        type="number"
        value={newKitNumber}
        onChange={handleChange}
        onBlur={handleBlur}
        className="kit-number-input"
        autoFocus
      />
    ) : (
      <div className="player-kit-number" onClick={handleEdit}>
        {kitNumber}
      </div>
    );
  }

  // read from db
  useEffect(() => {
    getTeamData().then((data) => {
      console.log(data.team_kit_updates);
      setPlayersSold(data.players_sold);
      setPlayersBought(data.players_bought);
      setTeamBudget(data.team_budget);
      setTeamValue(data.team_value);
      setTeamPicked(data.team_picked);
      setKitUpdates(data.team_kit_updates);
    });
  }, []);

  useEffect(() => {
    const teamPlayersUpdate = [];

    if (PlayersCSVData === null) return;

    for (let i = 0; i < PlayersCSVData.length; i++) {
      if (
        playersBought.includes(Number(PlayersCSVData[i].player_id)) ||
        (!playersSold.includes(Number(PlayersCSVData[i].player_id)) &&
          Number(PlayersCSVData[i].team_id) === teamPicked)
      ) {
        const {
          nation_id,
          player_birth_date,
          player_id,
          player_kit_number,
          player_market_value,
          player_name,
          player_portrait_big_pic,
          player_shortened_name,
          position_id,
        } = PlayersCSVData[i];
        teamPlayersUpdate.push({
          nation_id: Number(nation_id),
          player_birth_date: new Date(player_birth_date),
          player_age: calculateAge(new Date(player_birth_date)),
          player_kit_number:
            kitUpdates[Number(player_id)] ?? Number(player_kit_number),
          player_market_value: Number(player_market_value),
          player_name: player_name,
          player_shortened_name: player_shortened_name,
          player_portrait: player_portrait_big_pic,
          position_id: Number(position_id),
          player_id: Number(player_id),
        });
      }
    }

    setTeamPlayers(teamPlayersUpdate);
  }, [playersSold, playersBought, PlayersCSVData, teamPicked]);

  useEffect(() => {
    const relevantNationsUpdate = {};
    const relevantPositionsUpdate = {};

    if (
      NationsCSVData == null ||
      PositionsCSVData == null ||
      NationsCSVData.length <= 0 ||
      PositionsCSVData.length <= 0
    )
      return;

    for (let i = 0; i < teamPlayers.length; i++) {
      if (!relevantNationsUpdate[teamPlayers[i].nation_id]) {
        const { nation_name, nation_flag_small_pic } =
          NationsCSVData[teamPlayers[i].nation_id];
        relevantNationsUpdate[teamPlayers[i].nation_id] = {
          nation_name: nation_name,
          nation_pic: nation_flag_small_pic,
        };
      }

      if (!relevantPositionsUpdate[teamPlayers[i].position_id]) {
        const { position_acronym, position_name, position_grouping } =
          PositionsCSVData[teamPlayers[i].position_id];
        relevantPositionsUpdate[teamPlayers[i].position_id] = {
          position_acronym,
          position_name,
          position_grouping,
        };
      }
    }

    setRelevantNations(relevantNationsUpdate);
    setRelevantPositions(relevantPositionsUpdate);
  }, [teamPlayers, NationsCSVData, PositionsCSVData]);

  const getPositionCircleAndAcronym = (positionId) => {
    const acronym = relevantPositions[positionId].position_acronym;
    const grouping = relevantPositions[positionId].position_grouping;

    return (
      <>
        <FontAwesomeIcon
          icon={faCircle}
          className={`position-circle ${grouping}`}
          style={{
            border: '2px solid white', 
            borderRadius: '50%',
            color: POSITION_CIRCLES[grouping],
          }}
        />
        &nbsp;
        <div>{acronym}</div>
      </>
    );
  };

  const columns = useMemo(() => {
    if (
      teamPlayers.length <= 0 ||
      Object.keys(relevantNations).length <= 0 ||
      Object.keys(relevantPositions).length <= 0
    ) {
      return [];
    } else {
      return [
        {
          Header: 'Profile',
          Cell: ({ row }) => (
            <img
              src={row.original.player_portrait}
              className="player-profile"
              alt="Profile"
            />
          ),
        },
        {
          Header: 'Name',
          accessor: 'player_name',
          Cell: ({ row }) => (
            <div className="player-name">{row.original.player_name}</div>
          ),
          sortType: (rowA, rowB, columnId) => {
            const a = removeAccents(rowA.values[columnId]);
            const b = removeAccents(rowB.values[columnId]);
            return a.localeCompare(b);
          },
        },
        {
          Header: 'Position',
          accessor: 'position_id',
          Cell: ({ row }) => (
            <div className="player-position">
              {getPositionCircleAndAcronym(row.original.position_id)}
            </div>
          ),
        },
        {
          Header: 'Kit #',
          accessor: 'player_kit_number',
          Cell: ({ row }) => (
            <EditableKitNumber
              playerId={row.original.player_id}
              kitNumber={row.original.player_kit_number}
            />
          ),
        },
        {
          Header: 'Nation',
          accessor: 'nation_id',
          Cell: ({ row }) => (
            <div className="nation-cell">
              <img
                src={relevantNations[row.original.nation_id].nation_pic}
                alt="Flag"
              />
              <p>{relevantNations[row.original.nation_id].nation_name}</p>
            </div>
          ),
        },
        {
          Header: 'Age',
          accessor: 'player_birth_date',
          Cell: ({ row }) => <div>{row.original.player_age}</div>,
          sortType: (rowA, rowB) => {
            return (
              rowB.original.player_birth_date - rowA.original.player_birth_date
            );
          },
        },
        {
          Header: 'Value',
          accessor: 'player_market_value',
          Cell: ({ row }) => (
            <div className="player-value">
              <span>
                {CURRENCY_UNIT}{' '}
                {getCurrencyRounded(row.original.player_market_value)}{' '}
                {getCurrencyDenominationShort(row.original.player_market_value)}
              </span>
            </div>
          ),
          sortType: (rowA, rowB) => {
            return (
              rowB.original.player_market_value -
              rowA.original.player_market_value
            );
          },
        },
        {
          Header: 'Sell',
          id: 'sell',
          Cell: ({ row }) => <SellButton playerId={row.original.player_id} />,
        },
      ];
    }
  }, [teamPlayers, relevantNations, relevantPositions, kitUpdates]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: teamPlayers }, useSortBy);

  return columns.length === 0 ? (
    <div className="squad-w_o-players">
      <h1>No Players Found in Squad</h1>
      <h4>Looks like you got a little gung-ho and sold the entire team...</h4>
      <p>
        Every fan has been there at some point in their life. Maybe{' '}
        <a href="/team-restart">try again</a> with a different team.
        <br />
        Or perhaps you could brave the transfer market and try to assemble a new
        squad from scratch!
      </p>
    </div>
  ) : (
    <div className="SquadList">
      <div className="squad-list-header">
        <div className="header-description text-left text-primary">
          <h4>* View the members of your squad </h4>
          <h4>* Adjust their Kit Numbers </h4>
          <h4>* Sell players to boost your transfer budget!</h4>
        </div>
        <div className="team-summary">
          <div className="team-value">
            <div className="category">Value</div>
            <div className="money">
              {CURRENCY_UNIT} {getCurrencyRounded(teamValue)}
            </div>
            <div className="unit">{getCurrencyDenomination(teamValue)}</div>
          </div>
          <div className="team-budget">
            <div className="category">Budget</div>
            <div className="money">
              {CURRENCY_UNIT} {getCurrencyRounded(teamBudget)}
            </div>
            <div className="unit">{getCurrencyDenomination(teamBudget)}</div>
          </div>
        </div>
      </div>
      <div className="table-container">
        <table {...getTableProps()} className="squad-table">
          <thead className="squad-table-header">
            {headerGroups.map((headerGroup) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                className="squad-table-header-row"
              >
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="squad-table-header-cell"
                  >
                    {column.render('Header')}
                    <span className="squad-table-sort-icon">
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔼'
                          : ' 🔽'
                        : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="squad-table-body">
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="squad-table-row">
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="squad-table-cell">
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default SquadList;
