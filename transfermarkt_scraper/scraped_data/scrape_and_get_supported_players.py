import csv
import time
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
    TEAM_ID,
    TEAM_NAME,
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

TEAM_SCRAPE_DELAY_SECONDS = 2
BATCH_SAVE_FREQUENCY = 5


def _build_player_dataframe(player_rows):
    supported_players = pd.DataFrame(
        player_rows,
        columns=[
            PLAYER_NAME,
            PLAYER_MARKET_VALUE,
            PLAYER_KIT_NUMBER,
            PLAYER_POSITION,
            PLAYER_NATIONALITY,
            PLAYER_NAT_FLAG,
            PLAYER_PORTRAIT,
            PLAYER_BIRTH_DATE,
            TEAM_ID,
            LEAGUE_ID,
        ],
    )
    supported_players.drop_duplicates(inplace=True)
    return supported_players


def _save_player_csv(player_rows):
    supported_players = _build_player_dataframe(player_rows)
    supported_players_path = get_csv_path([SCRAPED_DATA], SUPPORTED_PLAYERS)
    supported_players.to_csv(supported_players_path, index_label=PLAYER_ID)
    return supported_players_path

def scrape_and_get_supported_players():
    # get file path for supported_teams.csv
    supported_teams_path = get_csv_path([SCRAPED_DATA], SUPPORTED_TEAMS)
    supported_teams = get_df_from_csv(supported_teams_path)

    # create list for supported players to be converted into data frame and written as a csv
    supported_players_data = []
    total_teams = len(supported_teams)

    for index, team in supported_teams.iterrows():
        team_index = index + 1
        print(f"[{team_index}/{total_teams}] Scraping team: {team[TEAM_NAME]} ({team[TEAM_ID]})")

        try:
            team_page_soup = get_page_soup(team[TEAM_DATA_URL], TEAM_TABLE_CLASS)
        except Exception as error:
            print(f"  Skipped {team[TEAM_NAME]} due to page fetch error: {error}")
            continue

        if not team_page_soup:
            print(f"  No team table found for {team[TEAM_NAME]}. Skipping.")
            continue

        player_tags = team_page_soup[0].find(TBODY).find_all(TR)
        team_players = 0

        for player_tag in player_tags:
            if any(class_name in player_tag.get(CLASS, []) for class_name in PLAYER_IN_TEAM):
                try:
                    player_data = get_player_data(player_tag)
                except Exception as error:
                    print(f"    Skipped invalid player row in {team[TEAM_NAME]}: {error}")
                    continue

                supported_players_data.append(
                    player_data + [team[TEAM_ID], team[LEAGUE_ID]]
                )
                team_players += 1

        print(f"  Collected {team_players} players from {team[TEAM_NAME]}.")

        if team_index % BATCH_SAVE_FREQUENCY == 0:
            _save_player_csv(supported_players_data)
            print(f"  Saved progress after {team_index} teams.")

        time.sleep(TEAM_SCRAPE_DELAY_SECONDS)

    supported_players = _build_player_dataframe(supported_players_data)
    supported_players_path = get_csv_path([SCRAPED_DATA], SUPPORTED_PLAYERS)
    supported_players.to_csv(supported_players_path, index_label=PLAYER_ID)

    prompt_successful_csv_write(SUPPORTED_PLAYERS, SCRAPED_DATA)
