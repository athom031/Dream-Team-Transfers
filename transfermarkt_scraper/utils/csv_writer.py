import pandas as pd
# project defined imports
from constants.csv_names import (
    BIG_TAG,
    CSV,
    CSVS,
    CURR_TAG,
    LEAGUE_ID,
    LEAGUE_LOGO,
    LEAGUE_LOGO_BIG,
    LEAGUE_LOGO_SMALL,
    LEAGUE_NAME,
    LEAGUE_NATION,
    LEAGUES,
    NATION_FLAG_BIG,
    NATION_FLAG_SMALL,
    NATION_ID,
    NATION_NAME,
    NATIONS,
    PIC_TAGS,
    PLAYER_BIRTH_DATE,
    PLAYER_ID,
    PLAYER_KIT_NUMBER,
    PLAYER_MARKET_VALUE,
    PLAYER_NAME,
    PLAYER_NAT_FLAG,
    PLAYER_NATIONALITY,
    PLAYER_PORTRAIT,
    PLAYER_PORTRAIT_BIG,
    PLAYER_PORTRAIT_SMALL,
    PLAYER_POSITION,
    PLAYER_SHORTENED_NAME,
    PLAYERS,
    POSITION_ACRONYM,
    POSITION_GROUPING,
    POSITION_ID,
    POSITION_NAME,
    POSITIONS,
    POSITIONS_DICT,
    SCRAPED_DATA,
    SMALL_TAG,
    SUCCESS,
    SUPPORTED_PLAYERS,
    SUPPORTED_TEAMS,
    TEAM_CREST,
    TEAM_CREST_BIG,
    TEAM_CREST_SMALL,
    TEAM_ID,
    TEAM_NAME,
    TEAMS
)
from utils.get_df_from_csv import get_df_from_csv
from utils.get_csv_path import get_csv_path

# prompt user that csv file has been successfully written
def prompt_successful_csv_write(file, dir):
    print(SUCCESS + ': \'' + file + CSV + '\' has been written into \'' + dir + '\'')

# manipulate links to get big and small versions of picture
def get_big_and_small_pics(pic_list, pic_field):
    big_pics = []
    small_pics = []

    pic_tag = PIC_TAGS[pic_field]
    # add big and small version of pics
    for pic in pic_list:
        big_pics.append(
            pic.replace(pic_tag[CURR_TAG], pic_tag[BIG_TAG])
        )
        small_pics.append(
            pic.replace(pic_tag[CURR_TAG], pic_tag[SMALL_TAG])
        )

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
    ) = get_big_and_small_pics(supported_teams[TEAM_CREST], TEAMS)
    
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
    ) = get_big_and_small_pics(supported_players[PLAYER_NAT_FLAG], NATIONS)
    
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
    ) = get_big_and_small_pics(supported_teams[LEAGUE_LOGO], LEAGUES)

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
# ['position_id', 'position_name', 'position_acronym', 'position_grouping']
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

# write players.csv using supported_players.csv, positions_dict, nations.csv
# ['player_id', 'player_name', 'player_shortened_name', 'player_market_value', 'player_kit_number', 'position_id',
#  'nation_id', 'player_portrait_big_pic', 'player_portrait_small_pic', 'player_birth_date', 'team_id', 'league_id']
def write_players_csv():
    # get supported players as a df from csv
    supported_players_path = get_csv_path([SCRAPED_DATA], SUPPORTED_PLAYERS)
    supported_players = get_df_from_csv(supported_players_path)

    (
        supported_players[PLAYER_PORTRAIT_BIG],
        supported_players[PLAYER_PORTRAIT_SMALL]
    ) = get_big_and_small_pics(supported_players[PLAYER_PORTRAIT], PLAYERS)

    position_ids = []
    for position in supported_players[PLAYER_POSITION]:
        position_ids.append(POSITIONS_DICT[position][POSITION_ID])
    supported_players[POSITION_ID] = position_ids

    # get nations as a df from csv
    nations_path = get_csv_path([CSVS], NATIONS)
    nations = get_df_from_csv(nations_path)

    # get nation id that matches nation player belongs to
    nation_ids = []
    for nation_name in supported_players[PLAYER_NATIONALITY]:
        nation_ids.append(
            int(nations.loc[nations[NATION_NAME] == nation_name, NATION_ID].iloc[0])
        )
    supported_players[NATION_ID] = nation_ids

    # create data frame for players.csv
    players = pd.DataFrame(supported_players[[
        PLAYER_NAME,
        PLAYER_SHORTENED_NAME,
        PLAYER_MARKET_VALUE,
        PLAYER_KIT_NUMBER,
        PLAYER_PORTRAIT_BIG,
        PLAYER_PORTRAIT_SMALL,
        PLAYER_BIRTH_DATE,
        TEAM_ID,
        LEAGUE_ID,
        POSITION_ID,
        NATION_ID
    ]])

    # write to csv
    players_path = get_csv_path([CSVS], PLAYERS)
    players.to_csv(players_path, index_label=PLAYER_ID)

    prompt_successful_csv_write(PLAYERS, CSVS)
