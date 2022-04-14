import { AdNetwork } from './AdNetwork';
export interface AdNetworkInfo {
    /**
     * The name of the primary ad server or mediator
     */
    adNetwork: AdNetwork;
    adNetworkProperties?: {
        [key: string]: string;
    };
}
export declare function validateAdNetworkInfo(adNetworkInfo: AdNetworkInfo): void;
