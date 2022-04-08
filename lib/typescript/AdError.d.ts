export declare class AdError extends Error {
    readonly code: string;
    constructor(code: string, message: string);
    static fromNativeError(error: any): AdError;
}
export declare function isAdError(error: unknown): error is AdError;
