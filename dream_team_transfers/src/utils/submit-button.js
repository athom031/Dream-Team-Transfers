import styled from 'styled-components';
import { PREMIER_LEAGUE_TEAM_INFOS } from '../constants/pl-team-infos';
import { darken } from 'polished';

export const getSubmitButton = () => {
    const SubmitButton = styled.button`
  background-color: ${props => props.team !== null ? PREMIER_LEAGUE_TEAM_INFOS[props.team].primary_color : '#808080'};
  color: ${props => props.team !== null ? PREMIER_LEAGUE_TEAM_INFOS[props.team].secondary_color : '#FFFFFF'};
  border: 10px solid ${props => props.team !== null ? PREMIER_LEAGUE_TEAM_INFOS[props.team].third_color : '#5A5A5A'};
  padding: 20px 40px;
  border-radius: 20px;
  font-size: 1.75em;
  font-family: 'Saira Condensed', sans-serif;
  font-weight: 900;
  letter-spacing: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;

  &:hover {
    background-color: ${props => darken(0.1, props.team !== null ? PREMIER_LEAGUE_TEAM_INFOS[props.team].primary_color : '#808080')};
    color: ${props => darken(0.1, props.team !== null ? PREMIER_LEAGUE_TEAM_INFOS[props.team].secondary_color : '#FFFFFF')};
    border-color: ${props => darken(0.1, props.team !== null ? PREMIER_LEAGUE_TEAM_INFOS[props.team].third_color : '#5A5A5A')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

  return SubmitButton;
}
