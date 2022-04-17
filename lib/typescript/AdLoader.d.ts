import { AdLoaderOptions } from './types/AdLoaderOptions';
/**
 * @public
 */
export declare class AdLoader {
    private static _nativeModule;
    /**
     * Request APS for a bid. Only a single ad size and slotUUID is supported per bid request.
     * @param adLoaderOptions - `AdLoaderOptions` object used to configure the bid request.
     * @returns Key value pairs of returned bid response.
     *
     * @public
     */
    static loadAd(adLoaderOptions: AdLoaderOptions): Promise<{
        [key: string]: string;
    }>;
}
