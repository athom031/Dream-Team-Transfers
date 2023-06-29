import requests
from bs4 import BeautifulSoup
# project defined imports
from constants.headers import HEADERS
from constants.webpage_tags import TEAM_URL_CLASS

def get_league_soup(url):
    # download webpage from league url
    league_webpage = requests.get(url, headers = HEADERS)

    # create BeautifulSoup object from league webpage
    league_soup = BeautifulSoup(league_webpage.content, 'html.parser')

    # from soup object return class objects for team info
    return league_soup.find_all(class_ = TEAM_URL_CLASS)
