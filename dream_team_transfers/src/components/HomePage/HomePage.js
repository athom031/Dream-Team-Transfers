import React, { useEffect, useState } from 'react';

import { PREMIER_LEAGUE_TEAM_INFOS } from '../../constants/pl-team-infos';
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
      setTeamIndex(19);
    } else {
      setTeamIndex((teamIndex + 19) /* -1 + 20 */ % 20);
    }
  };

  // Team Picker Right Button
  const handleRightClick = () => {
    if (teamIndex === null) {
      setTeamIndex(0);
    } else {
      setTeamIndex((teamIndex + 1) % 20);
    }
  };

  // Handles Submission of Team Selection
  const handleSubmit = () => {
    setTeamSubmitted(selectedTeam);
  };

  return (
    // if team is submitted show Loading Screen
    // after 4 seconds submit team info to DB
    teamSubmitted !== null ? (
      <Loading />
    ) : (
      <div className="home-page">
        {/* HOME PAGE TITLE */}
        <h1 className="title">DREAM TEAM TRANSFERS</h1>

        <div className="home-page-content">
          <div className="intro-and-selection">
            {/* CONCEPT DIV */}
            <div className="concept">
              {/* BUY PLAYERS */}
              <div className="concept-container">
                <div className="concept-icon-container">
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      '/assets/concept-intro-icons/european-soccer.png'
                    }
                    alt="buy players"
                    className="concept-icon"
                  />
                </div>
                <h2 className="concept-text">
                  1.
                  <br />
                  Buy Hidden Gems Across Europe!
                </h2>
              </div>

              {/* SELL PLAYERS */}
              <div className="concept-container">
                <div className="concept-icon-container">
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      '/assets/concept-intro-icons/sell-players.png'
                    }
                    alt="sell players"
                    className="concept-icon"
                  />
                </div>
                <h2 className="concept-text">
                  2.
                  <br />
                  Sell Unwanted Players!
                </h2>
              </div>

              {/* BUILD DREAM TEAM */}
              <div className="concept-container">
                <div className="concept-icon-container">
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      '/assets/concept-intro-icons/team-build.png'
                    }
                    alt="build team"
                    className="concept-icon"
                  />
                </div>
                <h2 className="concept-text">
                  3.
                  <br />
                  Build Your Dream Team!
                </h2>
              </div>
            </div>

            {/* TEAM SELECTOR */}
            <div className="team-selector">
              <div className="team-selection-padding">
                <div className="team-selection-background">
                  <div className="team-picker">
                    {/* LEFT ARROW */}
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/team-picker-arrows/left${isHoveredLeft ? '-hover' : ''}.png`}
                      onMouseEnter={() => setIsHoveredLeft(true)}
                      onMouseLeave={() => setIsHoveredLeft(false)}
                      onClick={handleLeftClick}
                      className="arrow-button"
                      alt="left arrow"
                    />

                    {/* TEAM PICKER ICON */}
                    <div className="logo-container">
                      <img
                        src={
                          teamIndex !== null
                            ? PREMIER_LEAGUE_TEAM_INFOS[teamIndex].logo
                            : DREAM_TEAM_LOGO
                        }
                        className="team-logo"
                        alt={
                          teamIndex !== null
                            ? PREMIER_LEAGUE_TEAM_INFOS[teamIndex].alias +
                              ' logo'
                            : 'Dream Team Transfers Logo'
                        }
                      />
                    </div>

                    {/* RIGHT ARROW */}
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/team-picker-arrows/right${isHoveredRight ? '-hover' : ''}.png`}
                      onMouseEnter={() => setIsHoveredRight(true)}
                      onMouseLeave={() => setIsHoveredRight(false)}
                      onClick={handleRightClick}
                      className="arrow-button"
                      alt="right arrow"
                    />
                  </div>

                  {/* TEAM PICKER NAME */}
                  <div className="team-name">
                    <h1>
                      {teamIndex !== null
                        ? PREMIER_LEAGUE_TEAM_INFOS[teamIndex].alias
                        : 'Select a Team'}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="selected-team-information">
            {/* SLIDESHOW */}
            <div className="home-page-slideshow">
              <Slideshow selectedTeam={selectedTeam} />
            </div>

            {/* TEAM SUMMARY */}
            <div className="team-summary">
              {/* TEAM VALUE */}
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

              {/* TEAM BUDGET */}
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

            {/* SUBMIT BUTTON */}
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
          </div>
        </div>
      </div>
    )
  );
}

export default HomePage;
