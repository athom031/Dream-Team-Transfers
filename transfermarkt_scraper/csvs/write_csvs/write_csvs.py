
# project defined imports
from transfermarkt_scraper.constants.csv_names import (
    SUPPORTED_PLAYERS,
    SUPPORTED_TEAMS
)
from transfermarkt_scraper.csvs.write_csvs.write_leagues_csv import write_leagues_csv
from transfermarkt_scraper.csvs.write_csvs.write_nations_csv import write_nations_csv
from transfermarkt_scraper.csvs.write_csvs.write_teams_csv import write_teams_csv
from transfermarkt_scraper.utils.get_df_from_csv import get_df_from_csv

team_data = get_df_from_csv(SUPPORTED_TEAMS)
player_data = get_df_from_csv(SUPPORTED_PLAYERS)

# write teams.csv
teams = write_teams_csv(team_data)

# write nations.csv
nations = write_nations_csv(player_data)

# write leagues.csv
leagues = write_leagues_csv(team_data, nations)

# write positions.csv
# positions = write_positions_csv(player_data)

# # write players.csv
# players = write_players_csv(player_data, nations, positions)
