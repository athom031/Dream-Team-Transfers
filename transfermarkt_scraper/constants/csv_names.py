CSV                     = '.csv'
READ                    = 'r'
SUCCESS                 = 'SUCCESS'

CSVS                    = 'csvs'
SCRAPED_DATA            = 'scraped_data'

SUPPORTED_TEAMS         = 'supported_teams'
# column names for scraped supported team data
TEAM_ID                 = 'team_id'
TEAM_NAME               = 'team_name'
TEAM_CREST              = 'team_crest_pic'
TEAM_DATA_URL           = 'team_data_url'
LEAGUE_ID               = 'league_id'
LEAGUE_NAME             = 'league_name'
LEAGUE_NATION           = 'league_nation'
LEAGUE_LOGO             = 'league_logo_pic'

SUPPORTED_PLAYERS         = 'supported_players'
# column names for scraped supported player data
PLAYER_ID               = 'player_id'
PLAYER_NAME             = 'player_name'
PLAYER_SHORTENED_NAME   = 'player_shortened_name'
PLAYER_MARKET_VALUE     = 'player_market_value'
PLAYER_KIT_NUMBER       = 'player_kit_number'
PLAYER_POSITION         = 'player_position'
PLAYER_NATIONALITY      = 'player_nationality'
PLAYER_NAT_FLAG         = 'player_nat_flag_pic'
PLAYER_PORTRAIT         = 'player_portrait_pic'
PLAYER_BIRTH_DATE       = 'player_birth_date'

TEAMS                   = 'teams'
# teams.csv additional column names
TEAM_CREST_BIG          = 'team_crest_big_pic'
TEAM_CREST_SMALL        = 'team_crest_small_pic'

NATIONS                 = 'nations'
# nations.csv additional column names
NATION_ID               = 'nation_id'
NATION_NAME             = 'nation_name'
NATION_FLAG_BIG         = 'nation_flag_big_pic'
NATION_FLAG_SMALL       = 'nation_flag_small_pic'

LEAGUES                 = 'leagues'
# leagues.csv additional column names
LEAGUE_LOGO_BIG           = 'league_logo_big_pic'
LEAGUE_LOGO_SMALL         = 'league_logo_small_pic'

POSITIONS               = 'positions'
# positions.csv additional column names
POSITION_ID             = 'position_id'
POSITION_NAME           = 'position_name'
POSITION_ACRONYM        = 'position_acronym'
POSITION_GROUPING       = 'position_grouping'
# grouping done semi manually
GOALKEEPER              = 'Goalkeeper'
DEFENDER                = 'Defender'
MIDFIELDER              = 'Midfielder'
ATTACKER                = 'Attacker'

PLAYERS                 = 'players'
# players.csv additional column names
PLAYER_PORTRAIT_BIG     = 'player_portrait_big_pic'
PLAYER_PORTRAIT_SMALL   = 'player_portrait_small_pic'

# position dictionary tm name: [id, name, acronym, grouping]
POSITIONS_DICT= {
    # GOALKEEPER
    GOALKEEPER: {
        POSITION_ID: 0,
        POSITION_NAME: GOALKEEPER,
        POSITION_ACRONYM: 'GK',
        POSITION_GROUPING: GOALKEEPER
    },
    # DEFENSE
    'Centre-Back': {
        POSITION_ID: 1,
        POSITION_NAME: 'Centre-Back',
        POSITION_ACRONYM: 'CB',
        POSITION_GROUPING: DEFENDER,
    },
    'Left-Back': {
        POSITION_ID: 2,
        POSITION_NAME: 'Left-Back',
        POSITION_ACRONYM: 'LB',
        POSITION_GROUPING: DEFENDER
    },
    'Right-Back': {
        POSITION_ID: 3,
        POSITION_NAME: 'Right-Back',
        POSITION_ACRONYM: 'RB',
        POSITION_GROUPING: DEFENDER
    },
    # MIDFIELD
    'midfield': {
        POSITION_ID: 4,
        POSITION_NAME: 'Central Midfielder',
        POSITION_ACRONYM: 'CM',
        POSITION_GROUPING: MIDFIELDER
    },
    'Defensive Midfield': {
        POSITION_ID: 5,
        POSITION_NAME: 'Defensive Midfielder',
        POSITION_ACRONYM: 'DM',
        POSITION_GROUPING: MIDFIELDER
    },
    'Central Midfield': {
        POSITION_ID: 4,
        POSITION_NAME: 'Central Midfielder',
        POSITION_ACRONYM: 'CM',
        POSITION_GROUPING: MIDFIELDER
    },
    'Left Midfield': {
        POSITION_ID: 6,
        POSITION_NAME: 'Left Midfielder',
        POSITION_ACRONYM: 'LM',
        POSITION_GROUPING: MIDFIELDER
    },
    'Right Midfield': {
        POSITION_ID: 7,
        POSITION_NAME: 'Right Midfielder',
        POSITION_ACRONYM: 'RM',
        POSITION_GROUPING: MIDFIELDER
    },
    'Attacking Midfield': {
        POSITION_ID: 8,
        POSITION_NAME: 'Attacking Midfielder',
        POSITION_ACRONYM: 'AM',
        POSITION_GROUPING: MIDFIELDER
    },
    # ATTACKER
    'Left Winger': {
        POSITION_ID: 9,
        POSITION_NAME: 'Left Winger',
        POSITION_ACRONYM: 'LW',
        POSITION_GROUPING: ATTACKER
    },
    'Right Winger': {
        POSITION_ID: 10,
        POSITION_NAME: 'Right Winger',
        POSITION_ACRONYM: 'RW',
        POSITION_GROUPING: ATTACKER
    },
    'Centre-Forward': {
        POSITION_ID: 11,
        POSITION_NAME: 'Centre-Forward',
        POSITION_ACRONYM: 'CF',
        POSITION_GROUPING: ATTACKER
    },
    'Second Striker': {
        POSITION_ID: 12,
        POSITION_NAME: 'Second Striker',
        POSITION_ACRONYM: 'SS',
        POSITION_GROUPING: ATTACKER
    },
    'Attack': {
        POSITION_ID: 13,
        POSITION_NAME: 'Striker',
        POSITION_ACRONYM: 'ST',
        POSITION_GROUPING: ATTACKER
    }
}

# PICTURE TAGS
CURR_TAG = 'curr'
SMALL_TAG = 'small'
BIG_TAG = 'big'

PIC_TAGS = {
    LEAGUES: {
        CURR_TAG: '/header/',
        SMALL_TAG: '/small/',
        BIG_TAG: '/header/'
    },
    NATIONS: {
        CURR_TAG: '/verysmall/',
        SMALL_TAG: '/small/',
        BIG_TAG: '/head/'
    },
    PLAYERS: {
        CURR_TAG: '/small/',
        SMALL_TAG: '/small/',
        BIG_TAG: '/header/'
    },
    TEAMS: {
        CURR_TAG: '/tiny/',
        SMALL_TAG: '/small/',
        BIG_TAG: '/head/'
    }
}

