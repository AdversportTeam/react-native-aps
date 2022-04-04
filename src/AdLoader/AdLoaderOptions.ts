import type { AdSlot } from '../AdSlot';

export interface AdLoaderOptions {
  slots: AdSlot[];
  slotGroupName?: string;
  customTargets?: { [key: string]: string };
}
