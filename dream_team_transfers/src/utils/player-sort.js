export function normalizePlayerSortText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function comparePlayersBySquadOrder(playerA, playerB) {
  return (
    Number(playerA?.position_id ?? Number.MAX_SAFE_INTEGER) -
      Number(playerB?.position_id ?? Number.MAX_SAFE_INTEGER) ||
    Number(playerB?.player_market_value || 0) -
      Number(playerA?.player_market_value || 0) ||
    normalizePlayerSortText(playerA?.player_name).localeCompare(
      normalizePlayerSortText(playerB?.player_name)
    )
  );
}

export function sortPlayersBySquadOrder(players) {
  return [...(players || [])].sort(comparePlayersBySquadOrder);
}
