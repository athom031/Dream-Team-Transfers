import pandas as pd
# project defined imports
from transfermarkt_scraper.constants.csv_names import (
    BIG_PICTURE_TAG,
    CSV,
    NATION_FLAG_BIG_PIC,
    NATION_FLAG_SMALL_PIC,
    NATION_FLAG_TAG,
    NATION_ID,
    NATION_NAME,
    NATIONS,
    PLAYER_NAT_FLAG,
    PLAYER_NATIONALITY,
    SMALL_PICTURE_TAG
)

def write_nations_csv(player_data):
    # copy players for function manipulation
    players = pd.DataFrame(player_data)

    # add small and big pictures of flag
    nation_flag_small_pics = []
    nation_flag_big_pics = []

    for flag in players[PLAYER_NAT_FLAG]:
        nation_flag_small_pics.append(flag.replace(NATION_FLAG_TAG, SMALL_PICTURE_TAG))
        nation_flag_big_pics.append(flag.replace(NATION_FLAG_TAG, BIG_PICTURE_TAG))

    players[NATION_FLAG_SMALL_PIC] = nation_flag_small_pics
    players[NATION_FLAG_BIG_PIC] = nation_flag_big_pics

    players[NATION_NAME] = players[PLAYER_NATIONALITY]

    nations = pd.DataFrame(players[[NATION_NAME, NATION_FLAG_SMALL_PIC, NATION_FLAG_BIG_PIC]])

    # format data frame
    nations.drop_duplicates(inplace=True)
    nations.sort_values([NATION_NAME], inplace=True)
    nations = nations.reset_index(drop=True)

    # write to csv
    nations.to_csv(NATIONS + CSV, index_label=NATION_ID)

    return nations
