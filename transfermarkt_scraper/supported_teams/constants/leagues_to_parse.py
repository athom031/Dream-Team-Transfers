## DICTIONARY KEYS ##

id = 'id'
name = 'name'
url = 'url'
nation = 'nation'
logo = 'logo'
teams_to_add_elsewhere = 'teams_to_add_elsewhere'

## LEAGUE DICTIONARY ##
LEAGUES_TO_PARSE = [
    ## format for leagues to be parsed to build accurate team list for 23/24 season
    ## adds context of promotion/relegation from 22/23 tables
    """
    ## <LEAGUE NAME> ##

    <if team is supported>
    {
        id: <league_id>
        name: '<league_name>',
        url: '<league_url>',
        nation: '<league_nation>',
        logo: '<league_logo>',
        teams_to_add_elsewhere: {
            '<team_name>': <league_id_to_send_to>
        }
    }

    <if team is not supported>
    {
        id: None,
        url: '<league_url>',
        teams_to_add_elsewhere: {
            '<team_name>': <league_id_to_send_to>
        }
    }
    """
    ## PREMIER LEAGUE ##
    {
        id: 0,
        name: 'Premier League',
        url: 'https://www.transfermarkt.com/premier-league/startseite/wettbewerb/GB1',
        nation: 'England',
        logo: 'https://tmssl.akamaized.net/images/logo/header/gb1.png?lm=1521104656',
        teams_to_add_elsewhere: {
            'Leicester City': 1,
            'Leeds United': 1,
            'Southampton FC': 1
        }
    },
    ## CHAMPIONSHIP ##
    {
        id: 1,
        name: 'Championship',
        url: 'https://www.transfermarkt.com/premier-league/startseite/wettbewerb/GB1',
        nation: 'England',
        logo: 'https://tmssl.akamaized.net/images/logo/header/gb2.png?lm=1643026970',
        teams_to_add_elsewhere: {
            'Burnley FC': 0,
            'Sheffield United': 0,
            'Luton Town': 0,
            'Wigan Athletic': None,
            'Reading FC': None,
            'Blackpool FC': None
        }
    },
	## LEAGUE ONE ##
    {
        id: None,
        url: 'https://www.transfermarkt.com/league-one/startseite/wettbewerb/GB3'
        teams_to_add_elsewhere: {
            'Plymouth Argyle': 1,
            'Ipswich Town': 1,
            'Sheffield Wednesday': 1
        }
    },
	## LA LIGA ##
    {
        id: 2,
        name: 'La Liga',
        url: 'https://www.transfermarkt.com/laliga/startseite/wettbewerb/ES1',
        nation: 'Spain',
        logo: 'https://tmssl.akamaized.net/images/logo/header/es1.png?lm=1557051003',
        teams_to_add_elsewhere: {
            'Real Valladolid CF': None,
            'RCD Espanyol Barcelona': None,
            'Elche CF': None
        }
    },
    ## LA LIGA 2 ##
    {
        id: None,
        url: 'https://www.transfermarkt.com/laliga2/startseite/wettbewerb/ES2'
        teams_to_add_elsewhere: {
            'Granada CF': 2,
            'UD Las Palmas': 2,
            'Deportivo Alavés': 2
        }
    },
    ## BUNDESLIGA ##
    {
        id: 3,
        name: 'Bundesliga',
        url: 'https://www.transfermarkt.com/bundesliga/startseite/wettbewerb/L1',
        nation: 'Germany',
        logo: 'https://tmssl.akamaized.net/images/logo/header/l1.png?lm=1525905518',
        teams_to_add_elsewhere: {
            'FC Schalke 04': None,
            'Hertha BSC': None
        }
    },
    ## BUNDESLIGA 2 ##
    {
        id: None,
        url: 'https://www.transfermarkt.com/bundesliga/startseite/wettbewerb/L2',
        teams_to_add_elsewhere: {
            '1.FC Heidenheim 1846': 3,
            'SV Darmstadt 98': 3
        }
    },
	## SERIE A ##
	{
        id: 4,
        name: 'Serie A',
        url: 'https://www.transfermarkt.com/serie-a/startseite/wettbewerb/IT1',
        nation: 'Italy',
        logo: 'https://tmssl.akamaized.net/images/logo/header/it1.png?lm=1656073460',
        teams_to_add_elsewhere: {
            'Spezia Calcio': None,
            'US Cremonese': None,
            'UC Sampdoria': None
        }
	},
	## SERIE B ##
	{
        id: None,
        url: 'https://www.transfermarkt.com/serie-b/startseite/wettbewerb/IT2'
        teams_to_add_elsewhere: {
            'Frosinone Calcio': 4,
            'Genoa CFC': 4,
            'Cagliari Calcio': 4
        }
	},
	## LIGUE 1 ##
	{
        id: 5,
        name: 'Ligue One',
        url: 'https://www.transfermarkt.com/ligue-1/startseite/wettbewerb/FR1',
        nation: 'France',
        logo: 'https://tmssl.akamaized.net/images/logo/header/fr1.png?lm=1648360140',
        teams_to_add_elsewhere: {
            'AJ Auxerre': None,
            'AC Ajaccio': None,
            'ESTAC Troyes': None,
            'Angers SCO': None
        }
	},
	## LIGUE 2 ##
	{
        id: None,
        url: 'https://www.transfermarkt.com/ligue-1/startseite/wettbewerb/FR2',
        to_add_elsewhere: {
            'Le Havre AC': 5,
            'FC Metz': 5
        }
	},
	## LIGA PORTUGAL ##
	{
        id: 6,
        name: 'Liga Portugal',
        url: 'https://www.transfermarkt.com/liga-nos/startseite/wettbewerb/PO1',
        nation: 'Portugal',
        logo: 'https://tmssl.akamaized.net/images/logo/header/po1.png?lm=1626110146',
        teams_to_add_elsewhere: {
            'CS Marítimo': None,
            'FC Paços de Ferreira': None,
            'CD Santa Clara': None
        }
	},
	## LIGA PORTUGAL 2 ##
	{
        id: None,
        url: 'https://www.transfermarkt.com/liga-nos/startseite/wettbewerb/PO2',
		teams_to_add_elsewhere: {
            'Moreirense FC': 6,
            'SC Farense': 6,
            'CF Estrela Amadora SAD': 6
        }
	},
	## EREDIVISIE ##
	{
        id: 7,
        name: 'Eredivisie',
        url: 'https://www.transfermarkt.com/eredivisie/startseite/wettbewerb/NL1',
        nation: 'Netherlands',
        logo: 'https://tmssl.akamaized.net/images/logo/header/nl1.png?lm=1674743474',
        teams_to_add_elsewhere: {
            'FC Emmen': None,
            'SC Cambuur Leeuwarden': None,
            'FC Groningen': None
        }
	},
	## KEUKEN KAMPIOEN DIVISIE ##
	{
        id: None,
        url: 'https://www.transfermarkt.com/eredivisie/startseite/wettbewerb/NL2',
        teams_to_add_elsewhere: {
            'Heracles Almelo': 7,
            'PEC Zwolle': 7,
            'Almere City FC': 7
        }
	}
]
