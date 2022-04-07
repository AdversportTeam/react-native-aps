import { AdSlot, validateAdSlot } from './AdSlot';

export interface AdLoaderOptions {
  slots: AdSlot[];
  slotGroupName?: string;
  customTargeting?: { [key: string]: string };
}

export function validateAdLoaderOptions(adLoaderOptions: AdLoaderOptions) {
  if (typeof adLoaderOptions !== 'object') {
    throw new Error("'adLoaderOptions' expected an object value");
  }
  if (!Array.isArray(adLoaderOptions.slots)) {
    throw new Error(
      "'adLoaderOptions.slots' expected an array of AdSlot values"
    );
  }
  adLoaderOptions.slots.forEach((adSlot, index) => {
    try {
      validateAdSlot(adSlot);
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(
          `'adLoaderOptions.slots[${index}]${e.message.substring(7)}`
        );
      }
    }
  });
}
