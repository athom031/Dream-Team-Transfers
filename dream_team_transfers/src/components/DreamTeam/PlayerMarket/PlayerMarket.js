import React, { useState, useEffect, useRef } from 'react';
import { buyPlayer, getTeamData } from '../../../db/db-utils';
import { loadCSVData } from '../../../utils/parse-csv';
import './PlayerMarket.css';

function PlayerMarket({
  NationsCSVData,
  PlayersCSVData,
  TeamsCSVData,
  csvLoading,
}) {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [nations, setNations] = useState([]);
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseError, setPurchaseError] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [playersPerPage, setPlayersPerPage] = useState(20); // Show 20 players per page

  // Filter states
  const [filters, setFilters] = useState({
    name: '',
    position: '',
    league: '',
    club: '',
    nation: '',
    minValue: '',
    maxValue: '',
  });

  useEffect(() => {
    loadData();
  }, [NationsCSVData, PlayersCSVData, TeamsCSVData, csvLoading]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Check if CSV data is available
      if (csvLoading || !NationsCSVData || !PlayersCSVData || !TeamsCSVData) {
        setLoading(true);
        return;
      }

      // Load team data
      const team = await getTeamData();
      setTeamData(team);

      // Use the CSV data passed as props instead of loading it again
      setTeams(TeamsCSVData);
      setNations(NationsCSVData);

      // Filter out players we already own or have sold
      const availablePlayers = PlayersCSVData.filter(
        (player) =>
          !team.players_bought.includes(player.player_id) &&
          !team.players_sold.includes(player.player_id)
      );

      setPlayers(availablePlayers);
      setFilteredPlayers(availablePlayers);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
      // Set empty arrays as fallback to prevent infinite loading
      setPlayers([]);
      setFilteredPlayers([]);
      setTeams([]);
      setNations([]);

      // Show error message to user
      alert(
        `Failed to load player market data: ${error.message}. Please refresh the page.`
      );
    }
  };

  // Computed values for smart filtering
  const availableClubs = filters.league
    ? teams.filter((team) => team.league_id === filters.league)
    : teams;

  const availableNations = filters.league
    ? nations.filter((nation) => {
        // Get all players from the selected league
        const leaguePlayers = players.filter(
          (player) => player.league_id === filters.league
        );
        // Get unique nation IDs from those players
        const nationIds = [
          ...new Set(leaguePlayers.map((player) => player.nation_id)),
        ];
        return nationIds.includes(nation.nation_id);
      })
    : nations;

  // Pagination logic
  const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);
  const startIndex = (currentPage - 1) * playersPerPage;
  const endIndex = startIndex + playersPerPage;
  const currentPlayers = filteredPlayers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    applyFilters();
  }, [filters, players]);

  // Reset club and nation filters when league changes
  useEffect(() => {
    if (filters.league) {
      // Check if current club is still valid for the new league
      const currentClubValid = teams.some(
        (team) =>
          team.team_id === filters.club && team.league_id === filters.league
      );

      // Check if current nation is still valid for the new league
      const currentNationValid = nations.some((nation) => {
        const leaguePlayers = players.filter(
          (player) => player.league_id === filters.league
        );
        const nationIds = [
          ...new Set(leaguePlayers.map((player) => player.nation_id)),
        ];
        return (
          nationIds.includes(nation.nation_id) &&
          nation.nation_id === filters.nation
        );
      });

      // Reset invalid filters
      if (!currentClubValid) {
        setFilters((prev) => ({ ...prev, club: '' }));
      }
      if (!currentNationValid) {
        setFilters((prev) => ({ ...prev, nation: '' }));
      }
    }
  }, [filters.league, filters.club, filters.nation, teams, nations, players]);

  const applyFilters = () => {
    let filtered = [...players];

    if (filters.name) {
      filtered = filtered.filter((player) =>
        player.player_name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.position) {
      filtered = filtered.filter(
        (player) => player.position_id === filters.position
      );
    }

    if (filters.league) {
      filtered = filtered.filter(
        (player) => player.league_id === filters.league
      );
    }

    if (filters.club) {
      filtered = filtered.filter((player) => player.team_id === filters.club);
    }

    if (filters.nation) {
      filtered = filtered.filter(
        (player) => player.nation_id === filters.nation
      );
    }

    if (filters.minValue) {
      filtered = filtered.filter(
        (player) =>
          parseFloat(player.player_market_value) >= parseFloat(filters.minValue)
      );
    }

    if (filters.maxValue) {
      filtered = filtered.filter(
        (player) =>
          parseFloat(player.player_market_value) <= parseFloat(filters.maxValue)
      );
    }

    setFilteredPlayers(filtered);
  };

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
    setShowPurchaseModal(true);
  };

  const handlePurchase = async () => {
    if (!selectedPlayer || !teamData) return;

    try {
      await buyPlayer(
        selectedPlayer.player_id,
        parseFloat(selectedPlayer.player_market_value)
      );

      // Update local state
      setTeamData((prev) => ({
        ...prev,
        team_budget: String(
          parseFloat(prev.team_budget) -
            parseFloat(selectedPlayer.player_market_value)
        ),
        team_value: String(
          parseFloat(prev.team_value) +
            parseFloat(selectedPlayer.player_market_value)
        ),
        players_bought: [...prev.players_bought, selectedPlayer.player_id],
      }));

      // Remove player from available players
      setPlayers((prev) =>
        prev.filter((p) => p.player_id !== selectedPlayer.player_id)
      );

      setShowPurchaseModal(false);
      setSelectedPlayer(null);
      setPurchaseError('');
    } catch (error) {
      setPurchaseError(error.message);
    }
  };

  // Hold-to-click purchase button component for modal
  const HoldToPurchaseButton = () => {
    const [isButtonActive, setIsButtonActive] = useState(false);
    const timer = useRef(null);

    const handleButtonPress = () => {
      setIsButtonActive(true);
      timer.current = setTimeout(() => {
        handlePurchase();
        setIsButtonActive(false);
      }, 2000);
    };

    const handleButtonRelease = () => {
      clearTimeout(timer.current);
      if (isButtonActive) {
        setIsButtonActive(false);
      }
    };

    const canAfford =
      parseFloat(teamData?.team_budget || 0) >=
      parseFloat(selectedPlayer?.player_market_value || 0);

    return (
      <button
        className={`hold-purchase-button ${isButtonActive ? 'active' : ''}`}
        onMouseDown={handleButtonPress}
        onMouseUp={handleButtonRelease}
        onMouseLeave={handleButtonRelease}
        disabled={!canAfford}
      >
        <span
          className={`hold-purchase-text ${isButtonActive ? 'active' : ''}`}
        >
          {canAfford ? 'Hold to Confirm Purchase' : 'Insufficient Funds'}
        </span>
        {isButtonActive && <div className="fill-effect"></div>}
      </button>
    );
  };

  const formatValue = (value) => {
    const num = parseFloat(value);
    if (num >= 1000000) {
      return `€${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `€${(num / 1000).toFixed(0)}K`;
    }
    return `€${num}`;
  };

  const getPositionName = (positionId) => {
    const positions = {
      0: 'GK',
      1: 'CB',
      2: 'LB',
      3: 'RB',
      4: 'CM',
      5: 'CDM',
      6: 'CAM',
      7: 'LM',
      8: 'RM',
      9: 'LW',
      10: 'RW',
      11: 'ST',
    };
    return positions[positionId] || 'Unknown';
  };

  const getTeamName = (teamId) => {
    const team = teams.find((t) => t.team_id === teamId);
    return team ? team.team_name : 'Unknown Team';
  };

  const getNationFlag = (nationId) => {
    const nation = nations.find((n) => n.nation_id === nationId);
    return nation
      ? nation.nation_flag_small_pic
      : 'https://via.placeholder.com/20x15?text=Flag';
  };

  const getNationName = (nationId) => {
    const nation = nations.find((n) => n.nation_id === nationId);
    return nation ? nation.nation_name : 'Unknown Nation';
  };

  const getLeagueName = (leagueId) => {
    const leagues = {
      0: 'Premier League',
      1: 'Championship',
      2: 'La Liga',
      3: 'Bundesliga',
      4: 'Serie A',
    };
    return leagues[leagueId] || 'Unknown League';
  };

  if (
    csvLoading ||
    loading ||
    !NationsCSVData ||
    !PlayersCSVData ||
    !TeamsCSVData
  ) {
    return (
      <div className="player-market-loading">
        <div>Loading player market...</div>
        <div style={{ fontSize: '14px', marginTop: '10px', color: '#666' }}>
          This may take a few seconds
        </div>
      </div>
    );
  }

  return (
    <div className="player-market">
      <div className="player-market-header">
        <h1>Player Market</h1>
        <div className="budget-display">
          <span>Budget: {formatValue(teamData?.team_budget || 0)}</span>
          <span>Team Value: {formatValue(teamData?.team_value || 0)}</span>
        </div>
      </div>

      <div className="filters-section">
        {filters.league && (
          <div className="smart-filter-indicator">
            <span>
              🎯 Smart filtering active for {getLeagueName(filters.league)}
            </span>
            <button
              className="clear-league-filter"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  league: '',
                  club: '',
                  nation: '',
                }))
              }
            >
              Clear League Filter
            </button>
          </div>
        )}
        <div className="filter-row">
          <input
            type="text"
            placeholder="Player name..."
            value={filters.name}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, name: e.target.value }))
            }
            className="filter-input"
          />
          <select
            value={filters.position}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, position: e.target.value }))
            }
            className="filter-select"
          >
            <option value="">All Positions</option>
            <option value="0">Goalkeeper</option>
            <option value="1">Center Back</option>
            <option value="2">Left Back</option>
            <option value="3">Right Back</option>
            <option value="4">Center Midfielder</option>
            <option value="5">Defensive Midfielder</option>
            <option value="6">Attacking Midfielder</option>
            <option value="7">Left Midfielder</option>
            <option value="8">Right Midfielder</option>
            <option value="9">Left Winger</option>
            <option value="10">Right Winger</option>
            <option value="11">Striker</option>
          </select>
          <select
            value={filters.league}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, league: e.target.value }))
            }
            className="filter-select"
          >
            <option value="">All Leagues</option>
            <option value="0">Premier League</option>
            <option value="1">Championship</option>
            <option value="2">La Liga</option>
            <option value="3">Bundesliga</option>
            <option value="4">Serie A</option>
          </select>
        </div>
        <div className="filter-row">
          <select
            value={filters.club}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, club: e.target.value }))
            }
            className="filter-select"
          >
            <option value="">
              {filters.league
                ? `All Clubs (${availableClubs.length})`
                : 'All Clubs'}
            </option>
            {availableClubs.map((team) => (
              <option key={team.team_id} value={team.team_id}>
                {team.team_name}
              </option>
            ))}
          </select>
          <select
            value={filters.nation}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, nation: e.target.value }))
            }
            className="filter-select"
          >
            <option value="">
              {filters.league
                ? `All Nations (${availableNations.length})`
                : 'All Nations'}
            </option>
            {availableNations.map((nation) => (
              <option key={nation.nation_id} value={nation.nation_id}>
                {nation.nation_name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Min value (€)"
            value={filters.minValue}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, minValue: e.target.value }))
            }
            className="filter-input"
          />
          <input
            type="number"
            placeholder="Max value (€)"
            value={filters.maxValue}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, maxValue: e.target.value }))
            }
            className="filter-input"
          />
        </div>
      </div>

      <div className="results-section">
        <div className="results-header">
          <h3>Available Players ({filteredPlayers.length})</h3>
        </div>

        <div className="players-grid">
          {currentPlayers.map((player) => {
            return (
              <div
                key={player.player_id}
                className="player-card"
                onClick={() => handlePlayerClick(player)}
              >
                {/* Row 1: Photo + Name */}
                <div className="player-row player-row-1">
                  <div className="player-image">
                    <img
                      src={player.player_portrait_small_pic}
                      alt={player.player_name}
                      onError={(e) => {
                        e.target.src =
                          'https://via.placeholder.com/60x60?text=Player';
                      }}
                    />
                  </div>
                  <h4 className="player-name">{player.player_name}</h4>
                </div>

                {/* Row 2: Current team name */}
                <p className="player-club">{getTeamName(player.team_id)}</p>

                {/* Row 3: Nationality Flag + Position + Money */}
                <div className="player-row player-row-3">
                  <img
                    src={getNationFlag(player.nation_id)}
                    alt="Nationality"
                    className="player-nationality-flag"
                    onError={(e) => {
                      e.target.src =
                        'https://via.placeholder.com/20x15?text=Flag';
                    }}
                  />
                  <span className="player-position">
                    {getPositionName(player.position_id)}
                  </span>
                  <span className="player-value">
                    {formatValue(player.player_market_value)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        <div className="pagination-controls">
          <div className="pagination-info">
            Showing {startIndex + 1}-
            {Math.min(endIndex, filteredPlayers.length)} of{' '}
            {filteredPlayers.length} players
          </div>
          {totalPages > 1 && (
            <>
              <div className="players-per-page-selector">
                <label htmlFor="players-per-page">Players per page:</label>
                <select
                  id="players-per-page"
                  value={playersPerPage}
                  onChange={(e) => {
                    setPlayersPerPage(Number(e.target.value));
                    setCurrentPage(1); // Reset to first page when changing page size
                  }}
                  className="players-per-page-select"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div className="pagination-buttons">
                <button
                  className="pagination-button"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  First
                </button>
                <button
                  className="pagination-button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                {/* Page numbers */}
                <div className="page-numbers">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        className={`pagination-button page-number ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  className="pagination-button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
                <button
                  className="pagination-button"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && selectedPlayer && (
        <div
          className="modal-overlay"
          onClick={() => setShowPurchaseModal(false)}
        >
          <div className="purchase-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Purchase</h2>
              <button
                className="close-button"
                onClick={() => setShowPurchaseModal(false)}
              >
                ×
              </button>
            </div>

            <div className="player-details">
              <img
                src={selectedPlayer.player_portrait_big_pic}
                alt={selectedPlayer.player_name}
                onError={(e) => {
                  e.target.src =
                    'https://via.placeholder.com/120x120?text=Player';
                }}
              />
              <div className="player-info-details">
                <h3>{selectedPlayer.player_name}</h3>
                <p>
                  <strong>Position:</strong>{' '}
                  {getPositionName(selectedPlayer.position_id)}
                </p>
                <p>
                  <strong>Club:</strong> {getTeamName(selectedPlayer.team_id)}
                </p>
                <p>
                  <strong>Nation:</strong>{' '}
                  <img
                    src={getNationFlag(selectedPlayer.nation_id)}
                    alt="Nationality"
                    className="player-nationality-flag"
                    style={{
                      width: '20px',
                      height: '15px',
                      marginLeft: '8px',
                      verticalAlign: 'middle',
                      borderRadius: '2px',
                    }}
                    onError={(e) => {
                      e.target.src =
                        'https://via.placeholder.com/20x15?text=Flag';
                    }}
                  />{' '}
                  {getNationName(selectedPlayer.nation_id)}
                </p>
              </div>
            </div>

            {/* Money Information Section */}
            <div className="money-information">
              <div className="player-cost-highlight">
                <span className="cost-label">Player Cost</span>
                <span className="cost-amount">
                  {formatValue(selectedPlayer.player_market_value)}
                </span>
              </div>
            </div>

            {purchaseError && (
              <div className="error-message">{purchaseError}</div>
            )}

            <div className="modal-actions">
              <button
                className="cancel-button"
                onClick={() => setShowPurchaseModal(false)}
              >
                Cancel
              </button>
              <HoldToPurchaseButton />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayerMarket;
