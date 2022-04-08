import { AdNetworkInfo } from './types/AdNetworkInfo';
import { MRAIDPolicy } from './types/MRAIDPolicy';
export declare class APSAds {
    protected static _nativeModule: import("./turbomodules/NativeRNAPSAdsModule").AdsModuleSpec;
    static initialize(appKey: string): Promise<void>;
    static setAdNetworkInfo(adNetworkInfo: AdNetworkInfo): void;
    static setMRAIDSupportedVersions(versions: string[]): void;
    static setMRAIDPolicy(policy: MRAIDPolicy): void;
    static setTestMode(enabled: boolean): void;
    static setUseGeoLocation(enabled: boolean): void;
    static addCustomAttribute(key: string, value: string): void;
    static removeCustomAttribute(key: string): void;
}
