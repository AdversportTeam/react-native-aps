import { TurboModule } from 'react-native';
import type { AdLoaderOptions } from '../types';
/**
 * @internal
 */
export interface AdLoaderModuleSpec extends TurboModule {
    loadAd: (options: AdLoaderOptions) => Promise<{
        [key: string]: string;
    }>;
    skadnHelper: (name: string, info: string) => void;
}
declare const _default: AdLoaderModuleSpec | null;
export default _default;
