# project defined imports
from constants.supported_leagues import SUPPORTED_LEAGUES
from constants.webpage_tags import TEAM_URL_FORMAT_CONDITIONAL

def get_team_info(soup, league_name, league_id, league_url, league_to_add_elsewhere):
    # valid soup example
    """
    <td class="zentriert no-border-rechts">
        <a
            href="/manchester-united/startseite/verein/985/saison_id/2022"
            title="Manchester United"
        >
            <img
                alt="Manchester United"
                class="tiny_wappen"
                src="https://tmssl.akamaized.net/images/wappen/tiny/985.png?lm=1457975903"
                title="Manchester United"
            />
        </a>
    </td>,
    """
    team_info = None

    (team_name, team_url) = (soup.a['title'], soup.a['href'])
    # check if valid field for team
    if(TEAM_URL_FORMAT_CONDITIONAL in team_url and not(team_name.startswith('<'))):
        # team to be added in another league
        if(team_name in league_to_add_elsewhere and league_to_add_elsewhere[team_name] is not None):
            team_info = [
                team_name,
                league_to_add_elsewhere[team_name],                    # new league id
                SUPPORTED_LEAGUES[league_to_add_elsewhere[team_name]], # new league name
                team_url
            ]

        # team to be added in current supported league
        elif(team_name not in league_to_add_elsewhere and league_id is not None):
            team_info = [
                team_name,
                league_id,
                league_name,
                team_url
            ]

    return team_info
