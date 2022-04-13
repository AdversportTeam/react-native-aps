import { AdType } from './AdType';
export interface AdLoaderOptions {
    slotUUID: string;
    type: AdType;
    size?: string;
    customTargeting?: {
        [key: string]: string;
    };
}
export declare function validateAdLoaderOptions(adLoaderOptions: AdLoaderOptions): void;
