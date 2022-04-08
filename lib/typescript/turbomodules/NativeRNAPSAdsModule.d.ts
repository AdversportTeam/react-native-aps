import { TurboModule } from 'react-native';
import type { AdNetworkInfo } from '../types';
export interface AdsModuleSpec extends TurboModule {
    initialize: (appKey: string) => Promise<void>;
    setAdNetworkInfo: (adNetworkInfo: AdNetworkInfo) => void;
    setTestMode: (enabled: boolean) => void;
    setUseGeoLocation: (enabled: boolean) => void;
    addCustomAttribute: (key: string, value: string) => void;
    removeCustomAttribute: (key: string) => void;
}
declare const _default: AdsModuleSpec | null;
export default _default;
