import { AdLoaderOptions } from './types/AdLoaderOptions';
export declare class AdLoader {
    protected static _nativeModule: import("./turbomodules/NativeRNAPSAdLoaderModule").AdLoaderModuleSpec;
    static loadAd(adLoaderOptions: AdLoaderOptions): Promise<{
        [key: string]: string;
    }>;
}
