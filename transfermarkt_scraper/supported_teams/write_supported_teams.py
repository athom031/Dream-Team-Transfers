import pandas as pd
# project defined imports
from transfermarkt_scraper.constants.leagues_to_parse import (
    URL,
    NAME,
    NATION,
    LOGO,
    LEAGUES_TO_PARSE
)
from transfermarkt_scraper.constants.webpage_tags import BASE_WEBPAGE, WEBPAGE_TEAM_IN_LEAGUE_CLASS
from transfermarkt_scraper.constants.csv_names import (
    CSV,
    SUPPORTED_TEAMS,
    # CSV COLUMN NAMES
    TEAM_ID,
    TEAM_NAME,
    TEAM_LOGO,
    TEAM_URL,
    LEAGUE_ID,
    LEAGUE_NAME,
    LEAGUE_NATION,
    LEAGUE_LOGO
)
from transfermarkt_scraper.utils.get_page_soup import get_page_soup
from transfermarkt_scraper.utils.get_team_info import get_team_info

# create team data list which will be converted into data frame
team_data = []

for league_id, league in LEAGUES_TO_PARSE.items():
    # list of teams from current league that are supported for 23/24 season
    supported_league_team_data = []

    # get league team info with Beautiful Soup from league page
    league_team_soup = get_page_soup(league[URL], WEBPAGE_TEAM_IN_LEAGUE_CLASS)

    # extract team info from league team soup
    for team_soup in league_team_soup:
        (
            next_season_league_id,
            team_name,
            team_logo,
            team_url
        ) = get_team_info(team_soup, league_id, league)

        # if team is supported for 23/24 season, get 23/24 season league info
        if(next_season_league_id is not None):

            next_season_league = LEAGUES_TO_PARSE[next_season_league_id]

            (
                league_name,
                league_nation,
                league_logo
            ) = (next_season_league[NAME], next_season_league[NATION], next_season_league[LOGO])

            supported_league_team_data.append([
                # team info
                team_name, team_logo, BASE_WEBPAGE + team_url,
                # league info
                next_season_league_id, league_name, league_nation, league_logo
            ])

    # add all supported team data from this league to team data list
    team_data.extend(supported_league_team_data)

# team_data to data frame
df = pd.DataFrame(
    team_data,
    columns=[
        TEAM_NAME,
        TEAM_LOGO,
        TEAM_URL,
        LEAGUE_ID,
        LEAGUE_NAME,
        LEAGUE_NATION,
        LEAGUE_LOGO
    ]
)

# format data frame
df.drop_duplicates(inplace=True)
df.sort_values([LEAGUE_ID, TEAM_NAME], inplace=True)
df = df.reset_index(drop=True)

# write to csv
df.to_csv(SUPPORTED_TEAMS + CSV, index_label=TEAM_ID)
