export function getSeason(): string {
    const date: Date = new Date();
    // 0 = January, 11 = December
    const month: number = date.getMonth();
    const day: number = date.getDate();

    if ((month === 11 && day >= 21) || month === 0 || month === 1) {
        return 'winter';
    }
    if ((month === 2 && day >= 20) || month >= 3 && month <= 4) {
        return 'spring';
    }
    if ((month === 5 && day >= 21) || month >= 6 && month <= 7) {
        return 'summer';
    }
    if ((month === 8 && day >= 23) || month >= 9 && month <= 10 || (month === 11 && day < 21)) {
        return 'autumn';
    }
    // Should never reach this point, however, if we do, return "any season" so we still get a result
    console.error('Error: Could not determine season');
    return 'Any season';
}