import { TurboModule } from 'react-native';
import type { AdNetworkInfo, MRAIDPolicy } from '../types';
export interface AdsModuleSpec extends TurboModule {
    initialize: (appKey: string) => Promise<void>;
    setAdNetworkInfo: (adNetworkInfo: AdNetworkInfo) => void;
    setMRAIDSupportedVersions: (supportedVersions: string[]) => void;
    setMRAIDPolicy: (policy: MRAIDPolicy) => void;
    setTestMode: (enabled: boolean) => void;
    setUseGeoLocation: (enabled: boolean) => void;
    addCustomAttribute: (key: string, value: string) => void;
    removeCustomAttribute: (key: string) => void;
}
declare const _default: AdsModuleSpec | null;
export default _default;
