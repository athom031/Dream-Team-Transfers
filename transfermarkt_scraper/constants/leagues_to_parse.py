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

# Use current_league_pages when Transfermarkt already lists the target
# season's league membership. Use projected_leagues when the new season is
# not available yet and you need to manually move teams between leagues.
TEAM_SELECTION_MODE = CURRENT_LEAGUE_PAGES

# Transfermarkt's 25/26 season is represented by saison_id=2025.
MEMBERSHIP_SEASON_ID = 2025
SQUAD_SEASON_ID = 2025


def build_league_url(slug, competition_id, season_id=MEMBERSHIP_SEASON_ID):
    return (
        f'https://www.transfermarkt.com/{slug}/startseite/'
        f'wettbewerb/{competition_id}/plus/?saison_id={season_id}'
    )


def build_league_config(name, slug, competition_id, nation, logo, league_id):
    return {
        NAME: name,
        SLUG: slug,
        COMPETITION_ID: competition_id,
        URL: build_league_url(slug, competition_id),
        NATION: nation,
        LOGO: logo,
        TEAMS_TO_ADD_ELSEWHERE: PROJECTED_TEAM_OVERRIDES.get(league_id, {})
    }


def build_source_only_league_config(slug, competition_id, league_id):
    return {
        SLUG: slug,
        COMPETITION_ID: competition_id,
        URL: build_league_url(slug, competition_id),
        TEAMS_TO_ADD_ELSEWHERE: PROJECTED_TEAM_OVERRIDES.get(league_id, {})
    }


## PROJECTED LEAGUE OVERRIDES ##
# These overrides are only used when TEAM_SELECTION_MODE = PROJECTED_LEAGUES.
#
# Format:
# source_league_id: {
#     '<team_name_on_transfermarkt>': <target_supported_league_id_or_None>
# }
#
# Use a target league id to move a team into another supported league.
# Use None to exclude a team from the supported team pool.
# Teams not listed here stay in their current supported league when the
# source league id is positive. Teams from negative source-only leagues are
# ignored unless explicitly moved into a supported league.
#
# The values below preserve the old 23/24 -> 24/25 projection logic. Update
# this map before using projected_leagues for a different summer.
PROJECTED_TEAM_OVERRIDES = {
    # Premier League -> Championship
    0: {
        'Burnley FC': 1,
        'Sheffield United': 1,
        'Luton Town': 1,
    },
    # Championship -> Premier League / unsupported
    1: {
        'Ipswich Town': 0,
        'Leicester City': 0,
        'Southampton FC': 0,
        'Birmingham City': None,
        'Huddersfield Town': None,
        'Rotherham United': None,
    },
    # League One -> Championship
    -1: {
        'Oxford United': 1,
        'Derby County': 1,
        'Portsmouth FC': 1
    },
    # La Liga -> unsupported
    2: {
        'Cádiz CF': None,
        'Granada CF': None,
        'UD Almería': None
    },
    # La Liga 2 -> La Liga
    -2: {
        'Real Valladolid CF': 2,
        'CD Leganés': 2,
        'RCD Espanyol Barcelona': 2
    },
    # Bundesliga -> unsupported
    3: {
        '1.FC Köln': None,
        'SV Darmstadt 98': None
    },
    # 2. Bundesliga -> Bundesliga
    -3: {
        'FC St. Pauli': 3,
        'Holstein Kiel': 3
    },
    # Serie A -> unsupported
    4: {
        'Frosinone Calcio': None,
        'US Sassuolo': None,
        'US Salernitana 1919': None
    },
    # Serie B -> Serie A
    -4: {
        'Parma Calcio 1913': 4,
        'Como 1907': 4,
        'Venezia FC': 4
    },
    # Ligue 1 -> unsupported
    5: {
        'FC Lorient': None,
        'FC Metz': None,
        'Clermont Foot 63': None
    },
    # Ligue 2 -> Ligue 1
    -5: {
        'AJ Auxerre': 5,
        'Angers SCO': 5,
        'AS Saint-Étienne': 5,
    },
    # Liga Portugal -> unsupported
    6: {
        'FC Vizela': None,
        'GD Chaves': None,
        'Portimonense SC': None
    },
    # Liga Portugal 2 -> Liga Portugal
    -6: {
        'CD Santa Clara': 6,
        'CD Nacional': 6,
        'Avs Futebol': 6
    },
    # Eredivisie -> unsupported
    7: {
        'Excelsior Rotterdam': None,
        'FC Volendam': None,
        'Vitesse Arnhem': None
    },
    # Keuken Kampioen Divisie -> Eredivisie
    -7: {
        'Willem II Tilburg': 7,
        'FC Groningen': 7,
        'NAC Breda': 7
    }
}


## SUPPORTED LEAGUES ##
SUPPORTED_LEAGUES = {
    0: build_league_config(
        'Premier League',
        'premier-league',
        'GB1',
        'England',
        'https://tmssl.akamaized.net/images/logo/header/gb1.png?lm=1521104656',
        0
    ),
    1: build_league_config(
        'Championship',
        'championship',
        'GB2',
        'England',
        'https://tmssl.akamaized.net/images/logo/header/gb2.png?lm=1643026970',
        1
    ),
    2: build_league_config(
        'La Liga',
        'laliga',
        'ES1',
        'Spain',
        'https://tmssl.akamaized.net/images/logo/header/es1.png?lm=1557051003',
        2
    ),
    3: build_league_config(
        'Bundesliga',
        'bundesliga',
        'L1',
        'Germany',
        'https://tmssl.akamaized.net/images/logo/header/l1.png?lm=1525905518',
        3
    ),
    4: build_league_config(
        'Serie A',
        'serie-a',
        'IT1',
        'Italy',
        'https://tmssl.akamaized.net/images/logo/header/it1.png?lm=1656073460',
        4
    ),
    5: build_league_config(
        'Ligue 1',
        'ligue-1',
        'FR1',
        'France',
        'https://tmssl.akamaized.net/images/logo/header/fr1.png?lm=1648360140',
        5
    ),
    6: build_league_config(
        'Liga Portugal',
        'liga-portugal',
        'PO1',
        'Portugal',
        'https://tmssl.akamaized.net/images/logo/header/po1.png?lm=1626110146',
        6
    ),
    7: build_league_config(
        'Eredivisie',
        'eredivisie',
        'NL1',
        'Netherlands',
        'https://tmssl.akamaized.net/images/logo/header/nl1.png?lm=1674743474',
        7
    )
}


## SOURCE-ONLY LEAGUES FOR PROJECTED MODE ##
SOURCE_ONLY_LEAGUES = {
    -1: build_source_only_league_config('league-one', 'GB3', -1),
    -2: build_source_only_league_config('laliga2', 'ES2', -2),
    -3: build_source_only_league_config('2-bundesliga', 'L2', -3),
    -4: build_source_only_league_config('serie-b', 'IT2', -4),
    -5: build_source_only_league_config('ligue-2', 'FR2', -5),
    -6: build_source_only_league_config('liga-portugal-2', 'PO2', -6),
    -7: build_source_only_league_config('eerste-divisie', 'NL2', -7)
}


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
