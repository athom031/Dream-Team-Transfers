const GENERATED_ASSET_BASE = `${process.env.PUBLIC_URL}/assets/generated`;

export const getGeneratedPlayerPortraitPath = (playerId) =>
  `${GENERATED_ASSET_BASE}/players/${Number(playerId)}.webp`;

export const getGeneratedNationFlagPath = (nationId) =>
  `${GENERATED_ASSET_BASE}/nations/${Number(nationId)}.webp`;

export const getGeneratedTeamCrestPath = (teamId) =>
  `${GENERATED_ASSET_BASE}/teams/${Number(teamId)}.webp`;

export const getRemoteFallbackImage = (event, fallbackSrc) => {
  if (!fallbackSrc || event.currentTarget.dataset.fallbackApplied === 'true') {
    return;
  }

  event.currentTarget.dataset.fallbackApplied = 'true';
  event.currentTarget.src = fallbackSrc;
};
