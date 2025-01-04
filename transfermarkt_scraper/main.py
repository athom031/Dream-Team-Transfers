from scraped_data.scrape_and_get_supported_players import scrape_and_get_supported_players
from scraped_data.scrape_and_get_supported_teams import scrape_and_get_supported_teams
from csvs.write_csvs import write_csvs

# scrape transfermarkt for supported team data from the leagues to parse 
scrape_and_get_supported_teams()

# scrape transfermarkt for supported player data from supported team data
scrape_and_get_supported_players()

# from scraped data build csvs DreamTeamTransfer data
write_csvs()
