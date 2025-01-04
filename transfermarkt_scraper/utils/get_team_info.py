# project defined imports
from transfermarkt_scraper.constants.webpage_tags import WEBPAGE_VALID_TEAM_CONDITIONAL

def get_team_info(team_soup, league_id, league):
    # valid team soup example
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
    # flag that will determine whether team is a supported team for 23/24 season
    next_season_league_id = None

    (
        team_name,
        team_url,
        team_small_logo,
    ) = (team_soup.a['title'], team_soup.a['href'], team_soup.find('img')['src'])

    # check if valid field for team
    if(WEBPAGE_VALID_TEAM_CONDITIONAL in team_url and not(team_name.startswith('<'))):

        # team to be added in another league
        if(
            team_name in league['teams_to_add_elsewhere']
            and league['teams_to_add_elsewhere'][team_name] is not None
        ):
            next_season_league_id = league['teams_to_add_elsewhere'][team_name]

        # team to be added in current league
        elif(
            team_name not in league['teams_to_add_elsewhere']
            # negative league ids given to unsupported leagues
            and league_id >= 0
        ):
            next_season_league_id = league_id

    return (
        next_season_league_id,
        team_name,
        team_small_logo,
        team_url
    )
