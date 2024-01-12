export const CURRENCY_UNIT = '€';

export const getCurrencyDenomination = (amount) => {
    return amount > 1000000000 ? 'Billion' : 'Million';
}

export const getCurrencyRounded = (amount) => {
    if(amount > 1000000000) {
        return Math.round(amount / 1000000000 * 100) / 100;
    } else {
        return Math.round(amount / 1000000);
    }
}
