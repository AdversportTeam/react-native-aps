import { AdType } from './AdType';
/**
 * @public
 */
export interface AdLoaderOptions {
    /**
     * The slotUUID of the ad slot.
     */
    slotUUID: string;
    /**
     * The ad type of the ad slot. One of `AdType.BANNER`, `AdType.INTERSTITIAL`.
     */
    type: AdType;
    /**
     * The size of the banner ad slot. Required for banner ad slots.
     */
    size?: string;
    /**
     * The optional custom targeting key value pairs for the bid request.
     */
    customTargeting?: {
        [key: string]: string;
    };
}
/**
 * @internal
 */
export declare function validateAdLoaderOptions(adLoaderOptions: AdLoaderOptions): void;
