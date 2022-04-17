import { AdNetworkInfo } from './types/AdNetworkInfo';
import { MRAIDPolicy } from './types/MRAIDPolicy';
/**
 * @public
 */
export declare class APSAds {
    private static _nativeModule;
    /**
     * Initializes the APSAds SDK.
     * @param appKey - Generated APS app key from the APS portal
     *
     * @public
     */
    static initialize(appKey: string): Promise<void>;
    /**
     * Sets the primary ad server or mediator.
     * @param adNetworkInfo - `AdNetworkInfo` object containing the primary ad network and its properties
     *
     * @public
     */
    static setAdNetworkInfo(adNetworkInfo: AdNetworkInfo): void;
    /**
     * Sets the MRAID versions supported by user ad server.
     * @param versions - Array of supported versions
     *
     * @public
     */
    static setMRAIDSupportedVersions(versions: string[]): void;
    /**
     * Sets the MRAID policy.
     * @param policy - MRAIDPolicy value. `MRAIDPolicy.DFP` for Google Ad Manager and `MRAIDPolicy.CUSTOM` for other ad server / mediation.
     *
     * @public
     */
    static setMRAIDPolicy(policy: MRAIDPolicy): void;
    /**
     * Enable / disable the test mode for APSAds.
     * @param enabled - Whether to enable or disable the test mode.
     *
     * @public
     */
    static setTestMode(enabled: boolean): void;
    /**
     * Enable / disable the geo location tracking for APSAds.
     * @param enabled - Whether to enable or disable the geo location tracking.
     *
     * @public
     */
    static setUseGeoLocation(enabled: boolean): void;
    /**
     * Adds a custom attribute to the APSAds SDK.
     * @param key - The key of the custom attribute
     * @param value - The value of the custom attribute
     *
     * @public
     */
    static addCustomAttribute(key: string, value: string): void;
    /**
     * Removes a custom attribute from the APSAds SDK.
     * @param key - The key of the custom attribute
     *
     * @public
     */
    static removeCustomAttribute(key: string): void;
}
