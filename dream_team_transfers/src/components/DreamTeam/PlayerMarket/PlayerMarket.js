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

  // Modal states for modern filters
  const [showLeagueModal, setShowLeagueModal] = useState(false);
  const [showClubModal, setShowClubModal] = useState(false);
  const [showNationModal, setShowNationModal] = useState(false);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [positionSelectionStep, setPositionSelectionStep] = useState('groups'); // 'groups' or 'positions'
  const [selectedPositionGroup, setSelectedPositionGroup] = useState(null);

  // Search states for modals
  const [leagueSearch, setLeagueSearch] = useState('');
  const [clubSearch, setClubSearch] = useState('');
  const [nationSearch, setNationSearch] = useState('');
  const [positionSearch, setPositionSearch] = useState('');

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
          (player) => player.league_id == filters.league
        );
        const nationIds = [
          ...new Set(leaguePlayers.map((player) => player.nation_id)),
        ];
        return (
          nationIds.includes(nation.nation_id) &&
          nation.nation_id == filters.nation
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
      if (filters.position.startsWith('group:')) {
        // Handle position group filtering
        const groupName = filters.position.replace('group:', '');
        const groupPositions = getPositionsByGroup(groupName).map((p) => p.id);
        filtered = filtered.filter((player) =>
          groupPositions.includes(parseInt(player.position_id))
        );
      } else {
        // Handle specific position filtering
        filtered = filtered.filter(
          (player) =>
            parseInt(player.position_id) === parseInt(filters.position)
        );
      }
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
        (player) => player.nation_id == filters.nation
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
      5: 'DM',
      6: 'LM',
      7: 'RM',
      8: 'AM',
      9: 'LW',
      10: 'RW',
      11: 'CF',
      12: 'SS',
      13: 'ST',
    };
    return positions[positionId] || 'Unknown';
  };

  const getTeamName = (teamId) => {
    const team = teams.find((t) => t.team_id === teamId);
    return team ? team.team_name : 'Unknown Team';
  };

  const getNationFlag = (nationId) => {
    const nation = nations.find((n) => n.nation_id == nationId);
    return nation
      ? nation.nation_flag_small_pic
      : 'https://via.placeholder.com/20x15?text=Flag';
  };

  const getNationName = (nationId) => {
    const nation = nations.find((n) => n.nation_id == nationId);
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

  // Helper functions for modals
  const getLeagueData = () => {
    const leagues = [
      {
        id: 0,
        name: 'Premier League',
        logo: 'https://tmssl.akamaized.net/images/logo/small/gb1.png?lm=1521104656',
      },
      {
        id: 1,
        name: 'Championship',
        logo: 'https://tmssl.akamaized.net/images/logo/small/gb2.png?lm=1643026970',
      },
      {
        id: 2,
        name: 'La Liga',
        logo: 'https://tmssl.akamaized.net/images/logo/small/es1.png?lm=1557051003',
      },
      {
        id: 3,
        name: 'Bundesliga',
        logo: 'https://tmssl.akamaized.net/images/logo/small/l1.png?lm=1525905518',
      },
      {
        id: 4,
        name: 'Serie A',
        logo: 'https://tmssl.akamaized.net/images/logo/small/it1.png?lm=1656073460',
      },
      {
        id: 5,
        name: 'Ligue One',
        logo: 'https://tmssl.akamaized.net/images/logo/small/fr1.png?lm=1648360140',
      },
      {
        id: 6,
        name: 'Liga Portugal',
        logo: 'https://tmssl.akamaized.net/images/logo/small/po1.png?lm=1626110146',
      },
      {
        id: 7,
        name: 'Eredivisie',
        logo: 'https://tmssl.akamaized.net/images/logo/small/nl1.png?lm=1674743474',
      },
    ];
    return leagues.filter((league) =>
      league.name.toLowerCase().includes(leagueSearch.toLowerCase())
    );
  };

  const getPositionData = () => {
    const positions = [
      { id: 0, name: 'Goalkeeper', acronym: 'GK', group: 'Goalkeeper' },
      { id: 1, name: 'Centre-Back', acronym: 'CB', group: 'Defender' },
      { id: 2, name: 'Left-Back', acronym: 'LB', group: 'Defender' },
      { id: 3, name: 'Right-Back', acronym: 'RB', group: 'Defender' },
      { id: 4, name: 'Central Midfielder', acronym: 'CM', group: 'Midfielder' },
      {
        id: 5,
        name: 'Defensive Midfielder',
        acronym: 'DM',
        group: 'Midfielder',
      },
      { id: 6, name: 'Left Midfielder', acronym: 'LM', group: 'Midfielder' },
      { id: 7, name: 'Right Midfielder', acronym: 'RM', group: 'Midfielder' },
      {
        id: 8,
        name: 'Attacking Midfielder',
        acronym: 'AM',
        group: 'Midfielder',
      },
      { id: 9, name: 'Left Winger', acronym: 'LW', group: 'Attacker' },
      { id: 10, name: 'Right Winger', acronym: 'RW', group: 'Attacker' },
      { id: 11, name: 'Centre-Forward', acronym: 'CF', group: 'Attacker' },
      { id: 12, name: 'Second Striker', acronym: 'SS', group: 'Attacker' },
      { id: 13, name: 'Striker', acronym: 'ST', group: 'Attacker' },
    ];
    return positions.filter(
      (position) =>
        position.name.toLowerCase().includes(positionSearch.toLowerCase()) ||
        position.acronym.toLowerCase().includes(positionSearch.toLowerCase())
    );
  };

  const getPositionGroups = () => {
    const groups = [
      { name: 'Goalkeeper', icon: '🥅', count: 1 },
      { name: 'Defender', icon: '🛡️', count: 3 },
      { name: 'Midfielder', icon: '⚽', count: 5 },
      { name: 'Attacker', icon: '⚡', count: 5 },
    ];
    return groups;
  };

  const getPositionsByGroup = (groupName) => {
    return getPositionData().filter((position) => position.group === groupName);
  };

  const getFilteredClubs = () => {
    let clubs = availableClubs;
    if (clubSearch) {
      clubs = clubs.filter((team) =>
        team.team_name.toLowerCase().includes(clubSearch.toLowerCase())
      );
    }
    return clubs;
  };

  const getFilteredNations = () => {
    let nationsList = availableNations;
    if (nationSearch) {
      nationsList = nationsList.filter((nation) =>
        nation.nation_name.toLowerCase().includes(nationSearch.toLowerCase())
      );
    }
    return nationsList;
  };

  const clearAllFilters = () => {
    setFilters({
      name: '',
      position: '',
      league: '',
      club: '',
      nation: '',
      minValue: '',
      maxValue: '',
    });
    setCurrentPage(1);
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

        <div className="modern-filters">
          {/* Row 1: Player Name + Clear Filters */}
          <div className="filter-item filter-name">
            <input
              type="text"
              placeholder="Player name..."
              value={filters.name}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, name: e.target.value }))
              }
              className="filter-input"
            />
          </div>
          <div className="filter-item filter-clear">
            <button className="clear-filters-button" onClick={clearAllFilters}>
              Clear All
            </button>
          </div>

          {/* Row 2: All Leagues + All Clubs */}
          <div className="filter-item">
            <button
              className="filter-button"
              onClick={() => setShowLeagueModal(true)}
            >
              <span>
                {filters.league ? getLeagueName(filters.league) : 'All Leagues'}
              </span>
              <img
                src="/assets/team-picker-arrows/right.png"
                alt=">"
                className="filter-chevron"
              />
            </button>
          </div>
          <div className="filter-item">
            <button
              className="filter-button"
              onClick={() => setShowClubModal(true)}
              disabled={!filters.league}
            >
              <span>
                {!filters.league
                  ? 'Pick your League first!'
                  : filters.club
                    ? getTeamName(filters.club)
                    : 'All Clubs'}
              </span>
              <img
                src="/assets/team-picker-arrows/right.png"
                alt=">"
                className="filter-chevron"
              />
            </button>
          </div>

          {/* Row 3: All Nations + All Positions */}
          <div className="filter-item">
            <button
              className="filter-button"
              onClick={() => setShowNationModal(true)}
            >
              <span>
                {filters.nation ? getNationName(filters.nation) : 'All Nations'}
              </span>
              <img
                src="/assets/team-picker-arrows/right.png"
                alt=">"
                className="filter-chevron"
              />
            </button>
          </div>
          <div className="filter-item">
            <button
              className="filter-button"
              onClick={() => setShowPositionModal(true)}
            >
              <span>
                {filters.position
                  ? filters.position.startsWith('group:')
                    ? filters.position.replace('group:', '') + 's'
                    : getPositionData().find(
                        (p) => p.id == parseInt(filters.position)
                      )?.name
                  : 'All Positions'}
              </span>
              <img
                src="/assets/team-picker-arrows/right.png"
                alt=">"
                className="filter-chevron"
              />
            </button>
          </div>

          {/* Row 4: Min Value + Max Value */}
          <div className="filter-item">
            <input
              type="number"
              placeholder="Min value (€)"
              value={filters.minValue}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, minValue: e.target.value }))
              }
              className="filter-input"
            />
          </div>
          <div className="filter-item">
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
              <h2>Confirm Player Purchase</h2>
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

      {/* League Selection Modal */}
      {showLeagueModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowLeagueModal(false)}
        >
          <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Choose League</h3>
              <button
                className="close-button"
                onClick={() => setShowLeagueModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-search">
              <input
                type="text"
                placeholder="Search leagues..."
                value={leagueSearch}
                onChange={(e) => setLeagueSearch(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="modal-content">
              <div
                className="option-item"
                onClick={() => {
                  setFilters((prev) => ({
                    ...prev,
                    league: '',
                    club: '',
                    nation: '',
                  }));
                  setShowLeagueModal(false);
                  setLeagueSearch('');
                }}
              >
                <div className="option-info">
                  <span className="option-name">All Leagues</span>
                </div>
              </div>
              {getLeagueData().map((league) => (
                <div
                  key={league.id}
                  className="option-item"
                  onClick={() => {
                    setFilters((prev) => ({
                      ...prev,
                      league: league.id.toString(),
                      club: '',
                      nation: '',
                    }));
                    setShowLeagueModal(false);
                    setLeagueSearch('');
                  }}
                >
                  <div className="option-info">
                    <img
                      src={league.logo}
                      alt={league.name}
                      className="option-logo"
                    />
                    <span className="option-name">{league.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Club Selection Modal */}
      {showClubModal && (
        <div className="modal-overlay" onClick={() => setShowClubModal(false)}>
          <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Choose Club</h3>
              <button
                className="close-button"
                onClick={() => setShowClubModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-search">
              <input
                type="text"
                placeholder="Search clubs..."
                value={clubSearch}
                onChange={(e) => setClubSearch(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="modal-content">
              <div
                className="option-item"
                onClick={() => {
                  setFilters((prev) => ({ ...prev, club: '' }));
                  setShowClubModal(false);
                  setClubSearch('');
                }}
              >
                <div className="option-info">
                  <span className="option-name">All Clubs</span>
                </div>
              </div>
              {getFilteredClubs().map((team) => (
                <div
                  key={team.team_id}
                  className="option-item"
                  onClick={() => {
                    setFilters((prev) => ({
                      ...prev,
                      club: team.team_id.toString(),
                    }));
                    setShowClubModal(false);
                    setClubSearch('');
                  }}
                >
                  <div className="option-info">
                    <span className="option-name">{team.team_name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Nation Selection Modal */}
      {showNationModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowNationModal(false)}
        >
          <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Choose Nationality</h3>
              <button
                className="close-button"
                onClick={() => setShowNationModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-search">
              <input
                type="text"
                placeholder="Search nations..."
                value={nationSearch}
                onChange={(e) => setNationSearch(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="modal-content">
              <div
                className="option-item"
                onClick={() => {
                  setFilters((prev) => ({ ...prev, nation: '' }));
                  setShowNationModal(false);
                  setNationSearch('');
                }}
              >
                <div className="option-name">All Nations</div>
              </div>
              {getFilteredNations().map((nation) => (
                <div
                  key={nation.nation_id}
                  className="option-item"
                  onClick={() => {
                    setFilters((prev) => ({
                      ...prev,
                      nation: nation.nation_id.toString(),
                    }));
                    setShowNationModal(false);
                    setNationSearch('');
                  }}
                >
                  <div className="option-info">
                    <img
                      src={nation.nation_flag_small_pic}
                      alt={nation.nation_name}
                      className="option-flag"
                    />
                    <span className="option-name">{nation.nation_name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Position Selection Modal */}
      {showPositionModal && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowPositionModal(false);
            setPositionSelectionStep('groups');
            setSelectedPositionGroup(null);
          }}
        >
          <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {positionSelectionStep === 'groups'
                  ? 'Select Position Group'
                  : `Select ${selectedPositionGroup?.name} Position`}
              </h3>
              <button
                className="close-button"
                onClick={() => {
                  setShowPositionModal(false);
                  setPositionSelectionStep('groups');
                  setSelectedPositionGroup(null);
                }}
              >
                ×
              </button>
            </div>

            {/* Step 1: Position Groups Grid */}
            {positionSelectionStep === 'groups' && (
              <>
                <div className="modal-content">
                  <div
                    className="option-item"
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, position: '' }));
                      setShowPositionModal(false);
                      setPositionSelectionStep('groups');
                      setSelectedPositionGroup(null);
                    }}
                  >
                    <div className="option-name">All Positions</div>
                  </div>
                </div>

                <div className="position-groups-grid">
                  {getPositionGroups().map((group) => (
                    <div
                      key={group.name}
                      className="position-group-card"
                      onClick={() => {
                        setSelectedPositionGroup(group);
                        setPositionSelectionStep('positions');
                      }}
                    >
                      <div className="group-card-icon">{group.icon}</div>
                      <div className="group-card-name">{group.name}</div>
                      <div className="group-card-count">
                        {group.count} position{group.count > 1 ? 's' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Step 2: Specific Positions within Group */}
            {positionSelectionStep === 'positions' && selectedPositionGroup && (
              <>
                <div className="modal-content">
                  <div
                    className="option-item group-option"
                    onClick={() => {
                      setFilters((prev) => ({
                        ...prev,
                        position: `group:${selectedPositionGroup.name}`,
                      }));
                      setShowPositionModal(false);
                      setPositionSelectionStep('groups');
                      setSelectedPositionGroup(null);
                    }}
                  >
                    <div className="option-info">
                      <span className="option-name">
                        Any {selectedPositionGroup.name}
                      </span>
                      <span className="option-acronym">
                        (All {selectedPositionGroup.name}s)
                      </span>
                    </div>
                  </div>

                  {getPositionsByGroup(selectedPositionGroup.name).map(
                    (position) => (
                      <div
                        key={position.id}
                        className="option-item position-option"
                        onClick={() => {
                          setFilters((prev) => ({
                            ...prev,
                            position: position.id.toString(),
                          }));
                          setShowPositionModal(false);
                          setPositionSelectionStep('groups');
                          setSelectedPositionGroup(null);
                        }}
                      >
                        <div className="option-info">
                          <span className="option-name">{position.name}</span>
                          <span className="option-acronym">
                            ({position.acronym})
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="modal-footer">
                  <button
                    className="back-button"
                    onClick={() => {
                      setPositionSelectionStep('groups');
                      setSelectedPositionGroup(null);
                    }}
                  >
                    ← Back to Groups
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayerMarket;
