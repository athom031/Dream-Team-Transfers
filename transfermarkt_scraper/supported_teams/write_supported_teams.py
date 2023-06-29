import pandas as pd
# project defined imports
from constants.leagues_to_parse import LEAGUES_TO_PARSE
# from utils.get_league_info import get_league_info
from utils.get_league_soup import get_league_soup
from utils.get_team_info import get_team_info

# create team data list which will be converted into data frame
team_data = []

for league_id, league in LEAGUES_TO_PARSE.items():
    # list of teams from current league that are supported for 23/24 season
    supported_league_team_data = []

    # get league team info with Beautiful Soup from league page
    league_team_soup = get_league_soup(league['url'])

    # extract team info from league team soup
    for team_soup in league_team_soup:
        (
            next_season_league_id,
            team_name,
            team_small_logo,
            team_url
        ) = get_team_info(team_soup, league_id, league)

        # if team is supported for 23/24 season, get 23/24 season league info
        if(next_season_league_id is not None):

            next_season_league = LEAGUES_TO_PARSE[next_season_league_id]

            (
                league_name,
                league_nation,
                league_logo
            ) = (next_season_league['name'], next_season_league['nation'], next_season_league['logo'])

            supported_league_team_data.append([
                # team info
                team_name, team_small_logo, team_url,
                # league info
                next_season_league_id, league_name, league_nation, league_logo
            ])

    # add all supported team data from this league to team data list
    team_data.extend(supported_league_team_data)

# team_data to data frame
df = pd.DataFrame(
    team_data,
    columns=[
        'team_name',
        'team_small_logo',
        'team_url',
        'league_id',
        'league_name',
        'league_nation',
        'league_logo'
    ]
)

# format data frame
df.drop_duplicates(inplace=True)
df.sort_values(['league_id', 'team_name'], inplace=True)
df = df.reset_index(drop=True)

# write to csv
df.to_csv('supported_teams.csv', index_label='team_id')
