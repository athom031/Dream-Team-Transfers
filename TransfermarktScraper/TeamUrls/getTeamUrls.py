import requests
import pandas as pd
from bs4 import BeautifulSoup
from collections import defaultdict
# project defined imports #
from constants import (
    DUMMY_TEAM_ID,
    TEAM_LINK_FORMAT_CONDITIONAL,
    USER_AGENT
)
from supportedLeagueInfo import (
    LEAGUES_TO_PARSE,
    SUPPORTED_LEAGUES
)

# inform website that requests coming from browser #
headers = { 'User-Agent': USER_AGENT }

teamData = [
#    ['leagueName', 'leagueId', 'teamName', 'teamId', 'teamUrl']
]

for league in LEAGUES_TO_PARSE:
    (leagueId, leagueName) = (
        league['id'],
        None if league['id'] is None else SUPPORTED_LEAGUES[league['id']]
    )

    leagueUrl = league['url']

    # download webpage for league
    leagueWebpage = requests.get(leagueUrl, headers = headers)

    # create BeautifulSoup object from league webpage
    soup = BeautifulSoup(leagueWebpage.content, 'html.parser')

    # parse this league for relevant teams into array
    teamsToAddFromLeague = []

    teamWebpageLinks = soup.find_all(class_="zentriert no-border-rechts")

    for team in teamWebpageLinks:
        (teamName, teamUrl) = (team.a['title'], team.a['href'])
        ## check if valid field for team
        if(TEAM_LINK_FORMAT_CONDITIONAL in teamUrl and not(teamName.startswith('<'))):
            ## team to be added in another league
            if(teamName in league['toAddElsewhere'] and league['toAddElsewhere'][teamName] is not None):
                newLeagueId = league['toAddElsewhere'][teamName]
                newLeagueName = SUPPORTED_LEAGUES[newLeagueId]

                teamsToAddFromLeague.append(
                    [newLeagueName, newLeagueId, teamName, DUMMY_TEAM_ID, teamUrl]
                )
            ## team to be added in current supported league
            elif(leagueId is not None):
                teamsToAddFromLeague.append(
                    [leagueName, leagueId, teamName, DUMMY_TEAM_ID, teamUrl]
                )
    ## add all relevant teams from this league to overal teamData array
    teamData.extend(teamsToAddFromLeague)

for team in teamData:
    print team[2]
