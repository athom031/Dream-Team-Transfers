import React, { useEffect, useState } from 'react';

import {
  PREMIER_LEAGUE_TEAM_COUNT,
  PREMIER_LEAGUE_TEAM_INFOS,
} from '../../constants/pl-team-infos';
import {
  CURRENCY_UNIT,
  getCurrencyDenomination,
  getCurrencyRounded,
} from '../../utils/money-utils';
import { selectTeam } from '../../db/db-utils';
import { getSubmitButton } from '../Misc/SubmitButton';
import Loading from '../Misc/Loading';
import Slideshow from '../Misc/Slideshow';

import './HomePage.css';

function HomePage() {
  const [teamIndex, setTeamIndex] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isHoveredLeft, setIsHoveredLeft] = useState(false);
  const [isHoveredRight, setIsHoveredRight] = useState(false);
  const [teamSubmitted, setTeamSubmitted] = useState(null);

  const DREAM_TEAM_LOGO = process.env.PUBLIC_URL + '/logo512.png';

  const SubmitButton = getSubmitButton();

  // used to buffer team selection, waiting half a second
  useEffect(() => {
    // set a new timeout to track how long user stays on team selected
    const timeoutId = setTimeout(() => {
      setSelectedTeam(teamIndex);
    }, 500); // half a second

    // Clear the timeout when the component unmounts or when teamIndex changes
    return () => {
      clearTimeout(timeoutId);
    };
  }, [teamIndex]);

  // once team is selected, show loading screen for 4 seconds
  useEffect(() => {
    if (teamSubmitted !== null) {
      const timer = setTimeout(() => {
        selectTeam(teamSubmitted).then(() => {
          window.location.reload();
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [teamSubmitted]);

  // Team Picker Left Button
  const handleLeftClick = () => {
    if (teamIndex === null) {
      setTeamIndex(PREMIER_LEAGUE_TEAM_COUNT - 1);
    } else {
      setTeamIndex(
        (teamIndex + PREMIER_LEAGUE_TEAM_COUNT - 1) % PREMIER_LEAGUE_TEAM_COUNT
      );
    }
  };

  // Team Picker Right Button
  const handleRightClick = () => {
    if (teamIndex === null) {
      setTeamIndex(0);
    } else {
      setTeamIndex((teamIndex + 1) % PREMIER_LEAGUE_TEAM_COUNT);
    }
  };

  // Handles Submission of Team Selection
  const handleSubmit = () => {
    setTeamSubmitted(selectedTeam);
  };

  const selectedTeamInfo =
    selectedTeam !== null ? PREMIER_LEAGUE_TEAM_INFOS[selectedTeam] : null;
  const activeTeamInfo =
    teamIndex !== null ? PREMIER_LEAGUE_TEAM_INFOS[teamIndex] : null;

  return (
    // if team is submitted show Loading Screen
    // after 4 seconds submit team info to DB
    teamSubmitted !== null ? (
      <Loading />
    ) : (
      <div className="home-page">
        <div className="home-page-content">
          <section className="landing-panel landing-panel-primary">
            <div className="landing-title-block">
              <img
                src={DREAM_TEAM_LOGO}
                alt=""
                className="landing-logo-mark"
                aria-hidden="true"
              />
              <div>
                <h1 className="title">Dream Team Transfers</h1>
                <p>
                  Pick a Premier League club, sell smart, and rebuild the squad
                  with talent from across Europe.
                </p>
              </div>
            </div>

            <div
              className="concept"
              aria-label="How Dream Team Transfers works"
            >
              <div className="concept-container">
                <span className="concept-number">1</span>
                <div className="concept-icon-container" aria-hidden="true">
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      '/assets/concept-intro-icons/european-soccer.png'
                    }
                    alt="buy players"
                    className="concept-icon"
                  />
                </div>
                <h2 className="concept-text">Buy hidden gems</h2>
              </div>

              <div className="concept-container">
                <span className="concept-number">2</span>
                <div className="concept-icon-container" aria-hidden="true">
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      '/assets/concept-intro-icons/sell-players.png'
                    }
                    alt="sell players"
                    className="concept-icon"
                  />
                </div>
                <h2 className="concept-text">Sell unwanted players</h2>
              </div>

              <div className="concept-container">
                <span className="concept-number">3</span>
                <div className="concept-icon-container" aria-hidden="true">
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      '/assets/concept-intro-icons/team-build.png'
                    }
                    alt="build team"
                    className="concept-icon"
                  />
                </div>
                <h2 className="concept-text">Build your XI</h2>
              </div>
            </div>

            <div className="team-selector">
              <div className="team-selection-background">
                <div className="team-picker-header">
                  <span>Choose Club</span>
                  <strong>
                    {activeTeamInfo ? activeTeamInfo.nickname : 'New Save'}
                  </strong>
                </div>

                <div className="team-picker">
                  <button
                    type="button"
                    className="team-arrow-button"
                    onMouseEnter={() => setIsHoveredLeft(true)}
                    onMouseLeave={() => setIsHoveredLeft(false)}
                    onClick={handleLeftClick}
                    aria-label="Previous team"
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/team-picker-arrows/left${isHoveredLeft ? '-hover' : ''}.png`}
                      className="arrow-button"
                      alt=""
                    />
                  </button>

                  <div className="logo-container">
                    <img
                      src={
                        activeTeamInfo !== null && activeTeamInfo !== undefined
                          ? activeTeamInfo.logo
                          : DREAM_TEAM_LOGO
                      }
                      className="team-logo"
                      alt={
                        activeTeamInfo
                          ? `${activeTeamInfo.alias} logo`
                          : 'Dream Team Transfers Logo'
                      }
                    />
                  </div>

                  <button
                    type="button"
                    className="team-arrow-button"
                    onMouseEnter={() => setIsHoveredRight(true)}
                    onMouseLeave={() => setIsHoveredRight(false)}
                    onClick={handleRightClick}
                    aria-label="Next team"
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/team-picker-arrows/right${isHoveredRight ? '-hover' : ''}.png`}
                      className="arrow-button"
                      alt=""
                    />
                  </button>
                </div>

                <div className="team-name">
                  <h2>
                    {activeTeamInfo
                      ? activeTeamInfo.alias
                      : 'Select a Premier League club'}
                  </h2>
                  <p>
                    {activeTeamInfo
                      ? `${activeTeamInfo.name} • ${activeTeamInfo.nickname}`
                      : 'Cycle through the league and choose who you want to rebuild.'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="landing-panel selected-team-information">
            <div className="home-page-slideshow">
              <Slideshow selectedTeam={selectedTeam} />
              <div className="slideshow-caption">
                {selectedTeamInfo
                  ? selectedTeamInfo.alias
                  : 'Premier League Rebuild'}
              </div>
            </div>

            <div className="team-summary">
              <div className="team-value">
                <div className="category">Value</div>
                <div className="money">
                  {CURRENCY_UNIT}{' '}
                  {selectedTeam !== null
                    ? getCurrencyRounded(
                        PREMIER_LEAGUE_TEAM_INFOS[selectedTeam].team_value
                      )
                    : '?'}
                </div>

                <div className="unit">
                  {selectedTeam !== null
                    ? getCurrencyDenomination(
                        PREMIER_LEAGUE_TEAM_INFOS[selectedTeam].team_value
                      )
                    : ''}
                </div>
              </div>

              <div className="team-budget">
                <div className="category">Budget</div>
                <div className="money">
                  {CURRENCY_UNIT}{' '}
                  {selectedTeam !== null
                    ? getCurrencyRounded(
                        PREMIER_LEAGUE_TEAM_INFOS[selectedTeam].team_budget
                      )
                    : '?'}
                </div>

                <div className="unit">
                  {selectedTeam !== null
                    ? getCurrencyDenomination(
                        PREMIER_LEAGUE_TEAM_INFOS[selectedTeam].team_budget
                      )
                    : ''}
                </div>
              </div>
            </div>

            <div className="submit-button">
              <SubmitButton
                team={selectedTeam}
                disabled={selectedTeam === null}
                onClick={handleSubmit}
              >
                {selectedTeam !== null
                  ? `Dream the Perfect ${PREMIER_LEAGUE_TEAM_INFOS[selectedTeam].alias}!`
                  : 'Please Pick a Team'}
              </SubmitButton>
            </div>
          </section>
        </div>
      </div>
    )
  );
}

export default HomePage;
