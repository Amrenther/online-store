/** Format a rupee amount (decimal number) for display. */
export function formatInr(amountRupee: number): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amountRupee);
}

/** Format integer paise stored in the database. */
export function formatInrPaise(paise: number): string {
    return formatInr(paise / 100);
}
