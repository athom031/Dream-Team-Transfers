raise Exception(
	'Define User Agent before scraping transfermarkt.com. This helps informing website that script accessing website is a web browser.'
	+ '\nInstructions:'
	+ '\n  Chrome: Search "chrome://version/" without quotes and find "User Agent" field'
	+ '\n  Firefox: Search "about:support" without quotes and find "User Agent" field in "Application Basics" section'
	+ '\n  Edge: Search "edge://version/" and find "User Agent" field'
	+ '\n  Safari: Preferences >> Advanced >> Show Develop Menu in menu bar >> Develop Menu >> User Agent'
)

USER_AGENT = '<follow instructions laid out in above Exception to find user_agent>'

# used to inform website that requests are coming from browser
HEADERS = { 'User-Agent': USER_AGENT }
