import type { AdSlot } from './AdSlot';

export interface AdLoaderOptions {
  slots: AdSlot[];
  slotGroupName?: string;
  customTargeting?: { [key: string]: string };
}
