import { AdSlot } from './AdSlot';
export interface AdLoaderOptions {
    slots: AdSlot[];
    slotGroupName?: string;
    customTargeting?: {
        [key: string]: string;
    };
}
export declare function validateAdLoaderOptions(adLoaderOptions: AdLoaderOptions): void;
