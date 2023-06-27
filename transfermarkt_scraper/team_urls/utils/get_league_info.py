import requests
from bs4 import BeautifulSoup
# project defined imports
from constants.webpage_tags import TEAM_URL_CLASS
from constants.supported_leagues import SUPPORTED_LEAGUES

def get_league_info(league, headers):
    # league example
    """
    ## PREMIER LEAGUE ##
    {
        'id': 0,
        'to_add_elsewhere': {
            'Leicester City': 1,
            'Leeds United': 1,
            'Southampton FC': 1
        },
        'url': 'https://www.transfermarkt.com/premier-league/startseite/wettbewerb/GB1'
    },
    """

    # download webpage from league url
    league_webpage = requests.get(league['url'], headers = headers)

    # create BeautifulSoup object from league webpage
    soup = BeautifulSoup(league_webpage.content, 'html.parser')

    return (
        soup.find_all(class_ = TEAM_URL_CLASS),
        None if league['id'] is None else SUPPORTED_LEAGUES[league['id']],
        league['id'],
        league['url'],
        league['to_add_elsewhere']
    )
