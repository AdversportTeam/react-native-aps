import type { AdLoaderOptions } from './AdLoaderOptions';

export interface AdLoaderInterface {
  loadAd: (options: AdLoaderOptions) => Promise<{ [key: string]: string }>;
}
