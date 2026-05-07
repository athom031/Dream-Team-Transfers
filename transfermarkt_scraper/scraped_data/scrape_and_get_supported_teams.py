import pandas as pd
# project defined imports
from constants.csv_names import (
    LEAGUE_ID,
    LEAGUE_LOGO,
    LEAGUE_NAME,
    LEAGUE_NATION,
    SCRAPED_DATA,
    SUPPORTED_TEAMS,
    TEAM_CREST,
    TEAM_DATA_URL,
    TEAM_ID,
    TEAM_NAME
)
from constants.leagues_to_parse import (
    LOGO,
    NAME,
    NATION,
    SUPPORTED_LEAGUES,
    URL
)
from constants.leagues_to_parse import get_leagues_to_parse
from constants.webpage_tags import TEAM_IN_LEAGUE
from utils.csv_writer import prompt_successful_csv_write
from utils.get_csv_path import get_csv_path
from utils.get_page_soup import get_page_soup
from utils.get_team_info import get_team_info

def scrape_and_get_supported_teams():
    # create list for supported teams to be converted into data frame and written as a csv
    supported_teams_data = []

    for league_id, league in get_leagues_to_parse().items():
        # get league team info with BeautifulSoup from league page
        league_team_soup = get_page_soup(league[URL], TEAM_IN_LEAGUE)

        # extract team info from page soup
        for team_soup in league_team_soup:
            (
                target_league_id,
                team_name,
                team_crest,
                team_data_url
            ) = get_team_info(team_soup, league_id, league)

            # if team is supported for the configured season, get target league info
            if(target_league_id is not None):
                target_league = SUPPORTED_LEAGUES[target_league_id]

                league_name = target_league[NAME]
                league_nation = target_league[NATION]
                league_logo = target_league[LOGO]

                # add all supported team data to team data list
                supported_teams_data.append([
                    # team_info
                    team_name, team_crest, team_data_url,
                    # league_info
                    target_league_id, league_name, league_nation, league_logo
                ])

    # create data frame for supported teams
    supported_teams = pd.DataFrame(
        supported_teams_data,
        columns = [
            TEAM_NAME,
            TEAM_CREST,
            TEAM_DATA_URL,
            LEAGUE_ID,
            LEAGUE_NAME,
            LEAGUE_NATION,
            LEAGUE_LOGO
        ]
    )

    # format data frame
    supported_teams.drop_duplicates(inplace=True)
    supported_teams.sort_values([LEAGUE_ID, TEAM_NAME], inplace=True)
    supported_teams = supported_teams.reset_index(drop=True)

    # write to csv
    supported_teams_path = get_csv_path([SCRAPED_DATA], SUPPORTED_TEAMS)
    supported_teams.to_csv(supported_teams_path, index_label=TEAM_ID)

    prompt_successful_csv_write(SUPPORTED_TEAMS, SCRAPED_DATA)
