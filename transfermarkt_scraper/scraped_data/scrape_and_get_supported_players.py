import csv
import pandas as pd
# project defined imports
from constants.csv_names import (
    LEAGUE_ID,
    PLAYER_BIRTH_DATE,
    PLAYER_ID,
    PLAYER_KIT_NUMBER,
    PLAYER_MARKET_VALUE,
    PLAYER_NAME,
    PLAYER_NAT_FLAG,
    PLAYER_NATIONALITY,
    PLAYER_PORTRAIT,
    PLAYER_POSITION,
    SCRAPED_DATA,
    SUPPORTED_PLAYERS,
    SUPPORTED_TEAMS,
    TEAM_DATA_URL,
    TEAM_ID
)
from constants.webpage_tags import (
    CLASS,
    PLAYER_IN_TEAM,
    TBODY,
    TEAM_TABLE_CLASS,
    TR
)
from utils.csv_writer import prompt_successful_csv_write
from utils.get_csv_path import get_csv_path
from utils.get_df_from_csv import get_df_from_csv
from utils.get_page_soup import get_page_soup
from utils.get_player_data import get_player_data

def scrape_and_get_supported_players():
    # get file path for supported_teams.csv
    supported_teams_path = get_csv_path([SCRAPED_DATA], SUPPORTED_TEAMS)
    supported_teams = get_df_from_csv(supported_teams_path)

    # create list for supported players to be converted into data frame and written as a csv
    supported_players_data = []

    for index, team in supported_teams.iterrows():
        # get team page soup from team url
        team_page_soup = get_page_soup(team[TEAM_DATA_URL], TEAM_TABLE_CLASS)

        # get list of player tags
        player_tags = team_page_soup[0].find(TBODY).find_all(TR)

        for player_tag in player_tags:
            # check if valid player tag
            if any(class_name in player_tag.get(CLASS, []) for class_name in PLAYER_IN_TEAM):
                # get player data from valid player tag
                player_data = get_player_data(player_tag)
                supported_players_data.append(
                    # player: name, shortened_name, kit_number, position, nationality, nat_flag_pic, portrait_pic, birth_date
                    player_data +
                    # add team id and league id to connect player to team and league info
                    [team[TEAM_ID], team[LEAGUE_ID]]
                )

    supported_players = pd.DataFrame(
        supported_players_data,
        columns = [
            PLAYER_NAME,
            PLAYER_MARKET_VALUE,
            PLAYER_KIT_NUMBER,
            PLAYER_POSITION,
            PLAYER_NATIONALITY,
            PLAYER_NAT_FLAG,
            PLAYER_PORTRAIT,
            PLAYER_BIRTH_DATE,
            TEAM_ID,
            LEAGUE_ID
        ]
    )

    # format data frame
    supported_players.drop_duplicates(inplace=True)
    # don't need to sort player list, keep relative order

    # write to csv
    supported_players_path = get_csv_path([SCRAPED_DATA], SUPPORTED_PLAYERS)
    supported_players.to_csv(supported_players_path, index_label = PLAYER_ID)

    prompt_successful_csv_write(SUPPORTED_PLAYERS, SCRAPED_DATA)
