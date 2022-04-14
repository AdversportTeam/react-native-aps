export declare class AdError extends Error {
    readonly code: string;
    constructor(code: string, message: string);
    static fromNativeError(error: any): AdError;
}
/**
 * Type guard for AdError.
 * @param error Uknown error object
 * @returns Whether the error is an AdError
 */
export declare function isAdError(error: unknown): error is AdError;
