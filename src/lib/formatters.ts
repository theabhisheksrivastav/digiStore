const CURRENCY_FORMATTER = new Intl.NumberFormat('en-IN', { currency: 'INR', style: 'currency', minimumFractionDigits: 2 });

export function formatCurrency(amount: number): string {
    return CURRENCY_FORMATTER.format(amount);
}

const NUMBER_FORMATTER = new Intl.NumberFormat('en-IN');

export function formatNumber(amount: number): string {
    return NUMBER_FORMATTER.format(amount);
}
