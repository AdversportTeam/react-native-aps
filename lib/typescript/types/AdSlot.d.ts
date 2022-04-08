import { AdType } from './AdType';
export interface AdSlot {
    slotUUID: string;
    type: AdType;
    size?: string;
}
export declare function validateAdSlot(adSlot: AdSlot): void;
