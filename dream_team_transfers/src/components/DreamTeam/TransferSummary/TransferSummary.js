import { useEffect, useMemo, useState } from 'react';
import { getTeamData } from '../../../db/db-utils';
import {
  CURRENCY_UNIT,
  getCurrencyDenominationShort,
  getCurrencyRounded,
} from '../../../utils/money-utils';
import {
  getGeneratedNationFlagPath,
  getGeneratedPlayerPortraitPath,
  getRemoteFallbackImage,
} from '../../../utils/local-assets';
import { POSITION_CIRCLES } from '../../../utils/positions';
import './TransferSummary.css';

function formatCurrency(value) {
  const numericValue = Number(value || 0);
  const roundedValue = getCurrencyRounded(Math.abs(numericValue));
  const suffix = getCurrencyDenominationShort(Math.abs(numericValue));
  const sign = numericValue < 0 ? '-' : '';

  return `${sign}${CURRENCY_UNIT}${roundedValue}${suffix}`;
}

function getIndexedById(items, idKey) {
  return (items || []).reduce((acc, item) => {
    acc[Number(item[idKey])] = item;
    return acc;
  }, {});
}

function TransferSummary({
  NationsCSVData,
  PlayersCSVData,
  PositionsCSVData,
  TeamsCSVData,
  csvLoading,
}) {
  const [teamData, setTeamData] = useState(null);
  const [loadingTeamData, setLoadingTeamData] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getTeamData()
      .then((data) => {
        if (!isMounted) return;
        setTeamData(data);
      })
      .catch((error) => {
        console.error('TransferSummary: error loading team data:', error);
      })
      .finally(() => {
        if (!isMounted) return;
        setLoadingTeamData(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const playerById = useMemo(
    () => getIndexedById(PlayersCSVData, 'player_id'),
    [PlayersCSVData]
  );
  const nationById = useMemo(
    () => getIndexedById(NationsCSVData, 'nation_id'),
    [NationsCSVData]
  );
  const positionById = useMemo(
    () => getIndexedById(PositionsCSVData, 'position_id'),
    [PositionsCSVData]
  );
  const teamById = useMemo(
    () => getIndexedById(TeamsCSVData, 'team_id'),
    [TeamsCSVData]
  );

  const boughtPlayers = useMemo(
    () =>
      (teamData?.players_bought || [])
        .map((playerId) => playerById[Number(playerId)])
        .filter(Boolean),
    [teamData?.players_bought, playerById]
  );
  const soldPlayers = useMemo(
    () =>
      (teamData?.players_sold || [])
        .map((playerId) => playerById[Number(playerId)])
        .filter(Boolean),
    [teamData?.players_sold, playerById]
  );

  const totalBoughtValue = boughtPlayers.reduce(
    (total, player) => total + Number(player.player_market_value || 0),
    0
  );
  const totalSoldValue = soldPlayers.reduce(
    (total, player) => total + Number(player.player_market_value || 0),
    0
  );
  const netSpend = totalBoughtValue - totalSoldValue;

  const renderKpiCard = (label, value, modifier = '') => (
    <div className={`transfer-kpi-card ${modifier}`}>
      <span>{label}</span>
      <strong>{formatCurrency(value)}</strong>
    </div>
  );

  const renderPlayerCard = (player, type) => {
    const playerId = Number(player.player_id);
    const nation = nationById[Number(player.nation_id)];
    const position = positionById[Number(player.position_id)];
    const club = teamById[Number(player.team_id)];
    const positionColor = POSITION_CIRCLES[position?.position_grouping];
    const showClub = type === 'bought';

    return (
      <article
        key={`${type}-${player.player_id}`}
        className={`transfer-player-card is-${type}`}
      >
        <div className="transfer-player-media">
          <img
            src={getGeneratedPlayerPortraitPath(playerId)}
            alt={player.player_name}
            onError={(e) =>
              getRemoteFallbackImage(e, player.player_portrait_small_pic)
            }
          />
        </div>
        <div className="transfer-player-details">
          <div className="transfer-player-heading">
            <h3>{player.player_name}</h3>
            <span className="transfer-player-value">
              {formatCurrency(player.player_market_value)}
            </span>
          </div>
          <div className="transfer-player-meta">
            <span className="transfer-position-pill">
              {positionColor && (
                <span
                  className="transfer-position-dot"
                  style={{ backgroundColor: positionColor }}
                ></span>
              )}
              {position?.position_acronym || 'POS'}
            </span>
            <span className="transfer-nation-pill">
              {nation && (
                <img
                  src={getGeneratedNationFlagPath(nation.nation_id)}
                  alt=""
                  onError={(e) =>
                    getRemoteFallbackImage(e, nation.nation_flag_small_pic)
                  }
                />
              )}
              {nation?.nation_name || 'Unknown'}
            </span>
            {showClub && club && (
              <span className="transfer-club-pill">{club.team_name}</span>
            )}
          </div>
        </div>
      </article>
    );
  };

  const renderTransferSection = (title, players, type) => (
    <section className={`transfer-ledger-section ${type}`}>
      <div className="transfer-section-header">
        <h2>{title}</h2>
        <span>{players.length}</span>
      </div>
      {players.length === 0 ? (
        <div className="transfer-empty-state">
          {type === 'bought'
            ? 'No players bought yet.'
            : 'No players sold yet.'}
        </div>
      ) : (
        <div className="transfer-player-grid">
          {players.map((player) => renderPlayerCard(player, type))}
        </div>
      )}
    </section>
  );

  if (
    csvLoading ||
    loadingTeamData ||
    !NationsCSVData ||
    !PlayersCSVData ||
    !PositionsCSVData ||
    !TeamsCSVData
  ) {
    return (
      <div className="transfer-summary-loading">
        Loading transfer summary...
      </div>
    );
  }

  return (
    <main className="transfer-summary-page">
      <header className="transfer-summary-header">
        <div>
          <h1>Transfer Summary</h1>
          <p>Review your transfer window spending, sales, and net movement.</p>
        </div>
        <div className="transfer-context-cards">
          {renderKpiCard('Budget', teamData?.team_budget || 0, 'is-context')}
          {renderKpiCard('Team Value', teamData?.team_value || 0, 'is-context')}
        </div>
      </header>

      <section className="transfer-kpi-grid" aria-label="Transfer totals">
        {renderKpiCard('Bought', totalBoughtValue, 'is-bought')}
        {renderKpiCard('Sold', totalSoldValue, 'is-sold')}
        {renderKpiCard(
          netSpend < 0 ? 'Net Profit' : 'Net Spend',
          netSpend < 0 ? Math.abs(netSpend) : netSpend,
          netSpend < 0 ? 'is-profit' : 'is-net'
        )}
      </section>

      <div className="transfer-ledgers">
        {renderTransferSection('Players Bought', boughtPlayers, 'bought')}
        {renderTransferSection('Players Sold', soldPlayers, 'sold')}
      </div>
    </main>
  );
}

export default TransferSummary;
