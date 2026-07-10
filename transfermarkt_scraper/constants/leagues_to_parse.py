from constants.scrape_config import MEMBERSHIP_SEASON_ID

## DICTIONARY KEYS ##
NAME = 'name'
SLUG = 'slug'
COMPETITION_ID = 'competition_id'
URL = 'url'
NATION = 'nation'
LOGO = 'logo'
TEAMS_TO_ADD_ELSEWHERE = 'teams_to_add_elsewhere'

## TEAM SELECTION MODES ##
CURRENT_LEAGUE_PAGES = 'current_league_pages'
PROJECTED_LEAGUES = 'projected_leagues'

# Use CURRENT_LEAGUE_PAGES when Transfermarkt already lists the target
# season's league membership. Use PROJECTED_LEAGUES when the new season is
# not available yet and you need to manually move teams between leagues.
#
# For a typical new-season refresh, keep this on CURRENT_LEAGUE_PAGES and
# only fall back to PROJECTED_LEAGUES if the membership pages are missing or
# incomplete for the target season.
TEAM_SELECTION_MODE = CURRENT_LEAGUE_PAGES

def _build_league_url(slug, competition_id, season_id=MEMBERSHIP_SEASON_ID):
    return (
        f'https://www.transfermarkt.com/{slug}/startseite/'
        f'wettbewerb/{competition_id}/plus/?saison_id={season_id}'
    )


def _get_projected_team_overrides(league_id):
    overrides = globals().get('PROJECTED_TEAM_OVERRIDES', {})
    if overrides is None:
        return {}
    return overrides.get(league_id, {})


def _build_league_config(name, slug, competition_id, nation, logo, league_id):
    return {
        NAME: name,
        SLUG: slug,
        COMPETITION_ID: competition_id,
        URL: _build_league_url(slug, competition_id),
        NATION: nation,
        LOGO: logo,
        TEAMS_TO_ADD_ELSEWHERE: _get_projected_team_overrides(league_id)
    }


def _build_source_only_league_config(slug, competition_id, league_id):
    return {
        SLUG: slug,
        COMPETITION_ID: competition_id,
        URL: _build_league_url(slug, competition_id),
        TEAMS_TO_ADD_ELSEWHERE: _get_projected_team_overrides(league_id)
    }




## SUPPORTED LEAGUES ##
SUPPORTED_LEAGUES = {
    0: _build_league_config(
        'Premier League',
        'premier-league',
        'GB1',
        'England',
        'https://tmssl.akamaized.net/images/logo/header/gb1.png?lm=1521104656',
        0
    ),
    1: _build_league_config(
        'Championship',
        'championship',
        'GB2',
        'England',
        'https://tmssl.akamaized.net/images/logo/header/gb2.png?lm=1643026970',
        1
    ),
    2: _build_league_config(
        'La Liga',
        'laliga',
        'ES1',
        'Spain',
        'https://tmssl.akamaized.net/images/logo/header/es1.png?lm=1557051003',
        2
    ),
    3: _build_league_config(
        'Bundesliga',
        'bundesliga',
        'L1',
        'Germany',
        'https://tmssl.akamaized.net/images/logo/header/l1.png?lm=1525905518',
        3
    ),
    4: _build_league_config(
        'Serie A',
        'serie-a',
        'IT1',
        'Italy',
        'https://tmssl.akamaized.net/images/logo/header/it1.png?lm=1656073460',
        4
    ),
    5: _build_league_config(
        'Ligue 1',
        'ligue-1',
        'FR1',
        'France',
        'https://tmssl.akamaized.net/images/logo/header/fr1.png?lm=1648360140',
        5
    ),
    6: _build_league_config(
        'Liga Portugal',
        'liga-portugal',
        'PO1',
        'Portugal',
        'https://tmssl.akamaized.net/images/logo/header/po1.png?lm=1626110146',
        6
    ),
    7: _build_league_config(
        'Eredivisie',
        'eredivisie',
        'NL1',
        'Netherlands',
        'https://tmssl.akamaized.net/images/logo/header/nl1.png?lm=1674743474',
        7
    )
}

## PROJECTED LEAGUE OVERRIDES ##
# These overrides are only used when TEAM_SELECTION_MODE = PROJECTED_LEAGUES.
#
# If the membership pages are not available yet, switch to
# PROJECTED_LEAGUES and define the overrides below as per the following template:
#
# PROJECTED_TEAM_OVERRIDES = {
#     # supported league id: {
#     #     '<team_name_on_transfermarkt>': <target_supported_league_id_or_None>
#     # }
#     #
#     # Examples:
#     # 0: {'Promoted Team': 0, 'Relegated Team': 1},
#     # 1: {'Another Team': None},
#     # -1: {'League One Club': 1},
#     #
#     # Rules:
#     # - use a target league id to move a team into another supported league
#     # - use None to exclude a team from the supported team pool
#     # - teams not listed here stay in their current supported league when the
#     #   source league id is positive
#     # - teams from negative source-only leagues are ignored unless explicitly
#     #   moved into a supported league
# }

## SOURCE-ONLY LEAGUES FOR PROJECTED MODE ##
# These are only relevant if you explicitly switch to PROJECTED_LEAGUES.
# In the default CURRENT_LEAGUE_PAGES workflow, keep this empty.
SOURCE_ONLY_LEAGUES = {}


# Backward-compatible name for the full set of pages used by projected mode.
LEAGUES_TO_PARSE = {
    **SUPPORTED_LEAGUES,
    **SOURCE_ONLY_LEAGUES
}


def get_leagues_to_parse():
    if TEAM_SELECTION_MODE == CURRENT_LEAGUE_PAGES:
        return SUPPORTED_LEAGUES

    if TEAM_SELECTION_MODE == PROJECTED_LEAGUES:
        return LEAGUES_TO_PARSE

    raise ValueError(f'Unsupported team selection mode: {TEAM_SELECTION_MODE}')
