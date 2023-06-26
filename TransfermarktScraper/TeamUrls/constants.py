"""
raise Exception(
	'Define User Agent before scraping transfermarkt.com. This helps informing website that script accessing website is a web browser.'
	+ '\nInstructions:'
	+ '\n  Chrome: Search "chrome://version/" without quotes and find "User Agent" field'
	+ '\n  Firefox: Search "about:support" without quotes and find "User Agent" field in "Application Basics" section'
	+ '\n  Edge: Search "edge://version/" and find "User Agent" field'
	+ '\n  Safari: Preferences >> Advanced >> Show Develop Menu in menu bar >> Develop Menu >> User Agent'
)
USER_AGENT = '<define user_agent here and delete exception>'
"""
USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'

BASE_WEBSITE = 'http://transfermarkt.com'

LEAGUES_TO_INCLUDE = [
    { 'id': 0, 'name': 'Premier League' },
    { 'id': 1, 'name': 'Championship' },
    { 'id': 2, 'name': 'La Liga' },
    { 'id': 3, 'name': 'Bundesliga' },
    { 'id': 4, 'name': 'Serie A' },
    { 'id': 5, 'name': 'Ligue 1' },
    { 'id': 6, 'name': 'Liga Portugal' },
    { 'id': 7, 'name': 'Eredivisie' }
]

LEAGUES_TO_PARSE = [
	## PREMIER LEAGUE ##
    {
        'id': 0,
        'toAddElsewhere': [
            {'name': 'Leicester City', 'leagueToAddIn': 1},
            {'name': 'Leeds United', 'leagueToAddIn': 1},
            {'name': 'Southampton', 'leagueToAddIn': 1}
        ],
        'url': 'https://www.transfermarkt.com/premier-league/startseite/wettbewerb/GB1'
    },
	## CHAMPIONSHIP ##
    {
        'id': 1,
        'toAddElsewhere': [
            {'name': 'Burnley FC', 'leagueToAddIn': 0},
            {'name': 'Sheffield United', 'leagueToAddIn': 0},
            {'name': 'Luton Town', 'leagueToAddIn': 0},
            {'name': 'Wigan Athletic', 'leagueToAddIn': None},
            {'name': 'Reading FC', 'leagueToAddIn': None},
            {'name': 'Blackpool FC', 'leagueToAddIn': None}
        ],
        'url': 'https://www.transfermarkt.com/premier-league/startseite/wettbewerb/GB2'
    },
	## LEAGUE ONE ##
    {
        'id': None,
        'toAddElsewhere': [
            {'name': 'Plymouth Argyle', 'leagueToAddIn': 1},
            {'name': 'Ipswich Town', 'leagueToAddIn': 1},
            {'name': 'Sheffield Wednesday', 'leagueToAddIn': 1}
        ],
        'url': 'https://www.transfermarkt.com/league-one/startseite/wettbewerb/GB3'
    },
	## LA LIGA ##
    {
        'id': 2,
        'toAddElsewhere': [
            {'name': 'Real Valladolid CF', 'leagueToAddIn': None},
            {'name': 'RCD Espanyol Barcelona', 'leagueToAddIn': None},
            {'name': 'Elche CF', 'leagueToAddIn': None}
        ],
        'url': 'https://www.transfermarkt.com/laliga/startseite/wettbewerb/ES1'
    },
    ## LA LIGA 2 ##
    {
        'id': None,
        'toAddElsewhere': [
            {'name': 'Granada CF', 'leagueToAddIn': 2},
            {'name': 'UD Las Palmas', 'leagueToAddIn': 2},
            {'name': 'Deportivo Alavés', 'leagueToAddIn': 2}
        ],
        'url': 'https://www.transfermarkt.com/laliga2/startseite/wettbewerb/ES2'
    },
    ## BUNDESLIGA ##
    {
        'id': 3,
        'toAddElsewhere': [
            {'name': 'VfB Stuttgart', 'leagueToAddIn': None},
            {'name': 'FC Schalke 04', 'leagueToAddIn': None},
            {'name': 'Hertha BSC', 'leagueToAddIn': None}
        ],
        'url': 'https://www.transfermarkt.com/bundesliga/startseite/wettbewerb/L1'
    },
    ## BUNDESLIGA 2 ##
    {
        'id': None,
        'toAddElsewhere': [
            {'name': "1.FC Heidenheim 1846", 'leagueToAddIn': 3},
            {'name': "SV Darmstadt 98", 'leagueToAddIn': 3},
            {'name': "Hamburger SV", 'leagueToAddIn': 3}
        ],
        'url': 'https://www.transfermarkt.com/bundesliga/startseite/wettbewerb/L2'
    },
	## SERIE A ##
	{
		'id': 4,
		'toAddElsewhere': [
			{ 'name': 'Spezia Calcio', 'leagueToAddIn': None },
			{ 'name': 'US Cremonese', 'leagueToAddIn': None },
			{ 'name': 'UC Sampdoria', 'leagueToAddIn': None }
		],
		'url': 'https://www.transfermarkt.com/serie-a/startseite/wettbewerb/IT1'
	},
	## SERIE B ##
	{
		'id': None,
		'toAddElsewhere': [
			{ 'name': 'Frosinone Calcio', 'leagueToAddIn': 4},
			{ 'name': 'Genoa CFC', 'leagueToAddIn': 4},
			{ 'name': 'Cagliari Calcio', 'leagueToAddIn': 4}
		],
		'url': 'https://www.transfermarkt.com/serie-b/startseite/wettbewerb/IT2'
	},
	## LIGUE 1 ##
	{
		'id': 5,
		'toAddElsewhere': [
			{ 'name': 'AJ Auxerre', 'leagueToAddIn': None },
			{ 'name': 'AC Ajaccio', 'leagueToAddIn': None },
			{ 'name': 'ESTAC Troyes', 'leagueToAddIn': None },
			{ 'name': 'Angers SCO', 'leagueToAddIn': None }
		],
		'url': 'https://www.transfermarkt.com/ligue-1/startseite/wettbewerb/FR1'
	},
	## LIGUE 2 ##
	{
		'id': None,
		'toAddElsewhere': [
			{ 'name': 'Le Havre AC', 'leagueToAddIn': 5 },
			{ 'name': 'FC Metz', 'leagueToAddIn': 5 }
		],
		'url': 'https://www.transfermarkt.com/ligue-1/startseite/wettbewerb/FR2'
	},
	## LIGA PORTUGAL ##
	{
		'id': 6,
		'toAddElsewhere': [
			{ 'name': 'FC Paços de Ferreira', 'leagueToAddIn': None },
			{ 'name': 'CD Santa Clara', 'leagueToAddIn': None },
		],
		'url': 'https://www.transfermarkt.com/liga-nos/startseite/wettbewerb/PO1'
	},
	## LIGA PORTUGAL 2 ##
	{
		'id': None,
		'toAddElsewhere': [
			{ 'name': 'Moreirense FC', 'leagueToAddIn': 6 },
			{ 'name': 'SC Farense', 'leagueToAddIn': 6 }
		],
		'url': 'https://www.transfermarkt.com/liga-nos/startseite/wettbewerb/PO2'
	},
	## EREDIVISIE ##
	{
		'id': 7,
		'toAddElsewhere': [
			{ 'name': 'FC Emmen', 'leagueToAddIn': None },
			{ 'name': 'SC Cambuur Leeuwarden', 'leagueToAddIn': None },
			{ 'name': 'FC Groningen', 'leagueToAddIn': None }
		],
		'url': 'https://www.transfermarkt.com/eredivisie/startseite/wettbewerb/NL1'
	},
	## KEUKEN KAMPIOEN DIVISIE ##
	{
		'id': None,
		'toAddElsewhere': [
			{ 'name': 'Heracles Almelo', 'leagueToAddIn': 7 },
			{ 'name': 'PEC Zwolle', 'leagueToAddIn': 7 },
			{ 'name': 'Almere City FC', 'leagueToAddIn': 7 }

		],
		'url': 'https://www.transfermarkt.com/eredivisie/startseite/wettbewerb/NL2'
	}
]
