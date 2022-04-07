import { AdNetwork, isAdNetwork } from './AdNetwork';

export interface AdNetworkInfo {
  adNetwork: AdNetwork;
  adNetworkProperties?: { [key: string]: string };
}

export function validateAdNetworkInfo(adNetworkInfo: AdNetworkInfo) {
  if (typeof adNetworkInfo !== 'object') {
    throw new Error("'adNetworkInfo' expected an object value");
  }
  if (!isAdNetwork(adNetworkInfo.adNetwork)) {
    throw new Error(
      "'adNetworkInfo.adNetwork' expected one of AdNetwork values"
    );
  }
  if (
    adNetworkInfo.adNetworkProperties &&
    typeof adNetworkInfo.adNetworkProperties !== 'object'
  ) {
    throw new Error(
      "'adNetworkInfo.adNetworkProperties' expected an object value"
    );
  }
}
