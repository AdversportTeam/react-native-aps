/**
 * AdError class
 *
 * @public
 */
export declare class AdError extends Error {
    readonly code: string;
    /**
     * @internal
     */
    constructor(code: string, message: string);
    /**
     * @internal
     */
    static fromNativeError(error: any): AdError;
}
/**
 * Type guard for AdError.
 * @param error - Uknown error object
 * @returns Whether the error is an AdError
 *
 * @public
 */
export declare function isAdError(error: unknown): error is AdError;
