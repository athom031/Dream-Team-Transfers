import pandas as pd
# project defined imports
from transfermarkt_scraper.constants.csv_names import (
    BIG_PICTURE_TAG,
    CSV,
    LEAGUE_ID,
    LEAGUE_LOGO,
    SMALL_PICTURE_TAG,
    TEAM_ID,
    TEAM_LOGO,
    TEAM_LOGO_BIG_PIC,
    TEAM_LOGO_SMALL_PIC,
    TEAM_LOGO_TAG,
    TEAM_NAME,
    TEAM_URL,
    TEAMS
)

def write_teams_csv(team_data):
    # copy df for solely manipulation in function
    teams = pd.DataFrame(team_data)

    team_logo_small_pics = []
    team_logo_big_pics = []
    for logo in teams[TEAM_LOGO]:
        team_logo_small_pics.append(logo.replace(TEAM_LOGO_TAG, SMALL_PICTURE_TAG))
        team_logo_big_pics.append(logo.replace(TEAM_LOGO_TAG, BIG_PICTURE_TAG))

    teams[TEAM_LOGO_SMALL_PIC] = team_logo_small_pics
    teams[TEAM_LOGO_BIG_PIC] = team_logo_big_pics

    # rearrange columns
    teams = teams[[TEAM_NAME, TEAM_LOGO_SMALL_PIC, TEAM_LOGO_BIG_PIC, LEAGUE_ID]]

    # write to csv
    teams.to_csv(TEAMS + CSV, index_label=TEAM_ID)

    return teams
