/**
 * @public
 */
export declare const MRAIDPolicy: {
    readonly NONE: "NONE";
    readonly DFP: "DFP";
    readonly CUSTOM: "CUSTOM";
};
/**
 * @public
 */
export declare type MRAIDPolicy = typeof MRAIDPolicy[keyof typeof MRAIDPolicy];
/**
 * @internal
 */
export declare function isMRAIDPolicy(value: any): value is MRAIDPolicy;
