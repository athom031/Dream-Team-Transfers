import pandas as pd
# project defined imports
from constants.user_agent import USER_AGENT
from constants.leagues_to_parse import LEAGUES_TO_PARSE
from utils.get_league_info import get_league_info
from utils.get_team_info import get_team_info

# inform website that requests are coming from browser
headers = { 'User-Agent': USER_AGENT }

# create team data list which will be converted into data frame
team_data = []

for league in LEAGUES_TO_PARSE:
    # create team data sub list from each league to append to team_data
    supported_league_team_data = []

    # get soup to parse from league webpage and other league info
    (league_soup, league_name, league_id, league_url, league_to_add_elsewhere) = get_league_info(league, headers)

    # check soup for valid team data
    for soup in league_soup:
        team_info = get_team_info(soup, league_name, league_id, league_url, league_to_add_elsewhere)

        # add team data if valid
        if team_info is not None:
            supported_league_team_data.append(team_info)

    # add all supported team data from this league
    team_data.extend(supported_league_team_data)

# team_data to data frame
df = pd.DataFrame(
    team_data,
    columns=['team_name', 'league_id', 'league_name', 'team_url']
)

# format data frame
df.drop_duplicates(inplace=True)
df.sort_values(['league_id', 'team_name'], inplace=True)
df = df.reset_index(drop=True)

# write to csv
df.to_csv('team_urls.csv', index_label='team_id')
