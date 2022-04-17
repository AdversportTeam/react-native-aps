import { AdNetwork } from './AdNetwork';
/**
 * @public
 */
export interface AdNetworkInfo {
    /**
     * The name of the primary ad server or mediator
     */
    adNetwork: AdNetwork;
    adNetworkProperties?: {
        [key: string]: string;
    };
}
/**
 * @internal
 */
export declare function validateAdNetworkInfo(adNetworkInfo: AdNetworkInfo): void;
