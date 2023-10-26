function roundNumber(number, decimalPlaces) {
    const multiplier = Math.pow(10, decimalPlaces);
    const roundedNumber = Math.round(number * multiplier) / multiplier;
    return roundedNumber;
}

export default roundNumber;