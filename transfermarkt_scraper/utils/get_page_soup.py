import requests
from bs4 import BeautifulSoup
# project defined imports
from transfermarkt_scraper.constants.headers import HEADERS

def get_page_soup(url, element_class):
    # download webpage from url
    league_webpage = requests.get(url, headers = HEADERS)

    # create BeautifulSoup object from webpage
    league_soup = BeautifulSoup(league_webpage.content, 'html.parser')

    if(element_class is not None):
        # from soup object return filtered for class elements
        return league_soup.find_all(class_ = element_class)
    else:
        # return unfiltered soup
        return league_soup
