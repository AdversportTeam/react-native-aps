export const AdType = {
  BANNER: 'banner',
  INTERSTITIAL: 'interstitial',
} as const;

export type AdType = typeof AdType[keyof typeof AdType];

export function isAdType(value: any): value is AdType {
  return Object.values(AdType).includes(value);
}
