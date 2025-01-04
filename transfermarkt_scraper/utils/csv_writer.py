import pandas as pd
# project defined imports
from transfermarkt_scraper.constants.csv_names import (
    SCRAPED_DATA,
    SUPPORTED_TEAMS,
    SUPPORTED_PLAYERS,
    TEAM_CREST,
    TEAM_CREST_TAG,
    SMALL_PICTURE_TAG,
    BIG_PICTURE_TAG,
    TEAM_CREST_BIG,
    TEAM_CREST_SMALL,
    CSV,
    CSVS,
    TEAMS,
    TEAM_ID,
    TEAM_NAME,
    LEAGUE_ID,
    LEAGUE_NAME,
    PLAYER_NAT_FLAG,
    NATION_FLAG_TAG,
    NATION_NAME,
    NATION_FLAG_BIG,
    NATION_FLAG_SMALL,
    PLAYER_NATIONALITY,
    NATIONS,
    NATION_ID,
    SUCCESS,
    LEAGUE_LOGO,
    LEAGUE_LOGO_TAG,
    LEAGUE_LOGO_BIG,
    LEAGUE_LOGO_SMALL,
    LEAGUE_NATION,
    LEAGUES,
    PLAYER_POSITION,
    POSITION_ID,
    POSITION_NAME,
    POSITION_ACRONYM,
    POSITION_GROUPING,
    POSITIONS_DICT,
    POSITIONS,
)
from transfermarkt_scraper.utils.get_df_from_csv import get_df_from_csv
from transfermarkt_scraper.utils.get_csv_path import get_csv_path

# prompt user that csv file has been successfully written
def prompt_successful_csv_write(file, dir):
    print(SUCCESS + ': \'' + file + CSV + '\' has been written into \'' + dir + '\'')

# manipulate links to get big and small versions of picture
def get_big_and_small_pics(pic_list, size_tag):
    big_pics = []
    small_pics = []
    # add big and small version of pics
    for pic in pic_list:
        big_pics.append(pic.replace(size_tag, BIG_PICTURE_TAG))
        small_pics.append(pic.replace(size_tag, SMALL_PICTURE_TAG))

    return (big_pics, small_pics)

# write teams_csv using supported_teams.csv
# ['team_id', 'team_name', 'team_crest_big_pic', 'team_crest_small_pic']
def write_teams_csv():
    # get supported_teams as a df from csv
    supported_teams_path = get_csv_path([SCRAPED_DATA], SUPPORTED_TEAMS)
    supported_teams = get_df_from_csv(supported_teams_path)

    # add big and small version of team crest
    (
        supported_teams[TEAM_CREST_BIG],
        supported_teams[TEAM_CREST_SMALL]
    ) = get_big_and_small_pics(supported_teams[TEAM_CREST], TEAM_CREST_TAG)

    # rearrange and maintain only relevant columns
    teams = supported_teams[[TEAM_NAME, TEAM_CREST_BIG, TEAM_CREST_SMALL, LEAGUE_ID]]

    # write to csv
    teams_path = get_csv_path([CSVS], TEAMS)
    teams.to_csv(teams_path, index_label=TEAM_ID)

    prompt_successful_csv_write(TEAMS, CSVS)

# write nations_csv using supported_players.csv
# ['nation_id', 'nation_name', 'nation_flag_big_pic', 'nation_flag_small_pic']
def write_nations_csv():
    # get supported players as a df from csv
    supported_players_path = get_csv_path([SCRAPED_DATA], SUPPORTED_PLAYERS)
    supported_players = get_df_from_csv(supported_players_path)

    # add big and small version of nation flag
    (
        supported_players[NATION_FLAG_BIG],
        supported_players[NATION_FLAG_SMALL]
    ) = get_big_and_small_pics(supported_players[PLAYER_NAT_FLAG], NATION_FLAG_TAG)

    # rename player columns to make relevant for nations.csv
    supported_players[NATION_NAME] = supported_players[PLAYER_NATIONALITY]

    # make new data frame from relevant columns
    nations = pd.DataFrame(supported_players[[NATION_NAME, NATION_FLAG_BIG, NATION_FLAG_SMALL]])

    # format data frame
    nations.drop_duplicates(inplace=True)
    nations.sort_values([NATION_NAME], inplace=True)
    nations = nations.reset_index(drop=True)

    # write to csv
    nations_path = get_csv_path([CSVS], NATIONS)
    nations.to_csv(nations_path, index_label=NATION_ID)

    prompt_successful_csv_write(NATIONS, CSVS)

# write leagues.csv using nations.csv and supported_teams.csv
# ['league_id', 'league_logo_big_pic', 'league_logo_small_pic', 'nation_id']
def write_leagues_csv():
    # get supported_teams and nations csv files
    supported_teams_path = get_csv_path([SCRAPED_DATA], SUPPORTED_TEAMS)
    supported_teams = get_df_from_csv(supported_teams_path)

    nations_path = get_csv_path([CSVS], NATIONS)
    nations = get_df_from_csv(nations_path)

    # add big and small versions of team logo
    (
        supported_teams[LEAGUE_LOGO_BIG],
        supported_teams[LEAGUE_LOGO_SMALL]
    ) = get_big_and_small_pics(supported_teams[LEAGUE_LOGO], LEAGUE_LOGO_TAG)

    # get nation id that matches nation league belongs to
    nation_ids = []
    for nation_name in supported_teams[LEAGUE_NATION]:
        nation_ids.append(
            int(nations.loc[nations[NATION_NAME] == nation_name, NATION_ID].iloc[0])
        )

    # add nation_id context to data frame
    supported_teams[NATION_ID] = nation_ids

    # create new data frame from relevant columns
    leagues = pd.DataFrame(supported_teams[[LEAGUE_NAME, LEAGUE_LOGO_BIG, LEAGUE_LOGO_SMALL, NATION_ID]])

    # format data frame
    leagues.drop_duplicates(inplace=True)
    leagues = leagues.reset_index(drop=True)

    # write to csv
    leagues_path = get_csv_path([CSVS], LEAGUES)
    leagues.to_csv(leagues_path, index_label=LEAGUE_ID)

    prompt_successful_csv_write(LEAGUES, CSVS)

# write positions.csv using supported_players.csv
# ['position_id', 'position_name', 'position_grouping']
def write_positions_csv():
    # get supported players as a df from csv
    supported_players_path = get_csv_path([SCRAPED_DATA], SUPPORTED_PLAYERS)
    supported_players = get_df_from_csv(supported_players_path)

    positions = []

    for position in supported_players[PLAYER_POSITION]:
        positions.append([
            POSITIONS_DICT[position][POSITION_ID],
            POSITIONS_DICT[position][POSITION_NAME],
            POSITIONS_DICT[position][POSITION_ACRONYM],
            POSITIONS_DICT[position][POSITION_GROUPING]
        ])

    positions = pd.DataFrame(positions, columns=[POSITION_ID, POSITION_NAME, POSITION_ACRONYM, POSITION_GROUPING])

    positions.drop_duplicates(inplace=True)
    positions.sort_values([POSITION_ID], inplace=True)
    positions = positions.reset_index(drop=True)

    # will get back position id with index_label
    positions = positions[[POSITION_NAME, POSITION_ACRONYM, POSITION_GROUPING]]

    # write to csv
    positions_path = get_csv_path([CSVS], POSITIONS)
    positions.to_csv(positions_path, index_label=POSITION_ID)

    prompt_successful_csv_write(POSITIONS, CSVS)

def write_players_csv():
    return None
