import pandas as pd
# project defined imports
from transfermarkt_scraper.constants.csv_names import (
    CSV,
    NATION_ID,
    NATION_NAME,
    LEAGUE_ID,
    LEAGUE_NAME,
    LEAGUE_LOGO,
    LEAGUE_NATION,
    SMALL_PICTURE_TAG,
    BIG_PICTURE_TAG,
    LEAGUE_LOGO_TAG,
    LEAGUE_LOGO_SMALL_PIC,
    LEAGUE_LOGO_BIG_PIC,
    LEAGUES

    # BIG_PICTURE_TAG,
    # CSV,
    # NATION_FLAG_BIG_PIC,
    # NATION_FLAG_SMALL_PIC,
    # NATION_FLAG_TAG,
    # NATION_ID,
    # NATION_NAME,
    # NATIONS,
    # PLAYER_NAT_FLAG,
    # PLAYER_NATIONALITY,
    # SMALL_PICTURE_TAG
)

def write_leagues_csv(team_data, nations):
    # copy team_data for method manipulation
    teams = pd.DataFrame(team_data)

    nations = list(nations[NATION_NAME])


    # add small and big pictures of league logo
    league_logo_small_pics = []
    league_logo_big_pics = []

    for logo in teams[LEAGUE_LOGO]:
        league_logo_small_pics.append(logo.replace(LEAGUE_LOGO_TAG, SMALL_PICTURE_TAG))
        league_logo_big_pics.append(logo.replace(LEAGUE_LOGO_TAG, BIG_PICTURE_TAG))

    teams[LEAGUE_LOGO_SMALL_PIC] = league_logo_small_pics
    teams[LEAGUE_LOGO_BIG_PIC] = league_logo_big_pics

    nation_ids = []
    for nation in teams[LEAGUE_NATION]:
        nation_ids.append(nations.index(nation))

    teams[NATION_ID] = nation_ids

    # create new data frame for league context
    leagues = pd.DataFrame(teams[[LEAGUE_NAME, NATION_ID, LEAGUE_LOGO_SMALL_PIC, LEAGUE_LOGO_BIG_PIC]])

    # format data frame
    leagues.drop_duplicates(inplace=True)
    leagues = leagues.reset_index(drop=True)

    # write to csv
    leagues.to_csv(LEAGUES + CSV, index_label=LEAGUE_ID)

    return leagues
