import re
# project defined imports
from constants.leagues_to_parse import (
    CURRENT_LEAGUE_PAGES,
    PROJECTED_LEAGUES,
    SQUAD_SEASON_ID,
    TEAM_SELECTION_MODE,
    TEAMS_TO_ADD_ELSEWHERE
)
from constants.webpage_tags import (
    BASE_WEBPAGE,
    HREF,
    IMG,
    INVALID_TEAM_CONDITIONAL,
    SRC,
    TITLE,
    VALID_TEAM_CONDITIONAL
)

def get_team_data_url_for_squad_season(team_data_url):
    if SQUAD_SEASON_ID is None:
        return team_data_url

    if '/saison_id/' in team_data_url:
        return re.sub(r'/saison_id/\d+', f'/saison_id/{SQUAD_SEASON_ID}', team_data_url)

    return f'{team_data_url}/saison_id/{SQUAD_SEASON_ID}'


def get_target_league_id(team_name, league_id, league):
    if TEAM_SELECTION_MODE == CURRENT_LEAGUE_PAGES:
        return league_id if league_id >= 0 else None

    if TEAM_SELECTION_MODE == PROJECTED_LEAGUES:
        teams_to_add_elsewhere = league.get(TEAMS_TO_ADD_ELSEWHERE, {})

        # team to be added in another league
        if team_name in teams_to_add_elsewhere:
            return teams_to_add_elsewhere[team_name]

        # team to be added in current league
        if league_id >= 0:
            return league_id

        return None

    raise ValueError(f'Unsupported team selection mode: {TEAM_SELECTION_MODE}')


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
    # flag that will determine whether team is a supported team for the configured season
    target_league_id = None

    team_name = team_soup.a[TITLE]
    team_data_url = get_team_data_url_for_squad_season(BASE_WEBPAGE + team_soup.a[HREF])

    # parse link for team crest
    team_crest = team_soup.find(IMG)[SRC]

    # check if valid field for team
    if(
        VALID_TEAM_CONDITIONAL in team_data_url
        and not(team_name.startswith(INVALID_TEAM_CONDITIONAL))
    ):

        target_league_id = get_target_league_id(team_name, league_id, league)

    return (
        target_league_id,
        team_name,
        team_crest,
        team_data_url
    )
