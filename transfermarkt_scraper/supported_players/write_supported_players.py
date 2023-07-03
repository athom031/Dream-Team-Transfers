import csv
import os
from bs4 import BeautifulSoup
# project defined imports
from transfermarkt_scraper.constants.csv_names import (
    CSV,
    SUPPORTED_TEAMS,
    # CSV COL NAMES
    TEAM_URL
)
from transfermarkt_scraper.constants.webpage_tags import BASE_WEBPAGE, WEBPAGE_TEAM_TABLE_CLASS
from transfermarkt_scraper.utils.get_page_soup import get_page_soup
from transfermarkt_scraper.utils.get_player_data import get_player_data
from transfermarkt_scraper.utils.get_player_tags import get_player_tags

# Get the absolute path of the current script
script_path = os.path.abspath(__file__)

# Get the directory containing the script
script_dir = os.path.dirname(script_path)

# Construct the absolute path to the supported_teams.csv file
file_path = os.path.join(script_dir, '..', SUPPORTED_TEAMS, SUPPORTED_TEAMS + CSV)

# open csv file
with open(file_path, 'r') as csv_file:
    # create csv reader object
    reader = csv.reader(csv_file)

    # first row of csv is the header detailing contents
    for header in reader:
        csv_header = header
        break

    # based on header find where team_url is
    team_url_index = csv_header.index(TEAM_URL)

    # create array for player_data
    supported_players_data = []

    for team in reader:
        # get list of player tags
        player_tags = get_player_tags(team[team_url_index])

        for player_tag in player_tags:
            # parse player_tag to get player data
            player_data = get_player_data(player_tag)

            # add player data to array
            supported_players_data.append(player_data)


        print(supported_players_data)
        break


        # for tr_tag in tbody_tag.find_all('tr'):
        #      # Check if the class attribute contains "even" or "odd"
        #     if 'even' in tr_tag.get('class', []) or 'odd' in tr_tag.get('class', []):
        #         # Append the <tr> tag to the array
        #         rows.append(tr_tag)

    # team_id = 0
    # t_name_idx = 1
    # t_s_logo_idx = 2
    # t_url_idx = 3
    # l_id = 4
    # l_name_idx = 5
    # l_nation_idx = 6
    # l_logo_idx = 7

    # # skip the first row which defines the columns of the csv
    # next(reader)

    # for team in reader:
    #     page_soup = get_page_soup(BASE_WEBPAGE + team[t_url_idx], 'data-header__profile-container')
    #     print(page_soup)
    #     break



    # Process the CSV file as needed
    # csv_data = csv_file.read()
    # print(csv_data)
# print('Hello World')

# # Open the CSV file
# with open('/Users/thomaalex/Documents/DreamTeamTransfers/transfermarkt_scraper/supported_teams/supported_teams.csv', 'r') as file:
#     # Create a CSV reader object
#     reader = csv.reader(file)

#     # Iterate over each row in the CSV file
#     for row in reader:
#         print(row)
#         break

#         # Access the data in each row
#         # Example: Print the first column of each row
#         # print(row[0])
