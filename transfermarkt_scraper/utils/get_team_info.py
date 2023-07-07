# project defined imports
from transfermarkt_scraper.constants.csv_names import GLITCHED_CRESTS  
from transfermarkt_scraper.constants.leagues_to_parse import TEAMS_TO_ADD_ELSEWHERE
from transfermarkt_scraper.constants.webpage_tags import (
    BASE_WEBPAGE,
    HREF,
    IMG,
    INVALID_TEAM_CONDITIONAL,
    SRC,
    TITLE,
    VALID_TEAM_CONDITIONAL
)

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

    team_name = team_soup.a[TITLE]
    team_data_url = BASE_WEBPAGE + team_soup.a[HREF]

    # assign either the parsed link or solution if found to be glitched
    team_crest = GLITCHED_CRESTS[team_name] if team_name in GLITCHED_CRESTS else team_soup.find(IMG)[SRC]

    # check if valid field for team
    if(
        VALID_TEAM_CONDITIONAL in team_data_url
        and not(team_name.startswith(INVALID_TEAM_CONDITIONAL))
    ):

        # team to be added in another league
        if(
            team_name in league[TEAMS_TO_ADD_ELSEWHERE]
            and league[TEAMS_TO_ADD_ELSEWHERE][team_name] is not None
        ):
            next_season_league_id = league[TEAMS_TO_ADD_ELSEWHERE][team_name]

        # team to be added in current league
        elif(
            team_name not in league[TEAMS_TO_ADD_ELSEWHERE]
            # negative league ids given to unsupported leagues
            and league_id >= 0
        ):
            next_season_league_id = league_id

    return (
        next_season_league_id,
        team_name,
        team_crest,
        team_data_url
    )
