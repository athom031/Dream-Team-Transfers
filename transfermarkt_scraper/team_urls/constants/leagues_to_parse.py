# leagues needed to be parsed to build accurate team list for 23/24 supported leagues
# put context of promotion of relegation onto 22/23 league tables
LEAGUES_TO_PARSE = [
	## PREMIER LEAGUE ##
    {
        'id': 0,
        'to_add_elsewhere': {
            'Leicester City': 1,
            'Leeds United': 1,
            'Southampton FC': 1
        },
        'url': 'https://www.transfermarkt.com/premier-league/startseite/wettbewerb/GB1'
    },
	## CHAMPIONSHIP ##
    {
        'id': 1,
        'to_add_elsewhere': {
            'Burnley FC': 0,
            'Sheffield United': 0,
            'Luton Town': 0,
            'Wigan Athletic': None,
            'Reading FC': None,
            'Blackpool FC': None
        },
        'url': 'https://www.transfermarkt.com/premier-league/startseite/wettbewerb/GB2'
    },
	## LEAGUE ONE ##
    {
        'id': None,
        'to_add_elsewhere': {
            'Plymouth Argyle': 1,
            'Ipswich Town': 1,
            'Sheffield Wednesday': 1
        },
        'url': 'https://www.transfermarkt.com/league-one/startseite/wettbewerb/GB3'
    },
	## LA LIGA ##
    {
        'id': 2,
        'to_add_elsewhere': {
            'Real Valladolid CF': None,
            'RCD Espanyol Barcelona': None,
            'Elche CF': None
        },
        'url': 'https://www.transfermarkt.com/laliga/startseite/wettbewerb/ES1'
    },
    ## LA LIGA 2 ##
    {
        'id': None,
        'to_add_elsewhere': {
            'Granada CF': 2,
            'UD Las Palmas': 2,
            'Deportivo Alavés': 2
        },
        'url': 'https://www.transfermarkt.com/laliga2/startseite/wettbewerb/ES2'
    },
    ## BUNDESLIGA ##
    {
        'id': 3,
        'to_add_elsewhere': {
            'FC Schalke 04': None,
            'Hertha BSC': None
        },
        'url': 'https://www.transfermarkt.com/bundesliga/startseite/wettbewerb/L1'
    },
    ## BUNDESLIGA 2 ##
    {
        'id': None,
        'to_add_elsewhere': {
            '1.FC Heidenheim 1846': 3,
            'SV Darmstadt 98': 3
        },
        'url': 'https://www.transfermarkt.com/bundesliga/startseite/wettbewerb/L2'
    },
	## SERIE A ##
	{
		'id': 4,
		'to_add_elsewhere': {
            'Spezia Calcio': None,
            'US Cremonese': None,
            'UC Sampdoria': None
        },
		'url': 'https://www.transfermarkt.com/serie-a/startseite/wettbewerb/IT1'
	},
	## SERIE B ##
	{
		'id': None,
		'to_add_elsewhere': {
            'Frosinone Calcio': 4,
            'Genoa CFC': 4,
            'Cagliari Calcio': 4
        },
		'url': 'https://www.transfermarkt.com/serie-b/startseite/wettbewerb/IT2'
	},
	## LIGUE 1 ##
	{
		'id': 5,
		'to_add_elsewhere': {
            'AJ Auxerre': None,
            'AC Ajaccio': None,
            'ESTAC Troyes': None,
            'Angers SCO': None
        },
		'url': 'https://www.transfermarkt.com/ligue-1/startseite/wettbewerb/FR1'
	},
	## LIGUE 2 ##
	{
		'id': None,
		'to_add_elsewhere': {
            'Le Havre AC': 5,
            'FC Metz': 5
        },
		'url': 'https://www.transfermarkt.com/ligue-1/startseite/wettbewerb/FR2'
	},
	## LIGA PORTUGAL ##
	{
		'id': 6,
		'to_add_elsewhere': {
            'CS Marítimo': None,
            'FC Paços de Ferreira': None,
            'CD Santa Clara': None
        },
		'url': 'https://www.transfermarkt.com/liga-nos/startseite/wettbewerb/PO1'
	},
	## LIGA PORTUGAL 2 ##
	{
		'id': None,
		'to_add_elsewhere': {
            'Moreirense FC': 6,
            'SC Farense': 6,
            'CF Estrela Amadora SAD': 6
        },
		'url': 'https://www.transfermarkt.com/liga-nos/startseite/wettbewerb/PO2'
	},
	## EREDIVISIE ##
	{
		'id': 7,
		'to_add_elsewhere': {
            'FC Emmen': None,
            'SC Cambuur Leeuwarden': None,
            'FC Groningen': None
        },
		'url': 'https://www.transfermarkt.com/eredivisie/startseite/wettbewerb/NL1'
	},
	## KEUKEN KAMPIOEN DIVISIE ##
	{
		'id': None,
		'to_add_elsewhere': {
            'Heracles Almelo': 7,
            'PEC Zwolle': 7,
            'Almere City FC': 7
        },
		'url': 'https://www.transfermarkt.com/eredivisie/startseite/wettbewerb/NL2'
	}
]
