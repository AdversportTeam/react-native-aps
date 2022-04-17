/**
 * @public
 */
export declare const AdType: {
    readonly BANNER: "banner";
    readonly INTERSTITIAL: "interstitial";
};
/**
 * @public
 */
export declare type AdType = typeof AdType[keyof typeof AdType];
/**
 * @internal
 */
export declare function isAdType(value: any): value is AdType;
