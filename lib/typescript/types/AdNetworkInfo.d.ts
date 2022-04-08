import { AdNetwork } from './AdNetwork';
export interface AdNetworkInfo {
    adNetwork: AdNetwork;
    adNetworkProperties?: {
        [key: string]: string;
    };
}
export declare function validateAdNetworkInfo(adNetworkInfo: AdNetworkInfo): void;
