## DICTIONARY KEYS ##
NAME = 'name'
URL = 'url'
NATION = 'nation'
LOGO = 'logo'
TEAMS_TO_ADD_ELSEWHERE = 'teams_to_add_elsewhere'

## LEAGUE DICTIONARY ##
# format for leagues to be parsed to build accurate team list for 24/25 season
# adds context of promotion/relegation from 23/24 tables
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
        URL: 'https://www.transfermarkt.com/premier-league/startseite/wettbewerb/GB1/plus/?saison_id=2023',
        NATION: 'England',
        LOGO: 'https://tmssl.akamaized.net/images/logo/header/gb1.png?lm=1521104656',
        TEAMS_TO_ADD_ELSEWHERE: {
            'Burnley FC': 1,
            'Sheffield United': 1,
            'Luton Town': 1,
        }
    },
    ## CHAMPIONSHIP ##
    1: {
        NAME: 'Championship',
        URL: 'https://www.transfermarkt.com/championship/startseite/wettbewerb/GB2/plus/?saison_id=2023',
        NATION: 'England',
        LOGO: 'https://tmssl.akamaized.net/images/logo/header/gb2.png?lm=1643026970',
        TEAMS_TO_ADD_ELSEWHERE: {
            'Ipswich Town': 0,
            'Leicester City': 0,
            'Southampton FC': 0,
            'Birmingham City': None,
            'Huddersfield Town': None,
            'Rotherham United': None,
        }
    },
	## LEAGUE ONE ##
    -1: {
        URL: 'https://www.transfermarkt.com/league-one/startseite/wettbewerb/GB3/plus/?saison_id=2023',
        TEAMS_TO_ADD_ELSEWHERE: {
            'Oxford United': 1,
            'Derby County': 1,
            'Portsmouth FC': 1
        }
    },
	## LA LIGA ##
    2: {
        NAME: 'La Liga',
        URL: 'https://www.transfermarkt.com/laliga/startseite/wettbewerb/ES1/plus/?saison_id=2023',
        NATION: 'Spain',
        LOGO: 'https://tmssl.akamaized.net/images/logo/header/es1.png?lm=1557051003',
        TEAMS_TO_ADD_ELSEWHERE: {
            'Cádiz CF': None,
            'Granada CF': None,
            'UD Almería': None
        }
    },
    ## LA LIGA 2 ##
    -2: {
        URL: 'https://www.transfermarkt.com/laliga2/startseite/wettbewerb/ES2/plus/?saison_id=2023',
        TEAMS_TO_ADD_ELSEWHERE: {
            'Real Valladolid CF': 2,
            'CD Leganés': 2,
            'RCD Espanyol Barcelona': 2
        }
    },
    ## BUNDESLIGA ##
    3: {
        NAME: 'Bundesliga',
        URL: 'https://www.transfermarkt.com/bundesliga/startseite/wettbewerb/L1/plus/?saison_id=2023',
        NATION: 'Germany',
        LOGO: 'https://tmssl.akamaized.net/images/logo/header/l1.png?lm=1525905518',
        TEAMS_TO_ADD_ELSEWHERE: {
            '1.FC Köln': None,
            'SV Darmstadt 98': None
        }
    },
    ## BUNDESLIGA 2 ##
    -3: {
        URL: 'https://www.transfermarkt.com/bundesliga/startseite/wettbewerb/L2/plus/?saison_id=2023',
        TEAMS_TO_ADD_ELSEWHERE: {
            'FC St. Pauli': 3,
            'Holstein Kiel': 3
        }
    },
	## SERIE A ##
	4: {
        NAME: 'Serie A',
        URL: 'https://www.transfermarkt.com/serie-a/startseite/wettbewerb/IT1/plus/?saison_id=2023',
        NATION: 'Italy',
        LOGO: 'https://tmssl.akamaized.net/images/logo/header/it1.png?lm=1656073460',
        TEAMS_TO_ADD_ELSEWHERE: {
            'Frosinone Calcio': None,
            'US Sassuolo': None,
            'US Salernitana 1919': None
        }
	},
	## SERIE B ##
	-4: {
        URL: 'https://www.transfermarkt.com/serie-b/startseite/wettbewerb/IT2/plus/?saison_id=2023',
        TEAMS_TO_ADD_ELSEWHERE: {
            'Parma Calcio 1913': 4,
            'Como 1907': 4,
            'Venezia FC': 4

        }
	},
	## LIGUE 1 ##
	5: {
        NAME: 'Ligue One',
        URL: 'https://www.transfermarkt.com/ligue-1/startseite/wettbewerb/FR1/plus/?saison_id=2023',
        NATION: 'France',
        LOGO: 'https://tmssl.akamaized.net/images/logo/header/fr1.png?lm=1648360140',
        TEAMS_TO_ADD_ELSEWHERE: {
            'FC Lorient': None,
            'FC Metz': None,
            'Clermont Foot 63': None
        }
	},
	## LIGUE 2 ##
	-5: {
        URL: 'https://www.transfermarkt.com/ligue-1/startseite/wettbewerb/FR2/plus/?saison_id=2023',
        TEAMS_TO_ADD_ELSEWHERE: {
            'AJ Auxerre': 5,
            'Angers SCO': 5,
            'AS Saint-Étienne': 5,
        }
	},
	## LIGA PORTUGAL ##
	6: {
        NAME: 'Liga Portugal',
        URL: 'https://www.transfermarkt.com/liga-nos/startseite/wettbewerb/PO1/plus/?saison_id=2023',
        NATION: 'Portugal',
        LOGO: 'https://tmssl.akamaized.net/images/logo/header/po1.png?lm=1626110146',
        TEAMS_TO_ADD_ELSEWHERE: {
            'FC Vizela': None,
            'GD Chaves': None,
            'Portimonense SC': None
        }
	},
	## LIGA PORTUGAL 2 ##
	-6: {
        URL: 'https://www.transfermarkt.com/liga-nos/startseite/wettbewerb/PO2/plus/?saison_id=2023',
		TEAMS_TO_ADD_ELSEWHERE: {
            'CD Santa Clara': 6,
            'CD Nacional': 6,
            'Avs Futebol': 6
        }
	},
	## EREDIVISIE ##
    7: {
        NAME: 'Eredivisie',
        URL: 'https://www.transfermarkt.com/eredivisie/startseite/wettbewerb/NL1/plus/?saison_id=2023',
        NATION: 'Netherlands',
        LOGO: 'https://tmssl.akamaized.net/images/logo/header/nl1.png?lm=1674743474',
        TEAMS_TO_ADD_ELSEWHERE: {
            'Excelsior Rotterdam': None,
            'FC Volendam': None,
            'Vitesse Arnhem': None
        }
    },
	## KEUKEN KAMPIOEN DIVISIE ##
	-7: {
        URL: 'https://www.transfermarkt.com/eredivisie/startseite/wettbewerb/NL2/plus/?saison_id=2023',
        TEAMS_TO_ADD_ELSEWHERE: {
            'Willem II Tilburg': 7,
            'FC Groningen': 7,
            'NAC Breda': 7
        }
	}
}
