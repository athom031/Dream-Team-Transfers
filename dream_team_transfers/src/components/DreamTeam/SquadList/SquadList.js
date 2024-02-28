import './SquadList.css';
import { getTeamData } from '../../../db/db-utils';
import { useEffect, useState } from 'react';
import PlayersCSVData from '../../../constants/csvs/players.csv';
import Papa from 'papaparse';


function SquadList() {
    const [teamBudget, setTeamBudget] = useState(-1);
    const [teamValue, setTeamValue] = useState(-1);
    const [teamNickname, setTeamNickname] = useState('');
    const [teamPicked, setTeamPicked] = useState(-1);
    const [playersSold, setPlayersSold] = useState({});
    const [playersBought, setPlayersBought] = useState({});

    const [teamPlayers, setTeamPlayers] = useState([]);

    useEffect(() => {
        fetch(PlayersCSVData).then((response) => response.text()).then((text) => console.log(Papa.parse(text, {header: true})));
    }, []);

    // Get team data
    useEffect(() => {
        getTeamData().then((data) => {
          setPlayersSold(data.players_sold);
          setPlayersBought(data.players_bought);
          setTeamBudget(data.team_budget);
          setTeamValue(data.team_value);
          setTeamNickname(data.team_nickname);
          setTeamPicked(data.team_picked);
        });

        const interval = setInterval(() => {
          getTeamData().then((data) => {
            setPlayersSold(data.players_sold);
            setPlayersBought(data.players_bought);
            setTeamBudget(data.team_budget);
            setTeamValue(data.team_value);
            setTeamNickname(data.team_nickname);
            setTeamPicked(data.team_picked);
          });
        }, 5000); // Check for updates every 10 seconds

        return () => clearInterval(interval);
      }, []);

    // useEffect(() => {
    //     fetchCsvData('/public/csvs/players.csv')
    //     .then((data) => {
    //         console.log(data);
    //         const pathName = path.dirname(__filename);
    //         console.log(pathName);
    //     })

    // })

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
            <div className='squad-list'>
                <div className='squad-list-headers'>

                </div>

                <div className='squad-list-players'>

                </div>
            </div>
        </div>
    );
}

export default SquadList;
