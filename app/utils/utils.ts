/**
 * Joins all strings by space delimiter
 * 
 * @param args String names
 * @returns {string} - joined class names
 */
export function jClass(...args: string[]): string {
    return args.map((arg) => arg || undefined).join(' ');
}

export const KEY_ENTER = 13;
export const KEY_ESCAPE = 27;

export const FORMAT_DATETIME = 'YYYY MMM D - h:mm A';
export const TIME_UNIX_MATCH = 1_000;
