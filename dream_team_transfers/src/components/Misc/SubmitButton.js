import styled from 'styled-components';
import { PREMIER_LEAGUE_TEAM_INFOS } from '../../constants/pl-team-infos';
import { darken } from 'polished';

export const getSubmitButton = () => {
  const SubmitButton = styled.button`
    background-color: ${(props) =>
      props.team !== null
        ? PREMIER_LEAGUE_TEAM_INFOS[props.team].primary_color
        : '#808080'};
    color: ${(props) =>
      props.team !== null
        ? PREMIER_LEAGUE_TEAM_INFOS[props.team].secondary_color
        : '#FFFFFF'};
    border: 10px solid
      ${(props) =>
        props.team !== null
          ? PREMIER_LEAGUE_TEAM_INFOS[props.team].third_color
          : '#5A5A5A'};
    width: min(100%, 28rem);
    min-height: clamp(4.25rem, 9vh, 6.5rem);
    padding: clamp(0.75rem, 1.5vh, 1.25rem) clamp(1rem, 2vw, 2rem);
    border-radius: 20px;
    font-family: 'Saira Condensed', sans-serif;
    font-weight: 900;
    letter-spacing: 4px;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      color 0.3s ease,
      border-color 0.3s ease;

    /* Styles for laptops and larger screens */
    @media screen and (min-width: 1024px) {
      font-size: clamp(1.2rem, 1.5vw, 1.75rem);
    }

    /* Styles for phones and tablets in landscape mode */
    @media screen and (max-width: 1023px) and (orientation: landscape) {
      font-size: clamp(1rem, 2vw, 1.35rem);
    }

    /* Styles for phones and tablets in portrait mode */
    @media screen and (max-width: 1023px) and (orientation: portrait) {
      font-size: clamp(1rem, 4vw, 1.35rem);
    }

    &:hover {
      background-color: ${(props) =>
        darken(
          0.1,
          props.team !== null
            ? PREMIER_LEAGUE_TEAM_INFOS[props.team].primary_color
            : '#808080'
        )};
      color: ${(props) =>
        darken(
          0.1,
          props.team !== null
            ? PREMIER_LEAGUE_TEAM_INFOS[props.team].secondary_color
            : '#FFFFFF'
        )};
      border-color: ${(props) =>
        darken(
          0.1,
          props.team !== null
            ? PREMIER_LEAGUE_TEAM_INFOS[props.team].third_color
            : '#5A5A5A'
        )};
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;

  return SubmitButton;
};
