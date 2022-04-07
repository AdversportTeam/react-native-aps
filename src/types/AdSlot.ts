import { AdType, isAdType } from './AdType';

export interface AdSlot {
  slotUUID: string;
  type: AdType;
  size?: string;
}

const sizeRegex = /([0-9]+)x([0-9]+)/;

export function validateAdSlot(adSlot: AdSlot) {
  if (typeof adSlot !== 'object') {
    throw new Error("'adSlot' expected an object value");
  }
  if (typeof adSlot.slotUUID !== 'string') {
    throw new Error("'adSlot.slotUUID' expected a string value");
  }
  if (!isAdType(adSlot.type)) {
    throw new Error("'adSlot.type' expected one of AdType values");
  }
  if (
    adSlot.type === AdType.BANNER &&
    (!adSlot.size || !sizeRegex.test(adSlot.size))
  ) {
    throw new Error("'adSlot.size' expected a valid size string.");
  }
}
