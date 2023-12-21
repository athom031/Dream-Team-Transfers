
# project defined imports

# project defined imports
from transfermarkt_scraper.utils.csv_writer import (
    write_leagues_csv,
    write_nations_csv,
    write_players_csv,
    write_positions_csv,
    write_teams_csv
)

# from all of the scraped transfermarkt data, build final csvs
def write_csvs():
    # write teams.csv
    write_teams_csv()

    # write nations.csv
    write_nations_csv()

    # write leagues.csv
    write_leagues_csv()

    # write positions.csv
    write_positions_csv()

    # write players.csv
    write_players_csv()
