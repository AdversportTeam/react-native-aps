export declare const AdType: {
    readonly BANNER: "banner";
    readonly INTERSTITIAL: "interstitial";
};
export declare type AdType = typeof AdType[keyof typeof AdType];
export declare function isAdType(value: any): value is AdType;
