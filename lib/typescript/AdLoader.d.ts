import { AdLoaderOptions } from './types/AdLoaderOptions';
export declare class AdLoader {
    protected static _nativeModule: import("./turbomodules/NativeRNAPSAdLoaderModule").AdLoaderModuleSpec;
    /**
     * Request APS for a bid. Only a single ad size and slotUUID is supported per bid request.
     * @param adLoaderOptions `AdLoaderOptions` object used to configure the bid request.
     * @returns Key value pairs of returned bid response.
     */
    static loadAd(adLoaderOptions: AdLoaderOptions): Promise<{
        [key: string]: string;
    }>;
}
