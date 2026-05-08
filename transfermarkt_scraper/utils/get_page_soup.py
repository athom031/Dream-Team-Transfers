import requests
from bs4 import BeautifulSoup
# project defined imports
from constants.headers import HEADERS

def get_page_soup(url, element_class):
    # download webpage from url
    webpage = requests.get(url, headers = HEADERS, timeout = 30)
    webpage.raise_for_status()

    # create BeautifulSoup object from webpage
    soup = BeautifulSoup(webpage.content, 'html.parser')

    # from soup object return filtered for class elements
    return soup.find_all(class_ = element_class)
