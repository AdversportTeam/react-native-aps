import type { AdNetwork } from './AdNetwork';

export interface AdNetworkInfo {
  adNetwork: AdNetwork;
  adNetworkProperties?: { [key: string]: string };
}
