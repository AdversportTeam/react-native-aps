import { AdNetworkInfo } from './types/AdNetworkInfo';
export default class APSAds {
    protected static _nativeModule: import("./turbomodules/NativeRNAPSAdsModule").AdsModuleSpec;
    static initialize(appKey: string): Promise<void>;
    static setAdNetworkInfo(adNetworkInfo: AdNetworkInfo): void;
    static setTestMode(enabled: boolean): void;
    static setUseGeoLocation(enabled: boolean): void;
    static addCustomAttribute(key: string, value: string): void;
    static removeCustomAttribute(key: string): void;
}
