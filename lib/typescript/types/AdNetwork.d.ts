/**
 * @public
 */
export declare const AdNetwork: {
    readonly GOOGLE_AD_MANAGER: "GOOGLE_AD_MANAGER";
    readonly ADMOB: "ADMOB";
    readonly AD_GENERATION: "AD_GENERATION";
    readonly IRON_SOURCE: "IRON_SOURCE";
    readonly MAX: "MAX";
    readonly NIMBUS: "NIMBUS";
    readonly OTHER: "OTHER";
};
/**
 * @public
 */
export declare type AdNetwork = typeof AdNetwork[keyof typeof AdNetwork];
/**
 * @internal
 */
export declare function isAdNetwork(value: any): value is AdNetwork;
