import Papa from 'papaparse';

import LeaguesCSVData from '../constants/csvs/leagues.csv';
import NationsCSVData from '../constants/csvs/nations.csv';
import PlayersCSVData from '../constants/csvs/players.csv';
import PositionsCSVData from '../constants/csvs/positions.csv';
import TeamsCSVData from '../constants/csvs/teams.csv';

const LEAGUES = 'leagues';
const NATIONS = 'nations';
const PLAYERS = 'players';
const POSITIONS = 'positions';
const TEAMS = 'teams';

const getCSVData = async (csvFile) => {
  let CSVData;
  switch (csvFile.toLowerCase()) {
    case LEAGUES:
      CSVData = LeaguesCSVData;
      break;
    case NATIONS:
      CSVData = NationsCSVData;
      break;
    case PLAYERS:
      CSVData = PlayersCSVData;
      break;
    case POSITIONS:
      CSVData = PositionsCSVData;
      break;
    case TEAMS:
      CSVData = TeamsCSVData;
      break;
    default:
      throw new Error('Invalid csv file');
  }
  return fetch(CSVData)
    .then((response) => response.text())
    .then((text) => Papa.parse(text, { header: true }))
    .then(({ data }) => data);
};

export const getLeaguesCSV = async () => getCSVData(LEAGUES);
export const getNationsCSV = async () => getCSVData(NATIONS);
export const getPlayersCSV = async () => getCSVData(PLAYERS);
export const getPositionsCSV = async () => getCSVData(POSITIONS);
export const getTeamsCSV = async () => getCSVData(TEAMS);
