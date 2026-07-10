from datetime import datetime

# Season configuration used by the scraper workflow.
# Keep league membership and squad scraping seasons separate so the parser can
# use the appropriate context for the current scrape run.
MEMBERSHIP_SEASON_ID = 2026
SQUAD_SEASON_ID = 2025

# Fallback values used when Transfermarkt does not provide a player birth date.
# The helper derives a placeholder birthday for a player who would be roughly 17
# years old in the configured squad season.
DEFAULT_PLAYER_BIRTH_YEAR_OFFSET = 17
DEFAULT_PLAYER_BIRTH_MONTH = 6
DEFAULT_PLAYER_BIRTH_DAY = 15


def get_default_player_birth_date(season_id=SQUAD_SEASON_ID):
    return datetime.strptime(
        f'{DEFAULT_PLAYER_BIRTH_MONTH}/{DEFAULT_PLAYER_BIRTH_DAY}/{season_id - DEFAULT_PLAYER_BIRTH_YEAR_OFFSET}',
        '%m/%d/%Y',
    )
