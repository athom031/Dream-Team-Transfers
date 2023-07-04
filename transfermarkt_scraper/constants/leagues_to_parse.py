## DICTIONARY KEYS ##
NAME = 'name'
URL = 'url'
NATION = 'nation'
LOGO = 'logo'
TEAMS_TO_ADD_ELSEWHERE = 'teams_to_add_elsewhere'

## LEAGUE DICTIONARY ##
# format for leagues to be parsed to build accurate team list for 23/24 season
# adds context of promotion/relegation from 22/23 tables
"""
## <LEAGUE NAME> ##

<if team is supported>
<positive_id>: {
    NAME: '<league_name>',
    URL: '<league_url>',
    NATION: '<league_nation>',
    LOGO: '<league_logo>',
    TEAMS_TO_ADD_ELSEWHERE: {
        '<team_name>': <league_id_to_send_to>
    }
}

<if team is not supported>
<negative_id>: {
    URL: '<league_url>',
    TEAMS_TO_ADD_ELSEWHERE: {
        '<team_name>': <league_id_to_send_to>
    }
}
"""

LEAGUES_TO_PARSE = {
    ## PREMIER LEAGUE ##
    0: {
        NAME: 'Premier League',
        URL: 'https://www.transfermarkt.com/premier-league/startseite/wettbewerb/GB1/plus/?saison_id=2022',
        NATION: 'England',
        LOGO: 'https://tmssl.akamaized.net/images/logo/header/gb1.png?lm=1521104656',
        TEAMS_TO_ADD_ELSEWHERE: {
            'Leicester City': 1,
            'Leeds United': 1,
            'Southampton FC': 1
        }
    },
    ## CHAMPIONSHIP ##
    1: {
        NAME: 'Championship',
        URL: 'https://www.transfermarkt.com/championship/startseite/wettbewerb/GB2/plus/?saison_id=2022',
        NATION: 'England',
        LOGO: 'https://tmssl.akamaized.net/images/logo/header/gb2.png?lm=1643026970',
        TEAMS_TO_ADD_ELSEWHERE: {
            'Burnley FC': 0,
            'Sheffield United': 0,
            'Luton Town': 0,
            'Wigan Athletic': None,
            'Reading FC': None,
            'Blackpool FC': None
        }
    },
	## LEAGUE ONE ##
    -1: {
        URL: 'https://www.transfermarkt.com/league-one/startseite/wettbewerb/GB3/plus/?saison_id=2022',
        TEAMS_TO_ADD_ELSEWHERE: {
            'Plymouth Argyle': 1,
            'Ipswich Town': 1,
            'Sheffield Wednesday': 1
        }
    },
	## LA LIGA ##
    2: {
        NAME: 'La Liga',
        URL: 'https://www.transfermarkt.com/laliga/startseite/wettbewerb/ES1/plus/?saison_id=2022',
        NATION: 'Spain',
        LOGO: 'https://tmssl.akamaized.net/images/logo/header/es1.png?lm=1557051003',
        TEAMS_TO_ADD_ELSEWHERE: {
            'Real Valladolid CF': None,
            'RCD Espanyol Barcelona': None,
            'Elche CF': None
        }
    },
    ## LA LIGA 2 ##
    -2: {
        URL: 'https://www.transfermarkt.com/laliga2/startseite/wettbewerb/ES2/plus/?saison_id=2022',
        TEAMS_TO_ADD_ELSEWHERE: {
            'Granada CF': 2,
            'UD Las Palmas': 2,
            'Deportivo Alavés': 2
        }
    },
    ## BUNDESLIGA ##
    3: {
        NAME: 'Bundesliga',
        URL: 'https://www.transfermarkt.com/bundesliga/startseite/wettbewerb/L1/plus/?saison_id=2022',
        NATION: 'Germany',
        LOGO: 'https://tmssl.akamaized.net/images/logo/header/l1.png?lm=1525905518',
        TEAMS_TO_ADD_ELSEWHERE: {
            'FC Schalke 04': None,
            'Hertha BSC': None
        }
    },
    ## BUNDESLIGA 2 ##
    -3: {
        URL: 'https://www.transfermarkt.com/bundesliga/startseite/wettbewerb/L2/plus/?saison_id=2022',
        TEAMS_TO_ADD_ELSEWHERE: {
            '1.FC Heidenheim 1846': 3,
            'SV Darmstadt 98': 3
        }
    },
	## SERIE A ##
	4: {
        NAME: 'Serie A',
        URL: 'https://www.transfermarkt.com/serie-a/startseite/wettbewerb/IT1/plus/?saison_id=2022',
        NATION: 'Italy',
        LOGO: 'https://tmssl.akamaized.net/images/logo/header/it1.png?lm=1656073460',
        TEAMS_TO_ADD_ELSEWHERE: {
            'Spezia Calcio': None,
            'US Cremonese': None,
            'UC Sampdoria': None
        }
	},
	## SERIE B ##
	-4: {
        URL: 'https://www.transfermarkt.com/serie-b/startseite/wettbewerb/IT2/plus/?saison_id=2022',
        TEAMS_TO_ADD_ELSEWHERE: {
            'Frosinone Calcio': 4,
            'Genoa CFC': 4,
            'Cagliari Calcio': 4
        }
	},
	## LIGUE 1 ##
	5: {
        NAME: 'Ligue One',
        URL: 'https://www.transfermarkt.com/ligue-1/startseite/wettbewerb/FR1/plus/?saison_id=2022',
        NATION: 'France',
        LOGO: 'https://tmssl.akamaized.net/images/logo/header/fr1.png?lm=1648360140',
        TEAMS_TO_ADD_ELSEWHERE: {
            'AJ Auxerre': None,
            'AC Ajaccio': None,
            'ESTAC Troyes': None,
            'Angers SCO': None
        }
	},
	## LIGUE 2 ##
	-5: {
        URL: 'https://www.transfermarkt.com/ligue-1/startseite/wettbewerb/FR2/plus/?saison_id=2022',
        TEAMS_TO_ADD_ELSEWHERE: {
            'Le Havre AC': 5,
            'FC Metz': 5
        }
	},
	## LIGA PORTUGAL ##
	6: {
        NAME: 'Liga Portugal',
        URL: 'https://www.transfermarkt.com/liga-nos/startseite/wettbewerb/PO1/plus/?saison_id=2022',
        NATION: 'Portugal',
        LOGO: 'https://tmssl.akamaized.net/images/logo/header/po1.png?lm=1626110146',
        TEAMS_TO_ADD_ELSEWHERE: {
            'CS Marítimo': None,
            'FC Paços de Ferreira': None,
            'CD Santa Clara': None
        }
	},
	## LIGA PORTUGAL 2 ##
	-6: {
        URL: 'https://www.transfermarkt.com/liga-nos/startseite/wettbewerb/PO2/plus/?saison_id=2022',
		TEAMS_TO_ADD_ELSEWHERE: {
            'Moreirense FC': 6,
            'SC Farense': 6,
            'CF Estrela Amadora SAD': 6
        }
	},
	## EREDIVISIE ##
	7: {
        NAME: 'Eredivisie',
        URL: 'https://www.transfermarkt.com/eredivisie/startseite/wettbewerb/NL1/plus/?saison_id=2022',
        NATION: 'Netherlands',
        LOGO: 'https://tmssl.akamaized.net/images/logo/header/nl1.png?lm=1674743474',
        TEAMS_TO_ADD_ELSEWHERE: {
            'FC Emmen': None,
            'SC Cambuur Leeuwarden': None,
            'FC Groningen': None
        }
	},
	## KEUKEN KAMPIOEN DIVISIE ##
	-7: {
        URL: 'https://www.transfermarkt.com/eredivisie/startseite/wettbewerb/NL2/plus/?saison_id=2022',
        TEAMS_TO_ADD_ELSEWHERE: {
            'Heracles Almelo': 7,
            'PEC Zwolle': 7,
            'Almere City FC': 7
        }
	}
}
