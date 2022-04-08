import { TurboModule } from 'react-native';
import type { AdLoaderOptions } from '../types';
export interface AdLoaderModuleSpec extends TurboModule {
    loadAd: (options: AdLoaderOptions) => Promise<{
        [key: string]: string;
    }>;
}
declare const _default: AdLoaderModuleSpec | null;
export default _default;
