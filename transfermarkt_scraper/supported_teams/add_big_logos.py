import csv
import os
# project defined imports
from transfermarkt_scraper.constants.csv_names import (
    CSV,
    SUPPORTED_TEAMS_WITHOUT_BIG_LOGO,
    SUPPORTED_TEAMS,
    # CSV COL NAMES
    TEAM_URL,
    TEAM_BIG_LOGO
)
from transfermarkt_scraper.constants.webpage_tags import WEBPAGE_TEAM_BIG_LOGO_CLASS
from transfermarkt_scraper.utils.get_page_soup import get_page_soup

# construct path to supported_teams_wihtout_big_logo.csv file
script_path = os.path.abspath(__file__)
script_dir = os.path.dirname(script_path)
file_path = os.path.join(script_dir, SUPPORTED_TEAMS_WITHOUT_BIG_LOGO + CSV)

# open csv file
with open(file_path, 'r') as csv_file:
    # create csv reader object
    reader = csv.reader(csv_file)

    # create array from csv
    csv_data = list(reader)

    # get team_url index for placement of team_big_logo, and append team_url to end
    header = csv_data[0]
    team_url_index = header.index(TEAM_URL)
    header.append(TEAM_URL)
    header[team_url_index] = TEAM_BIG_LOGO
    team_big_logo_index = team_url_index
    team_url_index = len(header) - 1

    for team in csv_data[1:]:
        # currently team data has team_url at team_big_logo_index
        # find team_big_logo by using BeautifulSoup to parse webpage in team_url
        team_url = team[team_big_logo_index]
        logo_soup = get_page_soup(team_url, WEBPAGE_TEAM_BIG_LOGO_CLASS)
        team_logo = logo_soup[0].find('img')['src']
        # assign new big logo data and retain team_url for new csv
        team.append(team_url)
        team[team_big_logo_index] = team_logo

    # write modified data into supported_teams csv
    with open(SUPPORTED_TEAMS + CSV, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerows(csv_data)
