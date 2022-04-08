export declare const MRAIDPolicy: {
    readonly NONE: "NONE";
    readonly AUTO_DETECT: "AUTO_DETECT";
    readonly DFP: "DFP";
    readonly CUSTOM: "CUSTOM";
};
export declare type MRAIDPolicy = typeof MRAIDPolicy[keyof typeof MRAIDPolicy];
export declare function isMRAIDPolicy(value: any): value is MRAIDPolicy;
