export const AdNetwork = {
  GOOGLE_AD_MANAGER: 'GOOGLE_AD_MANAGER',
  ADMOB: 'ADMOB',
  AD_GENERATION: 'AD_GENERATION',
  IRON_SOURCE: 'IRON_SOURCE',
  MAX: 'MAX',
  NIMBUS: 'NIMBUS',
  OTHER: 'OTHER',
} as const;

export type AdNetwork = typeof AdNetwork[keyof typeof AdNetwork];

export function isAdNetwork(value: any): value is AdNetwork {
  return Object.values(AdNetwork).includes(value);
}
