# project defined imports
from transfermarkt_scraper.constants.headers import HEADERS
from transfermarkt_scraper.constants.webpage_tags import (
    CLASS
    TBODY,
    TR,
    WEBPAGE_TEAM_PLAYER_TAGS,
    WEBPAGE_TEAM_TABLE_CLASS
)
from transfermarkt_scraper.utils.get_page_soup import get_page_soup

def get_player_tags(url):
    player_tags = []

    # get soup from team page
    team_page_soup = get_page_soup(url, WEBPAGE_TEAM_TABLE_CLASS)

    # separate table of players in page
    tbody_tag = team_page_soup[0].find(TBODY)

    for tr_tag in tbody_tag.find_all(TR):
        if any(class_name in tr_tag.get(CLASS, []) for class_name in WEBPAGE_TEAM_PLAYER_TAGS):
            player_tags.append(tr_tag)

    return player_tags
