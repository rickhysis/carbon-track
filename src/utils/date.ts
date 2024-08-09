export const MONTH_LABEL: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nop', 'Dec'];

export function getCurrentYear(date: Date = new Date()): number {
    return date.getFullYear();
}

export function getMonthName(index: number): string {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    if (index < 0 || index > 11) {
        throw new Error('Invalid month index. It should be between 0 and 11.');
    }

    return months[index];
}