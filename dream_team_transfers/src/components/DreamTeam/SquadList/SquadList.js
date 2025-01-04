import './SquadList.css';
import { getTeamData } from '../../../db/db-utils';
import { useEffect, useState } from 'react';
import { getPlayersCSV } from '../../../utils/parse-csv';
import { type } from '@testing-library/user-event/dist/type';

function SquadList() {
    const [teamBudget, setTeamBudget] = useState(-1);
    const [teamValue, setTeamValue] = useState(-1);
    const [teamNickname, setTeamNickname] = useState('');
    const [teamPicked, setTeamPicked] = useState(-1);
    const [playersSold, setPlayersSold] = useState([]);
    const [playersBought, setPlayersBought] = useState([]);

    const [allPlayers, setAllPlayers] = useState([]);
    const [teamPlayers, setTeamPlayers] = useState([]);

    /* getting data from db */
    const updateTeamDataIfNeeded = () => {
        getTeamData().then((data) => {
            setPlayersSold(Object.keys(data.players_sold));
            setPlayersBought(Object.keys(data.players_bought));
            setTeamBudget(data.team_budget);
            setTeamValue(data.team_value);
            setTeamNickname(data.team_nickname);
            setTeamPicked(data.team_picked);
        });
    }

    // update information from db if needed every 5 seconds
    useEffect(() => {
        updateTeamDataIfNeeded();
        // Delay the first call by 5 seconds
        const intervalId = setInterval(() => {
            updateTeamDataIfNeeded();
            }, 5000); // update every 5 seconds
            // Clean up function
            return () => clearInterval(intervalId);
            },
    []); // Empty dependency array means the effect runs once on mount and clean up on unmount

    useEffect(() => {
        getPlayersCSV().then((data) => setAllPlayers(data));
    }, []);

    // league_id : "7"
    // nation_id : "81"
    // player_birth_date : "2003-08-18"
    // player_id : "5017"
    // player_kit_number : "25.0"
    // player_market_value : "100000.0"
    // player_name : "Gyan de Regt"
    // player_portrait_big_pic : "https://img.a.transfermarkt.technology/portrait/header/747243-1658862885.jpg?lm=1"
    // player_portrait_small_pic : "https://img.a.transfermarkt.technology/portrait/small/747243-1658862885.jpg?lm=1"
    // player_shortened_name : "G. de Regt"
    // position_id : "9"
    // team_id : "155"

    useEffect(() => {
        setTeamPlayers(
            allPlayers.filter(
                (player) => (
                    (Number(player.team_id) === Number(teamPicked) && !playersSold[Number(player.player_id)]) ||
                    playersBought[Number(player.player_id)]
                )
            )
        )
    }, [allPlayers, playersBought, playersSold]);

    return (
        <div className='squad-list-page'>
            {/* Team value and budget summary */}
            <div className='team-value-budget-summary'>
                <div className='team-summary-container'>
                    <div className='team-value'>
                        Team Value: {teamValue}
                    </div>
                </div>
                <div className='team-summary-container'>
                    <div className='team-budget'>
                        Team Budget: {teamBudget}
                    </div>
                </div>
            </div>

            {/* Squad List */}
            {console.log(teamPlayers)}
            <div className='squad-list'>
                {teamPlayers.map((player) => (
                    <div key={player.player_id}className='squad-list-player'>
                        <p>Player Name - {player.player_name}</p>
                        <p>Nation - {player.nation_id}</p>
                        <p>Position - {player.position_id}</p>
                        <p>Market Value - {player.player_market_value}</p>
                        <p>Kit Number - {player.player_kit_number}</p>
                        <img src={player.player_portrait_small_pic} alt="player_image" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SquadList;
