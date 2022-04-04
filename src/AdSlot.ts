import type { AdType } from './AdType';

export interface AdSlot {
  slotUUID: string;
  type: AdType;
  size?: string;
}
