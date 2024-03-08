import './SquadList.css';
import { getTeamData } from '../../../db/db-utils';
import React, { useEffect, useState } from 'react';
import { useTable, sortBy } from 'react-table';

function SquadList({
    NationsCSVData,
    PositionsCSVData,
    PlayersCSVData
}) {

    const [teamBudget, setTeamBudget] = useState(-1);
    const [teamValue, setTeamValue] = useState(-1);

    const [teamNickname, setTeamNickname] = useState('');

    const [teamPicked, setTeamPicked] = useState(-1);

    const [playersSold, setPlayersSold] = useState([]);
    const [playersBought, setPlayersBought] = useState([]);
    const [kitUpdates, setKitUpdates] = useState({});

    const [relevantNations, setRelevantNations] = useState({});
    const [relevantPositions, setRelevantPositions] = useState({});

    const [teamPlayers, setTeamPlayers] = useState([]);

    const calculateAge = (birthDate) => {
        const now = new Date();
        let age = now.getFullYear() - birthDate.getFullYear();
        const m = now.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    const sellPlayer = (playerId) => () => {
        console.log("Selling Player", playerId);
    }

    useEffect(() => {
        getTeamData().then((data) => {
            setPlayersSold(data.players_sold);
            setPlayersBought(data.players_bought);
            setTeamBudget(data.team_budget);
            setTeamValue(data.team_value);
            setTeamNickname(data.team_nickname);
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
                    league_id,
                    nation_id,
                    player_birth_date,
                    player_id,
                    player_kit_number,
                    player_market_value,
                    player_name,
                    player_portrait_big_pic,
                    player_portrait_small_pic,
                    player_shortened_name,
                    position_id,
                    team_id,
                } = PlayersCSVData[i];
                teamPlayersUpdate.push({
                    nation_id: Number(nation_id),
                    player_birth_date: new Date(player_birth_date),
                    player_kit_number: kitUpdates[Number(player_id)] ?? Number(player_kit_number),
                    player_market_value: Number(player_market_value),
                    player_name: player_name,
                    player_shortened_name: player_shortened_name,
                    player_portrait: player_portrait_small_pic,
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
                    nation_id,
                    nation_name,
                    nation_flag_big_pic,
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
                    position_id,
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
    }, [teamPlayers]);

    const columns = [{
        Header: 'Player Image',
        accessor: 'player_portrait',
        sortable: false,
        Cell: row => <img src={row.value} alt="Player" />
      }, {
        Header: 'Name',
        accessor: 'player_name',
        sortMethod: (a, b) => a.toLowerCase - b.toLowerCase()
      }, {
        Header: 'Kit #',
        accessor: 'player_kit_number'
      }, {
        Header: 'Position',
        accessor: 'position_id',
        Cell: row => <span>{relevantPositions[row.value].position_acronym}</span>,
        sortMethod: (a, b) => a - b
      }, {
        Header: 'Age',
        accessor: 'player_birth_date',
        Cell: row => <span>{calculateAge(row.value)}</span>,
        sortMethod: (a, b) => a - b
      }, {
        Header: 'Nationality',
        accessor: 'nation_id',
        Cell: row => <div><img src={relevantNations[row.value].nation_pic} alt="Nation" /><span>{relevantNations[row.value].nation_name}</span></div>,
        sortMethod: (a, b) => a - b
      }, {
        Header: 'Value',
        accessor: 'player_market_value'
      }, {
        Header: 'Sell',
        accessor: 'player_id',
        sortable: false,
        Cell: row => <button onClick={sellPlayer(row.value)}>Sell</button>
    }];

    return <ReactTable data={teamPlayers} columns={columns} defaultSorted={[{ id: 'player_name', desc: true }]} />;


}

export default SquadList;
