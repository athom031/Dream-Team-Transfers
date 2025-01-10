export const CURRENCY_UNIT = '€';

export const getCurrencyDenomination = (amount) => {
  if (amount >= 1000000000000) {
    return 'Trillion';
  } else if (amount >= 1000000000) {
    return 'Billion';
  } else if (amount >= 1000000) {
    return 'Million';
  } else if (amount >= 1000) {
    return 'Thousand';
  } else {
    return '';
  }
};

export const getCurrencyDenominationShort = (amount) => {
  if (amount >= 1000000000000) {
    return 'T';
  } else if (amount >= 1000000000) {
    return 'B';
  } else if (amount >= 1000000) {
    return 'M';
  } else if (amount >= 1000) {
    return 'K';
  } else {
    return '';
  }
};

export const getCurrencyRounded = (amount) => {
  if (amount >= 1000000000000) {
    return Math.round(amount / 1000000000000);
  } else if (amount >= 1000000000) {
    return Math.round(amount / 1000000000);
  } else if (amount >= 1000000) {
    return Math.round(amount / 1000000);
  } else if (amount >= 1000) {
    return Math.round(amount / 1000);
  } else {
    return amount;
  }
};
