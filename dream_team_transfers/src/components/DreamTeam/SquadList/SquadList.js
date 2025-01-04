import './SquadList.css';
import { getTeamData } from '../../../db/db-utils';
import React, { useEffect, useState, useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import Loading from '../../Misc/Loading'
import { getCurrencyDenominationShort, getCurrencyRounded, CURRENCY_UNIT } from '../../../utils/money-utils';

function SquadList({
    NationsCSVData,
    PositionsCSVData,
    PlayersCSVData
}) {
    // not used right now
    // const [teamBudget, setTeamBudget] = useState(-1);
    // const [teamValue, setTeamValue] = useState(-1);
    // const [teamNickname, setTeamNickname] = useState('');

    // used but full integration not set up yet
    const [playersSold, setPlayersSold] = useState([]);
    const [playersBought, setPlayersBought] = useState([]);
    const [kitUpdates, setKitUpdates] = useState({});

    const [teamPicked, setTeamPicked] = useState(-1);

    const [relevantNations, setRelevantNations] = useState({});
    const [relevantPositions, setRelevantPositions] = useState({});

    const [teamPlayers, setTeamPlayers] = useState([]);

    const calculateAge = (birthDate) => {
        // Treat "TRANSFER_WINDOW_START" as the date Summer Transfer Window Opened (2023/2024 Season)
        const TRANSFER_WINDOW_START = new Date('2023-06-14');
        let age = TRANSFER_WINDOW_START.getFullYear() - birthDate.getFullYear();
        const m = TRANSFER_WINDOW_START.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && TRANSFER_WINDOW_START.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    function removeAccents(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    const sellPlayer = (playerId) => () => {
        console.log("Selling Player", playerId);
    }

    // retrieve data from db
    useEffect(() => {
        getTeamData().then((data) => {
            setPlayersSold(data.players_sold);
            setPlayersBought(data.players_bought);
            // setTeamBudget(data.team_budget);
            // setTeamValue(data.team_value);
            // setTeamNickname(data.team_nickname);
            setTeamPicked(data.team_picked);
            setKitUpdates(data.team_kit_updates);
        });
    }, []);

    useEffect(() => {
        const teamPlayersUpdate = [];

        if(PlayersCSVData == null) return;

        for(let i = 0; i < PlayersCSVData.length; i++) {
            if(
                playersBought.includes(Number(PlayersCSVData[i].player_id)) ||
                (
                    !playersSold.includes(Number(PlayersCSVData[i].player_id)) &&
                    Number(PlayersCSVData[i].team_id) === teamPicked
                )
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
                    player_kit_number: kitUpdates[Number(player_id)] ?? Number(player_kit_number),
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

    }, [playersSold, playersBought, PlayersCSVData, teamPicked, kitUpdates]);

    useEffect(() => {
        const relevantNationsUpdate = {};
        const relevantPositionsUpdate = {};

        if(NationsCSVData == null || PositionsCSVData == null || NationsCSVData.length <= 0 || PositionsCSVData.length <= 0) return;

        for(let i = 0; i < teamPlayers.length; i++) {
            if(!relevantNationsUpdate[teamPlayers[i].nation_id]) {
                const {
                    nation_name,
                    nation_flag_small_pic,
                } = NationsCSVData[teamPlayers[i].nation_id];
                relevantNationsUpdate[teamPlayers[i].nation_id] = {
                    nation_name: nation_name,
                    nation_pic: nation_flag_small_pic,
                };
            }

            if(!relevantPositionsUpdate[teamPlayers[i].position_id]) {
                const {
                    position_acronym,
                    position_name,
                    position_grouping
                } = PositionsCSVData[teamPlayers[i].position_id];
                relevantPositionsUpdate[teamPlayers[i].position_id] = {
                    position_acronym,
                    position_name,
                    position_grouping,
                }
            }
        }

        setRelevantNations(relevantNationsUpdate);
        setRelevantPositions(relevantPositionsUpdate);
    }, [teamPlayers, NationsCSVData, PositionsCSVData]);

    const columns = useMemo(() => {
        if(teamPlayers.length <= 0 || Object.keys(relevantNations).length <= 0 || Object.keys(relevantPositions).length <= 0) {
            return [];
        } else {
            return [
                {
                    Header: 'Profile',
                    Cell: ({ row }) => <img src={row.original.player_portrait} className='player-profile' alt='Profile' />,
                },
                {
                    Header: 'Name',
                    accessor: 'player_name',
                    Cell: ({ row }) => <div className='player-name'>{row.original.player_name}</div>,
                    sortType: (rowA, rowB, columnId) => {
                        const a = removeAccents(rowA.values[columnId]);
                        const b = removeAccents(rowB.values[columnId]);
                        return a.localeCompare(b);
                    }
                },
                {
                    Header: 'Position',
                    accessor: 'position_id',
                    Cell: ({ row }) => <div className='player-position'>{relevantPositions[row.original.position_id].position_acronym}</div>,
                },
                {
                    Header: 'Kit Number',
                    accessor: 'player_kit_number',
                    Cell: ({ row }) => <div className='player-kit-number'>{row.original.player_kit_number}</div>
                },
                {
                    Header: 'Nation',
                    accessor: 'nation_id',
                    Cell: ({ row }) => (
                        <div className='nation-cell'>
                            <img src={relevantNations[row.original.nation_id].nation_pic} alt="Flag" />
                            <p>{relevantNations[row.original.nation_id].nation_name}</p>
                        </div>
                    ),
                },
                {
                    Header: 'Age',
                    accessor: 'player_birth_date',
                    Cell: ({ row }) => <div>{row.original.player_age}</div>,
                    sortType: (rowA, rowB) => {
                        return rowB.original.player_birth_date - rowA.original.player_birth_date;
                    }
                },
                {
                    Header: 'Value',
                    accessor: 'player_market_value',
                    Cell: ({ row }) => (
                        <div className='player-value'>
                            <span>
                                {CURRENCY_UNIT} {getCurrencyRounded(row.original.player_market_value)} {getCurrencyDenominationShort(row.original.player_market_value)}
                            </span>
                        </div>
                    ),
                    sortType: (rowA, rowB) => {
                        return rowB.original.player_market_value - rowA.original.player_market_value;
                    }
                },
                {
                    Header: 'Sell',
                    id: 'sell',
                    Cell: ({ row }) => (
                        <button onClick={sellPlayer(row.original.player_id)}>Sell</button>
                    ),
                },
            ]
        }
    }, [teamPlayers, relevantNations, relevantPositions]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data: teamPlayers }, useSortBy);

    return columns.length === 0 ?
        <Loading /> : (
        <div className="SquadList">
            <div className="table-container">
                <table {...getTableProps()} className='squad-table'>
                    <thead className='squad-table-header'>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()} className='squad-table-header-row'>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())} className='squad-table-header-cell'>
                                        {column.render('Header')}
                                        <span className='squad-table-sort-icon'>
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
                    <tbody {...getTableBodyProps()} className='squad-table-body'>
                        {rows.map(row => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()} className='squad-table-row'>
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()} className='squad-table-cell'>{cell.render('Cell')}</td>
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
