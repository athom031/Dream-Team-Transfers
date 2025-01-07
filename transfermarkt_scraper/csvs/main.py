import pandas as pd

# Load the CSV file into a DataFrame
csv_file = "players.csv"  # Replace with the path to your CSV file
df = pd.read_csv(csv_file)

# Filter for teams with IDs 0-19 (Premier League teams)
premier_league_teams = df[df['team_id'].between(0, 19)]

# Group by team_id and sum up the player market values
team_values = premier_league_teams.groupby('team_id')['player_market_value'].sum()

# Create the output structure
team_names = {
    0: "AFC Bournemouth",
    1: "Arsenal FC",
    2: "Aston Villa",
    3: "Brentford FC",
    4: "Brighton & Hove Albion",
    5: "Chelsea FC",
    6: "Crystal Palace",
    7: "Everton FC",
    8: "Fulham FC",
    9: "Ipswich Town",
    10: "Leicester City",
    11: "Liverpool FC",
    12: "Manchester City",
    13: "Manchester United",
    14: "Newcastle United",
    15: "Nottingham Forest",
    16: "Southampton FC",
    17: "Tottenham Hotspur",
    18: "West Ham United",
    19: "Wolverhampton Wanderers",
}

result = [
    {
        "name": team_names.get(team_id, f"Team {team_id}"),
        "team_id": team_id,
        "team_value": team_value,
        "team_budget": team_value * 0.2,
    }
    for team_id, team_value in team_values.items()
]

# Print the result
for item in result:
    print(item)