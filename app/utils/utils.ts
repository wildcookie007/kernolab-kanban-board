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

