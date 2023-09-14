# TransferMarkt Scraper

## Introduction

This repository is dedicated to scraping data from [Transfermarkt](https://www.transfermarkt.com) to provide a comprehensive database of player, team, and league information. This data will be used to create a virtual marketplace for the European Transfer Market, ensuring the accuracy and realism of player transfers in the 23/24 season.

## Purpose

Transfermarkt is a valuable data source for simulating real-life player, team, and league data. However, since it doesn't offer public APIs, we need to scrape the website to collect the necessary information for our project. This data will later be integrated into the backend to create the virtual marketplace.

## Supported Leagues

To maintain a realistic scope for the website while providing a wide range of player options, we have selected the following leagues as the most relevant markets for player transfers to the Premier League:

- Premier League (British Top Tier)
- Championship (British Second Tier)
- La Liga (Spanish Top Tier)
- Bundesliga (German Top Tier)
- Serie A (Italian Top Tier)
- Liga Portugal (Portuguese Top Tier)
- Eredivisie (Dutch Top Tier)

## Supported Teams: Integrating Relegation

European football includes the practice of relegation and promotion, which means that top-tier leagues are part of a broader system of multiple leagues. To account for this, we have manually collected information on teams that are getting relegated from and promoted into the supported leagues. This information is crucial for the upcoming 23/24 season.

[League Parsing Script](https://github.com/athom031/Dream-Team-Transfers/blob/main/transfermarkt_scraper/constants/leagues_to_parse.py)

Now, with this data, we can scrape the website to find the relevant team data for the 23/24 season.

[Supported Team Script](https://github.com/athom031/Dream-Team-Transfers/blob/main/transfermarkt_scraper/scraped_data/scrape_and_get_supported_teams.py)

## Supported Players: Scraping Transfermarkt

With a map of league information that connects to supported teams, we can now scrape Transfermarkt to gather data on all supported players, totaling 5023 individuals.

[Supported Player Script](https://github.com/athom031/Dream-Team-Transfers/blob/main/transfermarkt_scraper/scraped_data/scrape_and_get_supported_players.py)

## Data Formatting and Storage

To simplify database management, we have categorized the collected information and stored it in separate CSV files. Each CSV file contains a unique key to connect data points across different categories.

**CSV Categories**
- Leagues
- Nations
- Players
- Positions
- Teams

By scraping and organizing data from Transfermarkt, we are one step closer to creating an authentic European Transfer Market experience on our website. This database will serve as a foundation for the virtual marketplace, enhancing user engagement and realism in the 23/24 season.
