import csv
import os
import pandas as pd
from bs4 import BeautifulSoup
# project defined imports
from transfermarkt_scraper.constants.csv_names import (
    CSV,
    SUPPORTED_TEAMS,
    SUPPORTED_PLAYERS,
    # CSV LEAGUE COL NAMES
    TEAM_URL,
    TEAM_ID,
    LEAGUE_ID,
    # CSV PLAYER COL NAMES
    PLAYER_ID,
    PLAYER_NAME,
    PLAYER_SHORTENED_NAME,
    PLAYER_KIT_NUMBER,
    PLAYER_POSITION,
    PLAYER_NATIONALITY,
    PLAYER_NAT_FLAG,
    PLAYER_PHOTO,
    PLAYER_BIRTH_DATE
)
from transfermarkt_scraper.constants.webpage_tags import BASE_WEBPAGE, WEBPAGE_TEAM_TABLE_CLASS
from transfermarkt_scraper.utils.get_page_soup import get_page_soup
from transfermarkt_scraper.utils.get_player_data import get_player_data
from transfermarkt_scraper.utils.get_player_tags import get_player_tags

# Get the absolute path of the current script
script_path = os.path.abspath(__file__)

# Get the directory containing the script
script_dir = os.path.dirname(script_path)

# Construct the absolute path to the supported_teams.csv file
file_path = os.path.join(script_dir, '..', SUPPORTED_TEAMS, SUPPORTED_TEAMS + CSV)

# open csv file
with open(file_path, 'r') as csv_file:
    # create csv reader object
    reader = csv.reader(csv_file)

    # first row of csv is the header detailing contents
    for header in reader:
        csv_header = header
        break

    # based on header find where team_url is
    team_url_index = csv_header.index(TEAM_URL)
    team_id_index = csv_header.index(TEAM_ID)
    league_id_index = csv_header.index(LEAGUE_ID)

    # create array for player_data
    supported_players_data = []

    for team in reader:
        # get list of player tags
        player_tags = get_player_tags(team[team_url_index])

        for player_tag in player_tags:
            # parse player_tag to get player data
            player_data = get_player_data(player_tag)

            # add player data to array if valid
            if(player_data is not None):
                supported_players_data.append(
                    # name, shortened_name, kit_number, position, nationality, flag_url, photo_url, birth_date
                    player_data +
                    # add team id and league id to connect player to team and league info
                    [team[team_id_index], team[league_id_index]]
                )

# player_data to data frame
df = pd.DataFrame(
    supported_players_data,
    columns=[
        PLAYER_NAME,
        PLAYER_SHORTENED_NAME,
        PLAYER_KIT_NUMBER,
        PLAYER_POSITION,
        PLAYER_NATIONALITY,
        PLAYER_NAT_FLAG,
        PLAYER_PHOTO,
        PLAYER_BIRTH_DATE,
        TEAM_ID,
        LEAGUE_ID
    ]
)

# format data frame
df.drop_duplicates(inplace=True)

# write to csv
df.to_csv(SUPPORTED_PLAYERS + CSV, index_label=PLAYER_ID)
